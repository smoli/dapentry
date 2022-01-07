import {describe, it} from "mocha";
import {expect} from "chai"
import {JSONModelAccess} from "../../src/JSONModelAccess";
import JSONModel from "sap/ui/model/json/JSONModel";
import exp = require("constants");


class MockJSONModel {

    public data: any;

    constructor() {
        this.data = {}
    }

    setData(data: any) {
        this.data = data;
    }

    getParts(path) {
        if (!path) {
            return null;
        }
        const parts = path.split("/");
        // Remove the leading /
        parts.shift();

        return parts;
    }

    setProperty(path, value) {
        console.log("setting", path)
        const parts = this.getParts(path);
        let data = this.data;
        const last = parts.pop();
        for (const p of parts) {
            data = data[p]
        }

        data[last] = value;
    }

    getProperty(path) {
        console.log("getting", path)
        if (!path) {
            return undefined;
        }
        const parts = this.getParts(path);


        const walk = (n, i) => {
            const part = parts[i];
            if (!n) {
                return undefined;
            }
            const newN = n[part];
            i++;
            if (i < parts.length) {
                return walk(newN, i);
            }
            return newN
        }

        return walk(this.data, 0)
    }

}


describe('JSONModelAccess', () => {

    const model = new MockJSONModel();
    const ma = new JSONModelAccess(model as unknown as JSONModel);
    const demoData = {
        list: [1, 2, 3, 4],
        invoices: [
            {
                title: "Title 1",
                address: {name: "Jon Doe", street: "Somestreet", city: "Overthere"},
                positions: [
                    {
                        num: 10,
                        article: "GoodStuff",
                        amount: 5,
                        price: {amount: 4, currency: "EUR"},
                        list: [1, 2, 3, 4],
                    }
                ]
            },
            {
                title: "Title 2",
                address: {name: "Jane Doe", street: "Elmstreet", city: "Othertown"},
                positions: [
                    {
                        num: 10,
                        article: "BadStuff",
                        amount: 5,
                        price: {amount: 4, currency: "EUR"},
                        list: [1, 2, 3, 4],
                    },
                    {
                        num: 20,
                        article: "GoodStuff",
                        amount: 5,
                        price: {amount: 4, currency: "EUR"}
                    },
                ]
            }
        ]
    };

    beforeEach(() => {
        model.setData(JSON.parse(JSON.stringify(demoData)));
    })

    it('simplifies accessing deep structures in model data', () => {
        expect(ma.get("invoices", 0, "title")).to.equal("Title 1");
        expect(ma.get("invoices", i => i.title === "Title 2", "address/name")).to.equal("Jane Doe")
        expect(ma.get("invoices", i => i.title === "Title 2")).to.deep.equal(demoData.invoices[1])
    });

    it("returns undefined if the requested data does not exist", () => {
        expect(ma.get("invoices", 12, "title")).to.be.undefined;
        expect(ma.get("invoices", i => i.title === "NOT HERE")).to.be.undefined;
    });

    it('can set values', () => {
        ma.set("invoices", 0, "title").to("Modified")
        expect(ma.get("invoices", 0, "title")).to.equal("Modified");
        ma.set("invoices", i => i.title === "Title 2", "address/name").to("Jane Austen")
        expect(ma.get("invoices", i => i.title === "Title 2", "address/name")).to.equal("Jane Austen");
    });

    it('can create new properties by setting values on objects', () => {
        ma.set("invoices", 0, "newProperty").to("added")
        expect(ma.get("invoices", 0, "newProperty")).to.equal("added");
    });

    it('push to arrays', () => {
        ma.push(5).to("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list");
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 2, 3, 4, 5])
    });

    it('can pop from arrays', () => {
        ma.pop().from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list");
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 2, 3])
    });

    it('can insert into arrays', () => {
        ma.insert(10)
            .into("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
            .at(1);
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 10, 2, 3, 4]);

        ma.insert(11, 12, 13, 14)
            .into("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
            .at(3);
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 10, 2, 11, 12, 13, 14, 3, 4])

    })

    it('can remove properties from objects', () => {
        ma.remove("list").from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10);
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10)
            .hasOwnProperty("list"))
            .to.be.false;
    });

    it('can remove entries from arrays', () => {

        // by index
        ma.remove(2).from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 2, 4])

        // by index as a string
        ma.remove("2").from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 2])
    });

    it('can remove entries from arrays by predicate which will remove the first occurrence', () => {

        ma.remove(n => n % 2 === 0).from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([1, 3, 4])

        ma.remove(n => n % 2 === 1).from("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list")
        expect(ma.get("invoices", i => i.title === "Title 2", "positions", p => p.num === 10, "list"))
            .to.deep.equal([3, 4])


    });

});