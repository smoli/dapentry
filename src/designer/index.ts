import {makeDesigner} from "../core/makeDesigner";
import {Persistence} from "../state/Persistence";

globalThis.__VUE_OPTIONS_API__ = true;
globalThis.__VUE_PROD_DEVTOOLS__ = true;

const appController = makeDesigner("drawable-app", { hideToolbar: true})
window.onkeydown = event => appController.handleKeyEvent(event);

appController.load(new Persistence()).then()