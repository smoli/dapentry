import {GrQuadratic} from "../Objects/GrPolygon";
import {DrawPolygon} from "./DrawPolygon";

export class DrawQuadratic extends DrawPolygon {

    constructor(renderer) {
        super(renderer);

        this._renderMethod = renderer.renderQuadratic.bind(renderer);
        this._opCode = "QUAD";
        this._objectClass = GrQuadratic;
    }

}