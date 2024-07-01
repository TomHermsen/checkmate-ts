export type Rule =
  | 'required'
  | 'string'
  | `min:${number}`
  | `max:${number}`
  | `in:${string}`
  | 'number'
  | 'array'
  | 'boolean'
  | 'numeric'
  | 'email';

