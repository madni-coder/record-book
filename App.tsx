import React, { useState } from "react";
import MainContent from "./components/MainContent";
import Sidebar from "./components/Sidebar";
import { INITIAL_PAGES } from "./constants";
import type { Page } from "./types";
function App() {
    const [pages, setPages] = useState<Page[]>(INITIAL_PAGES);
    const [activePageId, setActivePageId] = useState<string>(
        INITIAL_PAGES[0].id
    );
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
            entries: [
                { id: 1, data: { "col-a": "", "col-c": null } },
                { id: 2, data: { "col-a": "", "col-c": null } },
                { id: 3, data: { "col-a": "", "col-c": null } },
                { id: 4, data: { "col-a": "", "col-c": null } },
                { id: 5, data: { "col-a": "", "col-c": null } },
                { id: 6, data: { "col-a": "", "col-c": null } },
                { id: 7, data: { "col-a": "", "col-c": null } },
                { id: 8, data: { "col-a": "", "col-c": null } },
                { id: 9, data: { "col-a": "", "col-c": null } },
                { id: 10, data: { "col-a": "", "col-c": null } },
                { id: 11, data: { "col-a": "", "col-c": null } },
                { id: 12, data: { "col-a": "", "col-c": null } },
            ],
        };
        setPages((prev) => [...prev, newPage]);
        setActivePageId(newPage.id); // <-- Switch to new page
        setSidebarOpen(false); // Close sidebar after selecting new page on mobile
    };

    const deletePage = (pageId: string) => {
        setPages((prev) => prev.filter((p) => p.id !== pageId));
        // If we're deleting the active page, switch to the first available page
        if (pageId === activePageId) {
            const remainingPages = pages.filter((p) => p.id !== pageId);
            if (remainingPages.length > 0) {
                setActivePageId(remainingPages[0].id);
            }
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans relative">
            <Sidebar
                pages={pages} // <-- Fix: pass real pages to Sidebar
                activePageId={activePageId}
                setActivePageId={setActivePageId}
                addPage={addPage} // <-- Fix: pass real addPage
                deletePage={deletePage} // <-- Fix: pass real deletePage
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
