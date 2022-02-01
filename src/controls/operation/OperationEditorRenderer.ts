import {C} from "../ControlHelper";
import OperationEditor from "./OperationEditor";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text"
import {TokenTypes} from "../../runtime/interpreter/TokenTypes";
import {Parser, Token} from "../../runtime/interpreter/Parser";
import GrowingInput from "../general/GrowingInput";
import DropInfo from "sap/ui/core/dnd/DropInfo";
import {DragSession} from "sap/ui/core/dnd/DragAndDrop";


function handleInputDrop(input: GrowingInput, dragSession: DragSession) {
    const obj = dragSession.getData("objectId");
    const propertyName = dragSession.getData("propertyName");

    input.setValueAndFireChange(`${obj}@${propertyName}`);
}
const renderer = {

    makeInput(value, control, index, subIndex) {
        const dnd = new DropInfo({
            drop: function (event) {
                handleInputDrop(this.getParent(), event.getParameter("dragSession"));
            }
        });

        const inp = new GrowingInput({
            value: value,
            change: control.inputChangeHandler.bind(control, index, subIndex),
            dragDropConfig: dnd
        })

        return inp;
    },


    createInputsForSegment(s, control: OperationEditor): Array<Control> {
        const controls = [];

        switch (s.token.type) {

            case TokenTypes.POINT:
                controls.push(new Text({text: "("}))
                controls.push(this.makeInput(s.token.value[0].value, control, s.index, 0))
                controls.push(new Text({text: ","}))
                controls.push(this.makeInput(s.token.value[1].value, control, s.index, 1))
                controls.push(new Text({text: ")"}))
                break;

            case TokenTypes.EXPRESSION:
                const exp = Parser.constructCodeLine([s.token]);
                controls.push(this.makeInput(exp, control, s.index, -1))
                break;

            case TokenTypes.REGISTERAT:
                controls.push(this.makeInput(s.token.value[0].value, control, s.index, 0))
                controls.push(new Text({text: "s"}))
                controls.push(this.makeInput(s.token.value[1].value, control, s.index, 1))
                break;

            default:
                controls.push(this.makeInput(s.token.value, control, s.index, -1))
        }

        return controls;
    },


    render(rm, control: OperationEditor) {
        const root = C("div", control);
        const segments: Array<any> = control.createSegments();

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
                    root.appendControl(new Text({text: s.value as string}))
            }
        }

        root.render(rm)
    }
}

export default renderer;