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

    // Add a state to track if the view is mobile
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sidebar open state: always true on desktop, toggleable on mobile
    const [sidebarOpen, setSidebarOpen] = useState(
        () => window.innerWidth >= 768
    );

    useEffect(() => {
        // Remove auto-collapse on mobile, only auto-open on desktop
        if (!isMobile) {
            setSidebarOpen(true); // Always open on desktop
        }
        // Do not auto-close on mobile
    }, [isMobile]);

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
        if (isMobile) setSidebarOpen(false); // Only close sidebar on mobile after selecting new page
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
            {/* Hamburger button for mobile, only when sidebar is closed */}
            {isMobile && !sidebarOpen && (
                <button
                    className="fixed top-4 left-4 z-50 bg-white rounded-full shadow p-2 border border-gray-200"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open sidebar"
                >
                    {/* Simple hamburger icon */}
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="5" y1="7" x2="19" y2="7" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <line x1="5" y1="17" x2="19" y2="17" />
                    </svg>
                </button>
            )}
            <Sidebar
                pages={pages}
                activePageId={activePageId}
                setActivePageId={setActivePageId}
                addPage={addPage}
                deletePage={deletePage}
                isOpen={sidebarOpen}
                setIsOpen={isMobile ? setSidebarOpen : undefined} // Only allow toggling on mobile
            />
            <div className="flex-1 flex flex-col w-0 md:ml-72">
                <MainContent
                    key={activePage.id}
                    activePage={activePage}
                    updatePage={updatePage}
                    toggleSidebar={
                        isMobile
                            ? () => setSidebarOpen(!sidebarOpen)
                            : undefined
                    }
                    pages={pages}
                    activePageId={activePageId}
                    setActivePageId={setActivePageId}
                    addPage={addPage}
                />
            </div>
        </div>
    );
}

export default App;
