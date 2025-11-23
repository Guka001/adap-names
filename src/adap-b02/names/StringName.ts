import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {AbstractName} from "./AbstractName";

export class StringName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super();
        if (delimiter){
            this.delimiter = delimiter;
        }

        this.name = source
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);

        this.noComponents = this.name.split(this.delimiter).length;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.name
            .replaceAll(ESCAPE_CHARACTER + delimiter, delimiter)
            .replaceAll(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER)
    }

    public asDataString(): string {
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        const parts = this.name
            .split(this.delimiter)
            .map(r => r.replaceAll(ESCAPE_CHARACTER, ""));
        if (x >= 0 && x < parts.length) {
            return parts[x];
        }
        throw new Error(`Index ${x} out of range`);
    }

    public setComponent(n: number, c: string): void {
        const parts = this.name.split(this.delimiter);
        if (n >= 0 && n < parts.length) {
            parts[n] = c;
            this.name = parts.join(this.delimiter);
            this.noComponents = parts.length;
        }
    }

    public insert(n: number, c: string): void {
        const parts = this.name.split(this.delimiter);
        if (n >= 0 && n <= parts.length) {

            if (n != parts.length-1) {
                parts.splice(n, 0, `${c}${ESCAPE_CHARACTER}`);
            }else{
                parts.splice(n, 0, c);
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

    public remove(n: number): void {
        const parts = this.name.split(this.delimiter);
        if (n >= 0 && n < parts.length) {
            parts.splice(n, 1);
            this.name = parts.join(this.delimiter);
            this.noComponents = parts.length;
            return
        }
        throw new Error(`Index ${n} out of range`);
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}