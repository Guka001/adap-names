import { DEFAULT_DELIMITER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import {ESCAPE_CHARACTER} from "../../adap-b05/common/Printable";

export class StringArrayName extends AbstractName {

    private readonly components: readonly string[];

    constructor(source: string[], delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        this.components = source.map(s =>
            s
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
        );

        this.assertInvariant();
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new IllegalArgumentException("index out of range");
        }
        return this.components[i];
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components
            .map(component =>
                component
                    .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                    .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER)
            )
            .join(DEFAULT_DELIMITER);
    }

    public replace(i: number, c: string): Name {
        this.assertValidIndex(i);
        this.assertValidComponent(c);
        const next = [...this.components];
        next[i] = c;
        return new StringArrayName(next, this.delimiter);
    }

    public insert(i: number, c: string): Name {
        this.assertValidInsertIndex(i);
        this.assertValidComponent(c);
        const next = [...this.components];
        next.splice(i, 0, c);
        return new StringArrayName(next, this.delimiter);
    }

    public append(c: string): Name {
        return this.insert(this.components.length, c);
    }

    public remove(i: number): Name {
        this.assertValidIndex(i);
        const next = [...this.components];
        next.splice(i, 1);
        return new StringArrayName(next, this.delimiter);
    }

    public concat(other: Name): Name {
        if (other == null) {
            throw new IllegalArgumentException(`other is null`);
        }

        const next = [...this.components];
        for (let i = 0; i < other.getNoComponents(); i++) {
            next.push(other.getComponent(i));
        }
        return new StringArrayName(next, this.delimiter);
    }
}
