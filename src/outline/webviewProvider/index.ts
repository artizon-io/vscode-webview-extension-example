import vscode from "vscode";
import { window, workspace } from "vscode";
import { outlineStore } from "./store";
import { html } from "./utils";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { RawNode } from "../types";
import { EXTENSION_DISPLAY_NAME, EXTENSION_NAME, VIEW_NAME } from "../config";

export class OutlineWebviewProvider implements vscode.WebviewViewProvider {
  private webviewView: vscode.WebviewView | undefined;

  constructor(private context: vscode.ExtensionContext) {
    this.context = context;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    viewResolveContext: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this.webviewView = webviewView;

    this.webviewView.webview.options = {
      enableScripts: true,
    };

    this.context.subscriptions.push(
      webviewView.onDidDispose(() => {
        this.webviewView = undefined;
      }),

      // When visibility of webview changes
      webviewView.onDidChangeVisibility(() => {
        const activeDocument = window.activeTextEditor?.document;

        if (webviewView.visible && activeDocument) {
          outlineStore.setState({
            activeDocument,
            activeDocumentChangeId: uuid(),
          });
        } else {
          outlineStore.setState({
            activeDocument: undefined,
            activeDocumentChangeId: undefined,
          });
        }
      }),

      // Receive message from webview
      webviewView.webview.onDidReceiveMessage(this.handleWebviewMessage),

      workspace.onDidChangeConfiguration((e) => {
        // Implement config reloading once there is a need for it
        if (e.affectsConfiguration(EXTENSION_NAME)) null;
      })
    );

    this.registerCommands();

    // Load the webview into the view sandbox
    this.render();

    this.reactToStoreChange();

    // Set the active document when extension is first loaded (onChange events haven't triggered yet)
    const activeDocument = window.activeTextEditor?.document;
    if (activeDocument) {
      outlineStore.setState({
        activeDocument,
        activeDocumentChangeId: uuid(),
      });
    }
  }

  private registerCommands() {
    this.context.subscriptions.push(
      ...[
        vscode.commands.registerCommand(`${EXTENSION_NAME}.reload`, () =>
          this.resendTreeNodesToWebview()
        ),
        vscode.commands.registerCommand(
          `${EXTENSION_NAME}.show-filter-widget`,
          () => this.notifyWebviewSetFilterSymbolsUIVisibility(true)
        ),
        vscode.commands.registerCommand(
          `${EXTENSION_NAME}.hide-filter-widget`,
          () => this.notifyWebviewSetFilterSymbolsUIVisibility(false)
        ),
        vscode.commands.registerCommand(
          `${EXTENSION_NAME}.toggle-filter-widget`,
          () => this.notifyWebviewToggleFilterSymbolsUIVisibility()
        ),
      ]
    );
  }

  private render() {
    const webview = this.webviewView?.webview;
    if (!webview) throw new Error("Webview not found");

    const nonce = uuid();

    webview.html = html`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'none'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource} 'nonce-${nonce}'; style-src ${webview.cspSource};"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <link
            rel="stylesheet"
            href="${this.getWebviewUri("dist/webview/outline/tailwind.css")}"
          />
          <title>Artizon Motion Outline</title>
        </head>
        <body>
          <div id="root"></div>
          <script
            type="module"
            nonce="${nonce}"
            src="${this.getWebviewUri("dist/webview/outline/index.js")}"
          ></script>
        </body>
      </html>
    `;
  }

  /**
   * Sends a message to the webview
   * @param payload Payload to be sent to the webview
   */
  private notifyWebview(payload: any) {
    const webview = this.webviewView?.webview;
    if (!webview)
      throw new Error("Webview not found. Cannot post message to webview.");

    webview.postMessage(payload);
  }

  /**
   * Get the webview uri for a file
   * @param filePath Path to the file relative to the extension root
   * @returns
   */
  private getWebviewUri(filePath: string) {
    const webview = this.webviewView?.webview;
    if (!webview)
      throw new Error("Webview not found. Cannot get webview URI for file.");

    const fileFullPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      ...filePath.split("/")
    );

    if (!fs.existsSync(fileFullPath.fsPath))
      throw new Error("File not found " + fileFullPath.fsPath);

