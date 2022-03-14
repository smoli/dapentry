import {createI18n} from "vue-i18n";
import {i18nMessages} from "../i18n/i18nMessages";
import {AppController, applicationDefaults, ApplicationOptions} from "./AppController";
import {createAppStore} from "../state/AppStore";
import {createApp} from "vue/dist/vue.esm-bundler";
import Drawable from "../ui/drawable.vue";
import {GfxInterpreter} from "./GfxInterpreter";
import {State} from "../state/State";
import {Library} from "./Library";
import {layoutDefaults, LayoutOptions} from "./layoutOptions";

const navigatorLanguage = navigator.language ? navigator.language.split("-")[0] : "en"
const i18n = createI18n({
    locale: navigatorLanguage,
    fallbackLocale: "en",
    messages: i18nMessages
});

/**
 * Create a new instance of the drawable designer. This is fully self contained. You can
 * create multiple instances of the designer on one page. The Designer UI will consume the
 * space provided by the container element.
 *
 * @param containerId       ID of the container element. provide *without* the `#`
 * @param layout            Define what ui elements are displayed
 * @param appOptions        Define what features the designer supports
 * @param initialCode
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
    let library = null;

    if (appOptions.libraryAvailable) {
        library = new Library(state);
    }

    const interpreter = new GfxInterpreter(library);
    const appController = new AppController(state, interpreter, appOptions);

    app.provide("controller", appController);
    console.log("Mounting ", containerId)
    app.mount("#" + containerId);
    appController.init();

    console.log(Object.assign(Object.assign({}, layoutDefaults), layout));

    state.setLayout(Object.assign(Object.assign({}, layoutDefaults), layout))
    const mount = document.getElementById(containerId);

    if (mount.hasAttribute("tabindex")) {
        mount.onkeydown = event => appController.handleKeyEvent(event);
        mount.onmouseenter = () => mount.focus();
    }

    if (initialCode) {
        appController.setCode(initialCode);
    }
    return appController;
}

