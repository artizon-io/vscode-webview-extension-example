import React, { useEffect } from "react";
import type { RawNode, CursorPosition } from "../../outline/types";
import vscodeApi from "./vscode-api";
import {
  cursorPositionsStore,
  getNodeData,
  isFilterWidgetVisibleStore,
  rawTreeStore,
  selectedNodeStore,
  inFocusStore,
  statusStore,
  treeStore,
} from "./store";
import { getNextVisibleNode, getPrevVisibleNode } from "./utils";
import OutlineTree from "./components/tree";
import { NodeID } from "./types";

const App = () => {
  const onMessage = (e: MessageEvent<any>) => {
    const { type, payload } = e.data;
    switch (type) {
      case "treeNodes": {
        rawTreeStore.setState(payload as RawNode[]);
        statusStore.setState("ready");
        break;
      }
      case "preparingTreeNodes":
      case "requireRefresh":
      case "noActiveDocument": {
        statusStore.setState(type);
        break;
      }
      case "cursorPositions": {
        cursorPositionsStore.setState(payload as CursorPosition[]);
        break;
      }
      case "setFilterSymbolsUIVisibility": {
        isFilterWidgetVisibleStore.setState(payload as boolean);
        break;
      }
      case "toggleFilterSymbolsUIVisibility": {
        isFilterWidgetVisibleStore.setState((state) => !state);
        break;
      }
    }
  };

  const onFocus = () => inFocusStore.setState(true);
  const onBlur = () => inFocusStore.setState(false);

  const onKeyDown = (e: KeyboardEvent) => {
    // If is able to capture keyboard events, set focus state to true
    inFocusStore.setState(true);

    switch (e.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "PageUp":
      case "PageDown":
        e.preventDefault();

        const selectedNode = selectedNodeStore.getState();
        const tree = treeStore.getState();
        if (tree.length === 0) return;

        const f = (key: string): NodeID => {
          if (!selectedNode) {
            // Focus on first/last node in the tree if no current selected node
            switch (key) {
              case "ArrowUp":
              case "PageUp":
                return getPrevVisibleNode(tree[tree.length - 1]);
              case "ArrowDown":
              case "PageDown":
                return getNextVisibleNode(tree[0]);
              default:
                throw Error("Invalid key");
            }
          }

          switch (key) {
            case "ArrowUp":
              return getPrevVisibleNode(selectedNode);
            case "ArrowDown":
              return getNextVisibleNode(selectedNode);
            case "PageUp":
              return [...Array(10)].reduce(
                (acc, _, __) => getPrevVisibleNode(acc),
                selectedNode
              );
            case "PageDown":
              return [...Array(10)].reduce(
                (acc, _, __) => getNextVisibleNode(acc),
                selectedNode
              );
            default:
              throw Error("Invalid key");
          }
        };

        selectedNodeStore.setState(f(e.key));
        break;
      default:
        return;
    }
  };

  useEffect(() => {
    window.addEventListener("message", onMessage);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKeyDown);

    const subscriptions = [
      inFocusStore.subscribe((isTreeInFocus) => {
        vscodeApi.postMessage({
          type: "setContext",
          payload: {
            focus: isTreeInFocus,
          },
        });
      }),
      selectedNodeStore.subscribe((nodeId) => {
        if (nodeId && inFocusStore.getState())
          vscodeApi.postMessage({
            type: "scrollToLine",
            payload: getNodeData(nodeId).range[0],
          });
      }),
    ];

    return () => subscriptions.forEach((sub) => sub());
  }, []);

  return <OutlineTree />;
};

export default App;
