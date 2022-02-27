import {AppConfig} from "../core/AppConfig";


export type FetchFunc = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface APIResponse {
    status: number,
    data: any,
    apiReachable: boolean
}

export class API {
    private static _fetch: FetchFunc;

    static setFetch(value:FetchFunc) {
        API._fetch = value;
    }

    static get fetch():FetchFunc {
        if (!API._fetch) {
            return window.fetch.bind(window);
        }
        return API._fetch
    }

    static async makeResponse(response: Response, getData: () => Promise<any>): Promise<APIResponse> {

        if (response.status !== 200) {
            return {
                apiReachable: response.status !== 500,
                data: undefined,
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
                "Accept": "application/json"
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
        const response = await fetch(AppConfig.API.library, {
            method: "POST",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return API.makeResponse(response, async () => {
            return null;
        })
    }

    static async getLibraryEntries():Promise<APIResponse> {
        const response = await fetch(`${AppConfig.API.library}`, {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "application/json"
            }
        });

        return API.makeResponse(response, async () => response.json());
    }

}

