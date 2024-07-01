export const validateNumber = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (typeof value !== 'number') {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not a number`)
  }
}
