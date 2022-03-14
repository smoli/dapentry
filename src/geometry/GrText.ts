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
    private _scaleX: number = 1;
    private _scaleY: number = 1;

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
        copy._scaleX = this._scaleX;
        copy._scaleY = this._scaleY;

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
        return { ...super.boundingBox, w: this._width * this._scaleX, h: this._height * this._scaleY };
    }

    get topLeft(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }

    get topRight(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }

    get bottomLeft(): Point2D {
        return this.makePoint(this._alignmentFactorH * this.width * this._scaleX, this._alignmentFactorV * this._height * this._scaleY);
    }

    get bottomRight(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, (this._alignmentFactorV * this._height) * this._scaleY);
    }

    get top(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }

    get bottom(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, (this._alignmentFactorV * this._height) * this._scaleY);
    }

    get left(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width) * this._scaleX, (this._alignmentFactorV * this._height - this.height * 0.5) * this._scaleY);
    }

    get right(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, (this._alignmentFactorV * this._height - this._height * 0.5) * this._scaleY);
    }

    get center(): Point2D {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, (this._alignmentFactorV * this._height - this._height * 0.5) * this._scaleY);
    }

    /**
     * @param pct
     */
    getPointAtPercentage(pct: number): Point2D {
        NOT_IMPLEMENTED("Percentage points make no sense for texts");
        return null;
    }

    scale(fx: number, fy: number) {
        this._scaleX *= fx;
        this._scaleY *= fy;
    }

    getScaleResetInfo(): any {
        return {
            x: this._scaleX,
            y: this._scaleY
        }
    }

    resetScaling(info: {  x: number, y: number }) {
        this._scaleX = info.x;
        this._scaleY = info.y;
    }

    get scaleX():number {
        return this._scaleX;
    }

    get scaleY():number {
        return this._scaleY;
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
            ...super.publishedProperties,
            {
                name: "Width",
                id: "witdh",
                value: this._width
            },
            {
                name: "Height",
                id: "heigh",
                value: this._height
            },{
                name: "Aspect Ratio",
                id: "aspectratio",
                value: this._width / this._height
            },{
                name: "Aspect Ratio2",
                id: "aspectratio2",
                value: this._height / this._width
            }
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

    getOppositePoi(poi: POI): POI {

        return POI.center;
        switch (poi) {
            case POI.topLeft:
                return POI.bottomRight;

            case POI.topRight:
                return POI.bottomLeft;

            case POI.bottomLeft:
                return POI.topRight;

            case POI.bottomRight:
                return POI.topLeft;

            default:
                return super.getOppositePoi(poi);
        }
    }

}