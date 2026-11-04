import { configuration } from "./configuration.js";
import { fontCanvas} from "../display/fontCanvas.js"

export class configurationSimulator extends configuration {

    constructor(device, deviceData) {
        super(device);
        this._data = deviceData;
        this._images = new Map();
        this._fonts = new Map();
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

    getFont(name) {

        if (this._fonts.has(name)) return this._fonts.get(name);

        const fontInfo = fontCanvas.extractFontInfo(name);
        if (!fontInfo) return null;       

        //Retrieve data from json
        for(const font of this._data.fonts) {
            if (font.name == fontInfo.family && font.data) {
                const ft = new FontFace(font.name, `url(${font.data})`);
                ft.load();
                this._fonts.set(font.name, new fontCanvas(font.name, ft));
                document.fonts.add(ft);
                return this._fonts.get(font.name);
            }
        }

        return null;        

    }

}