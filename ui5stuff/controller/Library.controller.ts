import BaseController from "./BaseController";
import {LibraryEntry} from "../../src/core/Library";
import {AppConfig} from "../../src/core/AppConfig";

/**
 * @namespace sts.drawable.controller
 */
export default class LibraryController extends BaseController {

    onLibraryEntrySelected(event) {
        const ctx = event.getSource().getBindingContext(AppConfig.UICore.appModelName);

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