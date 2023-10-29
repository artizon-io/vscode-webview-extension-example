import vscode from "vscode";
import { window, workspace } from "vscode";
import { outlineStore } from "./webviewProvider/store";
import { OutlineWebviewProvider } from "./webviewProvider";
import { v4 as uuid } from "uuid";
import { VIEW_NAME } from "./config";

export const onActivate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    ...[
      window.registerWebviewViewProvider(
        VIEW_NAME,
        new OutlineWebviewProvider(context)
      ),

      window.onDidChangeActiveTextEditor((e) => {
        const activeDocument = window.activeTextEditor?.document;

        if (!activeDocument)
          return outlineStore.setState({
            activeDocument: undefined,
            activeDocumentChangeId: undefined,
          });

        outlineStore.setState({
          activeDocument,
          activeDocumentChangeId: uuid(),
        });
      }),

      window.onDidChangeTextEditorSelection((e) => {
        // Notify the webview only if the selection change was triggered by user
        if (e.textEditor.document !== window.activeTextEditor?.document) return;
        if (e.kind === vscode.TextEditorSelectionChangeKind.Command) return;

        outlineStore.setState({ currentSelections: e.selections });
      }),

      workspace.onDidChangeTextDocument((e) => {
        const activeDocument = e.document;

        // vscode.executeDocumentSymbolProvider
        // https://code.visualstudio.com/api/references/commands

        if (activeDocument !== window.activeTextEditor?.document) return;

        if (activeDocument !== outlineStore.getState().activeDocument)
          throw Error("Active document mismatch");

        outlineStore.setState({ activeDocumentChangeId: uuid() });
      }),

      // TODO: sync visible ranges to webview
      // window.onDidChangeTextEditorVisibleRanges((e) => {
      // }),
    ]
  );
};
