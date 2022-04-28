import {AnnotatedCodeLine, CodeManager, CreationInfo} from "../../runtime/CodeManager";
import {ASSERT} from "../../core/Assertions";
import {AppConfig} from "../../core/AppConfig";


export interface CodeState {
    codeManager: CodeManager,
    code: Array<string>,
    selectedLines: Array<number>
}


const creationStatements: CreationInfo = {}

Object.values(AppConfig.Runtime.Opcodes.Circle)
    .forEach(opcode => {
        creationStatements[opcode] = 1;
    })

Object.values(AppConfig.Runtime.Opcodes.Rect)
    .forEach(opcode => {
        creationStatements[opcode] = 1;
    })

Object.values(AppConfig.Runtime.Opcodes.Line)
    .forEach(opcode => {
        creationStatements[opcode] = 1;
    })

creationStatements[AppConfig.Runtime.Opcodes.Poly.Create] = 1;
creationStatements[AppConfig.Runtime.Opcodes.Quad.Create] = 1;
creationStatements[AppConfig.Runtime.Opcodes.Bezier.Create] = 1;
creationStatements["LOAD"] = 1;
creationStatements["TEXT"] = 1;


function getDefaultState(): CodeState {
    return {
        codeManager: new CodeManager(creationStatements),
        code: [],
        selectedLines: []
    }
}

export const codeState = {

    state(): CodeState {
        return getDefaultState();
    },

    getters: {
        snapshot(state: CodeState): CodeState {
            return {
                codeManager: null,
                code: [...state.code],
                selectedLines: [...state.selectedLines]
            }
        },

        fullCode(state): Array<string> {
            return [...state.code];
        },

        annotated(state): Array<AnnotatedCodeLine> {
            return state.codeManager.annotatedCode;
        },

        annotatedSelection(state: CodeState): Array<AnnotatedCodeLine> {
            return state.codeManager.annotatedCode.filter(a => state.selectedLines.indexOf(a.originalLine) !== -1);
        }
    },

    mutations: {
        restore(state: CodeState, payload: CodeState) {
            state.code = [...payload.code];
            state.selectedLines = [...payload.selectedLines];
            state.codeManager.clear();
            state.codeManager.addStatements(state.code);
        },

        reset(state: CodeState) {
            Object.assign(state, getDefaultState());
        },

        setCode(state: CodeState, code: Array<string> = []) {
            state.codeManager.clear();
            state.codeManager.addStatements(code);
            state.code = state.codeManager.code.map(s => s);
        },

        add(state: CodeState, code: Array<string>) {
            state.codeManager.addStatements(code)
            state.code = state.codeManager.code.map(s => s);
        },

        insert(state: CodeState, payload: { statements: Array<string>, insertAt: number }) {
            state.codeManager.insertStatements(payload.statements, payload.insertAt)
            state.code = state.codeManager.code.map(s => s);
        },

        remove(state: CodeState, index: number) {
            state.codeManager.removeStatement(index);
            state.code = state.codeManager.code.map(s => s);
        },

        replaceStatement(state: CodeState, payload: { index: number, newStatements: Array<string> }) {
            state.codeManager.replaceStatement(payload.index, ...payload.newStatements);
            state.code = state.codeManager.code.map(s => s);
        },

        clearSelection(state: CodeState) {
            state.selectedLines = [];
        },

        setSelection(state: CodeState, selection: Array<number>) {
            state.selectedLines = [...selection];
        },

        addToSelection(state: CodeState, selection: Array<number>) {
            state.selectedLines = [...state.selectedLines, ...selection];
        },

        renameRegister(state: CodeState, payload: { oldName: string, newName: string }) {
            ASSERT(state.codeManager.registerExists(payload.newName) === false, "Cannot rename to an existing name");
            state.codeManager.renameRegister(payload.oldName, payload.newName);
            state.code = state.codeManager.code.map(s => s);
        },

        renameTableColumn(state: CodeState, payload: { name: string, oldColumn: string, newColumn: string }) {
            state.codeManager.renameTableColumn(payload.name, payload.oldColumn, payload.newColumn);
            state.code = state.codeManager.code.map(s => s);
        }
    }
}
