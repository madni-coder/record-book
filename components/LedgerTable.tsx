import React, { useState, useMemo, useRef, useEffect } from "react";
import type { Entry, Column } from "../types";
import {
    PlusIcon,
    ChevronDownIcon,
    TextIcon,
    HashtagIcon,
    CalendarIcon,
    CheckIcon,
} from "./icons";

interface LedgerTableProps {
    columns: Column[];
    entries: Entry[];
    setEntries: (entries: Entry[]) => void;
    allEntries: Entry[];
    setColumns: (columns: Column[]) => void;
}

const LedgerTable: React.FC<LedgerTableProps> = ({
    columns,
    entries,
    setEntries,
    allEntries,
    setColumns,
}) => {
    const [editingCell, setEditingCell] = useState<{
        entryId: number;
        columnId: string;
    } | null>(null);
    const [editingHeader, setEditingHeader] = useState<string | null>(null);
    const [editingColumnType, setEditingColumnType] = useState<string | null>(
        null
    );
    const [highlightedTypeIndex, setHighlightedTypeIndex] = useState(0);
    const [resizingState, setResizingState] = useState<{
        columnId: string;
        startX: number;
        startWidth: number;
    } | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isWebView, setIsWebView] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const columnTypes: {
        id: Column["type"];
        name: string;
        icon: React.ReactNode;
    }[] = [
        { id: "text", name: "Text", icon: <TextIcon className="w-4 h-4" /> },
        {
            id: "number",
            name: "Number",
            icon: <HashtagIcon className="w-4 h-4" />,
        },
        {
            id: "date",
            name: "Date",
            icon: <CalendarIcon className="w-4 h-4" />,
        },
    ];

    // Effect to scroll table horizontally on mobile
    useEffect(() => {
        const showScrollHint = () => {
            if (!tableContainerRef.current) return;

            const { scrollWidth, clientWidth } = tableContainerRef.current;
            if (scrollWidth > clientWidth) {
                // Could add visual indicator here if needed
            }
        };

        showScrollHint();
        window.addEventListener("resize", showScrollHint);
        return () => window.removeEventListener("resize", showScrollHint);
    }, []);

    // New, smoother resizing logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizingState) return;

            const deltaX = e.clientX - resizingState.startX;
            const newWidth = resizingState.startWidth + deltaX;

            if (newWidth > 60) {
                // Min width
                const newColumns = columns.map((c) =>
                    c.id === resizingState.columnId
                        ? { ...c, width: newWidth }
                        : c
                );
                setColumns(newColumns);
            }
        };

        const handleMouseUp = () => {
            setResizingState(null);
        };

        if (resizingState) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [resizingState, columns, setColumns]);

    // Effect for closing dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setEditingColumnType(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Effect for keyboard navigation in dropdown
    useEffect(() => {
        if (editingColumnType) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setHighlightedTypeIndex(
                        (prev) => (prev + 1) % columnTypes.length
                    );
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setHighlightedTypeIndex(
                        (prev) =>
                            (prev - 1 + columnTypes.length) % columnTypes.length
                    );
                } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (editingColumnType) {
                        handleUpdateColumnType(
                            editingColumnType,
                            columnTypes[highlightedTypeIndex].id
                        );
                    }
                } else if (e.key === "Escape") {
                    setEditingColumnType(null);
                }
            };
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
        }
    }, [editingColumnType, highlightedTypeIndex, columnTypes]);

    const handleUpdateEntry = (
        entryId: number,
        columnId: string,
        value: string
    ) => {
        const column = columns.find((c) => c.id === columnId);
        let finalValue: string | number | null = value;

        if (column?.type === "number") {
            // Only allow numeric input for number columns
            const sanitizedValue = value.replace(/[^0-9.-]/g, "");
            if (sanitizedValue === "" || sanitizedValue === "-") {
                finalValue = null;
            } else {
                const parsed = parseFloat(sanitizedValue);
                finalValue = isNaN(parsed) ? null : parsed;
            }
        } else if (column?.type === "date") {
            // Ensure valid date format (dd/mm/yyyy)
            if (value) {
                try {
                    // Parse the date to ensure it's valid
                    const dateParts = value.split("/");
                    if (dateParts.length === 3) {
                        // Convert from dd/mm/yyyy to yyyy-mm-dd for storage
                        const day = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10);
                        const year = parseInt(dateParts[2], 10);

                        // Validate date components
                        if (
                            day > 0 &&
                            day <= 31 &&
                            month > 0 &&
                            month <= 12 &&
                            year > 1900
                        ) {
                            // Store in ISO format
                            finalValue = `${year}-${month
                                .toString()
                                .padStart(2, "0")}-${day
                                .toString()
                                .padStart(2, "0")}`;
                        } else {
                            finalValue = "";
                        }
                    } else {
                        finalValue = "";
                    }
                } catch (e) {
                    finalValue = "";
                }
            }
        }

        const updatedEntries = allEntries.map((entry) => {
            if (entry.id === entryId) {
                return {
                    ...entry,
                    data: { ...entry.data, [columnId]: finalValue },
                };
            }
            return entry;
        });
        setEntries(updatedEntries);
        setEditingCell(null);
    };

    const handleAddNewEntry = () => {
        const newId =
            allEntries.length > 0
                ? Math.max(...allEntries.map((e) => e.id), 0) + 1
                : 1;
        const today = new Date().toISOString().split("T")[0];
        const newEntry: Entry = {
            id: newId,
            data: columns.reduce(
                (acc, col) => ({
                    ...acc,
                    [col.id]:
                        col.type === "number"
                            ? null
                            : col.type === "date"
                            ? today
                            : "",
                }),
                {}
            ),
        };
        setEntries([...allEntries, newEntry]);
        return newEntry;
    };

    const handleCellClick = (
        entry: Entry,
        columnId: string,
        isRealEntry: boolean
    ) => {
        if (columnId === "col-sno") return; // S.No column is not editable
        if (columnId === "col-action") {
            // If action column button is clicked, add a new entry
            handleAddNewEntry();
            return;
        }
        if (isRealEntry) {
            setEditingCell({ entryId: entry.id, columnId });
        } else {
            const newEntry = handleAddNewEntry();
            setEditingCell({ entryId: newEntry.id, columnId });
        }
    };

    const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    const handleCellKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        entryId: number,
        columnId: string
    ) => {
        if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();

            // Check if this is the last row in the table
            const entryIndex = entries.findIndex(
                (entry) => entry.id === entryId
            );
            if (entryIndex === entries.length - 1) {
                // Create a new row
                const newEntry = handleAddNewEntry();
                // Focus the same column in the new row
                setTimeout(() => {
                    setEditingCell({ entryId: newEntry.id, columnId });
                }, 10);
            }
        } else if (e.key === "Tab") {
            e.preventDefault();

            const visibleColumns = columns.filter((c) => c.id !== "col-sno");
            let currentColumnIndex = visibleColumns.findIndex(
                (c) => c.id === columnId
            );
            let currentEntryIndex = displayEntries.findIndex(
                (en) => en.id === entryId
            );

            // Trigger blur to save the current cell's value.
            // The subsequent setEditingCell will override the one in onBlur because of React's state batching.
            e.currentTarget.blur();

            if (e.shiftKey) {
                // Move left (Shift + Tab)
                if (currentColumnIndex > 0) {
                    const prevColumn = visibleColumns[currentColumnIndex - 1];
                    setEditingCell({ entryId, columnId: prevColumn.id });
                } else if (currentEntryIndex > 0) {
                    // Wrap to previous row
                    const prevEntry = displayEntries[currentEntryIndex - 1];
                    if (prevEntry.id > 0) {
                        // Ensure it's not a placeholder
                        const lastColumn =
                            visibleColumns[visibleColumns.length - 1];
                        setEditingCell({
                            entryId: prevEntry.id,
                            columnId: lastColumn.id,
                        });
                    }
                }
            } else {
                // Move right (Tab)
                if (currentColumnIndex < visibleColumns.length - 1) {
                    const nextColumn = visibleColumns[currentColumnIndex + 1];
                    setEditingCell({ entryId: nextColumn.id });
                } else if (currentEntryIndex < displayEntries.length - 1) {
                    // Wrap to next row
                    let nextEntry = displayEntries[currentEntryIndex + 1];
                    // If the next row is a placeholder, create a real entry
                    if (nextEntry.id < 0) {
                        nextEntry = handleAddNewEntry();
                    }
                    const firstColumn = visibleColumns[0];
                    setEditingCell({
                        entryId: nextEntry.id,
                        columnId: firstColumn.id,
                    });
                }
            }
        }
    };

    const handleUpdateHeader = (columnId: string, newName: string) => {
        const updatedColumns = columns.map((col) =>
            col.id === columnId ? { ...col, name: newName } : col
        );
        setColumns(updatedColumns);
        setEditingHeader(null);
    };

    const handleUpdateColumnType = (columnId: string, type: Column["type"]) => {
        const updatedColumns = columns.map((c) =>
            c.id === columnId ? { ...c, type } : c
        );
        setColumns(updatedColumns);

        const updatedEntries = allEntries.map((entry) => {
            const newData = { ...entry.data };
            if (type === "number") {
                const parsed = parseFloat(String(newData[columnId]));
                newData[columnId] = isNaN(parsed) ? null : parsed;
            } else if (type === "text") {
                newData[columnId] = String(newData[columnId] ?? "");
            }
            return { ...entry, data: newData };
        });
        setEntries(updatedEntries);

        setEditingColumnType(null);
    };

    const handleAddColumn = () => {
        const newColId = `col-${Date.now()}`;
        const newColumn: Column = {
            id: newColId,
            name: `Column ${String.fromCharCode(65 + columns.length - 2)}`, // -2 for S.No and action column
            type: "text",
            width: 120,
        };

        // Insert the new column before the action column
        const actionColumnIndex = columns.findIndex(
            (col) => col.type === "action"
        );
        if (actionColumnIndex > 0) {
            const updatedColumns = [
                ...columns.slice(0, actionColumnIndex),
                newColumn,
                ...columns.slice(actionColumnIndex),
            ];

            // Update entries to include the new column
            const updatedEntries = allEntries.map((entry) => ({
                ...entry,
                data: { ...entry.data, [newColId]: "" },
            }));

            setColumns(updatedColumns);
            setEntries(updatedEntries);
        }
    };

    // Add column to the right of "Total Amount" (and after any previously added columns)
    const handleAddColumnRightOfTotalAmount = () => {
        // Find the last "Total Amount" or added column after it
        let totalAmountIndex = columns.findIndex(
            (col) => col.name === "Total Amount"
        );
        // Find all columns after "Total Amount" that were added by this button (by name pattern)
        let afterTotalColumns = columns
            .slice(totalAmountIndex + 1)
            .filter((col) => col.name.startsWith("Column "));
        // Insert after the last such column
        let insertIndex = totalAmountIndex + afterTotalColumns.length + 1;

        const totalAmountCol = columns[totalAmountIndex];
        const newColId = `col-${Date.now()}`;
        const newColumn: Column = {
            id: newColId,
            name: `Column ${String.fromCharCode(
                65 + columns.length - 2 + afterTotalColumns.length
            )}`,
            type: "text",
            width: totalAmountCol?.width || 120,
        };

        const updatedColumns = [
            ...columns.slice(0, insertIndex),
            newColumn,
            ...columns.slice(insertIndex),
        ];

        const updatedEntries = allEntries.map((entry) => ({
            ...entry,
            data: { ...entry.data, [newColId]: "" },
        }));

        setColumns(updatedColumns);
        setEntries(updatedEntries);
    };

    // Helper to get all columns up to and after "Total Amount" and any added columns after it
    const getDisplayedColumns = () => {
        const totalAmountIndex = columns.findIndex(
            (col) => col.name === "Total Amount"
        );
        // Include all columns up to "Total Amount"
        let displayed = columns.slice(0, totalAmountIndex + 1);
        // Include any columns after "Total Amount" that match our added column pattern
        let afterTotalColumns = columns
            .slice(totalAmountIndex + 1)
            .filter((col) => col.name.startsWith("Column "));
        return [...displayed, ...afterTotalColumns];
    };

    // Calculate optimal row height based on screen size and environment
    const getRowHeight = () => {
        return "h-[40px]";
    };

    // Calculate optimal cell padding based on screen size and environment
    const getCellPadding = (isHeader: boolean = false) => {
        return isHeader ? "px-4 py-3" : "px-4 py-3";
    };

    // Get font size based on environment
    const getFontSize = (isHeader: boolean = false) => {
        return "text-[20px]";
    };

    // Determine number of rows to display
    const getVisibleRowCount = () => {
        return 10;
    };

    const displayEntries = useMemo(() => {
        // Show all entries, not just the first 10
        return entries;
    }, [entries]);

    const onResizeStart = (columnId: string, e: React.MouseEvent) => {
        e.preventDefault();
        const startWidth = columns.find((c) => c.id === columnId)?.width || 120;
        setResizingState({
            columnId,
            startX: e.clientX,
            startWidth,
        });
    };

    // Check for mobile view and web environment
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };

        // Detect if we're running in a browser
        const checkWebView = () => {
            // Check if running in a normal browser environment (not in a WebView)
            // This is a simplistic check - in a real app you might need more sophisticated detection
            const isStandaloneBrowser =
                navigator.userAgent.includes("Chrome") ||
                navigator.userAgent.includes("Firefox") ||
                navigator.userAgent.includes("Safari");

            setIsWebView(isStandaloneBrowser);
        };

        checkMobile();
        checkWebView();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleAddColumnAtEnd = () => {
        const newColId = `col-${Date.now()}`;
        const newColumn: Column = {
            id: newColId,
            name: `Column ${String.fromCharCode(65 + columns.length)}`,
            type: "text",
            width: 120,
        };

        // Add new column at the end
        const updatedColumns = [...columns, newColumn];

        // Update entries to include the new column
        const updatedEntries = allEntries.map((entry) => ({
            ...entry,
            data: { ...entry.data, [newColId]: "" },
        }));

        setColumns(updatedColumns);
        setEntries(updatedEntries);
    };

    const handleDeleteColumn = (columnId: string) => {
        // Remove column from columns array
        const updatedColumns = columns.filter((col) => col.id !== columnId);
        // Remove column data from all entries
        const updatedEntries = allEntries.map((entry) => {
            const newData = { ...entry.data };
            delete newData[columnId];
            return { ...entry, data: newData };
        });
        setColumns(updatedColumns);
        setEntries(updatedEntries);
        setEditingColumnType(null);
    };

    // Add this function to toggle the column type dropdown
    const toggleColumnTypeEditor = (columnId: string) => {
        setEditingColumnType((prev) => (prev === columnId ? null : columnId));
        setHighlightedTypeIndex(0);
    };

    return (
        <div
            className="w-full border border-gray-700 rounded-lg overflow-hidden"
            style={{ background: "#ffffe6" }}
        >
            <div
                ref={tableContainerRef}
                className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 pb-1.5"
            >
                <div className="min-w-full">
                    <table
                        className="w-full text-left text-gray-700 border-collapse table-fixed"
                        style={{ background: "#ffffe6" }}
                    >
                        <thead
                            className={`bg-gray-100 text-gray-800 font-medium ${getFontSize(
                                true
                            )}`}
                            style={{ background: "#ffffe6" }}
                        >
                            <tr>
                                {getDisplayedColumns().map((col, idx) => (
                                    <th
                                        key={col.id}
                                        scope="col"
                                        style={{
                                            width:
                                                col.name === "Total Amount"
                                                    ? "500px" // Increased width for Total Amount
                                                    : col.width
                                                    ? `${col.width}px`
                                                    : "auto",
                                            border: "1px solid #374151",
                                        }}
                                        className={`${getCellPadding(
                                            true
                                        )} border-r border-gray-700 relative`}
                                    >
                                        {/* Remove the plus button from the action column header and "Total Amount" column */}
                                        {col.type === "action" &&
                                        col.isAddColumn ? null : (
                                            <>
                                                {/* ...existing header content for non-action columns... */}
                                                {editingHeader === col.id ? (
                                                    <input
                                                        type="text"
                                                        defaultValue={col.name}
                                                        autoFocus
                                                        onBlur={(e) =>
                                                            handleUpdateHeader(
                                                                col.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        onKeyDown={
                                                            handleHeaderKeyDown
                                                        }
                                                        className={`w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 outline-none -my-1 -mx-2 ${getFontSize()}`}
                                                    />
                                                ) : (
                                                    <div className="flex items-center gap-1 sm:gap-2 group">
                                                        {/* ...existing icon code... */}
                                                        <span
                                                            className={`truncate flex-1 ${
                                                                col.id !==
                                                                    "col-sno" &&
                                                                "cursor-pointer"
                                                            }`}
                                                            onClick={() =>
                                                                col.id !==
                                                                    "col-sno" &&
                                                                setEditingHeader(
                                                                    col.id
                                                                )
                                                            }
                                                        >
                                                            {col.name}
                                                        </span>
                                                        {/* Dropdown for column type */}
                                                        {col.id !==
                                                            "col-sno" && (
                                                            <div
                                                                className="ml-auto relative"
                                                                ref={
                                                                    editingColumnType ===
                                                                    col.id
                                                                        ? dropdownRef
                                                                        : null
                                                                }
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        toggleColumnTypeEditor(
                                                                            col.id
                                                                        )
                                                                    }
                                                                    className="p-0.5 sm:p-1 rounded-full group-hover:bg-gray-200"
                                                                    tabIndex={0}
                                                                >
                                                                    <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600" />
                                                                </button>
                                                                {editingColumnType ===
                                                                    col.id && (
                                                                    <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[120px]">
                                                                        {columnTypes.map(
                                                                            (
                                                                                type,
                                                                                i
                                                                            ) => (
                                                                                <button
                                                                                    key={
                                                                                        type.id
                                                                                    }
                                                                                    type="button"
                                                                                    className={`flex items-center w-full px-3 py-2 text-left hover:bg-blue-50 ${
                                                                                        highlightedTypeIndex ===
                                                                                        i
                                                                                            ? "bg-blue-100"
                                                                                            : ""
                                                                                    }`}
                                                                                    onClick={() =>
                                                                                        handleUpdateColumnType(
                                                                                            col.id,
                                                                                            type.id
                                                                                        )
                                                                                    }
                                                                                    onMouseEnter={() =>
                                                                                        setHighlightedTypeIndex(
                                                                                            i
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        type.icon
                                                                                    }
                                                                                    <span className="ml-2">
                                                                                        {
                                                                                            type.name
                                                                                        }
                                                                                    </span>
                                                                                    {col.type ===
                                                                                        type.id && (
                                                                                        <CheckIcon className="ml-auto w-4 h-4 text-blue-600" />
                                                                                    )}
                                                                                </button>
                                                                            )
                                                                        )}
                                                                        {/* Add Delete Column option */}
                                                                        <button
                                                                            type="button"
                                                                            className="flex items-center w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 border-t border-gray-100"
                                                                            onClick={() =>
                                                                                handleDeleteColumn(
                                                                                    col.id
                                                                                )
                                                                            }
                                                                            onMouseEnter={() =>
                                                                                setHighlightedTypeIndex(
                                                                                    -1
                                                                                )
                                                                            } // Prevent highlight
                                                                        >
                                                                            Delete
                                                                            Column
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {col.id !== "col-sno" &&
                                            col.type !== "action" && (
                                                <div
                                                    onMouseDown={(e) =>
                                                        onResizeStart(col.id, e)
                                                    }
                                                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10"
                                                />
                                            )}
                                    </th>
                                ))}
                                {/* "+" button always after "Total Amount" and any added columns */}
                                <th className="p-0 bg-transparent border-none align-top">
                                    <button
                                        type="button"
                                        onClick={
                                            handleAddColumnRightOfTotalAmount
                                        }
                                        className="w-14 h-10 bg-blue-900 text-white text-2xl font-bold rounded-none flex items-center justify-center"
                                        aria-label="Add column"
                                    >
                                        +
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            style={{ background: "#ffffe6" }}
                        >
                            {displayEntries.map((entry, index) => {
                                const isRealEntry = entry.id > 0;
                                return (
                                    <tr
                                        key={entry.id}
                                        className={`bg-white border-b border-gray-700 last:border-b-0 hover:bg-gray-50 ${getRowHeight()}`}
                                    >
                                        {getDisplayedColumns().map((col) => {
                                            if (col.type === "action") {
                                                return (
                                                    <td
                                                        key={col.id}
                                                        className="border-r border-gray-200"
                                                    >
                                                        {/* No + buttons in data cells anymore */}
                                                    </td>
                                                );
                                            }

                                            const column = columns.find(
                                                (c) => c.id === col.id
                                            );
                                            const cellValue = isRealEntry
                                                ? entry.data[col.id]
                                                : "";
                                            return (
                                                <td
                                                    key={col.id}
                                                    style={{
                                                        border: "1px solid #374151", // dark grey border
                                                    }}
                                                    className={`${getCellPadding()} border-r border-gray-700 ${
                                                        col.id === "col-sno"
                                                            ? "text-center text-gray-500"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        !editingCell &&
                                                        handleCellClick(
                                                            entry,
                                                            col.id,
                                                            isRealEntry
                                                        )
                                                    }
                                                >
                                                    {/* ...existing cell content code... */}
                                                    {editingCell?.entryId ===
                                                        entry.id &&
                                                    editingCell?.columnId ===
                                                        col.id ? (
                                                        <>
                                                            {column?.type ===
                                                            "date" ? (
                                                                <input
                                                                    type="text"
                                                                    placeholder="dd/mm/yyyy"
                                                                    defaultValue={
                                                                        cellValue
                                                                            ? new Date(
                                                                                  String(
                                                                                      cellValue
                                                                                  )
                                                                              ).toLocaleDateString(
                                                                                  "en-GB"
                                                                              )
                                                                            : ""
                                                                    }
                                                                    autoFocus
                                                                    onBlur={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateEntry(
                                                                            entry.id,
                                                                            col.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e
                                                                    ) =>
                                                                        handleCellKeyDown(
                                                                            e,
                                                                            entry.id,
                                                                            col.id
                                                                        )
                                                                    }
                                                                    className={`w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 outline-none -my-1 -mx-2 ${getFontSize()}`}
                                                                />
                                                            ) : column?.type ===
                                                              "number" ? (
                                                                <input
                                                                    type="text"
                                                                    inputMode="numeric"
                                                                    pattern="[0-9]*"
                                                                    defaultValue={String(
                                                                        cellValue ??
                                                                            ""
                                                                    )}
                                                                    autoFocus
                                                                    onBlur={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateEntry(
                                                                            entry.id,
                                                                            col.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e
                                                                    ) =>
                                                                        handleCellKeyDown(
                                                                            e,
                                                                            entry.id,
                                                                            col.id
                                                                        )
                                                                    }
                                                                    className={`w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 outline-none -my-1 -mx-2 ${getFontSize()}`}
                                                                />
                                                            ) : (
                                                                <input
                                                                    type="text"
                                                                    defaultValue={String(
                                                                        cellValue ??
                                                                            ""
                                                                    )}
                                                                    autoFocus
                                                                    onBlur={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateEntry(
                                                                            entry.id,
                                                                            col.id,
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    onKeyDown={(
                                                                        e
                                                                    ) =>
                                                                        handleCellKeyDown(
                                                                            e,
                                                                            entry.id,
                                                                            col.id
                                                                        )
                                                                    }
                                                                    className={`w-full bg-blue-50 border border-blue-300 rounded px-2 py-1 outline-none -my-1 -mx-2 ${getFontSize()}`}
                                                                />
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span
                                                            className={`block ${
                                                                isWebView
                                                                    ? "min-h-[20px] sm:min-h-[22px]"
                                                                    : "min-h-[24px] sm:min-h-[26px]"
                                                            } truncate ${
                                                                isRealEntry
                                                                    ? "font-medium"
                                                                    : ""
                                                            } ${getFontSize()}`}
                                                        >
                                                            {col.id ===
                                                            "col-sno"
                                                                ? isRealEntry
                                                                    ? index + 1
                                                                    : ""
                                                                : column?.type ===
                                                                      "date" &&
                                                                  cellValue
                                                                ? new Date(
                                                                      String(
                                                                          cellValue
                                                                      )
                                                                  ).toLocaleDateString(
                                                                      "en-GB"
                                                                  ) // dd/mm/yyyy format
                                                                : cellValue}
                                                        </span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {/* Remove the extra <td> at the end */}
                                        {/* <td ...></td> */}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LedgerTable;
