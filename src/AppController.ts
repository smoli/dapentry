import {Store} from "vuex";
import {AppState} from "./state/AppState";
import {ObjectRenderer, RenderLayer} from "./drawing/ObjectRenderer";
import {Interpreter} from "./runtime/interpreter/Interpreter";
import {AppConfig} from "./AppConfig";
import {InteractionEvents} from "./drawing/InteractionEvents";
import {ToolNames} from "./tools/ToolNames";

export class AppController {
    private _state: Store<AppState>;
    private _interpreter: Interpreter;

    constructor(state:Store<AppState>,
                interpreter: Interpreter) {
        this._state = state;
        this._interpreter = interpreter;
    }


    public handleKeyEvent(event: KeyboardEvent) {
            if (document.activeElement && document.activeElement.tagName.toUpperCase() === "INPUT") {
                return;
            }

            if (event.code === "Tab") {
                event.preventDefault();
            }

            if (event.code === AppConfig.Keys.NextStepCode) {
                // Todo: We can now do this here
                // this.fireNextStep();
            } else if (event.code === AppConfig.Keys.DeleteCode) {
                // Todo: We can now do this here
                // this.fireObjectDeleted();
            } else if (event.code === AppConfig.Keys.ObjectSnapCode) {
                event.preventDefault();
                // Todo: We can now do this here
                // this._pumpToTool(InteractionEvents.OtherObject, event);
            } else if (event.keyCode === AppConfig.Keys.AbortToolKeyCode) {
                this._state.commit("tool/switch", null);
            } else if (event.key === AppConfig.Keys.DrawCircleKey) {
                this._state.commit("tool/switch", ToolNames.Circle);
            } else if (event.key === AppConfig.Keys.DrawRectKey) {
                this._state.commit("tool/switch", ToolNames.Rectangle);
            } else if (event.key === AppConfig.Keys.DrawLineKey) {
                this._state.commit("tool/switch", ToolNames.Line);
            } else if (event.key === AppConfig.Keys.DrawPolygonKey) {
                this._state.commit("tool/switch", ToolNames.Polygon);
            } else if (event.key === AppConfig.Keys.DrawQuadricKey) {
                this._state.commit("tool/switch", ToolNames.Quadric);
            } else if (event.key === AppConfig.Keys.MoveKey) {
                this._state.commit("tool/switch", ToolNames.Move);
            } else if (event.key === AppConfig.Keys.RotateKey) {
                this._state.commit("tool/switch", ToolNames.Rotate);
            } else if (event.key === AppConfig.Keys.ScaleKey) {
                this._state.commit("tool/switch", ToolNames.Scale);
            } else {
                // Todo: How to pass key strokes to tools
                // this._pumpToTool(InteractionEvents.Key, event)
            }
    }
}