# Typescript Validator

`checkmate-ts` is a TypeScript library for validating data against specified rules. It supports validation for
various data types, nested objects, and arrays.

It's heavily inspired by Laravel's way of validating requests

## Installation

You can install the package via npm:

```bash
npm install checkmate-ts
```

Or with yarn
```bash
yarn add checkmate-ts

```

## Rules

The validator supports the following rules:

    required: The field must be present.
    string: The field must be a string.
    number: The field must be a number.
    array: The field must be an array.
    min:<number>: The field must be a string with a minimum length of <number>. 

More coming soon!

## Examples
### Nested object validation
```typescript
const validator = Validator.create({
  'user.id': ['required', 'string'],
  'user.name': ['required', 'string'],
  'user.age': ['required', 'number'],
})

const data = {user: {id: '1', name: 'John Doe', age: 20}}

try {
  validator.validateObject<{
    user: {
      id: string,
      name: string,
      age: number,
    }
  }>(data)
  console.log('Validation passed')
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed', error.errors)
  }
}

```

### Nested object validation
```typescript
const validator = Validator.create({
  'tags': ['array'],
  'tags.*': ['string']
})

const data = {tags: ['tag1', 'tag2']}

try {
  validator.validateObject<{ tags: string[] }>(data)
  console.log('Validation passed')
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed', error.errors)
  }
}

```

