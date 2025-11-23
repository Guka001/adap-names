import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter: string = DEFAULT_DELIMITER) {
        super(delimiter);

        // escape content
        this.name =
            source
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);

        this.noComponents = this.name.split(this.delimiter).length;
    }

    public clone(): Name {
        return new StringName(this.asDataString(), this.delimiter);
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    public asDataString(): string {
        return this.name;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(i: number): string {
        const parts = this.name
            .split(this.delimiter)
            .map(r => r.replaceAll(ESCAPE_CHARACTER, ""));

        if (i >= 0 && i < parts.length) return parts[i];

        throw new Error(`Index ${i} out of range`);
    }

    public setComponent(i: number, c: string): void {
        const parts = this.name.split(this.delimiter);

        if (i >= 0 && i < parts.length) {
            parts[i] = c;
            this.name = parts.join(this.delimiter);
            this.noComponents = parts.length;
        }
    }

    public insert(i: number, c: string): void {
        const parts = this.name.split(this.delimiter);

        if (i >= 0 && i <= parts.length) {

            if (i !== parts.length - 1) {
                parts.splice(i, 0, `${c}${ESCAPE_CHARACTER}`);
            } else {
                parts.splice(i, 0, c);
            }

            this.name = parts.join(this.delimiter);
            this.noComponents = parts.length;
        }
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
            this.noComponents = 1;
        } else {
            this.name += this.delimiter + c;
            this.noComponents++;
        }
    }

    public remove(i: number): void {
        const parts = this.name.split(this.delimiter);
        if (i >= 0 && i < parts.length) {
            parts.splice(i, 1);
            this.name = parts.join(this.delimiter);
            this.noComponents = parts.length;
            return;
        }
        throw new Error(`Index ${i} out of range`);
    }
}
