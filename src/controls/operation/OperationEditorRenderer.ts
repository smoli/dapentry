import {C} from "../ControlHelper";
import OperationEditor from "./OperationEditor";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text"
import Input from "sap/m/Input";
import {TokenTypes} from "../../runtime/interpreter/TokenTypes";
import {Parser, Token} from "../../runtime/interpreter/Parser";


const renderer = {


    createInputsForSegment(s, control:OperationEditor):Array<Control> {
        const controls = [];

        switch (s.token.type) {

            case TokenTypes.POINT:
                controls.push(new Text({ text: "("}))
                controls.push(new Input({ value: s.token.value[0].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 0)}))
                controls.push(new Text({ text: ","}))
                controls.push(new Input({ value: s.token.value[1].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 1)}))
                controls.push(new Text({ text: ")"}))
                break;

            case TokenTypes.EXPRESSION:
                const exp = Parser.constructCodeLine([s.token]);
                controls.push(new Input({ value: exp, width: "5em", change: control.inputChangeHandler.bind(control, s.index, -1)}))
                break;

            case TokenTypes.REGISTERAT:
                controls.push(new Input({ value: s.token.value[0].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 0)}))
                controls.push(new Text({ text: "s"}))
                controls.push(new Input({ value: s.token.value[1].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 1)}))
                break;

            default:
                controls.push(new Input({ value: s.token.value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, -1)}))

        }

        return controls;
    },


    render(rm, control: OperationEditor) {
        const root = C("div", control);
        const segments:Array<any> = control.createSegments();

        root.class("stsDrawableOperationEditor", true);
        for (const s of segments) {
            switch (s.type) {
                case "input":
                    if (!s.token) {
                        continue;
                    }
                    this.createInputsForSegment(s, control).forEach(c => root.appendControl(c))

                    break;
                case "text":
                    root.appendControl(new Text({ text: s.value as string}))
            }
        }

        root.render(rm)
    }
}

export default renderer;