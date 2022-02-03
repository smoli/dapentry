import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {ObjectRenderer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrObject, POI, POIMap, POIPurpose} from "../Geo/GrObject";
import {state} from "../runtime/tools/StateMachine";
import {Point2D} from "../Geo/Point2D";
import {AppConfig} from "../AppConfig";


enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    Handle = "MoveTool.Handle"
}

enum Events {
    HandleDown = "MoveTool.HandleDown"
}


export class MoveTool extends Tool {

    protected _selection: Array<GrObject> = [];
    protected _movingObject: GrObject = null;
    protected _movingPOI: POI = null;

    private _ox: number;
    private _oy: number;
    private _lastSnapInfo: SnapInfo;

    constructor(renderer: ObjectRenderer) {
        super(renderer);
        this.setWaitDoneStates(States.Wait, States.Done);

        this._state.add(state(States.Wait), Events.HandleDown, state(States.Handle));
        this._state.add(state(States.Handle), InteractionEvents.MouseUp, state(States.Done));
        this._state.start(state(States.Wait));
    }

    abort() {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }
        super.abort();
    }

    initialize() {
        if (!this._object) {
            return;
        }
        const poi: POIMap = this._object.pointsOfInterest(POIPurpose.MANIPULATION);

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown) {
            this._state.next(Events.HandleDown);
            this._movingObject = object;
            this._movingPOI = poiId;

            const poi = object.pointsOfInterest(POIPurpose.MANIPULATION)[poiId];
            this._ox = poi.x;
            this._oy = poi.y;


            this.setFirstSnappingInfo({
                event: {
                    ...eventData,
                    x: this._ox,            // We want the position of the point. If we used the event positions axis
                    y: this._oy             // alignment would be slightly offset depending on where the user clicked
                },
                object: undefined, poiId: -1, point: undefined
            });

            this.enablePOISnapping([this._object]);
        }
    }

    set selection(value: Array<GrObject>) {
        if (this._object) {
            this._renderer.removeAllHandles(this._object);
        }

        this.finish()
        this.reset();

        this._selection = value;
        this.initialize();
    }

    protected get _object(): GrObject {
        return this._selection.length && this._selection[0];
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        this._lastSnapInfo = snapInfo;
        eventData = this._lastSnapInfo.event;
        let dx;
        let dy;
        if (this._object && this._movingPOI !== null) {
            dx = eventData.x - this._object.pointsOfInterest(POIPurpose.MANIPULATION)[this._movingPOI].x;
            dy = eventData.y - this._object.pointsOfInterest(POIPurpose.MANIPULATION)[this._movingPOI].y;
        } else {
            return;
        }


        switch (this._state.state.id as States) {
            case States.Wait:
                this._movingPOI = this._movingObject = null;

                break;

            case States.Done:
                this._movingObject.movePOI(this._movingPOI, new Point2D(dx, dy))
                this._renderer.render(this._object, true)
                this._renderer.enablePOI(false);
                this.disablePOISnapping();
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._movingObject.movePOI(this._movingPOI, new Point2D(dx, dy))
                    this._renderer.render(this._object, true);
                    const poi: POIMap = this._object.pointsOfInterest(POIPurpose.MANIPULATION);

                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._object, poiId, poi[poiId]);
                        })

                }
                break;
        }
        return false;
    }

    public getResult(): any {
        if (!this._movingObject && !this._movingPOI) {
            return;
        }

        const poi = this._object.pointsOfInterest(POIPurpose.MANIPULATION)[this._movingPOI];
        const dx = poi.x - this._ox;
        const dy = poi.y - this._oy;

        if (dx !== 0 || dy !== 0) {
            let move = AppConfig.Runtime.Opcodes.Move;

            let opcode;
            let by;

            if (this._lastSnapInfo && this._lastSnapInfo.object) {
                opcode = move.ToPoint;
                by = this._lastSnapInfo;
            } else {
                if (dx === 0) {
                    opcode = move.AlongY;
                    by = dy;
                } else if (dy === 0) {
                    opcode = move.AlongX;
                    by = dx;
                } else {
                    opcode = move.ByVector
                    by = new Point2D(dx, dy)
                }
            }

            return this.makeStatement(
                opcode,
                this._object.name + "@" + POI[this._movingPOI],
                by
            )
        }
    }
}