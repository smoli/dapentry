import {GrObject} from "../../src/geometry/GrObject";
import {GrObjectList} from "../../src/geometry/GrObjectList";

export {GrCanvas as Canvas} from "../../src/geometry/GrCanvas";
export {GrLine as Line} from "../../src/geometry/GrLine";
export {GrRectangle as Rectangle} from "../../src/geometry/GrRectangle";
export {GrPolygon as Polygon} from "../../src/geometry/GrPolygon";
export {GrCircle as Circle} from "../../src/geometry/GrCircle";
export {GrText as Text} from "../../src/geometry/GrText";
export {AspectRatio} from "../../src/geometry/AspectRatio";
export * from "../../src/publish/creationHelpers"

export const $styles = {
    default: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 0.2,
        "strokeWidth": 2,
    },
    textDefault: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 1,
        "strokeWidth": 0,
        "textAlignment": 0,
        "verticalAlignment": 0,
        "fontFamily": "Sans-serif",
        "fontSize": 50,
    }
};


export function makeObjectManager() {
    const __objects = {};
    return function(name: string, object: GrObject = null) {
        if (object) {
            if (__objects[name]) {
                const l = new GrObjectList(name);
                l.addObject(__objects[name]);
                l.addObject(object);
                __objects[name] = l;
            } else {
                __objects[name] = object;
            }
        }

        return __objects[name];
    }
}