    return webview.asWebviewUri(fileFullPath);
  }

  /**
   * React to changes in the store and propagates any updates to the webview
   */
  private reactToStoreChange() {
    const webviewView = this.webviewView;

    if (!webviewView) throw Error("Webview not found");

    const subscriptionHandles = [
      outlineStore.subscribe(
        // FIX: store type not inferred correctly
        (currentSelections: readonly vscode.Selection[] | undefined) => {
          this.notifyWebviewCursorPositions(currentSelections);
        },
        (state) => state.currentSelections,
        false
      ),

      outlineStore.subscribe(
        (
          { activeDocument, activeDocumentChangeId },
          {
            activeDocument: prevActiveDocument,
            activeDocumentChangeId: prevActiveDocumentChangeId,
          }
        ) => {
          if (!activeDocument) {
            this.notifyWebviewNoActiveDocument();
            return;
          }

          if (
            !!activeDocumentChangeId &&
            activeDocumentChangeId !== prevActiveDocumentChangeId
          ) {
            this.notifyWebviewTreeNodes(activeDocument);
            return;
          }
        },
        (state) => ({
          activeDocumentChangeId: state.activeDocumentChangeId,
          activeDocument: state.activeDocument,
        }),
        true
      ),
    ];

    this.context.subscriptions.push(
      webviewView.onDidDispose(() => {
        subscriptionHandles.forEach((handle) => handle());
      })
    );
  }

  private async notifyWebviewTreeNodes(activeDocument: vscode.TextDocument) {
    const docSymbols = await vscode.commands.executeCommand<
      vscode.DocumentSymbol[] | undefined
    >("vscode.executeDocumentSymbolProvider", activeDocument.uri);

    // FIX: more robust way to handle this
    // Symbol provider might still be unavailable when the vscode.executeDocumentSymbolProvider
    // API is being executed
    // https://github.com/microsoft/vscode/issues/169566
    if (!docSymbols) {
      this.notifyWebviewRequireReload();
      // If symbols aren't available, queue a retry
      setTimeout(() => this.notifyWebviewTreeNodes(activeDocument), 250);
      return;
    }

    // TODO: optimize by making treeNodes a Transferrable
    this.notifyWebview({
      type: "treeNodes",
      payload: getTreeNodes(docSymbols),
    });
  }

  private notifyWebviewPreparingTreeNodes() {
    this.notifyWebview({
      type: "preparingTreeNodes",
    });
  }

  private notifyWebviewRequireReload() {
    this.notifyWebview({
      type: "requireRefresh",
    });
  }

  private notifyWebviewNoActiveDocument() {
    this.notifyWebview({
      type: "noActiveDocument",
    });
  }

  private notifyWebviewCursorPositions(
    currentSelections?: readonly vscode.Selection[]
  ) {
    this.notifyWebview({
      type: "cursorPositions",
      payload: currentSelections
        ? currentSelections.map(({ active }) => active.line)
        : [],
    });
  }

  private resendTreeNodesToWebview() {
    const activeDocument = outlineStore.getState().activeDocument;
    if (!activeDocument) {
      vscode.window.showErrorMessage(
        `${EXTENSION_DISPLAY_NAME}: No active text document`
      );
      return;
    }

    this.notifyWebviewTreeNodes(activeDocument);
  }

  private notifyWebviewSetFilterSymbolsUIVisibility(show: boolean) {
    this.notifyWebview({
      type: "setFilterSymbolsUIVisibility",
      payload: show,
    });
  }

  private notifyWebviewToggleFilterSymbolsUIVisibility() {
    this.notifyWebview({
      type: "toggleFilterSymbolsUIVisibility",
    });
  }

  private handleWebviewMessage = (message: any) => {
    const { type, payload } = message;

    switch (type) {
      case "scrollToLine": {
        const activeEditor = window.activeTextEditor;
        if (!activeEditor) return;

        const lineNumber = payload;
        const lineRange = activeEditor.document.lineAt(lineNumber).range;
        const endOfLine = lineRange.end;
        const lineSelection = new vscode.Selection(endOfLine, endOfLine);

        activeEditor.revealRange(
          lineRange,
          vscode.TextEditorRevealType.InCenter
        );

        activeEditor.selections = [lineSelection];
        break;
      }
      case "retry": {
        this.resendTreeNodesToWebview();
        break;
      }
      case "setContext": {
        const { focus } = payload as {
          focus?: boolean;
        };
        if (focus !== undefined)
          vscode.commands.executeCommand(
            "setContext",
            `${VIEW_NAME}.focus`,
            focus
          );
      }
    }
  };
}

export const getTreeNodes = (
  docSymbols: vscode.DocumentSymbol[]
): RawNode[] => {
  return docSymbols
    .sort((node1, node2) =>
      node1.range.start.line < node2.range.start.line ? -1 : +1
    )
    .map(({ name, kind, detail, children, range }) => ({
      name,
      kind,
      detail,
      children: getTreeNodes(children),
      range: [range.start.line, range.end.line],
    }));
};
