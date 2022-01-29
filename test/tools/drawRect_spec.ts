import {describe, it} from "mocha";
import {DrawRectangle} from "../../src/tools/DrawRectangle";
import {MockRenderer} from "../mock/mockRenderer";
import {InteractionEventData, InteractionEvents} from "../../src/controls/drawing/InteractionEvents";
import {expect} from "chai";
import {Parser, TokenTypes, Token} from "../../src/runtime/interpreter/Parser";


interface modifiers {
    alt?: boolean,
    shift?: boolean,
    ctrl?:boolean
}

describe('Drawing a rectangle', () => {

    let lastX;
    let lastY;


    function makeAClick(x:number, y:number, button: number = 0, mods:modifiers = {} ): InteractionEventData {
        lastX = x;
        lastY = y;
        return {
            alt: !!mods.alt,
            button,
            buttons: true,
            ctrl: !!mods.ctrl,
            dx: 0,
            dy: 0,
            interactionEvent: undefined,
            key: "",
            keyCode: 0,
            shift: !!mods.shift,
            x,
            y
        }
    }

    function makeAMove(x: number, y: number, mods: modifiers = {}): InteractionEventData {
        const dx = x - lastX;
        const dy = y - lastY;
        lastX = x;
        lastY = y;
        return {
            alt: !!mods.alt,
            button: 0,
            buttons: false,
            ctrl: !!mods.ctrl,
            dx,
            dy,
            interactionEvent: undefined,
            key: "",
            keyCode: 0,
            shift: !!mods.shift,
            x,
            y
        }
    }

    function T_OPCODE(opcode):Token {
        return { type: TokenTypes.OPCODE, value: opcode}
    }

    function T_NUMBER(value):Token {
        return { type: TokenTypes.NUMBER, value }
    }

    function T_STRING(value):Token {
        return { type: TokenTypes.STRING, value }
    }

    function T_REGISTER(value):Token {
        return { type: TokenTypes.REGISTER, value }
    }

    function T_POINT_NN(x: number, y: number):Token {
        return { type: TokenTypes.POINT, value: [T_NUMBER(x), T_NUMBER(y)] }
    }


    it('works', () => {
        const drawRect = new DrawRectangle(new MockRenderer())

        drawRect.update(InteractionEvents.Click, makeAClick(100, 100));
        drawRect.update(InteractionEvents.MouseMove, makeAMove(100, 200));
        drawRect.update(InteractionEvents.Click, makeAClick(200, 150));

        expect(drawRect.isDone).to.be.true;
        const tokens = Parser.parseLine(drawRect.result);
        expect(tokens[0]).to.deep.equal(T_OPCODE("RECT"))
        expect(tokens[3]).to.deep.equal(T_POINT_NN(150, 125));
        expect(tokens[4]).to.deep.equal(T_NUMBER(100));
        expect(tokens[5]).to.deep.equal(T_NUMBER(50));
    });
});