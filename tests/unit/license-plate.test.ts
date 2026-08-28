import { describe, it, expect } from "vitest";
import { validateLicensePlate } from "@/lib/chilean-utils/license-plate";

describe("Chilean License Plate Validation", () => {
  it("validates and formats New Format (4 letters + 2 numbers, post-2007)", () => {
    const result = validateLicensePlate("BBCL12");
    expect(result.valid).toBe(true);
    expect(result.format).toBe("NEW_FORMAT");
    expect(result.display).toBe("BB·CL·12");
    expect(result.normalized).toBe("BBCL12");
  });

  it("validates and formats Old Format (2 letters + 4 numbers, pre-2007)", () => {
    const result = validateLicensePlate("CD1234");
    expect(result.valid).toBe(true);
    expect(result.format).toBe("OLD_FORMAT");
    expect(result.display).toBe("CD·12·34");
    expect(result.normalized).toBe("CD1234");
  });

  it("rejects invalid plates or characters", () => {
    const result1 = validateLicensePlate("AAAA99");
    expect(result1.valid).toBe(false);
    expect(result1.format).toBe("INVALID");

    const result2 = validateLicensePlate("123");
    expect(result2.valid).toBe(false);
  });
});
