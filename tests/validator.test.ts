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

  test('should validate boolean fields', () => {
    const validator = Validator.create({
      'isActive': ['required', 'boolean']
    })

    const data = {isActive: true}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for invalid boolean fields', () => {
    const validator = Validator.create({
      'isActive': ['required', 'boolean']
    })

    const data = {isActive: 'yes'}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate numeric fields', () => {
    const validator = Validator.create({
      'score': ['required', 'numeric']
    })

    const data = {score: '123.45'}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for invalid numeric fields', () => {
    const validator = Validator.create({
      'score': ['required', 'numeric']
    })

    const data = {score: 'abc'}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate email fields', () => {
    const validator = Validator.create({
      'email': ['required', 'email']
    })

    const data = {email: 'test@example.com'}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for invalid email fields', () => {
    const validator = Validator.create({
      'email': ['required', 'email']
    })

    const data = {email: 'invalid-email'}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate min length for strings and arrays', () => {
    const validator = Validator.create({
      'name': ['required', 'string', 'min:3'],
      'tags': ['array', 'min:2']
    })

    const data = {name: 'John', tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for strings and arrays shorter than min length', () => {
    const validator = Validator.create({
      'name': ['required', 'string', 'min:5'],
      'tags': ['array', 'min:3']
    })

    const data = {name: 'John', tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate max length for strings and arrays', () => {
    const validator = Validator.create({
      'name': ['required', 'string', 'max:10'],
      'tags': ['array', 'max:3']
    })

    const data = {name: 'John', tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).not.toThrow()
  })

  test('should throw validation errors for strings and arrays longer than max length', () => {
    const validator = Validator.create({
      'name': ['required', 'string', 'max:3'],
      'tags': ['array', 'max:1']
    })

    const data = {name: 'John', tags: ['tag1', 'tag2']}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should validate in and match expected', () => {
    const validator = Validator.create({
      'tags': ['array'],
      'tags.*': ['string', 'required', 'in:foo,bar']
    })

    const data = {tags: ['foo', 'bar']}
    expect(() => validator.validateObject(data)).not.toThrow(ValidationError)
  })

  test('should validate in and throw on unmatched value', () => {
    const validator = Validator.create({
      'tags': ['array'],
      'tags.*': ['string', 'required', 'in:foo,bar']
    })

    const data = {tags: ['foo', 'test']}
    expect(() => validator.validateObject(data)).toThrow(ValidationError)
  })

  test('should allow null on nullable string value', () => {
    const validator = Validator.create({
      'title': ['string', 'nullable'],
    })

    const data = {title: null}
    expect(() => validator.validateObject(data)).not.toThrow(ValidationError)
  })

  test('should allow null on nullable array value', () => {
    const validator = Validator.create({
      'tags': ['array', 'nullable'],
    })

    const data = {tags: null}
    expect(() => validator.validateObject(data)).not.toThrow(ValidationError)
  })

  test('should allow null on nullable number value', () => {
    const validator = Validator.create({
      'value': ['number', 'nullable'],
    })

    const data = {value: null}
    expect(() => validator.validateObject(data)).not.toThrow(ValidationError)
  })

  test('should allow null on nullable numeric value', () => {
    const validator = Validator.create({
      'value': ['numeric', 'nullable'],
    })

    const data = {value: null}
    expect(() => validator.validateObject(data)).not.toThrow(ValidationError)
  })
})
