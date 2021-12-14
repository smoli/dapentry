import {describe, it} from "mocha";
import {expect} from "chai"
import {Parser, TokenTypes} from "../../src/interpreter/Parser";

describe('Parser', () => {

    it('turns a line of code into tokens', () => {
        const code = `FAKE r1 123`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            { type: TokenTypes.OPCODE, value: "FAKE" },
            { type: TokenTypes.REGISTER, value: "r1" },
            { type: TokenTypes.NUMBER, value: 123 }
            ]);

    });

    it('can parse code lines', () => {

        const code = `FAKE r1    "Hello World"      lkjh 123 "   KLJH123"`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            { type: TokenTypes.OPCODE, value: "FAKE" },
            { type: TokenTypes.REGISTER, value: "r1" },
            { type: TokenTypes.STRING, value: "Hello World" },
            { type: TokenTypes.REGISTER, value: "lkjh" },
            { type: TokenTypes.NUMBER, value: 123 },
            { type: TokenTypes.STRING, value: "   KLJH123" }
        ]);
    });

    it('will return no tokens for an empty code', () => {
        expect(Parser.parseLine("")).to.deep.equal([])
        expect(Parser.parseLine("                     ")).to.deep.equal([])
    });

    it('will ignore all characters after #, except in strings', () => {
        const tokens = Parser.parseLine(`SOME thing "With a # string" 123 # Comments go here`);

        expect(tokens).to.deep.equal([
            { type: TokenTypes.OPCODE, value: "SOME" },
            { type: TokenTypes.REGISTER, value: "thing" },
            { type: TokenTypes.STRING, value: "With a # string" },
            { type: TokenTypes.NUMBER, value: 123 }
        ]);

        expect(Parser.parseLine("# Comment with no code before")).to.deep.equal([])
    })

    it('parses labels as label tokens', () => {
        let tokens = Parser.parseLine('LABEL:');

        expect(tokens).to.deep.equal([
            { type: TokenTypes.LABEL, value: "LABEL"}
        ]);

        expect(() => {
            Parser.parseLine('FAKE LABEL:');
        }).to.throw;

        expect(() => {
            Parser.parseLine('LABEL: r1 299 "lkjh"');
        }).to.throw;

        tokens = Parser.parseLine('FAKE "SOME:THING"');

        expect(tokens).to.deep.equal([
            { type: TokenTypes.OPCODE, value: "FAKE"},
            { type: TokenTypes.STRING, value: "SOME:THING"}
        ]);

    });
});