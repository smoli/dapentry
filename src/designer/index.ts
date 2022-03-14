import {makeDesigner} from "../core/makeDesigner";
import {Persistence} from "../state/Persistence";

const appController = makeDesigner("drawable-app", { hideToolbar: true})
window.onkeydown = event => appController.handleKeyEvent(event);

appController.load(new Persistence()).then()