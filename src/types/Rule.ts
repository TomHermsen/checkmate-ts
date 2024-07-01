export type Rule =
  | 'required'
  | 'string'
  | `min:${number}`
  | `max:${number}`
  | 'number'
  | 'array'
  | 'boolean'
  | 'numeric'
  | 'email';

