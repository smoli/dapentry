import {state} from "../../../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {Point2D} from "../../../Geo/Point2D";
import {LibraryEntry} from "../../../Library";
import {GrObject} from "../../../Geo/GrObject";

enum States {
    Wait = "DrawLibraryInstance.Wait",
    DragSize = "DrawLibraryInstance.DragRadius",
    CenterPoint = "DrawLibraryInstance.CenterPoint",
    Done = "DrawLibraryInstance.Done",
}


export class DrawLibraryInstance extends Tool {
    private _point: Point2D;
    private _width: number = 100;
    private _libraryEntry: LibraryEntry;

    constructor(renderer, libraryEntry:LibraryEntry) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), InteractionEvents.Click, state(States.CenterPoint));
        this._state.add(state(States.CenterPoint), InteractionEvents.Click, state(States.Done));
/*
        this._state.add(state(States.DragSize), InteractionEvents.MouseMove, state(States.DragSize));
        this._state.add(state(States.DragSize), InteractionEvents.Click, state(States.Done));
*/
        this._state.start(state(States.Wait));

        this._libraryEntry = libraryEntry;
    }

    public reset() {
        super.reset();
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        const eventData = snapInfo.event;

        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        this._state.next(interactionEvent);

        switch (this._state.state.id) {
            case States.CenterPoint:
                this._point = new Point2D(eventData.x, eventData.y);
                this._state.next(InteractionEvents.Click);
                break;

            case States.Done:
        }

        return this.isDone;
    }

    public get result(): any {
        const name = GrObject.getNewObjectName(this._libraryEntry.id);
        return `MAKE ${name}, "${this._libraryEntry.id}", $styles, ${this._width}, (${this._point.x}, ${this._point.y})`;
    }
}