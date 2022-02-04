import Control from "sap/ui/core/Control";
import {Parser, Token, TokenTypes} from "../../../src/runtime/interpreter/Parser";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import {getTextIdForTokens} from "../../i18n/getTextIDForTokens";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.steps
 */
export default class Step extends Control {

    static readonly metadata = {
        properties: {
            tokens: { type: "any[]" },
            codeIndex: { type: "int"},
            level: { type: "int", defaultValue: 0 },

            selected: { type: "boolean", bindable: "bindable" }
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

                case TokenTypes.REGISTERAT:
                    if (t.value[1].type === TokenTypes.NUMBER) {
                        return `${t.value[0].value} at ${t.value[1].value}`;
                    } else {
                        return `${t.value[0].value}'s ${t.value[1].value}`;
                    }

                case TokenTypes.EXPRESSION:
                    return Parser.constructCodeLine([t]);

                default:
                    return t.value;
            }
        });

        if (firstToken.type === TokenTypes.ANNOTATION) {
            if (firstToken.args) {
                tokenTexts.push(...firstToken.args);
            }
        }

        return this.getResourceText(getTextIdForTokens(tokens), ...tokenTexts);
    }

}