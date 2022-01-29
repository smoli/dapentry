import BaseController from "./BaseController";
import {LibraryEntry} from "../Library";

/**
 * @namespace sts.drawable.controller
 */
export default class LibraryController extends BaseController {

    onLibraryEntrySelected(event) {
        const ctx = event.getSource().getBindingContext(this.getAppModelName());

        if (!ctx) {
            return;
        }

        const entry: LibraryEntry = ctx.getObject();

        if (!entry) {
            return;
        }

        this.getComponentController().insertLibraryEntry(entry);
    }

}