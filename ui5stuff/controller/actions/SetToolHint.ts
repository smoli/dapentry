import Component from "../../Component";
import {BaseAction} from "./BaseAction";
import {ToolNames} from "../../../src/tools/ToolNames";

export class SetToolHint extends BaseAction {
    private readonly _toolName: ToolNames;

    constructor(component: Component, toolName:ToolNames) {
        super(component);
        this._toolName = toolName;
    }


    protected getHintForTool(toolName:ToolNames) {
        return this.getResourceText("ToolHint" + ToolNames[toolName]);
    }

    _execute() {
        this.appState.setToolHint(this.getHintForTool(this._toolName));
    }
}