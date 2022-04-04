import {BaseAction} from "./BaseAction";
import {DialogCloseReason} from "../ui/core/ModalFactory";
import {AspectRatio} from "../geometry/AspectRatio";
import PublishDrawingDialog, {PublishDrawingHandler} from "../ui/SaveDrawing/PublishDrawingDialog";
import {JSPublisher} from "../publish/JSPublisher";
import {DataField, DataFieldType} from "../state/modules/Data";

import fs from 'fs';
const dapentryLib_mjs = fs.readFileSync('src/publish/dapentryLib/dapentryLib.mjs', 'utf8');
const index_html = fs.readFileSync('src/publish/example.html', 'utf8');
const server_js = fs.readFileSync('src/publish/server.js', 'utf8');
const readme_md = fs.readFileSync('src/publish/Readme.md', 'utf8');

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

    protected makeExampleModule(args: Array<DataField>): string {
        const vars = args.map(a => {
            let value = "";
            switch (a.type) {
                case DataFieldType.Number:
                    value = "" + a.value;
                    break;
                case DataFieldType.List:
                    value = `[${(a.value as Array<any>).join(", ")}]`;
                    break;
                case DataFieldType.String:
                    value = `"${a.value}"`;
                    break;
                case DataFieldType.Table:
                    value = JSON.stringify(a.value);
                    break;

            }
            return `const ${a.name} = ${value};`;
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
            data.publishedObjects.filter(o => o.use).map(o => o.object.uniqueName),
            data.publishedObjects.filter(o => o.isGuide).map(o => o.object.uniqueName)
        );

        const zip = await import("client-zip");

        const files = [
            { name: "Readme.md", lastModified: new Date(), input: readme_md },
            { name: "server.js", lastModified: new Date(), input: server_js },
            { name: "index.html", lastModified: new Date(), input: index_html },
            { name: "dapentryLib.mjs", lastModified: new Date(), input: dapentryLib_mjs },
            { name: "drawing.mjs", lastModified: new Date(), input: moduleCode },
            {
                name: "example.mjs",
                lastModified: new Date(),
                input: this.makeExampleModule(data.arguments.filter(f => f.published))
            }
        ];

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