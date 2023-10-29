import { RawNode } from "../../outline/types";

export enum SymbolKind {
  File = 0,
  Module = 1,
  Namespace = 2,
  Package = 3,
  Class = 4,
  Method = 5,
  Property = 6,
  Field = 7,
  Constructor = 8,
  Enum = 9,
  Interface = 10,
  Function = 11,
  Variable = 12,
  Constant = 13,
  String = 14,
  Number = 15,
  Boolean = 16,
  Array = 17,
  Object = 18,
  Key = 19,
  Null = 20,
  EnumMember = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25,
}

export type NodeID = string;

export interface NodeData extends Omit<RawNode, "children"> {
  id: NodeID;
  children: NodeID[];
  nextSibling: NodeID | null;
  prevSibling: NodeID | null;
  parent: NodeID | null;
  isChildSelected: boolean;
  isSelected: boolean;
  belowCursor: boolean;
  isChildVisible: boolean;
  visible: boolean;
}

export type Filters = {
  name: RegExp | null;
  kind: RegExp | null;
};
