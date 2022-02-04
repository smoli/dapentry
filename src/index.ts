import {createApp} from "vue";
import Drawable from "./drawable.vue"
import {SvgObjectRenderer} from "./drawing/SvgObjectRenderer";
import {AppConfig} from "./AppConfig";
import {appState} from "./state/AppState";
import {AppController} from "./AppController";
import {GfxInterpreter} from "./GfxInterpreter";

const app = createApp(Drawable);
app.use(appState);
app.mount("#drawable-app");

const renderer = new SvgObjectRenderer(AppConfig.SVG.rendererId, null);
const interpreter = new GfxInterpreter()

const appController = new AppController(appState, renderer, interpreter);

app.provide("controller", appController);