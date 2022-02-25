import {describe, it} from "mocha";
import {expect} from "chai"
import {API} from "../src/api/API";
// @ts-ignore
import {Response} from "node-fetch";
import {mockFetch} from "./testHelpers/mock_fetch";


describe("API", () => {
    it('determine if a name exists', async () => {

        API.setFetch(mockFetch(200, [{ name: "C"}]));
        let r = await API.doesNameExist("C");
        expect(r).to.deep.equal({
            apiReachable: true,
            data: true,
            status: 200
        });

        API.setFetch(mockFetch(200, []));
        r = await API.doesNameExist("D");
        expect(r).to.deep.equal({
            apiReachable: true,
            data: false,
            status: 200
        });
    });
})