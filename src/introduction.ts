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


function makeApp(mountPoint:string, options: { [key:string]: boolean } = {}) {
    const app = createApp(Drawable, options);
    app.use(appStore);
    app.use(i18n);

    const interpreter = new GfxInterpreter()
    const appController = new AppController(new State(appStore), interpreter);

    app.provide("controller", appController);
    app.mount("#" + mountPoint);
    appController.init();


    const mount = document.getElementById(mountPoint);
    mount.onkeydown = event => appController.handleKeyEvent(event);
}

makeApp("intro-one", { hideFooter: true, hideHeader: true, hideLeftColumn: true, hideRightColumn: true, hideStatementEditor: true, hideToolHint: false });
makeApp("intro-two", { hideFooter: true, hideHeader: true, hideLeftColumn: true, hideRightColumn: true, hideStatementEditor: true, hideToolHint: true });


