import { createObjectStore, subscribeWithSelector } from "@artizon/store";
import vscode from "vscode";

interface OutlineStore {
  activeDocument?: vscode.TextDocument;
  activeDocumentChangeId?: string;
  currentSelections?: readonly vscode.Selection[];
}

export const outlineStore = subscribeWithSelector(
  createObjectStore<OutlineStore>({
    activeDocument: undefined,
    activeDocumentChangeId: undefined,
    currentSelections: undefined,
  })
);
