const REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const validateEmail = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (typeof value !== 'string' || !REGEX.test(value)) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not a valid email`)
  }
}
