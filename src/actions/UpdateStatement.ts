import {BaseAction} from "./BaseAction";
import {Parser, TokenTypes} from "../runtime/interpreter/Parser";
import {CodeManager} from "../runtime/CodeManager";
import {NOT_IMPLEMENTED, UNREACHABLE} from "../core/Assertions";

export class UpdateStatement extends BaseAction {
    private readonly _newValue: string;
    private readonly _statementIndex: number;
    private readonly _tokenIndex: number;
    private readonly _tokenSubIndex: number;

    constructor(statementIndex: number, tokenIndex: number, tokenSubIndex: number, newValue: string) {
        super();
        this._newValue = newValue;
        this._statementIndex = statementIndex;
        this._tokenIndex = tokenIndex;
        this._tokenSubIndex = tokenSubIndex;
    }

    get codeManager(): CodeManager {
        return this.state.store.state.code.codeManager;
    }


    forEach(reg: string, argumentToReplace: number, dataName: string): Array<string> {
        let index: number = this.codeManager.getCreationStatement(reg);
        const original = this.codeManager.code[index];
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
        const statement = this.codeManager.code[this._statementIndex];
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
            const field = this.state.getDataField(this._newValue);
            if (!field) {
                // TODO:  This is most likely an expression. Check it?
                token.type = TokenTypes.OTHER;      // the value will be reparsed
                token.value = this._newValue;
                newStatements.push(Parser.constructCodeLine(tokens));
            } else {
                const dataValue = field.value;
                token.type = TokenTypes.REGISTER;
                if (Array.isArray(dataValue)) {
                    NOT_IMPLEMENTED("Entering array fields")
                    /*
                                    // Replace code to make the statement a loop over the data
                                    const reg = this.component.getCodeManager().getCreatedRegisterForStatement(this._statementIndex);
                                    newStatements = this.forEach(this.component.getCodeManager(),
                                        reg, this._tokenIndex, this._newValue);
                    */

                } else {
                    token.value = this._newValue;
                    newStatements.push(Parser.constructCodeLine(tokens));
                }
            }
        }

        if (newStatements.length) {
            this.state.replaceStatement(this._statementIndex, ...newStatements);
        }


    }

}