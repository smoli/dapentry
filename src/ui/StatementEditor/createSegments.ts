import {Token, TokenTypes} from "../../runtime/interpreter/Parser";
import {UNREACHABLE} from "../../core/Assertions";
import {LibraryEntry} from "../../core/Library";

export interface SegmentInfo {
    type: string,
    value?: string,
    token?: Token,
    statementIndex?: number,
    subIndexes?: Array<number>
}

export function createSegmentInfoForToken(token, statementIndex, indexes: Array<number> = []): SegmentInfo {
    switch (token.type) {
        case TokenTypes.REGISTER:
            return { type: "SimpleInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.REGISTERAT:
            return { type: "AtRegisterInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.NUMBER:
            return { type: "NumberInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.STRING:
            return { type: "SimpleInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.POINT:
            return { type: "PointInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.ARRAY:
            return { type: "ArrayInput", token, statementIndex, subIndexes: indexes };

        case TokenTypes.EXPRESSION:
            return { type: "ExpressionInput", token, statementIndex, subIndexes: indexes };


        default:
            UNREACHABLE("Unsupported token type " + TokenTypes[token.type]);
    }
}



export function createSegmentsForMakeOp(tokens: Array<Token>, entry: LibraryEntry, textTemplate: string, statementIndex: number): Array<SegmentInfo> {

    const segments = createSegments(tokens, textTemplate, statementIndex);

    entry.arguments.forEach((arg, i) => {
        segments.push({ type: "Static", value: arg.name });
        const index = tokens.length - entry.arguments.length + i;
        const t = tokens[index];
        segments.push(createSegmentInfoForToken(t, statementIndex, [index]));
    });


    return segments;
}

export function createSegments(tokens: Array<Token>, textTemplate: string, statementIndex: number): Array<SegmentInfo> {
    if (!tokens || !tokens.length) {
        return []
    }

    const t = textTemplate;

    const matches = t.match(/([\w\s]+|\{\d+\})/g);

    const segments = [];

    for (let i = 0; i < matches.length; i++) {
        const m = matches[i]
        if (m[0] == "{") {
            const index = Number(m.match(/(\d+)/)[0]);
            const token = tokens[index];
            if (token) {
                segments.push(createSegmentInfoForToken(token, statementIndex, [index]))
            }
        } else {
            segments.push({ type: "Static", value: m });
        }
    }

    return segments;
}