import {createI18n} from "vue-i18n";
import {i18nMessages} from "../i18n/i18nMessages";
import {AppController, ApplicationOptions} from "./AppController";
import {createAppStore} from "../state/AppStore";
import {createApp} from "vue";
import Drawable from "../ui/drawable.vue";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "../state/State";

const navigatorLanguage = navigator.language ? navigator.language.split("-")[0] : "en"
const i18n = createI18n({
    locale: navigatorLanguage,
    fallbackLocale: "en",
    messages: i18nMessages
});

export interface LayoutOptions {
    hideHeader?: boolean,
    hideLeftColumn?: boolean,
    hideDataEditor?: boolean,
    hideStepList?: boolean,
    hideMainColumn?: boolean,
    hideStatementPreview?: boolean,
    hideStatementEditor?: boolean,
    hideDrawing?: boolean,
    hideToolHint?: boolean,
    hideRightColumn?: boolean,
    hideFooter?: boolean
}

/**
 * Create a new instance of the drawable designer. This is fully self contained. You can
 * create multiple instances of the designer on one page. The Designer UI will consume the
 * space provided by the container element.
 *
 * @param containerId       ID of the container element. provide *without* the `#`
 * @param layout            Define what ui elements are displayed
 * @param appOptions        Define what features the designer supports
 */
export function makeDesigner(containerId: string,
                             layout: LayoutOptions = {},
                             appOptions: ApplicationOptions = {}): AppController {

    const appStore = createAppStore();
    // @ts-ignore
    const app = createApp(Drawable, layout);
    app.use(appStore);
    app.use(i18n);

    const interpreter = new GfxInterpreter()
    const appController = new AppController(new State(appStore, i18n), interpreter, appOptions);

    app.provide("controller", appController);
    app.mount("#" + containerId);
    appController.init();

    const mount = document.getElementById(containerId);

    if (mount.hasAttribute("tabindex")) {
        mount.onkeydown = event => appController.handleKeyEvent(event);
        mount.onmouseenter = () => mount.focus();
    }

    return appController;
}