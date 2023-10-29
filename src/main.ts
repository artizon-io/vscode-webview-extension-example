import vscode from "vscode";
import { onActivate } from "./outline";

export function activate(context: vscode.ExtensionContext) {
  onActivate(context);
}

export function deactivate() {}
