import {AnnotatedCodeLine, CodeManager} from "../../runtime/CodeManager";


export interface CodeState {
    codeManager: CodeManager,
    code: Array<string>,
    selectedLines: Array<number>
}


export const codeState = {

    state():CodeState {
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

        annotatedSelection(state:CodeState): Array<AnnotatedCodeLine> {
            return state.codeManager.annotatedCode.filter(a => state.selectedLines.indexOf(a.originalLine) !== -1);
        }
    },

    mutations: {
        setCode(state: CodeState, code: Array<string> = []) {
                state.code = code;
                state.codeManager.clear();
                state.codeManager.addStatements(code);
        },

        add(state: CodeState, code: Array<string>, insertAt: number = -1) {
            if (insertAt === -1) {
                state.code.push(...code);
                state.codeManager.addStatements(code)
            } else {
                state.code.splice(insertAt, 0, ...code);
                state.codeManager.insertStatements(code, insertAt)
            }
        },

        insert(state: CodeState, code: Array<string>, insertAt: number = -1) {
            if (insertAt === -1) {
                state.code.push(...code);
                state.codeManager.addStatements(code)
            } else {
                state.code.splice(insertAt, 0, ...code);
                state.codeManager.insertStatements(code, insertAt)
            }
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
