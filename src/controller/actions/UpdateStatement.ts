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


    replace(codeManager:CodeManager, reg: string, argumentToReplace: number, dataName: string):Array<string> {
        let index: number = codeManager.getCreationStatement(reg);
        const original = codeManager.code[index];
        const tokens = Parser.parseLine(original);

        const tempRegName = codeManager.makeUniqueRegisterName(reg + "Lpd");
        const iteratorName = codeManager.makeUniqueRegisterName(dataName + "iter");

        for (const t of tokens) {
            if (t.type === TokenTypes.REGISTER && t.value === reg) {
                t.value = tempRegName;
            }
        }

        const newStatements = [];

        tokens[argumentToReplace].value = iteratorName + ".value";
        const newCodeLine = Parser.constructCodeLine(tokens);

        newStatements.push(`ITER ${iteratorName} ${dataName}`);
        newStatements.push(`OBLIST ${reg}`);

        const labelName = codeManager.makeUniqueLabelName("LOOP" + dataName.toUpperCase());
        newStatements.push(`${labelName}:`);
        newStatements.push(newCodeLine);
        newStatements.push(`APP ${reg}.objects ${tempRegName}`);
        newStatements.push(`NEXT ${iteratorName}`);
        newStatements.push(`JINE ${iteratorName} ${labelName}`);

        console.log(codeManager.code.join("\n"));

        return newStatements;
    }

    perform() {
        const statement = this.component.getCodeManager().code[this._statementIndex];
        const tokens = Parser.parseLine(statement);
        let token = tokens[this._tokenIndex];

        if (this._tokenSubIndex != -1) {
            token = token.value[this._tokenSubIndex];
        }

        let newStatements:string[] = [];

        if (this._newValue.match(/^"[^"]*"$/)) { // String literal
            token.value = this._newValue;
            token.type = TokenTypes.STRING;
            newStatements.push(Parser.constructCodeLine(tokens));
        } else if (!isNaN(Number(this._newValue))) {  // Number literal
            token.value = Number(this._newValue);
            token.type = TokenTypes.NUMBER;
            newStatements.push(Parser.constructCodeLine(tokens));
        } else { // Maybe a register name from data
            const dataValue = this.component.getAppModel().get("data", d => d.name === this._newValue)[0];
            token.type = TokenTypes.REGISTER;

            if (dataValue && Array.isArray(dataValue.value)) {
                // Replace code to make the statement a loop over the data
                const reg = this.component.getCodeManager().getCreatedRegisterForStatement(this._statementIndex);
                newStatements = this.replace(this.component.getCodeManager(),
                    reg, this._tokenIndex, this._newValue);

            } else {
                token.value = this._newValue;
                newStatements.push(Parser.constructCodeLine(tokens));
            }
        }

        if (newStatements.length) {
            this.component.getCodeManager().removeStatement(this._statementIndex);
            newStatements.forEach((statement, i) => {
                this.component.getCodeManager().insertStatement(statement, this._statementIndex + i);
            })
            this.appModel.remove(this._statementIndex).from("segmentedCode");
            this.appModel
                .insert(...newStatements.map((s, i) => {
                    return {
                        index: this._statementIndex + i,
                        tokens: Parser.parseLine(s)
                    }
                }))
                .into("segmentedCode")
                .at(this._statementIndex)
        }


    }

}