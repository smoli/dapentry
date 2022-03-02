import {describe, it} from "mocha";
import {GrLine} from "../../src/geometry/GrLine";
import {DrawLine} from "../../src/tools/DrawLine";
import {MockRenderer} from "../testHelpers/mock/mockRenderer";
import {InteractionEvents} from "../../src/core/InteractionEvents";
import {makeAClick, makeAMove, makeRefObjEvent} from "../testHelpers/mouseEvents";
import {expect} from "chai";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {T_POINT_NN, T_REGISTERAT} from "../testHelpers/tokens";


describe('Using object snapping on guides', () => {

    it('works', () => {
        const guide = new GrLine("helper", 0, 0, 100, 100);
        guide.markAsGuide();

        const drawLine = new DrawLine(new MockRenderer());

        drawLine.update(InteractionEvents.MouseMove, makeAMove(50, 50));
        drawLine.update(InteractionEvents.ReferenceObject, makeRefObjEvent(guide));
        drawLine.update(InteractionEvents.Click, makeAClick(50, 50));
        drawLine.update(InteractionEvents.ReferenceObject, makeRefObjEvent(null));
        drawLine.update(InteractionEvents.MouseMove, makeAMove(0, 0));
        drawLine.update(InteractionEvents.Click, makeAClick(0, 0));

        expect(drawLine.isDone).to.be.true;
        const result = drawLine.result;
        const tokens = Parser.parseLine(result);
        console.log(result);
        expect(tokens[3]).to.deep.equal(T_REGISTERAT("helper", 0.5))
        expect(tokens[4]).to.deep.equal(T_POINT_NN(0, 0));
    });
});