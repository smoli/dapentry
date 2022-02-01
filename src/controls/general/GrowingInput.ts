import Input from "sap/m/Input";


/**
 * https://stackoverflow.com/a/21015393
 *
 *
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // @ts-ignore
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFontSize(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}




/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.general
 */
export default class GrowingInput extends Input {

    static readonly metadata = {
        dnd: true
    }

    __adjustWidthForValue() {
        const dr = this.getDomRef();
        const inp = this.getDomRef("inner");

        if (dr && inp) {
            const value = this.getValue();
            // @ts-ignore
            dr.style.width = (getTextWidth(value, getCanvasFontSize(inp)) + 25) +  "px";
        }
    }

    onAfterRendering(oEvent: jQuery.Event) {
        this.__adjustWidthForValue();
        super.onAfterRendering(oEvent);
    }

    setValue(sValue: string): this {
        const r = super.setValue(sValue);
        this.__adjustWidthForValue();
        return this;
    }

    setValueAndFireChange(value): this {
        this.setValue(value);
        this.fireChange({ value });
        return this;
    }

    onkeydown(event) {
        // @ts-ignore
        super.onkeydown(event);
        this.__adjustWidthForValue();
    }

    renderer: "sap.m.InputRenderer"

}