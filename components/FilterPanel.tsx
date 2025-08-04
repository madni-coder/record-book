import React, { useState, useEffect } from "react";
import type { Column, FilterCondition } from "../types";
import { FILTER_OPERATORS } from "./FilterOperators";
import { XIcon, TrashIcon, PlusIcon } from "./icons";

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    columns: Column[];
    onApplyFilters: (filters: FilterCondition[]) => void;
    activeFilters: FilterCondition[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    isOpen,
    onClose,
    columns,
    onApplyFilters,
    activeFilters,
}) => {
    const [localFilters, setLocalFilters] =
        useState<FilterCondition[]>(activeFilters);

    useEffect(() => {
        setLocalFilters(activeFilters);
    }, [activeFilters, isOpen]);

    if (!isOpen) return null;

    const handleAddFilter = () => {
        if (columns.length === 0) return;
        const firstColumn = columns[0];
        const firstOperator = FILTER_OPERATORS[firstColumn.type][0].id;

        setLocalFilters([
            ...localFilters,
            {
                id: `filter-${Date.now()}`,
                columnId: firstColumn.id,
                operator: firstOperator,
                value: "",
            },
        ]);
    };

    const handleUpdateFilter = (
        id: string,
        newFilterData: Partial<FilterCondition>
    ) => {
        setLocalFilters(
            localFilters.map((f) =>
                f.id === id ? { ...f, ...newFilterData } : f
            )
        );
    };

    const handleRemoveFilter = (id: string) => {
        setLocalFilters(localFilters.filter((f) => f.id !== id));
    };

    const handleApply = () => {
        onApplyFilters(localFilters);
        onClose();
    };

    const handleClearAll = () => {
        onApplyFilters([]);
        onClose();
    };

    const getColumnType = (columnId: string): Column["type"] => {
        return columns.find((c) => c.id === columnId)?.type || "text";
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 flex justify-end"
            onClick={onClose}
        >
            <div
                className="w-full max-w-[90vw] sm:max-w-md h-full bg-white shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-3 sm:p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                        Filter Entries
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <XIcon className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600" />
                    </button>
                </header>

                <div className="flex-1 p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
                    {localFilters.length === 0 && (
                        <div className="text-center text-gray-500 py-8 sm:py-10">
                            <p>No filters applied.</p>
                            <p className="text-sm">
                                Click "Add Filter" to get started.
                            </p>
                        </div>
                    )}
                    {localFilters.map((filter) => {
                        const columnType = getColumnType(filter.columnId);
                        const availableOperators = FILTER_OPERATORS[columnType];
                        const valueInputType =
                            columnType === "number"
                                ? "number"
                                : columnType === "date"
                                ? "date"
                                : "text";

                        return (
                            <div
                                key={filter.id}
                                className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 block mb-1">
                                            Column
                                        </label>
                                        <select
                                            value={filter.columnId}
                                            onChange={(e) => {
                                                const newColId = e.target.value;
                                                const newColType =
                                                    getColumnType(newColId);
                                                const newOperator =
                                                    FILTER_OPERATORS[
                                                        newColType
                                                    ][0].id;
                                                handleUpdateFilter(filter.id, {
                                                    columnId: newColId,
                                                    operator: newOperator,
                                                });
                                            }}
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {columns.map((col) => (
                                                <option
                                                    key={col.id}
                                                    value={col.id}
                                                >
                                                    {col.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 block mb-1">
                                            Operator
                                        </label>
                                        <select
                                            value={filter.operator}
                                            onChange={(e) =>
                                                handleUpdateFilter(filter.id, {
                                                    operator: e.target
                                                        .value as any,
                                                })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        >
                                            {availableOperators.map((op) => (
                                                <option
                                                    key={op.id}
                                                    value={op.id}
                                                >
                                                    {op.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">
                                        Value
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type={valueInputType}
                                            value={filter.value}
                                            onChange={(e) =>
                                                handleUpdateFilter(filter.id, {
                                                    value: e.target.value,
                                                })
                                            }
                                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveFilter(filter.id)
                                            }
                                            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-md flex-shrink-0"
                                        >
                                            <TrashIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <button
                        onClick={handleAddFilter}
                        className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-md hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm font-semibold"
                    >
                        <PlusIcon className="w-4 sm:w-5 h-4 sm:h-5" />
                        Add Filter
                    </button>
                </div>

                <footer className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-2 sm:gap-3">
                    <button
                        onClick={handleClearAll}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Apply Filters
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FilterPanel;
