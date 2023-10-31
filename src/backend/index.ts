import vscode, { Disposable } from "vscode";
import { window, workspace } from "vscode";
import { EXTENSION_NAME, VIEW_NAME } from "./config";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { store } from "./store";
import { html } from "./utils";

export class WebviewProvider implements vscode.WebviewViewProvider {
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

    const storeUnsubscribers = [
      store.subscribe(
        (activeDocument, prevActiveDocument) => {
          this.notifyWebview({
            type: "activeDocument",
            payload: activeDocument,
          });
        },
        (state) => state.activeDocument,
        false
      ),
      store.subscribe(
        (currentSelections) => {
          this.notifyWebview({
            type: "currentSelections",
            payload: currentSelections,
          });
        },
        (state) => state.currentSelections,
        false
      ),
    ];

    this.context.subscriptions.push(
      webviewView.onDidDispose(() => {
        this.webviewView = undefined;
        storeUnsubscribers.forEach((unsubscriber) => unsubscriber());
      })
    );

    this.render();
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
            href="${this.getWebviewUri("dist/webview/tailwind.css")}"
          />
          <title>${EXTENSION_NAME}</title>
        </head>
        <body>
          <div id="root"></div>
          <script
            type="module"
            nonce="${nonce}"
            src="${this.getWebviewUri("dist/webview/index.js")}"
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

  private handleWebviewMessage = (message: any) => {
    const { type, payload } = message;

    switch (type) {
      case "example-message-type":
        return;
    }
  };
}

function reloadOnConfigChange(context: vscode.ExtensionContext): Disposable {
  let disposables: Disposable[] = [];

  return workspace.onDidChangeConfiguration((e) => {
    if (e.affectsConfiguration(EXTENSION_NAME)) {
      disposables.forEach((disposable) => disposable.dispose());

      disposables = [
        vscode.commands.registerCommand(
          `${EXTENSION_NAME}.example-command1`,
          () => {}
        ),
        vscode.commands.registerCommand(
          `${EXTENSION_NAME}.example-command2`,
          () => {}
        ),
      ];
      context.subscriptions.push(...disposables);
    }
  });
}

export const onActivate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    ...[
      reloadOnConfigChange(context),

      // Events to handle
      // I prefer first propagate the change into the store and subscribe the changes to the store
      window.onDidChangeActiveTextEditor((e) => {}),
      window.onDidChangeTextEditorSelection((e) => {}),
      window.onDidChangeTextEditorVisibleRanges((e) => {}),
      window.onDidChangeVisibleTextEditors((e) => {}),

      // Commands
      vscode.commands.registerCommand(`${EXTENSION_NAME}.command-id`, () => {}),

      window.registerWebviewViewProvider(
        VIEW_NAME,
        new WebviewProvider(context)
      ),
    ]
  );
};
