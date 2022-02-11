import {AnnotatedCodeLine, CodeManager} from "../../runtime/CodeManager";


export interface CodeState {
    codeManager: CodeManager,
    code: Array<string>,
    selectedLines: Array<number>
}


export const codeState = {

    state(): CodeState {
        return {
            codeManager: new CodeManager(),
            code: [],
            selectedLines: []
        }
    },

    getters: {
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
        setCode(state: CodeState, code: Array<string> = []) {
            state.codeManager.clear();
            state.codeManager.addStatements(code);
            state.code = state.codeManager.code.map(s => s);
        },

        add(state: CodeState, code: Array<string>) {
            state.codeManager.addStatements(code)
            state.code = state.codeManager.code.map(s => s);
        },

        insert(state: CodeState, payload: { code: Array<string>, insertAt: number }) {
            state.codeManager.insertStatements(payload.code, payload.insertAt)
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
        }
    }
}
