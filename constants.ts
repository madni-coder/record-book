import type { Page } from "./types";

export const INITIAL_PAGES: Page[] = [
    {
        id: "ai-page-1",
        name: "Page 1",
        columns: [
            {
                id: "col-sno",
                name: "S.No",
                type: "text",
                width: 1,
                className: "",
            },
            {
                id: "col-a",
                name: "Item",
                type: "text",
                width: 20,
                className: "w-32",
            },
            {
                id: "col-c",
                name: "Total Amount",
                type: "number",
                width: 20,
                className: "w-24",
            },
            // No changes needed here. Render the "+" button in your table header UI after the last column.
        ],
        entries: Array(10)
            .fill(0)
            .map((_, index) => ({
                id: index + 1,
                data: { "col-a": "", "col-c": null },
            })),
    },
];
