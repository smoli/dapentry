import {
    HandleMouseCallBack,
    InfoHandle,
    ObjectRenderer,
    POICallback,
    RenderLayer
} from "../../../src/drawing/ObjectRenderer";
import {GrObject, POI} from "../../../src/geometry/GrObject";
import {GrBezier, GrPolygon, GrQuadratic} from "../../../src/geometry/GrPolygon";
import {GrCircle} from "../../../src/geometry/GrCircle";
import {Point2D} from "../../../src/geometry/Point2D";
import {GrLine} from "../../../src/geometry/GrLine";
import {GrRectangle} from "../../../src/geometry/GrRectangle";

export class MockRenderer extends ObjectRenderer {
    private _poiCallback: POICallback;
    private _snapObject: GrObject;
    private _snapPoi: POI;

    constructor() {
        super();
    }

    pointerCoordsFromEvent(event: MouseEvent) {
        return null;
    }

    hitPoi(object: GrObject, poiId: POI) {
        if (this._poiCallback) {
            this._snapObject = object;
            this._snapPoi = poiId;
            this._poiCallback(object, poiId, true)
        }
    }

    unHitLastPoi() {
        if (this._poiCallback && this._snapObject) {
            this._poiCallback(this._snapObject, this._snapPoi, false);
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


}