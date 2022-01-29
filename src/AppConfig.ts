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
        AbortToolKeyCode: 27,

        CircleP2PModifierName: "alt",
        ToolAxisAlignModifierName: "shift",
        ObjectSnappingStepModifierName: "shift"
    },

    Tools: {
        AxisAlignmentThreshold: 20,
        ObjectSnappingStep: 0.05
    },

    SVG: {
        canvasBezelSize: 15,
        transformationHandleRadius: 10,

    },
    Runtime: {
        styleRegisterName: "$styles",
        defaultStyleRegisterName: "$styles.default",
        canvasObjectName: "Canvas"
    }
}