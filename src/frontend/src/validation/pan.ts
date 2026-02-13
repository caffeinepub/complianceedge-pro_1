export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export function validatePAN(pan: string): boolean {
  return PAN_REGEX.test(pan);
}
