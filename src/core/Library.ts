import {AspectRatio} from "../geometry/GrCanvas";

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
    author?: string,
    lastUpdate: Date,
    version?: string,
    aspectRatio: AspectRatio,
    arguments: { [key:string]: LibraryEntryArgument }
    code: string
}
