
export interface CodeState {
    code: Array<string>
}

export const codeState = {
    state():CodeState {
        return {
            code: []
        }
    },

    getters: {
        fullCode(state) {
            return [...state.code];
        }
    },

    mutations: {
        add(state: CodeState, code: Array<string>, insertAt: number = -1) {
            if (insertAt === -1) {
                state.code.push(...code);
            } else {
                state.code.splice(insertAt, 0, ...code);
            }
        },

        insert(state: CodeState, code: Array<string>, insertAt: number = -1) {
            if (insertAt === -1) {
                state.code.push(...code);
            } else {
                state.code.splice(insertAt, 0, ...code);
            }
        }
    }
}