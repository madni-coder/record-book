import React, { useMemo, useState, useEffect } from "react";
import type { Column, Entry } from "../types";

interface LedgerFooterProps {
    columns: Column[];
    entries: Entry[];
    style?: React.CSSProperties; // <-- add style prop
}

const LedgerFooter: React.FC<LedgerFooterProps> = ({
    columns,
    entries,
    style,
}) => {
    const [isWebView, setIsWebView] = useState(false);

    // Detect if we're in web view
    useEffect(() => {
        const isStandaloneBrowser =
            navigator.userAgent.includes("Chrome") ||
            navigator.userAgent.includes("Firefox") ||
            navigator.userAgent.includes("Safari");

        setIsWebView(isStandaloneBrowser);
    }, []);

    const sums = useMemo(() => {
        // Only show sum for columns whose type is "number"
        return columns
            .filter((col) => col.type === "number")
            .map((col) => {
                const total = entries.reduce((acc, entry) => {
                    const value = entry.data[col.id];
                    if (typeof value === "number") {
                        return acc + value;
                    }
                    return acc;
                }, 0);
                return { name: col.name, total };
            });
    }, [columns, entries]);

    if (sums.length === 0) {
        return null;
    }

    return (
        <div
            className={`flex-shrink-0 bg-gray-50 border-t border-gray-200 ${
                isWebView
                    ? "px-3 sm:px-4 py-1.5 sm:py-2"
                    : "px-4 sm:px-6 py-2 sm:py-3"
            } overflow-x-auto whitespace-nowrap`}
            style={style} // <-- apply style prop
        >
            <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                {sums.map((sum) => (
                    <div
                        key={sum.name}
                        className="flex items-center gap-1 sm:gap-2"
                    >
                        <span
                            className={`font-semibold text-gray-600 ${
                                isWebView
                                    ? "text-xs sm:text-sm"
                                    : "text-sm sm:text-base"
                            }`}
                        >
                            {sum.name}:
                        </span>
                        <span
                            className={`font-bold ${
                                isWebView ? "text-sm" : "text-base sm:text-lg"
                            } text-gray-900`}
                        >
                            {sum.total.toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LedgerFooter;
