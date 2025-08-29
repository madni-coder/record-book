import React, { useState, useMemo, useEffect } from "react";
import type { Page, Entry, Column } from "../types";
import Header from "./Header";
import LedgerTable from "./LedgerTable";
import LedgerFooter from "./LedgerFooter";
import { SearchIcon, XIcon } from "./icons";
import { INITIAL_PAGES } from "../constants";

const MainContent: React.FC = ({ toggleSidebar, activePageId }) => {
    const [sheetsByPage, setSheetsByPage] = useState<Record<string, Page[]>>(
        () => {
            const savedSheetsByPage = localStorage.getItem("sheetsByPage");
            return savedSheetsByPage ? JSON.parse(savedSheetsByPage) : {};
        }
    );

    const sheets =
        sheetsByPage[activePageId] || JSON.parse(JSON.stringify(INITIAL_PAGES));

    const [activeSheetId, setActiveSheetId] = useState<string>(() => {
        const savedActiveSheetId = localStorage.getItem(
            `activeSheetId-${activePageId}`
        );
        return savedActiveSheetId || sheets[0]?.id;
    });

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

    useEffect(() => {
        localStorage.setItem("sheetsByPage", JSON.stringify(sheetsByPage));
    }, [sheetsByPage]);

    useEffect(() => {
        localStorage.setItem(`activeSheetId-${activePageId}`, activeSheetId);
    }, [activeSheetId, activePageId]);

    const updateSheetsForPage = (updatedSheets: Page[]) => {
        setSheetsByPage((prev) => ({
            ...prev,
            [activePageId]: updatedSheets,
        }));
    };

    const activeSheet = sheets.find((s) => s.id === activeSheetId) || sheets[0];

    const handleAddSheet = () => {
        const newSheet: Page = {
            id: `sheet-${Date.now()}`,
            name: `Sheet ${sheets.length + 1}`,
            columns: JSON.parse(
                JSON.stringify(sheets[0]?.columns || INITIAL_PAGES[0].columns)
            ),
            entries: JSON.parse(
                JSON.stringify(sheets[0]?.entries || INITIAL_PAGES[0].entries)
            ),
        };
        updateSheetsForPage([...sheets, newSheet]);
        setActiveSheetId(newSheet.id);
    };

    const handleDeleteSheet = (sheetId: string) => {
        const updatedSheets = sheets.filter((s) => s.id !== sheetId);
        updateSheetsForPage(updatedSheets);
        if (activeSheetId === sheetId && updatedSheets.length > 0) {
            setActiveSheetId(updatedSheets[0].id);
        }
    };

    const handleEntriesChange = (newEntries: Entry[]) => {
        const updatedSheets = sheets.map((s) =>
            s.id === activeSheet.id ? { ...s, entries: newEntries } : s
        );
        updateSheetsForPage(updatedSheets);
    };

    const handleColumnsChange = (newColumns: Column[]) => {
        const updatedSheets = sheets.map((s) =>
            s.id === activeSheet.id ? { ...s, columns: newColumns } : s
        );
        updateSheetsForPage(updatedSheets);
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
        <div className={`flex-1 flex flex-col overflow-hidden w-full`}>
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
            >
                <div
                    className="relative w-full sm:w-auto"
                    style={{ minWidth: "320px", maxWidth: "480px" }}
                >
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-12 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                        style={{ fontSize: "18px", height: "48px" }}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                            onClick={() => setSearchTerm("")}
                            aria-label="Clear search"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-auto">
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
            />
        </div>
    );
};

export default MainContent;
