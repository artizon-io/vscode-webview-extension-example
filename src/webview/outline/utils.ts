import {
  VscSymbolClass,
  VscSymbolProperty,
  VscSymbolMethod,
  VscSymbolVariable,
  VscSymbolString,
  VscSymbolFile,
  VscSymbolEnum,
  VscSymbolConstant,
  VscSymbolBoolean,
  VscSymbolArray,
  VscSymbolEnumMember,
  VscSymbolEvent,
  VscSymbolField,
  VscSymbolInterface,
  VscSymbolKey,
  VscSymbolNamespace,
  VscSymbolNumeric,
  VscSymbolMisc,
  VscSymbolOperator,
  VscSymbolStructure,
  VscSymbolParameter,
} from "react-icons/vsc";
import { Filters, NodeData, NodeID, SymbolKind } from "./types";
import { getNodeData } from "./store";

export const getSymbolName = ({ kind }: { kind: SymbolKind }) => {
  switch (kind) {
    case SymbolKind.Class:
      return "Class";
    case SymbolKind.Property:
      return "Property";
    case SymbolKind.Function:
      return "Function";
    case SymbolKind.Method:
      return "Method";
    case SymbolKind.Constructor:
      return "Constructor";
    case SymbolKind.Variable:
      return "Variable";
    case SymbolKind.String:
      return "String";
    case SymbolKind.File:
      return "File";
    case SymbolKind.Enum:
      return "Enum";
    case SymbolKind.Array:
      return "Array";
    case SymbolKind.Boolean:
      return "Boolean";
    case SymbolKind.Constant:
      return "Constant";
    case SymbolKind.EnumMember:
      return "EnumMember";
    case SymbolKind.Event:
      return "Event";
    case SymbolKind.Field:
      return "Field";
    case SymbolKind.Interface:
      return "Interface";
    case SymbolKind.Key:
      return "Key";
    case SymbolKind.Namespace:
      return "Namespace";
    case SymbolKind.Number:
      return "Number";
    case SymbolKind.Operator:
      return "Operator";
    case SymbolKind.Struct:
      return "Struct";
    case SymbolKind.TypeParameter:
      return "Parameter";
    case SymbolKind.Package:
      return "Package";
    case SymbolKind.Object:
      return "Object";
    case SymbolKind.Module:
      return "Module";
    case SymbolKind.Null:
      return "Null";
    default:
      throw Error("Unexpected symbol kind " + kind);
  }
};

export const getSymbolIcon = ({ kind }: { kind: SymbolKind }) => {
  switch (kind) {
    case SymbolKind.Class:
      return VscSymbolClass;
    case SymbolKind.Property:
      return VscSymbolProperty;
    case SymbolKind.Function:
    case SymbolKind.Method:
    case SymbolKind.Constructor:
      return VscSymbolMethod;
    case SymbolKind.Variable:
      return VscSymbolVariable;
    case SymbolKind.String:
      return VscSymbolString;
    case SymbolKind.File:
      return VscSymbolFile;
    case SymbolKind.Enum:
      return VscSymbolEnum;
    case SymbolKind.Array:
      return VscSymbolArray;
    case SymbolKind.Boolean:
      return VscSymbolBoolean;
    case SymbolKind.Constant:
      return VscSymbolConstant;
    case SymbolKind.EnumMember:
      return VscSymbolEnumMember;
    case SymbolKind.Event:
      return VscSymbolEvent;
    case SymbolKind.Field:
      return VscSymbolField;
    case SymbolKind.Interface:
      return VscSymbolInterface;
    case SymbolKind.Key:
      return VscSymbolKey;
    case SymbolKind.Namespace:
      return VscSymbolNamespace;
    case SymbolKind.Number:
      return VscSymbolNumeric;
    case SymbolKind.Operator:
      return VscSymbolOperator;
    case SymbolKind.Struct:
      return VscSymbolStructure;
    case SymbolKind.TypeParameter:
      return VscSymbolParameter;
    case SymbolKind.Package:
    case SymbolKind.Object:
    case SymbolKind.Module:
    case SymbolKind.Null:
      return VscSymbolMisc;
    default:
      throw Error("Unexpected symbol kind " + kind);
  }
};

