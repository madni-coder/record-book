import type { Column, FilterOperatorId } from '../types';

interface Operator {
    id: FilterOperatorId;
    name: string;
}

export const FILTER_OPERATORS: Record<Column['type'], Operator[]> = {
  text: [
    { id: 'contains', name: 'Contains' },
    { id: 'not_contains', name: 'Does not contain' },
    { id: 'is_equal', name: 'Is equal to' },
    { id: 'is_not_equal', name: 'Is not equal to' },
  ],
  number: [
    { id: 'is_equal', name: 'Is equal to' },
    { id: 'is_not_equal', name: 'Is not equal to' },
    { id: 'gt', name: 'Greater than' },
    { id: 'lt', name: 'Less than' },
  ],
  date: [
    { id: 'is_on', name: 'Is on' },
    { id: 'is_not_on', name: 'Is not on' },
    { id: 'is_before', name: 'Is before' },
    { id: 'is_after', name: 'Is after' },
  ],
};
