import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import SaveDrawingDialog, {SaveDrawingHandler} from "../ui/SaveDrawing/SaveDrawingDialog";
import {API} from "../api/API";
import {DataFieldType} from "../state/modules/Data";
import {AspectRatio} from "../geometry/AspectRatio";
import PublishDrawingDialog, {PublishDrawingHandler} from "../ui/SaveDrawing/PublishDrawingDialog";
import {JSPublisher} from "../publish/JSPublisher";


export class PublishDrawing extends BaseAction {


    protected get aspectRatio(): string {
        return AspectRatio[this.controller.state.store.state.drawing.aspectRatio];
    }

    protected async _execute(): Promise<any> {
        const handler = PublishDrawingHandler;
        const component = PublishDrawingDialog;

        const dialog = this.controller.modalFactory.createModal<PublishDrawingHandler>(component, handler);

        const { reason, data } = await dialog.show();

        if (reason !== DialogCloseReason.YES) {
            return;
        }

        const moduleCode = JSPublisher.getDrawingModule(
            this.state.store.state.code.code.join("\n"),
            this.controller.state.store.state.drawing.aspectRatio,
            this.controller.state.store.state.drawing.dimensions.height,
            data.arguments.filter(f => f.published),
            data.arguments.filter(f => !f.published),
            data.publishedObjects.filter(o => o.use).map(o => o.object.uniqueName)
        );

        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(moduleCode));
        element.setAttribute('download', 'dapentry-drawing.mjs');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }
}