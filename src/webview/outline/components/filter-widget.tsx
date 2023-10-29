import React, { useEffect, useRef } from "react";
import { filterTextStore, isFilterWidgetVisibleStore } from "../store";
import { useStore } from "@artizon/store";

const FilterWidget: React.FC = () => {
  const isVisible = useStore(isFilterWidgetVisibleStore);
  const filtersText = useStore(filterTextStore);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible) ref.current?.focus();
  }, [isVisible]);

  return (
    <input
      ref={ref}
      type="text"
      className={`
        py-1 px-1.5
        border border-input-background focus:border-focusBorder
        ring-0 focus:ring-0
        outline-none focus:outline-none
        bg-input-background
        text-input-foreground
        placeholder:text-input-placeholderForeground
      `}
      placeholder="Filter by name or type..."
      value={filtersText}
      onChange={(e) => filterTextStore.setState(e.target.value)}
      hidden={!isVisible}
    />
  );
};

export default FilterWidget;
