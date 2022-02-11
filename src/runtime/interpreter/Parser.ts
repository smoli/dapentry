import {TokenTypes} from "./TokenTypes";

export {TokenTypes} from "./TokenTypes";

export interface Token {
    type: TokenTypes,
    value: number | string | Array<any>
    args?: Array<string>
}

export class Parser {

    public static parseLine(line, index?: number):Array<Token> {

        if (!line.trim()) {
            return [];
        }

        try {
            const r = peg$parse(line.trim(), {}) || [];
            return r;
        } catch (e) {
            console.log(`SYNTAX ERROR IN LINE ${index}: `, line.trim());
            console.log(e.message);
            throw e;
        }
    }

    public static constructCodeLine(tokens:Array<Token>):string {
        let sep = " "

        const construct = (token, newSep = ", ") => {
            let oldSep = sep;

            switch (token.type) {
                case TokenTypes.OPCODE:
                case TokenTypes.FUNCDECL:
                    return token.value

                case TokenTypes.OPERATOR:
                case TokenTypes.NUMBER:
                case TokenTypes.REGISTER:
                        sep = newSep;
                        return oldSep + token.value;

                case TokenTypes.STRING:
                        sep = newSep;
                        return oldSep + `"${token.value}"`;

                case TokenTypes.NONLOCALREGISTER:
                        sep = newSep;
                        return oldSep + "^" + token.value;

                case TokenTypes.REGISTERAT:
                        sep = newSep;
                        return oldSep + token.value[0].value + "@" + token.value[1].value;

                case TokenTypes.POINT:
                        sep = ""
                        const p = oldSep + "( " + construct(token.value[0]) + construct(token.value[1]) + " )";
                        sep = newSep;
                        return p;

                case TokenTypes.ARRAY:
                        sep = ""
                        const a = oldSep + "[ " + token.value.map(v => construct(v)).join("") + " ]";
                        return a;

                case TokenTypes.EXPRESSION:
                        sep = ""
                        const re =  oldSep + "( " + construct(token.value[0], "")
                            + " " + construct(token.value[1], "")
                            + " " + construct(token.value[2], "") + " )"
                        sep = newSep;
                        return re;

                case TokenTypes.ANNOTATION:
                        let r =  " @" + token.value;
                        if (token.args && token.args.length) {
                            r += " " + token.args.join(" ");
                        }

                        return r;
            }
        }

        return [...tokens.map(t => construct(t))].join("");
    }
}


