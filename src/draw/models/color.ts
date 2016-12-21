export class Color {
    hex: string;
    rgba: string;

    constructor(hex: string)
    constructor(red: number, blue: number, green: number, alpha?: number)
    constructor(redOrHex: number | string, blue?: number, green?: number, alpha?: number) {
        if (typeof redOrHex === 'string') {
            this.hex = this._parseHex(redOrHex);
        }
        else {
            this.rgba = this._parseRgba(redOrHex, blue, green, alpha);
        }
    }

    private _parseHex(hex: string) {
        let color: string = hex.trim();

        if (color.length === 4 || color.length === 7) {
            color = color.slice(1, color.length);
        }
        if (color.length === 3 || color.length === 6) {
            let join = color.length === 3;
            let result = color.split('').map(color => {
                color = color.toUpperCase();
                if (isNaN(parseInt(color, 16))) {
                    throw new Error('HEX range has to be between ')
                }
                return join ? `${color}${color}` : `${color}`;
            }).join('');
            return `#${result}`;
        }
        else {
            throw new Error(`Invalid color provided: ${color}`);
        }
    }

    private _parseRgba(red: number, blue: number, green: number, alpha?: number) {
        let colors = [red, blue, green];
        let invalid = colors.find(color => color < 0 || color > 255);
        if (invalid) {
            throw new Error('Invalid color provided: rgb(${red}, ${blue}, ${green})');
        }

        if (alpha) {
            if (alpha > 1 && alpha < 0) {
                throw new Error('Invalid alpha provided: ${alpha}');
            }

            return `rgba(${red}, ${blue}, ${green}, ${alpha})`;
        }
        else {
            return `rgb(${red}, ${blue}, ${green}, 1)`;
        }
    }
}