import React, { useState, useEffect, useRef } from "react";
import type { Page } from "../types";
import {
    PlusIcon,
    SearchIcon,
    BellIcon,
    ChevronDownIcon,
    MoreVerticalIcon,
    DocumentIcon,
    XIcon,
} from "./icons";

interface SidebarProps {
    pages: Page[];
    activePageId: string;
    setActivePageId: (id: string) => void;
    addPage: (name: string) => void;
    deletePage: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    pages,
    activePageId,
    setActivePageId,
    addPage,
    deletePage,
    isOpen,
    setIsOpen,
}) => {
    const [isAddingPage, setIsAddingPage] = useState(false);
    const [newPageName, setNewPageName] = useState("");
    const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
    const deleteMenuRef = useRef<HTMLDivElement | null>(null);
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    // Hide delete option when clicking outside
    useEffect(() => {
        if (!showDeleteId) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                deleteMenuRef.current &&
                !deleteMenuRef.current.contains(event.target as Node)
            ) {
                setShowDeleteId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showDeleteId]);

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setIsOpen]);

    const handleCreatePage = () => {
        const trimmedName = newPageName.trim();
        if (trimmedName) {
            addPage(trimmedName);
            setNewPageName("");
            setIsAddingPage(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleCreatePage();
        } else if (e.key === "Escape") {
            setNewPageName("");
            setIsAddingPage(false);
        }
    };

    const sidebarClasses = isOpen
        ? "fixed inset-y-0 left-0 transform translate-x-0 z-40 transition-transform duration-300 ease-in-out w-72 md:relative md:translate-x-0"
        : "fixed inset-y-0 left-0 transform -translate-x-full z-40 transition-transform duration-300 ease-in-out w-72 md:relative md:translate-x-0";

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <div
                ref={sidebarRef}
                className={`${sidebarClasses} bg-gradient-to-b from-[#2A7B9B] to-[#57C785] flex flex-col flex-shrink-0`}
            >
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full"></div>
                            <h1 className="font-bold text-lg text-white">
                                My Business
                            </h1>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="md:hidden p-1.5 rounded-md text-white hover:bg-white/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                            <ChevronDownIcon className="w-5 h-5 text-white hidden md:block" />
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="relative mb-4">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search Page"
                            className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <BellIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        onClick={() => setIsAddingPage(true)}
                        disabled={isAddingPage}
                        className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Add New Page</span>
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {pages.map((page) => (
                        <div key={page.id} className="relative">
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActivePageId(page.id);
                                    setShowDeleteId(null);
                                }}
                                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activePageId === page.id
                                        ? "bg-white/20 text-white"
                                        : "text-white/90 hover:bg-white/10"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`flex items-center justify-center p-1.5 rounded-md ${
                                            activePageId === page.id
                                                ? "bg-blue-200"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        <DocumentIcon className="w-5 h-5" />
                                    </span>
                                    <span className="truncate">
                                        {page.name}
                                    </span>
                                </div>
                                <button
                                    className="ml-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        setShowDeleteId(
                                            showDeleteId === page.id
                                                ? null
                                                : page.id
                                        );
                                    }}
                                    aria-label="Show page options"
                                >
                                    <MoreVerticalIcon className="w-5 h-5 text-gray-400" />
                                </button>
                            </a>
                            {showDeleteId === page.id && (
                                <div
                                    ref={deleteMenuRef}
                                    className="absolute right-2 top-10 z-10 bg-white border border-gray-200 rounded shadow-md p-2"
                                >
                                    <button
                                        className="text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            deletePage(page.id);
                                            setShowDeleteId(null);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isAddingPage && (
                        <div className="px-3 py-2 mt-1">
                            <input
                                type="text"
                                autoFocus
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={() =>
                                    !newPageName && setIsAddingPage(false)
                                }
                                placeholder="New page name..."
                                className="w-full text-sm bg-white border border-blue-400 rounded-md px-3 py-2 outline-none ring-2 ring-blue-200 text-gray-900"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    onClick={() => setIsAddingPage(false)}
                                    className="px-3 py-1 text-xs font-semibold text-gray-700 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreatePage}
                                    className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    )}
                </nav>
                <div className="p-4 mt-auto">
                    {/* Placeholder for footer items if any */}
                </div>
            </div>
        </>
    );
};

export default Sidebar;
