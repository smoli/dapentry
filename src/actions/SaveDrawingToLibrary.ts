import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import SaveDrawingDialog, {SaveDrawingHandler} from "../ui/SaveDrawing/SaveDrawingDialog";
import {AspectRatio} from "../geometry/GrCanvas";
import {AppConfig} from "../core/AppConfig";
import {API} from "../api/API";


interface APILibraryEntryPOST {
    name: string,
    description: string,
    code: string,
    aspect: string,
    arguments: Array<{ name: string, description: string, default: string }>
}


export class SaveDrawingToLibrary extends BaseAction {


    protected get aspectRatio():string {
        return AspectRatio[this.controller.state.store.state.drawing.aspectRatio];
    }

    protected makeCode(data):string {
        const code = [
            "COMPOSITE o",
            ...this.controller.state.store.state.code.code];

        data.publishedObjects
            .filter(obj => obj.use)
            .forEach(obj => {
            code.push("APP o.objects, " + obj.object.uniqueName);
        });

        return code.join("\n");
    }


    protected makePostData(data): APILibraryEntryPOST {
        return {
            name: data.name,
            description: data.description,
            code: this.makeCode(data),
            aspect: this.aspectRatio,
            arguments: data.arguments.map(arg => {
                return {
                    name: arg.field.name,
                    description: arg.description,
                    default: "" + JSON.stringify(arg.field.value)
                }
            })
        }
    }


    protected async _execute(): Promise<any> {
        const handler = SaveDrawingHandler;
        const component = SaveDrawingDialog;

        const dialog = this.controller.modalFactory.createModal<SaveDrawingHandler>(component, handler);

        const { reason, data } = await dialog.show();

        if (reason !== DialogCloseReason.YES) {
            return;
        }

        return API.postNewLibraryEntry(this.makePostData(data));
    }
}