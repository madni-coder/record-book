// import React, { useState, useEffect, useRef } from "react";
// import type { Page } from "../types";
// import {
//     PlusIcon,
//     SearchIcon,
//     BellIcon,
//     ChevronDownIcon,
//     MoreVerticalIcon,
//     DocumentIcon,
//     XIcon,
// } from "./icons";

// interface SidebarProps {
//     pages: Page[];
//     activePageId: string;
//     setActivePageId: (id: string) => void;
//     addPage: (name: string) => void;
//     deletePage: (id: string) => void;
//     isOpen: boolean;
//     setIsOpen: (isOpen: boolean) => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//     pages,
//     activePageId,
//     setActivePageId,
//     addPage,
//     deletePage,
//     isOpen,
//     setIsOpen,
// }) => {
//     const [isAddingPage, setIsAddingPage] = useState(false);
//     const [newPageName, setNewPageName] = useState("");
//     const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
//     const deleteMenuRef = useRef<HTMLDivElement | null>(null);
//     const sidebarRef = useRef<HTMLDivElement | null>(null);

//     // Theme toggle state and effect
//     const [theme, setTheme] = useState<"cupcake" | "night">(() => {
//         if (typeof window !== "undefined") {
//             return (
//                 (document.documentElement.getAttribute("data-theme") as
//                     | "cupcake"
//                     | "night") || "cupcake"
//             );
//         }
//         return "cupcake";
//     });

//     useEffect(() => {
//         document.documentElement.setAttribute("data-theme", theme);
//         localStorage.setItem("theme", theme);
//     }, [theme]);

//     useEffect(() => {
//         // On mount, restore theme from localStorage if present
//         const saved = localStorage.getItem("theme");
//         if (saved === "night" || saved === "cupcake") {
//             setTheme(saved);
//             document.documentElement.setAttribute("data-theme", saved);
//         }
//     }, []);

//     // Hide delete option when clicking outside
//     useEffect(() => {
//         if (!showDeleteId) return;
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 deleteMenuRef.current &&
//                 !deleteMenuRef.current.contains(event.target as Node)
//             ) {
//                 setShowDeleteId(null);
//             }
//         };
//         document.addEventListener("mousedown", handleClickOutside);
//         return () =>
//             document.removeEventListener("mousedown", handleClickOutside);
//     }, [showDeleteId]);

