import {GrObject} from "./GrObject";

export interface Style {
    fillColor:string;
    strokeColor:string;
    fillOpacity:number;
}


export class StyleManager {

    private _styles: { [key:string]: Style} = {}
    private _stylesByObject: { [key:string]: Style} = {}


    public constructor() {
        this._styles["default"] = {
            fillColor: "coral",
            strokeColor: "coral",
            fillOpacity: 0.2
        }
    }

    get styles():{ [key:string]: Style} {
        return this._styles;
    }



    getStyleForObject(object:GrObject):Style {
        let s = this._stylesByObject[object.id];

        if (s) {
            this._stylesByObject[object.id] = { ...this._styles["default"] };
        }

        return s;
    }

}