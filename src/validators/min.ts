export const validateMin = (key: string, value: any, minLength: number, errors: { [key: string]: string[] }) => {
  if ((typeof value === 'string' || Array.isArray(value)) && value.length < minLength) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} should be at least ${minLength} characters long`)
  }
}
