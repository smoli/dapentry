import {InteractionEventData, InteractionEvents} from "../core/InteractionEvents";
import {SnapInfo, Tool} from "./Tool";
import {ObjectRenderer} from "../core/ObjectRenderer";
import {GrObject, POI, POIMap, POIPurpose, ScaleMode} from "../geometry/GrObject";
import {state} from "../runtime/tools/StateMachine";
import {Point2D} from "../geometry/Point2D";
import {makeScaleFactorsUniform, scaleToAPoint} from "../geometry/GeoMath";
import {AppConfig} from "../core/AppConfig";

enum States {
    Wait = "MoveTool.Wait",
    Done = "MoveTool.Done",
    Handle = "MoveTool.Handle"
}

enum Events {
    HandleDown = "MoveTool.HandleDown"
}


export class ScaleTool extends Tool {

    protected _scaleMode: ScaleMode = ScaleMode.NONUNIFORM;
    protected _selection: Array<GrObject> = [];
    protected _scalingPOI: POI = null;
    protected _snapScalePoint: SnapInfo = null;
    protected _finalX: number;
    protected _finalY: number;

    private _op: Point2D;
    private _pivot: Point2D;
    private _pivotPOI: POI;
    private _scaleResetInfo: any;

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
        const poi: POIMap = this._object.pointsOfInterest(POIPurpose.SCALING);

        Object.keys(poi)
            .forEach(poiId => {
                this._renderer.renderHandle(this._object, poiId, poi[poiId], this._onHandleEvent.bind(this), Number(poiId));
            })

        this._renderer.renderBoundingRepresentation(this._object);
    }

    protected _onHandleEvent(object: GrObject, eventData: InteractionEventData, poiId): void {

        if (eventData.interactionEvent === InteractionEvents.MouseDown && poiId !== POI.center) {
            this._state.next(Events.HandleDown);
            this._target = object.createProxy();
            this._scaleResetInfo = this._target.getScaleResetInfo();
            this._scaleMode = this._target.supportedScaleModes[0];

            this._scalingPOI = poiId;
            this._pivotPOI = object.getPivotFor(this._scalingPOI, POIPurpose.SCALING);
            this._pivot = this._target.pointsOfInterest(POIPurpose.SCALING)[this._pivotPOI];
            this._op = this._target.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI].copy;
            this._finalX = 1;
            this._finalY = 1;
            this.enablePOISnapping([this._object])
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
        let oldPosition = this._target.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI];
        let newPosition = oldPosition.copy;
        newPosition.x += dx;
        newPosition.y += dy;

        const oldLocal = this._target.mapPointToLocal(this._op);
        const newLocal = this._target.mapPointToLocal(newPosition);
        const pivotLocal = this._target.mapPointToLocal(this._pivot);

        let { fx, fy } = scaleToAPoint(oldLocal, pivotLocal, newLocal);

        if (this._scaleMode === ScaleMode.UNIFORM) {
            fx = makeScaleFactorsUniform(fx, fy);
            this._finalX = fx;
            this._finalY = this._finalX;
        } else {
            this._finalX = fx;
            this._finalY = fy;
        }

        this._target.resetScaling(this._scaleResetInfo);
        this._target.scale(this._finalX, this._finalY, this._pivot);
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo = null): boolean {
        let eventData = snapInfo.event;
        this._state.next(interactionEvent);

        if (interactionEvent === InteractionEvents.Selection) {
            this.selection = eventData.selection;
        }

        let dx;
        let dy;


        if (this._object && this._scalingPOI !== null) {
            const thePOI = this._target.pointsOfInterest(POIPurpose.SCALING)[this._scalingPOI].copy;
            dx = eventData.x - thePOI.x;
            dy = eventData.y - thePOI.y;
        } else {
            return;
        }

        switch (this._state.state.id as States) {
            case States.Wait:
                this._scalingPOI = this._target = null;
                break;

            case States.Done:
                this._scale(dx, dy);
                this._scaleMode = snapInfo.event.shift ? ScaleMode.UNIFORM : ScaleMode.NONUNIFORM;
                return true;

            case States.Handle:
                if (interactionEvent === InteractionEvents.MouseMove) {
                    this._scaleMode = snapInfo.event.shift ? ScaleMode.UNIFORM : ScaleMode.NONUNIFORM;
                    this._snapScalePoint = snapInfo;
                    this._scale(dx, dy);
                    this._renderer.render(this._target, true);
                    const poi: POIMap = this._target.pointsOfInterest(POIPurpose.SCALING);
                    Object.keys(poi)
                        .forEach(poiId => {
                            this._renderer.updateHandle(this._target, poiId, poi[poiId]);
                        })

                }
                break;
        }
        return false;
    }

    getResult(): any {
        const pivot = `${this._object.uniqueName}@${POI[this._pivotPOI]}`;


        if (this._snapScalePoint?.object) {
            const scalingPoint = `${this._object.uniqueName}@${POI[this._scalingPOI]}`;
            if (this._scaleMode == ScaleMode.UNIFORM) {
                return `${AppConfig.Runtime.Opcodes.Scale.ToPointUniform} ${this._object.uniqueName}, ${scalingPoint}", ${this.makePointCodeFromSnapInfo(this._snapScalePoint)}, ${pivot}`;
            } else {
                return `${AppConfig.Runtime.Opcodes.Scale.ToPoint} ${this._object.uniqueName}, ${scalingPoint}, ${this.makePointCodeFromSnapInfo(this._snapScalePoint)}, ${pivot}`;
            }
        }

        if (this._scaleMode == ScaleMode.UNIFORM) {
            return `${AppConfig.Runtime.Opcodes.Scale.FactorUniform} ${this._object.name}, ${this.makeCodeForNumber(this._finalX)}, ${pivot}`
        } else if (this._finalX !== undefined && this._finalY !== undefined) {
            return `${AppConfig.Runtime.Opcodes.Scale.Factor} ${this._object.name}, ${this.makeCodeForNumber(this._finalX)}, ${this.makeCodeForNumber(this._finalY)}, ${pivot}`
        }
    }
}