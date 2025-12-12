import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b06/names/StringName";
import { Name } from "../../../src/adap-b06/names/Name";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";


function makeArrayName(c: string[] = ["oss", "fau", "de"]) {
    return new StringArrayName(c, ".");
}

function makeStringName(s: string = "oss.cs.fau.de") {
    return new StringName(s, ".");
}

function arrayName(components: string[], delimiter = "."): Name {
    return new StringArrayName(components, delimiter);
}

function stringName(data: string, delimiter = "."): Name {
    return new StringName(data, delimiter);
}

const implementations = [
    {
        label: "StringArrayName",
        make: () => arrayName(["oss", "fau", "de"])
    },
    {
        label: "StringName",
        make: () => stringName("oss.fau.de")
    }
];

describe("Preconditions (constructor & value operations)", () => {

    it("replace: index < 0 should throw IllegalArgumentException", () => {
        const n = makeArrayName();
        expect(() => n.replace(-1, "x"))
            .toThrow(IllegalArgumentException);
    });

    it("replace: index >= size should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.replace(1, "x"))
            .toThrow(IllegalArgumentException);
    });

    it("replace: raw delimiter should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.replace(0, "bad.part"))
            .toThrow(IllegalArgumentException);
    });

    it("insert: index > size should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.insert(2, "x"))
            .toThrow(IllegalArgumentException);
    });

    it("append: raw escape character should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.append("\\"))
            .toThrow(IllegalArgumentException);
    });

    it("concat: null argument should throw IllegalArgumentException", () => {
        const n = makeArrayName();
        // @ts-ignore
        expect(() => n.concat(null))
            .toThrow(IllegalArgumentException);
    });
});

describe("Value semantics (postconditions as value guarantees)", () => {

    it("replace must not change number of components", () => {
        const n = makeArrayName(["a", "b"]);
        const n2 = n.replace(1, "x");

        expect(n2.getNoComponents()).toBe(2);
        expect(n.getNoComponents()).toBe(2); // original unchanged
    });

    it("replace must update correct component", () => {
        const n = makeArrayName(["a", "b"]);
        const n2 = n.replace(1, "x");

        expect(n2.getComponent(1)).toBe("x");
        expect(n.getComponent(1)).toBe("b");
    });

    it("insert must increase number of components by 1", () => {
        const n = makeArrayName(["a", "b"]);
        const n2 = n.insert(1, "x");

        expect(n2.getNoComponents()).toBe(3);
    });

    it("insert must place new component at correct index", () => {
        const n = makeArrayName(["a", "b"]);
        const n2 = n.insert(1, "x");

        expect(n2.getComponent(1)).toBe("x");
    });

    it("append must add new component to end", () => {
        const n = makeArrayName(["a", "b"]);
        const n2 = n.append("x");

        expect(n2.getComponent(n2.getNoComponents() - 1)).toBe("x");
    });

    it("remove must decrease count by 1", () => {
        const n = makeArrayName(["a", "b", "c"]);
        const n2 = n.remove(1);

        expect(n2.getNoComponents()).toBe(2);
    });

    it("remove must preserve other components", () => {
        const n = makeArrayName(["a", "b", "c"]);
        const n2 = n.remove(1);

        expect(n2.getComponent(0)).toBe("a");
        expect(n2.getComponent(1)).toBe("c");
    });

    it("concat must increase count by other's size", () => {
        const a = makeArrayName(["a"]);
        const b = makeStringName("x.y");

        const c = a.concat(b);

        expect(c.getNoComponents()).toBe(3);
    });

    it("concat must append components in correct order", () => {
        const a = makeArrayName(["a"]);
        const b = makeStringName("x.y");

        const c = a.concat(b);

        expect(c.getComponent(0)).toBe("a");
        expect(c.getComponent(1)).toBe("x");
        expect(c.getComponent(2)).toBe("y");
    });
});

describe("StringName consistency checks", () => {

    it("StringName: append adds component correctly", () => {
        const n = makeStringName("a.b");
        const n2 = n.append("x");

        expect(n2.getComponent(2)).toBe("x");
        expect(n.getNoComponents()).toBe(2);
    });

    it("StringName: insert respects index rules", () => {
        const n = makeStringName("a.b");
        expect(() => n.insert(3, "x"))
            .toThrow(IllegalArgumentException);
    });

    it("StringName: remove updates number of components correctly", () => {
        const n = makeStringName("a.b.c");
        const n2 = n.remove(1);

        expect(n2.getNoComponents()).toBe(2);
    });

    it("StringName: concat keeps order", () => {
        const a = makeStringName("a");
        const b = makeArrayName(["x", "y"]);

        const c = a.concat(b);

        expect(c.getComponent(1)).toBe("x");
        expect(c.getComponent(2)).toBe("y");
    });
});

describe("Construction and basic queries", () => {

    implementations.forEach(({ label, make }) => {

        describe(label, () => {

            it("is not empty", () => {
                const n = make();
                expect(n.isEmpty()).toBe(false);
            });

            it("returns correct number of components", () => {
                const n = make();
                expect(n.getNoComponents()).toBe(3);
            });

            it("returns correct components by index", () => {
                const n = make();
                expect(n.getComponent(0)).toBe("oss");
                expect(n.getComponent(1)).toBe("fau");
                expect(n.getComponent(2)).toBe("de");
            });

            it("toString returns a valid representation", () => {
                const n = make();
                expect(n.toString()).toContain("oss");
            });
        });
    });
});

describe("withComponent", () => {

    implementations.forEach(({ label, make }) => {

        describe(label, () => {

            it("replaces component at index", () => {
                const n1 = make();
                const n2 = n1.replace(1, "cs");

                expect(n2.getComponent(1)).toBe("cs");
            });

            it("does not modify original object", () => {
                const n1 = make();
                const n2 = n1.replace(1, "cs");

                expect(n1.getComponent(1)).toBe("fau");
                expect(n2.getComponent(1)).toBe("cs");
            });
        });
    });
});

describe("withInserted", () => {

    implementations.forEach(({ label, make }) => {

        describe(label, () => {

            it("inserts component at given index", () => {
                const n1 = make();
                const n2 = n1.insert(1, "cs");

                expect(n2.getNoComponents()).toBe(4);
                expect(n2.getComponent(1)).toBe("cs");
            });

            it("shifts following components to the right", () => {
                const n2 = make().insert(1, "cs");

                expect(n2.getComponent(2)).toBe("fau");
            });
        });
    });
});

describe("withAppended", () => {

    implementations.forEach(({ label, make }) => {

        describe(label, () => {

            it("appends component at the end", () => {
                const n2 = make().append("edu");

                expect(n2.getComponent(n2.getNoComponents() - 1)).toBe("edu");
            });
        });
    });
});

describe("without", () => {

    implementations.forEach(({ label, make }) => {

        describe(label, () => {

            it("removes component at index", () => {
                const n2 = make().remove(1);

                expect(n2.getNoComponents()).toBe(2);
                expect(n2.getComponent(0)).toBe("oss");
                expect(n2.getComponent(1)).toBe("de");
            });
        });
    });
});

describe("concatenated", () => {

    it("concatenates two names correctly", () => {
        const a = arrayName(["a", "b"]);
        const b = stringName("x.y");

        const c = a.concat(b);

        expect(c.getNoComponents()).toBe(4);
        expect(c.getComponent(0)).toBe("a");
        expect(c.getComponent(1)).toBe("b");
        expect(c.getComponent(2)).toBe("x");
        expect(c.getComponent(3)).toBe("y");
    });
});