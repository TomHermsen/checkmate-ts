export const validateArray = (key: string, value: any, errors: { [key: string]: string[] }) => {
  if (!Array.isArray(value)) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} is not an array`)
  }
}
