import { createObjectStore, subscribeWithSelector } from "@artizon/store";
import vscode from "vscode";

export const store = subscribeWithSelector(
  createObjectStore<{
    activeDocument?: vscode.TextDocument;
    currentSelections?: readonly vscode.Selection[];
  }>({
    activeDocument: undefined,
    currentSelections: undefined,
  })
);
