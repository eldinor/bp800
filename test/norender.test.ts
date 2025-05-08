import { Vector3 } from "@babylonjs/core";
import { describe, it, expect } from "vitest";

describe("Babylon.js Scene Logic (No Rendering)", () => {
  it("should calculate vector distances", () => {
    const v1 = new Vector3(0, 0, 0);
    const v2 = new Vector3(0, 3, 4); // 3-4-5 triangle

    expect(Vector3.Distance(v1, v2)).toBe(5);
  });
});
