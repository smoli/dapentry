import {C} from "../ControlHelper";
import OperationEditor from "./OperationEditor";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text"
import Input from "sap/m/Input";
import {TokenTypes} from "../../runtime/interpreter/TokenTypes";


const renderer = {

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
                    if (s.token.type === TokenTypes.POINT) {
                        root.appendControl(new Text({ text: "("}))
                        root.appendControl(new Input({ value: s.token.value[0].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 0)}))
                        root.appendControl(new Text({ text: ","}))
                        root.appendControl(new Input({ value: s.token.value[1].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 1)}))
                        root.appendControl(new Text({ text: ")"}))
                    } else if (s.token.type === TokenTypes.REGISTERAT) {
                        root.appendControl(new Input({ value: s.token.value[0].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 0)}))
                        root.appendControl(new Text({ text: "s"}))
                        root.appendControl(new Input({ value: s.token.value[1].value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, 1)}))
                    } else {
                        root.appendControl(new Input({ value: s.token.value, width: "5em", change: control.inputChangeHandler.bind(control, s.index, -1)}))
                    }

                    break;
                case "text":
                    root.appendControl(new Text({ text: s.value as string}))
            }
        }

        root.render(rm)
    }
}

export default renderer;