import {Parser, Token, TokenTypes} from "./interpreter/Parser";
import {StateMachine} from "./tools/StateMachine";
import {Stack} from "./tools/Stack";


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
    private _registers: string[];
    private _labels: string[];
    private readonly _creationOpcodes: CreationInfo;
    private _state: StateMachine;
    private readonly _jumpOpcodes: Array<string>;


    constructor(creationOpcodes: CreationInfo =
                    {"LOAD": 1},
                jumpOpCodes: Array<string> = [
                    "JMP", "JNZ", "JNE", "JNZ", "JEQ", "JNE", "JLT", "JLE", "JGT", "JGE", "JINE"]
    ) {
        this._code = [];
        this._registers = [];
        this._labels = [];
        this._creationOpcodes = creationOpcodes;
        this._jumpOpcodes = jumpOpCodes;
        this._state = new StateMachine();
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
        this.memorizeRegistersAndLabels(statement);
    }

    /**
     * Insert a statement at the given position.
     *
     * @param statement
     * @param index
     */
    insertStatement(statement: string, index: number) {
        this._code.splice(index, 0, statement);
        this.memorizeRegistersAndLabels(statement);
    }

    /**
     * Insert a statement after the given index.
     * @param statement
     * @param afterIndex
     */
    insertStatementAfter(statement: string, afterIndex: number) {
        this._code.splice(afterIndex + 1, 0, statement);
        this.memorizeRegistersAndLabels(statement);
    }

    /**
     * Remove a statement from the given position.
     * @param index
     */
    removeStatement(index: number) {
        this._code.splice(index, 1);
        this.refreshRegisterAndLabelMemory();

    }

    /**
     * Replace the statement at the given index with the new one.
     * This performs no range check.
     * @param index
     * @param newStatement
     */
    updateStatement(index: number, newStatement: string) {
        this._code[index] = newStatement;
        this.refreshRegisterAndLabelMemory();
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
     * Apply annotations to code
     *
     * TODO: This is a hacky implementation that breaks if you don't
     *       apply annotations the way they are expected
     */
    get annotatedCode(): Array<{ originalLine: number, code: string, level: number }> {

        const ret = [];
        const blockStack = new Stack<{ code: string, replaces: Array<Token> }>();
        let level = 0;

        const find = (tokens, value) => tokens.find(t => t.type === TokenTypes.ANNOTATION && t.value as string === value)
        const findAll = (tokens, value) => tokens.filter(t => t.type === TokenTypes.ANNOTATION && t.value as string === value)

        let originalLine = -1;
        for (const codeLine of this._code) {
            originalLine++;
            const tokens = Parser.parseLine(codeLine);

            if (!!find(tokens, "HIDE")) {
                continue;
            }


            const body = find(tokens, "BODY");
            if (body) {
                blockStack.push({code: "BODY", replaces: findAll(tokens, "REPLACE")});
                continue;
            }


            const endeach = find(tokens, "ENDEACH");
            if (endeach) {
                blockStack.pop();
                level--;
                //ret.push({originalLine, code: "@ENDEACH", level});
                continue;
            }

            if (blockStack.length && blockStack.top.code === "EACH") {
                continue;
            }

            const each = find(tokens, "EACH");
            if (each) {
                ret.push({originalLine, code: "@EACH " + each.args.join(" "), level});
                level++;
                blockStack.push({code: "EACH", replaces: findAll(tokens, "REPLACE")});
                continue;
            }


            const endbody = find(tokens, "ENDBODY");
            if (endbody) {
                blockStack.pop();
                continue;
            }

            // Here we have an actual code statement


            let newLine = Parser.constructCodeLine(tokens.filter(t => t.type !== TokenTypes.ANNOTATION));

            for (const t of tokens) {
                if (t.type === TokenTypes.ANNOTATION) {
                    if (t.value === "REPLACE") {
                        newLine = newLine.replace(t.args[0], t.args[1])
                    }
                }
            }

            if (blockStack.length) {
                let l = blockStack.length;

                while (l--) {
                    for (const t of blockStack[l].replaces) {
                        newLine = newLine.replace(t.args[0], t.args[1])
                    }
                }
            }


            ret.push({originalLine, code: newLine, level});
        }

        return ret;
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

    isStatementInLoop(index: number): boolean {

        // Get all labels above
        const labels = [];
        for (let i = index - 1; i >= 0; i--) {
            const t = this.getTokensForStatement(i);
            if (t && t[0].type === TokenTypes.LABEL) {
                labels.push(t[0].value);
            }
        }

        if (labels.length === 0) {
            return false;
        }

        // Find a jump to one of the labels
        for (let i = index + 1; i < this._code.length; i++) {
            const t = this.getTokensForStatement(i);
            const op = this.getOpCode(t);

            if (this._jumpOpcodes.indexOf(op) !== -1) {
                const lt = t.find(t => t.type === TokenTypes.LABEL);
                if (lt) {
                    if (labels.indexOf(lt.value) !== -1) {
                        return true;
                    }
                }
            }
        }

        return false;
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

    protected makeUniqueName(memory: string[], preference: string): string {
        if (memory.indexOf(preference) === -1) {
            return preference;
        }

        let suff = 0;
        while (memory.indexOf(preference + suff) !== -1) {
            suff++;
        }

        return preference + suff;
    }

    public makeUniqueRegisterName(preference): string {
        return this.makeUniqueName(this._registers, preference);
    }

    public registerExists(registerName): boolean {
        return this._registers.indexOf(registerName) !== -1;
    }

    public makeUniqueLabelName(preference): string {
        return this.makeUniqueName(this._labels, preference);
    }

    public labelExists(registerName): boolean {
        return this._labels.indexOf(registerName) !== -1;
    }


    protected refreshRegisterAndLabelMemory() {
        this._registers = [];
        this._labels = [];
        this._code.forEach(c => this.memorizeRegistersAndLabels(c));
    }

    protected memorizeRegistersAndLabels(statement) {
        const tokens: Array<Token> = Parser.parseLine(statement);

        const walk = (tokens: Array<Token>) => {
            for (const token of tokens) {
                switch (token.type) {
                    case TokenTypes.REGISTER:
                        this._registers.push(token.value as string);
                        break;
                    case TokenTypes.LABEL:
                        this._labels.push(token.value as string);
                        break;
                    case TokenTypes.POINT:
                        walk(token.value as Array<Token>);
                        break;
                    case TokenTypes.ARRAY:
                        walk(token.value as Array<Token>);
                        break;

                }
            }
        }

        walk(tokens);
    }
}
