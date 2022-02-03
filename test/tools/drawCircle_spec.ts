import {describe, it} from "mocha";
import {MockRenderer} from "../testHelpers/mock/mockRenderer";
import {InteractionEvents} from "../../src/controls/drawing/InteractionEvents";
import {expect} from "chai";
import {Parser} from "../../src/runtime/interpreter/Parser";
import {makeAClick, makeAMove} from "../testHelpers/mouseEvents";
import {T_NUMBER, T_OPCODE, T_POINT_NN, T_REGISTERAT} from "../testHelpers/tokens";
import {AppConfig} from "../../src/AppConfig";
import {DrawCircle} from "../../src/tools/DrawCircle";
import {GrCanvas} from "../../src/Geo/GrCanvas";
import {POI} from "../../src/Geo/GrObject";


describe('Drawing a circle', () => {

    it('works drawing center with a radius', () => {

        const drawCircle = new DrawCircle(new MockRenderer());


        drawCircle.update(InteractionEvents.Click, makeAClick(100, 100));
        drawCircle.update(InteractionEvents.MouseMove, makeAMove(100, 50));
        drawCircle.update(InteractionEvents.Click, makeAClick(100, 200));

        expect(drawCircle.isDone).to.be.true;
        const tokens = Parser.parseLine(drawCircle.result);
        expect(tokens[0]).to.deep.equal(T_OPCODE(AppConfig.Runtime.Opcodes.Circle.CenterRadius))
        expect(tokens[3]).to.deep.equal(T_POINT_NN(100, 100));
        expect(tokens[4]).to.deep.equal(T_NUMBER(100));
    });

    it('works drawing center on a point with a radius', () => {
        const canvas = GrCanvas.create_1_1(1000);
        const renderer = new MockRenderer();
        const drawCircle = new DrawCircle(renderer);

        renderer.hitPoi(canvas, POI.center);
        drawCircle.update(InteractionEvents.Click, makeAClick(100, 100));
        renderer.unHitLastPoi();
        drawCircle.update(InteractionEvents.MouseMove, makeAMove(100, 50));
        drawCircle.update(InteractionEvents.Click, makeAClick(500, 200));

        expect(drawCircle.isDone).to.be.true;
        const tokens = Parser.parseLine(drawCircle.result);
        expect(tokens[0]).to.deep.equal(T_OPCODE(AppConfig.Runtime.Opcodes.Circle.CenterRadius))
        expect(tokens[3]).to.deep.equal(T_REGISTERAT(AppConfig.Runtime.canvasObjectName, POI[POI.center]));
        expect(tokens[4]).to.deep.equal(T_NUMBER(300));
    });

    it('works drawing center on a point touching another point', () => {
        const canvas = GrCanvas.create_1_1(1000);
        const renderer = new MockRenderer();
        const drawCircle = new DrawCircle(renderer);

        renderer.hitPoi(canvas, POI.center);
        drawCircle.update(InteractionEvents.Click, makeAClick(100, 100));
        renderer.unHitLastPoi();
        drawCircle.update(InteractionEvents.MouseMove, makeAMove(100, 50));

        renderer.hitPoi(canvas, POI.right);
        drawCircle.update(InteractionEvents.Click, makeAClick(500, 200));

        expect(drawCircle.isDone).to.be.true;
        const tokens = Parser.parseLine(drawCircle.result);
        expect(tokens[0]).to.deep.equal(T_OPCODE(AppConfig.Runtime.Opcodes.Circle.CenterPoint))
        expect(tokens[3]).to.deep.equal(T_REGISTERAT(AppConfig.Runtime.canvasObjectName, POI[POI.center]));
        expect(tokens[4]).to.deep.equal(T_REGISTERAT(AppConfig.Runtime.canvasObjectName, POI[POI.right]));
    });

    it('works drawing from point to point', () => {
        const canvas = GrCanvas.create_1_1(1000);
        const renderer = new MockRenderer();
        const drawCircle = new DrawCircle(renderer);

        renderer.hitPoi(canvas, POI.center);
        drawCircle.update(InteractionEvents.Click, makeAClick(100, 100));
        renderer.unHitLastPoi();
        drawCircle.update(InteractionEvents.MouseMove, makeAMove(100, 50));

        renderer.hitPoi(canvas, POI.bottom);
        drawCircle.update(InteractionEvents.Click, makeAClick(500, 200, 0, { alt: true }));

        expect(drawCircle.isDone).to.be.true;
        const tokens = Parser.parseLine(drawCircle.result);
        expect(tokens[0]).to.deep.equal(T_OPCODE(AppConfig.Runtime.Opcodes.Circle.PointPoint))
        expect(tokens[3]).to.deep.equal(T_REGISTERAT(AppConfig.Runtime.canvasObjectName, POI[POI.center]));
        expect(tokens[4]).to.deep.equal(T_REGISTERAT(AppConfig.Runtime.canvasObjectName, POI[POI.bottom]));
    });



});