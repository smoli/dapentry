import {LibraryEntry} from "../Library";
import {DataFieldInfo} from "./AppState";

export abstract class AbsStatePersistence {

    abstract getLibraryEntries():Promise<Array<LibraryEntry>>;

    abstract getDataFields():Promise<Array<DataFieldInfo>>;
}