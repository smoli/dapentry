import {State} from "./State";
import {LibraryEntry} from "../core/Library";
import {DataField} from "./modules/Data";
import {API, APIResponse, ResponseStatus} from "../api/API";

export class Persistence {
    private _state: State;

    async load(state: State): Promise<void> {
        this._state = state;
        // const code = await this.loadCode();
        // state.setCode(code);

        // state.setCodeString(this.getDemoCode());

        if (this._state.store.state.auth.authenticated) {
            await this.saveAuth(this._state.store.state.auth.token)
        } else {
            await this.loadAuthFromLocalStorage();
        }

        const locale = await this.loadLocale();
        state.setLocale(locale);

        const fields = await this.loadData();
        state.setData(fields);

        const libraryEntries = await this.loadLibrary();
        if (!libraryEntries) {
            return;
        }
        libraryEntries.forEach(e => state.addLibraryEntry(e));
    }

    protected async saveAuth(token: string) {
        localStorage.setItem("authToken", token);
        API.setAuthInfo(token)
        const userResponse = await API.getUser();
        if (userResponse.status !== ResponseStatus.OK) {
            this._state.logout();
            API.setAuthInfo(null)
            return;
        }
    }

    public removeAuthToken() {
        localStorage.removeItem("authToken");
    }

    protected async loadAuthFromLocalStorage() {
        const token = localStorage.getItem("authToken");

        if (!token) {
            return;
        }

        // This additionally acts as a check if the auth token is still valid
        API.setAuthInfo(token)
        const userResponse = await API.getUser();
        if (userResponse.status !== ResponseStatus.OK) {
            return;
        }
        await this.saveAuth(token);
        this._state.authenticated(token, userResponse.data);
    }

    async saveAll(): Promise<void> {
        await this.saveLocale();
        await this.saveCode();
    }

    async saveLocale(): Promise<void> {
        localStorage.setItem("locale", this._state.locale);
    }

    async saveCode(): Promise<void> {
        localStorage.setItem("code", JSON.stringify(this._state.store.state.code.code));
    }


    async loadLibrary(): Promise<Array<LibraryEntry>> {
        if (!this._state.store.state.auth.authenticated) {
            return;
        }
        const response: APIResponse<any> = await API.getLibraryEntries();

        // Todo: Error checking
        console.log(response.data);

        return response.data;
    }


    async loadLocale(): Promise<string> {
        return localStorage.getItem("locale") || navigator.language.split("-")[0]
    }