export const getSymbolColor = ({ kind }: { kind: SymbolKind }) => {
  switch (kind) {
    case SymbolKind.Class:
      return "var(--vscode-symbolIcon-classForeground)";
    case SymbolKind.Property:
      return "var(--vscode-symbolIcon-propertyForeground)";
    case SymbolKind.Function:
      return "var(--vscode-symbolIcon-functionForeground)";
    case SymbolKind.Method:
      return "var(--vscode-symbolIcon-methodForeground)";
    case SymbolKind.Constructor:
      return "var(--vscode-symbolIcon-constructorForeground)";
    case SymbolKind.Variable:
      return "var(--vscode-symbolIcon-variableForeground)";
    case SymbolKind.String:
      return "var(--vscode-symbolIcon-stringForeground)";
    case SymbolKind.File:
      return "var(--vscode-symbolIcon-fileForeground)";
    case SymbolKind.Enum:
      return "var(--vscode-symbolIcon-enumeratorForeground)";
    case SymbolKind.Array:
      return "var(--vscode-symbolIcon-arrayForeground)";
    case SymbolKind.Boolean:
      return "var(--vscode-symbolIcon-booleanForeground)";
    case SymbolKind.Constant:
      return "var(--vscode-symbolIcon-constantForeground)";
    case SymbolKind.EnumMember:
      return "var(--vscode-symbolIcon-enumeratorMemberForeground)";
    case SymbolKind.Event:
      return "var(--vscode-symbolIcon-eventForeground)";
    case SymbolKind.Field:
      return "var(--vscode-symbolIcon-fieldForeground)";
    case SymbolKind.Interface:
      return "var(--vscode-symbolIcon-interfaceForeground)";
    case SymbolKind.Key:
      return "var(--vscode-symbolIcon-keyForeground)";
    case SymbolKind.Namespace:
      return "var(--vscode-symbolIcon-namespaceForeground)";
    case SymbolKind.Number:
      return "var(--vscode-symbolIcon-numberForeground)";
    case SymbolKind.Operator:
      return "var(--vscode-symbolIcon-operatorForeground)";
    case SymbolKind.Struct:
      return "var(--vscode-symbolIcon-structForeground)";
    case SymbolKind.TypeParameter:
      return "var(--vscode-symbolIcon-typeParameterForeground)";
    case SymbolKind.Package:
      return "var(--vscode-symbolIcon-packageForeground)";
    case SymbolKind.Object:
      return "var(--vscode-symbolIcon-objectForeground)";
    case SymbolKind.Module:
      return "var(--vscode-symbolIcon-moduleForeground)";
    case SymbolKind.Null:
      return "var(--vscode-symbolIcon-nullForeground)";
    default:
      throw Error("Unexpected symbol kind " + kind);
  }
};

/**
 * Checks if a position is enclosed by a range
 */
export const isPositionEnclosedByRange = (
  position: number,
  range: [number, number]
) => position >= range[0] && position <= range[1];

/**
 * Return the range of the input node and make sure the range is continuous across the siblings.
 */
export const getContinuousRange = (node: NodeData): [number, number] => {
  const prev = node.prevSibling;
  const next = node.nextSibling;

  return [
    !prev
      ? node.range[0]
      : Math.min(getNodeData(prev).range[1] + 1, node.range[0]),
    !next
      ? node.range[1]
      : Math.max(getNodeData(next).range[0] - 1, node.range[1]),
  ];
};

/**
 * Parse the filter input
 */
export const parseFiltersText = (filtersText: string): Filters | null => {
  if (filtersText.length === 0) return null;

  const filters = filtersText
    .split(",")
    .map((filter) => filter.trim())
    .filter((filter) => filter.length >= 0);

  return {
    name: new RegExp(filters.join("|"), "i"),
    kind: new RegExp(filters.join("|"), "i"),
  };
};

/**
 * Get the previous node in the tree
 */
export const getPrevNode = (nodeId: NodeID): NodeID => {
  const node = getNodeData(nodeId);

  const getRightMostDescendant = (nodeId: NodeID): NodeID => {
    let node = getNodeData(nodeId);
    while (node.children.length > 0) {
      node = getNodeData(node.children[node.children.length - 1]);
    }
    return node.id;
  };

  // Return parent if no previous sibling, otherwise return the right most descendant of the previous sibling
  if (!node.prevSibling) return node.parent ?? nodeId;
  else return getRightMostDescendant(node.prevSibling);
};

/**
 * Get the next node in the tree
 */
export const getNextNode = (nodeId: NodeID): NodeID => {
  let node = getNodeData(nodeId);

  // Return the first child if it exists
  if (node.children.length > 0) return node.children[0];

  // Return the next sibling of the ancestor
  while (!node.nextSibling) {
    if (!node.parent) return nodeId;

    node = getNodeData(node.parent);
  }

  return node.nextSibling;
};

/**
 * Get next or previous visible node in the tree
 * @param next Whether to get the next or previous node
 */
export const getNextOrPrevVisibleNode = (
  nodeId: NodeID,
  next: boolean
): NodeID => {
  let prevNode = nodeId;
  let node = nodeId;
  node = next ? getNextNode(node) : getPrevNode(node);

  while (!getNodeData(node).visible) {
    prevNode = node;
    node = next ? getNextNode(node) : getPrevNode(node);

    // If we have traversed til the end of the tree but still isn't a visible node
    if (prevNode === node) return nodeId;
  }
  return node;
};

/**
 * Get the next visible node in the tree
 */
export const getNextVisibleNode = (nodeId: NodeID) =>
  getNextOrPrevVisibleNode(nodeId, true);

/**
 * Get the previous visible node in the tree
 */
export const getPrevVisibleNode = (nodeId: NodeID) =>
  getNextOrPrevVisibleNode(nodeId, false);
