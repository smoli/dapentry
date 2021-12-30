import BaseController from "./BaseController";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text";
import {Token, TokenTypes} from "../runtime/interpreter/Parser";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import {FlexAlignItems, InputType} from "sap/m/library";


enum Do {
    hidden,
    text,
    edit
}

const StatementConfig = {
    "CIRCLE": [Do.text, Do.hidden, Do.text, Do.hidden, Do.hidden, Do.edit, Do.edit],
    "RECT": [Do.text, Do.hidden, Do.text, Do.hidden, Do.hidden, Do.edit, Do.edit, Do.edit],
    "LINE": [Do.text, Do.hidden, Do.text, Do.hidden, Do.hidden, Do.edit, Do.edit],
    "FILL": [Do.text, Do.text, Do.edit],
    "MOVE": [Do.text, Do.text, Do.text, Do.edit]
}


/**
 * @namespace sts.drawable.controller
 */
export default class StructureController extends BaseController {

    codeSegmentFactory(id, context): Control {
        const tokens: Token = context.getObject("tokens");
        const firstToken = tokens[0];

        if (!firstToken) {
            console.log("NO FIRST TOKEN", tokens || null)
            return new Text({ text: "NO FIRST TOKEN!"});
        }

        const config = StatementConfig[firstToken.value] || [Do.text];

        return new HBox({
            alignItems: FlexAlignItems.Center,
            items: config.map((c: Do, i) => {
                const token = tokens[i];

                let control:Control;
                switch (c) {
                    case Do.hidden:
                        return null;

                    case Do.text:
                        control = this.createText(token);
                        break;

                    case Do.edit:
                        control = this.createInput(token, context, [i])
                        break;

                    default:
                        return null;
                }

                control.addStyleClass("sapUiNoMargin");
                control.addStyleClass("sapUiMediumMarginBegin");
                control.addStyleClass("stsCodeSegmentText");
                return control;
            }).filter(c => !!c)
        })
    }

    createText(token):Control {
        return new Text({text: token.value, wrapping: false })
    }

    createInput(token:Token, context, indexPath):Control {

        let inp:Control;
        switch(token.type) {
            case TokenTypes.REGISTER:
                inp = new Input({ value: token.value as string, width: "auto" })
                break;

            case TokenTypes.NUMBER:
                inp = new Input({ value: token.value as string, type: InputType.Number, width: "auto" });
                break;

            case TokenTypes.STRING:
                inp = new Input({ value: token.value as string, width: "auto"});
                break;

            case TokenTypes.POINT:
                inp = new HBox({
                    displayInline: true,
                    alignItems: FlexAlignItems.Center,
                    items: [
                        new Text({ text: "("}),
                        this.createInput(token.value[0], context, [...indexPath, 0]),
                        new Text({ text: ","}),
                        this.createInput(token.value[1], context, [...indexPath, 1]),
                        new Text({ text: ")"})
                    ]})
                break;

            default:
                return this.createText(token);
        }

        if (inp instanceof Input) {
            inp.attachChange(event => {
                const statement = context.getObject();

                let t = { value: statement.tokens };
                for (const i of indexPath) t = t.value[i]
                t.value = event.getParameter("value");

                const construct = (code, tokens):Array<string> => {

                    for (const t of tokens) {
                        if (t.type === TokenTypes.POINT) {
                            code.push("(");
                            code.push(t.value[0].value);
                            code.push(t.value[1].value);
                            code.push(")");
                        } else if (t.type === TokenTypes.STRING) {
                            code.push(`"${t.value}"`);
                        } else {
                            code.push(t.value);
                        }
                    }

                    return code;
                }

                const newCode = construct([], statement.tokens).join(" ");
                this.getComponentController().updateOperation(statement.index, newCode).then();
            });
        }

        inp.addStyleClass("sapUiNoMargin");
        inp.addStyleClass("sapUiMediumMarginBegin");
        inp.addStyleClass("stsTransparentInput")
        return inp;
    }
}