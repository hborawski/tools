import { test, expect, describe } from "vitest";
import type { ObjectType } from "@player-tools/xlr";
import { computeEffectiveObject } from "../validation-helpers";

describe("computeEffectiveObject tests", () => {
  test("mixed test", () => {
    const type1: ObjectType = {
      type: "object",
      properties: {
        foo: {
          required: true,
          node: {
            type: "string",
          },
        },
      },
      additionalProperties: false,
    };

    const type2: ObjectType = {
      type: "object",
      properties: {
        bar: {
          required: true,
          node: {
            type: "number",
          },
        },
      },
      additionalProperties: {
        type: "unknown",
      },
    };

    expect(computeEffectiveObject(type1, type2)).toMatchSnapshot();
  });

  test("Error on property overlap", () => {
    const type1: ObjectType = {
      type: "object",
      properties: {
        foo: {
          required: true,
          node: {
            type: "string",
          },
        },
      },
      additionalProperties: false,
    };

    const type2: ObjectType = {
      type: "object",
      properties: {
        foo: {
          required: true,
          node: {
            type: "number",
          },
        },
      },
      additionalProperties: {
        type: "unknown",
      },
    };

    expect(() =>
      computeEffectiveObject(type1, type2, true)
    ).toThrowErrorMatchingInlineSnapshot(
      `[Error: Can't compute effective type for object literal and object literal because of conflicting properties foo]`
    );
  });

  test("Merges equal additionalProperties", () => {
    const type1: ObjectType = {
      type: "object",
      properties: {
        foo: {
          required: true,
          node: {
            type: "string",
          },
        },
      },
      additionalProperties: {
        type: "unknown",
      },
    };

    const type2: ObjectType = {
      type: "object",
      properties: {
        bar: {
          required: true,
          node: {
            type: "number",
          },
        },
      },
      additionalProperties: {
        type: "unknown",
      },
    };

    expect(computeEffectiveObject(type1, type2)).toMatchSnapshot();
  });
});
