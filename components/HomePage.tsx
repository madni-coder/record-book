import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Page } from "../types";
import {
    PlusIcon,
    SearchIcon,
    BellIcon,
    DocumentIcon,
    MoreVerticalIcon,
} from "./icons";

interface HomePageProps {
    pages: Page[];
    onRowClick?: (id: string) => void;
    onAddPage?: (name: string) => void; // Add this prop to handle page creation
}

const HomePage: React.FC<HomePageProps> = ({
    pages: initialPages,
    onAddPage,
}) => {
    const navigate = useNavigate();
    const [pages, setPages] = useState<Page[]>(initialPages);
    const [search, setSearch] = useState("");
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [activePageId, setActivePageId] = useState(initialPages[0]?.id || "");
    // Remove localStorage and always start with default theme
    const [theme, setTheme] = useState<"cupcake" | "night">("cupcake");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        // Remove localStorage persistence
    }, [theme]);

    // Remove theme restoration from localStorage

    // Keep local pages in sync if initialPages prop changes
    useEffect(() => {
        setPages(initialPages);
    }, [initialPages]);

    const filteredPages = pages.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreatePage = () => {
        const trimmed = newPageName.trim();
        if (trimmed && onAddPage) {
            // Use the onAddPage prop to create the page in App.tsx
            onAddPage(trimmed);
            setNewPageName("");
            setIsAddingPage(false);

            // Navigate to the new page immediately
            const newPageId = `${trimmed
                .toLowerCase()
                .replace(/\s+/g, "-")}-${Date.now()}`;
            setTimeout(() => {
                navigate(`/page/${newPageId}`);
            }, 100);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-0 px-0 bg-base-200">
            <div className="w-full max-w-xs mx-auto flex flex-col min-h-screen bg-base-200">
                {/* Header */}
                <div className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                        {/* Theme toggle button */}
                        <button
                            aria-label="Toggle dark/light mode"
                            className="mr-2 p-1.5 rounded-full border border-base-300 bg-base-100 hover:bg-base-300 transition-colors"
                            onClick={() =>
                                setTheme((prev) =>
                                    prev === "cupcake" ? "night" : "cupcake"
                                )
                            }
                            title={
                                theme === "cupcake"
                                    ? "Switch to Dark (Night)"
                                    : "Switch to Light (Cupcake)"
                            }
                        >
                            {theme === "cupcake" ? (
                                // Sun icon for light mode
                                <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"
                                    />
                                </svg>
                            ) : (
                                // Moon icon for dark mode
                                <svg
                                    className="w-5 h-5 text-orange-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"
                                    />
                                </svg>
                            )}
                        </button>
                        {/* Avatar */}
                        <h1 className="font-bold text-lg text-base-content ml-1">
                            Expense Count
                        </h1>
                    </div>
                </div>
                {/* Search and Add */}
                <div className="px-4 pt-2 pb-4">
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search Page"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-base-100 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base-content placeholder-base-content/50 text-base shadow-sm"
                            style={{ fontWeight: 500 }}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
                    </div>

                    <button
                        onClick={() => setIsAddingPage(true)}
                        disabled={isAddingPage}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-full btn btn-primary disabled:btn-disabled"
                        style={{
                            fontWeight: 600,
                            fontSize: 18,
                            minHeight: 48,
                        }}
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add New Page</span>
                    </button>
                </div>
                {/* Page List */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {filteredPages.map((page) => (
                        <div key={page.id} className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setActivePageId(page.id);
                                    navigate(`/page/${page.id}`);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium transition-colors ${
                                    activePageId === page.id
                                        ? "bg-base-300 text-base-content"
                                        : "text-base-content hover:bg-base-100"
                                }`}
                                style={{
                                    minHeight: 48,
                                    fontSize: 17,
                                    fontWeight: 500,
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex items-center justify-center p-1.5 rounded-md ${
                                            activePageId === page.id
                                                ? "bg-primary/20"
                                                : "bg-base-100"
                                        }`}
                                    >
                                        <DocumentIcon
                                            className={`w-6 h-6 ${
                                                activePageId === page.id
                                                    ? "text-base-content"
                                                    : "text-base-content/50"
                                            }`}
                                        />
                                    </span>
                                    <span className="truncate">
                                        {page.name}
                                    </span>
                                </div>
                                <MoreVerticalIcon className="w-6 h-6 text-base-content/50" />
                            </button>
                        </div>
                    ))}
                    {isAddingPage && (
                        <div className="px-3 py-2 mt-1">
                            <input
                                type="text"
                                autoFocus
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCreatePage();
                                    else if (e.key === "Escape") {
                                        setNewPageName("");
                                        setIsAddingPage(false);
                                    }
                                }}
                                onBlur={() => {
                                    if (!newPageName) setIsAddingPage(false);
                                }}
                                placeholder="New page name..."
                                className="w-full text-base bg-base-100 border-2 rounded-xl px-3 py-2 outline-none"
                                style={{
                                    borderColor: "#5EEAD4", // mint-400
                                    boxShadow: "0 0 0 2px #5EEAD4",
                                    fontWeight: 500,
                                    color: "#7C6F82",
                                }}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddingPage(false)}
                                    className="px-3 py-1 text-xs font-semibold rounded-md"
                                    style={{
                                        color: "#3B2C4A",
                                        background: "none",
                                        border: "none",
                                        boxShadow: "none",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreatePage}
                                    className="px-3 py-1 text-xs font-semibold rounded-md"
                                    style={{
                                        background: "#5EEAD4", // mint-400
                                        color: "#fff",
                                    }}
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </div>
    );
};

export default HomePage;
