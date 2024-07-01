export const validateMax = (key: string, value: any, maxLength: number, errors: { [key: string]: string[] }) => {
  if ((typeof value === 'string' || Array.isArray(value)) && value.length > maxLength) {
    if (!errors[key]) {
      errors[key] = []
    }
    errors[key].push(`${key} should be no more than ${maxLength} characters long`)
  }
}
