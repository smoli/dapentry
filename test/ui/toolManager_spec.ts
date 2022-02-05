import {describe} from "mocha";
import {expect} from "chai"
import {ToolManager} from "../../src/drawing/ToolManager";
import {SnapInfo, Tool} from "../../src/tools/Tool";
import {InteractionEventData, InteractionEvents} from "../../src/drawing/InteractionEvents";
import {GrCircle} from "../../src/geometry/GrCircle";
import {GrObject} from "../../src/geometry/GrObject";


class TestTool extends Tool {
    private _mockDone: boolean = false;
    public selection: GrObject[];

    constructor(renderer) {
        super(renderer, "WAIT", "DONE");
    }

    abort() {
        super.abort();
    }

    protected _update(interactionEvent: InteractionEvents, snapInfo: SnapInfo): boolean {
        return false;
    }

    update(interactionEvent: InteractionEvents, eventData: InteractionEventData): boolean {
        if (interactionEvent !== InteractionEvents.Selection) {
            if (eventData) {
                this.selection = eventData.selection;
            }
            this.setToDone();
        } else {
            this._setSelection(eventData.selection);
        }
        return false;
    }

    protected _setSelection(selection) {
        this.selection = selection;
        return;
    }

    get result(): any {
        return "result";
    }

    reset() {
        super.reset();
        this._mockDone = false;
    }

    get isDone(): boolean {
        return this._mockDone;
    }

    setToDone() {
        this._mockDone = true;
    }
}

function makeToolClass(callBack, prefix) {

    const cb = text => callBack(prefix + "-" + text);

    return class C extends TestTool {

        public name: string = prefix;

        constructor(renderer) {
            super(renderer);
            cb("constructor");
        }


        abort() {
            super.abort();
            cb("abort");
        }

        update(event: InteractionEvents, data: InteractionEventData) {
            if (event !== InteractionEvents.Selection) {
                cb("update");
            }
            return super.update(event, data);
        }

        protected _setSelection(selection) {
            super._setSelection(selection);
            cb("update-selection");
        }

        tearDown() {
            super.tearDown();
            cb("tearDown");
        }

        finish() {
            super.finish();
            cb("finish");
        }

        reset() {
            super.reset();
            cb("reset");
        }

    }
}

let messages = [];
const cb = t => messages.push(t);
const clearMessages = () => {
    messages = [];
}

const ToolA = makeToolClass(cb, "A");
const ToolB = makeToolClass(cb, "B");
const ToolC = makeToolClass(cb, "C");


