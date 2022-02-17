export const AppConfig = {

    Keys: {
        DrawCircleKey: "c",
        DrawRectKey: "r",
        DrawLineKey: "l",
        DrawPolygonKey: "p",
        DrawQuadricKey: "q",

        RotateKey: "t",
        MoveKey: "g",
        ScaleKey: "s",

        NextStepCode: "ArrowDown",
        DeleteCode: "Delete",
        ObjectSnapCode: "AltLeft",
        AbortToolKeyCode: "Escape",

        CircleP2PModifierName: "alt",
        ToolAxisAlignModifierName: "shift",
        ObjectSnappingStepModifierName: "shift"
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
        canvasObjectName: "Canvas",

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
            Move: {
                Legacy: "MOVE",
                ByVector: "MOVEBY",
                AlongX: "MOVEX",
                AlongY: "MOVEY",
                ToPoint: "MOVETO"
            },
            FillColor: "FILL",
            FillOpacity: "OPACITY",
            StrokeColor: "STROKE",
            StrokeWidth: "STROKEWIDTH",
            Do: "DO",
            EndDo: "ENDDO",
            ForEach: "FOREACH",
            EndEach: "ENDEACH"
        }
    },

    Data: {
        fieldNamePrefix: "f"
    },

    UICore: {
        appModelName: "appModel"
    }
}