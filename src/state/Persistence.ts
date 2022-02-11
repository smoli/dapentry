import {State} from "./State";
import {LibraryEntry} from "../core/Library";

export class Persistence {
    private _state: State;

    async load(state:State):Promise<void> {
        this._state = state;
        const code = await this.loadCode();
        state.setCode(code);

        const locale = await this.loadLocale();
        state.setLocale(locale);

        await this.loadLibrary();
    }

    async saveAll():Promise<void> {
        await this.saveLocale();
        await this.saveCode();
    }

    async saveLocale():Promise<void> {
        localStorage.setItem("locale", this._state.locale);
    }

    async saveCode():Promise<void> {
        localStorage.setItem("code", JSON.stringify(this._state.store.state.code.code));
    }


    async loadLibrary():Promise<Array<LibraryEntry>> {
        const result = await fetch("http://localhost:8000/api/library", {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "application/json"
            }
        });

        const data = await result.json();

        console.log(JSON.stringify(data, null, 2));

        return []
    }


    async loadLocale():Promise<string> {
        return localStorage.getItem("locale") || navigator.language.split("-")[0]
    }

    async loadCode():Promise<Array<string>> {
        const code = localStorage.getItem("code");
        if (code) {
            return JSON.parse(code);
        } else {
            return [];
        }
        /*return [
            "POLY Polygon2, $styles.default, [ (215.58274841308594, 220.28851318359375), (795.9611206054688, 257.9346923828125), (800.6668701171875, 632.8276977539062), (518.3206176757812, 753.609130859375), (695.5713500976562, 519.8892211914062), (439.8911437988281, 654.7879638671875), (541.8494873046875, 414.793701171875), (374.0103454589844, 386.55908203125), (303.4237976074219, 789.6867065429688), (615.5732421875, 830.4700927734375), (562.2411499023438, 924.5855102539062), (262.64044189453125, 949.6829223632812), (43.03783416748047, 847.7245483398438), (182.64234924316406, 555.966796875), (110.48721313476562, 458.7142028808594), (173.23081970214844, 315.9725036621094) ], 1",
            "ROTATE Polygon2, 46.71673220901628, Polygon2@center",
            'SCALE Polygon2, 1, 0.75, "bottom"'
        ];*/
    }

}