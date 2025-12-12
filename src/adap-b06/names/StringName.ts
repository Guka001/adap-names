import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AbstractName } from "./AbstractName";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import {MethodFailedException} from "../../adap-b05/common/MethodFailedException";

/**
 * Immutable string-based Name value object.
 *
 * Internal representation:
 * - Escaped string with delimiter separators
 * - No observable mutation after construction
 */
export class StringName extends AbstractName {

    private readonly name: string;
    private readonly noComponents: number;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        if (source == null) {
            throw new IllegalArgumentException("source must not be null");
        }

        this.name =
            source
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);

        this.noComponents = this.name.split(delimiter).length;
        this.assertInvariant()
    }



    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.noComponents) {
            throw new IllegalArgumentException(`index ${i} out of range`);
        }

        const parts = this.name
            .split(this.delimiter)
            .map(r => r.replaceAll(ESCAPE_CHARACTER, ""));

        if (i >= 0 && i < parts.length) return parts[i];

        throw new MethodFailedException(`Index ${i} out of range`);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    public asDataString(): string {
        return this.name;
    }

    // ==================== value-producing operations ====================

    public replace(i: number, c: string): Name {
        this.assertValidIndex(i);
        this.assertValidComponent(c);

        const parts = this.name.split(this.delimiter);
        parts[i] = c;

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public insert(i: number, c: string): Name {
        this.assertValidInsertIndex(i);
        this.assertValidComponent(c);

        const parts = this.name.split(this.delimiter);
        parts.splice(i, 0, c);

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public append(c: string): Name {
        return this.insert(this.noComponents, c);
    }

    public remove(i: number): Name {
        this.assertValidIndex(i);
        const parts = this.name.split(this.delimiter);
        parts.splice(i, 1);

        return new StringName(parts.join(this.delimiter), this.delimiter);
    }

    public concat(other: Name): Name {
        if (other == null) {
            throw new IllegalArgumentException(`other is null`);
        }

        let result: Name = this;

        for (let i = 0; i < other.getNoComponents(); i++) {
            result = result.append(other.getComponent(i));
        }

        return result;
    }
}
