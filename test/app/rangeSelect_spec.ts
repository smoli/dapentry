import {describe} from "mocha";
import {expect} from "chai"
import {rangeSelect} from "../../src/ui/core/rangeSelect";


describe('Range select', () => {

    const all = [1, 2, 3, 4, 5, 6, 7, 8];

    it("can select a single item", () => {
        const current = [];
        const chosen = 3;

        const newSelection = rangeSelect<number>(all, current, chosen);
        expect(newSelection).to.deep.equal([3]);
    });

    it("can deselect a single item", () => {
        const current = [3];
        const chosen = 3;

        const newSelection = rangeSelect<number>(all, current, chosen)
        expect(newSelection).to.deep.equal([]);
    });

    it("can extend a selection to the right", () => {
        const current = [3];
        const chosen = 5;

        const newSelection = rangeSelect<number>(all, current, chosen, 3);
        expect(newSelection).to.deep.equal([3, 4, 5]);
    });

    it("can shorten a selection on the right", () => {
        const current = [3, 4, 5, 6];
        const chosen = 4;

        const newSelection = rangeSelect<number>(all, current, chosen, 3);
        expect(newSelection).to.deep.equal([3, 4]);
    });

    it("can shorten a selection on the right to a single element", () => {
        const current = [3, 4, 5, 6];
        const chosen = 3;

        const newSelection = rangeSelect<number>(all, current, chosen, 3);
        expect(newSelection).to.deep.equal([3]);
    });

    it ("can extend a selection to the left", () => {
        const current = [5];
        const chosen = 2;

        const newSelection = rangeSelect<number>(all, current, chosen, 5);
        expect(newSelection).to.deep.equal([2, 3, 4, 5]);
    });

    it ("can shorten a selection on the left", () => {
        const current = [2, 3, 4, 5];
        const chosen = 4;

        const newSelection = rangeSelect<number>(all, current, chosen, 5);
        expect(newSelection).to.deep.equal([4, 5]);
    });

    it ("can shorten a selection on the left to a single element", () => {
        const current = [2, 3, 4, 5];
        const chosen = 5;

        const newSelection = rangeSelect<number>(all, current, chosen, 5);
        expect(newSelection).to.deep.equal([5]);
    });
});
