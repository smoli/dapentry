import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {AspectRatio} from "../geometry/AspectRatio";
import PublishDrawingDialog, {PublishDrawingHandler} from "../ui/SaveDrawing/PublishDrawingDialog";
import {JSPublisher} from "../publish/JSPublisher";

import fs from 'fs';
const dapentryLib_mjs = fs.readFileSync('src/publish/dapentryLib/dapentryLib.mjs', 'utf8');
const index_html = fs.readFileSync('src/publish/example.html', 'utf8');

const example_mjs = `
import { Drawing } from "./drawing.mjs";
const d = new Drawing();
d.init("drawing");

<ARG_VARIABLES>   
d.renderDrawing(<PARAMETERS>);
`;


export class PublishDrawing extends BaseAction {

    protected get aspectRatio(): string {
        return AspectRatio[this.controller.state.store.state.drawing.aspectRatio];
    }

    protected makeExampleModule(args: Array<any>): string {
        const vars = args.map(a => {
            return `const ${a.name} = ${a.value};`;
        }).join("\n");

        const params = args.map(a => a.name).join(", ");

        return example_mjs
            .replace("<ARG_VARIABLES>", vars)
            .replace("<PARAMETERS>", params);
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

        const zip = await import("client-zip");


        const files = [
            { name: "index.html", lastModified: new Date(), input: index_html },
            { name: "dapentryLib.mjs", lastModified: new Date(), input: dapentryLib_mjs },
            { name: "drawing.mjs", lastModified: new Date(), input: moduleCode },
            {
                name: "example.mjs",
                lastModified: new Date(),
                input: this.makeExampleModule(data.arguments.filter(f => f.published))
            },
        ]
        const blob = await zip.downloadZip(files).blob();

        const element = document.createElement('a');
        element.href = URL.createObjectURL(blob);
        element.download = "dapentryDrawing.zip";
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);

    }
}