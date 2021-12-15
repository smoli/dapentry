import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/interpreter/Interpreter";
import {Operation} from "../../src/interpreter/Operation";
import {Parameter} from "../../src/interpreter/Parameter";

const {performance} = require('perf_hooks');

class TestOperation extends Operation {

    protected _target: Parameter;
    protected _source: Parameter;

    constructor(opcode: string, target: Parameter, source: Parameter) {
        super(opcode, target, source);
        this._target = target;
        this._source = source;
    }

    async execute(interpreter: Interpreter): Promise<any> {
        this._target.value = this._source.value;
    }

    async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
        if (changedRegisterName === this._source.name) {
            this._target.value = this._source.value;

        }
    }
}

function MakeTestOperation(handler) {

    return class LTestOperation extends TestOperation {

        async update(changedRegisterName: string, interpreter: Interpreter): Promise<any> {
            await super.update(changedRegisterName, interpreter);
            handler(this._target.value)
        }
    }
}


describe('Updating after execution', () => {

    it('lets some operations re execute (1)', async () => {

        const code = `
            LOAD r1 100
            TESTOP r2 r1        
        `;

        const i = new Interpreter();
        i.addOperation("TESTOP", TestOperation)
        i.parse(code);
        await i.run();
        expect(i.getRegister("r2")).to.equal(100, "r2");

        await i.updateRegister("r1", 200);
        expect(i.getRegister("r2")).to.equal(200, "r2 after update of r1");
    });


    it('lets some operations re execute (2)', async () => {

        const code = `
            LOAD r1 100
            TESTOP1 r2 r1
            PUSHSF
            DEC r1
            TESTOP2 r3 r1
            POPSF        
        `;

        const i = new Interpreter();

        let r3Value = null;

        i.addOperation("TESTOP1", TestOperation)
        i.addOperation("TESTOP2", MakeTestOperation(value => {
            r3Value = value;
        }));

        i.parse(code);

        await i.run();
        expect(i.getRegister("r2")).to.equal(100);

        await i.updateRegister("r1", 200);

        expect(i.getRegister("r1")).to.equal(200);
        expect(i.getRegister("r2")).to.equal(200);
        expect(r3Value).to.equal(199);

    });


    it('lets some operations re execute (3)', async () => {

        const code = `
            LOAD r1 100
            PUSHSF
            LOAD it 1000
          LOOP:
            DEC it
            ADD r1 r1 10
            TESTOP r3 r1
            JNZ it LOOP                           
            POPSF
        `;

        const i = new Interpreter();

        let r3Value = null;
        let callCount = 0

        i.addOperation("TESTOP", MakeTestOperation(value => {
            r3Value = value;
            callCount++;
        }));

        const start = performance.now();
        i.parse(code);
        await i.run();
        const middle = performance.now();
        await i.updateRegister("r1", 200);
        const end = performance.now();

        console.log("Initial run:", middle - start, "Update:", end - middle);

        expect(i.getRegister("r1")).to.equal(200, "r1");
        expect(r3Value).to.equal(10200, "r3Value");
        expect(callCount).to.equal(1000, "callCount");


    });

    it('lets some operations re execute (3)', async () => {

        const code = `
            LOAD r1 100
            PUSHSF
            LOAD it 1000
          LOOP:
            DEC it
            ADD r1 r1 10
            TESTOP r3 r1
            JNZ it LOOP                           
            POPSF
        `;

        const i = new Interpreter();

        let r3Value = null;
        let callCount = 0

        i.addOperation("TESTOP", MakeTestOperation(value => {
            r3Value = value;
            callCount++;
        }));

        const start = performance.now();
        i.parse(code);
        await i.run();
        const middle = performance.now();
        await i.updateRegister("r1", 200);
        const end = performance.now();

        console.log("Initial run:", middle - start, "Update:", end - middle);

        expect(i.getRegister("r1")).to.equal(200, "r1");
        expect(r3Value).to.equal(10200, "r3Value");
        expect(callCount).to.equal(1000, "callCount");
    });
});