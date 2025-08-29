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
                width: 80,
                className: "",
            },
            {
                id: "col-a",
                name: "Item",
                type: "text",
                width: 220,
                className: "w-32",
            },
            {
                id: "col-c",
                name: "Total Amount",
                type: "number",
                width: 220,
                className: "w-24",
            },
            // No action column here - we'll add it dynamically in the UI
        ],
        entries: Array(10)
            .fill(0)
            .map((_, index) => ({
                id: index + 1,
                data: {
                    "col-a": "Item " + (index + 1),
                    "col-c": (index + 1) * 100,
                },
            })),
    },
];
