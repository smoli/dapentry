import {describe, it} from "mocha";
import {expect} from "chai"
import {Interpreter} from "../../src/interpreter/Interpreter";
import {Operation} from "../../src/interpreter/Operation";
import {Parameter} from "../../src/interpreter/Parameter";

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

    it('lets some operations re execute', async () => {

        const code = `
            LOAD r1 100
            TESTOP r2 r1        
        `;

        const i = new Interpreter();
        i.addOperation("TESTOP", MakeTestOperation(() => {
        }))
        i.parse(code);
        i.run()
            .then(() => {
                expect(i.getRegister("r2")).to.equal(100);
                i.setRegister("r1", 200);
                expect(i.getRegister("r2")).to.equal(200);
            });

    });

    it('lets some operations re execute', async () => {

        const code = `
            LOAD r1 100
            TESTOP r2 r1
            PUSHSF
            DEC r1
            TESTOP r3 r1
            POPSF        
        `;

        const i = new Interpreter();

        let r3Value = null;

        i.addOperation("TESTOP", MakeTestOperation(value => {
            r3Value = value;
        }));

        i.parse(code);

        await i.run();
        expect(i.getRegister("r2")).to.equal(100);

        await i.setRegister("r1", 200);

        expect(i.getRegister("r1")).to.equal(200);
        expect(i.getRegister("r2")).to.equal(200);
        expect(r3Value).to.equal(199);

    });


});