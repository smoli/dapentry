import {describe, it} from "mocha";
import {expect} from "chai"

import {RegisterStore} from "../../src/runtime/interpreter/RegisterStore";

describe('Register store',  ()  => {

    it('can store arbitrary values to a name', () => {

        const rs = new RegisterStore();

        rs.setRegister("test1", "TestValue");
        rs.setRegister("test2", 1234);
        rs.setRegister("test3", { a: 12});

        expect(rs.getRegister("test1")).to.equal("TestValue");
        expect(rs.getRegister("test2")).to.equal(1234);
        expect(rs.getRegister("test3")).to.deep.equal({a: 12 })
    });
});
