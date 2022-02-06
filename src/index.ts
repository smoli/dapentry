import {createApp} from "vue";
import Drawable from "./drawable.vue"
import {appStore} from "./state/AppStore";
import {AppController} from "./AppController";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "./state/State";

const app = createApp(Drawable);
app.use(appStore);

const interpreter = new GfxInterpreter()
const appController = new AppController(new State(appStore), interpreter);

app.provide("controller", appController);
app.mount("#drawable-app");
appController.init();

window.onkeydown = event => appController.handleKeyEvent(event);