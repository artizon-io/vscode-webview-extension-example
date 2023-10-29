import React, { useEffect, useRef } from "react";
import { TbChevronRight } from "react-icons/tb";
import { twJoin, twMerge } from "tailwind-merge";
import { getSymbolColor, getSymbolIcon, getSymbolName } from "../utils";
import { NodeID } from "../types";
import { useInView } from "react-intersection-observer";
import {
  getNodeData,
  getNodeDataStore,
  selectedNodeStore,
  inFocusStore,
} from "../store";
import { useStore } from "@artizon/store";

const NODE_HEIGHT = 22;

const OutlineTreeNodes: React.FC<{
  nodeIds: readonly NodeID[];
  depth: number;
}> = ({ nodeIds, depth }) => {
  return (
    <>
      {nodeIds
        .filter((nodeId) => {
          const node = getNodeData(nodeId);
          return node.visible || node.isChildVisible;
        })
        .map((nodeId) => (
          <OutlineTreeNode key={nodeId} nodeId={nodeId} depth={depth} />
        ))}
    </>
  );
};

const OutlineTreeNode: React.FC<{
  nodeId: NodeID;
  className?: string;
  depth: number;
}> = ({ nodeId, className, depth, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Potential performance problem as there is an intersection observer for each node?
  const {
    ref: childrenInViewRef,
    inView: childrenInView,
    entry,
  } = useInView({
    threshold: 0,
  });

  const {
    nextSibling,
    parent,
    prevSibling,
    range,
    name,
    kind,
    detail,
    children,
    belowCursor,
    isChildSelected,
    isSelected,
    visible,
    isChildVisible,
  } = useStore(getNodeDataStore(nodeId));

  const isExpanded = children.length > 0;

  const SymbolIcon = getSymbolIcon({ kind });
  const symbolName = getSymbolName({ kind });
  const symbolColor = getSymbolColor({ kind });

  // Scroll to node when it got selected
  useEffect(() => {
    if (!isSelected) return;
    if (!inFocusStore.getState()) {
      // If the selection is triggered from text editor
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      // If the selection is triggered from within outline
      ref.current?.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  }, [isSelected]);

  return (
    <div className={twJoin(className, "flex flex-col")}>
      <div
        ref={ref}
        className={twMerge(
          `
            flex flex-row gap-2 justify-start items-center
            cursor-pointer
            px-1
            bg-sideBar-background
            hover:bg-list-hoverBackground
            h-[22px]
            leading-[22px]
            outline-1 outline outline-offset-[-1px] outline-transparent
          `,
          isSelected && "bg-list-focusBackground",
          !visible && "opacity-40"
        )}
        style={
          childrenInView
            ? {
                position: "sticky",
                top: NODE_HEIGHT * (depth - 1) + "px",
                zIndex: 50 - depth,
                scrollMarginTop: NODE_HEIGHT * (depth - 1) + "px",
              }
            : {
                scrollMarginTop: NODE_HEIGHT * (depth - 1) + "px",
              }
        }
        onClick={(e) => {
          selectedNodeStore.setState(nodeId);
        }}
      >
        <div
          style={{
            paddingLeft: (depth - 1) * 20 + "px",
          }}
        />
        <SymbolIcon
          className={`w-4 h-4 opacity-70`}
          style={{
            color: symbolColor,
          }}
        />
        <div className="flex-1 flex flex-row gap-1 items-center">
          <p
            className={`
              select-none
              overflow-ellipsis overflow-hidden whitespace-nowrap
            `}
            style={{
              color: symbolColor,
            }}
          >
            {name}
          </p>
          <TbChevronRight
            className={twJoin(
              "w-4 h-4 opacity-70",
              !isExpanded && "hidden",
              isExpanded && "transform rotate-90"
            )}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="flex flex-col" ref={childrenInViewRef}>
          <OutlineTreeNodes nodeIds={children} depth={depth + 1} />
        </div>
      )}
    </div>
  );
};

export default OutlineTreeNodes;
