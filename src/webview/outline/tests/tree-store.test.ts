import { expect, test } from "vitest";
import {
  cursorPositionsStore,
  getNodeData,
  nodesDataMap,
  rawTreeStore,
  selectedNodeStore,
  treeStore,
} from "../store";
import * as z from "zod";

test("treeStore", () => {
  expect(treeStore.getState()).toStrictEqual([]);
  expect(nodesDataMap).toStrictEqual(new Map());
  expect(cursorPositionsStore.getState()).toStrictEqual(null);
  expect(selectedNodeStore.getState()).toStrictEqual(null);

  // Setup

  const generateTreeSchema = (len: number) =>
    // @ts-ignore
    z.tuple(new Array(len).fill(z.string().uuid()));
  const nodeDataSchema = z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      range: z.array(z.number()).length(2),
      kind: z.number(),
      detail: z.string(),
      children: z.array(z.string().uuid()).length(0),
      parent: z.null(),
      nextSibling: z.null(),
      prevSibling: z.null(),
      belowCursor: z.literal(false),
      isSelected: z.literal(false),
      isChildSelected: z.literal(false),
      visible: z.boolean(),
      isChildVisible: z.boolean(),
    })
    .strict();

  // Updating rawTreeStore
  {
    rawTreeStore.setState([
      {
        name: "function-1",
        range: [0, 1],
        kind: 11, // function
        detail: "",
        children: [],
      },
      {
        name: "class-1",
        range: [0, 1],
        kind: 4, // class
        detail: "",
        children: [],
      },
    ]);

    const treeData = treeStore.getState();
    generateTreeSchema(2).parse(treeData);
    treeData.forEach((nodeId) => {
      const nodeStore = nodesDataMap.get(nodeId);
      if (!nodeStore) throw Error();
    });
    nodesDataMap.forEach((nodeStore) => {
      const nodeData = nodeStore.getState();

      switch (nodeData.name) {
        case "function-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[0]),
              nextSibling: z.literal(treeData[1]),
            })
            .parse(nodeData);
          break;
        case "class-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[1]),
              prevSibling: z.literal(treeData[0]),
            })
            .parse(nodeData);
          break;
        default:
          throw Error();
      }
    });
    expect(cursorPositionsStore.getState()).toStrictEqual(null);
    expect(selectedNodeStore.getState()).toStrictEqual(null);
  }

  // Updating rawTreeStore
  {
    rawTreeStore.setState([
      {
        name: "class-1",
        range: [0, 10],
        kind: 4, // class
        detail: "",
        children: [
          {
            name: "method-1",
            range: [5, 5],
            kind: 5, // method
            detail: "",
            children: [],
          },
        ],
      },
      {
        name: "function-1",
        range: [11, 20],
        kind: 11, // function
        detail: "",
        children: [],
      },
    ]);

    const treeData = treeStore.getState();
    generateTreeSchema(2).parse(treeData);
    treeData.forEach((nodeId) => {
      const nodeStore = nodesDataMap.get(nodeId);
      if (!nodeStore) throw Error();
    });
    nodesDataMap.forEach((nodeStore) => {
      const nodeData = nodeStore.getState();

      switch (nodeData.name) {
        case "class-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[0]),
              nextSibling: z.literal(treeData[1]),
              children: z.tuple([z.string().uuid()]),
            })
            .parse(nodeData);
          break;
        case "method-1":
          nodeDataSchema
            .extend({
              id: z.literal(getNodeData(treeData[0]).children[0]),
              parent: z.literal(treeData[0]),
            })
            .parse(nodeData);
          break;
        case "function-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[1]),
              prevSibling: z.literal(treeData[0]),
            })
            .parse(nodeData);
          break;
        default:
          throw Error();
      }
    });
    expect(cursorPositionsStore.getState()).toStrictEqual(null);
    expect(selectedNodeStore.getState()).toStrictEqual(null);
  }

  // Updating cursorPositions
  {
    cursorPositionsStore.setState([5, 15]);

    expect(cursorPositionsStore.getState()).toStrictEqual([5, 15]);

    const treeData = treeStore.getState();
    generateTreeSchema(2).parse(treeData);
    treeData.forEach((nodeId) => {
      const nodeStore = nodesDataMap.get(nodeId);
      if (!nodeStore) throw Error();
    });
    expect(selectedNodeStore.getState()).toStrictEqual(
      getNodeData(treeData[0]).children[0]
    );
    nodesDataMap.forEach((nodeStore) => {
      const nodeData = nodeStore.getState();

      switch (nodeData.name) {
        case "class-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[0]),
              nextSibling: z.literal(treeData[1]),
              children: z.tuple([z.string().uuid()]),
              belowCursor: z.literal(true),
              isSelected: z.literal(false),
              isChildSelected: z.literal(true),
            })
            .parse(nodeData);
          break;
        case "method-1":
          nodeDataSchema
            .extend({
              id: z.literal(getNodeData(treeData[0]).children[0]),
              parent: z.literal(treeData[0]),
              belowCursor: z.literal(true),
              isSelected: z.literal(true),
              isChildSelected: z.literal(false),
            })
            .parse(nodeData);
          break;
        case "function-1":
          nodeDataSchema
            .extend({
              id: z.literal(treeData[1]),
              prevSibling: z.literal(treeData[0]),
              belowCursor: z.literal(true),
              isSelected: z.literal(false),
              isChildSelected: z.literal(false),
            })
            .parse(nodeData);
          break;
        default:
          throw Error();
      }
    });
  }
});
