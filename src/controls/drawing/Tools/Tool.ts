import {state, StateMachine} from "../../../runtime/tools/StateMachine";
import {InteractionEvents, InteractionEventData} from "../InteractionEvents";
import {ObjectRenderer} from "../Objects/ObjectRenderer";
import {GrObject, POI, POIPurpose} from "../../../Geo/GrObject";
import {Point2D} from "../../../Geo/Point2D";
import {GrObjectList} from "../../../Geo/GrObjectList";

export interface SnapInfo {
    object: GrObject,
    poiId: string,
    point: Point2D,
    event: InteractionEventData
}

function stepper(step) {
    return v => Math.floor(v / step) * step;
}

const MIN_DISTANCE_FOR_AXIS_SNAPPING: number = 20;
const s0_1 = stepper(0.01);

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
    protected _doneStateId: string;

    /**
     * ID of the state that indicates that the tool waits for the user to perform the first actions
     * @protected
     */
    protected _waitStateId: string;

    private _snappingFirstInfo: SnapInfo;
    private _snappingObject: GrObject;
    private _snappingPOI: string;
    private _snapPoint: Point2D;
    private _otherObject: GrObject;
    private _usedSnapInfos: Array<SnapInfo>;

    protected constructor(renderer: ObjectRenderer, ...params: Array<any>) {
        this._renderer = renderer;
        this._state = new StateMachine();
    }

    public setWaitDoneStates(waitStateId?: string, doneStateId?: string) {
        this._waitStateId = waitStateId;
        this._doneStateId = doneStateId;
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
        if (this._renderer) {
            this._renderer.clearInfo();
        }
        return;
    }

    /**
     * Abort tool. This does not deactivate the tool.
     */
    public abort(): void {
        this.disablePOISnapping();
        if (this._renderer) {
            this._renderer.clearInfo();
        }
        return;
    }

    /**
     * Reset the tool back to the waiting state.
     */
    public reset() {
        this._otherObject = null;
        this.clearSnapInfo();
        this._state.start(state(this._waitStateId));
    }

    /**
     * This tool instance will not be used again. Clean up.
     */
    public tearDown() {
        this.disablePOISnapping();
        return;
    }

    /**
     * This will be called whenever the user interacts with the tool/drawing. Update the tools
     * state here and perform the necessary actions.
     *
     * @param interactionEvent
     * @param eventData
     */
    public update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        if (interactionEvent === InteractionEvents.Cancel) {
            this.reset();
            return false;
        }

        if (interactionEvent === InteractionEvents.OtherObject) {
            this._otherObject = eventData.object;
            if (!this._otherObject) {
                this.enablePOISnapping();
            }
        }

        let snapInfo;

        if (this._otherObject) {
            snapInfo = this.snapToObject(this._otherObject, eventData);
            if (snapInfo !== null) {
                // We only disable point snapping if the object supports at-access
                this.disablePOISnapping();
            } else {
                snapInfo = this.tryToPOISnap(eventData);
            }
        } else {
            snapInfo = this.tryToPOISnap(eventData);
        }

        return this._update(interactionEvent, snapInfo);
    }

    /**
     * Declare that the snapInfo was used. This information may
     * then be used to snap on axis.
     * @param snapInfo
     * @protected
     */
    protected snapInfoUsed(snapInfo: SnapInfo) {
        if (!this._snappingFirstInfo) {
            this._snappingFirstInfo = snapInfo;
        }
        if (!this._usedSnapInfos) {
            this._usedSnapInfos = [snapInfo];
        } else {
            this._usedSnapInfos.push(snapInfo);
        }
    }


    protected abstract _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo): boolean;


    /**
     * If the tool creates something, return it here.
     */
    public get result(): (string | Array<string>) {
        const r = this.getResult(this._usedSnapInfos);
        this._usedSnapInfos = null;
        return r;
    }

    protected getResult(usedSnapInfos: Array<SnapInfo>): (string | Array<string>) {
        return null;
    }


    protected clearSnapInfo() {
        this._snapPoint =
            this._snappingObject =
                this._snappingPOI =
                    this._snappingFirstInfo = null
    }

    protected get usedSnapInfos():Array<SnapInfo> {
        return this._usedSnapInfos;
    }

    protected enablePOISnapping(objectsToExclude: Array<GrObject> = []) {

        if (!this._renderer) {
            return;
        }
        this._renderer.clearInfo();

        let handle;

        this._renderer.enablePOI(true, (object: GrObject, poiId: string, hit: boolean) => {
            if (hit) {
                this._snappingObject = object;
                this._snappingPOI = poiId;
                console.log("snap", this._snappingObject, this._snappingPOI)
                this._snapPoint = this._snappingObject.pointsOfInterest(POIPurpose.SNAPPING)[this._snappingPOI]
                handle = this._renderer.renderInfoText(this._snapPoint, POI[poiId]);
            } else {
                this._snapPoint = this._snappingPOI = this._snappingObject = null;
                this._renderer.removeInfo(handle);
            }
            // Even if the tool want to exclude an object we will include it, if it is a List with more
            // than one entry, because then manipulation and snapping is actually done on two different
            // objects of that list.
        }, objectsToExclude.filter(o => (o instanceof GrObjectList && o.objects.length < 2) || !(o instanceof GrObjectList)));
    }

    protected disablePOISnapping() {
        this.clearSnapInfo();
        if (this._renderer) {
            this._renderer.enablePOI(false);
            this._renderer.clearInfo();
        }
    }

    protected snapToObject(object: GrObject, eventData): SnapInfo {
        let p = object.projectPoint(new Point2D(eventData.x, eventData.y));
        if (p === null) {
            return null;
        }
        let pct = object.projectPointAsPercentage(new Point2D(eventData.x, eventData.y));
        if (eventData.shift) {
            pct = s0_1(pct);
            p = object.getPointAtPercentage(pct);
        }

        this._renderer.renderInfoText(p, (100 * pct).toFixed(1) + "%");

        return {
            event: {
                ...eventData,
                x: p.x,
                y: p.y
            }, object: object, poiId: undefined, point: p

        }
    }

    protected tryToPOISnap(eventData: InteractionEventData): SnapInfo {
        if (eventData.shift && this._snappingFirstInfo) {
            // Try to axis-snap
            const dx = Math.abs(eventData.x - this._snappingFirstInfo.event.x);
            const dy = Math.abs(eventData.y - this._snappingFirstInfo.event.y);

            const snapInfo = this.dontSnap(eventData);
            if (dx > dy && dx > MIN_DISTANCE_FOR_AXIS_SNAPPING) {
                snapInfo.event.y = this._snappingFirstInfo.event.y;
            } else if (dy > dx && dy > MIN_DISTANCE_FOR_AXIS_SNAPPING) {
                snapInfo.event.x = this._snappingFirstInfo.event.x;
            }
            return snapInfo;
        } else if (this._snappingObject) {
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
        } else {
            return this.dontSnap(eventData);
        }
    }

    dontSnap(eventData) {
        return {
            event: eventData, object: null, poiId: null, point: null
        }
    }

    protected makePointCodeFromSnapInfo(snapInfo: SnapInfo) {
        if (snapInfo.object) {
            if (snapInfo.poiId === undefined) {
                const pct = snapInfo.object.projectPointAsPercentage(snapInfo.point);
                return `${snapInfo.object.name}@${pct.toFixed(2)}`
            } else {
                return `${snapInfo.object.name}@${POI[snapInfo.poiId]}`
            }
        }
        return `(${snapInfo.event.x}, ${snapInfo.event.y})`
    }
}