import {describe, it} from "mocha";
import {expect} from "chai"
import {OperationFactory} from "../../src/runtime/interpreter/OperationFactory";
import {Log} from "../../src/runtime/interpreter/operations/Log";
import {Operation} from "../../src/runtime/interpreter/Operation";


describe('Operation Factory', () => {

    class Test extends Operation {

    }

    it('can be given Operation classes that it will instantiate', () => {
        const f = new OperationFactory();

        f.addOperationClass("DEBUG", Log);
        f.addOperationClass("THING", Test);

        const op1 = f.create("DEBUG");
        const op2 = f.create("THING");

        expect(op1 instanceof Log).to.be.true;
        expect(op2 instanceof Test).to.be.true;
    });

    it('Throws an exception if the opcode is unknown', () => {
        const f = new OperationFactory();

        f.addOperationClass("DEBUG", Log);
        f.addOperationClass("THING", Test);

        expect(() => {
            f.create("OTHER");
        }).to.throw();
    });
});