const fetch = require("node-fetch");
const {AppConfig} = require("../src/core/AppConfig");
const {API, ResponseStatus} = require("../src/api/API");
const {expect} = require("chai");

describe("Calling API @" + AppConfig.API.baseUrl,  () => {
    it('it can login', async () => {
        API.setFetch(fetch);

        const r = await API.login("test@test.de", "1234")

        expect(r.data.success).to.be.true;
        expect(r.data.token).to.be.ok;
        expect(r.status).to.equal(ResponseStatus.OK);

    });

    it('it will gracefully report on logon failure ', async () => {
        API.setFetch(fetch);

        const r = await API.login("test@test.de", "sdf1234")
        console.log(r);
        expect(r.status).to.equal(ResponseStatus.UNAUTHORISED);

    });
})