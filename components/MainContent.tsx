import React, { useState, useMemo, useEffect } from "react";
import type { Page, Entry, Column } from "../types";
import Header from "./Header";
import LedgerTable from "./LedgerTable";
import LedgerFooter from "./LedgerFooter";
import { SearchIcon, XIcon } from "./icons";

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
    }, [activePage.entries, activePage.columns, searchTerm]);

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

            <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-4`}
                style={{ background: "#ffffe6" }} // <-- filter/search bar bg
            >
                <div
                    className="relative w-full sm:w-auto"
                    style={{ minWidth: "320px", maxWidth: "480px" }}
                >
                    <SearchIcon
                        className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                            isWebView ? "w-5 h-5" : "w-6 h-6"
                        } text-gray-400 pointer-events-none`}
                    />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-12 pr-12 ${
                            isWebView ? "py-2 text-base" : "py-3 text-lg"
                        } bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        style={{ fontSize: "18px", height: "48px" }}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            <XIcon
                                className={isWebView ? "w-5 h-5" : "w-6 h-6"}
                            />
                        </button>
                    )}
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
            <LedgerFooter
                columns={activePage.columns}
                entries={filteredEntries}
                style={{ background: "#ffffe6" }} // <-- total count/footer bg
            />
        </div>
    );
};

export default MainContent;
