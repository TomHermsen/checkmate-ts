# Checkmate

`checkmate-ts` is a library for validating objects in TypeScript applications. It supports validating various data
types, nested objects, arrays, and custom rules, ensuring type safety and reliability in data validation scenarios.

Types will be inferred from the validation rules, but might not work reliably (yet).

## Usage
```typescript
import {Validator} from 'checkmate-ts'

const {user, title, topics} = Validator.create({
  'title': ['string', 'required', 'min:8'],
  'topics': ['array', 'min:1'],
  'topics.*': ['string', 'required'],
  'user': ['required'],
  'user.id': ['required', 'number'],
  'user.name': ['required', 'string'],
  'user.role': ['required', 'in:admin,moderator']
}).validateObject<{
  title: string,
  topics: string[],
  user: {
    id: number,
    name: string,
    role: 'admin' | 'moderator'
  }
}>(res)

```

### Important information
_Nested arrays currently only work with one level._

## Installation

You can install the package via npm:

```bash
npm install checkmate-ts
```

Or via yarn:
```bash
yarn add checkmate-ts

```

## Rules
The validator supports the following rules:

`required`: The field must be present.

`string`: The field must be a string.

`number`: The field must be a number.

`array`: The field must be an array.

`min<number>`: The field must be a string with a minimum length of <number>.

`max:<number>`: The field must be a string with a maximum length of <number>.

`email`: The field must be a valid email address.

`in:<values>`: The field value must be one of the specified <values>.

## Methods
### Create
`create<R extends Rules>(rules: R): Validator<R>`

Creates a new instance of the Validator class with specified validation rules.

parameters: `rules` - The rules to match against
returns: `validator` - An instance of the validator

### validateObject
`validateObject<T>(data: T): T`
Validates the provided data object against the rules defined in the validator instance.

parameters: `data` - The object to be validated
returns: `data` - The data object, it doesn't mutate this object in any way.

## Example
```typescript

import {ValidationError, Validator} from 'checkmate-ts'

// Define validator with rules
const validator = Validator.create({
  // Simple fields
  'name': ['required', 'string', 'min:3', 'max:50'],
  'age': ['required', 'number'],

  // Nested object
  'address.street': ['string'],
  'address.city': ['required', 'string'],

  // Array of strings
  'skills': ['array'],
  'skills.*': ['string'],

  'email': ['required', 'email'],

  // Must be either "active" or "inactive"
  'status': ['in:active,inactive'],
})

const data = {
  name: 'John Doe',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown'
  },
  skills: ['JavaScript', 'TypeScript'],
  email: 'john.doe@example.com',
  status: 'active'
}

try {
  // Validate the data object
  const validatedData = validator.validateObject<{
    name: string,
    age: number,
    address: {
      street?: string,
      city: string
    },
    skills: string[],
    email: string,
    status: 'active' | 'inactive'
  }>(data)

} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.errors)
  }
}

```
