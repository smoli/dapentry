import {createI18n} from "vue-i18n";
import {i18nMessages} from "../i18n/i18nMessages";
import {AppController, applicationDefaults, ApplicationOptions} from "./AppController";
import {createAppStore} from "../state/AppStore";
import {createApp} from "vue/dist/vue.esm-bundler";
import Drawable from "../ui/drawable.vue";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "../state/State";
import {Library} from "./Library";

const navigatorLanguage = navigator.language ? navigator.language.split("-")[0] : "en"
const i18n = createI18n({
    locale: navigatorLanguage,
    fallbackLocale: "en",
    messages: i18nMessages
});

export interface LayoutOptions {
    hideHeader?: boolean,
    hideToolbar?: boolean,
    hideLeftColumn?: boolean,
    hideDataEditor?: boolean,
    hideStepList?: boolean,
    hideMainColumn?: boolean,
    hideStatementPreview?: boolean,
    hideStatementEditor?: boolean,
    hideDrawing?: boolean,
    hideToolHint?: boolean,
    hideRightColumn?: boolean,
    hideFooter?: boolean,
    hideLibrary?: boolean
}

export const layoutDefaults:LayoutOptions = {
    hideLibrary: true
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
                             appOptions: ApplicationOptions = applicationDefaults,
                             initialCode: string = ""): AppController {

    const appStore = createAppStore();
    const app = createApp(Drawable);
    app.use(appStore);
    app.use(i18n);

    const state = new State(appStore, i18n);
    state.setLayout({...layoutDefaults, ...layout })
    let library = null;

    if (appOptions.libraryAvailable) {
        library = new Library(state);
    }

    const interpreter = new GfxInterpreter(library);
    const appController = new AppController(state, interpreter, appOptions);

    app.provide("controller", appController);
    app.mount("#" + containerId);
    appController.init();

    const mount = document.getElementById(containerId);

    if (mount.hasAttribute("tabindex")) {
        mount.onkeydown = event => appController.handleKeyEvent(event);
        mount.onmouseenter = () => mount.focus();
    }

   /* window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
        const dialog = appController.modalFactory.createInfoModal();
        dialog.show({
            text: errorMsg + "\n" + url + ":" + lineNumber,
            caption: "Internal error"

        }).then();
        return false;
    }*/

    if (initialCode) {
        appController.setCode(initialCode);
    }

    return appController;

}

