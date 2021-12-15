import {describe, it} from "mocha";
import {expect} from "chai"
const sinon = require("sinon")

import {Interpreter} from "../../src/interpreter/Interpreter";

describe('Interpreter', () => {

    it('can run a simple program', () => {
        const code = `
        
        
            LOG "Hello World"
            
            
            
        `;

        const log = sinon.spy(console, "log")

        const i = new Interpreter();
        i.parse(code);
        i.run();

        expect(log.args[0][0]).to.equal('Hello World')
    });

    after(() => {
        // @ts-ignore
        console.log.restore();
    })
});