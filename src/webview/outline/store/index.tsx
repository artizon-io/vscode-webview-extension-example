import type { CursorPosition, RawNode } from "../../../outline/types";
import { Filters, NodeData, NodeID, SymbolKind } from "../types";
import {
  getSymbolName,
  isPositionEnclosedByRange,
  parseFiltersText,
} from "../utils";
import {
  derive,
  createSimpleStore,
  createObjectStore,
  ObjectStore,
} from "@artizon/store";
import { v4 as uuidv4 } from "uuid";

/**
 * Stores the raw tree data received from the extension.
 */
export const rawTreeStore = createSimpleStore<RawNode[]>([]);

/**
 * Stores the current cursor positions (if any) received from the extension.
 */
export const cursorPositionsStore = createSimpleStore<CursorPosition[] | null>(
  null
);

/**
 * Stores the current input value of the filter fidget.
 */
export const filterTextStore = createSimpleStore<string>("");

/**
 * Stores true if the webview is in user focus.
 */
export const inFocusStore = createSimpleStore<boolean>(false);

/**
 * Stores the current status of the webview.
 */
export const statusStore = createSimpleStore<
  "preparingTreeNodes" | "requireRefresh" | "noActiveDocument" | "ready"
>("noActiveDocument");

/**
 * Stores true if the filter widget is visible.
 */
export const isFilterWidgetVisibleStore = createSimpleStore<boolean>(true);

/**
 * Stores the currently selected node (if any).
 */
export const selectedNodeStore = createSimpleStore<NodeID | null>(null);

type NodeDataStore = ObjectStore<NodeData>;

/**
 * Stores a mapping of node IDs to their respective data stores.
 */
export let nodesDataMap = new Map<NodeID, NodeDataStore>();

/**
 * Get the respective data store for a node.
 * @throws If the node does not exist in the store.
 */
export const getNodeDataStore = (nodeId: NodeID): NodeDataStore => {
  const nodeDataStore = nodesDataMap.get(nodeId);
  if (!nodeDataStore)
    throw Error(`Node with ID ${nodeId} does not exist in nodeData`);
  return nodeDataStore;
};

/**
 * Get the curernt state of the respective data store for a node.
 * @throws If the node does not exist in the store.
 */
export const getNodeData = (nodeId: NodeID): Readonly<NodeData> => {
  return getNodeDataStore(nodeId).getState();
};

/**
 * Stores the tree data.
 * Tree data is derived from the raw tree data. It setups properties such as `nextSibling` and `prevSibling`.
 * Upon update, it will also reset and update `nodesDataMap`
 */
export const treeStore = derive<NodeID[], [typeof rawTreeStore]>(
  [rawTreeStore],
  ([rawTreeNodes]) => {
    // Reset nodeDataStore
    nodesDataMap = new Map<NodeID, NodeDataStore>();

    function initData(rawNode: RawNode, parentNodeId: NodeID | null): NodeID {
      const nodeId = uuidv4();
      nodesDataMap.set(
        nodeId,
        createObjectStore<NodeData>({
          id: nodeId,
          parent: parentNodeId,
          nextSibling: null,
          prevSibling: null,
          detail: rawNode.detail,
          kind: rawNode.kind,
          name: rawNode.name,
          range: rawNode.range,
          belowCursor: false,
          isChildSelected: false,
          isSelected: false,
          children: rawNode.children.map((childNode) =>
            initData(childNode, nodeId)
          ),
          isChildVisible: true,
          visible: true,
        })
      );
      return nodeId;
    }

    function updateSiblings(siblings: NodeID[]) {
      siblings.forEach((siblingId, index) => {
        const nodeStore = getNodeDataStore(siblingId);

        nodeStore.setState({
          prevSibling: siblings[index - 1] ?? null,
          nextSibling: siblings[index + 1] ?? null,
        });

        updateSiblings(nodeStore.getState().children);
      });
    }

    const tree = rawTreeNodes.map((node) => initData(node, null));
    updateSiblings(tree);
    return tree;
  }
);

/**
 * Stores the current filters by parsing the filters text retrieved from `filterTextStore`.
 */
