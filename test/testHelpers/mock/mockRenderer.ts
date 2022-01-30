import {
    HandleMouseCallBack,
    InfoHandle,
    ObjectRenderer,
    POICallback,
    RenderLayer
} from "../../../src/controls/drawing/Objects/ObjectRenderer";
import {GrObject} from "../../../src/Geo/GrObject";
import {GrBezier, GrPolygon, GrQuadratic} from "../../../src/Geo/GrPolygon";
import {GrCircle} from "../../../src/Geo/GrCircle";
import {Point2D} from "../../../src/Geo/Point2D";
import {GrLine} from "../../../src/Geo/GrLine";
import {GrRectangle} from "../../../src/Geo/GrRectangle";

export class MockRenderer extends ObjectRenderer {

    constructor() {
        super();
    }

    clear(layer: RenderLayer): void {
    }

    clearInfo() {
    }

    enablePOI(enabled: boolean, poiCallback?: POICallback, except?: Array<GrObject>): void {
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