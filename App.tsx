import React, { useState, useEffect } from "react";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import { INITIAL_PAGES } from "./constants";
import type { Page } from "./types";

function App() {
    const [pages, setPages] = useState<Page[]>(() => {
        const savedPages = localStorage.getItem("pages");
        return savedPages ? JSON.parse(savedPages) : INITIAL_PAGES;
    });

    const [activePageId, setActivePageId] = useState<string>(() => {
        const savedActivePageId = localStorage.getItem("activePageId");
        return savedActivePageId || INITIAL_PAGES[0].id;
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("pages", JSON.stringify(pages));
    }, [pages]);

    useEffect(() => {
        localStorage.setItem("activePageId", activePageId);
    }, [activePageId]);

    const activePage = pages.find((p) => p.id === activePageId) || pages[0];

    const updatePage = (pageId: string, updatedPageData: Partial<Page>) => {
        setPages((prevPages) =>
            prevPages.map((p) =>
                p.id === pageId ? { ...p, ...updatedPageData } : p
            )
        );
    };

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
        setActivePageId(newPage.id); // Switch to new page
        setSidebarOpen(false); // Close sidebar after selecting new page on mobile
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
        <div className="flex h-screen font-sans relative bg-base-100">
            <Sidebar
                pages={pages}
                activePageId={activePageId}
                setActivePageId={setActivePageId}
                addPage={addPage}
                deletePage={deletePage}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />
            <MainContent
                key={activePage.id}
                activePage={activePage}
                updatePage={updatePage}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                pages={pages}
                activePageId={activePageId}
                setActivePageId={setActivePageId}
                addPage={addPage}
            />
        </div>
    );
}

export default App;
