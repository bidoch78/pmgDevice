export class font {

    constructor(name) {
        this._name = name;
        this._vOffset = 0;
        this._hOffset = 0;
    }

    ready() { return false; }

    readFontInfo(template_fonts) {

        for(const font of template_fonts) {
            if (font.name == this._name) {
                this._vOffset = (font.verticalOffset) ? Number(font.verticalOffset) : 0;
                this._hOffset = (font.horizontalOffset) ? Number(font.horizontalOffset) : 0;
            }
        }

    }

    getVerticalOffset() { return this._vOffset; }
    getHorizontalOffset() { return this._hOffset; }

    static extractFontInfo(font) {
        
        if (!font) return null;

        const match = font.match(/^(\d+)\s+(\d+)px\s+(.+)$/);

        if (match) {
            const [, weight, size, family] = match;
            return { 'weight': Number(weight), 'size': Number(size), 'family': family };
        }

        return null;

    }

}