    protected getDemoCode(): string {
        return `RECTPP Rectangle1,$styles.default,Canvas@bottomLeft,Canvas@topRight
OPACITY Rectangle1, "1"
FILL Rectangle1, "#05a5f5"
FILL Rectangle1, "#1a6184"
RECTBL Rectangle2,$styles.default,Rectangle1@bottomLeft,1492.73,14.60
QUAD Quadratic2, $styles.default, [ (984.03, 319.75), (1014.86, 323.95), (1041.49, 344.97), (1068.11, 398.22), (995.24, 441.67), (923.77, 492.12), (927.98, 572.00), (901.35, 681.30), (890.14, 679.90), (891.54, 517.34), (814.46, 450.08), (984.03, 318.35) ], 1
POLY Polygon1, $styles.default, [ Quadratic2@P5, Quadratic2@P7, (933.58, 709.33), (897.14, 693.92), (929.38, 713.54), (892.94, 703.73), (918.17, 713.54), (888.74, 709.33), Quadratic2@P8, Quadratic2@P9, (919.57, 511.74) ], 1
QUAD Quadratic3, $styles.default, [ Quadratic2@P11, (744.39, 436.06), (663.11, 433.26), (562.22, 486.51), (556.61, 671.49), (579.03, 684.11), (630.88, 553.78), (807.46, 546.77), Polygon1@P9, Quadratic2@P0 ], 1
POLY Polygon2, $styles.default, [ (992.11, 377.39), (1020.10, 370.40), (1028.49, 375.99), (994.90, 375.99) ], 1
QUAD Quadratic5, $styles.default, [ (844.79, 379.50), (862.91, 279.15), (875.45, 234.55), (769.52, 74.27), (765.34, 90.99), (763.95, 86.81), (758.37, 114.69), (756.98, 114.69), (747.22, 131.41), (748.62, 134.20), (724.92, 152.32), (727.71, 162.07), (709.59, 187.16), (715.17, 247.09), (708.20, 268.00), Quadratic3@P2, (828.06, 453.37), (843.39, 380.90) ], 1
QUAD Quadratic6, $styles.default, [ Quadratic5@P17, (884.84, 281.66), (900.13, 230.23), (730.55, 32.84) ], 1
QUAD Quadratic8, $styles.default, [ Quadratic3@P6, (615.54, 592.95), (601.68, 660.87), (580.88, 724.64), (585.04, 577.70), Quadratic3@P6 ], 1
POLY Polygon4, $styles.default, [ (1064.70, 375.30), (1077.17, 380.84), (1093.81, 390.55), (1100.74, 403.03), (1092.42, 415.50), (1060.54, 412.73), (1066.08, 379.46) ], 1
OPACITY Polygon4, "1"
FILL Polygon4, "#3a3636"
OPACITY Quadratic2, "1"
FILL Quadratic2, "#09582f"
FILL Quadratic2, "#054223"
OPACITY Quadratic5, "1"
FILL Quadratic5, "#3b5441"
OPACITY Quadratic5, "0.84"
OPACITY Quadratic5, "1"
OPACITY Quadratic6, "1"
FILL Quadratic6, "#384837"
OPACITY Quadratic3, "1"
OPACITY Quadratic3, "0.05"
OPACITY Quadratic3, "1"
POLY Polygon6, $styles.default, [ (872.88, 371.70), Quadratic6@P0, Quadratic3@P9, (911.54, 413.12), (883.93, 464.21), (882.55, 502.87), Quadratic3@P8, (900.50, 537.39), Quadratic3@P7, Quadratic2@P10, Quadratic6@P0 ], 1
OPACITY Polygon6, "1"
FILL Polygon6, "#2b472a"
FILL Quadratic3, "#ddaf6e"
FILL Quadratic3, "#99794d"
OPACITY Quadratic8, "1"
FILL Quadratic8, "#9a7f47"
STROKEWIDTH Quadratic8, "0"
STROKEWIDTH Quadratic3, "0"
STROKEWIDTH Quadratic5, "0"
STROKEWIDTH Quadratic6, "0"
STROKEWIDTH Polygon6, "0"
STROKEWIDTH Quadratic2, "0"
STROKEWIDTH Polygon4, "0"
OPACITY Polygon1, "0.95"
FILL Polygon1, "#2b5a31"
OPACITY Polygon1, "1"
STROKEWIDTH Rectangle1, "0"
STROKEWIDTH Polygon1, "0"
POLY Polygon7, $styles.default, [ (587.08, 707.21), (616.07, 708.60), (632.64, 721.02), (611.93, 718.26), (588.46, 716.88), (625.74, 726.54), (632.64, 734.83), (618.83, 734.83), Quadratic8@P3, (635.40, 741.73), (616.07, 745.87), Quadratic8@P3, (599.50, 718.26), Quadratic8@P3, (591.22, 708.60) ], 1
STROKEWIDTH Polygon7, "0"
OPACITY Polygon7, "1"
FILL Polygon7, "#3c3939"
POLY Polygon8, $styles.default, [ Polygon7@P15, Polygon7@P9, Polygon7@P7, Polygon7@P13, Polygon7@P15 ], 1
POLY Polygon10, $styles.default, [ Polygon7@P15, Polygon7@P9, Polygon7@P13, Polygon7@P15 ], 1
LINEPP Line1,$styles.default,(573.27, 466.97),(537.37, 595.38)
LINEPP Line2,$styles.default,(552.56, 497.35),(537.37, 642.32)
LINEPP Line3,$styles.default,Quadratic3@P3,(538.75, 616.09)
OPACITY Polygon2, "1"
STROKEWIDTH Polygon2, "0"
FILL Polygon2, "#030303"`;
    }


    async loadCode(): Promise<Array<string>> {

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

    async loadData(): Promise<Array<DataField>> {
        return [
            { name: "f1", value: [10, 20, 30, 40] },
            { name: "f2", value: 5 }
        ]
    }

}