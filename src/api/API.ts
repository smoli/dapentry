import {AppConfig} from "../core/AppConfig";
import {LibraryEntry} from "../core/Library";
import {AspectRatio} from "../geometry/GrCanvas";
import {UserInfo} from "../state/modules/Authentication";
import {POI} from "../geometry/GrObject";
import App from "../../ui5stuff/controller/App.controller";


export enum ResponseStatus {
    OK = 200,
    UNAUTHORISED = 401,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}

export type FetchFunc = (input: RequestInfo, init?: RequestInit) => Promise<Response>;


export interface RegisterResultData {
    name: string,
    email: string
}

export interface UserResultData {
    name: string,
    email: string,
    verified: boolean
}

export interface APIResponse<T> {
    status: ResponseStatus,
    data: T,
    apiReachable: boolean
}

export class API {
    private static _fetch: FetchFunc;
    private static _authInfo: string;

    static setFetch(value: FetchFunc) {
        API._fetch = value;
    }

    static get fetch(): FetchFunc {
        if (!API._fetch) {
            return window.fetch.bind(window);
        }
        return API._fetch
    }


    static setAuthInfo(token: string) {
        API._authInfo = token;
    }

    protected static authHeader(): { Authorization: string } {
        return {
            Authorization: `Bearer ${API._authInfo}`
        }
    }

    protected static unauthenticatedRequest(method: string, contentType: string = "application/json"): any {
        return {
            method,
            mode: "cors",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json'
            }
        }
    }

    protected static unauthenticatedPOST(contentType: string = "application/json"): any {
        return API.unauthenticatedRequest("POST", contentType);
    }

    protected static unauthenticatedGET(contentType: string = "application/json"): any {
        return API.unauthenticatedRequest("GET", contentType);
    }

    protected static authenticatedRequest(method: string, contentType: string = "application/json"): any {
        return {
            method,
            mode: "cors",
            headers: {
                Accept: "application/json",
                'Content-Type': 'application/json',
                ...API.authHeader()
            }
        }
    }

    protected static authenticatedPOST(contentType: string = "application/json"): any {
        return this.authenticatedRequest("POST", contentType);
    }

    protected static authenticatedGET(contentType: string = "application/json"): any {
        return this.authenticatedRequest("GET", contentType);
    }

    static async makeResponse(response: Response, getData: () => Promise<any>): Promise<APIResponse<any>> {

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

    static async doesNameExist(name: string): Promise<APIResponse<any>> {

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
            } catch (e) {
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

    static async getLibraryEntries(): Promise<APIResponse<any>> {
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

    static async register(
        name: string,
        email: string,
        password: string,
        confirm_password: string): Promise<APIResponse<RegisterResultData>> {

        const response = await API.fetch(AppConfig.API.register, {
            ...API.unauthenticatedPOST(),
            body: JSON.stringify({ name, email, password, confirm_password })
        });

        return API.makeResponse(response, async () => {
            const r = await response.json();
            return { email: r.email, name: r.name }
        });
    }


    static async getUser():Promise<APIResponse<UserResultData>> {
        const response = await API.fetch(AppConfig.API.user, {
            ...API.authenticatedGET()
        });

        return API.makeResponse(response, async () => {
            const r = await response.json();
            console.log(r);
            return { name: r.name, email: r.email, verified: r.email_verified_at }
        })
    }
}

