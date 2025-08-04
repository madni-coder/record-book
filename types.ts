export type FilterOperatorId =
    | "contains"
    | "not_contains"
    | "is_equal"
    | "is_not_equal"
    | "gt"
    | "lt"
    | "is_on"
    | "is_not_on"
    | "is_before"
    | "is_after";

export interface FilterCondition {
    id: string;
    columnId: string;
    operator: FilterOperatorId;
    value: string | number;
}

export interface Column {
    id: string;
    name: string;
    type: "text" | "number" | "date" | "action";
    width?: number;
    className?: string;
    isAddColumn?: boolean; // New property to identify add-column action columns
}

export interface Entry {
    id: number;
    data: Record<string, string | number | null>;
}

export interface Page {
    id: string;
    name: string;
    columns: Column[];
    entries: Entry[];
}
