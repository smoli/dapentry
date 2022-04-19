import {ActionResult, BaseAction} from "./BaseAction";
import {LibraryEntry} from "../core/Library";
import {ASSERT} from "../core/Assertions";
import {DialogCloseReason} from "../ui/core/ModalFactory";

export class LoadFromLibrary extends BaseAction {
    private _entryName: string;

    constructor(entryName: string) {
        super();
        this._entryName = entryName;
    }

    protected async load(entry: LibraryEntry) {
        this.state.transaction(() => {
            entry.arguments.forEach(arg => {
                this.state.addDataField(arg.name, arg.default, arg.description, true);
            });
            entry.fields.forEach(field => {
                this.state.addDataField(field.name, field.default, field.description, false);
            });

            const code = entry.code.split("\n");
            this.state.setCode(code);

            entry.objects.forEach(o => {
                if (o.isGuide) {
                    this.state.addGuide(o.name);
                }
            });

            this.state.setDrawingId(entry.id);
            this.state.setDrawingCreatedBy(entry.createdBy)
            this.state.setDrawingNameAndDescription(entry.name, entry.description);
        }, false);
        await this.controller.setAspectRatio(entry.aspectRatio)
    }

    protected async _execute(data: any): Promise<ActionResult | void> {

        const dialog = this.controller.modalFactory.createConfirmationModal();
        const r = await dialog.show({
            text: "This replaces the current drawing. All unsaved changes will be lost",
            yesButtonTextId: "Yes, load the drawing",
            noButtonTextId: "No, keep current"
        });

        if (r.reason === DialogCloseReason.NO) {
            return;
        }

        const entry = this.state.getLibraryEntry(this._entryName)

        ASSERT(!!entry, "Could not find entry " + this._entryName);

        if (entry) {
            this.controller.resetAll();
            await this.load(entry);
        }

    }
}