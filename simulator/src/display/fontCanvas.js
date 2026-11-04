import { font } from "./font.js";

export class fontCanvas extends font {

    constructor(name, fontface) {
        super(name);
        this._ff = fontface;
    }

    ready() {
        return this._ff.status == "loaded";
    }
  
}