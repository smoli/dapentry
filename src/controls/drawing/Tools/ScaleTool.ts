import {InteractionEventData, InteractionEvents} from "../InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIMap} from "../../../Geo/GrObject";
import {state} from "../../../runtime/tools/StateMachine";
import {Point2D} from "../../../Geo/GeoMath";


enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    Handle = "MoveTool.Handle"
}

enum Events {
    HandleDown = "MoveTool.HandleDown"
}


export class ScaleTool extends Tool {

    protected _selection: Array<GrObject> = [];
    protected _scalingObject: GrObject = null;
    protected _scalingPOI: POI = null;
    protected _finalX: number;
    protected _finalY: number;

    private _op: Point2D;

    constructor(renderer: ObjectRenderer) {
        super(renderer, States.Wait, States.Done);

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
        const poi: POIMap = this._object.pointsOfInterest;

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown && poiId !== POI.center) {
            this._state.next(Events.HandleDown);
            this._scalingObject = object.createProxy();
            this._scalingPOI = poiId;
            this._op = this._scalingObject.pointsOfInterest[this._scalingPOI].copy.sub(this._scalingObject.center);
            this._finalX = 1;
            this._finalY = 1;
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


    protected _scale(dx, dy) {
        const np = this._scalingObject.pointsOfInterest[this._scalingPOI].copy.sub(this._scalingObject.center);
        const fx = np.x !== 0 ? (np.x + dx) / np.x : 1;
        const fy = np.y !== 0 ? (np.y + dy) / np.y : 1;

        this._scalingObject.scale(Math.abs(fx), Math.abs(fy));

        this._finalX *= Math.abs(fx);
        this._finalY *= Math.abs(fy);
        console.log(this._scalingObject.boundingBox, this._finalX, this._finalY)
    }

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        let dx;
        let dy;
        if (this._object && this._scalingPOI !== null) {
            const thePOI = this._scalingObject.pointsOfInterest[this._scalingPOI].copy;
            dx = eventData.x - thePOI.x;
            dy = eventData.y - thePOI.y;
        } else {
            return;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._scalingPOI = this._scalingObject = null;

                break;

            case States.Done:
                this._scale(dx, dy);
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._scale(dx, dy);

                    this._renderer.render(this._scalingObject, true);
                    const poi: POIMap = this._scalingObject.pointsOfInterest;

                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._scalingObject, poiId, poi[poiId]);
                        })

                }
                break;
        }
        return false;
    }

    public get result(): any {
        return `SCALE ${this._object.name}, ${Math.abs(this._finalX)}, ${Math.abs(this._finalY)}`
    }
}