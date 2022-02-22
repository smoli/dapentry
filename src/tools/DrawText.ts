import {state} from "../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../core/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {Point2D} from "../geometry/Point2D";
import {LibraryEntry} from "../core/Library";
import {GrObject} from "../geometry/GrObject";
import {AppConfig} from "../core/AppConfig";

enum States {
    Wait = "DrawText.Wait",
    DragSize = "DrawText.DragRadius",
    CenterPoint = "DrawText.CenterPoint",
    Done = "DrawText.Done",
}


export class DrawText extends Tool {
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
                this.snapInfoUsed(snapInfo);
                break;

            case States.Done:
        }

        return this.isDone;
    }

    protected getResult(snapInfos: Array<SnapInfo>): any {
        if (!snapInfos || snapInfos.length === 0) {
            return null;
        }

        return this.makeStyledCreateStatement(
            AppConfig.Runtime.Opcodes.Text,
            GrObject.getNewObjectName("Text"),
            AppConfig.Runtime.defaultTextStyleRegisterName,
            snapInfos[0],
            `"Text"`
        )
    }
}