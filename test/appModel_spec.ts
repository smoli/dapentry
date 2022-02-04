import {describe, it} from "mocha";
import {expect} from "chai"
import {AppModel} from "../ui5stuff/model/AppModel";
import {MockJSONModel} from "./testHelpers/mock/mockJSONmodel";
import JSONModel from "sap/ui/model/json/JSONModel";


xdescribe('The AppModel', () => {

    it('can be created', () => {
        const am = new AppModel(new MockJSONModel() as unknown as JSONModel);

        expect(am).to.be.ok;
    });

    it('can store data fields', () => {
        const am = new AppModel(new MockJSONModel() as unknown as JSONModel);
        am.addDataField({name: "demo1", value: "a"});
        am.addDataField({name: "demo2", value: 23});
        am.addDataField({name: "demo3", value: [1, 2, 3, "23"]});

        expect(am.getDataField("demo1")).to.deep.equal({name: "demo1", value: "a"});
        expect(am.getDataField("demo2")).to.deep.equal({name: "demo2", value: 23});
        expect(am.getDataField("demo3")).to.deep.equal({name: "demo3", value: [1, 2, 3, "23"]});
    });

    it('creates the proper code for data fields', () => {
        const am = new AppModel(new MockJSONModel() as unknown as JSONModel);
        am.addDataField({name: "demo1", value: "a"});
        am.addDataField({name: "demo2", value: 23});
        am.addDataField({name: "demo3", value: [1, 2, 3, "23"]});

        expect(am.scopeCodeLength).to.equal(3);
        expect(am.fullCode).to.deep.equal([
                'LOAD demo1, "a"',
                'LOAD demo2, 23',
                'LOAD demo3, [1,2,3,"23"]'
            ]
        )
    })
});