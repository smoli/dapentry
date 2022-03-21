import {
    HandleMouseCallBack,
    InfoHandle,
    MouseHandler,
    ObjectRenderer,
    POICallback,
    RenderLayer
} from "../../../src/core/ObjectRenderer";
import {GrObject, POI, POIPurpose} from "../../../src/geometry/GrObject";
import {GrBezier, GrPolygon, GrQuadratic} from "../../../src/geometry/GrPolygon";
import {GrCircle} from "../../../src/geometry/GrCircle";
import {Point2D} from "../../../src/geometry/Point2D";
import {GrLine} from "../../../src/geometry/GrLine";
import {GrRectangle} from "../../../src/geometry/GrRectangle";
import {GrText} from "../../../src/geometry/GrText";

export class MockRenderer extends ObjectRenderer {
    private _poiCallback: POICallback;
    private _snapObject: GrObject;
    private _snapPoi: POI;

    constructor() {
        super(null, true);
    }

    setupMouseHandlers(onMouseMove: MouseHandler, onClick: MouseHandler, onAlternateClick: MouseHandler, onMouseDown: MouseHandler, onMouseUp: MouseHandler) {

    }

    getSVGPreview(): any {
        return ""
    }

    pointerCoordsFromEvent(event: MouseEvent) {
        return null;
    }

    hitPoi(object: GrObject, poiId: POI) {
        if (this._poiCallback) {
            this._snapObject = object;
            this._snapPoi = poiId;
            this._poiCallback(object, poiId, object.pointsOfInterest(POIPurpose.MANIPULATION)[poiId], true)
        }
    }

    unHitLastPoi() {
        if (this._poiCallback && this._snapObject) {
            this._poiCallback(
                this._snapObject,
                this._snapPoi,
                this._snapObject.pointsOfInterest(POIPurpose.MANIPULATION)[this._snapPoi],
                false);
            this._snapObject = null;
        }
    }


    clear(layer: RenderLayer): void {
    }

    clearInfo() {
    }

    enablePOI(enabled: boolean, poiCallback?: POICallback, except?: Array<GrObject>): void {
        this._poiCallback = poiCallback;
    }

    remove(object: GrObject): void {
    }

    removeAllHandles(object): void {
    }

    removeBoundingRepresentation(object: GrObject): void {
    }

    removeInfo(handle: InfoHandle) {
    }

    render(object: GrObject, selected: boolean): void {
    }

    renderBezier(layer: RenderLayer, bezier: GrBezier, enableMouseEvents: boolean): void {
    }

    renderBoundingRepresentation(object: GrObject): void {
    }

    renderCircle(layer: RenderLayer, circle: GrCircle, enableMouseEvents: boolean): void {
    }

    renderHandle(object: GrObject, id: string, p: Point2D, onMouseEvent: HandleMouseCallBack, data?: any): void {
    }

    renderInfoText(position: Point2D, text: string): InfoHandle {
        return undefined;
    }

    renderLine(layer: RenderLayer, line: GrLine, enableMouseEvents: boolean): void {
    }

    renderText(layer: RenderLayer, text: GrText, enableMouseEvents: boolean) {
    }

    renderPolygon(layer: RenderLayer, polygon: GrPolygon, enableMouseEvents: boolean): void {
    }

    renderQuadratic(layer: RenderLayer, quadric: GrQuadratic, enableMouseEvents: boolean): void {
    }

    renderRectangle(layer: RenderLayer, rect: GrRectangle, enableMouseEvents: boolean): void {
    }

    reset(): void {
    }

    updateHandle(object: GrObject, id: string, p: Point2D) {
    }

    updateInfoText(handle: InfoHandle, text: string, position?: Point2D) {
    }

    renderInfoLine(p1: Point2D, p2: Point2D): InfoHandle {
        return undefined;
    }

    updateInfoLine(handle: InfoHandle, p1: Point2D, p2: Point2D) {
    }

}