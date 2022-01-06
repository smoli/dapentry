import {describe, it} from "mocha";
import {expect} from "chai"
import {Parser, TokenTypes} from "../../src/runtime/interpreter/Parser";

describe('Parser', () => {

    it('turns a line of code into tokens', () => {
        const code = `FAKE r1 123`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "FAKE"},
            {type: TokenTypes.REGISTER, value: "r1"},
            {type: TokenTypes.NUMBER, value: 123}
        ]);

    });

    it('can parse code lines', () => {

        const code = `FAKE r1    "Hello World"      lkjh 123 "   KLJH123"`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "FAKE"},
            {type: TokenTypes.REGISTER, value: "r1"},
            {type: TokenTypes.STRING, value: "Hello World"},
            {type: TokenTypes.REGISTER, value: "lkjh"},
            {type: TokenTypes.NUMBER, value: 123},
            {type: TokenTypes.STRING, value: "   KLJH123"}
        ]);
    });

    it('will return no tokens for an empty code', () => {
        expect(Parser.parseLine("")).to.deep.equal([])
        expect(Parser.parseLine("       \n\n\n\t\t\n\r       ")).to.deep.equal([])
    });

    it('will ignore all characters after #, except in strings', () => {
        const tokens = Parser.parseLine(`SOME thing "With a # string" 123 # Comments go here`);

        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "SOME"},
            {type: TokenTypes.REGISTER, value: "thing"},
            {type: TokenTypes.STRING, value: "With a # string"},
            {type: TokenTypes.NUMBER, value: 123}
        ]);

        expect(Parser.parseLine("# Comment with no code before")).to.deep.equal([])
    })

    it('parses labels as label tokens', () => {
        let tokens = Parser.parseLine('LABEL:');

        expect(tokens).to.deep.equal([
            {type: TokenTypes.LABEL, value: "LABEL"}
        ]);

        expect(() => {
            Parser.parseLine('FAKE LABEL:');
        }).to.throw;

        expect(() => {
            Parser.parseLine('LABEL: r1 299 "lk#sdf:jh"');
        }).to.throw;

        tokens = Parser.parseLine('FAKE "SOME:THING"');

        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "FAKE"},
            {type: TokenTypes.STRING, value: "SOME:THING"}
        ]);

    });

    it('parses points', () => {
        let tokens = Parser.parseLine('LOAD r1 ( 100 200 )');

        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "LOAD"},
            {type: TokenTypes.REGISTER, value: "r1"},
            {
                type: TokenTypes.POINT, value: [
                    {type: TokenTypes.NUMBER, value: 100},
                    {type: TokenTypes.NUMBER, value: 200},
                ]
            }
        ]);

        tokens = Parser.parseLine('LOAD r1 "A string with ( smack in ) the middle of it"');
        expect(tokens).to.deep.equal([
            {type: TokenTypes.OPCODE, value: "LOAD"},
            {type: TokenTypes.REGISTER, value: "r1"},
            {type: TokenTypes.STRING, value: "A string with ( smack in ) the middle of it"},
        ]);

        expect(() => Parser.parseLine("( 100 )"))
            .to.throw;
        expect(() => Parser.parseLine("()"))
            .to.throw;
        expect(() => Parser.parseLine("( 100 200 ("))
            .to.throw;
        expect(() => Parser.parseLine("( 100 200"))
            .to.throw;
        expect(() => Parser.parseLine("100 ) 100 200"))
            .to.throw;
    });

    it("parses annotations for statements", () => {
        let tokens = Parser.parseLine("LOAD r1 23 @A1 @A2");

        expect(tokens).to.deep.equal(
            [
                {type: TokenTypes.OPCODE, value: "LOAD"},
                {type: TokenTypes.REGISTER, value: "r1"},
                {type: TokenTypes.NUMBER, value: 23},
                {type: TokenTypes.ANNOTATION, value: "A1"},
                {type: TokenTypes.ANNOTATION, value: "A2"}
            ]
        );

        tokens = Parser.parseLine("@A1 @A2");

        expect(tokens).to.deep.equal(
            [
                {type: TokenTypes.ANNOTATION, value: "A1"},
                {type: TokenTypes.ANNOTATION, value: "A2"}
            ]
        );


    })
});