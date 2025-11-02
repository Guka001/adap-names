import {Name} from "./Name";
import {Equality} from "../common/Equality";

export abstract class AbstractName implements Name, Equality {
    abstract isEmpty(): boolean;

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;

    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;

    abstract append(c: string): void;

    abstract remove(i: number): void;

    abstract concat(other: Name): void;

    abstract asDataString(): string;

    abstract asString(delimiter?: string): string;

    abstract getDelimiterCharacter(): string;

    public isEqual(other: any): boolean {
        if (!other || typeof other !== "object" || typeof (other as any).getNoComponents !== "function") {
            return false;
        }

        const that = other as Name;

        if (this.getNoComponents() !== that.getNoComponents()) {
            return false;
        }

        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== that.getComponent(i)) {
                return false;
            }
        }

        return true;
    }

    public getHashCode(): number {
        const str = this.asString();
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) | 0;
        }
        return h;
    }


}

