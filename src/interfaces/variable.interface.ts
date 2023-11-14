export interface BooleanVariableI {
  n_distinct: number;
  p_distinct: number;
  is_unique: boolean;
  n_unique: number;
  p_unique: number;
  type: string;
  hashable: true;
  ordering: true;
  n_missing: number;
  n: number;
  p_missing: number;
  count: number;
  memory_size: number;
  plot: any;
}

export interface NumericVariableI {
  n_distinct: number;
  p_distinct: number;
  is_unique: boolean;
  n_unique: number;
  p_unique: number;
  type: string;
  hashable: boolean;
  ordering: boolean;
  n_missing: number;
  n: number;
  p_missing: number;
  count: number;
  memory_size: number;
  n_negative: number;
  p_negative: number;
  n_infinite: number;
  n_zeros: number;
  mean: number;
  std: number;
  variance: number;
  min: number;
  max: number;
  kurtosis: number;
  skewness: number;
  sum: number;
  mad: number;
  range: number;
  "5%": number;
  "25%": number;
  "50%": number;
  "75%": number;
  "95%": number;
  iqr: number;
  cv: number;
  p_zeros: number;
  p_infinite: number;
  monotonic_increase: boolean;
  monotonic_decrease: boolean;
  monotonic_increase_strict: boolean;
  monotonic_decrease_strict: boolean;
  monotonic: number;
  plot: any;
}

export interface CategoricalVariableI {
  n_distinct: number;
  p_distinct: number;
  is_unique: boolean;
  n_unique: number;
  p_unique: number;
  type: string;
  hashable: true;
  ordering: true;
  n_missing: number;
  n: number;
  p_missing: number;
  count: number;
  memory_size: number;
  first_rows: any;
  chi_squared: any;
  max_length: number;
  mean_length: number;
  median_length: number;
  min_length: number;
  word_counts: any;
  plot: any;
}

export interface TransformedData {
  [key: string]: number;
}
export type Order = "asc" | "desc";
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
