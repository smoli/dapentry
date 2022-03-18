import {deMessages} from "./de/deMessages";
import {enMessages} from "./en/enMessages";

export const i18nMessages = {
    // "de": deMessages,

    en: {
        languages: {
/*
            "de": "Deutsch",
            "de-DE": "Deutsch",
*/
            "en": "English"
        },
        ...enMessages
    }
}