import {Store} from "vuex";
import {AppState} from "./state/AppState";
import {ObjectRenderer, RenderLayer} from "./drawing/ObjectRenderer";
import {Interpreter} from "./runtime/interpreter/Interpreter";

export class AppController {
    private _state: Store<AppState>;
    private _renderer: ObjectRenderer;
    private _interpreter: Interpreter;

    constructor(state:Store<AppState>,
                renderer:ObjectRenderer,
                interpreter: Interpreter) {
        this._state = state;
        this._renderer = renderer;
        this._interpreter = interpreter;
    }

    _render() {
        this._renderer.clear(RenderLayer.Objects);
        this._state.state.drawing.objects.forEach(object => {
            this._renderer.render(object, false);
        })
    }

    public handleKeyEvent(event: KeyboardEvent) {

    }
}