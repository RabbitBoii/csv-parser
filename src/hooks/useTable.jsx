import { useState, useMemo } from 'react';

export const useTableFeatures = (data) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [frozenColumns, setFrozenColumns] = useState(new Set(['Item Code', 'Material']));
    const [hiddenColumns, setHiddenColumns] = useState(new Set());

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const toggleSort = (columnKey) => {
        setSortConfig(prev => ({
            key: columnKey,
            direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const toggleFreeze = (columnKey) => {
        setFrozenColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }
            return newSet;
        });
    };

    const toggleHide = (columnKey) => {
        setHiddenColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey);
            } else {
                newSet.add(columnKey);
            }
            return newSet;
        });
    };

    return {
        sortedData,
        sortConfig,
        frozenColumns,
        hiddenColumns,
        toggleSort,
        toggleFreeze,
        toggleHide
    };
};