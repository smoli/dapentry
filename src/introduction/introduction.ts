import {ApplicationOptions} from "../core/AppController";
import {AspectRatio} from "../geometry/GrCanvas";
import {LayoutOptions, makeDesigner} from "../core/makeDesigner";

const strippedLayout:LayoutOptions = {
    hideFooter: true,
    hideHeader: true,
    hideLeftColumn: true,
    hideRightColumn: true,
    hideStatementEditor: true,
    hideToolHint: true };

const wide:ApplicationOptions = { aspectRatio: AspectRatio.ar3_2, drawingWidth: 400 }

makeDesigner("intro-one", strippedLayout, wide);
makeDesigner("intro-two", strippedLayout, wide);
