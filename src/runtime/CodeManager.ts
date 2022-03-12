import {Parser, Token, TokenTypes} from "./interpreter/Parser";
import {StateMachine} from "./tools/StateMachine";
import {Stack} from "./tools/Stack";
import {ASSERT} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";



export type TokenList = Array<Token>;


export interface AnnotatedCodeLine {
    originalLine: number,
    code: string,
    level: number
}

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
                    { "LOAD": 1 },
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

    addStatements(statements: Array<string>) {
        this._code.push(...statements);
        statements.forEach(s => this.memorizeRegistersAndLabels(s));
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
     * Insert multiple statement at the given position.
     *
     * @param statements
     * @param index             Index at which the statement will be inserted
     */
    insertStatements(statements: Array<string>, index: number) {
        this._code.splice(index, 0, ...statements);
        statements.forEach(s => this.memorizeRegistersAndLabels(s));
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


    replaceStatement(index: number, ...newLines: Array<string>) {
        this._code.splice(index, 1, ...newLines);
    }

    /**
     * Remove a statement from the given position.
     * @param index
     */
    removeStatement(index: number) {
        const indexes = Array.from(this._determineIndexesToDelete(index));
        indexes.sort((a, b) => b - a);

        for (const i of indexes) {
            this._removeStatement(i);
        }
        this.refreshRegisterAndLabelMemory();
    }


    protected _determineIndexesToDelete(index: number): Set<number> {

        const indexes: Set<number> = new Set<number>();
        indexes.add(index);

        let upTo = index;
        let dir = 1;
        const opCode = this.getOpCodeForStatement(index);
        if (opCode === AppConfig.Runtime.Opcodes.Do) {
            upTo = this.findMatchingEndDo(index);
        } else if (opCode === AppConfig.Runtime.Opcodes.ForEach) {
            upTo = this.findMatchingEndEach(index);
        } else if (opCode === AppConfig.Runtime.Opcodes.EndDo) {
            upTo = this.findMatchingDo(index);
            dir = -1;
        } else if (opCode === AppConfig.Runtime.Opcodes.EndEach) {
            upTo = this.findMatchingForEach(index);
            dir = -1;
        }

        if (upTo !== index) {
            for (let i = index + dir; i !== upTo; i += dir) {
                indexes.add(i);
            }
            indexes.add(upTo);
        }

        // determine dependent indexes
        for (const i of indexes) {
            const r = this.getCreatedRegisterForStatement(i);
            if (r) {
                const depIndexes = this.getStatementIndexesWithParticipation(r, true);
                depIndexes.forEach(e => indexes.add(e));
            }
        }

        return indexes;
    }

    protected _removeStatement(index: number) {
        this._code.splice(index, 1);
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
        const lines = Array.from(this.getStatementIndexesWithParticipation(registerName));
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
            this._removeStatement(index);
        }

        if (deep) {
            removedRegisters.forEach(r => this.removeStatementsForRegister(r));
        }
        this.refreshRegisterAndLabelMemory();

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
            const r = t[this._creationOpcodes[opCode]].value;
            const s = this.getCreationStatement(r as string);

            if (s === index) {
                return r as string;
            }
        }

        return null;
    }

    findMatchingEndDo(index: number): number {
        return this.findMatchingStatements(
            index,
            AppConfig.Runtime.Opcodes.Do,
            AppConfig.Runtime.Opcodes.EndDo
        );
    }

    findMatchingDo(index: number): number {
        return this.findMatchingStatements(
            index,
            AppConfig.Runtime.Opcodes.EndDo,
            AppConfig.Runtime.Opcodes.Do,
            -1
        );
    }

    findMatchingStatements(index: number, openOpCode: string, endingOpCode: string, direction: number = 1) {
        const code = this._code[index];
        ASSERT(!!code, `Code does not exist at line ${index}`);

        const opCode = this.getOpCode(Parser.parseLine(code));
        ASSERT(opCode === openOpCode, `There is no ${openOpCode}-statement at ${index}`);

        let nestLevel = 0;
        for (let i = index + direction; i > 0 && i < this._code.length; i += direction) {
            const opCode = this.getOpCode(Parser.parseLine(this._code[i]));

            switch (opCode) {
                case openOpCode:
                    nestLevel++;
                    break;

                case endingOpCode:
                    if (nestLevel === 0) {
                        return i;
                    }
                    nestLevel--;
                    break;
            }
        }

        return -1;
    }


    findMatchingEndEach(index: number): number {
        return this.findMatchingStatements(
            index,
            AppConfig.Runtime.Opcodes.ForEach,
            AppConfig.Runtime.Opcodes.EndEach
        );
    }

    findMatchingForEach(index: number): number {
        return this.findMatchingStatements(
            index,
            AppConfig.Runtime.Opcodes.EndEach,
            AppConfig.Runtime.Opcodes.ForEach,
            -1
        );
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
    get annotatedCode(): Array<AnnotatedCodeLine> {

        const ret = [];
        const blockStack = new Stack<{ code: string, replaces: Array<Token> }>();
        let level = 0;

        const findOpCode = (tokens, value) => tokens.find(t => t.type === TokenTypes.OPCODE && t.value as string === value);
        const findAnnotation = (tokens, value) => tokens.find(t => t.type === TokenTypes.ANNOTATION && t.value as string === value);
        const findAllAnnotations = (tokens, value) => tokens.filter(t => t.type === TokenTypes.ANNOTATION && t.value as string === value);

        let originalLine = -1;
        for (const codeLine of this._code) {
            originalLine++;
            const tokens = Parser.parseLine(codeLine);

            if (!!findAnnotation(tokens, "HIDE")) {
                continue;
            }


            const body = findAnnotation(tokens, "BODY");
            if (body) {
                blockStack.push({ code: "BODY", replaces: findAllAnnotations(tokens, "REPLACE") });
                continue;
            }


            const endeach = findAnnotation(tokens, "ENDEACH");
            if (endeach) {
                blockStack.pop();
                level--;
                //ret.push({originalLine, code: "@ENDEACH", level});
                continue;
            }

            const doOpCode = findOpCode(tokens, AppConfig.Runtime.Opcodes.Do);
            if (doOpCode) {
                blockStack.push({
                    code: AppConfig.Runtime.Opcodes.Do,
                    replaces: findAllAnnotations(tokens, "REPLACE")
                });
            }

            const forEachOpCode = findOpCode(tokens, AppConfig.Runtime.Opcodes.ForEach);
            if (forEachOpCode) {
                blockStack.push({
                    code: AppConfig.Runtime.Opcodes.ForEach,
                    replaces: findAllAnnotations(tokens, "REPLACE")
                });
            }

            const endDo = findOpCode(tokens, AppConfig.Runtime.Opcodes.EndDo);
            if (endDo) {
                blockStack.pop();
                level--;
            }

            const endEach = findOpCode(tokens, AppConfig.Runtime.Opcodes.EndEach);
            if (endEach) {
                blockStack.pop();
                level--;
            }

            if (blockStack.length && blockStack.top.code === "EACH") {
                continue;
            }

            const each = findAnnotation(tokens, "EACH");
            if (each) {
                ret.push({ originalLine, code: "@EACH " + each.args.join(" "), level });
                level++;
                blockStack.push({ code: "EACH", replaces: findAllAnnotations(tokens, "REPLACE") });
                continue;
            }


            const endbody = findAnnotation(tokens, "ENDBODY");
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


            ret.push({ originalLine, code: newLine, level });

            if (doOpCode || forEachOpCode) {
                level++;
            }
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

    getOpCodeForStatement(index: number): string {
        return this.getOpCode(this.getTokensForStatement(index));
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
     * @param deep
     */
    getStatementIndexesWithParticipation(registerName: string, deep: boolean = false): Set<number> {
        const ret = [];
        const created = [];

        for (let i = 0; i < this._code.length; i++) {
            const tokens = this.getTokensForStatement(i);

            const tokenHasRegister = (token: Token) => {
                switch (token.type) {
                    case TokenTypes.REGISTER:
                        return token.value === registerName;

                    case TokenTypes.NONLOCALREGISTER:
                        return token.value === registerName;

                    case TokenTypes.REGISTERAT:
                        return token.value[0].value === registerName || tokenHasRegister(token.value[1])

                    case TokenTypes.POINT:
                        return tokenHasRegister(token.value[0]) || tokenHasRegister(token.value[1])

                    case TokenTypes.ARRAY:
                        for (const v of token.value as Array<Token>) {
                            if (tokenHasRegister(v)) {
                                return true;
                            }
                        }
                        return false;

                    case TokenTypes.EXPRESSION:
                        return tokenHasRegister(token.value[0]) || tokenHasRegister(token.value[2])

                    default:
                        return false;
                }
            }


            let found = false;
            for (const token of tokens) {
                if (tokenHasRegister(token)) {
                    ret.push(i);
                    found = true;

                }
            }

            if (found) {
                if (deep) {
                    const r = this.getCreatedRegisterForStatement(i);
                    if (r && !created.includes(r) && r !== registerName) {
                        created.push(r);
                    }
                }
            }
        }

        if (deep) {
            for (const r of created) {
                ret.push(...this.getStatementIndexesWithParticipation(r, deep));
            }
        }

        return new Set(ret);
    }

    protected makeUniqueName(memory: string[], preference: string): string {
        if (memory.indexOf(preference) === -1) {
            return preference;
        }

        let suffix = 0;
        while (memory.indexOf(preference + suffix) !== -1) {
            suffix++;
        }

        return preference + suffix;
    }

    public makeUniqueRegisterName(preference): string {
        return this.makeUniqueName(this._registers, preference);
    }

    public registerExists(registerName): boolean {
        return this._registers.indexOf(registerName) !== -1;
    }

    public renameRegister(oldName: string, newName: string): boolean {
        if (this.registerExists(newName)) {
            return false;
        }

        const renameInToken = (token: Token) => {
            if (token.type === TokenTypes.REGISTER && token.value === oldName) {
                token.value = newName;
                return;
            }

            if (token.type === TokenTypes.REGISTERAT && token.value[0].value === oldName) {
                token.value[0].value = newName;
                return;
            }

            if (token.type === TokenTypes.REGISTERAT) {
                return renameInToken(token.value[1])
            }

            if (token.type === TokenTypes.POINT) {
                renameInToken(token.value[0]);
                renameInToken(token.value[1]);
            }

            if (token.type === TokenTypes.ARRAY) {
                ( token.value as Array<Token> ).forEach(t => renameInToken(t));
            }

            if (token.type === TokenTypes.EXPRESSION) {
                renameInToken(token.value[0]);
                renameInToken(token.value[2]);
                return;
            }
        }

        const renameInLine = (line: string) => {
            const tokens = Parser.parseLine(line);

            tokens.forEach(t => renameInToken(t));

            return Parser.constructCodeLine(tokens);
        }

        this._code = this._code.map(l => renameInLine(l));
        this._registers = this._registers.map(r => r === oldName ? newName : r);
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
                    case TokenTypes.REGISTERAT:
                        walk(token.value as Array<Token>);
                        break;
                    case TokenTypes.EXPRESSION:
                        walk(token.value as Array<Token>);
                        break;

                }
            }
        }

        walk(tokens);
    }
}
