import { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowUpDown, EyeOff, Snowflake, ArrowUp, ArrowDown } from 'lucide-react';
import { getHeatMapColor, getRowStats } from '../utils/heatMap';
import { calculatePercentageDiff } from '../utils/percentageCalc';

const DataTable = ({ data, onReset }) => {
    const [frozenColumn, setFrozenColumn] = useState(null);
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [tableData, setTableData] = useState([]);
    const [columnWidths, setColumnWidths] = useState({});

    const tableRef = useRef(null);

    useEffect(() => {
        if (data) {
            setTableData(data);
        }
    }, [data]);

    useEffect(() => {
        if (onReset) {
        }
    }, [onReset]);

    const handleReset = () => {
        setHiddenColumns([]);
        setFrozenColumn(null);
        setSortConfig({ key: null, direction: 'asc' });
    };

    const columns = useMemo(() => {
        if (!data || data.length === 0) return [];
        return Object.keys(data[0]);
    }, [data]);

    const visibleColumns = useMemo(() => {
        return columns.filter(col => !hiddenColumns.includes(col));
    }, [columns, hiddenColumns]);

    const frozenIndex = useMemo(() => {
        if (!frozenColumn) return -1;
        return visibleColumns.indexOf(frozenColumn);
    }, [visibleColumns, frozenColumn]);

    useEffect(() => {
        const measure = () => {
            if (tableRef.current) {
                const ths = tableRef.current.querySelectorAll('th');
                const widths = {};
                let leftAccumulator = 0;
                ths.forEach((th, index) => {
                    widths[index] = {
                        width: th.offsetWidth,
                        left: leftAccumulator
                    };
                    leftAccumulator += th.offsetWidth;
                });
                setColumnWidths(widths);
            }
        };

        measure();
        window.addEventListener('resize', measure);
        return () => window.removeEventListener('resize', measure);
    }, [tableData, hiddenColumns, frozenColumn]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return tableData;

        const sorted = [...tableData].sort((a, b) => {
            let aVal = a[sortConfig.key];
            let bVal = b[sortConfig.key];

            const clean = (v) => parseFloat(v?.replace(/[^0-9.-]+/g, ''));
            const aNum = clean(aVal);
            const bNum = clean(bVal);

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [tableData, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleFreeze = (colName) => {
        if (frozenColumn === colName) {
            setFrozenColumn(null);
        } else {
            setFrozenColumn(colName);
        }
    };

    const handleHide = (colName) => {
        setHiddenColumns([...hiddenColumns, colName]);
        if (frozenColumn === colName) {
            setFrozenColumn(null);
        }
    };

    const getCellStyle = (row, colName, colIndex) => {
        const style = {};

        if (colIndex <= frozenIndex) {
            style.position = 'sticky';
            style.left = `${columnWidths[colIndex]?.left || 0}px`;
            style.zIndex = 5;
            style.backgroundColor = 'var(--color-bg)';
            style.borderRight = colIndex === frozenIndex ? '2px solid var(--color-border)' : '1px solid var(--color-border)';
        }

        if (/Supplier \d+ \(Rate\)/.test(colName)) {
            const { min, max } = getRowStats(row);
            const val = parseFloat(row[colName]?.replace(/[^0-9.-]+/g, ''));
            if (!isNaN(val)) {
                style.backgroundColor = getHeatMapColor(val, min, max);
            }
        }

        return style;
    };

    const renderCellContent = (row, colName) => {
        const val = row[colName];

        if (/Supplier \d+ \(Rate\)/.test(colName)) {
            const { min, max } = getRowStats(row);
            const numVal = parseFloat(val?.replace(/[^0-9.-]+/g, ''));
            const estRate = row['Estimated Rate'];
            const diff = calculatePercentageDiff(estRate, val);

            return (
                <div className="flex flex-col justify-center" style={{ lineHeight: 1.2 }}>
                    <span style={{ fontWeight: 600 }}>{val}</span>
                    {diff !== null && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: diff > 0 ? '#b91c1c' : '#15803d',
                            fontWeight: 700
                        }}>
                            {diff > 0 ? '+' : ''}{diff}%
                        </span>
                    )}
                </div>
            );
        }

        return val;
    };

    if (!data || data.length === 0) return null;

    return (
        <div>
            <div className="flex justify-end items-center mb-4">
                <button onClick={handleReset} style={{ padding: '0.5rem 1rem', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    Reset View
                </button>
            </div>

            <div className="data-table-container shadow-md bg-white rounded-lg">
                <table className="data-table" ref={tableRef}>
                    <thead>
                        <tr>
                            {visibleColumns.map((col, index) => {
                                const isFrozen = index <= frozenIndex;
                                const style = {
                                    left: isFrozen ? (columnWidths[index]?.left || 0) : 'auto',
                                    position: isFrozen ? 'sticky' : 'relative',
                                    zIndex: isFrozen ? 20 : 10,
                                    backgroundColor: 'var(--color-bg-subtle)',
                                    borderRight: index === frozenIndex ? '2px solid var(--color-border)' : 'none',
                                    minWidth: '150px'
                                };

                                return (
                                    <th key={col} style={style}>
                                        <div className="flex items-center justify-between gap-2">
                                            <span>{col}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <button
                                                    onClick={() => handleSort(col)}
                                                    title="Sort"
                                                    style={{
                                                        border: 'none',
                                                        background: sortConfig.key === col ? '#eff6ff' : 'transparent',
                                                        color: sortConfig.key === col ? 'var(--color-primary)' : 'var(--color-text-mutated)',
                                                        padding: '4px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'background-color 0.2s, color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { if (sortConfig.key !== col) { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = 'var(--color-text)'; } }}
                                                    onMouseLeave={(e) => { if (sortConfig.key !== col) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-mutated)'; } }}
                                                >
                                                    {sortConfig.key === col ? (
                                                        sortConfig.direction === 'asc' ? <ArrowUp size={16} strokeWidth={2.5} /> : <ArrowDown size={16} strokeWidth={2.5} />
                                                    ) : (
                                                        <ArrowUpDown size={16} />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleFreeze(col)}
                                                    title={isFrozen ? "Unfreeze" : "Freeze up to here"}
                                                    style={{
                                                        border: 'none',
                                                        background: isFrozen ? '#eff6ff' : 'transparent',
                                                        color: isFrozen ? 'var(--color-primary)' : 'var(--color-text-mutated)',
                                                        padding: '4px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'background-color 0.2s, color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { if (!isFrozen) { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = 'var(--color-text)'; } }}
                                                    onMouseLeave={(e) => { if (!isFrozen) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-mutated)'; } }}
                                                >
                                                    <Snowflake size={16} fill={isFrozen ? 'currentColor' : 'none'} strokeWidth={isFrozen ? 2.5 : 2} />
                                                </button>
                                                <button
                                                    onClick={() => handleHide(col)}
                                                    title="Hide Column"
                                                    style={{
                                                        border: 'none',
                                                        background: 'transparent',
                                                        color: 'var(--color-text-mutated)',
                                                        padding: '4px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        transition: 'background-color 0.2s, color 0.2s'
                                                    }}
                                                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.color = '#ef4444'; }}
                                                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-mutated)'; }}
                                                >
                                                    <EyeOff size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, rIndex) => (
                            <tr key={rIndex}>
                                {visibleColumns.map((col, cIndex) => (
                                    <td key={`${rIndex}-${col}`} style={getCellStyle(row, col, cIndex)}>
                                        {renderCellContent(row, col)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-center" style={{ color: 'var(--color-text-mutated)' }}>
                {sortedData.length} rows loaded.
            </div>
        </div>
    );
};

export default DataTable;