import {AppConfig} from "../core/AppConfig";
import {LibraryEntry} from "../core/Library";
import {AspectRatio} from "../geometry/GrCanvas";
import {UserInfo} from "../state/modules/Authentication";


export enum ResponseStatus {
    OK = 200,
    UNAUTHORISED = 401,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}

export type FetchFunc = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface APIResponse {
    status: ResponseStatus,
    data: any,
    apiReachable: boolean
}

export class API {
    private static _fetch: FetchFunc;
    private static _authInfo: { token: string, user: UserInfo };

    static setFetch(value: FetchFunc) {
        API._fetch = value;
    }

    static get fetch(): FetchFunc {
        if (!API._fetch) {
            return window.fetch.bind(window);
        }
        return API._fetch
    }


    static setAuthInfo(auth: { token: string, user: UserInfo }) {
        API._authInfo = auth;
    }

    protected static authHeader(): { Authorization: string } {
        return {
            Authorization: `Bearer ${API._authInfo?.token}`
        }
    }

    static async makeResponse(response: Response, getData: () => Promise<any>): Promise<APIResponse> {

        if (response.status !== ResponseStatus.OK) {
            return {
                apiReachable: response.status !== 500,
                data: await response.json(),
                status: response.status
            }
        }

        const data = await getData();

        return {
            apiReachable: true,
            data,
            status: response.status
        }
    }

    static async doesNameExist(name: string): Promise<APIResponse> {

        const response = await API.fetch(AppConfig.API.names + "/" + name, {
            headers: {
                "Accept": "application/json",
                ...API.authHeader()
            }
        });

        // @ts-ignore
        return API.makeResponse(response,
            async () => {
                const d = await response.json();
                return d.length === 1;
            })
    }

    static async postNewLibraryEntry(data) {
        const response = await API.fetch(AppConfig.API.library, {
            method: "POST",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...API.authHeader()

            },
            body: JSON.stringify(data)
        });

        return API.makeResponse(response, async () => {
            return null;
        })
    }

    static convertAPILibraryEntry(data: any): LibraryEntry {
        const convert = v => {
            let p;

            try {
                p = JSON.parse(v);
            } catch(e) {
                p = v;
            }

            if (Array.isArray(p)) {
                return p.map(v => convert(v));
            }

            const n = Number(p);

            if (isNaN(n)) {
                return v;
            }

            return n;
        }

        const res = {
            ...data,
            aspectRatio: AspectRatio[data.aspect],
            arguments: data.arguments.filter(a => !!a.public).map(arg => {
                return {
                    ...arg,
                    default: convert(arg.default),

                }
            }),
            fields: data.arguments.filter(a => !a.public).map(arg => {
                return {
                    ...arg,
                    default: convert(arg.default),
                }
            })
        }

        delete res.aspect;

        return res;
    }

    static async getLibraryEntries(): Promise<APIResponse> {
        const response = await API.fetch(`${AppConfig.API.library}`, {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "application/json",
                ...API.authHeader()
            }
        });

        return API.makeResponse(response, async () => {
            const r = await response.json() as Array<any>;
            return r.map(r => API.convertAPILibraryEntry(r))
        });
    }

    static async login(email: string, password: string) {
        const response = await API.fetch(AppConfig.API.login, {
            method: "POST",
            mode: "cors",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        return API.makeResponse(response, async () => {
            const r = await response.json();
            return { success: r.success, token: r.data.token }
        });
    }

}

