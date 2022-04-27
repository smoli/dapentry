import {describe, it} from "mocha";
import {expect} from "chai"
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {DataFieldType} from "../../src/state/modules/Data";
import {GfxInterpreter} from "../../src/core/GfxInterpreter";
import {AppController} from "../../src/core/AppController";


describe('Undo (scope of app controller)', () => {

    it('can undo a whole sequence of actions', () => {
        const state = new State(createAppStore(), null);
        const inter = new GfxInterpreter();
        const controller = new AppController(state, inter);

        controller.addNewDataField(10);

        // Add a field
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            }]);
        expect(state.store.state.code.code).to.deep.equal([]);

        // Add another field
        controller.addNewDataField(20);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Add a statement
        controller.addStatement("CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal(["CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00"]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Add another statement
        controller.addStatement("RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Add a value to a field to make it a list
        controller.addValueToDataField("f1", 15);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Add another value to the list
        controller.addValueToDataField("f1", 17);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Select all statements
        controller.selectStatements([0, 1])
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Loop selected statements
        controller.loopStatements([0, 1]);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "DO 4",
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44",
            "ENDDO"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Turn the loop into a for each
        controller.updateStatement(0, [1], "f1");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "FOREACH $f1, f1",
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44",
            "ENDEACH"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Rename the list
        controller.renameDataField("f1", "g1");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "g1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "FOREACH $f1, g1",
            "CIRCLECR Circle1, $styles.default, (530.32, 289.95), 177",
            "RECTTL Rectangle1, $styles.default, (709.39, 635.2), 81.66, 54.44",
            "ENDEACH"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Undo "rename the list"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "FOREACH $f1, f1",
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44",
            "ENDEACH"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Undo "Turn the loop into a for each"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "DO 4",
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44",
            "ENDDO"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Undo "Loop selected statements"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15, 17],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);



        // Undo "Add another value to the list"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: [10, 15],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Add a value to a field to make it a list
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([
            "CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00",
            "RECTTL Rectangle1,$styles.default,(709.39, 635.20),81.66,54.44"
        ]);
        expect(state.store.state.code.selectedLines).to.deep.equal([0, 1]);

        // Undo "Add another statement"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal(["CIRCLECR Circle1,$styles.default,(530.32, 289.95),177.00"]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Undo "Add a statement"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: 20, type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
        expect(state.store.state.code.code).to.deep.equal([]);
        expect(state.store.state.code.selectedLines).to.deep.equal([]);

        // Undo "Add another field"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            }]);
        expect(state.store.state.code.code).to.deep.equal([]);

        // Undo "Add a field"
        controller.undo();
        expect(state.store.state.data.fields).to.deep.equal([]);
        expect(state.store.state.code.code).to.deep.equal([]);
    });

});