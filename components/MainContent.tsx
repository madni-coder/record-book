import React, { useState, useMemo, useEffect } from "react";
import type { Page, Entry, Column } from "../types";
import Header from "./Header";
import LedgerTable from "./LedgerTable";
import LedgerFooter from "./LedgerFooter";
import { SearchIcon, XIcon } from "./icons";
import { INITIAL_PAGES } from "../constants";

const MainContent: React.FC = ({ toggleSidebar }) => {
    const [sheets, setSheets] = useState<Page[]>(() =>
        JSON.parse(JSON.stringify(INITIAL_PAGES))
    );
    const [activeSheetId, setActiveSheetId] = useState<string>(
        INITIAL_PAGES[0].id
    );
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isWebView, setIsWebView] = useState(false);

    useEffect(() => {
        const checkEnvironment = () => {
            setIsMobile(window.innerWidth < 640);
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

    const activeSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

    const updateSheet = (sheetId: string, updated: Partial<Page>) => {
        setSheets((prev) =>
            prev.map((s) => (s.id === sheetId ? { ...s, ...updated } : s))
        );
    };

    const handleAddSheet = () => {
        setSheets((prevSheets) => {
            const newSheetNum = prevSheets.length + 1;
            const baseColumns = prevSheets[0]?.columns
                ? JSON.parse(JSON.stringify(prevSheets[0].columns))
                : [
                      { id: "col-sno", name: "S.No", type: "text", width: 10 },
                      {
                          id: "col-1",
                          name: "Column 1",
                          type: "text",
                          width: 50,
                      },
                      {
                          id: "col-2",
                          name: "Column 2",
                          type: "text",
                          width: 50,
                      },
                      {
                          id: "col-3",
                          name: "Column 3",
                          type: "text",
                          width: 50,
                      },
                  ];
            const baseEntries = prevSheets[0]?.entries
                ? JSON.parse(JSON.stringify(prevSheets[0].entries))
                : Array(10)
                      .fill(0)
                      .map((_, i) => ({
                          id: i + 1,
                          data: { "col-1": "", "col-2": "", "col-3": "" },
                      }));
            const newSheet: Page = {
                id: `sheet-${Date.now()}`,
                name: `Sheet ${newSheetNum}`,
                columns: baseColumns,
                entries: baseEntries,
            };
            setActiveSheetId(newSheet.id);
            return [...prevSheets, newSheet];
        });
    };

    const handleDeleteSheet = (sheetId: string) => {
        setSheets((prevSheets) => {
            if (prevSheets.length === 1) return prevSheets;
            const filtered = prevSheets.filter((s) => s.id !== sheetId);
            if (activeSheetId === sheetId && filtered.length > 0) {
                setActiveSheetId(filtered[0].id);
            }
            return filtered;
        });
    };

    const handleEntriesChange = (newEntries: Entry[]) => {
        updateSheet(activeSheet.id, { entries: newEntries });
    };
    const handleColumnsChange = (newColumns: Column[]) => {
        updateSheet(activeSheet.id, { columns: newColumns });
    };

    const filteredEntries = useMemo(() => {
        let entriesToFilter = activeSheet.entries;
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
    }, [activeSheet.entries, activeSheet.columns, searchTerm]);

    return (
        <div
            className={`flex-1 flex flex-col bg-gray-50 overflow-hidden w-full ${
                isWebView ? "web-view" : ""
            }`}
        >
            <Header
                activePage={activeSheet}
                pages={sheets.map((s, i) => ({
                    ...s,
                    name: `Sheet ${i + 1}`,
                }))}
                activePageId={activeSheetId}
                setActivePageId={setActiveSheetId}
                onAddPage={handleAddSheet}
                onDeletePage={handleDeleteSheet}
                toggleSidebar={toggleSidebar}
            />
            <div
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-4`}
                style={{ background: "#ffffe6" }}
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
                    columns={activeSheet.columns}
                    entries={filteredEntries}
                    setEntries={handleEntriesChange}
                    allEntries={activeSheet.entries}
                    setColumns={handleColumnsChange}
                />
            </div>
            <LedgerFooter
                columns={activeSheet.columns}
                entries={filteredEntries}
                style={{ background: "#ffffe6" }}
            />
        </div>
    );
};

export default MainContent;
