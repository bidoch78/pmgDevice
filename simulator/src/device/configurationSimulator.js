import { widget } from "../widgets/widget.js";
import { configuration } from "./configuration.js";

export class configurationSimulator extends configuration {

    constructor(device, deviceData) {
        super(device);
        this._data = deviceData;
        this._images = new Map();
    }

    getTemplate() {
        return this._data ? this._data.template : null;
    }

    getImage(name) {

        if (this._images.has(name)) return this._images.get(name);
        
        //Retrieve data from json
        for(const image of this._data.images) {
            if (image.name == name && image.data) {
                const img = new Image();
                img.src =  image.data;
                this._images.set(name, img);
                return img;
            }
        }

        return null;

    }

}