import {describe, it} from "mocha";
import {expect} from "chai"
import {Parser, TokenTypes} from "../src/Parser";

describe('Parser', () => {

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
});