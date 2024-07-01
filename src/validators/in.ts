export const validateIn = (key: string, value: any, options: string[], errors: { [key: string]: string[] }) => {
  if (!options.includes(value)) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} must be one of ${options.join(', ')}`)
  }
}
