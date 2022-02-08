import {AnnotatedCodeLine, CodeManager} from "../../runtime/CodeManager";


export interface CodeState {
    codeManager: CodeManager,
    code: Array<string>
}


export const codeState = {

    state():CodeState {
        return {
            codeManager: new CodeManager(),
            code: []
        }
    },

    getters: {
        fullCode(state): Array<string> {
            return [...state.code];
        },

        annotated(state): Array<AnnotatedCodeLine> {
            return state.codeManager.annotatedCode;
        }
    },

    mutations: {
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
        }
    }
}
