import {BaseAction} from "./BaseAction";
import {Parser, TokenTypes} from "../runtime/interpreter/Parser";
import {CodeManager} from "../runtime/CodeManager";
import {AppConfig} from "../core/AppConfig";

export class UpdateStatement extends BaseAction {
    private readonly _newValue: string;
    private readonly _statementIndex: number;
    private readonly _tokenIndexes: Array<number>;

    constructor(statementIndex: number, tokenIndexes: Array<number>, newValue: string) {
        super();
        this._newValue = newValue.trim();
        this._statementIndex = statementIndex;
        this._tokenIndexes = tokenIndexes;
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

    protected checkIsArray(value: any): boolean {
        return ( typeof value.forEach === "function" );
    }

    _execute() {
        const statement = this.codeManager.code[this._statementIndex];
        const tokens = Parser.parseLine(statement);
        let token: any = { value: tokens };

        for (let i of this._tokenIndexes) {
            token = token.value[i];
        }

        let newStatements: string[] = [];

        if (this._newValue.match(/^"[^"]*"$/)) { // String literal
            token.value = this._newValue.replace(/"/g, "");
            token.type = TokenTypes.STRING;
            newStatements.push(Parser.constructCodeLine(tokens));

        } else if (!isNaN(Number(this._newValue))) {  // Number literal
            token.value = Number(this._newValue);
            token.type = TokenTypes.NUMBER;
            newStatements.push(Parser.constructCodeLine(tokens));

        } else { // Maybe a register name from data
            const field = this.state.getDataField(this._newValue);
            if (!field) {
                // TODO:  This is an expression or a register. Check it?

                if (this.codeManager.getCreatedRegisterForStatement(this._statementIndex) === token.value) {
                    // We're renaming a created register
                    this.state.renameRegister(token.value, this._newValue);
                } else {
                    token.type = TokenTypes.OTHER;      // the value will be reparsed
                    token.value = this._newValue;
                    newStatements.push(Parser.constructCodeLine(tokens));
                }
            } else {
                const dataValue = field.value;
                if (this.checkIsArray(dataValue)
                    && tokens[0].type === TokenTypes.OPCODE
                    && tokens[0].value === AppConfig.Runtime.Opcodes.Do) {

                    const endIndex = this.codeManager.findMatchingEndDo(this._statementIndex);

                    if (endIndex !== -1) {
                        this.state.replaceStatement(this._statementIndex, `${AppConfig.Runtime.Opcodes.ForEach} ${this._newValue}`);
                        this.state.replaceStatement(endIndex, AppConfig.Runtime.Opcodes.EndEach);
                    }

                } else {
                    token.type = TokenTypes.REGISTER;
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