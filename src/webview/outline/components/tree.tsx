import React from "react";
import { twJoin } from "tailwind-merge";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import vscodeApi from "../vscode-api";
import { TbRefresh } from "react-icons/tb";
import FilterWidget from "./filter-widget";
import OutlineTreeNodes from "./tree-nodes";
import { statusStore, treeStore } from "../store";
import { useStore } from "@artizon/store";

const OutlineTree: React.FC = () => {
  // TODO: virtualization
  const treeState = useStore(statusStore);
  const tree = useStore(treeStore);

  const Main = () => {
    if (treeState === "preparingTreeNodes")
      return <VSCodeProgressRing className="h-5 w-5" />;
    else if (treeState === "requireRefresh")
      return (
        <button
          className={`
            flex flex-row gap-1 items-center
            px-3 py-2 rounded-md
            border border-button-hoverBackground
            text-button-hoverBackground
            bg-transparent hover:bg-button-hoverBackground
          `}
          onClick={(e) =>
            vscodeApi.postMessage({
              type: "retry",
            })
          }
        >
          <p>Retry</p>
          <TbRefresh />
        </button>
      );
    else if (treeState === "noActiveDocument")
      return (
        <p className="text-button-hoverBackground">
          No active documents detected
        </p>
      );
    else
      return (
        <div className="overflow-y-hidden h-full w-full flex flex-col gap-2">
          <FilterWidget />
          <div>
            <OutlineTreeNodes nodeIds={tree} depth={1} />
          </div>
        </div>
      );
  };

  return (
    <div
      className={twJoin(
        "flex flex-col h-full",
        treeState === "noActiveDocument" ||
          treeState === "requireRefresh" ||
          treeState === "preparingTreeNodes"
          ? "items-center justify-center"
          : "relative focus:outline-none overflow-y-scroll"
      )}
      tabIndex={0}
    >
      <Main />
    </div>
  );
};

export default OutlineTree;
