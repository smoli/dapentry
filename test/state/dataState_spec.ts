import {describe, it} from "mocha";
import {createAppStore} from "../../src/state/AppStore";
import {State} from "../../src/state/State";
import {expect} from "chai";
import {Persistence} from "../../src/state/Persistence";
import {GrCircle} from "../../src/geometry/GrCircle";
import exp = require("constants");
import {Parser} from "../../src/runtime/interpreter/Parser";
import {T_NUMBER, T_OPCODE, T_REGISTER} from "../testHelpers/tokens";
import {DataFieldType} from "../../src/state/modules/Data";
import {AspectRatio} from "../../src/geometry/AspectRatio";


class MockPersistence extends Persistence {

    async load(state: State): Promise<void> {
        const code = await this.loadCode();
        state.setCode(code);
    }

    async loadCode(): Promise<Array<string>> {
        return ["LOAD r1, 10", "ADD r1, 20"]
    }
}

describe('Data State', () => {


    it("you can add a data field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f2", "Hello");
        state.addDataField("f3", [10, 20, 30]);

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10, type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f2", value: "Hello", type: DataFieldType.String,
                description: null,
                published: true
            },
            {
                name: "f3", value: [10, 20, 30], type: DataFieldType.List,
                description: null,
                published: true
            }
        ])
    });

    it("you can remove a data field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f2", "Hello");
        state.addDataField("f3", [10, 20, 30]);

        state.removeDataField("f2");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10,
                type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f3", value: [10, 20, 30],
                type: DataFieldType.List,
                description: null,
                published: true
            }
        ]);

        state.removeDataField("unknown");
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1",
                value: 10,
                type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f3",
                value: [10, 20, 30],
                type: DataFieldType.List,
                description: null,
                published: true
            }
        ]);
    });

    it("it can provide a new, unused field name", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f2", "Hello");
        state.addDataField("f3", [10, 20, 30]);

        const newName = state.getNewDataFieldName("f");
        console.log("New field name would be", newName);
        expect(["f1", "f2", "f3"]).to.not.include(newName);
    });

    it("can get you a data field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        expect(state.getDataField("f1")).to.deep.equal({
            name: "f1", value: 10,
            type: DataFieldType.Number,
            description: null,
            published: true
        });

    });

    it("you can change the value of a data field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10,
                type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);

        state.setDataFieldValue("f1", 20);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 20,
                type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);

        state.setDataFieldValue("unknown", 20)
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 20,
                type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);
    });

    it("can tell how many code lines are generated for the data definitions", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f2", "Hello");
        state.addDataField("f3", [10, 20, 30]);

        expect(state.dataCodeLength).to.equal(3);
    });

    it("can set the value of an item if a list field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f3", [10, 20, 30]);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f3", value: [10, 20, 30],
                type: DataFieldType.List,
                description: null,
                published: true
            }
        ]);

        state.setDataListFieldValue("f3", 1, 40);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f3", value: [10, 40, 30],
                type: DataFieldType.List,
                description: null,
                published: true
            }
        ]);
    });

    it("can add a value to a data field", () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);
        state.addDataField("f3", [10, 20, 30]);
        state.addDataField("f5", [{ a: 1, b: 2 }, { a: 2, b: 3 }]);

        state.addValueToDataField("f3", 40);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1", value: 10,
                type: DataFieldType.Number,
                description: null,
                published: true
            },
            {
                name: "f3", value: [10, 20, 30, 40],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f5", value: [{ a: 1, b: 2 }, { a: 2, b: 3 }],
                type: DataFieldType.Table,
                description: null,
                published: true
            }
        ]);

        state.addValueToDataField("f1", 20);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1",
                value: [10, 20],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f3",
                value: [10, 20, 30, 40],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f5",
                value: [{ a: 1, b: 2 }, { a: 2, b: 3 }],
                type: DataFieldType.Table,
                description: null,
                published: true
            }
        ]);

        state.addValueToDataField("f5", 10);
        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f1",
                value: [10, 20],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f3",
                value: [10, 20, 30, 40],
                type: DataFieldType.List,
                description: null,
                published: true
            },
            {
                name: "f5",
                value: [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 10, b: 10 }],
                type: DataFieldType.Table,
                description: null,
                published: true
            }
        ]);

    });


    describe("adding columns", () => {

        it("can add a column to a data field", () => {

            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", 10);

            state.addColumnToDataField("f1", 20);

            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [{ a: 10, b: 20 }],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }
            ]);
        })

        it("can add a column to a list", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [1, 2, 3, 4, 5]);

            state.addColumnToDataField("f1", 20);

            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 20 },
                        { a: 2, b: 20 },
                        { a: 3, b: 20 },
                        { a: 4, b: 20 },
                        { a: 5, b: 20 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }
            ]);
        });

        it("can add a column to a table", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);
            state.addDataField("f2", [{ c: 1 }, { c: 3 }, { c: 4 }]);
            state.addDataField("f3", [{ z: 1 }, { z: 3 }, { z: 4 }]);

            state.addColumnToDataField("f1", 20);
            state.addColumnToDataField("f2", 5);
            state.addColumnToDataField("f3", 7);
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 2, c: 20 },
                        { a: 2, b: 3, c: 20 },
                        { a: 3, b: 4, c: 20 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }, {
                    name: "f2",
                    value: [
                        { c: 1, d: 5 },
                        { c: 3, d: 5 },
                        { c: 4, d: 5 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                },
                {
                    name: "f3",
                    value: [
                        { z: 1, z1: 7 },
                        { z: 3, z1: 7 },
                        { z: 4, z1: 7 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }
            ]);

        });

        it("can rename a column of a table", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);

            const code = `
                LOAD r1, f1.x
            `;

            state.setCodeString(code);

            state.renameTableColumn("f1", "a", "x");
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { x: 1, b: 2 },
                        { x: 2, b: 3 },
                        { x: 3, b: 4 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }]);

            expect(Parser.parseLine(state.store.state.code.code[0])).to.deep.equal([
                T_OPCODE("LOAD"),
                T_REGISTER("r1"),
                T_REGISTER("f1.x")
            ])
        });

        it("does nothing when renaming to a column name that already exists on the table", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);

            state.renameTableColumn("f1", "a", "b");
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 2 },
                        { a: 2, b: 3 },
                        { a: 3, b: 4 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }]);
        });

        it("can remove a column from a table", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ c: 12, a: 1, b: 2 }, { c: 12, a: 2, b: 3 }, { c: 12, a: 3, b: 4 }]);

            state.removeTableColumn("f1", "c");
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 2 },
                        { a: 2, b: 3 },
                        { a: 3, b: 4 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }]);
        });

        it("removing the second but last column turns a table into a list", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);

            state.removeTableColumn("f1", "b");
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [1, 2, 3],
                    type: DataFieldType.List,
                    description: null,
                    published: true
                }]);
        });

        it("checks that table data has consistent column names", () => {
            const store = createAppStore();
            const state = new State(store, null);

            expect(() => {
                state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, c: 3 }]);
            }).to.throw;

            expect(() => {
                state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }]);
            }).not.to.throw;
        });

        it("can change the value of a cell in a table", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);
            state.setDataTableCellValue("f1", 0, "b", 17)
            state.setDataTableCellValue("f1", 1, "a", 23)
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 17 },
                        { a: 23, b: 3 },
                        { a: 3, b: 4 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }]);
        });

        it("will do nothing when changing a nonexistent column", () => {
            const store = createAppStore();
            const state = new State(store, null);

            state.addDataField("f1", [{ a: 1, b: 2 }, { a: 2, b: 3 }, { a: 3, b: 4 }]);
            state.setDataTableCellValue("f1", 1, "x", 23)
            expect(state.store.state.data.fields).to.deep.equal([
                {
                    name: "f1",
                    value: [
                        { a: 1, b: 2 },
                        { a: 2, b: 3 },
                        { a: 3, b: 4 }
                    ],
                    type: DataFieldType.Table,
                    description: null,
                    published: true
                }]);
        });
    });

    it('can rename a data field including its usages in the code', () => {
        const store = createAppStore();
        const state = new State(store, null);

        state.addDataField("f1", 10);

        const code = `
                LOAD r2, f1
                ADD r2, 10
            `;

        state.setCodeString(code);

        state.renameDataField("f1", "f2");

        expect(state.store.state.data.fields).to.deep.equal([
            {
                name: "f2", value: 10,
                type: DataFieldType.Number,
                description: null,
                published: true
            }
        ]);

        expect(state.store.state.code.code.map(c => Parser.parseLine(c))).to.deep.equal([
            [T_OPCODE("LOAD"), T_REGISTER("r2"), T_REGISTER("f2")],
            [T_OPCODE("ADD"), T_REGISTER("r2"), T_NUMBER(10)]
        ]);


    });

})
