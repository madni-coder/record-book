import React, { useState } from "react";
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
}

const HomePage: React.FC<HomePageProps> = ({ pages }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [activePageId, setActivePageId] = useState(pages[0]?.id || "");

    const filteredPages = pages.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCreatePage = () => {
        const trimmed = newPageName.trim();
        if (trimmed) {
            // Simulate add (in real app, call prop)
            setNewPageName("");
            setIsAddingPage(false);
            // Redirect to the new page path (simulate id)
            const newId = `${trimmed
                .toLowerCase()
                .replace(/\s+/g, "-")}-${Date.now()}`;
            navigate(`/page/${newId}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f3f1] flex flex-col items-center py-0 px-0">
            <div className="w-full max-w-xs mx-auto flex flex-col min-h-screen bg-[#f5f3f1]">
                {/* Header */}
                <div className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                        {/* Sun icon */}
                        <span className="mr-2 p-1.5 rounded-full border border-[#ece7e2] bg-white flex items-center justify-center">
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
                        </span>
                        {/* Avatar */}
                        <div className="w-8 h-8 bg-[#ece7e2] rounded-full"></div>
                        <h1 className="font-bold text-lg text-[#2d2636] ml-1">
                            My Business
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
                            className="w-full pl-10 pr-10 py-2 bg-white border border-[#ece7e2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b2e9df] text-[#2d2636] placeholder-[#b5b0b8] text-base shadow-sm"
                            style={{ fontWeight: 500 }}
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b5b0b8]" />
                        <BellIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b5b0b8]" />
                    </div>
                    <button
                        onClick={() => setIsAddingPage(true)}
                        disabled={isAddingPage}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-full"
                        style={{
                            background: "#7debdc",
                            color: "#2d2636",
                            fontWeight: 600,
                            fontSize: 18,
                            minHeight: 48,
                            boxShadow: "0 2px 8px rgba(125,235,220,0.08)",
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
                                        ? "bg-[#e3e1df] text-[#2d2636]"
                                        : "text-[#2d2636] hover:bg-[#ece7e2]"
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
                                                ? "bg-[#b2e9df]"
                                                : "bg-white"
                                        }`}
                                    >
                                        <DocumentIcon
                                            className={`w-6 h-6 ${
                                                activePageId === page.id
                                                    ? "text-[#2d2636]"
                                                    : "text-[#b5b0b8]"
                                            }`}
                                        />
                                    </span>
                                    <span className="truncate">
                                        {page.name}
                                    </span>
                                </div>
                                <MoreVerticalIcon className="w-6 h-6 text-[#b5b0b8]" />
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
                                className="w-full text-base bg-white border border-[#7debdc] rounded-xl px-3 py-2 outline-none ring-2 ring-[#b2e9df] text-[#2d2636]"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setIsAddingPage(false)}
                                    className="px-3 py-1 text-xs font-semibold text-[#2d2636] rounded-md hover:bg-[#ece7e2]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePage}
                                    className="px-3 py-1 text-xs font-semibold text-white bg-[#7debdc] rounded-md hover:bg-[#5fd3c6]"
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
