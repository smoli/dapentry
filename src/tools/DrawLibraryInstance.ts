import {state} from "../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../core/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {Point2D} from "../geometry/Point2D";
import {LibraryEntry} from "../core/Library";
import {GrObject} from "../geometry/GrObject";
import {AppConfig} from "../core/AppConfig";
import {RenderLayer} from "../core/ObjectRenderer";
import {GrRectangle} from "../geometry/GrRectangle";
import {DrawRectangle} from "./DrawRectangle";
import {AspectRatio, getHeightForWidth} from "../geometry/GrCanvas";


export class DrawLibraryInstance extends DrawRectangle {
    private _libraryEntry: LibraryEntry;
    private _name: string;

    constructor(renderer, libraryEntry:LibraryEntry) {
        super(renderer);

        this._libraryEntry = libraryEntry;
        this._name = GrObject.getNewObjectName(this._libraryEntry.name);
    }

    protected _calculateRect(x2: number, y2: number) {
        const x1 = this._x1;
        const y1 = this._y1;
        const w = Math.max(this._x1, x2) - x1;
        let h = getHeightForWidth(w, this._libraryEntry.aspectRatio);
        return {x1, y1, w: 2 * w, h: 2 * h}
    }

    protected getResult(): any {

        const point = this.makePointCodeFromSnapInfo(this._firstSnap || this._waitSnap);

        const w = this._rect?.width || 0

        let statement =  `MAKE ${this._name}, "${this._libraryEntry.name}", ${AppConfig.Runtime.styleRegisterName}, ${w.toFixed(2)}, ${point}`;

        this._libraryEntry.arguments.forEach(arg => {
            statement += ", " + JSON.stringify(arg.default);
        })

        return statement;
    }
}