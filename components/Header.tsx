import React, { useState } from "react";
import { PlusIcon, XIcon } from "./icons";
import type { Page } from "../types";

interface HeaderProps {
    activePage: Page;
    pages: Page[];
    activePageId: string;
    setActivePageId: (id: string) => void;
    onAddPage: () => void;
    onDeletePage: (id: string) => void;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
    activePage,
    pages,
    activePageId,
    setActivePageId,
    onAddPage,
    onDeletePage,
    toggleSidebar,
}) => {
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    return (
        <header className="h-16 bg-gradient-to-r from-[#2A7B9B] via-[#57C785] to-[#EDDD53] text-white flex flex-col justify-end px-0 shadow-md z-10 flex-shrink-0">
            <div className="flex items-center px-4 sm:px-6 h-full">
                <button
                    onClick={toggleSidebar}
                    className="md:hidden p-1.5 rounded-md text-white hover:bg-slate-700 transition-colors"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
                <div className="flex-1"></div>
            </div>
            {/* Tab bar */}
            <div
                className="flex items-end bg-cream px-4 py-2 border-t border-gray-200 overflow-x-auto shadow"
                style={{ minHeight: 60 }}
            >
                {pages.map((page, idx) => (
                    <div
                        key={page.id}
                        className="relative flex items-center group"
                        style={{ minWidth: 130, maxWidth: 220, height: 48 }}
                    >
                        <button
                            onClick={() => setActivePageId(page.id)}
                            className={`relative flex items-center justify-center rounded-t-xl border border-b-0 transition-all duration-150
                                ${
                                    page.id === activePageId
                                        ? "bg-white text-blue-900 font-extrabold border-blue-700 border-l-4 shadow-lg z-10"
                                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50"
                                }
                            `}
                            style={{
                                minWidth: 130,
                                maxWidth: 220,
                                height: 48,
                                fontSize: "1.35rem",
                                padding: "0 32px",
                                boxShadow:
                                    page.id === activePageId
                                        ? "0 4px 16px rgba(0,0,0,0.10)"
                                        : undefined,
                                borderLeftWidth:
                                    page.id === activePageId ? 6 : 1,
                                paddingRight: pages.length > 1 ? 40 : 32, // space for X
                            }}
                        >
                            {page.name}
                        </button>
                        {/* X button, only if more than 1 sheet */}
                        {pages.length > 1 && (
                            <button
                                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-1 border border-gray-300 hover:bg-red-100 hover:text-red-600 z-20"
                                style={{
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                onClick={() => setDeleteTarget(page.id)}
                                tabIndex={-1}
                                aria-label="Delete Sheet"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        )}
                        {/* Delete confirmation popup */}
                        {deleteTarget === page.id && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-white border border-gray-300 rounded shadow-lg px-4 py-3 flex flex-col items-center min-w-[180px]">
                                <span className="text-gray-800 mb-2 text-base">
                                    Delete this sheet?
                                </span>
                                <div className="flex gap-3">
                                    <button
                                        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                        onClick={() => {
                                            setDeleteTarget(null);
                                            onDeletePage(page.id);
                                        }}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        onClick={() => setDeleteTarget(null)}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <button
                    onClick={onAddPage}
                    className="ml-3 flex items-center justify-center rounded-t-xl bg-gray-100 border border-b-0 border-gray-200 hover:bg-blue-50 transition-all duration-150"
                    aria-label="Add Sheet"
                    style={{
                        minWidth: 60,
                        height: 48,
                        fontSize: "1.5rem",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        marginBottom: 0,
                    }}
                >
                    <PlusIcon className="w-8 h-8 text-blue-700" />
                </button>
            </div>
        </header>
    );
};

export default Header;
