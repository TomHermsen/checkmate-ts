import type {Rule} from './types/Rule'
import type {Rules} from './types/Rules'
import {ValidationError} from './exceptions/ValidationError'
import {validateRequired} from './validators/required'
import {validateString} from './validators/string'
import {validateNumber} from './validators/number'
import {validateBoolean} from './validators/boolean'
import {validateNumeric} from './validators/numeric'
import {validateEmail} from './validators/email'
import {validateMin} from './validators/min'
import {validateMax} from './validators/max'
import {validateIn} from './validators/in'
import {validateArray} from './validators/array'

class Validator<R extends Rules> {
  private rules: R

  constructor(rules: R) {
    this.rules = rules
  }

  static create<R extends Rules>(rules: R) {
    return new this(rules)
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => {
      if (part === '*') {
        if (!Array.isArray(acc)) {
          return undefined
        }
        return acc
      }
      return acc && acc[part]
    }, obj)
  }

  private validateField(key: string, value: any, rules: Rule[], errors: { [key: string]: string[] }) {
    const isNullable = rules.includes('nullable')

    rules.forEach(rule => {
      if (isNullable && value == null) {
        return // If the rule allows `null` values & the value is `null`, skip validating
      }

      if (rule === 'required') {
        validateRequired(key, value, errors)
      } else if (rule === 'string') {
        validateString(key, value, errors)
      } else if (rule === 'number') {
        validateNumber(key, value, errors)
      } else if (rule === 'boolean') {
        validateBoolean(key, value, errors)
      } else if (rule === 'numeric') {
        validateNumeric(key, value, errors)
      } else if (rule === 'email') {
        validateEmail(key, value, errors)
      } else if (rule === 'array') {
        validateArray(key, value, errors)
      } else if (rule.startsWith('min:')) {
        const minLength = parseInt(rule.split(':')[1], 10)
        validateMin(key, value, minLength, errors)
      } else if (rule.startsWith('max:')) {
        const maxLength = parseInt(rule.split(':')[1], 10)
        validateMax(key, value, maxLength, errors)
      } else if (rule.startsWith('in:')) {
        const options = rule.split(':')[1].split(',')
        validateIn(key, value, options, errors)
      } else {
        throw new Error(`Rule ${rule} for field ${key} is invalid!`)
      }
    })
  }

  private validateArray(key: string, array: any[], errors: { [key: string]: string[] }) {
    array.forEach((_, index) => {
      Object.entries(this.rules).forEach(([ruleKey, ruleValues]) => {
        const arrayRuleKey = ruleKey.replace('.*', `[${index}]`)
        if (arrayRuleKey.startsWith(`${key}[${index}]`)) {
          const nestedKey = arrayRuleKey.slice(`${key}[${index}].`.length)
          const nestedValue = this.getNestedValue(array, `${index}${nestedKey ? '.' + nestedKey : ''}`)
          this.validateField(`${key}[${index}]${nestedKey ? '.' + nestedKey : ''}`, nestedValue, ruleValues, errors)
        }
      })
    })
  }

  private validate<T>(data: object): T {
    let errors: { [key: string]: string[] } = {}
    Object.entries(this.rules).forEach(([key, rules]) => {
      const value = this.getNestedValue(data, key)

      if (key.includes('.*')) {
        const arrayKey = key.split('.*')[0]
        const arrayValue = this.getNestedValue(data, arrayKey)
        if (Array.isArray(arrayValue)) {
          this.validateArray(arrayKey, arrayValue, errors)
        } else {
          if (!errors[arrayKey]) {
            errors[arrayKey] = []
          }
          errors[arrayKey].push(`${arrayKey} is not an array`)
        }
      } else {
        this.validateField(key, value, rules, errors)
      }
    })

    if (Object.keys(errors).length) {
      throw new ValidationError(errors)
    }

    return data as T
  }

  validateObject<T>(data: object): T {
    return this.validate<T>(data)
  }
}

export {Validator}
