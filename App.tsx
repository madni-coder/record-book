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
                    toggleSidebar={undefined}
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
    const [pages, setPages] = useState<Page[]>(() => {
        const savedPages = localStorage.getItem("pages");
        return savedPages ? JSON.parse(savedPages) : INITIAL_PAGES;
    });

    const [activePageId, setActivePageId] = useState<string>(() => {
        const savedActivePageId = localStorage.getItem("activePageId");
        return savedActivePageId || INITIAL_PAGES[0].id;
    });

    useEffect(() => {
        localStorage.setItem("pages", JSON.stringify(pages));
    }, [pages]);

    useEffect(() => {
        localStorage.setItem("activePageId", activePageId);
    }, [activePageId]);

    const addPage = (name: string) => {
        const newPage: Page = {
            id: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
            name,
            columns: [
                { id: "col-sno", name: "S.No", type: "text", width: 10 },
                { id: "col-a", name: "Item", type: "text", width: 50 },
                {
                    id: "col-c",
                    name: "Total Amount",
                    type: "number",
                    width: 50,
                },
            ],
            entries: Array(10)
                .fill(0)
                .map((_, index) => ({
                    id: index + 1,
                    data: { "col-a": "", "col-c": null },
                })),
        };
        setPages((prev) => [...prev, newPage]);
        setActivePageId(newPage.id);
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