describe('The ToolManager', () => {

    describe("tool switching", () => {

        it('switches tools on defined events', () => {

            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            expect(t.currentTool).to.be.null;

            t.switch("A");
            expect(t.currentTool).to.be.instanceof(ToolA);

            t.switch("B");
            expect(t.currentTool).to.be.instanceof(ToolB);
        });


        it('does no switch when given an unknown event', () => {

            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");

            expect(t.currentTool).to.be.null;

            t.switch("A");
            expect(t.currentTool).to.be.instanceof(ToolA);

            t.switch("Unknown");
            expect(t.currentTool).to.be.instanceof(ToolA);
        });

        it("manages the lifecycle of tools, when switching", () => {

            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");
            expect(t.currentTool).to.be.null;

            t.switch("A");
            expect(t.currentTool).to.be.instanceof(ToolA);

            t.switch("B");
            expect(t.currentTool).to.be.instanceof(ToolB);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-abort",
                "A-tearDown",
                "B-constructor"
            ]);
        })

        it("can use a defined tool to switch to when the current action is aborted", () => {

            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");
            t.addTool(ToolC, "C");
            t.setToolEventAfterAbort("C");
            expect(t.currentTool).to.be.null;

            t.switch("A");
            t.abortCurrentTool();
            expect(t.currentTool).to.be.instanceof(ToolC);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-abort",
                "C-constructor"
            ]);
        });
    });

    describe("pumping interaction events allows the manager to", () => {
        it('pass the result of a tool to a callback', () => {
            clearMessages();

            let testResult;
            const t = new ToolManager(null);
            t.doneCallBack = result => testResult = result;

            t.addTool(ToolA, "A");

            t.switch("A");
            t.pump(InteractionEvents.Click, null);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update",
                "A-finish",
                "A-reset"
            ]);

            expect(testResult).to.equal("result");
        });

        it('keep a tool for as long as no switch occurs', () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            t.switch("A");
            t.pump(InteractionEvents.Click, null);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update",
                "A-finish",
                "A-reset"
            ])

            expect(t.currentTool).to.be.instanceof(ToolA);
            expect(t.currentTool.isDone).to.be.false;
        });

        it('can switch to a specific tool when any other tool is done', () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");
            t.addTool(ToolC, "C");
            t.setToolAfterDone("C");

            t.switch("A");
            const firstTool = t.currentTool;

            t.pump(InteractionEvents.Click, null);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update",
                "A-finish",
                "A-tearDown",
                "C-constructor"
            ])

            expect(t.currentTool).to.be.instanceof(ToolC);
            expect(t.currentTool.isDone).to.be.false;
            expect(firstTool.isDone).to.be.true;
        });

        it('can switch to a specific tool when an other specific tool is done', () => {
            // E.g. always switch back to select tool when a drawing tool is done
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");
            t.addTool(ToolC, "C");
            t.setToolAfterDone("C", ToolB);

            t.switch("A");
            t.pump(InteractionEvents.Click, null);

            expect(t.currentTool).to.be.instanceof(ToolA);

            t.switch("B");
            expect(t.currentTool).to.be.instanceof(ToolB);
            t.pump(InteractionEvents.Click, null);

            expect(t.currentTool).to.be.instanceof(ToolC);

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update",
                "A-finish",         // A is done
                "A-reset",          // A is kept
                "A-abort",          // switch to B, abort A
                "A-tearDown",
                "B-constructor",
                "B-update",
                "B-finish",         // B is done
                "B-tearDown",
                "C-constructor"     // automatically switch to C
            ])

            expect(t.currentTool.isDone).to.be.false;
        });

    });


    describe("manages the object selection as well", () => {
        it("can select a single object", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            t.switch("A");
            t.selectObject(GrCircle.create("c1", 0, 0, 10));

            expect(messages).to.deep.equal([
                    "A-constructor",
                    "A-update-selection"
                ]);
        });

        it("can be asked if an object is selected", () => {
            const t = new ToolManager(null);
            const c1 = GrCircle.create("c1", 0, 0, 10);

            expect(t.isSelected(c1)).to.be.false;
            t.selectObject(c1);
            expect(t.isSelected(c1)).to.be.true;
            t.deselectObject(c1);
            expect(t.isSelected(c1)).to.be.false;

        });

        it("passes the current selection to the new active tool", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            t.selectObject(GrCircle.create("c1", 0, 0, 10));

            t.switch("A");

            expect(messages).to.deep.equal([
                    "A-constructor",
                    "A-update-selection"
                ]);
        });

        it("will inject the current selection into the event data when pumping events", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");

            const c1 = GrCircle.create("c1", 0, 0, 10);
            t.selectObject(c1);

            t.switch("A");

            expect(messages).to.deep.equal([
                    "A-constructor",
                    "A-update-selection"
                ]);

            (t.currentTool as TestTool).selection = [];

            t.pump(InteractionEvents.Click, {
                interactionEvent: InteractionEvents.Click,
                x: 0,
                y: 0,
                dx: 0,
                dy: 0,
                button: 0,
                buttons: 0,
                ctrl: false,
                shift: false,
                alt: false,
                key: "",
                keyCode: 0
            });

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection",
                "A-update",
                "A-finish",
                "A-reset"
            ]);

            expect((t.currentTool as TestTool).selection).to.deep.equal([c1]);

        });

        it("can deselect everything", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            const c1 = GrCircle.create("c1", 0, 0, 10);

            t.selectObject(c1);

            t.switch("A");

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection"
            ]);
            expect((t.currentTool as TestTool).selection).to.deep.equal([ c1 ]);


            t.deselectAll();
            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection",
                "A-update-selection"
            ]);
            expect((t.currentTool as TestTool).selection).to.deep.equal([]);
        });

        it("can add object to the selection", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            const c1 = GrCircle.create("c1", 0, 0, 10);
            const c2 = GrCircle.create("c2", 0, 0, 10);
            const c3 = GrCircle.create("c3", 0, 0, 10);

            t.selectObject(c1);
            t.addObjectToSelection(c2);
            t.addObjectToSelection(c2);     // Objects will only be in the selection once
            t.addObjectToSelection(c3);

            t.switch("A");

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection"
            ]);
            expect((t.currentTool as TestTool).selection).to.deep.equal([ c1, c2, c3 ]);
        });

        it("can remove an object from the selection", () => {
            clearMessages();
            const t = new ToolManager(null);

            t.addTool(ToolA, "A");
            t.addTool(ToolB, "B");

            const c1 = GrCircle.create("c1", 0, 0, 10);
            const c2 = GrCircle.create("c2", 0, 0, 10);
            const c3 = GrCircle.create("c3", 0, 0, 10);

            t.selectObject(c1);
            t.addObjectToSelection(c2);
            t.addObjectToSelection(c3);

            t.switch("A");

            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection"
            ]);
            expect((t.currentTool as TestTool).selection).to.deep.equal([ c1, c2, c3 ]);

            t.deselectObject(c2);
            expect(messages).to.deep.equal([
                "A-constructor",
                "A-update-selection",
                "A-update-selection"
            ]);
            expect((t.currentTool as TestTool).selection).to.deep.equal([ c1, c3 ]);

        });

    })
});