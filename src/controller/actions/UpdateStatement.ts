import Component from "../../Component";
import {Parser, TokenTypes} from "../../runtime/interpreter/Parser";
import {BaseAction} from "./BaseAction";
import {CodeManager} from "../../runtime/CodeManager";
import {data} from "jquery";

export class UpdateStatement extends BaseAction {
    private readonly _newValue: string;
    private readonly _statementIndex: number;
    private readonly _tokenIndex: number;
    private readonly _tokenSubIndex: number;

    constructor(component: Component, _statementIndex: number, tokenIndex: number, tokenSubIndex: number, newValue: string) {
        super(component);
        this._newValue = newValue;
        this._statementIndex = _statementIndex;
        this._tokenIndex = tokenIndex;
        this._tokenSubIndex = tokenSubIndex;
    }


    forEach(codeManager: CodeManager, reg: string, argumentToReplace: number, dataName: string): Array<string> {
        let index: number = codeManager.getCreationStatement(reg);
        const original = codeManager.code[index];
        const tokens = Parser.parseLine(original);

        const newStatements = [];

        newStatements.push(`FOREACH ${dataName}`);

        tokens[argumentToReplace].value = dataName;
        const newCreationStatement = Parser.constructCodeLine(tokens);
        newStatements.push(newCreationStatement);

        newStatements.push("ENDEACH @HIDE");

        return newStatements;
    }

    _execute() {
        const statement = this.component.getCodeManager().code[this._statementIndex];
        const tokens = Parser.parseLine(statement);
        let token = tokens[this._tokenIndex];

        if (this._tokenSubIndex != -1) {
            token = token.value[this._tokenSubIndex];
        }

        let newStatements: string[] = [];

        if (this._newValue.match(/^"[^"]*"$/)) { // String literal
            token.value = this._newValue;
            token.type = TokenTypes.STRING;
            newStatements.push(Parser.constructCodeLine(tokens));
        } else if (!isNaN(Number(this._newValue))) {  // Number literal
            token.value = Number(this._newValue);
            token.type = TokenTypes.NUMBER;
            newStatements.push(Parser.constructCodeLine(tokens));
        } else { // Maybe a register name from data
            const dataValue = this.component.getAppState().getDataField(this._newValue);
            token.type = TokenTypes.REGISTER;

            if (dataValue && Array.isArray(dataValue.value)) {
                // Replace code to make the statement a loop over the data
                const reg = this.component.getCodeManager().getCreatedRegisterForStatement(this._statementIndex);
                newStatements = this.forEach(this.component.getCodeManager(),
                    reg, this._tokenIndex, this._newValue);

            } else {
                token.value = this._newValue;
                newStatements.push(Parser.constructCodeLine(tokens));
            }
        }

        if (newStatements.length) {
            this.appState.replaceStatement(this._statementIndex, newStatements);
        }


    }

}