import {Validator} from '../src/Validator'
import {ValidationError} from '../src/exceptions/ValidationError'

describe('Validator', () => {
  test('should validate required fields', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'age': ['required', 'number'],
      'tags': ['array'],
      'tags.*': ['string']
    })

    const data = {name: 'John Doe', age: 30, tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for missing required fields', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'age': ['required', 'number'],
    })

    const data = {age: 30}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate nested array fields', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'age': ['required', 'number'],
      'tags': ['array'],
      'tags.*': ['string']
    })

    const data = {name: 'John Doe', age: 30, tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should validate nested object fields', () => {
    const validator = Validator.create({
      'user.id': ['required', 'string'],
      'user.name': ['required', 'string'],
      'user.age': ['required', 'number'],
    })

    const data = {user: {id: '1', name: 'John Doe', age: 20}}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should validate deep nested object fields', () => {
    const validator = Validator.create({
      'data.user.id': ['required', 'string'],
      'data.user.name': ['required', 'string'],
      'data.user.age': ['required', 'number'],
    })

    const data = {data: {user: {id: '1', name: 'John Doe', age: 20}}}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for invalid field types', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'age': ['required', 'number'],
    })

    const data = {name: 'John Doe', age: 'thirty'}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate array fields', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'tags': ['array'],
      'tags.*': ['string']
    })
    const data = {name: 'John Doe', tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for invalid array elements', () => {
    const validator = Validator.create({
      'name': ['required', 'string'],
      'tags': ['array'],
      'tags.*': ['string']
    })

    const data = {name: 'John Doe', tags: [1, 2]}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })
})
