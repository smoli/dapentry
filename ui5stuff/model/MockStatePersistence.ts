import {AbsStatePersistence} from "./AbsStatePersistence";
import {DataFieldInfo} from "./AppState";
import {LibraryEntry, LibraryEntryArgumentType} from "../../src/Library";
import {AspectRatio} from "../../src/geometry/GrCanvas";
import {AppConfig} from "../../src/AppConfig";



const starCode = `COMPOSITE o
LINE Line1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@bottom, Canvas@top
POLY Polygon1, ${AppConfig.Runtime.defaultStyleRegisterName}, [ Line1@end ], 1
DO spokes
ROTATE Line1, 180/ spokes
EXTPOLY Polygon1, [ Line1@(spokeRatio) ]
ROTATE Line1, 180 / spokes
EXTPOLY Polygon1, [ Line1@end ]
ENDDO
FILL Polygon1, "#fce654", 1
APP o.objects, Polygon1`;

const ngonCode = `COMPOSITE o
LINE Line1, ${AppConfig.Runtime.defaultStyleRegisterName}, Canvas@bottom, Canvas@top
POLY Polygon1, ${AppConfig.Runtime.defaultStyleRegisterName}, [ Line1@end ], 1
DO 5
ROTATE Line1, 360 / 5
EXTPOLY Polygon1, [ Line1@end ]
ENDDO
APP o.objects, Polygon1`;



export class MockStatePersistence extends AbsStatePersistence {
    getDataFields(): Promise<Array<DataFieldInfo>> {
        return Promise.resolve([
            {name: "f1", value: [10, 20, 30, 40]},
            {name: "f2", value: 5}
        ]);
    }

    getLibraryEntries(): Promise<Array<LibraryEntry>> {
        return Promise.resolve([
            {
                "id": "star",
                "name": "Star",
                "description": "not the celestial object",
                "author": "",
                "lastUpdate": null,
                "version": "",
                aspectRatio: AspectRatio.ar1_1,
                "arguments": {
                    "spokes": {
                        "type": LibraryEntryArgumentType.Number,
                        "default": 5,
                        "description": "Number of spokes"
                    },
                    "spokeRatio": {
                        "type": LibraryEntryArgumentType.Number,
                        "default": 0.75,
                        "description": "Determines the length of the spokes"
                    }
                },
                "code": starCode
            },
            {
                "id": "ngon",
                "name": "N-Gon",
                "description": "Gon with n corners",
                "author": "",
                lastUpdate: null,
                "version": "",
                aspectRatio: AspectRatio.ar1_1,
                "arguments": {
                    "n": {
                        "type": LibraryEntryArgumentType.Number,
                        "default": 5,
                        "description": "Number of corners"
                    }
                },
                "code": ngonCode
            }

        ]);
    }


}