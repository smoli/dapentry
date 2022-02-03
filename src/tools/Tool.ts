import {state, StateMachine} from "../runtime/tools/StateMachine";
import {InteractionEventData, InteractionEvents} from "../controls/drawing/InteractionEvents";
import {InfoHandle, ObjectRenderer} from "../controls/drawing/Objects/ObjectRenderer";
import {GrObject, POI, POIPurpose} from "../Geo/GrObject";
import {Point2D} from "../Geo/Point2D";
import {GrObjectList} from "../Geo/GrObjectList";
import {AppConfig} from "../AppConfig";

export interface SnapInfo {
    object: GrObject,
    poiId: number,
    point: Point2D,
    event: InteractionEventData
}

function stepper(step) {
    return v => Math.floor(v / step) * step;
}

const s0_1 = stepper(AppConfig.Tools.ObjectSnappingStep);

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
    private _snappingPOI: number;
    private _snapPoint: Point2D;
    private _otherObject: GrObject;
    private _usedSnapInfos: Array<SnapInfo>;
    private _poiSnapping: boolean;
    private _objectSnapInfoHandle: InfoHandle;

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
        this.clearSnapInfo();
        this._usedSnapInfos = null;
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
        this.disablePOISnapping(true);
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

    protected setFirstSnappingInfo(info: SnapInfo, overwrite: boolean = false) {
        if (!this._snappingFirstInfo || overwrite) {
            this._snappingFirstInfo = info;
        }
    }

    protected clearLastSnapPoint() {
        if (this._usedSnapInfos) {
            this._usedSnapInfos.pop();
        }
    }

    protected resetAxisAlignment(snapInfoForFirst: SnapInfo = null) {
        this._snappingFirstInfo = snapInfoForFirst;
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

    protected getResultPreview(usedSnapInfos: Array<SnapInfo>): (string | Array<string>) {
        return this.getResult(usedSnapInfos);
    }


    public get resultPreview(): (string | Array<string>) {
        return this.getResultPreview(this._usedSnapInfos);
    }


    protected clearSnapInfo() {
        this._snapPoint =
            this._snappingObject =
                this._snappingPOI =
                    this._snappingFirstInfo = null;
        this._poiSnapping = null;
        this._objectSnapInfoHandle = null;
    }

    protected get usedSnapInfos():Array<SnapInfo> {
        return this._usedSnapInfos;
    }

    protected enablePOISnapping(objectsToExclude: Array<GrObject> = []) {

        if (!this._renderer) {
            return;
        }
        this._poiSnapping = true;
        this._renderer.clearInfo();

        let handle;

        this._renderer.enablePOI(true, (object: GrObject, poiId: number, hit: boolean) => {
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

    protected disablePOISnapping(force: boolean = false) {
        if (!this._poiSnapping && !force) {
            return;
        }
        this._objectSnapInfoHandle = null;
        this._poiSnapping = false;
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
        if (eventData[AppConfig.Keys.ToolAxisAlignModifierName]) {
            pct = s0_1(pct);
            p = object.getPointAtPercentage(pct);
        }

        if (!this._objectSnapInfoHandle) {
            this._objectSnapInfoHandle = this._renderer.renderInfoText(p, (100 * pct).toFixed(1) + "%");
        } else  {
            this._renderer.updateInfoText(this._objectSnapInfoHandle, (100 * pct).toFixed(1) + "%", p)
        }

        return {
            event: {
                ...eventData,
                x: p.x,
                y: p.y
            }, object: object, poiId: undefined, point: p

        }
    }

    protected tryToPOISnap(eventData: InteractionEventData): SnapInfo {
        if (eventData[AppConfig.Keys.ObjectSnappingStepModifierName] && this._snappingFirstInfo) {
            // Try to axis-snap
            const dx = Math.abs(eventData.x - this._snappingFirstInfo.event.x);
            const dy = Math.abs(eventData.y - this._snappingFirstInfo.event.y);

            const snapInfo = this.dontSnap(eventData);
            if (dx > dy && dx > AppConfig.Tools.AxisAlignmentThreshold) {
                snapInfo.event.y = this._snappingFirstInfo.event.y;
            } else if (dy > dx && dy > AppConfig.Tools.AxisAlignmentThreshold) {
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

    protected makeCodeForNumber(num: number): string {
        return num.toFixed(AppConfig.Tools.MaxDecimals);
    }

    protected makeCodeForPoint(p: Point2D): string {
        return `(${this.makeCodeForNumber(p.x)}, ${this.makeCodeForNumber(p.y)})`;
    }


    protected makePointCodeFromSnapInfo(snapInfo: SnapInfo) {
        if (snapInfo.object) {
            if (snapInfo.poiId === undefined) {
                const pct = snapInfo.object.projectPointAsPercentage(snapInfo.point);
                return `${snapInfo.object.name}@${this.makeCodeForNumber(pct)}`
            } else {
                return `${snapInfo.object.name}@${POI[snapInfo.poiId]}`
            }
        }
        return `(${this.makeCodeForNumber(snapInfo.event.x)}, ${this.makeCodeForNumber(snapInfo.event.y)})`
    }


    protected makeCreateStatement(opcode, targetName, ...args) {
        return this.makeStatement(opcode, targetName, AppConfig.Runtime.defaultStyleRegisterName, ...args);
    }

    protected makeStatement(opcode, ...args) {

        const lArgs = args.filter(a => a !== undefined && a !== null).map(a => {
            if (typeof a === "string") return a;
            if (typeof a === "number") return this.makeCodeForNumber(a);
            if (a instanceof Point2D) return this.makeCodeForPoint(a);
            if (typeof a === "object") return this.makePointCodeFromSnapInfo(a);
        })

        return `${opcode} ${lArgs.join(",")}`
    }
}