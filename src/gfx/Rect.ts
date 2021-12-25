import {Operation} from "../interpreter/Operation";
import {Parameter} from "../interpreter/Parameter";
import {Interpreter} from "../interpreter/Interpreter";
import {Point2Parameter} from "../interpreter/types/Point2Parameter";

export class Rect extends Operation {


    private _target: Point2Parameter;
    private _p1: Point2Parameter;
    private _width: Parameter;
    private _height: Parameter;
    private _drawing: Parameter;

    constructor(opcode, drawing, target, p1, w, h) {
        super(opcode);
        this._target = target;
        this._p1 = p1;
        this._width = w;
        this._height = h;
        this._drawing = drawing;
    }

    get p1():any {
        return this._p1.finalized(this.closure)
    }

    set p1(value) {
        this._setParam(this._p1, value)
    }

    get width():any {
        return this._getParam(this._width)
    }

    set width(value) {
        this._setParam(this._width, value)
    }

    get drawing():Node {
        return this._getParam(this._drawing);
    }

    get height(): any {
        return this._getParam(this._height);
    }

    async execute(interpreter: Interpreter): Promise<any> {

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", this.p1.x)
        rect.setAttribute("y", this.p1.y)
        rect.setAttribute("width", this.width)
        rect.setAttribute("height", this.height)

        this._setParam(this._target, rect);

        this.drawing.appendChild(rect)

    }

}