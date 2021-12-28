import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";

export class Circle extends Operation {


    private _center: Point2Parameter;
    private _radius: Parameter;
    private _target: Parameter;
    private _drawing: Parameter;

    constructor(opcode, drawing, target, center, radius) {
        super(opcode);
        this._center = center;
        this._radius = radius;
        this._target = target;
        this._drawing = drawing;
    }

    get center():any {
        return this._center.finalized(this.closure)
    }

    set center(value) {
        this._setParam(this._center, value)
    }

    get radius():any {
        return this._getParam(this._radius)
    }

    set radius(value) {
        this._setParam(this._radius, value)
    }

    get drawing():Array<any> {
        return this._getParam(this._drawing);
    }

    get target(): any {
        return this._getParam(this._target);
    }

    async execute(interpreter: Interpreter): Promise<any> {

        this.drawing.push({
            t:"circle",
            x: this.center.x,
            y: this.center.y,
            p1: this.radius,
            p2: 0,
            p3: 0
        })
/*

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", this.center.x)
        circle.setAttribute("cy", this.center.y)
        circle.setAttribute("r", this.radius)

        this._setParam(this._target, circle);

        this.drawing.appendChild(circle)
*/

    }


}