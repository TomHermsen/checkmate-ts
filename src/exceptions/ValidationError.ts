class ValidationError extends Error {
  errors: Record<string, string[]> = {}

  constructor(errors: Record<string, string[]>, message: string = 'Validation error') {
    super(message)
    this.errors = errors

    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export {ValidationError}