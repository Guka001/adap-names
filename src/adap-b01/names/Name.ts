export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
    constructor(other: string[], delimiter?: string) {
        if (delimiter){
            this.delimiter = delimiter;
        }

        this.components = other.map(o => {
            return this.maskString(o)
        });
    }

    private maskString(string: string): string {
        return string
            .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER)
            .replaceAll(this.delimiter, ESCAPE_CHARACTER + this.delimiter);
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.components.join(delimiter);
    }

    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        return this.components.map(component => {
             return component
                .replaceAll(ESCAPE_CHARACTER, ESCAPE_CHARACTER+ESCAPE_CHARACTER)
                .replaceAll(DEFAULT_DELIMITER, ESCAPE_CHARACTER + DEFAULT_DELIMITER);
        }).join(DEFAULT_DELIMITER);
    }

    /** Returns properly masked component string */
    // @methodtype get-method
    public getComponent(i: number): string {
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        if (i > 0 && i < this.components.length) {
            const maskString: string = this.maskString(c);
            this.components.splice(i, 0, maskString);
        }
    }

     /** Returns number of components in Name instance */
     // @methodtype get-method
     public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        this.setComponent(i, c);
    }

    /** Expects that new Name component c is properly masked */
    public append(c: string): void {
        this.components.push(this.maskString(c));
    }

    // @methodtype command-method
    public remove(i: number): void {
        if (i > 0 && i < this.components.length) {
            this.components.splice(i, 1);
        }
    }

}
