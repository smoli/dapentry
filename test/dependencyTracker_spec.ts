import {describe, it} from "mocha";
import {expect} from "chai"
import {DependencyTracker} from "../src/DependencyTracker";


describe('DependencyTracker', () => {

    it('tracks multiple thing to a name', () => {
        const t = new DependencyTracker();

        t.addDependency("one", 1);
        t.addDependency("one", 1);
        t.addDependency("one", 2);
        t.addDependency("one", "three");
        t.addDependency("three", "three");

        expect(t.getDependencies("one")).to.deep.equal([1, 2, "three"]);
        expect(t.getDependencies("three")).to.deep.equal(["three"]);

        t.removeDependency("one", 12);
        expect(t.getDependencies("one")).to.deep.equal([1, 2, "three"]);

        t.removeDependency("one", 1);
        expect(t.getDependencies("one")).to.deep.equal([2, "three"]);
    });
});