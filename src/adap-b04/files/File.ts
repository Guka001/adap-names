import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import {InvalidStateException} from "../common/InvalidStateException";
import {IllegalArgumentException} from "../common/IllegalArgumentException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
}


export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    private isOpen: boolean = false;
    private isDeleted: boolean = false;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
        this.assertInvariant();
    }

    // ========== INVARIANT ========== //

    private assertInvariant(): void {
        if (this.isDeleted && this.isOpen) {
            throw new InvalidStateException("deleted file cannot be open");
        }
    }


    // ========== MEMBER FUNCTIONS ========== //

    public open(): void {
        if (this.isDeleted){ throw new IllegalArgumentException("file is deleted"); }
        if (this.isOpen){ throw new IllegalArgumentException("file already open"); }

        this.isOpen = true;

        if (!this.isOpen) {
            throw new MethodFailedException("file must be open after open()");
        }

        this.assertInvariant();
    }

    public read(noBytes: number): Int8Array {
        if (this.isDeleted){ throw new IllegalArgumentException("file is deleted"); }
        if (!this.isOpen){ throw new IllegalArgumentException("file not open"); }

        // read something
        this.assertInvariant();
        
        return new Int8Array();
    }

    public close(): void {
        if (this.isDeleted){ throw new IllegalArgumentException("file is deleted"); }
        if (!this.isOpen){ throw new IllegalArgumentException("file not open"); }

        this.isOpen = false;

        if (this.isOpen) {
            throw new MethodFailedException("file must be closed after close()");
        }

        this.assertInvariant();
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}