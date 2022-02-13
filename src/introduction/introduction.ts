import {ApplicationOptions} from "../core/AppController";
import {AspectRatio} from "../geometry/GrCanvas";
import {LayoutOptions, makeDesigner} from "../core/makeDesigner";
import {ToolNames} from "../tools/ToolNames";

const strippedLayout:LayoutOptions = {
    hideFooter: true,
    hideToolbar: true,
    hideHeader: true,
    hideLeftColumn: true,
    hideRightColumn: true,
    hideStatementEditor: true,
    hideToolHint: true };

const wide:ApplicationOptions = { aspectRatio: AspectRatio.ar3_2, drawingWidth: 400, availableTools: [] }
const primitives = [ToolNames.Circle, ToolNames.Rectangle, ToolNames.Line];
makeDesigner("intro-simple-shapes", { ...strippedLayout, hideToolbar: false }, { ...wide, availableTools: primitives });
makeDesigner("intro-hotkeys", strippedLayout, {...wide, availableTools: primitives });
