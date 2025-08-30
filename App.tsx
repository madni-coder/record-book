import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import MainContent from "./components/MainContent";
import { INITIAL_PAGES } from "./constants";
import type { Page } from "./types";
import HomePage from "./components/HomePage";

// LedgerApp no longer needs sidebar logic
function LedgerApp({
    pages,
    setPages,
    activePageId,
    setActivePageId,
    addPage,
    deletePage,
}) {
    const { pageId } = useParams();
    useEffect(() => {
        if (pageId && pageId !== activePageId) setActivePageId(pageId);
    }, [pageId]);
    const activePage =
        pages.find((p) => p.id === (pageId || activePageId)) || pages[0];
    const updatePage = (pageId: string, updatedPageData: Partial<Page>) => {
        setPages((prevPages) =>
            prevPages.map((p) =>
                p.id === pageId ? { ...p, ...updatedPageData } : p
            )
        );
    };
    return (
        <div className="flex h-screen font-sans relative bg-base-100">
            {/* Sidebar removed */}
            <div className="flex-1 flex flex-col w-0">
                <MainContent
                    key={activePage.id}
                    activePage={activePage}
                    updatePage={updatePage}
                    pages={pages}
                    activePageId={activePage.id}
                    setActivePageId={setActivePageId}
                    addPage={addPage}
                />
            </div>
        </div>
    );
}

function App() {
    // Remove localStorage and always start with INITIAL_PAGES
    const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
    const [activePageId, setActivePageId] = useState<string>(
        INITIAL_PAGES[0].id
    );

    // Remove localStorage persistence effects
    // Data will reset on every refresh

    const addPage = (name: string) => {
        const newPage: Page = {
            id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            name,
            columns: [
                { id: "col-sno", name: "S.No", type: "text", width: 80 },
                { id: "col-a", name: "Item", type: "text", width: 220 },
                {
                    id: "col-c",
                    name: "Total Amount",
                    type: "number",
                    width: 220,
                },
            ],
            entries: [], // Completely empty entries array
        };
        setPages((prev) => [...prev, newPage]);
        setActivePageId(newPage.id);
        return newPage; // Return the created page for navigation
    };

    const deletePage = (pageId: string) => {
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        if (pageId === activePageId) {
            const remainingPages = pages.filter((p) => p.id !== pageId);
            if (remainingPages.length > 0) {
                setActivePageId(remainingPages[0].id);
            }
        }
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            pages={pages}
                            onRowClick={(id) => setActivePageId(id)}
                            onAddPage={addPage}
                        />
                    }
                />
                <Route
                    path="/page/:pageId"
                    element={
                        <LedgerApp
                            pages={pages}
                            setPages={setPages}
                            activePageId={activePageId}
                            setActivePageId={setActivePageId}
                            addPage={addPage}
                            deletePage={deletePage}
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
