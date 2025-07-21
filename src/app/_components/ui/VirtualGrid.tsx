'use client';

import React from 'react';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

interface VirtualGridProps<T> {
  items: T[];
  estimateHeight?: number;
  columnCount?: number;
  overscan?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
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
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        position: 'relative',
      }}
      className="w-full"
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const children = [];

        for (let i = 0; i < columnCount; i++) {
            const index = virtualRow.index * columnCount + i;
            const item = items[index];
            if (item === undefined) continue;

            children.push(
                <div key={index}>
                {renderItem(item, index)}
                </div>
            );
        }

        return (
          <div
            key={virtualRow.key}
            className="flex justify-center gap-4"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {children}
          </div>
        );
      })}
    </div>
  );
}
