import {describe, it} from "mocha";
import {expect} from "chai"
import {API, FetchFunc} from "../src/api/API";
// @ts-ignore
import {Response} from "node-fetch";
import {mockFetch} from "./testHelpers/mock_fetch";
import {AspectRatio} from "../src/geometry/GrCanvas";


describe("API", () => {
    it('determine if a name exists', async () => {

        API.setFetch(mockFetch(200, [{ name: "C" }]));
        let r = await API.doesNameExist("C");
        expect(r).to.deep.equal({
            apiReachable: true,
            data: true,
            status: 200
        });

        API.setFetch(mockFetch(200, []));
        r = await API.doesNameExist("D");
        expect(r).to.deep.equal({
            apiReachable: true,
            data: false,
            status: 200
        });
    });

    describe('Reading the library', () => {
        it('can convert from the api format into the app format', () => {

            const apiData = {
                "id": 9,
                "name": "Star",
                "description": "Star",
                "code": "COMPOSITE o\nLINEPP Line1, $styles.default, Canvas@center, Canvas@top\nPOLY Polygon1, $styles.default, [ Line1@end ], 1\nDO spokes\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@(spokeRatio) ]\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@end ]\nENDDO\nAPP o.objects, Polygon1",
                "aspect": "ar1_1",
                "created_at": "2022-03-01T20:13:30.000000Z",
                "updated_at": "2022-03-01T20:13:30.000000Z",
                "arguments": [
                    {
                        "id": 12,
                        "entry_id": 9,
                        "name": "spokes",
                        "description": "How many spokes",
                        "default": "5",
                        "public": 1,
                        "created_at": "2022-03-01T20:13:30.000000Z",
                        "updated_at": "2022-03-01T20:13:30.000000Z"
                    },
                    {
                        "id": 13,
                        "entry_id": 9,
                        "name": "spokeRatio",
                        "description": "How long are the spokes",
                        "default": "0.50",
                        "public": 0,
                        "created_at": "2022-03-01T20:13:30.000000Z",
                        "updated_at": "2022-03-01T20:13:30.000000Z"
                    }
                ]
            }

            const le = API.convertAPILibraryEntry(apiData);

            expect(le).to.deep.equal({
                "id": 9,
                "name": "Star",
                "description": "Star",
                "code": "COMPOSITE o\nLINEPP Line1, $styles.default, Canvas@center, Canvas@top\nPOLY Polygon1, $styles.default, [ Line1@end ], 1\nDO spokes\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@(spokeRatio) ]\nROTATE Line1, 180 / spokes, Line1@start\nEXTPOLY Polygon1, [ Line1@end ]\nENDDO\nAPP o.objects, Polygon1",
                "aspectRatio": AspectRatio.ar1_1,
                "created_at": "2022-03-01T20:13:30.000000Z",
                "updated_at": "2022-03-01T20:13:30.000000Z",
                "arguments": [
                    {
                        "id": 12,
                        "entry_id": 9,
                        "name": "spokes",
                        "description": "How many spokes",
                        "default": 5,
                        "public": 1,
                        "created_at": "2022-03-01T20:13:30.000000Z",
                        "updated_at": "2022-03-01T20:13:30.000000Z"
                    }
                    ],
                "fields": [
                    {
                        "id": 13,
                        "entry_id": 9,
                        "name": "spokeRatio",
                        "description": "How long are the spokes",
                        "default": 0.50,
                        "public": 0,
                        "created_at": "2022-03-01T20:13:30.000000Z",
                        "updated_at": "2022-03-01T20:13:30.000000Z"
                    }
                ]
            })

        });
    });
})