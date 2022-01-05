import Component from "../../Component";
import {Parser, TokenTypes} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {CodeManager} from "../../runtime/CodeManager";

export class UpdateStatement extends BaseAction {
    private readonly _newValue: string;
    private readonly _statementIndex: number;
    private readonly _tokenIndex: number;
    private readonly _tokenSubIndex: number;

    constructor(component: Component, _statementIndex: number, tokenIndex:number, tokenSubIndex:number, newValue: string) {
        super(component);
        this._newValue = newValue;
        this._statementIndex = _statementIndex;
        this._tokenIndex = tokenIndex;
        this._tokenSubIndex = tokenSubIndex;
    }


    replace(codeManager:CodeManager, reg: string, argumentToReplace: number, dataName: string) {
        let index: number = codeManager.getCreationStatement(reg);
        const original = codeManager.code[index];
        const tokens = Parser.parseLine(original);

        const tempRegName = codeManager.makeUniqueRegisterName(reg + "Tmp");
        const iteratorName = codeManager.makeUniqueRegisterName(dataName + "iter");

        for (const t of tokens) {
            if (t.type === TokenTypes.REGISTER && t.value === reg) {
                t.value = tempRegName;
            }
        }

        tokens[argumentToReplace].value = iteratorName + ".value";
        const newCodeLine = Parser.constructCodeLine(tokens);

        codeManager.removeStatement(index);

        codeManager.insertStatement(`ITER ${iteratorName} ${dataName}`, index++);
        codeManager.insertStatement(`LOAD ${reg} [ ]`, index++);

        const labelName = codeManager.makeUniqueLabelName("LOOP" + dataName.toUpperCase());
        codeManager.insertStatement(`${labelName}:`, index++);
        codeManager.insertStatement(newCodeLine, index++);
        codeManager.insertStatement(`APP ${reg} ${tempRegName}`, index++);
        codeManager.insertStatement(`NEXT ${iteratorName}`, index++);
        codeManager.insertStatement(`JINE ${iteratorName} ${labelName}`, index++);

        console.log(codeManager.code.join("\n"));
    }

    perform() {
        const statement = this.component.getCodeManager().code[this._statementIndex];
        const tokens = Parser.parseLine(statement);
        let token = tokens[this._tokenIndex];

        if (this._tokenSubIndex != -1) {
            token = token.value[this._tokenSubIndex];
        }

        if (this._newValue.match(/^"[^"]*"$/)) { // String literal
            token.value = this._newValue;
            token.type = TokenTypes.STRING;
        } else if (!isNaN(Number(this._newValue))) {  // Number literal
            token.value = Number(this._newValue);
            token.type = TokenTypes.NUMBER;
        } else { // Maybe a register name from data
            const dataValue = this.component.getAppModel().get("data", d => d.name === this._newValue)[0];
            token.type = TokenTypes.REGISTER;

            if (dataValue && Array.isArray(dataValue.value)) {
                // Replace code to make the statement a loop over the data
                const reg = this.component.getCodeManager().getCreatedRegisterForStatement(this._statementIndex);
                this.replace(this.component.getCodeManager(),
                    reg, this._tokenIndex, this._newValue);

                return;
            } else {
                token.value = this._newValue;
            }
        }


        const newStatement = Parser.constructCodeLine(tokens);
        this.component.getCodeManager().updateStatement(this._statementIndex, newStatement);

        this.appModel.set("segmentedCode", this._statementIndex).to({index: this._statementIndex, tokens});
    }

}