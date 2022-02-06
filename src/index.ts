import {createApp} from "vue";
import Drawable from "./drawable.vue"
import {SvgObjectRenderer} from "./drawing/SvgObjectRenderer";
import {AppConfig} from "./AppConfig";
import {appStore} from "./state/AppStore";
import {AppController} from "./AppController";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "./state/State";

const app = createApp(Drawable);
app.use(appStore);

const interpreter = new GfxInterpreter()
const appController = new AppController(new State(appStore), interpreter);
const renderer = new SvgObjectRenderer(appController.handleObjectSelection.bind(appController));

app.provide("renderer", renderer);
app.provide("controller", appController);

app.mount("#drawable-app");

renderer.init(AppConfig.SVG.rendererId);
appController.init();

window.onkeydown = event => appController.handleKeyEvent(event);