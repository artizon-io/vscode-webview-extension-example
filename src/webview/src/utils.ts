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
import { SymbolKind } from "./types";

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
