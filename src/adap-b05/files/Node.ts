import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";
import {ServiceFailureException} from "../common/ServiceFailureException";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        const bn = this.doGetBaseName();

        if (!bn) {
            throw new InvalidStateException("Invalid base name");
        }
        return bn;
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        if (bn === null || bn === undefined) {
            throw new IllegalArgumentException("basename should not be null");
        }

        let result: Set<Node> = new Set<Node>();

        try
        {
            if(this.getBaseName() === bn){
                result.add(this);
            }
        }
        catch(err: any)
        {
            throw new ServiceFailureException("findNodes(): service failed", err);
        }
        finally
        {
            const self = this as any;

            if (typeof self.getChildNodes === "function") {
                for (const child of self.getChildNodes()) {
                    const matches = child.findNodes(bn);
                    for (const m of matches) {
                        result.add(m);
                    }
                }
            }
        }

        return result;
    }

}
