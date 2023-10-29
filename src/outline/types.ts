import type vscode from "vscode";

export type RawNode = {
  name: string;
  kind: vscode.SymbolKind;
  detail: string;
  children: RawNode[];
  range: [number, number];
};

export type CursorPosition = number;
