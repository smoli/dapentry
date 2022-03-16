import {describe, it} from "mocha";
import {expect} from "chai"
import {API, FetchFunc} from "../src/api/API";
// @ts-ignore
import {Response} from "node-fetch";
import {mockFetch} from "./testHelpers/mock_fetch";
import {DataFieldType} from "../src/state/modules/Data";
import {AspectRatio} from "../src/geometry/AspectRatio";


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
                "svg_preview": "Hello",
                "preview_vb_width": 123,
                "preview_vb_height": 456,
                "arguments": [
                    {
                        "id": 12,
                        "entry_id": 9,
                        "name": "spokes",
                        "description": "How many spokes",
                        "default": "5",
                        "public": 1,
                        "type": DataFieldType[DataFieldType.Number],
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
                        "type": DataFieldType[DataFieldType.Number],
                        "created_at": "2022-03-01T20:13:30.000000Z",
                        "updated_at": "2022-03-01T20:13:30.000000Z"
                    }
                ],
                "objects": [
                    {
                        "id": 3,
                        "entry_id": 6,
                        "name": "Line1",
                        "published": 0,
                        "guide": 1,
                        "created_at": "2022-03-12T20:37:33.000000Z",
                        "updated_at": "2022-03-12T20:37:33.000000Z"
                    },
                    {
                        "id": 4,
                        "entry_id": 6,
                        "name": "Polygon1",
                        "published": 1,
                        "guide": 0,
                        "created_at": "2022-03-12T20:37:33.000000Z",
                        "updated_at": "2022-03-12T20:37:33.000000Z"
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
                "svgPreview": "Hello",
                "previewVBWidth": 123,
                "previewVBHeight": 456,
                "arguments": [
                    {
                        "id": 12,
                        "name": "spokes",
                        "description": "How many spokes",
                        "default": 5,
                        "type": DataFieldType.Number
                    }
                    ],
                "fields": [
                    {
                        "id": 13,
                        "name": "spokeRatio",
                        "description": "How long are the spokes",
                        "default": 0.50,
                        "type": DataFieldType.Number
                    }
                ],
                objects: [
                    {
                        id: 3,
                        name: "Line1",
                        published: false,
                        isGuide: true
                    }, {
                        id: 4,
                        name: "Polygon1",
                        published: true,
                        isGuide: false
                    }
                ]
            })

        });
    });
})