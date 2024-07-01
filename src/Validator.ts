import type {Rule} from './types/Rule'
import type {Rules} from './types/Rules'
import {ValidationError} from './exceptions/ValidationError'

class Validator {
  private rules: Rules

  constructor(rules: Rules) {
    this.rules = rules
  }

  static create(rules: Rules) {
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
    rules.forEach(rule => {
      if (rule === 'required' && (value === undefined || value === null)) {
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(`${key} is required`)
      }

      if (rule === 'string' && typeof value !== 'string') {
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(`${key} is not a string`)
      }

      if (rule === 'number' && !Number.isSafeInteger(Number(value))) {
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(`${key} is not a number`)
      }

      if (rule === 'array' && !Array.isArray(value)) {
        if (!errors[key]) {
          errors[key] = []
        }
        errors[key].push(`${key} is not an array`)
      }

      if (rule.startsWith('min:')) {
        const minLength = parseInt(rule.split(':')[1], 10)
        if (typeof value === 'string' && value.length < minLength) {
          if (!errors[key]) {
            errors[key] = []
          }
          errors[key].push(`${key} should be at least ${minLength} characters long`)
        }
      }
    })
  }

  private validateArray(key: string, array: any[], errors: { [key: string]: string[] }) {
    array.forEach((item, index) => {
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
