import {AspectRatio} from "../geometry/GrCanvas";
import {State} from "../state/State";

export enum LibraryEntryArgumentType {
     Number = "number"
}

export interface LibraryEntryArgument {
    type: LibraryEntryArgumentType,
    name: string,
    default: any,
    description: string
}

export interface LibraryEntry {
    id: string,
    name: string,
    description: string,
    author?: string,
    lastUpdate: Date,
    version?: string,
    aspectRatio: AspectRatio,
    arguments: Array<LibraryEntryArgument>,
    fields: Array<LibraryEntryArgument>,
    code: string
}


/**
 * This class acts as a proxy to the state.
 * It helps us decouple the GfxInterpreter from the UI.
 */
export class Library {
    private _state: State;
    constructor(state:State) {
        this._state = state;
    }

    getEntry(name:string): LibraryEntry {
        return this._state.getLibraryEntry(name);
    }
}
