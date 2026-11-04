export class font {

    constructor(name) {
    }

    ready() { return false; }

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