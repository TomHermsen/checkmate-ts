export const validateBoolean = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (typeof value !== 'boolean') {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not a boolean`)
  }
}
