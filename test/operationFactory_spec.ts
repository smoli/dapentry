import {describe, it} from "mocha";
import {expect} from "chai"
import {OperationFactory} from "../src/interpreter/OperationFactory";
import {Debug} from "../src/interpreter/operations/Debug";
import {Operation} from "../src/interpreter/Operation";


describe('Operation Factory', () => {

    class Test extends Operation {

    }

    it('can be given Operation classes that it will instantiate', () => {
        const f = new OperationFactory();

        f.addOperationClass("DEBUG", Debug);
        f.addOperationClass("THING", Test);

        const op1 = f.create("DEBUG");
        const op2 = f.create("THING");

        expect(op1 instanceof Debug).to.be.true;
        expect(op2 instanceof Test).to.be.true;
    });

    it('Throws an exception if the opcode is unknown', () => {
        const f = new OperationFactory();

        f.addOperationClass("DEBUG", Debug);
        f.addOperationClass("THING", Test);

        expect(() => {
            f.create("OTHER");
        }).to.throw();
    });
});