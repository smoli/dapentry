import {GrObject} from "../../../Geo/GrObject";

export interface Style {
    fillColor:string;
    strokeColor:string;
    fillOpacity:number;
    strokeWidth:number;
}

export class StyleManager {

    private _styles: { [key:string]: Style} = {}

    public constructor() {
        this._styles["default"] = {
            fillColor: "coral",
            strokeColor: "coral",
            fillOpacity: 0.2,
            strokeWidth: 2
        }
    }

    get styles():{ [key:string]: Style} {
        return this._styles;
    }
}