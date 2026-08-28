import { describe, it, expect } from "vitest";
import { validateRut, formatRut, cleanRut } from "@/lib/chilean-utils/rut";

describe("Chilean RUT Validation (Módulo 11)", () => {
  it("validates standard Chilean RUTs correctly", () => {
    expect(validateRut("11.111.111-1")).toBe(true);
    expect(validateRut("111111111")).toBe(true);
    expect(validateRut("12.345.678-5")).toBe(true);
    expect(validateRut("17.892.341-2")).toBe(true);
    expect(validateRut("19.876.543-0")).toBe(true);
    expect(validateRut("76.452.189-7")).toBe(true);
  });

  it("rejects invalid Chilean RUTs with incorrect verification digits", () => {
    expect(validateRut("19.876.543-9")).toBe(false);
    expect(validateRut("12.345.678-0")).toBe(false);
    expect(validateRut("123")).toBe(false);
    expect(validateRut("")).toBe(false);
  });

  it("formats RUTs with dots and dash correctly", () => {
    expect(formatRut("198765430")).toBe("19.876.543-0");
    expect(formatRut("123456785")).toBe("12.345.678-5");
    expect(cleanRut("19.876.543-0")).toBe("198765430");
  });
});