function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
    }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
                escapedParts += expectation.parts[i] instanceof Array
                    ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                    : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
            return "any character";
        },

        end: function(expectation) {
            return "end of input";
        },

        other: function(expectation) {
            return expectation.description;
        }
    };

    function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
        return s
            .replace(/\\/g, '\\\\')
            .replace(/"/g,  '\\"')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
        return s
            .replace(/\\/g, '\\\\')
            .replace(/\]/g, '\\]')
            .replace(/\^/g, '\\^')
            .replace(/-/g,  '\\-')
            .replace(/\0/g, '\\0')
            .replace(/\t/g, '\\t')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
            .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
        var descriptions = new Array(expected.length),
            i, j;

        for (i = 0; i < expected.length; i++) {
            descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
            for (i = 1, j = 1; i < descriptions.length; i++) {
                if (descriptions[i - 1] !== descriptions[i]) {
                    descriptions[j] = descriptions[i];
                    j++;
                }
            }
            descriptions.length = j;
        }

        switch (descriptions.length) {
            case 1:
                return descriptions[0];

            case 2:
                return descriptions[0] + " or " + descriptions[1];

            default:
                return descriptions.slice(0, -1).join(", ")
                    + ", or "
                    + descriptions[descriptions.length - 1];
        }
    }

    function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { Expression: peg$parseExpression },
        peg$startRuleFunction  = peg$parseExpression,

        peg$c0 = peg$otherExpectation("Expression"),
        peg$c1 = function(exp) { return exp },
        peg$c2 = function(exp) { return [exp] },
        peg$c3 = function(exp, anno) {
            const r = []
            if (exp) r.push(...exp);
            if (anno) r.push(...anno);
            return r.filter(x => !!x);
        },
        peg$c4 = peg$otherExpectation("Function declatation"),
        peg$c5 = function(label, arg1, args) {
            label.type = TokenTypes.FUNCDECL;
            return [label, arg1, ...args.map(a => a[1])]
        },
        peg$c6 = function(head, tail) {
            const r = [head]
            if (tail.length)
                r.push(tail[0][1], tail[0][3])

            return flattenExp({ type: TokenTypes.EXPRESSION, value: r.filter(x => !!x) })
        },
        peg$c7 = "+",
        peg$c8 = peg$literalExpectation("+", false),
        peg$c9 = "-",
        peg$c10 = peg$literalExpectation("-", false),
        peg$c11 = function() {
            return { type: TokenTypes.OPERATOR, value: text() }
        },
        peg$c12 = "*",
        peg$c13 = peg$literalExpectation("*", false),
        peg$c14 = "/",
        peg$c15 = peg$literalExpectation("/", false),
        peg$c16 = "(",
        peg$c17 = peg$literalExpectation("(", false),
        peg$c18 = ")",
        peg$c19 = peg$literalExpectation(")", false),
        peg$c20 = function(expr) { return expr },
        peg$c21 = peg$otherExpectation("Operation"),
        peg$c22 = function(exp, arg1, args) {
            return [exp, arg1, ...args.map(a => a[1])]
        },
        peg$c23 = function(exp) { return [exp]; },
        peg$c24 = peg$otherExpectation("Argument or Tuple"),
        peg$c25 = function(aot) {
            return aot
        },
        peg$c26 = peg$otherExpectation("Argument"),
        peg$c27 = function(arg) {
            return arg
        },
        peg$c28 = peg$otherExpectation("RegisterPropertyAccess"),
        peg$c29 = "@",
        peg$c30 = peg$literalExpectation("@", false),
        peg$c31 = function(head, tail) {
            return { type: TokenTypes.REGISTERPROP, value: [head, tail]}
        },
        peg$c32 = peg$otherExpectation("PropName"),
        peg$c33 = function() { return { type: TokenTypes.NAME, value: text() } },
        peg$c34 = peg$otherExpectation("PropRegister"),
        peg$c35 = function(reg) { return { type: TokenTypes.REGISTER, value: reg }},
        peg$c36 = peg$otherExpectation("Register"),
        peg$c37 = "^",
        peg$c38 = peg$literalExpectation("^", false),
        peg$c39 = function(nonlocal, reg) {
            return {
                type: nonlocal? TokenTypes.NONLOCALREGISTER : TokenTypes.REGISTER,
                value: [...reg].join("")
            }
        },
        peg$c40 = peg$otherExpectation("Name"),
        peg$c41 = /^[$a-zA-Z]/,
        peg$c42 = peg$classExpectation(["$", ["a", "z"], ["A", "Z"]], false, false),
        peg$c43 = /^[a-zA-Z0-9.\-]/,
        peg$c44 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], ".", "-"], false, false),
        peg$c45 = /^[a-zA-Z0-9]/,
        peg$c46 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        peg$c47 = function() { return text() },
        peg$c48 = peg$otherExpectation("Annotations"),
        peg$c49 = function(first, rest) {
            return [first, ...flatten(rest)]
        },
        peg$c50 = peg$otherExpectation("Annotation"),
        peg$c51 = /^[a-zA-Z0-9\-.]/,
        peg$c52 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "-", "."], false, false),
        peg$c53 = function(anno, args) {
            let argList = []

            return {
                type: TokenTypes.ANNOTATION,
                value: anno.join(""),
                args: args
            };
        },
        peg$c54 = peg$otherExpectation("AnnotationArgs"),
        peg$c55 = function(rest) {
            return rest.map(r => r[1])
        },
        peg$c56 = peg$otherExpectation("AnnotationArg"),
        peg$c57 = function(a) {
            return a.join("")
        },
        peg$c58 = peg$otherExpectation("Comment"),
        peg$c59 = "#",
        peg$c60 = peg$literalExpectation("#", false),
        peg$c61 = peg$anyExpectation(),
        peg$c62 = function() {
            return null
        },
        peg$c63 = peg$otherExpectation("Number"),
        peg$c64 = /^[0-9]/,
        peg$c65 = peg$classExpectation([["0", "9"]], false, false),
        peg$c66 = ".",
        peg$c67 = peg$literalExpectation(".", false),
        peg$c68 = function(sign, num, dot) {
            /*let n = num.join("");
            if (dot) n += "." + dot[1].join("");
            if (sign) n = sign + n;*/
            return { type: TokenTypes.NUMBER, value: Number(text()) }
        },
        peg$c69 = peg$otherExpectation("String"),
        peg$c70 = "\"",
        peg$c71 = peg$literalExpectation("\"", false),
        peg$c72 = function(string) {
            return { type: TokenTypes.STRING, value: string.join("") }
        },
        peg$c73 = /^[^'"'\n]/,
        peg$c74 = peg$classExpectation(["'", "\"", "'", "\n"], true, false),
        peg$c75 = peg$otherExpectation("Tuple"),
        peg$c76 = function(first, args) {
            return { type: TokenTypes.POINT, value: [first, ...args.map(a => a[1])] }
        },
        peg$c77 = peg$otherExpectation("Array"),
        peg$c78 = "[",
        peg$c79 = peg$literalExpectation("[", false),
        peg$c80 = "]",
        peg$c81 = peg$literalExpectation("]", false),
        peg$c82 = function(first, args) {
            return { type: TokenTypes.ARRAY, value: [first, ...args.map(a => a[1])] }
        },
        peg$c83 = function() {
            return { type: TokenTypes.ARRAY, value: [] }
        },
        peg$c84 = peg$otherExpectation("Opcode"),
        peg$c85 = /^[A-Z]/,
        peg$c86 = peg$classExpectation([["A", "Z"]], false, false),
        peg$c87 = /^[A-Z0-9]/,
        peg$c88 = peg$classExpectation([["A", "Z"], ["0", "9"]], false, false),
        peg$c89 = function() {
            return { type: TokenTypes.OPCODE, value: text() }
        },
        peg$c90 = peg$otherExpectation("Label"),
        peg$c91 = ":",
        peg$c92 = peg$literalExpectation(":", false),
        peg$c93 = function(label) {
            return {
                type: TokenTypes.LABEL,
                value: label.join("")
            }
        },
        peg$c94 = peg$otherExpectation("separator"),
        peg$c95 = ",",
        peg$c96 = peg$literalExpectation(",", false),
        peg$c97 = function() { return null },
        peg$c98 = peg$otherExpectation("whitespace"),
        peg$c99 = /^[\t ]/,
        peg$c100 = peg$classExpectation(["\t", " "], false, false),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

        throw peg$buildStructuredError(
            [peg$otherExpectation(description)],
            input.substring(peg$savedPos, peg$currPos),
            location
        );
    }

    function error(message, location) {
        location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

        throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
        return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
        return { type: "any" };
    }

    function peg$endExpectation() {
        return { type: "end" };
    }

    function peg$otherExpectation(description) {
        return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos], p;

        if (details) {
            return details;
        } else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }

            details = peg$posDetailsCache[p];
            details = {
                line:   details.line,
                column: details.column
            };

            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                } else {
                    details.column++;
                }

                p++;
            }

            peg$posDetailsCache[pos] = details;
            return details;
        }
    }

    function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
            endPosDetails   = peg$computePosDetails(endPos);

        return {
            start: {
                offset: startPos,
                line:   startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line:   endPosDetails.line,
                column: endPosDetails.column
            }
        };
    }

    function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) { return; }

        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
        return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(
            peg$SyntaxError.buildMessage(expected, found),
            expected,
            found,
            location
        );
    }

    function peg$parseExpression() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseFuncDecl();
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c1(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseLabel();
            if (s1 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c2(s1);
            }
            s0 = s1;
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseOperation();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseComment();
                    if (s1 === peg$FAILED) {
                        s1 = peg$parseAnnotations();
                    }
                }
                if (s1 !== peg$FAILED) {
                    s2 = peg$parse_();
                    if (s2 !== peg$FAILED) {
                        s3 = peg$parseAnnotations();
                        if (s3 === peg$FAILED) {
                            s3 = null;
                        }
                        if (s3 !== peg$FAILED) {
                            s4 = peg$parse_();
                            if (s4 !== peg$FAILED) {
                                s5 = peg$parseComment();
                                if (s5 === peg$FAILED) {
                                    s5 = null;
                                }
                                if (s5 !== peg$FAILED) {
                                    peg$savedPos = s0;
                                    s1 = peg$c3(s1, s3);
                                    s0 = s1;
                                } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                }
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c0); }
        }

        return s0;
    }

    function peg$parseFuncDecl() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseLabel();
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseArgumentOrTuple();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseS();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseArgumentOrTuple();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseS();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseArgumentOrTuple();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c5(s1, s3, s4);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }

        return s0;
    }

    function peg$parseEval() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        s0 = peg$currPos;
        s1 = peg$parseTerm();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                s5 = peg$parseOP1();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseTerm();
                        if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseOP1();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseTerm();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1, s2);
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }

        return s0;
    }

    function peg$parseOP1() {
        var s0, s1;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 43) {
            s1 = peg$c7;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c9;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c11();
        }
        s0 = s1;

        return s0;
    }

    function peg$parseTerm() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        s0 = peg$currPos;
        s1 = peg$parseFactor();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                s5 = peg$parseOP2();
                if (s5 !== peg$FAILED) {
                    s6 = peg$parse_();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseFactor();
                        if (s7 !== peg$FAILED) {
                            s4 = [s4, s5, s6, s7];
                            s3 = s4;
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseOP2();
                    if (s5 !== peg$FAILED) {
                        s6 = peg$parse_();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseFactor();
                            if (s7 !== peg$FAILED) {
                                s4 = [s4, s5, s6, s7];
                                s3 = s4;
                            } else {
                                peg$currPos = s3;
                                s3 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s3;
                            s3 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c6(s1, s2);
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }

        return s0;
    }

    function peg$parseOP2() {
        var s0, s1;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 42) {
            s1 = peg$c12;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c13); }
        }
        if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 47) {
                s1 = peg$c14;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c15); }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c11();
        }
        s0 = s1;

        return s0;
    }

    function peg$parseFactor() {
        var s0, s1, s2, s3, s4, s5;

        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c16;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseEval();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parse_();
                    if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                            s5 = peg$c18;
                            peg$currPos++;
                        } else {
                            s5 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c19); }
                        }
                        if (s5 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c20(s3);
                            s0 = s1;
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$parseRegPropAccess();
            if (s0 === peg$FAILED) {
                s0 = peg$parseNumber();
                if (s0 === peg$FAILED) {
                    s0 = peg$parseRegister();
                }
            }
        }

        return s0;
    }

    function peg$parseOperation() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseOpcode();
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseArgumentOrTuple();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseS();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseArgumentOrTuple();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseS();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseArgumentOrTuple();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c22(s1, s3, s4);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parseOpcode();
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    s3 = peg$parseArgumentOrTuple();
                    if (s3 !== peg$FAILED) {
                        s1 = [s1, s2, s3];
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                s1 = peg$parseOpcode();
                if (s1 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c23(s1);
                }
                s0 = s1;
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c21); }
        }

        return s0;
    }

    function peg$parseArgumentOrTuple() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseLabel();
        if (s1 === peg$FAILED) {
            s1 = peg$parseArgument();
            if (s1 === peg$FAILED) {
                s1 = peg$parseTuple();
                if (s1 === peg$FAILED) {
                    s1 = peg$parseArray();
                }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c25(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c24); }
        }

        return s0;
    }

    function peg$parseArgument() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseEval();
        if (s1 === peg$FAILED) {
            s1 = peg$parseString();
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c27(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c26); }
        }

        return s0;
    }

    function peg$parseRegPropAccess() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseRegister();
        if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 64) {
                s2 = peg$c29;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c30); }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parsePropRegister();
                if (s3 === peg$FAILED) {
                    s3 = peg$parsePropName();
                    if (s3 === peg$FAILED) {
                        s3 = peg$parseNumber();
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c31(s1, s3);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }

        return s0;
    }

    function peg$parsePropName() {
        var s0, s1;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseName();
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c33();
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c32); }
        }

        return s0;
    }

    function peg$parsePropRegister() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c16;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseName();
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 41) {
                    s3 = peg$c18;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c19); }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c35(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c34); }
        }

        return s0;
    }

    function peg$parseRegister() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 94) {
            s1 = peg$c37;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c38); }
        }
        if (s1 === peg$FAILED) {
            s1 = null;
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parseName();
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c39(s1, s2);
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }

        return s0;
    }

    function peg$parseName() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c41.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c43.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c44); }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (peg$c43.test(input.charAt(peg$currPos))) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c44); }
                }
            }
            if (s2 !== peg$FAILED) {
                s3 = [];
                if (peg$c45.test(input.charAt(peg$currPos))) {
                    s4 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c46); }
                }
                while (s4 !== peg$FAILED) {
                    s3.push(s4);
                    if (peg$c45.test(input.charAt(peg$currPos))) {
                        s4 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s4 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c46); }
                    }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c47();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c40); }
        }

        return s0;
    }

    function peg$parseAnnotations() {
        var s0, s1, s2, s3, s4, s5;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parseAnnotation();
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$currPos;
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
                s5 = peg$parseAnnotation();
                if (s5 !== peg$FAILED) {
                    s4 = [s4, s5];
                    s3 = s4;
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            } else {
                peg$currPos = s3;
                s3 = peg$FAILED;
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$currPos;
                s4 = peg$parse_();
                if (s4 !== peg$FAILED) {
                    s5 = peg$parseAnnotation();
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c49(s1, s2);
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c48); }
        }

        return s0;
    }

    function peg$parseAnnotation() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 64) {
            s1 = peg$c29;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c30); }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c51.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c52); }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c51.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c52); }
                    }
                }
            } else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    s4 = peg$parseAnnotationArgs();
                    if (s4 === peg$FAILED) {
                        s4 = null;
                    }
                    if (s4 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c53(s2, s4);
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c50); }
        }

        return s0;
    }

    function peg$parseAnnotationArgs() {
        var s0, s1, s2, s3, s4;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$currPos;
        s3 = peg$parse_();
        if (s3 !== peg$FAILED) {
            s4 = peg$parseAnnotationArg();
            if (s4 !== peg$FAILED) {
                s3 = [s3, s4];
                s2 = s3;
            } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
        } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
        }
        while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$currPos;
            s3 = peg$parse_();
            if (s3 !== peg$FAILED) {
                s4 = peg$parseAnnotationArg();
                if (s4 !== peg$FAILED) {
                    s3 = [s3, s4];
                    s2 = s3;
                } else {
                    peg$currPos = s2;
                    s2 = peg$FAILED;
                }
            } else {
                peg$currPos = s2;
                s2 = peg$FAILED;
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c55(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c54); }
        }

        return s0;
    }

    function peg$parseAnnotationArg() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c51.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c52); }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c51.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c52); }
                }
            }
        } else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c57(s1);
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c56); }
        }

        return s0;
    }

    function peg$parseComment() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 35) {
            s1 = peg$c59;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c60); }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (input.length > peg$currPos) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c61); }
            }
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                if (input.length > peg$currPos) {
                    s3 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c61); }
                }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c62();
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }

        return s0;
    }

    function peg$parseNumber() {
        var s0, s1, s2, s3, s4, s5, s6;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 43) {
            s1 = peg$c7;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c8); }
        }
        if (s1 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 45) {
                s1 = peg$c9;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c10); }
            }
        }
        if (s1 === peg$FAILED) {
            s1 = null;
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c64.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c65); }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c64.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c65); }
                    }
                }
            } else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 46) {
                    s4 = peg$c66;
                    peg$currPos++;
                } else {
                    s4 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c67); }
                }
                if (s4 !== peg$FAILED) {
                    s5 = [];
                    if (peg$c64.test(input.charAt(peg$currPos))) {
                        s6 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s6 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c65); }
                    }
                    if (s6 !== peg$FAILED) {
                        while (s6 !== peg$FAILED) {
                            s5.push(s6);
                            if (peg$c64.test(input.charAt(peg$currPos))) {
                                s6 = input.charAt(peg$currPos);
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c65); }
                            }
                        }
                    } else {
                        s5 = peg$FAILED;
                    }
                    if (s5 !== peg$FAILED) {
                        s4 = [s4, s5];
                        s3 = s4;
                    } else {
                        peg$currPos = s3;
                        s3 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s3;
                    s3 = peg$FAILED;
                }
                if (s3 === peg$FAILED) {
                    s3 = null;
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c68(s1, s2, s3);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c63); }
        }

        return s0;
    }

    function peg$parseString() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 34) {
            s1 = peg$c70;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c71); }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            s3 = peg$parseStringChars();
            while (s3 !== peg$FAILED) {
                s2.push(s3);
                s3 = peg$parseStringChars();
            }
            if (s2 !== peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 34) {
                    s3 = peg$c70;
                    peg$currPos++;
                } else {
                    s3 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c71); }
                }
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c72(s2);
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c69); }
        }

        return s0;
    }

    function peg$parseStringChars() {
        var s0;

        if (peg$c73.test(input.charAt(peg$currPos))) {
            s0 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c74); }
        }

        return s0;
    }

    function peg$parseTuple() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 40) {
            s1 = peg$c16;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c17); }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseArgument();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseS();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseArgument();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseS();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseArgument();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 41) {
                                s6 = peg$c18;
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c19); }
                            }
                            if (s6 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c76(s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c75); }
        }

        return s0;
    }

    function peg$parseArray() {
        var s0, s1, s2, s3, s4, s5, s6, s7;

        peg$silentFails++;
        s0 = peg$currPos;
        if (input.charCodeAt(peg$currPos) === 91) {
            s1 = peg$c78;
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c79); }
        }
        if (s1 !== peg$FAILED) {
            s2 = peg$parse_();
            if (s2 !== peg$FAILED) {
                s3 = peg$parseArgumentOrTuple();
                if (s3 !== peg$FAILED) {
                    s4 = [];
                    s5 = peg$currPos;
                    s6 = peg$parseS();
                    if (s6 !== peg$FAILED) {
                        s7 = peg$parseArgumentOrTuple();
                        if (s7 !== peg$FAILED) {
                            s6 = [s6, s7];
                            s5 = s6;
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s5;
                        s5 = peg$FAILED;
                    }
                    while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$currPos;
                        s6 = peg$parseS();
                        if (s6 !== peg$FAILED) {
                            s7 = peg$parseArgumentOrTuple();
                            if (s7 !== peg$FAILED) {
                                s6 = [s6, s7];
                                s5 = s6;
                            } else {
                                peg$currPos = s5;
                                s5 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s5;
                            s5 = peg$FAILED;
                        }
                    }
                    if (s4 !== peg$FAILED) {
                        s5 = peg$parse_();
                        if (s5 !== peg$FAILED) {
                            if (input.charCodeAt(peg$currPos) === 93) {
                                s6 = peg$c80;
                                peg$currPos++;
                            } else {
                                s6 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c81); }
                            }
                            if (s6 !== peg$FAILED) {
                                peg$savedPos = s0;
                                s1 = peg$c82(s3, s4);
                                s0 = s1;
                            } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                            }
                        } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                        }
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.charCodeAt(peg$currPos) === 91) {
                s1 = peg$c78;
                peg$currPos++;
            } else {
                s1 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c79); }
            }
            if (s1 !== peg$FAILED) {
                s2 = peg$parse_();
                if (s2 !== peg$FAILED) {
                    if (input.charCodeAt(peg$currPos) === 93) {
                        s3 = peg$c80;
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c81); }
                    }
                    if (s3 !== peg$FAILED) {
                        peg$savedPos = s0;
                        s1 = peg$c83();
                        s0 = s1;
                    } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                    }
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c77); }
        }

        return s0;
    }

    function peg$parseOpcode() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        if (peg$c85.test(input.charAt(peg$currPos))) {
            s1 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c86); }
        }
        if (s1 !== peg$FAILED) {
            s2 = [];
            if (peg$c87.test(input.charAt(peg$currPos))) {
                s3 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c88); }
            }
            if (s3 !== peg$FAILED) {
                while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    if (peg$c87.test(input.charAt(peg$currPos))) {
                        s3 = input.charAt(peg$currPos);
                        peg$currPos++;
                    } else {
                        s3 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c88); }
                    }
                }
            } else {
                s2 = peg$FAILED;
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c89();
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c84); }
        }

        return s0;
    }

    function peg$parseLabel() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c87.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c88); }
        }
        if (s2 !== peg$FAILED) {
            while (s2 !== peg$FAILED) {
                s1.push(s2);
                if (peg$c87.test(input.charAt(peg$currPos))) {
                    s2 = input.charAt(peg$currPos);
                    peg$currPos++;
                } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c88); }
                }
            }
        } else {
            s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 58) {
                s2 = peg$c91;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c92); }
            }
            if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c93(s1);
                s0 = s1;
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c90); }
        }

        return s0;
    }

    function peg$parseS() {
        var s0, s1, s2, s3;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 44) {
                s2 = peg$c95;
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c96); }
            }
            if (s2 !== peg$FAILED) {
                s3 = peg$parse_();
                if (s3 !== peg$FAILED) {
                    peg$savedPos = s0;
                    s1 = peg$c97();
                    s0 = s1;
                } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                }
            } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
            }
        } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
        }
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c94); }
        }

        return s0;
    }

    function peg$parse_() {
        var s0, s1, s2;

        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];
        if (peg$c99.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
        } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c100); }
        }
        while (s2 !== peg$FAILED) {
            s1.push(s2);
            if (peg$c99.test(input.charAt(peg$currPos))) {
                s2 = input.charAt(peg$currPos);
                peg$currPos++;
            } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c100); }
            }
        }
        if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c62();
        }
        s0 = s1;
        peg$silentFails--;
        if (s0 === peg$FAILED) {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c98); }
        }

        return s0;
    }


    function flatten(stuff) {
        return stuff.map(a => a.filter(a => a != null)).map(a => a[0]) ;
    }
    function flattenExp(exp) {
        if (exp.value.length === 1) {
            return exp.value[0]
        }
        return exp;
    }
    const TokenTypes = {
        OPCODE: 0,
        REGISTER: 1,
        NONLOCALREGISTER: 2,
        REGISTERPROP: 3,
        NUMBER: 4,
        STRING: 5,
        LABEL: 6,
        FUNCDECL: 7,
        POINT: 8,
        ARRAY: 9,
        EXPRESSION: 10,
        OPERATOR: 11,
        ANNOTATION: 12,
        NAME: 13,
        OTHER: 14
    }



    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(
            peg$maxFailExpected,
            peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
            peg$maxFailPos < input.length
                ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
                : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
        );
    }
}
