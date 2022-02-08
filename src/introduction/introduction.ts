import {createApp} from "vue";
import {createI18n} from "vue-i18n";
import Drawable from "../drawable.vue"
import {appStore} from "../state/AppStore";
import {AppController, ApplicationOptions} from "../core/AppController";
import {GfxInterpreter} from "../core/GfxInterpreter";
import {State} from "../state/State";
import {i18nMessages} from "../i18n/i18nMessages";
import {AspectRatio} from "../geometry/GrCanvas";


const navigatorLanugage = navigator.language ? navigator.language.split("-")[0] : "en"

const i18n = createI18n({
    locale: navigatorLanugage,
    fallbackLocale: "en",
    messages: i18nMessages
});


function makeApp(mountPoint:string, layout: { [key:string]: boolean } = {}, appOptions: ApplicationOptions = {}) {
    const app = createApp(Drawable, layout);
    app.use(appStore);
    app.use(i18n);

    const interpreter = new GfxInterpreter()
    const appController = new AppController(new State(appStore), interpreter, appOptions);

    app.provide("controller", appController);
    app.mount("#" + mountPoint);
    appController.init();


    const mount = document.getElementById(mountPoint);
    mount.onkeydown = event => appController.handleKeyEvent(event);
}


const strippedLayout = { hideFooter: true, hideHeader: true, hideLeftColumn: true, hideRightColumn: true, hideStatementEditor: true, hideToolHint: true };
const wide:ApplicationOptions = { aspectRatio: AspectRatio.ar3_2, drawingWidth: 400 }
makeApp("intro-one", strippedLayout, wide);
makeApp("intro-two", strippedLayout, wide);


