'use client';

import { useEffect, useState } from 'react';

export function useColumnCount() {
  const [columnCount, setColumnCount] = useState<number>(3);

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumnCount(1); // Mobile
      } else if (width < 1024) {
        setColumnCount(2); // Tablet
      } else {
        setColumnCount(3); // Desktop
      }
    };
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  return columnCount;
}
