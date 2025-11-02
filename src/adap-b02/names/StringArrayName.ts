import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import {AbstractName} from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super();
        if (delimiter) {
            this.delimiter = delimiter;
        }

        this.components = source.map(s => {
            return s
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
                .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
        });
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    public asDataString(): string {
        return this.components.map(component => {
            return component
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER+ESCAPE_CHARACTER)
                .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        }).join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.components.length === 0;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i >= 0 && i < this.components.length) {
            this.components.splice(i, 0, c);
        }
    }

    public insert(i: number, c: string): void {
        this.setComponent(i, c);
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i >= 0 && i < this.components.length) {
            this.components.splice(i, 1);
        }
    }

    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

}