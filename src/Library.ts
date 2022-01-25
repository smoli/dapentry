import {AppModel, AppModelKeys} from "./model/AppModel";

export enum LibraryEntryArgumentType {
     Number = "number"
}

export interface LibraryEntryArgument {
    type: LibraryEntryArgumentType,
    default: any,
    description: string
}

interface LibraryEntry {
    id: string,
    name: string,
    description: string,
    author: string,
    lastUpdate: Date,
    version: string,
    arguments: { [key:string]: LibraryEntryArgument }
    code: string
}


export class Library {
    private _appModel: AppModel;
    
    constructor(appModel: AppModel) {
        this._appModel = appModel;
    }

    addEntry(info:LibraryEntry) {
        if (this._appModel.get(AppModelKeys.library, e => e.id === info.id)) {
            this._appModel.remove(e => e.name === info.id).from(AppModelKeys.library);
        }
        this._appModel.push(info).to(AppModelKeys.library);
    }

    getEntry(id: string):LibraryEntry {
        return this._appModel.get(AppModelKeys.library, e => e.id === id);
    }


}