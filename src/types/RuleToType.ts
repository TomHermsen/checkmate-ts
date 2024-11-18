import {Rule} from './Rule'

export type RuleToType<R> =
  R extends 'string' ? string :
    R extends 'number' ? number :
      R extends 'boolean' ? boolean :
        R extends 'array' ? any[] :
          R extends `min:${string}` | `max:${string}` ? number | string :
            R extends 'nullable' ? null :
              any;

export type InferFieldType<Rules extends Rule[]> = Rules[number] extends 'nullable'
  ? RuleToType<Exclude<Rules[number], 'nullable'>> | null
  : RuleToType<Rules[number]>;
