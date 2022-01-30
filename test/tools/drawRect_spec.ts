import {describe, it} from "mocha";
import {DrawRectangle} from "../../src/tools/DrawRectangle";
import {MockRenderer} from "../testHelpers/mock/mockRenderer";
import {InteractionEvents} from "../../src/controls/drawing/InteractionEvents";
import {expect} from "chai";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {makeAClick, makeAMove} from "../testHelpers/mouseEvents";
import {T_NUMBER, T_OPCODE, T_POINT_NN} from "../testHelpers/tokens";


describe('Drawing a rectangle', () => {

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