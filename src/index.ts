import {createApp} from "vue";
import {createI18n} from "vue-i18n";
import Drawable from "./drawable.vue"
import {appStore} from "./state/AppStore";
import {AppController} from "./AppController";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "./state/State";
import {i18nMessages} from "./i18n/i18nMessages";


const navigatorLanugage = navigator.language ? navigator.language.split("-")[0] : "en"

const i18n = createI18n({
    locale: navigatorLanugage,
    fallbackLocale: "en",
    messages: i18nMessages
});


const app = createApp(Drawable);
app.use(appStore);
app.use(i18n);

const interpreter = new GfxInterpreter()
const appController = new AppController(new State(appStore), interpreter);

app.provide("controller", appController);
app.mount("#drawable-app");
appController.init();

window.onkeydown = event => appController.handleKeyEvent(event);