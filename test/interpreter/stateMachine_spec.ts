import {describe, it} from "mocha";
import {expect} from "chai"
import {StateMachine, state} from "../../src/runtime/tools/StateMachine";


describe('State machine', () => {

    it('handles state transitions', () => {

        const m = new StateMachine();

        m.add(state("A"), 1, state("B"))

        m.add(state("B"), 1, state("C"))
        m.add(state("B"), 2, state("A"))

        m.add(state("C"), 1, state("A"))

        m.start(state("A"));

        expect(m.state.id).to.equal("A");
        m.next(1)
        expect(m.state.id).to.equal("B");
        m.next(1)
        expect(m.state.id).to.equal("C");
        m.next(1)
        expect(m.state.id).to.equal("A");
        m.next(1)
        expect(m.state.id).to.equal("B");
        m.next(2)
        expect(m.state.id).to.equal("A");

        m.next("nochange")
        expect(m.state.id).to.equal("A");
    });

    it("provides a state factory function that pools states by id", () =>  {

        const a = state("A", 23);
        const b = state("A", 42)

        expect(a.id).to.equal("A");
        expect(a.data).to.equal(23);
        expect(b.id).to.equal("A");
        expect(b.data).to.equal(23);
        expect(a).to.equal(b)

    })
});