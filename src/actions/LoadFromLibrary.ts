import {ActionResult, BaseAction} from "./BaseAction";
import {LibraryEntry} from "../core/Library";
import {Parser, TokenTypes} from "../runtime/interpreter/Parser";
import {ASSERT} from "../core/Assertions";
import {AppConfig} from "../core/AppConfig";

export class LoadFromLibrary extends BaseAction {
    private _entryName: string;


    constructor(entryName: string) {
        super();
        this._entryName = entryName;
    }


    protected load(entry:LibraryEntry) {
        entry.arguments.forEach(arg => {
            this.state.addDataField(arg.name, arg.default);
        });
        entry.fields.forEach(field => {
            this.state.addDataField(field.name, field.default);
        });

        const code = entry.code.split("\n");
        this.state.setCode(code);

        entry.objects.forEach(o => {
            if (o.isGuide) {
                this.controller.markObjectAsGuide(o.name);
            }
        });

    }

    protected async _execute(data: any): Promise<ActionResult | void> {

        const entry = this.state.getLibraryEntry(this._entryName)

        ASSERT(!!entry, "Could not find entry " + this._entryName);

        if (entry) {
            this.controller.resetAll();
            this.load(entry);
        }

    }
}