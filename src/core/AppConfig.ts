export const AppConfig = {

    Keys: {
        DrawCircleKey: "c",
        DrawRectKey: "r",
        DrawLineKey: "l",
        DrawTextKey: "w",
        DrawPolygonKey: "p",
        DrawQuadricKey: "q",

        RotateKey: "t",
        MoveKey: "g",
        ScaleKey: "s",

        NextStepCode: "ArrowDown",
        DeleteCode: "Delete",
        ObjectSnapCode: "Tab",
        AbortToolKeyCode: "Escape",

        CircleP2PModifierName: "alt",
        ToolAxisAlignModifierName: "shift",
        ObjectSnappingStepModifierName: "shift",
        NumericDragModifierName: "ctrlKey"
    },

    Tools: {
        AxisAlignmentThreshold: 20,
        ObjectSnappingStep: 0.05,
        MaxDecimals: 2
    },

    SVG: {
        rendererId: "drawable-drawing",
        canvasBezelSize: 15,
        transformationHandleSize: 10

    },
    Runtime: {
        grObjectsGlobal: true,
        styleRegisterName: "$styles",
        defaultStyleRegisterName: "$styles.default",
        defaultTextStyleRegisterName: "$styles.textDefault",
        canvasObjectName: "Canvas",
        allowedFieldNames: /^[a-zA-Z][a-zA-Z0-9.-]*[a-zA-Z0-9]*$/,
        forbiddenDataFieldNames: [],

        Opcodes: {
            Circle: {
                Legacy: "CIRCLE",
                CenterRadius: "CIRCLECR",
                CenterPoint: "CIRCLECP",
                PointPoint: "CIRCLEPP"
            },
            Rect: {
                Legacy: "RECT",
                PointPoint: "RECTPP",
                CenterWH: "RECTC",
                TopLeftWH: "RECTTL",
                TopRightWH: "RECTTR",
                BottomLeftWH: "RECTBL",
                BottomRightWH: "RECTBR"
            },
            Line: {
                Legacy: "LINE",
                PointPoint: "LINEPP",
                PointVectorLength: "LINEPVL"
            },
            Poly: {
                Create: "POLY",
                Extend: "EXTPOLY"
            },
            Quad: {
                Create: "QUAD"
            },
            Bezier: {
                Create: "BEZIER"
            },
            Move: {
                Legacy: "MOVE",
                ByVector: "MOVEBY",
                AlongX: "MOVEX",
                AlongY: "MOVEY",
                ToPoint: "MOVETO"
            },
            Text: "TEXT",
            FillColor: "FILL",
            FillOpacity: "OPACITY",
            StrokeColor: "STROKE",
            StrokeWidth: "STROKEWIDTH",
            Do: "DO",
            EndDo: "ENDDO",
            ForEach: "FOREACH",
            EndEach: "ENDEACH",
            MakeInstance: "MAKE"
        }
    },

    Data: {
        fieldNamePrefix: "f"
    },

    UICore: {
        appModelName: "appModel"
    },

    API: {
        baseUrl: "http://localhost:8000/api",
        library: "library"
    }
}

AppConfig.Runtime.forbiddenDataFieldNames.push(AppConfig.Runtime.styleRegisterName, AppConfig.Runtime.canvasObjectName);
Object.keys(AppConfig.API)
    .forEach(key => {
        if (key !== "baseUrl") {
            AppConfig.API[key] = AppConfig.API.baseUrl + "/" + AppConfig.API[key];
        }
    });