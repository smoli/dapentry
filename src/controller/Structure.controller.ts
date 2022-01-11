import BaseController from "./BaseController";
import Control from "sap/ui/core/Control";
import Text from "sap/m/Text";
import {Parser, Token, TokenTypes} from "../runtime/interpreter/Parser";
import HBox from "sap/m/HBox";
import Input from "sap/m/Input";
import {FlexAlignItems, FlexJustifyContent, InputType} from "sap/m/library";
import DisplayListItem from "sap/m/DisplayListItem";
import CustomListItem from "sap/m/CustomListItem";
import ListBase from "sap/m/ListBase";


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


    onCodeChanged(event) {
        const code = event.getParameter("value");
        this.getComponentController().replaceCode(code.split("\n").filter(a => a.length !== 0)).then();
    }

    onCodelineSelectionChange(event) {
        const item = event.getParameter("listItem");
/*
        const source = event.getSource() as ListBase;

        const selection = source.getSelectedItems();

        this.getComponentController().setSelectedCodeLines(selection.map(s => s.getBindingContext("appModel").getProperty("index")));
*/


        const selected: boolean = event.getParameter("selected");

        if (!selected) {
            this.getComponentController().setSelectedCodeLine()
        } else {
            this.getComponentController().setSelectedCodeLine(item.getBindingContext("appModel").getProperty("index"));
        }
    }

    getTextIdForTokens(tokens: Array<Token>): string {
        const firstToken = tokens[0];

        switch (firstToken.value) {

            case 'RECT':
                return "opRectangle";

            case 'CIRCLE':
                return "opCircleCR";

            case 'LINE':
                return "opLine";

            case 'FILL':
                return "opFill";

            case 'STROKE':
                return "opStroke";

            case "ROTATE":
                return "opRotate";

            case "POLY":
                return "opPolygon";

            case "QUAD":
                return "opQuadratic";

            case "APP":
                return "opAppend"

            case 'MOVE':
                if (tokens.length === 3) {
                    return "opMoveByCenter"
                } else if (tokens.length === 4) {
                    return "opMoveBy"
                } else {
                    return "opMoveTo"
                }

            default:
                return firstToken.value as string;
        }
    }

    codeDescriptionFactory(id, context): Control {
        const tokens: Array<Token> = context.getObject("tokens");
        const firstToken = tokens[0];

        if (!firstToken) {
            console.log("NO FIRST TOKEN", tokens || null)
            return new Text(id, {text: "NO FIRST TOKEN!"});
        }

        const tokenTexts = tokens.map((t: Token) => {
            switch (t.type) {
                case TokenTypes.NUMBER:
                    return (t.value as number).toFixed(2);

                case TokenTypes.POINT:
                    return `(${t.value[0].value}, ${t.value[1].value})`;

                default:
                    return t.value;
            }
        });

        const t = this.getResourceText(this.getTextIdForTokens(tokens), ...tokenTexts);

        // @ts-ignore
        return new CustomListItem(id, { selected: "{appModel>selected}",
            type: "Active",
            content: [new Text({text: t})]
        });

    }


    codeSegmentFactory(id, context): Control {
        const tokens: Token = context.getObject("tokens");
        const firstToken = tokens[0];

        if (!firstToken) {
            console.log("NO FIRST TOKEN", tokens || null)
            return new Text({text: "NO FIRST TOKEN!"});
        }

        const config = StatementConfig[firstToken.value] || [Do.text];

        return new HBox({
            alignItems: FlexAlignItems.Center,
            items: config.map((c: Do, i) => {
                const token = tokens[i];

                let control: Control;
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

    createText(token): Control {
        return new Text({text: token.value, wrapping: false})
    }

    createInput(token: Token, context, indexPath): Control {

        let inp: Control;
        switch (token.type) {
            case TokenTypes.REGISTER:
                inp = new Input({value: token.value as string, width: "auto"})
                break;

            case TokenTypes.NUMBER:
                inp = new Input({value: token.value as string, type: InputType.Number, width: "auto"});
                break;

            case TokenTypes.STRING:
                inp = new Input({value: token.value as string, width: "auto"});
                break;

            case TokenTypes.POINT:
                inp = new HBox({
                    displayInline: true,
                    alignItems: FlexAlignItems.Center,
                    items: [
                        new Text({text: "("}),
                        this.createInput(token.value[0], context, [...indexPath, 0]),
                        new Text({text: ","}),
                        this.createInput(token.value[1], context, [...indexPath, 1]),
                        new Text({text: ")"})
                    ]
                })
                break;

            default:
                return this.createText(token);
        }

        if (inp instanceof Input) {
            inp.attachChange(event => {
                const statement = context.getObject();

                let t = {value: statement.tokens};
                for (const i of indexPath) t = t.value[i]
                t.value = event.getParameter("value");

                const newCode = Parser.constructCodeLine(statement.tokens);
                this.getComponentController().updateOperation(
                    statement.index,
                    indexPath[0],
                    indexPath.length === 2 ? indexPath[1] : -1,
                    newCode
                ).then();
            });
        }

        inp.addStyleClass("sapUiNoMargin");
        inp.addStyleClass("sapUiMediumMarginBegin");
        inp.addStyleClass("stsTransparentInput")
        return inp;
    }
}
