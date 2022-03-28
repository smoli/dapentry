import {describe, it} from "mocha";
import {expect} from "chai"
import {Parser, TokenTypes, Token, sameToken} from "../../src/runtime/interpreter/Parser";
import {
    T_ANNOTATION, T_ARRAY,
    T_EXPRESSION,
    T_LABEL, T_MATHFUNC, T_NAME,
    T_NUMBER,
    T_OPCODE,
    T_OPERATOR, T_POINT_NN,
    T_REGISTER,
    T_STRING
} from "../testHelpers/tokens";


describe('Parser', () => {

    it('turns a line of code into tokens', () => {
        const code = `FAKE r1, 123`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            T_OPCODE("FAKE"),
            T_REGISTER("r1"),
            T_NUMBER(123)
        ]);

    });

    it('can parse code lines', () => {

        const code = `FAKE r1,    "Hello World"   ,   lkjh, 123, "   ,KLJH123"`;

        const tokens = Parser.parseLine(code);

        expect(tokens).to.deep.equal([
            T_OPCODE("FAKE"),
            T_REGISTER("r1"),
            T_STRING("Hello World"),
            T_REGISTER("lkjh"),
            T_NUMBER(123),
            T_STRING("   ,KLJH123")

        ]);
    });

    it('will return no tokens for an empty code', () => {
        expect(Parser.parseLine("")).to.deep.equal([])
        expect(Parser.parseLine("       \n\n\n\t\t\n\r       ")).to.deep.equal([])
    });

    it('will ignore all characters after #, except in strings', () => {
        const tokens = Parser.parseLine(`SOME thing, "With a # string", 123 # Comments go here`);

        expect(tokens).to.deep.equal([
            T_OPCODE("SOME"),
            T_REGISTER("thing"),
            T_STRING("With a # string"),
            T_NUMBER(123)
        ]);

        expect(Parser.parseLine("# Comment with no code before")).to.deep.equal([])
    })

    it('parses labels as label tokens', () => {
        let tokens = Parser.parseLine('LABEL:');

        expect(tokens).to.deep.equal([
            T_LABEL("LABEL")
        ]);

        expect(() => {
            Parser.parseLine('FAKE LABEL:');
        }).to.throw;

        expect(() => {
            Parser.parseLine('LABEL: r1 299 "lk#sdf:jh"');
        }).to.throw;

        tokens = Parser.parseLine('FAKE "SOME:THING"');

        expect(tokens).to.deep.equal([
            T_OPCODE("FAKE"),
            T_STRING("SOME:THING")
        ]);

    });

    it('parses points', () => {
        let tokens = Parser.parseLine('LOAD r1, ( 100, 200 )');

        expect(tokens).to.deep.equal([
            T_OPCODE("LOAD"),
            T_REGISTER("r1"),
            T_POINT_NN(100, 200)
        ]);

        tokens = Parser.parseLine('LOAD r1, "A string with ( smack in ) the middle of it"');
        expect(tokens).to.deep.equal([
            T_OPCODE("LOAD"),
            T_REGISTER("r1"),
            T_STRING("A string with ( smack in ) the middle of it"),
        ]);

        expect(() => Parser.parseLine("( 100 )"))
            .to.throw;
        expect(() => Parser.parseLine("()"))
            .to.throw;
        expect(() => Parser.parseLine("( 100, 200 ("))
            .to.throw;
        expect(() => Parser.parseLine("( 100, 200"))
            .to.throw;
        expect(() => Parser.parseLine("100 ) 100, 200"))
            .to.throw;
    });

    it("parses annotations for statements", () => {
        let tokens = Parser.parseLine("LOAD r1, 23 @A1 @A2");

        expect(tokens).to.deep.equal(
            [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_NUMBER(23),
                T_ANNOTATION("A1"),
                T_ANNOTATION("A2")
            ]
        );

        tokens = Parser.parseLine("@A1 @A2");

        expect(tokens).to.deep.equal(
            [
                T_ANNOTATION("A1"),
                T_ANNOTATION("A2")
            ]
        );
    })
    it("parses annotations with arguments", () => {
        let tokens = Parser.parseLine("LOAD r1, 23 @A1 a b @A2 ced def");

        expect(tokens).to.deep.equal(
            [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_NUMBER(23),
                T_ANNOTATION("A1", "a", "b"),
                T_ANNOTATION("A2", "ced", "def")
            ]
        );

        tokens = Parser.parseLine("@A1 a b @A2 ced def");

        expect(tokens).to.deep.equal(
            [
                T_ANNOTATION("A1", "a", "b"),
                T_ANNOTATION("A2", "ced", "def")
            ]
        );


    });

    describe("given a list of tokens", () => {

        it("can construct the proper code line", () => {

            let tokens: Array<Token> = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_REGISTER("r2")
            ]

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, r2");

            tokens = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_REGISTER("r2"),
                T_ANNOTATION("HIDE")
            ]

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, r2 @HIDE");

            tokens = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                {
                    type: TokenTypes.POINT, value: [
                        T_NUMBER("1"),
                        T_REGISTER("r1")
                    ]
                },
            ]

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, (1, r1)");

            tokens = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                {
                    type: TokenTypes.ARRAY, value: [
                        T_NUMBER("1"),
                        T_REGISTER("r1"),
                        T_REGISTER("r3")
                    ]
                },
            ]

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, [1, r1, r3]");


            tokens = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_EXPRESSION(T_NUMBER(2), "+",
                    T_EXPRESSION(T_REGISTER("r1"), "*", T_NUMBER(2))
                )
            ];

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, (2 + (r1 * 2))");

            tokens = [
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_EXPRESSION(
                    T_EXPRESSION(T_NUMBER(2), "+", T_REGISTER("r1")),
                    "*", T_NUMBER(2))

            ];

            expect(Parser.constructCodeLine(tokens)).to.equal("LOAD r1, ((2 + r1) * 2)");
        });

        it("can parse what it constructs", () => {
            const code = 'LOAD r1, r2@(a * b)'
            const tokens = Parser.parseLine(code);
            const code2 = Parser.constructCodeLine(tokens);
            console.log(code2)
            expect(Parser.parseLine(code2)).to.deep.equal(tokens);
        });
    });

    describe("Parsing expressions", () => {
        it("parses expressions", () => {

            const code = `LOAD r1, (r1 + 2 * (34 * r3))`;

            const tokens = Parser.parseLine(code);

            expect(tokens).to.deep.equal([
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_EXPRESSION(T_REGISTER("r1"), "+",
                    T_EXPRESSION(T_NUMBER(2), "*",
                        T_EXPRESSION(T_NUMBER(34), "*", T_REGISTER("r3")))
                )
            ])
        });
        it("can parse a string as an expression", () => {

            const code = "max(r1) + 234 * 23";

            const tokens = Parser.parseExpression(code);

            expect(tokens).to.deep.equal(
                T_EXPRESSION(
                    T_MATHFUNC("max", T_REGISTER("r1")),
                    "+",
                    T_EXPRESSION(
                        T_NUMBER(234),
                        "*",
                        T_NUMBER(23)
                    )
                )
            );
        });

        it("parses a single number as well", () => {
            const code = "234";

            const tokens = Parser.parseExpression(code);

            expect(tokens).to.deep.equal(
                        T_NUMBER(234)
            );
        });

        it("parses a single register as well", () => {
            const code = "r1";

            const tokens = Parser.parseExpression(code);

            expect(tokens).to.deep.equal(
                        T_REGISTER("r1")
            );
        });
    });

    it("provides a function for token comparison", () => {

        const t = T_REGISTER("df");
        expect(sameToken(t, t)).to.be.true;

        expect(sameToken(T_REGISTER("d"), T_REGISTER("d"))).to.be.true;
        expect(sameToken(T_REGISTER("d"), T_REGISTER("e"))).to.be.false;
        expect(sameToken(T_REGISTER("d"), T_NAME("d"))).to.be.false;

        expect(sameToken(T_ARRAY(T_NUMBER(1), T_NUMBER(2)), T_ARRAY(T_NUMBER(1), T_NUMBER(2)))).to.be.true;


    });
});