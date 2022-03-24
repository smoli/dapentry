/**!
 dapentry runtime library
    Copyright 2021-2022 Stephan Smola,
    See https://dapentry.com for more information

 THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
 TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
 THIS SOFTWARE.


 This software uses d3, https://d3js.org:
    Copyright 2010-2022 Mike Bostock
    License: https://github.com/d3/d3/blob/main/LICENSE

 @licence
 */


export {GrCanvas as Canvas} from "../../geometry/GrCanvas";
export {GrLine as Line} from "../../geometry/GrLine";
export {GrRectangle as Rectangle} from "../../geometry/GrRectangle";
export {GrPolygon as Polygon} from "../../geometry/GrPolygon";
export {GrCircle as Circle} from "../../geometry/GrCircle";
export {GrText as Text} from "../../geometry/GrText";
export {AspectRatio} from "../../geometry/AspectRatio";
export {SvgObjectRenderer as SVGRenderer} from "../../ui/drawing/SvgObjectRenderer";

export const defaultStyles = {
    default: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 0.2,
        "strokeWidth": 2,
    },
    textDefault: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 1,
        "strokeWidth": 0,
        "textAlignment": 0,
        "verticalAlignment": 0,
        "fontFamily": "Sans-serif",
        "fontSize": 50,
    }
};

export function distance(x1: number, y1: number, x2: number, y2: number) {
    Math.hypot(x2 - x1, y2 - y1);
}
