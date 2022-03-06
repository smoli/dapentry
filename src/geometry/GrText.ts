import {BoundingBox, GrObject, ObjectProperty, ObjectType, POI, POIMap, POIPurpose} from "./GrObject";
import {Point2D} from "./Point2D";
import {NOT_IMPLEMENTED} from "../core/Assertions";
import {Style, TextAlignement} from "../core/StyleManager";


function getTextBox(text, font) {
    // re-use canvas object for better performance
    // @ts-ignore
    const canvas: HTMLCanvasElement = getTextBox.canvas || ( getTextBox.canvas = document.createElement("canvas") );
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return { width: metrics.width, height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent };
}


export class GrText extends GrObject {

    private readonly _text: string;
    private _width: number;
    private _height: number;
    protected _alignmentFactorH: number;
    protected _alignmentFactorV: number;

    constructor(name: string, x: number, y: number, text: string) {
        super(ObjectType.Text, name, x, y);
        this._text = text;

        // No size yet as we have no font info yet
        this._width = this._height = 0;
    }


    protected copy(): GrObject {
        const copy = new GrText(this.uniqueName, this.x, this.y, this._text);

        copy._width = this._width;
        copy._height = this._height;
        copy._alignmentFactorV = this._alignmentFactorV;
        copy._alignmentFactorH = this._alignmentFactorH;

        return copy;
    }

    set style(value: Style) {
        this._style = value;
        if (!value) {
            this._width = this._height = 0;
            return;
        }
        const dim = getTextBox(this._text, `${value.fontSize}px ${value.fontFamily}`);
        this._width = dim.width;
        this._height = dim.height;

        switch (value.textAlignment) {
            case TextAlignement.center:
                this._alignmentFactorH = -0.5;
                break;
            case TextAlignement.start:
                this._alignmentFactorH = 0;
                break;
            case TextAlignement.end:
                this._alignmentFactorH = -1;
                break;

        }

        switch (value.verticalAlignment) {
            case TextAlignement.center:
                this._alignmentFactorV = 0.5;
                break;
            case TextAlignement.start:
                this._alignmentFactorV = 1;
                break;
            case TextAlignement.end:
                this._alignmentFactorV = 0;
                break;

        }
    }

    protected updateTextBox() {
        const dim = getTextBox(this._text, `${this._style.fontSize}px ${this._style.fontFamily}`);
        this._width = dim.width;
        this._height = dim.height;
    }

    get style():Style {
        return this._style;
    }

    public get text(): string {
        return this._text;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }

    get boundingBox(): BoundingBox {
        return { ...super.boundingBox, w: this._width, h: this._height };
    }

    get topLeft(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width, this._alignmentFactorV * this.height - this.height);
    }

    get topRight(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width, this._alignmentFactorV * this.height - this.height);
    }

    get bottomLeft(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width, this._alignmentFactorV * this._height);
    }

    get bottomRight(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width, this._alignmentFactorV * this._height);
    }

    get top(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width * 0.5, this._alignmentFactorV * this.height - this.height);
    }

    get bottom(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width * 0.5, this._alignmentFactorV * this._height);
    }

    get left(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width, this._alignmentFactorV * this._height - this.height * 0.5);
    }

    get right(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width, this._alignmentFactorV * this._height - this._height * 0.5);
    }

    get center(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width + this._width * 0.5, this._alignmentFactorV * this._height - this._height * 0.5);
    }

    /**
     * @param pct
     */
    getPointAtPercentage(pct: number): Point2D {
        NOT_IMPLEMENTED("Percentage points make no sense for texts");
        return null;
    }

    scale(fx: number, fy: number) {
        // TODO: Adjust font size? Just by the factor?
    }

    projectPoint(point: Point2D): Point2D {
        NOT_IMPLEMENTED("Percentage points make no sense for texts");
        return null;
    }

    projectPointAsPercentage(point: Point2D): number {
        NOT_IMPLEMENTED("Percentage points make no sense for texts");
        return null;
    }

    get publishedProperties(): Array<ObjectProperty> {
        return [
            ...super.publishedProperties
        ]
    }

    rotatePOI(poi: POI, value: number) {
        super.rotatePOI(poi, value);
    }

    pointsOfInterest(purpose: POIPurpose): POIMap {
        return {
            ...super.pointsOfInterest(purpose),
            [POI.topLeft]: this.topLeft.copy,
            [POI.topRight]: this.topRight.copy,
            [POI.bottomLeft]: this.bottomLeft.copy,
            [POI.bottomRight]: this.bottomRight.copy
        }
    }

 /*   getOppositePoi(poi: POI): POI {
        return POI.center;
    }
*/

}