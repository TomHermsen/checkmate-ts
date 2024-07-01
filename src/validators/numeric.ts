export const validateNumeric = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (isNaN(value)) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not numeric`)
  }
}
