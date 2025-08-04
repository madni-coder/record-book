import React from "react";
import { DocumentIcon, PlusIcon } from "./icons";
import type { Page } from "../types";

interface HeaderProps {
    activePage: Page;
    toggleSidebar: () => void;
    onAddColumn?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    activePage,
    toggleSidebar,
    onAddColumn,
}) => {
    return (
        <header className="h-14 sm:h-16 bg-slate-900 text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-10 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-4">
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
                <h1 className="text-lg sm:text-xl font-bold">AI</h1>
                <div className="h-8 w-px bg-white/25 hidden sm:block"></div>
                <div className="flex items-center gap-2 sm:gap-3">
                    <DocumentIcon className="w-5 h-5 text-white/80" />
                    <h2 className="text-base sm:text-lg font-semibold truncate max-w-[150px] sm:max-w-none">
                        {activePage.name}
                    </h2>
                </div>
            </div>
            <div>
               
            </div>
        </header>
    );
};

export default Header;
