import {FetchFunc} from "../../src/api/API";
// @ts-ignore
import {Response} from "node-fetch";

export function mockFetch(status: number, body: any): FetchFunc {
    const f = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const r = new Response(JSON.stringify(body), {
            status
        });

        return r;
    };

    // @ts-ignore
    return f as FetchFunc;
}