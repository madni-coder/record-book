import React, { useState, useMemo, useEffect } from "react";
import type { Page, Entry, Column, FilterCondition } from "../types";
import Header from "./Header";
import LedgerTable from "./LedgerTable";
import LedgerFooter from "./LedgerFooter";
import FilterPanel from "./FilterPanel";
import { FilterIcon, SearchIcon } from "./icons";

interface MainContentProps {
    activePage: Page;
    updatePage: (pageId: string, updatedPageData: Partial<Page>) => void;
    toggleSidebar: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
    activePage,
    updatePage,
    toggleSidebar,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filters, setFilters] = useState<FilterCondition[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isWebView, setIsWebView] = useState(false);

    // Check for mobile view and web context
    useEffect(() => {
        const checkEnvironment = () => {
            const mobile = window.innerWidth < 640;
            setIsMobile(mobile);

            // Check if running in a standard browser
            const isStandaloneBrowser =
                navigator.userAgent.includes("Chrome") ||
                navigator.userAgent.includes("Firefox") ||
                navigator.userAgent.includes("Safari");

            setIsWebView(isStandaloneBrowser);
        };

        checkEnvironment();
        window.addEventListener("resize", checkEnvironment);
        return () => window.removeEventListener("resize", checkEnvironment);
    }, []);

    const handleEntriesChange = (newEntries: Entry[]) => {
        updatePage(activePage.id, { entries: newEntries });
    };

    const handleColumnsChange = (newColumns: Column[]) => {
        updatePage(activePage.id, { columns: newColumns });
    };

    const handleAddColumn = () => {
        const newColId = `col-${Date.now()}`;
        const newColumn: Column = {
            id: newColId,
            name: `Column ${String.fromCharCode(
                65 + activePage.columns.length - 1
            )}`, // -1 for S.No
            type: "text",
            width: 120,
        };
        const updatedColumns = [...activePage.columns, newColumn];

        const updatedEntries = activePage.entries.map((entry) => ({
            ...entry,
            data: { ...entry.data, [newColId]: "" },
        }));

        updatePage(activePage.id, {
            columns: updatedColumns,
            entries: updatedEntries,
        });
    };

    const filteredEntries = useMemo(() => {
        let entriesToFilter = activePage.entries;

        if (filters.length > 0) {
            entriesToFilter = entriesToFilter.filter((entry) => {
                return filters.every((filter) => {
                    const { columnId, operator, value } = filter;
                    const entryValue = entry.data[columnId];
                    const column = activePage.columns.find(
                        (c) => c.id === columnId
                    );
                    if (!column) return true;

                    const entryValueString = String(
                        entryValue ?? ""
                    ).toLowerCase();
                    const filterValueString = String(value ?? "").toLowerCase();

                    switch (operator) {
                        case "contains":
                            return entryValueString.includes(filterValueString);
                        case "not_contains":
                            return !entryValueString.includes(
                                filterValueString
                            );
                        case "is_equal":
                            if (column.type === "number")
                                return Number(entryValue) === Number(value);
                            return entryValueString === filterValueString;
                        case "is_not_equal":
                            if (column.type === "number")
                                return Number(entryValue) !== Number(value);
                            return entryValueString !== filterValueString;
                        case "gt":
                            return Number(entryValue) > Number(value);
                        case "lt":
                            return Number(entryValue) < Number(value);
                        case "is_on":
                            return entryValue === value;
                        case "is_not_on":
                            return entryValue !== value;
                        case "is_before":
                            return (
                                new Date(entryValueString) <
                                new Date(filterValueString)
                            );
                        case "is_after":
                            return (
                                new Date(entryValueString) >
                                new Date(filterValueString)
                            );
                        default:
                            return true;
                    }
                });
            });
        }

        if (searchTerm) {
            entriesToFilter = entriesToFilter.filter((entry) =>
                Object.values(entry.data).some((value) =>
                    String(value)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
            );
        }

        return entriesToFilter;
    }, [activePage.entries, activePage.columns, searchTerm, filters]);

    return (
        <div
            className={`flex-1 flex flex-col bg-gray-50 overflow-hidden w-full ${
                isWebView ? "web-view" : ""
            }`}
        >
            <Header
                activePage={activePage}
                toggleSidebar={toggleSidebar}
                onAddColumn={handleAddColumn}
            />

            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setFilterPanelOpen(false)}
                columns={activePage.columns}
                onApplyFilters={setFilters}
                activeFilters={filters}
            />

            <div
                className={`flex-1 flex flex-col ${
                    isWebView ? "p-2 sm:p-4" : "p-4 sm:p-6"
                } pt-2 sm:pt-3 overflow-hidden`}
            >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-4">
                    <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => setFilterPanelOpen(true)}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-md text-sm font-semibold border bg-white border-gray-300 transition-colors ${
                                filters.length > 0
                                    ? "text-blue-700 ring-1 ring-blue-300"
                                    : "text-gray-600 hover:bg-gray-100"
                            } ${
                                isWebView
                                    ? "text-xs sm:text-sm py-1 sm:py-1.5"
                                    : ""
                            }`}
                        >
                            <FilterIcon
                                className={`${
                                    isWebView
                                        ? "w-3 h-3 sm:w-4 sm:h-4"
                                        : "w-4 h-4"
                                }`}
                            />
                            Filter
                            {filters.length > 0 && (
                                <span
                                    className={`ml-1 bg-blue-600 text-white text-xs font-bold rounded-full ${
                                        isWebView
                                            ? "h-4 w-4 text-[10px]"
                                            : "h-5 w-5"
                                    } flex items-center justify-center`}
                                >
                                    {filters.length}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="relative w-full sm:w-auto">
                        <SearchIcon
                            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                                isWebView ? "w-4 h-4" : "w-5 h-5"
                            } text-gray-400 pointer-events-none`}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 ${
                                isWebView ? "py-1 text-xs" : "py-1.5 text-sm"
                            } bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                </div>

                <div
                    className={`flex-1 overflow-auto ${
                        isWebView
                            ? "-mx-2 px-2 sm:-mx-4 sm:px-4"
                            : "-mx-4 px-4 sm:-mx-6 sm:px-6"
                    }`}
                >
                    <LedgerTable
                        columns={activePage.columns}
                        entries={filteredEntries}
                        setEntries={handleEntriesChange}
                        allEntries={activePage.entries}
                        setColumns={handleColumnsChange}
                    />
                </div>
            </div>
            <LedgerFooter
                columns={activePage.columns}
                entries={filteredEntries}
            />
        </div>
    );
};

export default MainContent;
