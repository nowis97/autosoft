export function cleanRut(rut: string): string {
  return rut.replace(/[^0-9kK]/g, "").toUpperCase();
}

export function validateRut(rut: string): boolean {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 8 || cleaned.length > 9) return false;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDvNumber = 11 - (sum % 11);
  let expectedDv = "";
  if (expectedDvNumber === 11) expectedDv = "0";
  else if (expectedDvNumber === 10) expectedDv = "K";
  else expectedDv = expectedDvNumber.toString();

  return dv === expectedDv;
}

export function formatRut(rut: string): string {
  const cleaned = cleanRut(rut);
  if (cleaned.length < 2) return cleaned;

  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);

  let formattedBody = "";
  for (let i = body.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedBody = "." + formattedBody;
    }
    formattedBody = body[i] + formattedBody;
  }

  return formattedBody ? `${formattedBody}-${dv}` : dv;
}

export const validateRUT = validateRut;
export const formatRUT = formatRut;
export const cleanRUT = cleanRut;
