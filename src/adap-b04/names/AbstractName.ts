import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {InvalidStateException} from "../common/InvalidStateException";
import {IllegalArgumentException} from "../common/IllegalArgumentException";
import {MethodFailedException} from "../common/MethodFailedException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
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


    // ========== MEMBER FUNCTIONS ========== //

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
        const data = this.toString();
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            hash = (hash * 31 + data.charCodeAt(i)) | 0;
        }
        return hash;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public setComponent(i: number, c: string): void {
        this.assertValidIndex(i);
        this.assertValidComponent(c);

        const oldCount = this.getNoComponents();

        this.doSetComponent(i, c);

        if (this.getNoComponents() !== oldCount) {
            throw new MethodFailedException("setComponent must not change number of components");
        }
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("setComponent must update component at index");
        }

        this.assertInvariant();
    }

    public insert(i: number, c: string): void {
        this.assertValidInsertIndex(i);
        this.assertValidComponent(c);

        const oldCount = this.getNoComponents();

        this.doInsert(i, c);

        if (this.getNoComponents() !== oldCount + 1) {
            throw new MethodFailedException("insert must increase number of components by 1");
        }
        if (this.getComponent(i) !== c) {
            throw new MethodFailedException("insert must place component at index i");
        }

        this.assertInvariant();
    }

    public append(c: string): void {
        this.assertValidComponent(c);

        const oldCount = this.getNoComponents();

        this.doAppend(c);

        if (this.getNoComponents() !== oldCount + 1) {
            throw new MethodFailedException("append must increase component count");
        }
        if (this.getComponent(oldCount) !== c) {
            throw new MethodFailedException("append must place component at end");
        }

        this.assertInvariant();
    }

    public remove(i: number): void {
        this.assertValidIndex(i);

        const oldCount = this.getNoComponents();
        const before: string[] = [];
        for (let k = 0; k < oldCount; k++) {
            before.push(this.getComponent(k));
        }

        this.doRemove(i);

        if (this.getNoComponents() !== oldCount - 1) {
            throw new MethodFailedException("remove must decrease count by 1");
        }

        let newIndex = 0;
        for (let k = 0; k < oldCount; k++) {
            if (k === i) continue;
            if (this.getComponent(newIndex) !== before[k]) {
                throw new MethodFailedException("remove must preserve other components");
            }
            newIndex++;
        }

        this.assertInvariant();
    }

    public concat(other: Name): void {
        if (other == null) {
            throw new IllegalArgumentException("other must not be null");
        }

        const oldCount = this.getNoComponents();
        const add = other.getNoComponents();

        for (let i = 0; i < add; i++) {
            const c = other.getComponent(i);
            this.assertValidComponent(c);
            this.doAppend(c);
        }

        if (this.getNoComponents() !== oldCount + add) {
            throw new MethodFailedException("concat must increase component count correctly");
        }

        this.assertInvariant();
    }


    // ========== DELEGATE IMPLEMENTATION ========== //

    abstract clone(): Name ;

    abstract asString(delimiter: string): string ;
    abstract asDataString(): string ;
    abstract getNoComponents(): number;
    abstract getComponent(i: number): string;

    // ========== PRIMITIVES ========== //

    public abstract doSetComponent(i: number, c: string): void;
    public abstract doInsert(i: number, c: string): void;
    public abstract doAppend(c: string): void;
    public abstract doRemove(i: number): void;

}