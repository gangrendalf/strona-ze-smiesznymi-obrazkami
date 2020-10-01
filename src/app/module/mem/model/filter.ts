import { FilterType } from './filter-type.enum';

export interface Filter {
    type: FilterType,
    value: string
}
