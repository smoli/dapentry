import Control from "sap/ui/core/Control";
import {Token, TokenTypes} from "../../runtime/interpreter/Parser";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.steps
 */
export default class Step extends Control {

    static readonly metadata = {
        properties: {
            tokens: { type: "Array" },
            codeIndex: { type: "int"},
            level: { type: "int", defaultValue: 0 },

            selected: { type: "boolean" }
        },

        events: {
            press: {
            }
        }
    }

    // The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $StepSettings);
    constructor(id?: string, settings?: $StepSettings);
    constructor(id?: string, settings?: $StepSettings) { super(id, settings); }

    getResourceText(textId:string, ...parameters:Array<any>):string {
        const bundle:ResourceBundle = (this.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        return bundle.getText(textId, parameters);
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


    public constructText(): string {
        const tokens: Array<Token> = this.getTokens();
        const firstToken = tokens[0];

        if (!firstToken) {
            console.log("NO FIRST TOKEN", tokens || null)
            return "NO FIRST TOKEN!";
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

        if (firstToken.type === TokenTypes.ANNOTATION) {
            if (firstToken.args) {
                tokenTexts.push(...firstToken.args);
            }
        }

        return this.getResourceText(this.getTextIdForTokens(tokens), ...tokenTexts);
    }


}