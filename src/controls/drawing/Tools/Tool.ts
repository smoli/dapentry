import {state, StateMachine} from "../../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject} from "../Objects/GrObject";
import {Point2D} from "../Objects/GeoMath";

export interface SnapInfo {
    object: GrObject,
    poiId: string,
    point: Point2D,
    event: InteractionEventData
}

/**
 * Abstract class for tools that create or manipulate objects on the drawing
 */
export abstract class Tool {

    /**
     * Renderer where the intermediate representation of the toll can be drawn.
     * @protected
     */
    protected _renderer: ObjectRenderer;

    /**
     * Handling the tool state
     * @protected
     */
    protected _state: StateMachine;

    /**
     * ID of the state that indicates the tool is done
     * @protected
     */
    protected readonly _doneStateId: string;

    /**
     * ID of the state that indicates that the tool waits for the user to perform the first actions
     * @protected
     */
    protected readonly _waitStateId: string;
    private _snappingObject: GrObject;
    private _snappingPOI: string;
    private _snapPoint: Point2D;

    protected constructor(renderer: ObjectRenderer, waitStateId?: string, doneStateId?: string) {
        this._renderer = renderer;
        this._waitStateId = waitStateId;
        this._doneStateId = doneStateId;
        this._state = new StateMachine();
    }

    /**
     * Is the tool done?
     */
    public get isDone(): boolean {
        return this._state.state.id === this._doneStateId;
    }

    /**
     * Use this to tear down anything you need before the tool is deactivated
     */
    public finish(): void {
        this.clearSnapInfo();
        return;
    }

    /**
     * Abort tool. This does not deactivate the tool.
     */
    public abort(): void {
        return;
    }

    /**
     * Reset the tool back to the waiting state.
     */
    public reset() {
        this._state.start(state(this._waitStateId));
    }

    /**
     * This tool instance will not be used again. Clean up.
     */
    public tearDown() {
        return;
    }

    /**
     * This will be called whenever the user interacts with the tool/drawing. Update the tools
     * state here and perform the necessary actions.
     *
     * @param interactionEvent
     * @param eventData
     */
    public abstract update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean;

    /**
     * If the tool creates something, return it here.
     */
    public abstract get result(): (string | Array<string>);


    protected clearSnapInfo() {
        this._snapPoint = this._snappingObject = this._snappingPOI = null;
    }

    protected enableSnapping(objectsToExclude: Array<GrObject> = []) {
        this._renderer.enablePOI(true, (object: GrObject, poiId: string, hit: boolean) => {
            if (hit) {
                this._snappingObject = object;
                this._snappingPOI = poiId;
                this._snapPoint = this._snappingObject.pointsOfInterest[this._snappingPOI]
            } else {
                this._snapPoint = this._snappingPOI = this._snappingObject = null;
            }
        }, objectsToExclude);
    }

    protected disableSnapping() {
        this.clearSnapInfo();
        this._renderer.enablePOI(false);
    }

    protected tryToSnap(eventData: InteractionEventData): SnapInfo {
        if (this._snappingObject) {
            return {
                object: this._snappingObject,
                poiId: this._snappingPOI,
                point: this._snapPoint,
                event: {
                    ...eventData,
                    x: this._snapPoint.x,
                    y: this._snapPoint.y
                }
            }
        } else return {
            event: eventData, object: null, poiId: null, point: null
        }

    }
}