//     // Close sidebar when clicking outside on mobile
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (
//                 isOpen &&
//                 sidebarRef.current &&
//                 !sidebarRef.current.contains(event.target as Node)
//             ) {
//                 setIsOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () =>
//             document.removeEventListener("mousedown", handleClickOutside);
//     }, [isOpen, setIsOpen]);

//     const handleCreatePage = () => {
//         const trimmedName = newPageName.trim();
//         if (trimmedName) {
//             addPage(trimmedName);
//             setNewPageName("");
//             setIsAddingPage(false);
//         }
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter") {
//             handleCreatePage();
//         } else if (e.key === "Escape") {
//             setNewPageName("");
//             setIsAddingPage(false);
//         }
//     };

//     const sidebarClasses = isOpen
//         ? "fixed inset-y-0 left-0 transform translate-x-0 z-40 transition-transform duration-300 ease-in-out w-72 md:relative md:translate-x-0"
//         : "fixed inset-y-0 left-0 transform -translate-x-full z-40 transition-transform duration-300 ease-in-out w-72 md:relative md:translate-x-0";

//     return (
//         <>
//             {/* Overlay for mobile */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
//                     onClick={() => setIsOpen(false)}
//                 ></div>
//             )}

//             <div
//                 ref={sidebarRef}
//                 className={`${sidebarClasses} bg-base-200 flex flex-col flex-shrink-0`}
//             >
//                 <div className="p-4 border-b border-base-300">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-2">
//                             {/* Theme toggle button */}
//                             <button
//                                 aria-label="Toggle dark/light mode"
//                                 className="mr-2 p-1.5 rounded-full border border-base-300 bg-base-100 hover:bg-base-300 transition-colors"
//                                 onClick={() =>
//                                     setTheme((prev) =>
//                                         prev === "cupcake"
//                                             ? "night"
//                                             : "cupcake"
//                                     )
//                                 }
//                                 title={
//                                     theme === "cupcake"
//                                         ? "Switch to Dark (Sunset)"
//                                         : "Switch to Light (Cupcake)"
//                                 }
//                             >
//                                 {theme === "cupcake" ? (
//                                     // Sun icon for light mode
//                                     <svg
//                                         className="w-5 h-5 text-yellow-500"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth={2}
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="5"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                         />
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07-1.41-1.41M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41"
//                                         />
//                                     </svg>
//                                 ) : (
//                                     // Moon icon for dark mode
//                                     <svg
//                                         className="w-5 h-5 text-orange-400"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth={2}
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"
//                                         />
//                                     </svg>
//                                 )}
//                             </button>
//                             <div className="w-8 h-8 bg-base-100 rounded-full"></div>
//                             <h1 className="font-bold text-lg text-base-content">
//                                 My Business
//                             </h1>
//                         </div>
//                         <div className="flex items-center">
//                             <button
//                                 className="md:hidden p-1.5 rounded-md text-base-content hover:bg-base-300"
//                                 onClick={() => setIsOpen(false)}
//                             >
//                                 <XIcon className="w-5 h-5" />
//                             </button>
//                             <ChevronDownIcon className="w-5 h-5 text-base-content hidden md:block" />
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-4">
//                     <div className="relative mb-4">
//                         <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50 pointer-events-none" />
//                         <input
//                             type="text"
//                             placeholder="Search Page"
//                             className="w-full pl-10 pr-10 py-2 bg-base-100 border border-base-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                         />
//                         <BellIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
//                     </div>
//                     <button
//                         onClick={() => setIsAddingPage(true)}
//                         disabled={isAddingPage}
//                         className="w-full btn btn-primary flex items-center justify-center gap-2 py-2 rounded-md disabled:btn-disabled"
//                     >
//                         <PlusIcon className="w-5 h-5" />
//                         <span>Add New Page</span>
//                     </button>
//                 </div>

//                 <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
//                     {pages.map((page) => (
//                         <div key={page.id} className="relative">
//                             <a
//                                 href="#"
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     setActivePageId(page.id);
//                                     setShowDeleteId(null);
//                                 }}
//                                 className={`flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                                     activePageId === page.id
//                                         ? "bg-base-300 text-base-content"
//                                         : "text-base-content/90 hover:bg-base-200"
//                                 }`}
//                             >
//                                 <div className="flex items-center gap-3">
//                                     <span
//                                         className={`flex items-center justify-center p-1.5 rounded-md ${
//                                             activePageId === page.id
//                                                 ? "bg-primary/20"
//                                                 : "bg-base-100"
//                                         }`}
//                                     >
//                                         <DocumentIcon className="w-5 h-5" />
//                                     </span>
//                                     <span className="truncate">
//                                         {page.name}
//                                     </span>
//                                 </div>
//                                 <button
//                                     className="ml-2"
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         e.preventDefault();
//                                         setShowDeleteId(
//                                             showDeleteId === page.id
//                                                 ? null
//                                                 : page.id
//                                         );
//                                     }}
//                                     aria-label="Show page options"
//                                 >
//                                     <MoreVerticalIcon className="w-5 h-5 text-base-content/50" />
//                                 </button>
//                             </a>
//                             {showDeleteId === page.id && (
//                                 <div
//                                     ref={deleteMenuRef}
//                                     className="absolute right-2 top-10 z-10 bg-base-100 border border-base-300 rounded shadow-md p-2"
//                                 >
//                                     <button
//                                         className="text-error text-xs px-2 py-1 rounded hover:bg-error/10"
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             e.preventDefault();
//                                             deletePage(page.id);
//                                             setShowDeleteId(null);
//                                         }}
//                                     >
//                                         Delete
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                     {isAddingPage && (
//                         <div className="px-3 py-2 mt-1">
//                             <input
//                                 type="text"
//                                 autoFocus
//                                 value={newPageName}
//                                 onChange={(e) => setNewPageName(e.target.value)}
//                                 onKeyDown={handleKeyDown}
//                                 onBlur={() =>
//                                     !newPageName && setIsAddingPage(false)
//                                 }
//                                 placeholder="New page name..."
//                                 className="w-full text-sm bg-base-100 border border-primary rounded-md px-3 py-2 outline-none ring-2 ring-primary/50 text-base-content"
//                             />
//                             <div className="flex justify-end gap-2 mt-2">
//                                 <button
//                                     onClick={() => setIsAddingPage(false)}
//                                     className="px-3 py-1 text-xs font-semibold text-base-content rounded-md hover:bg-base-300"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     onClick={handleCreatePage}
//                                     className="px-3 py-1 text-xs font-semibold text-base-100 bg-primary rounded-md hover:bg-primary-focus"
//                                 >
//                                     Add
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </nav>
//                 <div className="p-4 mt-auto">
//                     {/* Placeholder for footer items if any */}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Sidebar;
