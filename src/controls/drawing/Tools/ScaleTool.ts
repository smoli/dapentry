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

    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        let dx;
        let dy;
        if (this._object && this._scalingPOI !== null) {
            dx = eventData.x - this._object.pointsOfInterest[this._scalingPOI].x;
            dy = eventData.y - this._object.pointsOfInterest[this._scalingPOI].y;
        } else {
            return;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._scalingPOI = this._scalingObject = null;

                break;

            case States.Done:
                this._renderer.enablePOI(false);
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    const np = this._scalingObject.pointsOfInterest[this._scalingPOI].copy.sub(this._scalingObject.center);

                    const fx = np.x !== 0 ? (np.x + dx) / np.x : 1;
                    const fy = np.y !== 0 ? (np.y + dy) / np.y : 1;

                    this._scalingObject.scale(Math.abs(fx), Math.abs(fy));

                    this._op = np;

                    this._renderer.render(this._scalingObject, true);
                    const poi: POIMap = this._object.pointsOfInterest;

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
        const poi = this._object.pointsOfInterest[this._scalingPOI].copy.sub(this._scalingObject.center);
        const dx = this._op.x - poi.x;
        const dy = this._op.y - poi.y;

        if (dx !== 0 || dy !== 0) {
            const fx = this._op.x !== 0 ? (this._op.x + dx) / this._op.x : 1;
            const fy = this._op.y !== 0 ? (this._op.y + dy) / this._op.y : 1;
            return `SCALE ${this._object.name}, ${Math.abs(fx)}, ${Math.abs(fy)}`

        } else {
            return null;
        }
    }
}