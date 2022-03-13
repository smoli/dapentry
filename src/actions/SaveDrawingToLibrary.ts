import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import SaveDrawingDialog, {SaveDrawingHandler} from "../ui/SaveDrawing/SaveDrawingDialog";
import {AspectRatio} from "../geometry/GrCanvas";
import {API} from "../api/API";
import {DataFieldType} from "../state/modules/Data";


interface APILibraryEntryPOST {
    id: number,
    name: string,
    description: string,
    code: string,
    aspect: string,
    svg_preview: string,
    preview_vb_width: number,
    preview_vb_height: number,
    private: boolean,
    arguments: Array<{ id: number, name: string, description: string, default: string, public: true }>,
    objects: Array<{ id: number, name: string, published: boolean, guide: boolean }>
}


export class SaveDrawingToLibrary extends BaseAction {


    protected get aspectRatio(): string {
        return AspectRatio[this.controller.state.store.state.drawing.aspectRatio];
    }

    protected makeCode(data): string {
/*
        const code = [
            "COMPOSITE o",
            ...this.controller.state.store.state.code.code];

        data.publishedObjects
            .filter(obj => obj.use)
            .forEach(obj => {
                code.push("APP o.objects, " + obj.object.uniqueName);
            });
*/

        // return code.join("\n");

        return this.controller.state.store.state.code.code.join("\n");
    }


    protected makePostData(data): APILibraryEntryPOST {

        const convert = v => {
            if (Array.isArray(v)) {
                return JSON.stringify(v);
            }
            return v;
        }

        return {
            id: data.id,
            name: data.name,
            description: data.description,
            code: this.makeCode(data),
            aspect: this.aspectRatio,
            svg_preview: data.svgPreview,
            preview_vb_width: data.previewVBWidth,
            preview_vb_height: data.previewVBHeight,
            private: false,
            arguments: data.arguments.map(arg => {
                return {
                    name: arg.field.name,
                    description: arg.field.description,
                    default: "" + convert(arg.field.value),
                    public: arg.field.published,
                    type: DataFieldType[arg.field.type]
                }
            }),
            objects: data.publishedObjects.map(obj => {
                return {
                    name: obj.object.uniqueName,
                    published: obj.use && !obj.object.isGuide,
                    guide: obj.object.isGuide
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

        if (data.hasOwnProperty("id") && data.id !== -1) {
            return API.updateLibraryEntry(this.makePostData(data));
        } else {
            return API.postNewLibraryEntry(this.makePostData(data));
        }

    }
}