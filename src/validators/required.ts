export const validateRequired = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (value === undefined || value === null) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is required`)
  }
}
