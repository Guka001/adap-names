import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import {InvalidStateException} from "../../adap-b05/common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected readonly delimiter: string;

    protected constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    // ========== INVARIANTS AND PRECONDITIONS ========== //

    protected assertValidIndex(i: number): void {
        const n = this.getNoComponents();
        if (i < 0 || i >= n) {
            throw new IllegalArgumentException(`index ${i} out of range`);
        }
    }

    protected assertValidInsertIndex(i: number): void {
        const n = this.getNoComponents();
        if (i < 0 || i > n) {
            throw new IllegalArgumentException(`insert index ${i} invalid`);
        }
    }

    protected assertValidComponent(c: string): void {
        if (c == null) {
            throw new IllegalArgumentException("component is null");
        }
        if (c.includes(this.delimiter) || c.includes(ESCAPE_CHARACTER)) {
            throw new IllegalArgumentException("component must be masked (no raw delimiter or escape)");
        }
    }

    protected assertInvariant(): void {
        const n = this.getNoComponents();
        if (n < 0) {
            throw new InvalidStateException("negative component count");
        }

        for (let i = 0; i < n; i++) {
            const c = this.getComponent(i);
            if (c == null) {
                throw new InvalidStateException("null component");
            }
            if (c.includes(this.delimiter) || c.includes(ESCAPE_CHARACTER)) {
                throw new InvalidStateException("component not properly masked");
            }
        }
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public toString(): string {
        return this.asDataString();
    }

    public isEqual(other: Name): boolean {
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        return true;
    }

    public getHashCode(): number {
        const s = this.asDataString();
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = (h * 31 + s.charCodeAt(i)) | 0;
        }
        return h;
    }

    // ========== DELEGATE IMPLEMENTATION ========== //

    abstract replace(i: number, c: string): Name;
    abstract insert(i: number, c: string): Name;
    abstract append(c: string): Name;
    abstract remove(i: number): Name;
    abstract concat(other: Name): Name;

    // === QUERIES ===

    abstract asString(delimiter?: string): string;
    abstract asDataString(): string;
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;
}
