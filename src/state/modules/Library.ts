import {LibraryEntry} from "../../core/Library";


export interface LibraryState {
    entries: Array<LibraryEntry>
}

export const libraryState = {

    state(): LibraryState {
        return {
            entries: []
        }
    },

    getters: {
        getEntry: (state:LibraryState) => (name: string) => {
            return state.entries.find(e => e.name === name);
        }
    },

    mutations: {

        add(state: LibraryState, entry: LibraryEntry) {
            state.entries.push(entry);
        },

    }
}
