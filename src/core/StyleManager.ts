import {GrObject} from "../geometry/GrObject";

export enum TextAlignement {
    center,
    start,
    end
}

export interface Style {
    fillColor:string;
    strokeColor:string;
    fillOpacity:number;
    strokeWidth:number;
    fontSize?: number;
    textAlignment?: TextAlignement,
    verticalAlignment?: TextAlignement,
    fontFamily?: string
}

export class StyleManager {

    private _styles: { [key:string]: Style} = {}

    public constructor() {
        this._styles["default"] = {
            fillColor: "coral",
            strokeColor: "coral",
            fillOpacity: 0.2,
            strokeWidth: 2,
            textAlignment: TextAlignement.center,
            fontFamily: "Sans-serif",
            fontSize: 12
        }

        this._styles["textDefault"] = {
            fillColor: "coral",
            strokeColor: "coral",
            fillOpacity: 1,
            strokeWidth: 0,
            textAlignment: TextAlignement.center,
            verticalAlignment: TextAlignement.end,
            fontFamily: "Sans-serif",
            fontSize: 50
        }
    }

    get styles():{ [key:string]: Style} {
        return this._styles;
    }
}