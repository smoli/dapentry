import {Parser, Token, TokenTypes} from "./interpreter/Parser";


export type TokenList = Array<Token>;

/**
 * Defines the opcodes that initialize a register.
 * The key is the opcode. The number is the argument position,
 * the register has to be.
 */
export type CreationInfo = { [key: string]: number }


/**
 * The Code Manager provides means to create and manipulate code and
 * get code introspection.
 *
 * Most methods are index based. All indexes are zero based.
 */
export class CodeManager {
    private _code: string[];
    private _creationOpcodes: CreationInfo;


    constructor(creationOpcodes: CreationInfo = {"LOAD": 1}) {
        this._code = [];
        this._creationOpcodes = creationOpcodes;
    }

    /**
     * Removes all statements
     */
    clear() {
        this._code = [];
    }

    /**
     * Adds a string of statements. Statement are expected to
     * be separated by newline `\n`.
     *
     * @param code
     */
    addCodeString(code: string) {
        const lines = code.split("\n")
            .map(t => t.trim())
            .filter(l => !!l);
        lines.forEach(l => this.addStatement(l));
    }

    /**
     * Adds a statement at the end of the program.
     * @param statement
     */
    addStatement(statement: string) {
        this._code.push(statement);
    }

    /**
     * Insert a statement at the given position.
     *
     * @param statement
     * @param index
     */
    insertStatement(statement: string, index: number) {
        this._code.splice(index, 0, statement);
    }

    /**
     * Remove a statement from the given position.
     * @param index
     */
    removeStatement(index: number) {
        this._code.splice(index, 1);
    }

    /**
     * Removes all statements that have the register as an argument.
     *
     * If `deep` is `true` then statements for registers whose creation was removed
     * during the process will be removed as well.
     *
     * If you have this code
     * ```
     *      LOAD r1 100
     *      LOAD r2 r1
     *      ADD  r2 100
     * ```
     *
     * then removing statement for r1 would remove all statements, when `deep` is true.
     * If `deep` is false, then the last line would stay.
     *
     * @param registerName
     * @param deep
     */
    removeStatementsForRegister(registerName: string, deep: boolean = true) {
        const lines = this.getStatementIndexesWithParticipation(registerName);
        const removedRegisters = [];

        let i = lines.length;
        while (i--) {
            const index = lines[i];
            if (deep) {
                const cReg = this.getCreatedRegisterForStatement(index);
                if (cReg && cReg !== registerName) {
                    if (this.getCreationStatement(cReg) === index) {
                        removedRegisters.push(cReg);
                    }
                }
            }
            this.removeStatement(index);
        }

        if (deep) {
            removedRegisters.forEach(r => this.removeStatementsForRegister(r));
        }
    }

    /**
     * Gets the initialized register for the statement. If no
     * register is initialized by this statement `null` will be
     * returned.
     *
     * @param index
     */
    getCreatedRegisterForStatement(index: number): string {
        const t = this.getTokensForStatement(index);
        const opCode = this.getOpCode(t);
        if (this._creationOpcodes[opCode]) {
            return t[this._creationOpcodes[opCode]].value as string;
        }

        return null;
    }

    /**
     * Returns the code as an array of strings.
     */
    get code(): Array<string> {
        return this._code.map(c => c);
    }

    /**
     * Gets the tokens for the statement at the given position.
     * @param index
     */
    getTokensForStatement(index: number): TokenList {
        return Parser.parseLine(this._code[index]);
    }

    /**
     * Gets the opcode for the statement at the given position.
     * @param tokens
     */
    getOpCode(tokens: TokenList): string {
        return tokens[0].value as string;
    }


    /**
     * Gets the operation that initialises the register value first,
     * e.g. the first LOAD.
     * @param registerName
     * @return The index of the statement
     */
    getCreationStatement(registerName: string): number {
        for (let i = 0; i < this._code.length; i++) {
            const t = this.getTokensForStatement(i);
            const opcode = this.getOpCode(t);
            if (this._creationOpcodes[opcode]) {
                const token = t[this._creationOpcodes[opcode]];

                if (token.type === TokenTypes.REGISTER && token.value === registerName) {
                    return i;
                }
            }
        }

        return -1;
    }

    /**
     * Get the indexes of all statements that have the given register as an
     * argument.
     *
     * @param registerName
     */
    getStatementIndexesWithParticipation(registerName: string): Array<number> {
        const ret = [];
        for (let i = 0; i < this._code.length; i++) {
            const tokens = this.getTokensForStatement(i);
            for (const token of tokens) {
                if (token.type === TokenTypes.REGISTER && token.value === registerName) {
                    ret.push(i);
                    break;
                }
            }
        }

        return ret;
    }
}