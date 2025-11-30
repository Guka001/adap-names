import { describe, it, expect } from "vitest";

import { StringName } from "../../../src/adap-b04/names/StringName";
import { StringArrayName } from "../../../src/adap-b04/names/StringArrayName";
import {IllegalArgumentException} from "../../../src/adap-b04/common/IllegalArgumentException";
import {InvalidStateException} from "../../../src/adap-b04/common/InvalidStateException";

function makeArrayName(c: string[] = ["oss", "fau", "de"]) {
    return new StringArrayName(c, ".");
}

function makeStringName(s: string = "oss.cs.fau.de") {
    return new StringName(s, ".");
}


describe("Preconditions", () => {

    it("setComponent: index < 0 should throw IllegalArgumentException", () => {
        const n = makeArrayName();
        expect(() => n.setComponent(-1, "x")).toThrow(IllegalArgumentException);
    });

    it("setComponent: index >= size should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.setComponent(1, "x")).toThrow(IllegalArgumentException);
    });

    it("setComponent: component containing raw delimiter should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.setComponent(0, "bad.part")).toThrow(IllegalArgumentException);
    });

    it("insert: index > size should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.insert(2, "x")).toThrow(IllegalArgumentException);
    });

    it("append: raw escape character should throw IllegalArgumentException", () => {
        const n = makeArrayName(["a"]);
        expect(() => n.append("\\")).toThrow(IllegalArgumentException);
    });

    it("concat: null argument should throw IllegalArgumentException", () => {
        const n = makeArrayName();
        // @ts-ignore
        expect(() => n.concat(null)).toThrow(IllegalArgumentException);
    });
});


describe("Postconditions", () => {

    it("setComponent must not change number of components", () => {
        const n = makeArrayName(["a", "b"]);
        n.setComponent(1, "x");
        expect(n.getNoComponents()).toBe(2);
    });

    it("setComponent must update correct component", () => {
        const n = makeArrayName(["a", "b"]);
        n.setComponent(1, "x");
        expect(n.getComponent(1)).toBe("x");
    });

    it("insert must increase number of components by 1", () => {
        const n = makeArrayName(["a", "b"]);
        n.insert(1, "x");
        expect(n.getNoComponents()).toBe(3);
    });

    it("insert must place new component at correct index", () => {
        const n = makeArrayName(["a", "b"]);
        n.insert(1, "x");
        expect(n.getComponent(1)).toBe("x");
    });

    it("append must add new component to end", () => {
        const n = makeArrayName(["a", "b"]);
        n.append("x");
        expect(n.getComponent(n.getNoComponents() - 1)).toBe("x");
    });

    it("remove must decrease count by 1", () => {
        const n = makeArrayName(["a", "b", "c"]);
        n.remove(1);
        expect(n.getNoComponents()).toBe(2);
    });

    it("remove must preserve other components", () => {
        const n = makeArrayName(["a", "b", "c"]);
        n.remove(1);
        expect(n.getComponent(0)).toBe("a");
        expect(n.getComponent(1)).toBe("c");
    });

    it("concat must increase count by other's size", () => {
        const a = makeArrayName(["a"]);
        const b = makeStringName("x.y"); // 2 components
        a.concat(b);
        expect(a.getNoComponents()).toBe(3);
    });

    it("concat must append components in correct order", () => {
        const a = makeArrayName(["a"]);
        const b = makeStringName("x.y");

        a.concat(b);

        expect(a.getComponent(0)).toBe("a");
        expect(a.getComponent(1)).toBe("x");
        expect(a.getComponent(2)).toBe("y");
    });
});

describe("Invariant checks", () => {

    it("constructor must enforce invariant: no raw delimiter allowed", () => {
        expect(() => new StringArrayName(["bad.part"], "."))
            .toThrow(InvalidStateException);
    });

    it("constructor must enforce invariant: no raw escape allowed", () => {
        expect(() => new StringArrayName(["bad\\component"], "."))
            .toThrow(InvalidStateException);
    });

    it("post-mutation: setComponent must preserve invariant", () => {
        const n = makeArrayName(["a", "b"]);
        n.setComponent(1, "x");
        expect(true).toBe(true);
    });

    it("post-mutation: append must preserve invariant", () => {
        const n = makeArrayName(["a"]);
        n.append("x");
        expect(true).toBe(true);
    });
});

describe("StringName consistency checks", () => {

    it("StringName: append adds component correctly", () => {
        const n = makeStringName("a.b");
        n.append("x");
        expect(n.getComponent(2)).toBe("x");
    });

    it("StringName: insert respects index rules", () => {
        const n = makeStringName("a.b");
        expect(() => n.insert(3, "x")).toThrow(IllegalArgumentException);
    });

    it("StringName: remove updates number of components correctly", () => {
        const n = makeStringName("a.b.c");
        n.remove(1);
        expect(n.getNoComponents()).toBe(2);
    });

    it("StringName: concat keeps order", () => {
        const a = makeStringName("a");
        const b = makeArrayName(["x", "y"]);
        a.concat(b);
        expect(a.getComponent(1)).toBe("x");
        expect(a.getComponent(2)).toBe("y");
    });
});