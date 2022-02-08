import {makeDesigner} from "../core/makeDesigner";

const appController = makeDesigner("drawable-app")
window.onkeydown = event => appController.handleKeyEvent(event);