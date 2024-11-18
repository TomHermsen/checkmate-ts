import type {Rules} from './Rules'
import {InferFieldType} from './RuleToType'

export type InferRules<T extends Rules> = {
  [K in keyof T]: InferFieldType<T[K]>;
};