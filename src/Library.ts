import {AppModel, AppModelKeys} from "./model/AppModel";
import {AspectRatio} from "./Geo/GrCanvas";
import {AppState} from "./model/AppState";
import {inflate} from "zlib";

export enum LibraryEntryArgumentType {
     Number = "number"
}

export interface LibraryEntryArgument {
    type: LibraryEntryArgumentType,
    default: any,
    description: string
}

export interface LibraryEntry {
    id: string,
    name: string,
    description: string,
    author: string,
    lastUpdate: Date,
    version: string,
    aspectRatio: AspectRatio,
    arguments: { [key:string]: LibraryEntryArgument }
    code: string
}


export class Library {
    private _appState: AppState;
    
    constructor(appState: AppState) {
        this._appState = appState;
    }

    addEntry(info:LibraryEntry) {
        this._appState.addLibraryEntry(info);
    }

    getEntry(id: string):LibraryEntry {
        return this._appState.getLibraryEntry(id);
    }
}