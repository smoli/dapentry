import {ApplicationOptions} from "../core/AppController";
import {makeDesigner} from "../core/makeDesigner";
import {ToolNames} from "../tools/ToolNames";
import {LayoutOptions} from "../core/layoutOptions";
import {AspectRatio} from "../geometry/AspectRatio";

const strippedLayout: LayoutOptions = {
    hideFooter: true,
    hideToolbar: true,
    hideHeader: true,
    hideLeftColumn: true,
    hideRightColumn: true,
    hideStatementEditor: true,
    hideToolHint: true
};

const wide: ApplicationOptions = { aspectRatio: AspectRatio.ar3_2, drawingHeight: 400, availableTools: [] }
const square: ApplicationOptions = { aspectRatio: AspectRatio.ar1_1, drawingHeight: 400, availableTools: [] }

const primitives = [ToolNames.Circle, ToolNames.Rectangle, ToolNames.Line];
const transformations = [ToolNames.Move, ToolNames.Rotate, ToolNames.Scale];

makeDesigner("intro-simple-shapes", { ...strippedLayout, hideToolbar: false }, {
    ...wide,
    availableTools: primitives,
    features: {
        poi: false
    }
});

makeDesigner("intro-hotkeys", strippedLayout, { ...wide, availableTools: primitives, features: { poi: false } });

makeDesigner("intro-transformations", { ...strippedLayout, hideToolbar: false }, {
    ...wide,
    availableTools: transformations,
    features: {
        poi: false
    }
}, `RECTPP Rectangle1,$styles.default,Canvas@topLeft,Canvas@bottomRight
SCALE Rectangle1, 0.50, 0.50, "center"`);

makeDesigner("intro-snapping", { ...strippedLayout }, {
        ...wide,
        availableTools: [...primitives, ...transformations],
        features: {
            poi: true
        }

    },
    `CIRCLECP Circle2,$styles.default,Canvas@center,Canvas@top
SCALE Circle2, 0.29, 1.00, "left"`);


makeDesigner("intro-dataeditor", { ...strippedLayout, hideLeftColumn: false, hideStepList: false }, {
        ...square,
        features: {
            poi: false
        }
    }, `CIRCLECR Circle1,$styles.default,Canvas@center,radius`,
    {
        radius: 100
    }
);

makeDesigner("intro-data-lists", { ...strippedLayout, hideLeftColumn: false, hideStepList: false }, {
        ...square,
        features: {
            poi: false
        }

    }, `CIRCLECR Circle1,$styles.default,Canvas@center,radius`,
    {
        radius: 100
    }
)

makeDesigner("intro-basic-recording", { ...strippedLayout, hideLeftColumn: false, hideDataEditor: true }, {
        ...square,
        features: {
            poi: false
        }

    }, `CIRCLECR Circle1,$styles.default,Canvas@center,150
RECTTL Rectangle1,$styles.default,(200, 200),150,150
MOVETO Rectangle1@bottom,Circle1@top
ROTATE Rectangle1, 90, Rectangle1@center
SCALEP Rectangle1, "right", Circle1@bottom, "left"
SCALEP Rectangle1, "left", Circle1@top, "right"`
);

makeDesigner("intro-deleting-steps", { ...strippedLayout, hideLeftColumn: false, hideDataEditor: true }, {
        ...square,
        features: {
            poi: false
        }

    }, `CIRCLECR Circle1,$styles.default,Canvas@center,150
RECTTL Rectangle1,$styles.default,(200, 200),150,150
MOVETO Rectangle1@bottom,Circle1@top
ROTATE Rectangle1, 90, Rectangle1@center
SCALEP Rectangle1, "right", Circle1@bottom, "left"
SCALEP Rectangle1, "left", Circle1@top, "right"`
);

makeDesigner("intro-editing-steps", {
        ...strippedLayout,
        hideLeftColumn: false,
        hideDataEditor: true,
        hideStatementEditor: false
    }, {
        ...square,
        features: {
            poi: false
        }

    }, `CIRCLECR Circle1,$styles.default,(200, 200),150`
)


/**
 * DO 4
 * RECTTL Rectangle1,$styles.default,(179.34, 375.90),146.12,133.23
 * MOVETO Rectangle1@bottomLeft,Rectangle1@bottomRight
 * MOVEX Rectangle1@center,21.49
 * ENDDO
 */

makeDesigner("intro-data-loops", {
        ...strippedLayout,
        hideLeftColumn: false,
        hideDataEditor: false,
        hideStatementEditor: false
    }, {
        ...square,
        features: {
            poi: false
        }

    }, `DO 3
RECTTL Rectangle1,$styles.default,(10, 200),30,30
MOVETO Rectangle1@bottomLeft,Rectangle1@bottomRight
MOVEX Rectangle1@center,20
ENDDO`,
    {
        boxes: 6
    }
)