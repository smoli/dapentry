import {createApp} from "vue";
import Drawable from "./drawable.vue"
import {SvgObjectRenderer} from "./drawing/SvgObjectRenderer";
import {AppConfig} from "./AppConfig";
import {appState} from "./state/AppState";
import {AppController} from "./AppController";
import {GfxInterpreter} from "./GfxInterpreter";

const app = createApp(Drawable);
app.use(appState);

const renderer = new SvgObjectRenderer(null);
const interpreter = new GfxInterpreter()
const appController = new AppController(appState, interpreter);

app.provide("renderer", renderer);
app.provide("controller", appController);

app.mount("#drawable-app");

renderer.init(AppConfig.SVG.rendererId);

window.onkeydown = event => appController.handleKeyEvent(event);