export const validateString = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (typeof value !== 'string') {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not a string`)
  }
}
