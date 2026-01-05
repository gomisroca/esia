'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { ReactNode } from 'react';

interface VirtualGridProps<T> {
  items: T[];
  estimateHeight?: number;
  columnCount?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => ReactNode;
}

export function VirtualGrid<T>({
  items,
  estimateHeight = 480,
  columnCount = 3,
  overscan = 5,
  renderItem,
}: VirtualGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => estimateHeight,
    overscan,
  });

  return (
    <div className="relative w-full overflow-x-hidden" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const children = [];

        for (let i = 0; i < columnCount; i++) {
          const index = virtualRow.index * columnCount + i;
          const item = items[index];
          if (item === undefined) continue;

          children.push(
            <div key={index} className="min-w-0 flex-1">
              {renderItem(item, index)}
            </div>
          );
        }

        return (
          <div
            key={virtualRow.key}
            className="flex w-full gap-4"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualRow.start}px)`,
            }}>
            {children}
          </div>
        );
      })}
    </div>
  );
}
