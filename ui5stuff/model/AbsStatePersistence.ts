import {LibraryEntry} from "../../src/core/Library";
import {DataFieldInfo} from "./AppState";

export abstract class AbsStatePersistence {

    abstract getLibraryEntries():Promise<Array<LibraryEntry>>;

    abstract getDataFields():Promise<Array<DataFieldInfo>>;
}