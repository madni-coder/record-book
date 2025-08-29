import React, { useState, useRef, useEffect } from "react";
import { PlusIcon } from "./icons";
// Add this import for a check icon (or use your own icon)
import { CheckIcon } from "./icons";
import type { Page } from "../types";

interface HeaderProps {
    activePage: Page;
    pages: Page[];
    activePageId: string;
    setActivePageId: (id: string) => void;
    onAddPage: () => void;
    onDeletePage: (id: string) => void;
    toggleSidebar: () => void;
    setPages: React.Dispatch<React.SetStateAction<Page[]>>; // <-- Add this prop
}

const Header: React.FC<HeaderProps> = ({
    activePage,
    pages,
    activePageId,
    setActivePageId,
    onAddPage,
    onDeletePage,
    toggleSidebar,
    setPages, // <-- Accept setPages from parent
}) => {
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{
        pageId: string;
        x: number;
        y: number;
    } | null>(null);
    const [renameTarget, setRenameTarget] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const contextMenuRef = useRef<HTMLDivElement | null>(null);

    // Close context menu on outside click
    useEffect(() => {
        if (!contextMenu) return;
        const handleClick = (e: MouseEvent) => {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(e.target as Node)
            ) {
                setContextMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [contextMenu]);

    // Auto focus and select input when renaming
    const renameInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        if (renameTarget && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [renameTarget]);

    // Handle rename submit and auto-save
    const handleRename = (pageId: string) => {
        // Add debugging logs to verify the rename process
        console.log("Renaming page:", pageId, "New name:", renameValue);
        console.log("Pages before rename:", pages);

        const trimmed = renameValue.trim();
        if (trimmed && trimmed !== pages.find((p) => p.id === pageId)?.name) {
            setPages((prevPages) =>
                prevPages.map((p) =>
                    p.id === pageId ? { ...p, name: trimmed } : p
                )
            );
        }
        setRenameTarget(null);
        setRenameValue("");
    };

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
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({
                                pageId: page.id,
                                x: e.clientX,
                                y: e.clientY,
                            });
                        }}
                    >
                        {renameTarget === page.id ? (
                            <div className="flex items-center w-full">
                                <input
                                    ref={renameInputRef}
                                    type="text"
                                    value={renameValue}
                                    autoFocus
                                    onChange={(e) =>
                                        setRenameValue(e.target.value)
                                    }
                                    onBlur={() => handleRename(page.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleRename(page.id);
                                        }
                                        if (e.key === "Escape") {
                                            setRenameTarget(null);
                                            setRenameValue("");
                                        }
                                    }}
                                    className="rounded-t-xl border border-blue-400 px-3 py-2 text-blue-900 font-bold bg-white flex-1"
                                    style={{
                                        minWidth: 130,
                                        maxWidth: 220,
                                        height: 48,
                                        fontSize: "1.35rem",
                                    }}
                                />
                                <button
                                    type="button"
                                    className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200 border border-blue-300"
                                    style={{
                                        height: 32,
                                        width: 32,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleRename(page.id);
                                    }}
                                    tabIndex={-1}
                                    aria-label="Save"
                                    // Add a handler for the right button click to save the rename value
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        handleRename(page.id);
                                    }}
                                >
                                    <CheckIcon className="w-5 h-5 text-blue-700" />
                                </button>
                            </div>
                        ) : (
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
                                    paddingRight: 32,
                                }}
                            >
                                {page.name}
                            </button>
                        )}
                        {/* Context menu rendered absolutely at viewport (over everything) */}
                        {contextMenu && contextMenu.pageId === page.id && (
                            <div
                                ref={contextMenuRef}
                                className="fixed z-50 bg-white border border-gray-200 rounded shadow-lg min-w-[140px] py-1"
                                style={{
                                    top: contextMenu.y,
                                    left: contextMenu.x,
                                    minWidth: 140,
                                }}
                            >
                                <button
                                    className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50"
                                    onClick={() => {
                                        setRenameTarget(page.id);
                                        setRenameValue(page.name);
                                        setContextMenu(null);
                                    }}
                                >
                                    Rename
                                </button>
                                <div className="border-t my-1" />
                                <button
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                                    onClick={() => {
                                        setContextMenu(null);
                                        onDeletePage(page.id);
                                    }}
                                >
                                    Delete
                                </button>
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
