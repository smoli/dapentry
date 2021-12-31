import Control from "sap/ui/core/Control";
import {Token, TokenTypes} from "../../runtime/interpreter/Parser";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 *
 * See https://github.com/SAP-samples/ui5-typescript-helloworld/tree/custom-controls
 *
 * @namespace sts.drawable.controls.operation
 */
export default class OperationEditor extends Control {

    static readonly metadata = {

        properties: {
            "tokens": { type: "any", defaultValue: [] }
        },

        events: {
            change: {
                code: "string"
            }
        }
    }

// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
    constructor(idOrSettings?: string | $OperationEditorSettings);
    constructor(id?: string, settings?: $OperationEditorSettings);
    constructor(id?: string, settings?: $OperationEditorSettings) { super(id, settings); }


    init() {
        super.init();
    }

    getTextIdForTokens(tokens:Array<Token>):string {
        if (!tokens || !tokens.length) {
            return null;
        }
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

    getResourceText(textId:string):string {
        const bundle:ResourceBundle = (this.getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
        return bundle.getText(textId);
    }

    public createSegments():Array<any> {
        const tokens = this.getTokens();
        if (!tokens || !tokens.length) {
            return []
        }

        const t = this.getResourceText(this.getTextIdForTokens(tokens));

        const matches = t.match(/([\w\s]+|\{\d+\})/g);

        const segments = [];

        for (let i = 0; i < matches.length; i++) {
            const m = matches[i]
            if (m[0] == "{") {
                const index = Number(m.match(/(\d+)/)[0]);
                const token = tokens[index];
                segments.push({ type: "input", token, index });
            } else {
                segments.push({ type: "text", value: m});
            }
        }

        return segments;
    }

    inputChangeHandler(index:number, subindex: number = -1, event) {

        const tokens = this.getTokens();
        const newValue = event.getParameter("value");

        let token = tokens[index];

        if (subindex !== -1) {
            token = token.value[subindex];
        }

        token.value = newValue;

        const construct = (code, tokens): Array<string> => {

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

        const newCode = construct([], tokens);

        this.fireChange({
            code: newCode.join(" ")
        });

    }
}