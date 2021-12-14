import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../../src/interpreter/Interpreter";

const sinon = require("sinon");

describe('Debug', () => {

    it('Writes to console', async () => {
        const program = `
            DEBUG "Hello World"
        `;


        const log = sinon.spy(console, "log")

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(log.args[0][0]).to.equal('Hello World')

    });

    it("Updates when debug.runtime is updated", async () => {
        const program = `
            DEBUG "Hello World"            
        `;


        const log = sinon.spy(console, "log")

        const i = new Interpreter();
        i.parse(program);
        await i.run();

        expect(log.args[0][0]).to.equal('Hello World');

        i.setRegister("debug.runtime", "UPDATED")
        expect(log.args[1][0]).to.equal('UPDATED');
    });

    afterEach(() => {
        // @ts-ignore
        console.log.restore();
    })
});
