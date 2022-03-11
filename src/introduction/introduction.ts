import {ApplicationOptions} from "../core/AppController";
import {AspectRatio} from "../geometry/GrCanvas";
import {makeDesigner} from "../core/makeDesigner";
import {ToolNames} from "../tools/ToolNames";
import {LayoutOptions} from "../core/layoutOptions";

const strippedLayout: LayoutOptions = {
    hideFooter: true,
    hideToolbar: true,
    hideHeader: true,
    hideLeftColumn: true,
    hideRightColumn: true,
    hideStatementEditor: true,
    hideToolHint: true
};

const wide: ApplicationOptions = {aspectRatio: AspectRatio.ar3_2, drawingHeight: 600, availableTools: []}
const primitives = [ToolNames.Circle, ToolNames.Rectangle, ToolNames.Line];
const transformations = [ToolNames.Move, ToolNames.Rotate, ToolNames.Scale];

makeDesigner("intro-simple-shapes", {...strippedLayout, hideToolbar: false}, {
    ...wide,
    availableTools: primitives,
    poiAvailable: false
});

makeDesigner("intro-hotkeys", strippedLayout, {...wide, availableTools: primitives, poiAvailable: false});

makeDesigner("intro-transformations", {...strippedLayout, hideToolbar: false}, {
    ...wide,
    availableTools: transformations,
    poiAvailable: false
},`RECTPP Rectangle1,$styles.default,Canvas@topLeft,Canvas@bottomRight
SCALE Rectangle1, 0.50, 0.50, "center"`);

makeDesigner("intro-snapping", strippedLayout, {...wide, availableTools: [...primitives, ...transformations], poiAvailable: true},
    `CIRCLECP Circle2,$styles.default,Canvas@center,Canvas@top
SCALE Circle2, 0.29, 1.00, "left"`);