export const filtersStore = derive<Filters | null, [typeof filterTextStore]>(
  [filterTextStore],
  ([filtersText]) => parseFiltersText(filtersText)
);

/**
 * When `treeStore` or `cursorPositionsStore` updates, update the `belowCursor` property of each node and update `selectedNodeStore`.
 */
derive<void, [typeof treeStore, typeof cursorPositionsStore]>(
  [treeStore, cursorPositionsStore],
  ([tree, cursorPositions]) => {
    // Reset all node's belowCursor properties
    nodesDataMap.forEach((nodeStore) =>
      nodeStore.setState({
        belowCursor: false,
      })
    );

    function updateBelowCursor(
      nodes: readonly NodeID[],
      cursorPositions: readonly number[]
    ) {
      nodes.forEach((nodeId) => {
        const store = getNodeDataStore(nodeId);
        store.setState({
          belowCursor: cursorPositions.some((cursorPosition) =>
            isPositionEnclosedByRange(cursorPosition, store.getState().range)
          ),
        });
        updateBelowCursor(store.getState().children, cursorPositions);
      });
    }

    if (cursorPositions) updateBelowCursor(tree, cursorPositions);

    function getNewSelectedNode(tree: readonly NodeID[]) {
      function r(nodes: readonly NodeID[]): NodeID | null {
        return nodes.reduce<NodeID | null>((selectedNodeId, nodeId) => {
          if (selectedNodeId) return selectedNodeId; // Limit to at most 1 selected node

          const nodeStore = getNodeDataStore(nodeId);

          if (!nodeStore.getState().belowCursor) return null;

          const childrenSelectedNodeId = r(nodeStore.getState().children);

          // If none of the children are selected
          if (!childrenSelectedNodeId) return nodeId;
          else return childrenSelectedNodeId;
        }, null);
      }

      return r(tree);
    }

    selectedNodeStore.setState(getNewSelectedNode(tree));
  }
);

/**
 * When `treeStore` or `filtersStore` updates, update the `visible` and `isChildVisible` properties of each node.
 */
derive<void, [typeof treeStore, typeof filtersStore]>(
  [treeStore, filtersStore],
  ([tree, filters]) => {
    // Reset all node's visibibility properties
    nodesDataMap.forEach((nodeStore) =>
      nodeStore.setState({
        visible: true,
        isChildVisible: true,
      })
    );

    if (!filters) return;

    const isVisible = (nodeData: NodeData, filters: Filters): boolean => {
      if (!filters.name || !filters.kind) return true;

      const filterMatch =
        nodeData.name.match(filters.name) ||
        getSymbolName({ kind: nodeData.kind as SymbolKind }).match(
          filters.kind
        );

      return !!filterMatch;
    };

    const isChildVisible = (nodeData: NodeData): boolean => {
      return (
        nodeData.children.filter((childNodeId) => {
          const childNodeData = getNodeData(childNodeId);
          return childNodeData.isChildVisible || childNodeData.visible;
        }).length > 0
      );
    };

    const updateHide = (nodes: readonly NodeID[]) => {
      nodes.forEach((nodeId) => {
        const nodeStore = getNodeDataStore(nodeId);
        updateHide(nodeStore.getState().children);
        nodeStore.setState({
          visible: isVisible(nodeStore.getState(), filters),
          isChildVisible: isChildVisible(nodeStore.getState()),
        });
      });
    };

    return updateHide(tree);
  }
);

/**
 * When `treeStore` or `selectedNodeStore` updates, update the `isSelected` and `isChildSelected` properties of each node.
 */
derive<void, [typeof treeStore, typeof selectedNodeStore]>(
  [treeStore, selectedNodeStore],
  ([tree, selectedNodeId]) => {
    nodesDataMap.forEach((nodeStore) =>
      nodeStore.setState({
        isSelected: false,
        isChildSelected: false,
      })
    );

    if (!selectedNodeId) return;

    let nodeStore = getNodeDataStore(selectedNodeId);
    let parent = nodeStore.getState().parent;
    nodeStore.setState({ isSelected: true });

    while (parent) {
      nodeStore = getNodeDataStore(parent);
      parent = nodeStore.getState().parent;
      nodeStore.setState({ isChildSelected: true });
    }
  }
);
