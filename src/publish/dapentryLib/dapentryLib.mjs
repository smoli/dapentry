function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}
var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire592b"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire592b"] = parcelRequire;
}
var $f794df200bdd1c64$exports = {};

$parcel$export($f794df200bdd1c64$exports, "$styles", () => $f794df200bdd1c64$export$bb7311ec83c149ab);
$parcel$export($f794df200bdd1c64$exports, "hoistObjects", () => $f794df200bdd1c64$export$eb688b4a3b171f3d);
$parcel$export($f794df200bdd1c64$exports, "makeObjectManager", () => $f794df200bdd1c64$export$9a199263f62e818d);
$parcel$export($f794df200bdd1c64$exports, "Canvas", () => $b834cbea40bafe97$export$9b40e5dd2ee321ea);
$parcel$export($f794df200bdd1c64$exports, "Line", () => $973b23ce99918ba1$export$37563e431fdea7bd);
$parcel$export($f794df200bdd1c64$exports, "Rectangle", () => $d4397e41424130cc$export$30a59a0caead8e7a);
$parcel$export($f794df200bdd1c64$exports, "Polygon", () => $7f75fa07e5d188f3$export$150c260caa43ceb8);
$parcel$export($f794df200bdd1c64$exports, "Circle", () => $f5a4253b3c677715$export$25ceb2c69899a589);
$parcel$export($f794df200bdd1c64$exports, "Text", () => $56919d7b8c67450a$export$23e702491ed1c44c);
$parcel$export($f794df200bdd1c64$exports, "AspectRatio", () => $9b7a75a9356c9401$export$e840e8869344ca38);
class $bcd40cdc131f79c5$export$6212d225472eb66a {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
    get copy() {
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(this.x, this.y);
    }
    add(p) {
        this.x += p.x;
        this.y += p.y;
        return this;
    }
    sub(p) {
        this.x -= p.x;
        this.y -= p.y;
        return this;
    }
    scale(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    dot(p) {
        return this.x * p.x + this.y * p.y;
    }
    rotate(angle, pivot) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        if (!pivot) {
            let x;
            x = this.x * c - this.y * s;
            this.y = this.x * s + this.y * c;
            this.x = x;
        } else {
            let x;
            x = (this.x - pivot.x) * c - (this.y - pivot.y) * s + pivot.x;
            this.y = (this.x - pivot.x) * s + (this.y - pivot.y) * c + pivot.y;
            this.x = x;
        }
        return this;
    }
    normalize() {
        return this.scale(1 / this.length);
    }
    get length() {
        return Math.hypot(this.x, this.y);
    }
    angleTo(v2) {
        return Math.atan2(this.y, this.x) - Math.atan2(v2.y, v2.x);
    }
    distanceToPoint(p) {
        return p.copy.sub(this).length;
    }
    distanceSquared(p) {
        return Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2);
    }
    abs() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    }
    getPerpendicular() {
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(-this.y, this.x);
    }
    projectOnLine(line) {
        if (line.pointOnLine(this)) return this.copy;
        const p0 = line.n.copy.scale(line.d);
        let a = (this.x - p0.x) * line.n.x + (this.y - p0.y) * line.n.y;
        a /= Math.pow(line.n.x, 2) + Math.pow(line.n.y, 2);
        return this.copy.sub(line.n.copy.scale(a));
    }
}


function $ad5b03a8205d6f7a$export$b2ba2578f2c43d74(rad) {
    return rad * 180 / Math.PI;
}
function $ad5b03a8205d6f7a$export$b1b275608b2b1b8(deg) {
    return deg * Math.PI / 180;
}
function $ad5b03a8205d6f7a$export$bb628a54ab399bc9(p, angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    return new $bcd40cdc131f79c5$export$6212d225472eb66a(p.x * c - p.y * s, p.x * s + p.y * c);
}
function $ad5b03a8205d6f7a$export$9fc82269ce6040df(p, angle, pivot) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const x = p.x - pivot.x;
    const y = p.y - pivot.y;
    return new $bcd40cdc131f79c5$export$6212d225472eb66a(x * c - y * s + pivot.x, x * s + y * c + pivot.y);
}
function $ad5b03a8205d6f7a$export$cb65b2ef163ba1b6(oldPoint, pivot, newPoint) {
    const oldDx = oldPoint.x - pivot.x;
    const oldDy = oldPoint.y - pivot.y;
    const newDx = newPoint.x - pivot.x;
    const newDy = newPoint.y - pivot.y;
    let fx = $ad5b03a8205d6f7a$export$9663ddc1cf085b32(oldDx, 0) ? 1 : newDx / oldDx;
    let fy = $ad5b03a8205d6f7a$export$9663ddc1cf085b32(oldDy, 0) ? 1 : newDy / oldDy;
    return {
        fx: fx,
        fy: fy
    };
}
function $ad5b03a8205d6f7a$export$ba3dd70ec20ecc6e(fx, fy) {
    return Math.max(fx, fy);
}
const $ad5b03a8205d6f7a$export$fd293b15f47e270 = 0.0000001;
const $ad5b03a8205d6f7a$export$6eec49b1a6289c4e = Math.PI * 2;
function $ad5b03a8205d6f7a$export$9663ddc1cf085b32(a, b) {
    return Math.abs(a - b) <= $ad5b03a8205d6f7a$export$fd293b15f47e270;
}
function $ad5b03a8205d6f7a$export$42b5981aee884db0(p1, p2) {
    return $ad5b03a8205d6f7a$export$9663ddc1cf085b32(p1.x, p2.x) && $ad5b03a8205d6f7a$export$9663ddc1cf085b32(p1.y, p2.y);
}



var $9b7a75a9356c9401$export$e840e8869344ca38;
(function($9b7a75a9356c9401$export$e840e8869344ca38) {
    $9b7a75a9356c9401$export$e840e8869344ca38[$9b7a75a9356c9401$export$e840e8869344ca38["ar1_1"] = 0] = "ar1_1";
    $9b7a75a9356c9401$export$e840e8869344ca38[$9b7a75a9356c9401$export$e840e8869344ca38["ar3_2"] = 1] = "ar3_2";
    $9b7a75a9356c9401$export$e840e8869344ca38[$9b7a75a9356c9401$export$e840e8869344ca38["ar4_3"] = 2] = "ar4_3";
    $9b7a75a9356c9401$export$e840e8869344ca38[$9b7a75a9356c9401$export$e840e8869344ca38["ar16_10"] = 3] = "ar16_10";
    $9b7a75a9356c9401$export$e840e8869344ca38[$9b7a75a9356c9401$export$e840e8869344ca38["ar16_9"] = 4] = "ar16_9";
})($9b7a75a9356c9401$export$e840e8869344ca38 || ($9b7a75a9356c9401$export$e840e8869344ca38 = {}));


var $42e058c3e4f21d4d$export$b79252dea7700023;
(function($42e058c3e4f21d4d$export$b79252dea7700023) {
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Select"] = 0] = "Select";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Circle"] = 1] = "Circle";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Rectangle"] = 2] = "Rectangle";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Line"] = 3] = "Line";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Text"] = 4] = "Text";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Polygon"] = 5] = "Polygon";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Quadric"] = 6] = "Quadric";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Instance"] = 7] = "Instance";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Move"] = 8] = "Move";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Rotate"] = 9] = "Rotate";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["Scale"] = 10] = "Scale";
    $42e058c3e4f21d4d$export$b79252dea7700023[$42e058c3e4f21d4d$export$b79252dea7700023["None"] = 11] = "None";
})($42e058c3e4f21d4d$export$b79252dea7700023 || ($42e058c3e4f21d4d$export$b79252dea7700023 = {}));


const $620bb2240d4be70e$export$d67e1898834e3885 = {
    dapentry: {
        version: "0.1"
    },
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
        MarkAsGuideKey: "h",
        NextStepCode: "ArrowDown",
        DeleteCode: "Delete",
        ObjectSnapCode: "Tab",
        AbortToolKeyCode: "Escape",
        CircleP2PModifierName: "alt",
        ToolAxisAlignModifierName: "shift",
        ObjectSnappingStepModifierName: "shift",
        NumericDragModifierName: "ctrlKey",
        UndoKey: "z",
        UndoModifier: "ctrlKey"
    },
    Actions: {
        LoopStatements: {
            iterations: 4
        }
    },
    Tools: {
        AxisAlignmentThreshold: 20,
        ObjectSnappingStep: 0.05,
        MaxDecimals: 2
    },
    Drawing: {
        InitialAspectRatio: $9b7a75a9356c9401$export$e840e8869344ca38.ar4_3,
        Height: 1000
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
        allowedColumnNames: /^[a-zA-Z][a-zA-Z0-9]*$/,
        forbiddenDataFieldNames: [],
        Opcodes: {
            Append: "APP",
            Composite: "COMPOSITE",
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
            Scale: {
                Factor: "SCALE",
                FactorUniform: "SCALEU",
                ToPoint: "SCALEP",
                ToPointUniform: "SCALEPU"
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
            MakeInstance: "MAKE",
            Rotate: "ROTATE"
        }
    },
    Data: {
        fieldNamePrefix: "f"
    },
    UI: {
        appModelName: "appModel",
        cursorForTool: {
            [$42e058c3e4f21d4d$export$b79252dea7700023.Circle]: "crosshair",
            [$42e058c3e4f21d4d$export$b79252dea7700023.Rectangle]: "crosshair",
            [$42e058c3e4f21d4d$export$b79252dea7700023.Line]: "crosshair",
            [$42e058c3e4f21d4d$export$b79252dea7700023.Polygon]: "crosshair",
            [$42e058c3e4f21d4d$export$b79252dea7700023.Quadric]: "crosshair",
            [$42e058c3e4f21d4d$export$b79252dea7700023.Instance]: "crosshair"
        }
    },
    API: {
        baseUrl: "https://api.dapentry.com",
        library: "library",
        names: "names",
        login: "login",
        register: "register",
        logout: "logout",
        user: "user"
    }
};
$620bb2240d4be70e$export$d67e1898834e3885.Runtime.forbiddenDataFieldNames.push($620bb2240d4be70e$export$d67e1898834e3885.Runtime.styleRegisterName, $620bb2240d4be70e$export$d67e1898834e3885.Runtime.canvasObjectName);
Object.keys($620bb2240d4be70e$export$d67e1898834e3885.API).forEach((key)=>{
    if (key !== "baseUrl") $620bb2240d4be70e$export$d67e1898834e3885.API[key] = $620bb2240d4be70e$export$d67e1898834e3885.API.baseUrl + "/" + $620bb2240d4be70e$export$d67e1898834e3885.API[key];
});


var $92808e6f1672ab53$export$53f0d9fcb05d9d1d;
(function($92808e6f1672ab53$export$53f0d9fcb05d9d1d) {
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Canvas"] = 0] = "Canvas";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Circle"] = 1] = "Circle";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Rectangle"] = 2] = "Rectangle";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Ellipse"] = 3] = "Ellipse";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Square"] = 4] = "Square";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Line"] = 5] = "Line";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Text"] = 6] = "Text";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Polygon"] = 7] = "Polygon";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Quadratic"] = 8] = "Quadratic";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Bezier"] = 9] = "Bezier";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["List"] = 10] = "List";
    $92808e6f1672ab53$export$53f0d9fcb05d9d1d[$92808e6f1672ab53$export$53f0d9fcb05d9d1d["Composite"] = 11] = "Composite";
})($92808e6f1672ab53$export$53f0d9fcb05d9d1d || ($92808e6f1672ab53$export$53f0d9fcb05d9d1d = {}));
var $92808e6f1672ab53$export$595246eedb19e9bc;
(function($92808e6f1672ab53$export$595246eedb19e9bc) {
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["center"] = 0] = "center";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["top"] = 1] = "top";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["left"] = 2] = "left";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["bottom"] = 3] = "bottom";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["right"] = 4] = "right";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["start"] = 5] = "start";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["end"] = 6] = "end";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["topLeft"] = 7] = "topLeft";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["topRight"] = 8] = "topRight";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["bottomLeft"] = 9] = "bottomLeft";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["bottomRight"] = 10] = "bottomRight";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P0"] = 11] = "P0";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P1"] = 12] = "P1";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P2"] = 13] = "P2";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P3"] = 14] = "P3";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P4"] = 15] = "P4";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P5"] = 16] = "P5";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P6"] = 17] = "P6";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P7"] = 18] = "P7";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P8"] = 19] = "P8";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P9"] = 20] = "P9";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P10"] = 21] = "P10";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P11"] = 22] = "P11";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P12"] = 23] = "P12";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P13"] = 24] = "P13";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P14"] = 25] = "P14";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P15"] = 26] = "P15";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P16"] = 27] = "P16";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P17"] = 28] = "P17";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P18"] = 29] = "P18";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P19"] = 30] = "P19";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P20"] = 31] = "P20";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P21"] = 32] = "P21";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P22"] = 33] = "P22";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P23"] = 34] = "P23";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P24"] = 35] = "P24";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P25"] = 36] = "P25";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P26"] = 37] = "P26";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P27"] = 38] = "P27";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P28"] = 39] = "P28";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P29"] = 40] = "P29";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P30"] = 41] = "P30";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P31"] = 42] = "P31";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P32"] = 43] = "P32";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P33"] = 44] = "P33";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P34"] = 45] = "P34";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P35"] = 46] = "P35";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P36"] = 47] = "P36";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P37"] = 48] = "P37";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P38"] = 49] = "P38";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P39"] = 50] = "P39";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P40"] = 51] = "P40";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P41"] = 52] = "P41";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P42"] = 53] = "P42";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P43"] = 54] = "P43";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P44"] = 55] = "P44";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P45"] = 56] = "P45";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P46"] = 57] = "P46";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P47"] = 58] = "P47";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P48"] = 59] = "P48";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P49"] = 60] = "P49";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P50"] = 61] = "P50";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P51"] = 62] = "P51";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P52"] = 63] = "P52";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P53"] = 64] = "P53";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P54"] = 65] = "P54";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P55"] = 66] = "P55";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P56"] = 67] = "P56";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P57"] = 68] = "P57";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P58"] = 69] = "P58";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P59"] = 70] = "P59";
    $92808e6f1672ab53$export$595246eedb19e9bc[$92808e6f1672ab53$export$595246eedb19e9bc["P60"] = 71] = "P60";
})($92808e6f1672ab53$export$595246eedb19e9bc || ($92808e6f1672ab53$export$595246eedb19e9bc = {}));
var $92808e6f1672ab53$export$58fb1881ac046f3b;
(function($92808e6f1672ab53$export$58fb1881ac046f3b) {
    $92808e6f1672ab53$export$58fb1881ac046f3b[$92808e6f1672ab53$export$58fb1881ac046f3b["MANIPULATION"] = 0] = "MANIPULATION";
    $92808e6f1672ab53$export$58fb1881ac046f3b[$92808e6f1672ab53$export$58fb1881ac046f3b["SCALING"] = 1] = "SCALING";
    $92808e6f1672ab53$export$58fb1881ac046f3b[$92808e6f1672ab53$export$58fb1881ac046f3b["ROTATING"] = 2] = "ROTATING";
    $92808e6f1672ab53$export$58fb1881ac046f3b[$92808e6f1672ab53$export$58fb1881ac046f3b["SNAPPING"] = 3] = "SNAPPING";
})($92808e6f1672ab53$export$58fb1881ac046f3b || ($92808e6f1672ab53$export$58fb1881ac046f3b = {}));
var $92808e6f1672ab53$export$95b6e4ac77d39d0e;
(function($92808e6f1672ab53$export$95b6e4ac77d39d0e) {
    $92808e6f1672ab53$export$95b6e4ac77d39d0e[$92808e6f1672ab53$export$95b6e4ac77d39d0e["UNIFORM"] = 0] = "UNIFORM";
    $92808e6f1672ab53$export$95b6e4ac77d39d0e[$92808e6f1672ab53$export$95b6e4ac77d39d0e["NONUNIFORM"] = 1] = "NONUNIFORM";
})($92808e6f1672ab53$export$95b6e4ac77d39d0e || ($92808e6f1672ab53$export$95b6e4ac77d39d0e = {}));
let $92808e6f1672ab53$var$objCounter = 1;
class $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(type, name, x, y){
        this._parent = null;
        this._isGuide = false;
        this._xAxis = new $bcd40cdc131f79c5$export$6212d225472eb66a(1, 0);
        this._yAxis = new $bcd40cdc131f79c5$export$6212d225472eb66a(0, 1);
        this._style = null;
        this._instanceCount = $92808e6f1672ab53$export$ad0875ee5f43e1f._instanceCounter++;
        this._selectable = true;
        this._uniqueName = name;
        this._center = new $bcd40cdc131f79c5$export$6212d225472eb66a(x, y);
        this._type = type;
        if (name === null) this._makeName();
        else $92808e6f1672ab53$export$ad0875ee5f43e1f.addName(this._uniqueName);
    }
    static nameExists(name) {
        return $92808e6f1672ab53$export$ad0875ee5f43e1f._objectNames.indexOf(name) !== -1;
    }
    static removeName(name) {
        const i = $92808e6f1672ab53$export$ad0875ee5f43e1f._objectNames.indexOf(name);
        if (i !== -1) $92808e6f1672ab53$export$ad0875ee5f43e1f._objectNames.splice(i, 1);
    }
    static addName(name) {
        $92808e6f1672ab53$export$ad0875ee5f43e1f._objectNames.push(name);
    }
    static makeNewObjectName(prefix) {
        let counter = 1;
        while($92808e6f1672ab53$export$ad0875ee5f43e1f.nameExists(prefix + counter))counter++;
        return prefix + counter;
    }
    static getNewObjectName(prefix) {
        const name = $92808e6f1672ab53$export$ad0875ee5f43e1f.makeNewObjectName(prefix);
        $92808e6f1672ab53$export$ad0875ee5f43e1f.addName(name);
        return name;
    }
    get isGuide() {
        return this._isGuide;
    }
    markAsGuide(value = true) {
        this._isGuide = value;
    }
    createProxy() {
        const copy = this.copy();
        copy._style = Object.assign({}, this._style);
        copy._xAxis = this._xAxis.copy;
        copy._yAxis = this._yAxis.copy;
        if (this.isGuide) copy.markAsGuide();
        return copy;
    }
    set isSelectable(value) {
        this._selectable = value;
    }
    get isSelectable() {
        return this._selectable;
    }
    setParent(value) {
        this._parent = value;
    }
    get parent() {
        return this._parent;
    }
    get instanceCount() {
        return this._instanceCount;
    }
    get type() {
        return this._type;
    }
    _makeName() {
        this._uniqueName = $92808e6f1672ab53$export$ad0875ee5f43e1f.getNewObjectName($92808e6f1672ab53$export$53f0d9fcb05d9d1d[this._type]);
    }
    get id() {
        return this._uniqueName;
    }
    set uniqueName(value) {
        $92808e6f1672ab53$export$ad0875ee5f43e1f.removeName(this._uniqueName);
        this._uniqueName = value;
        if (!$92808e6f1672ab53$export$ad0875ee5f43e1f.nameExists(value)) $92808e6f1672ab53$export$ad0875ee5f43e1f.addName(value);
    }
    get uniqueName() {
        return this._uniqueName;
    }
    get name() {
        if (this._parent) return this._parent.uniqueName;
        return this._uniqueName;
    }
    get style() {
        return this._style;
    }
    set style(value) {
        this._style = Object.assign({}, value);
    }
    set fillColor(value) {
        this._style.fillColor = value;
    }
    set fillOpacity(value) {
        this._style.fillOpacity = value;
    }
    set strokeWidth(value) {
        this._style.strokeWidth = value;
    }
    set strokeColor(value) {
        this._style.strokeColor = value;
    }
    get fillColor() {
        return this._style.fillColor;
    }
    get fillOpacity() {
        return this._style.fillOpacity;
    }
    get strokeWidth() {
        return this._style.strokeWidth;
    }
    get strokeColor() {
        return this._style.strokeColor;
    }
    get y() {
        return this._center.y;
    }
    set y(value) {
        this._center.y = value;
    }
    get x() {
        return this._center.x;
    }
    set x(value) {
        this._center.x = value;
    }
    get yAxis() {
        return this._yAxis;
    }
    get xAxis() {
        return this._xAxis;
    }
    rotateByDeg(value, pivot = null) {
        this._xAxis.rotate($ad5b03a8205d6f7a$export$b1b275608b2b1b8(value));
        this._yAxis.rotate($ad5b03a8205d6f7a$export$b1b275608b2b1b8(value));
    }
    rotatePOI(poi, value) {
        this.rotateByDeg(value, this.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[this.getPivotFor(poi, $92808e6f1672ab53$export$58fb1881ac046f3b.ROTATING)]);
    }
    getScaleResetInfo() {
        return null;
    }
    resetScaling(scaleResetInfo) {}
    scale(fx, fy, pivot = null) {}
    scaleToPoint(ownPoi, pivot = null, target) {}
    get supportedScaleModes() {
        return [
            $92808e6f1672ab53$export$95b6e4ac77d39d0e.NONUNIFORM,
            $92808e6f1672ab53$export$95b6e4ac77d39d0e.UNIFORM
        ];
    }
    get boundingBox() {
        return {
            x: this.x,
            y: this.y,
            w: 0,
            h: 0
        };
    }
    get center() {
        return this._center;
    }
    get bottom() {
        return this._yAxis.copy.scale(this.boundingBox.h / 2).add(this._center);
    }
    get left() {
        return this._xAxis.copy.scale(-this.boundingBox.w / 2).add(this._center);
    }
    get top() {
        return this._yAxis.copy.scale(-this.boundingBox.h / 2).add(this._center);
    }
    get right() {
        return this._xAxis.copy.scale(this.boundingBox.w / 2).add(this._center);
    }
    pointsOfInterest(purpose) {
        return {
            [$92808e6f1672ab53$export$595246eedb19e9bc.center]: this.center.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.top]: this.top.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottom]: this.bottom.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.left]: this.left.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.right]: this.right.copy
        };
    }
    getPivotFor(poi, forPurpose) {
        if (forPurpose === $92808e6f1672ab53$export$58fb1881ac046f3b.ROTATING) return $92808e6f1672ab53$export$595246eedb19e9bc.center;
        switch(poi){
            case $92808e6f1672ab53$export$595246eedb19e9bc.center:
                return null;
            case $92808e6f1672ab53$export$595246eedb19e9bc.top:
                return $92808e6f1672ab53$export$595246eedb19e9bc.bottom;
            case $92808e6f1672ab53$export$595246eedb19e9bc.left:
                return $92808e6f1672ab53$export$595246eedb19e9bc.right;
            case $92808e6f1672ab53$export$595246eedb19e9bc.bottom:
                return $92808e6f1672ab53$export$595246eedb19e9bc.top;
            case $92808e6f1672ab53$export$595246eedb19e9bc.right:
                return $92808e6f1672ab53$export$595246eedb19e9bc.left;
            default:
                return null;
        }
    }
    movePOI(poi, byVector) {
        this._center.add(byVector);
    }
    getPointAtPercentage(pct) {
        return this.center;
    }
    makePoint(x, y) {
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(this._center.x + this._xAxis.x * x + this._yAxis.x * y, this._center.y + this._xAxis.y * x + this._yAxis.y * y);
    }
    projectPointAsPercentage(point) {
        return 0;
    }
    projectPoint(point) {
        return null;
    }
    at(where) {
        if (typeof where === "number") return this.getPointAtPercentage(where);
        else if (typeof where === "string") {
            const poi = this.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[$92808e6f1672ab53$export$595246eedb19e9bc[where]];
            if (poi) return poi;
            const publ = this.publishedProperties.find((p)=>p.id === where
            );
            if (publ) return publ.value;
        } else throw new Error(`Unknown location ${where} on ${$92808e6f1672ab53$export$53f0d9fcb05d9d1d[this.type]}`);
    }
    mapLocalToWorld(l) {
        return this.mapVectorToGlobal(l).add(this._center);
    }
    mapVectorToGlobal(v) {
        const gx = this._xAxis.x * v.x + this._yAxis.x * v.y;
        const gy = this._xAxis.y * v.x + this._yAxis.y * v.y;
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(gx, gy);
    }
    mapVectorToLocal(v) {
        const lx = this._xAxis.x * v.x + this._xAxis.y * v.y;
        const ly = this._yAxis.x * v.x + this._yAxis.y * v.y;
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(lx, ly);
    }
    mapPointToLocal(g) {
        return this.mapVectorToLocal(g.copy.sub(this._center));
    }
    get publishedProperties() {
        return [
            {
                name: "Instance",
                id: "instance",
                value: this._instanceCount
            },
            {
                name: "Rotation",
                id: "rotation",
                value: $ad5b03a8205d6f7a$export$b2ba2578f2c43d74(this._xAxis.angleTo(new $bcd40cdc131f79c5$export$6212d225472eb66a(1, 0)))
            }
        ];
    }
}
$92808e6f1672ab53$export$ad0875ee5f43e1f._instanceCounter = 0;
$92808e6f1672ab53$export$ad0875ee5f43e1f._objectNames = [
    $620bb2240d4be70e$export$d67e1898834e3885.Runtime.canvasObjectName
];



class $e60ec5afccde461f$var$ObjectArray extends Array {
    set baseName(value) {
        this._baseName = value;
    }
    push(...items) {
        let index = this.length;
        const r = super.push(...items);
        items.forEach((obj, i)=>{
            obj.uniqueName = this._baseName + "-" + (index + i);
        });
        return r;
    }
    get last() {
        if (this.length) return this[this.length - 1];
        return undefined;
    }
}
class $e60ec5afccde461f$export$fefeb732093e696a extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(name){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.List, name, 0, 0);
        this._objects = new $e60ec5afccde461f$var$ObjectArray();
        this._objects.baseName = this.uniqueName;
    }
    copy() {
        const copy = new $e60ec5afccde461f$export$fefeb732093e696a(this._uniqueName);
        copy._objects = this._objects;
        return copy;
    }
    get objects() {
        return this._objects;
    }
    addObject(object) {
        this._objects.push(object);
        object.setParent(this);
    }
    pointsOfInterest(purpose) {
        if (purpose === $92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION || purpose === $92808e6f1672ab53$export$58fb1881ac046f3b.SCALING) {
            if (this._objects.last) return this._objects.last.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION);
        } else if (purpose === $92808e6f1672ab53$export$58fb1881ac046f3b.SNAPPING) {
            if (this._objects.length === 1) return this._objects.last.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.SNAPPING);
            else if (this._objects.length > 1) return this._objects[this._objects.length - 2].pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.SNAPPING);
        } else return {};
    }
    movePOI(poi, byVector) {
        if (this._objects.last) return this._objects.last.movePOI(poi, byVector);
    }
    scale(fx, fy, pivot = null) {
        this._objects.last.scale(fx, fy, pivot);
    }
    rotateByDeg(value, pivot = null) {
        this._objects.last.rotateByDeg(value, pivot);
    }
    at(where) {
        if (!this._objects.last) return null;
        return this._objects.last.at(where);
    }
    get style() {
        if (!this._objects.last) return null;
        return this._objects.last.style;
    }
    set style(value) {
        this._objects.last.style = value;
    }
    get fillOpacity() {
        if (!this._objects.last) return null;
        return this._objects.last.fillOpacity;
    }
    get fillColor() {
        if (!this._objects.last) return null;
        return this._objects.last.fillColor;
    }
    get strokeColor() {
        if (!this._objects.last) return null;
        return this._objects.last.strokeColor;
    }
    get strokeWidth() {
        if (!this._objects.last) return null;
        return this._objects.last.strokeWidth;
    }
    set fillOpacity(value) {
        if (!this._objects.last) return;
        this._objects.last.fillOpacity = value;
    }
    set fillColor(value) {
        if (!this._objects.last) return;
        this._objects.last.fillColor = value;
    }
    set strokeColor(value) {
        if (!this._objects.last) return;
        this._objects.last.strokeColor = value;
    }
    set strokeWidth(value) {
        if (!this._objects.last) return;
        this._objects.last.strokeWidth = value;
    }
    get bottom() {
        return this._objects.last.bottom;
    }
    get top() {
        return this._objects.last.top;
    }
    get left() {
        return this._objects.last.left;
    }
    get right() {
        return this._objects.last.right;
    }
    get topLeft() {
        return this._objects.last["topLeft"];
    }
    get topRight() {
        return this._objects.last["topRight"];
    }
    get bottomRight() {
        return this._objects.last["bottomRight"];
    }
    get bottomLeft() {
        return this._objects.last["bottomLeft"];
    }
}





function $b834cbea40bafe97$export$6ba98d5b14f42755(height, ar) {
    switch(ar){
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar1_1:
            return height;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar3_2:
            return 3 * height / 2;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar4_3:
            return 4 * height / 3;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_10:
            return 16 * height / 10;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_9:
            return 16 * height / 9;
    }
}
function $b834cbea40bafe97$export$58b8baf19a1dab66(width, ar) {
    switch(ar){
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar1_1:
            return width;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar3_2:
            return 2 * width / 3;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar4_3:
            return 3 * width / 4;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_10:
            return 10 * width / 16;
        case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_9:
            return 9 * width / 16;
    }
}
class $b834cbea40bafe97$export$9b40e5dd2ee321ea extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(x1, y1, width, height){
        const x = (width - x1) / 2 + x1;
        const y = (height - y1) / 2 + y1;
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Canvas, $620bb2240d4be70e$export$d67e1898834e3885.Runtime.canvasObjectName, x, y);
        this._width = width;
        this._height = height;
    }
    static create(aspectRatio, height) {
        switch(aspectRatio){
            case $9b7a75a9356c9401$export$e840e8869344ca38.ar1_1:
                return $b834cbea40bafe97$export$9b40e5dd2ee321ea.create_1_1(height);
            case $9b7a75a9356c9401$export$e840e8869344ca38.ar3_2:
                return $b834cbea40bafe97$export$9b40e5dd2ee321ea.create_3_2(height);
            case $9b7a75a9356c9401$export$e840e8869344ca38.ar4_3:
                return $b834cbea40bafe97$export$9b40e5dd2ee321ea.create_4_3(height);
            case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_9:
                return $b834cbea40bafe97$export$9b40e5dd2ee321ea.create_16_9(height);
            case $9b7a75a9356c9401$export$e840e8869344ca38.ar16_10:
                return $b834cbea40bafe97$export$9b40e5dd2ee321ea.create_16_10(height);
        }
    }
    static create_1_1(height) {
        return new $b834cbea40bafe97$export$9b40e5dd2ee321ea(0, 0, height, height);
    }
    static create_3_2(height) {
        return new $b834cbea40bafe97$export$9b40e5dd2ee321ea(0, 0, 3 * height / 2, height);
    }
    static create_4_3(height) {
        return new $b834cbea40bafe97$export$9b40e5dd2ee321ea(0, 0, 4 * height / 3, height);
    }
    static create_16_10(height) {
        return new $b834cbea40bafe97$export$9b40e5dd2ee321ea(0, 0, 16 * height / 10, height);
    }
    static create_16_9(height) {
        return new $b834cbea40bafe97$export$9b40e5dd2ee321ea(0, 0, 16 * height / 9, height);
    }
    get isSelectable() {
        return true;
    }
    copy() {
        throw new Error("GrObject.copy: You cannot copy the canvas");
    }
    get boundingBox() {
        return {
            x: this.x,
            y: this.y,
            w: this._width,
            h: this._height
        };
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get topLeft() {
        return this.makePoint(-this.width / 2, -this.height / 2);
    }
    get topRight() {
        return this.makePoint(this.width / 2, -this.height / 2);
    }
    get bottomRight() {
        return this.makePoint(this.width / 2, this.height / 2);
    }
    get bottomLeft() {
        return this.makePoint(-this.width / 2, this.height / 2);
    }
    pointsOfInterest(purpose) {
        return Object.assign(Object.assign({}, super.pointsOfInterest(purpose)), {
            [$92808e6f1672ab53$export$595246eedb19e9bc.topLeft]: this.topLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.topRight]: this.topRight.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft]: this.bottomLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomRight]: this.bottomRight.copy
        });
    }
}







class $5fadf28b37c9ced6$export$8f6e4a0088afd800 {
    constructor(n, d){
        this.n = n.copy;
        this.d = d;
    }
    static createPP(p1, p2) {
        return $5fadf28b37c9ced6$export$8f6e4a0088afd800.createPV(p1, p2.copy.sub(p1));
    }
    static createPV(pointOnLine, vector) {
        let nx = -vector.y;
        let ny = vector.x;
        const s = nx * pointOnLine.x + ny * pointOnLine.y;
        const l = Math.sqrt(Math.pow(nx, 2) + Math.pow(ny, 2));
        if (s > 0) {
            nx /= l;
            ny /= l;
        } else {
            nx /= -l;
            ny /= -l;
        }
        let d = nx * pointOnLine.x + ny * pointOnLine.y;
        return new $5fadf28b37c9ced6$export$8f6e4a0088afd800(new $bcd40cdc131f79c5$export$6212d225472eb66a(nx, ny), d);
    }
    pointOnLine(point) {
        return $ad5b03a8205d6f7a$export$9663ddc1cf085b32(point.x * this.n.x + point.y * this.n.y, this.d);
    }
    projectPoint(point) {
        return point.projectOnLine(this);
    }
    intersectLine(line) {
        const det = this.n.x * line.n.y - this.n.y * line.n.x;
        if ($ad5b03a8205d6f7a$export$9663ddc1cf085b32(det, 0)) return null;
        const x = (this.d * line.n.y - line.d * this.n.y) / det;
        const y = (this.d * line.n.x - line.d * this.n.x) / det;
        return new $bcd40cdc131f79c5$export$6212d225472eb66a(x, y);
    }
    intersectCircle(circle) {
        const dl = -(circle.o.x * this.n.x + circle.o.y * this.n.y - this.d);
        const det = this.n.x * this.n.x + this.n.y * this.n.y;
        if ($ad5b03a8205d6f7a$export$9663ddc1cf085b32(det, 0)) return [];
        let sq = Math.pow(circle.r, 2) * det - Math.pow(dl, 2);
        if ($ad5b03a8205d6f7a$export$9663ddc1cf085b32(sq, 0)) return [
            new $bcd40cdc131f79c5$export$6212d225472eb66a(this.n.x * dl / det + circle.o.x, this.n.y * dl / det + circle.o.x)
        ];
        else if (sq > 0) {
            sq = Math.sqrt(sq);
            let x = (this.n.x * dl + this.n.y * sq) / det + circle.o.x;
            let y = (this.n.y * dl - this.n.x * sq) / det + circle.o.y;
            const p1 = new $bcd40cdc131f79c5$export$6212d225472eb66a(x, y);
            x = (this.n.x * dl - this.n.y * sq) / det + circle.o.x;
            y = (this.n.y * dl + this.n.x * sq) / det + circle.o.y;
            const p2 = new $bcd40cdc131f79c5$export$6212d225472eb66a(x, y);
            return [
                p1,
                p2
            ];
        } else return [];
    }
}


class $973b23ce99918ba1$export$37563e431fdea7bd extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(name, x1, y1, x2, y2){
        const x = (x1 + x2) / 2;
        const y = (y1 + y2) / 2;
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Line, name, x, y);
        this._start = new $bcd40cdc131f79c5$export$6212d225472eb66a(x1, y1);
        this._end = new $bcd40cdc131f79c5$export$6212d225472eb66a(x2, y2);
        this.updateCenter();
    }
    static create(name, x1, y1, x2, y2) {
        return new $973b23ce99918ba1$export$37563e431fdea7bd(name, x1, y1, x2, y2);
    }
    createProxy() {
        return this.copy();
    }
    copy() {
        return $973b23ce99918ba1$export$37563e431fdea7bd.create(this._uniqueName, this.x1, this.y1, this.x2, this.y2);
    }
    updateCenter() {
        this._center = new $bcd40cdc131f79c5$export$6212d225472eb66a(this._end.x - this._start.x, this._end.y - this._start.y).scale(0.5);
        this._center.add(this._start);
    }
    get y2() {
        return this._end.y;
    }
    set y2(value) {
        this._end.y = value;
        this.updateCenter();
    }
    get x2() {
        return this._end.x;
    }
    set x2(value) {
        this._end.x = value;
        this.updateCenter();
    }
    get y1() {
        return this._start.y;
    }
    set y1(value) {
        this._start.y = value;
        this.updateCenter();
    }
    get x1() {
        return this._start.x;
    }
    set x1(value) {
        this._start.x = value;
        this.updateCenter();
    }
    rotateByDeg(value, pivot = null) {
        super.rotateByDeg(value, pivot);
        if (!pivot) pivot = this.center;
        this._start.rotate($ad5b03a8205d6f7a$export$b1b275608b2b1b8(value), pivot);
        this._end.rotate($ad5b03a8205d6f7a$export$b1b275608b2b1b8(value), pivot);
        this._center = this._end.copy.sub(this._start).scale(0.5).add(this._start);
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    pointsOfInterest(purpose) {
        return {
            [$92808e6f1672ab53$export$595246eedb19e9bc.start]: this.start.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.end]: this.end.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.center]: this.center.copy
        };
    }
    getPivotFor(poi) {
        switch(poi){
            case $92808e6f1672ab53$export$595246eedb19e9bc.start:
                return $92808e6f1672ab53$export$595246eedb19e9bc.end;
            case $92808e6f1672ab53$export$595246eedb19e9bc.end:
                return $92808e6f1672ab53$export$595246eedb19e9bc.start;
            default:
                return super.getPivotFor(poi);
        }
    }
    movePOI(poi, vector) {
        if (poi === $92808e6f1672ab53$export$595246eedb19e9bc.center) super.movePOI(poi, vector);
        if (poi === $92808e6f1672ab53$export$595246eedb19e9bc.start) {
            this._start.x += vector.x;
            this._start.y += vector.y;
            this.updateCenter();
        } else if (poi === $92808e6f1672ab53$export$595246eedb19e9bc.end) {
            this._end.x += vector.x;
            this._end.y += vector.y;
            this.updateCenter();
        }
    }
    get supportedScaleModes() {
        return [
            $92808e6f1672ab53$export$95b6e4ac77d39d0e.UNIFORM
        ];
    }
    scale(fx, fy, pivot = null) {
        const sc = (p)=>{
            const pl = this.mapPointToLocal(pivot);
            const cl = this.mapPointToLocal(p);
            const dxl = (pl.x - cl.x) * (1 - fx);
            const dyl = (pl.y - cl.y) * (1 - fy);
            if (!$ad5b03a8205d6f7a$export$9663ddc1cf085b32(dxl, 0) || !$ad5b03a8205d6f7a$export$9663ddc1cf085b32(dyl, 0)) {
                const dg = this.mapVectorToGlobal(new $bcd40cdc131f79c5$export$6212d225472eb66a(dxl, dyl));
                p.add(dg);
            }
        };
        sc(this._start);
        sc(this._end);
        this.updateCenter();
    }
    getScaleResetInfo() {
        return {
            start: this._start.copy,
            end: this._end.copy,
            center: this._center.copy
        };
    }
    resetScaling(info) {
        this._start = info.start.copy;
        this._end = info.end.copy;
        this._center = info.center.copy;
    }
    getPointAtPercentage(pct) {
        return this.start.copy.add(this.end.copy.sub(this.start).scale(pct));
    }
    projectPoint(point) {
        const l = $5fadf28b37c9ced6$export$8f6e4a0088afd800.createPP(this.start, this.end);
        const p = l.projectPoint(point);
        let n = this.getPercentageForPoint(p);
        if (n < 0) return this.start;
        else if (n > 1) return this.end;
        return p;
    }
    getPercentageForPoint(p) {
        const u = this._end.copy.sub(this._start);
        let n;
        if (u.x !== 0) n = (p.x - this._start.x) / u.x;
        else n = (p.y - this._start.y) / u.y;
        return n;
    }
    projectPointAsPercentage(point) {
        const l = $5fadf28b37c9ced6$export$8f6e4a0088afd800.createPP(this.start, this.end);
        const p = l.projectPoint(point);
        let n = this.getPercentageForPoint(p);
        if (n < 0) return 0;
        else if (n > 1) return 1;
        return n;
    }
    get publishedProperties() {
        const vec = this._end.copy.sub(this._start);
        return [
            {
                name: "Length",
                id: "length",
                value: vec.length
            },
            {
                name: "Angle to X-Axis",
                id: "angle",
                value: $ad5b03a8205d6f7a$export$b2ba2578f2c43d74(vec.angleTo(new $bcd40cdc131f79c5$export$6212d225472eb66a(1, 0)))
            },
            {
                name: "Angle to Y-Axis",
                id: "angley",
                value: $ad5b03a8205d6f7a$export$b2ba2578f2c43d74(vec.angleTo(new $bcd40cdc131f79c5$export$6212d225472eb66a(0, 1)))
            }
        ];
    }
}





class $d4397e41424130cc$export$30a59a0caead8e7a extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(name, x, y, w, h){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Rectangle, name, x, y);
        this._width = w;
        this._height = h;
    }
    static create(name, x, y, w, h) {
        return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x, y, w, h);
    }
    copy() {
        return $d4397e41424130cc$export$30a59a0caead8e7a.create(this._uniqueName, this.center.x, this.center.y, this.width, this.height);
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
    }
    get boundingBox() {
        return Object.assign(Object.assign({}, super.boundingBox), {
            w: this._width,
            h: this._height
        });
    }
    get topLeft() {
        return this.makePoint(-this.width / 2, -this.height / 2);
    }
    get topRight() {
        return this.makePoint(this.width / 2, -this.height / 2);
    }
    get bottomRight() {
        return this.makePoint(this.width / 2, this.height / 2);
    }
    get bottomLeft() {
        return this.makePoint(-this.width / 2, this.height / 2);
    }
    scale(fx, fy, pivot = null) {
        if ($ad5b03a8205d6f7a$export$42b5981aee884db0(pivot, this._center)) {
            this._width *= Math.abs(fx);
            this._height *= Math.abs(fy);
            return;
        }
        const pl = this.mapPointToLocal(pivot);
        const cl = this.mapPointToLocal(this._center);
        const dxl = (pl.x - cl.x) * (1 - fx);
        const dyl = (pl.y - cl.y) * (1 - fy);
        const dg = this.mapVectorToGlobal(new $bcd40cdc131f79c5$export$6212d225472eb66a(dxl, dyl));
        this._center.add(dg);
        this._width *= Math.abs(fx);
        this._height *= Math.abs(fy);
    }
    getScaleResetInfo() {
        return {
            width: this._width,
            height: this._height,
            center: this.center.copy
        };
    }
    resetScaling(info) {
        this._width = info.width;
        this._height = info.height;
        this._center = info.center.copy;
    }
    pointsOfInterest(purpose) {
        return Object.assign(Object.assign({}, super.pointsOfInterest(purpose)), {
            [$92808e6f1672ab53$export$595246eedb19e9bc.topLeft]: this.topLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.topRight]: this.topRight.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft]: this.bottomLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomRight]: this.bottomRight.copy
        });
    }
    getPivotFor(poi, purpose) {
        if (purpose === $92808e6f1672ab53$export$58fb1881ac046f3b.ROTATING) return $92808e6f1672ab53$export$595246eedb19e9bc.center;
        switch(poi){
            case $92808e6f1672ab53$export$595246eedb19e9bc.topLeft:
                return $92808e6f1672ab53$export$595246eedb19e9bc.bottomRight;
            case $92808e6f1672ab53$export$595246eedb19e9bc.topRight:
                return $92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft;
            case $92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft:
                return $92808e6f1672ab53$export$595246eedb19e9bc.topRight;
            case $92808e6f1672ab53$export$595246eedb19e9bc.bottomRight:
                return $92808e6f1672ab53$export$595246eedb19e9bc.topLeft;
            default:
                return super.getPivotFor(poi);
        }
    }
    get publishedProperties() {
        return [
            {
                name: "Width",
                id: "width",
                value: this._width
            },
            {
                name: "Height",
                id: "height",
                value: this._height
            },
            {
                name: "Area",
                id: "area",
                value: this._width * this._height
            },
            {
                name: "Circumference",
                id: "circumference",
                value: 2 * (this._width + this._height)
            },
            ...super.publishedProperties
        ];
    }
}





function $caa38713c8fa141f$export$9a371a5197e3d411(message = "") {
    throw new Error("Branch should not be reached. " + message);
}
function $caa38713c8fa141f$export$89cf3336e81d70b4(message = "") {
    throw new Error("Branch not implemented. " + message);
}
function $caa38713c8fa141f$export$be9cd27b94bc54c6(condition, message) {
    if (condition === false) throw new Error("Assertion violated. " + message);
}


class $7f75fa07e5d188f3$export$203b0713bd4ddf5e extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(type, name, points, closed = false){
        super(type, name, 0, 0);
        if (points) this._points = points.map((p)=>p.copy
        );
        else this._points = [];
        this.computeCenterAndBB();
        this._closed = closed;
    }
    computeCenterAndBB() {
        if (this._points.length === 0) {
            this._width = this._height = 0;
            this._center = new $bcd40cdc131f79c5$export$6212d225472eb66a(0, 0);
            return;
        }
        const xs = [];
        const ys = [];
        for (const p of this._points){
            xs.push(this._xAxis.x * (p.x - this._center.x) + this._xAxis.y * (p.y - this._center.y));
            ys.push(this._yAxis.x * (p.x - this._center.x) + this._yAxis.y * (p.y - this._center.y));
        }
        let lMinX = Math.min.apply(null, xs);
        let lMaxX = Math.max.apply(null, xs);
        let lMinY = Math.min.apply(null, ys);
        let lMaxY = Math.max.apply(null, ys);
        const cl = new $bcd40cdc131f79c5$export$6212d225472eb66a((lMinX + lMaxX) / 2 - xs[0], (lMinY + lMaxY) / 2 - ys[0]);
        const d = this.mapVectorToGlobal(cl);
        this._center = this._points[0].copy;
        this._center.x += d.x;
        this._center.y += d.y;
        this._width = lMaxX - lMinX;
        this._height = lMaxY - lMinY;
    }
    createProxy() {
        const copy = this.copy();
        copy._xAxis = this._xAxis.copy;
        copy._yAxis = this._yAxis.copy;
        copy.computeCenterAndBB();
        return copy;
    }
    copy() {
        $caa38713c8fa141f$export$89cf3336e81d70b4();
        return null;
    }
    get closed() {
        return this._closed;
    }
    get points() {
        return this._points;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get topLeft() {
        return this.makePoint(-this.width / 2, -this.height / 2);
    }
    get topRight() {
        return this.makePoint(this.width / 2, -this.height / 2);
    }
    get bottomRight() {
        return this.makePoint(this.width / 2, this.height / 2);
    }
    get bottomLeft() {
        return this.makePoint(-this.width / 2, this.height / 2);
    }
    get boundingBox() {
        return Object.assign(Object.assign({}, super.boundingBox), {
            w: this._width,
            h: this._height
        });
    }
    addPoint(point) {
        this._points.push(point.copy);
        const bb = this.boundingBox;
        if (point.x < bb.x - bb.w / 2 || point.x > bb.x + bb.w / 2 || point.y < bb.y - bb.h / 2 || point.y > bb.y + bb.h / 2) this.computeCenterAndBB();
    }
    addPoints(points) {
        Array.prototype.push.apply(this._points, points);
        this.computeCenterAndBB();
    }
    removeLastPoint() {
        this._points.pop();
        this.computeCenterAndBB();
    }
    setPoint(index, point) {
        this._points[index] = point;
        this.computeCenterAndBB();
    }
    movePOI(poi, byVector) {
        this._points.forEach((p)=>p.add(byVector)
        );
        this.computeCenterAndBB();
    }
    rotateByDeg(value, pivot) {
        super.rotateByDeg(value, pivot);
        const a = $ad5b03a8205d6f7a$export$b1b275608b2b1b8(value);
        this._points.forEach((p)=>p.rotate(a, pivot)
        );
    }
    pointsOfInterest(purpose) {
        if (purpose === $92808e6f1672ab53$export$58fb1881ac046f3b.SCALING) return Object.assign(Object.assign({}, super.pointsOfInterest(purpose)), {
            [$92808e6f1672ab53$export$595246eedb19e9bc.topLeft]: this.topLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.topRight]: this.topRight.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft]: this.bottomLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomRight]: this.bottomRight.copy
        });
        const r = {
            [$92808e6f1672ab53$export$595246eedb19e9bc.center]: this.center.copy
        };
        this._points.forEach((p, i)=>{
            r[$92808e6f1672ab53$export$595246eedb19e9bc["P" + i]] = p.copy;
        });
        return r;
    }
    getPivotFor(poi, purpose) {
        switch(poi){
            case $92808e6f1672ab53$export$595246eedb19e9bc.topLeft:
                return $92808e6f1672ab53$export$595246eedb19e9bc.bottomRight;
            case $92808e6f1672ab53$export$595246eedb19e9bc.topRight:
                return $92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft;
            case $92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft:
                return $92808e6f1672ab53$export$595246eedb19e9bc.topRight;
            case $92808e6f1672ab53$export$595246eedb19e9bc.bottomRight:
                return $92808e6f1672ab53$export$595246eedb19e9bc.topLeft;
            default:
                return super.getPivotFor(poi, purpose);
        }
    }
    scale(fx, fy, pivot = null) {
        const pl = this.mapPointToLocal(pivot);
        for (const p of this._points){
            const cl = this.mapPointToLocal(p);
            const dxl = (pl.x - cl.x) * (1 - fx);
            const dyl = (pl.y - cl.y) * (1 - fy);
            const dg = this.mapVectorToGlobal(new $bcd40cdc131f79c5$export$6212d225472eb66a(dxl, dyl));
            p.add(dg);
        }
        this.computeCenterAndBB();
    }
    getScaleResetInfo() {
        return {
            center: this._center.copy,
            points: this._points.map((p)=>p.copy
            )
        };
    }
    resetScaling(info) {
        this._center = info.center;
        this._points = info.points.map((p)=>p.copy
        );
    }
}
class $7f75fa07e5d188f3$export$150c260caa43ceb8 extends $7f75fa07e5d188f3$export$203b0713bd4ddf5e {
    constructor(name, points, closed = false){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Polygon, name, points, closed);
    }
    static create(name, points, closed = false) {
        return new $7f75fa07e5d188f3$export$150c260caa43ceb8(name, points, closed);
    }
    copy() {
        return $7f75fa07e5d188f3$export$150c260caa43ceb8.create(this._uniqueName, this._points.map((p)=>p.copy
        ), this._closed);
    }
    get publishedProperties() {
        let length = 0;
        if (this._points.length > 1) {
            let lp = this._points[0];
            for(let i = 1; i < this._points.length; i++){
                length += this._points[i].copy.sub(lp).length;
                lp = this._points[i];
            }
            if (this._closed) length += this._points[0].copy.sub(lp).length;
        }
        return [
            {
                name: "Circumference",
                id: "circumference",
                value: length
            },
            ...super.publishedProperties
        ];
    }
}
class $7f75fa07e5d188f3$export$a9994ae8923617b extends $7f75fa07e5d188f3$export$203b0713bd4ddf5e {
    constructor(name, points, closed = false){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Quadratic, name, points, closed);
    }
    static create(name, points, closed = false) {
        return new $7f75fa07e5d188f3$export$a9994ae8923617b(name, points, closed);
    }
    copy() {
        return $7f75fa07e5d188f3$export$a9994ae8923617b.create(this._uniqueName, this._points.map((p)=>p.copy
        ), this._closed);
    }
}
class $7f75fa07e5d188f3$export$880ab0e6b60325c1 extends $7f75fa07e5d188f3$export$203b0713bd4ddf5e {
    constructor(name, points, closed = false){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Bezier, name, points, closed);
    }
    static create(name, points, closed = false) {
        return new $7f75fa07e5d188f3$export$880ab0e6b60325c1(name, points, closed);
    }
    copy() {
        return $7f75fa07e5d188f3$export$880ab0e6b60325c1.create(this._uniqueName, this._points.map((p)=>p.copy
        ), this._closed);
    }
}






class $91b4f6d56d3aa528$export$94b946a2f314bed0 {
    constructor(o, r){
        this.o = o.copy;
        this.r = r;
    }
    pointOnCircle(point) {
        return $ad5b03a8205d6f7a$export$9663ddc1cf085b32(point.copy.sub(this.o).length, this.r);
    }
}


class $f5a4253b3c677715$export$25ceb2c69899a589 extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(name, x, y, r){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Circle, name, x, y);
        this._radius = r;
    }
    static create(name, x, y, r) {
        return new $f5a4253b3c677715$export$25ceb2c69899a589(name, x, y, r);
    }
    copy() {
        return $f5a4253b3c677715$export$25ceb2c69899a589.create(this._uniqueName, this.center.x, this.center.y, this.radius);
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }
    get boundingBox() {
        return Object.assign(Object.assign({}, super.boundingBox), {
            w: this._radius * 2,
            h: this._radius * 2
        });
    }
    getPointAtPercentage(pct) {
        const t = $ad5b03a8205d6f7a$export$6eec49b1a6289c4e * pct;
        return this.top.copy.sub(this.center).rotate(t).add(this.center);
    }
    getScaleResetInfo() {
        return this._radius;
    }
    resetScaling(radius) {
        this._radius = radius;
    }
    scale(fx, fy) {
        if (fx === 1) this._radius *= fy;
        else this._radius *= fx;
    }
    projectPoint(point) {
        const l = $5fadf28b37c9ced6$export$8f6e4a0088afd800.createPP(point, this.center);
        const c = new $91b4f6d56d3aa528$export$94b946a2f314bed0(this.center, this.radius);
        const p = l.intersectCircle(c);
        const d0 = point.copy.sub(p[0]).length;
        const d1 = point.copy.sub(p[1]).length;
        if (d0 < d1) return p[0];
        else return p[1];
    }
    projectPointAsPercentage(point) {
        const p = this.projectPoint(point);
        const a = this.yAxis.copy.scale(-1).angleTo(p.sub(this.center));
        if (a < 0) return -a / $ad5b03a8205d6f7a$export$6eec49b1a6289c4e;
        else return 1 - a / $ad5b03a8205d6f7a$export$6eec49b1a6289c4e;
    }
    get publishedProperties() {
        return [
            {
                name: "Radius",
                id: "radius",
                value: this._radius
            },
            {
                name: "Area",
                id: "area",
                value: Math.pow(this._radius, 2) * Math.PI
            },
            {
                name: "Circumference",
                id: "circumference",
                value: this._radius * 2 * Math.PI
            },
            ...super.publishedProperties
        ];
    }
    getPivotFor(poi, forPurpose) {
        if (forPurpose === $92808e6f1672ab53$export$58fb1881ac046f3b.SCALING) return $92808e6f1672ab53$export$595246eedb19e9bc.center;
        return super.getPivotFor(poi, forPurpose);
    }
}




var $9f8c1044c8011eb8$export$746e27699a54e043;
(function($9f8c1044c8011eb8$export$746e27699a54e043) {
    $9f8c1044c8011eb8$export$746e27699a54e043[$9f8c1044c8011eb8$export$746e27699a54e043["center"] = 0] = "center";
    $9f8c1044c8011eb8$export$746e27699a54e043[$9f8c1044c8011eb8$export$746e27699a54e043["start"] = 1] = "start";
    $9f8c1044c8011eb8$export$746e27699a54e043[$9f8c1044c8011eb8$export$746e27699a54e043["end"] = 2] = "end";
})($9f8c1044c8011eb8$export$746e27699a54e043 || ($9f8c1044c8011eb8$export$746e27699a54e043 = {}));
class $9f8c1044c8011eb8$export$29bb23d12246c816 {
    constructor(){
        this._styles = {};
        this._styles["default"] = {
            fillColor: "#FF7F50",
            strokeColor: "#FF7F50",
            fillOpacity: 0.2,
            strokeWidth: 2,
            textAlignment: $9f8c1044c8011eb8$export$746e27699a54e043.center,
            fontFamily: "Sans-serif",
            fontSize: 12
        };
        this._styles["textDefault"] = {
            fillColor: "#FF7F50",
            strokeColor: "#FF7F50",
            fillOpacity: 1,
            strokeWidth: 0,
            textAlignment: $9f8c1044c8011eb8$export$746e27699a54e043.center,
            verticalAlignment: $9f8c1044c8011eb8$export$746e27699a54e043.center,
            fontFamily: "Sans-serif",
            fontSize: 50
        };
    }
    get styles() {
        return this._styles;
    }
}


function $56919d7b8c67450a$var$getTextBox(text, font) {
    const canvas = $56919d7b8c67450a$var$getTextBox.canvas || ($56919d7b8c67450a$var$getTextBox.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return {
        width: metrics.width,
        height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    };
}
class $56919d7b8c67450a$export$23e702491ed1c44c extends $92808e6f1672ab53$export$ad0875ee5f43e1f {
    constructor(name, x, y, text){
        super($92808e6f1672ab53$export$53f0d9fcb05d9d1d.Text, name, x, y);
        this._scaleX = 1;
        this._scaleY = 1;
        this._text = text;
        this._width = this._height = 0;
    }
    copy() {
        const copy = new $56919d7b8c67450a$export$23e702491ed1c44c(this.uniqueName, this.x, this.y, this._text);
        copy._width = this._width;
        copy._height = this._height;
        copy._alignmentFactorV = this._alignmentFactorV;
        copy._alignmentFactorH = this._alignmentFactorH;
        copy._scaleX = this._scaleX;
        copy._scaleY = this._scaleY;
        return copy;
    }
    set style(value) {
        this._style = value;
        if (!value) {
            this._width = this._height = 0;
            return;
        }
        const dim = $56919d7b8c67450a$var$getTextBox(this._text, `${value.fontSize}px ${value.fontFamily}`);
        this._width = dim.width;
        this._height = dim.height;
        switch(value.textAlignment){
            case $9f8c1044c8011eb8$export$746e27699a54e043.center:
                this._alignmentFactorH = -0.5;
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.start:
                this._alignmentFactorH = 0;
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.end:
                this._alignmentFactorH = -1;
                break;
        }
        switch(value.verticalAlignment){
            case $9f8c1044c8011eb8$export$746e27699a54e043.center:
                this._alignmentFactorV = 0.5;
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.start:
                this._alignmentFactorV = 1;
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.end:
                this._alignmentFactorV = 0;
                break;
        }
    }
    updateTextBox() {
        const dim = $56919d7b8c67450a$var$getTextBox(this._text, `${this._style.fontSize}px ${this._style.fontFamily}`);
        this._width = dim.width;
        this._height = dim.height;
    }
    get style() {
        return this._style;
    }
    get text() {
        return this._text;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    get boundingBox() {
        return Object.assign(Object.assign({}, super.boundingBox), {
            w: this._width * this._scaleX,
            h: this._height * this._scaleY
        });
    }
    get topLeft() {
        return this.makePoint(this._alignmentFactorH * this.width * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }
    get topRight() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }
    get bottomLeft() {
        return this.makePoint(this._alignmentFactorH * this.width * this._scaleX, this._alignmentFactorV * this._height * this._scaleY);
    }
    get bottomRight() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, this._alignmentFactorV * this._height * this._scaleY);
    }
    get top() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, (this._alignmentFactorV * this.height - this.height) * this._scaleY);
    }
    get bottom() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, this._alignmentFactorV * this._height * this._scaleY);
    }
    get left() {
        return this.makePoint(this._alignmentFactorH * this.width * this._scaleX, (this._alignmentFactorV * this._height - this.height * 0.5) * this._scaleY);
    }
    get right() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width) * this._scaleX, (this._alignmentFactorV * this._height - this._height * 0.5) * this._scaleY);
    }
    get center() {
        return this.makePoint((this._alignmentFactorH * this.width + this._width * 0.5) * this._scaleX, (this._alignmentFactorV * this._height - this._height * 0.5) * this._scaleY);
    }
    getPointAtPercentage(pct) {
        $caa38713c8fa141f$export$89cf3336e81d70b4("Percentage points make no sense for texts");
        return null;
    }
    scale(fx, fy) {
        this._scaleX *= fx;
        this._scaleY *= fy;
    }
    getScaleResetInfo() {
        return {
            x: this._scaleX,
            y: this._scaleY
        };
    }
    resetScaling(info) {
        this._scaleX = info.x;
        this._scaleY = info.y;
    }
    get scaleX() {
        return this._scaleX;
    }
    get scaleY() {
        return this._scaleY;
    }
    projectPoint(point) {
        $caa38713c8fa141f$export$89cf3336e81d70b4("Percentage points make no sense for texts");
        return null;
    }
    projectPointAsPercentage(point) {
        $caa38713c8fa141f$export$89cf3336e81d70b4("Percentage points make no sense for texts");
        return null;
    }
    get publishedProperties() {
        return [
            ...super.publishedProperties,
            {
                name: "Width",
                id: "witdh",
                value: this._width
            },
            {
                name: "Height",
                id: "heigh",
                value: this._height
            },
            {
                name: "Aspect Ratio",
                id: "aspectratio",
                value: this._width / this._height
            },
            {
                name: "Aspect Ratio2",
                id: "aspectratio2",
                value: this._height / this._width
            }
        ];
    }
    rotatePOI(poi, value) {
        super.rotatePOI(poi, value);
    }
    pointsOfInterest(purpose) {
        return Object.assign(Object.assign({}, super.pointsOfInterest(purpose)), {
            [$92808e6f1672ab53$export$595246eedb19e9bc.topLeft]: this.topLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.topRight]: this.topRight.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomLeft]: this.bottomLeft.copy,
            [$92808e6f1672ab53$export$595246eedb19e9bc.bottomRight]: this.bottomRight.copy
        });
    }
    getPivotFor(poi) {
        return $92808e6f1672ab53$export$595246eedb19e9bc.center;
    }
}



var $c9b688d84c372821$exports = {};

$parcel$export($c9b688d84c372821$exports, "distance", () => $c9b688d84c372821$export$9f17032d917177de);
$parcel$export($c9b688d84c372821$exports, "midpoint", () => $c9b688d84c372821$export$f2e8a19be46147af);
$parcel$export($c9b688d84c372821$exports, "circleCenterRadius", () => $c9b688d84c372821$export$9752a52f44b3771b);
$parcel$export($c9b688d84c372821$exports, "circleCenterPoint", () => $c9b688d84c372821$export$138267ac14f24cdd);
$parcel$export($c9b688d84c372821$exports, "circlePointPoint", () => $c9b688d84c372821$export$510bcbb1daa29625);
$parcel$export($c9b688d84c372821$exports, "rectanglePointPoint", () => $c9b688d84c372821$export$4f275ceaaaca1eea);
$parcel$export($c9b688d84c372821$exports, "rectangleCenter", () => $c9b688d84c372821$export$5699841f9034f25a);
$parcel$export($c9b688d84c372821$exports, "rectangleTopLeft", () => $c9b688d84c372821$export$43c3802c496dcab8);
$parcel$export($c9b688d84c372821$exports, "rectangleBottomLeft", () => $c9b688d84c372821$export$ffc9a385f68270d7);
$parcel$export($c9b688d84c372821$exports, "rectangleBottomRight", () => $c9b688d84c372821$export$e4174898e76ca80b);
$parcel$export($c9b688d84c372821$exports, "rectangleTopRight", () => $c9b688d84c372821$export$be96957d972b1ea8);
$parcel$export($c9b688d84c372821$exports, "linePointPoint", () => $c9b688d84c372821$export$3fd0e84e3b39983a);
$parcel$export($c9b688d84c372821$exports, "linePointVectorLength", () => $c9b688d84c372821$export$bfdf0cec956c91f6);
$parcel$export($c9b688d84c372821$exports, "text", () => $c9b688d84c372821$export$6f093cfa640b7166);
$parcel$export($c9b688d84c372821$exports, "polygon", () => $c9b688d84c372821$export$b7b19aa0ee06c73);
$parcel$export($c9b688d84c372821$exports, "extendPolygon", () => $c9b688d84c372821$export$2f7de087257a5258);
$parcel$export($c9b688d84c372821$exports, "scaleObject", () => $c9b688d84c372821$export$b8427670a32a2793);
$parcel$export($c9b688d84c372821$exports, "scaleObjectUniform", () => $c9b688d84c372821$export$136fad7c848856b6);
$parcel$export($c9b688d84c372821$exports, "scaleObjectToPoint", () => $c9b688d84c372821$export$ed6a1f2400c516ff);
$parcel$export($c9b688d84c372821$exports, "scaleObjectToPointUniform", () => $c9b688d84c372821$export$790a046ebb3fec6e);
$parcel$export($c9b688d84c372821$exports, "moveObject", () => $c9b688d84c372821$export$949242f9d660edf5);
$parcel$export($c9b688d84c372821$exports, "moveObjectAlongX", () => $c9b688d84c372821$export$3d984db7fb07f69c);
$parcel$export($c9b688d84c372821$exports, "moveObjectAlongY", () => $c9b688d84c372821$export$cc481b5dad075641);
$parcel$export($c9b688d84c372821$exports, "moveObjectToPoint", () => $c9b688d84c372821$export$c417714628899d34);
$parcel$export($c9b688d84c372821$exports, "rotateObject", () => $c9b688d84c372821$export$9b2b68ce31244b03);
$parcel$export($c9b688d84c372821$exports, "size", () => $c9b688d84c372821$export$346677f925de839c);
$parcel$export($c9b688d84c372821$exports, "max", () => $c9b688d84c372821$export$8960430cfd85939f);
$parcel$export($c9b688d84c372821$exports, "avg", () => $c9b688d84c372821$export$86c4352b5bd9c815);
$parcel$export($c9b688d84c372821$exports, "median", () => $c9b688d84c372821$export$9c490b34b2f16a34);








function $c9b688d84c372821$export$9f17032d917177de(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}
function $c9b688d84c372821$export$f2e8a19be46147af(x1, y1, x2, y2) {
    return {
        x: x1 + (x2 - x1) * 0.5,
        y: y1 + (y2 - y1) * 0.5
    };
}
function $c9b688d84c372821$export$9752a52f44b3771b(name, x, y, r) {
    return new $f5a4253b3c677715$export$25ceb2c69899a589(name, x, y, r);
}
function $c9b688d84c372821$export$138267ac14f24cdd(name, x1, y1, x2, y2) {
    return new $f5a4253b3c677715$export$25ceb2c69899a589(name, x1, y1, $c9b688d84c372821$export$9f17032d917177de(x1, y1, x2, y2));
}
function $c9b688d84c372821$export$510bcbb1daa29625(name, x1, y1, x2, y2) {
    const center = $c9b688d84c372821$export$f2e8a19be46147af(x1, y1, x2, y2);
    return new $f5a4253b3c677715$export$25ceb2c69899a589(name, center.x, center.y, $c9b688d84c372821$export$9f17032d917177de(center.x, center.y, x2, y2));
}
function $c9b688d84c372821$export$4f275ceaaaca1eea(name, x1, y1, x2, y2) {
    const center = $c9b688d84c372821$export$f2e8a19be46147af(x1, y1, x2, y2);
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, center.x, center.y, Math.abs(x1 - x2), Math.abs(y1 - y2));
}
function $c9b688d84c372821$export$5699841f9034f25a(name, x, y, width, height) {
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x, y, width, height);
}
function $c9b688d84c372821$export$43c3802c496dcab8(name, x, y, width, height) {
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x + width / 2, y + height / 2, width, height);
}
function $c9b688d84c372821$export$ffc9a385f68270d7(name, x, y, width, height) {
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x + width / 2, y - height / 2, width, height);
}
function $c9b688d84c372821$export$e4174898e76ca80b(name, x, y, width, height) {
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x - width / 2, y - height / 2, width, height);
}
function $c9b688d84c372821$export$be96957d972b1ea8(name, x, y, width, height) {
    return new $d4397e41424130cc$export$30a59a0caead8e7a(name, x - width / 2, y + height / 2, width, height);
}
function $c9b688d84c372821$export$3fd0e84e3b39983a(name, x1, y1, x2, y2) {
    return new $973b23ce99918ba1$export$37563e431fdea7bd(name, x1, y1, x2, y2);
}
function $c9b688d84c372821$export$bfdf0cec956c91f6(name, x1, y1, vx, vy, l) {
    return new $973b23ce99918ba1$export$37563e431fdea7bd(name, x1, y1, x1 + vx * l, y1 + vy * l);
}
function $c9b688d84c372821$export$6f093cfa640b7166(name, x, y, $c9b688d84c372821$export$6f093cfa640b7166) {
    return new $56919d7b8c67450a$export$23e702491ed1c44c(name, x, y, $c9b688d84c372821$export$6f093cfa640b7166);
}
function $c9b688d84c372821$export$b7b19aa0ee06c73(name, object, closed, points) {
    let poly;
    if (object) {
        poly = object;
        poly.addPoints(points.map((p)=>new $bcd40cdc131f79c5$export$6212d225472eb66a(p.x, p.y)
        ));
    } else poly = new $7f75fa07e5d188f3$export$150c260caa43ceb8(name, points.map((p)=>new $bcd40cdc131f79c5$export$6212d225472eb66a(p.x, p.y)
    ), closed);
    return poly;
}
function $c9b688d84c372821$export$2f7de087257a5258(object, points) {
    object.addPoints(points.map((p)=>new $bcd40cdc131f79c5$export$6212d225472eb66a(p.x, p.y)
    ));
}
function $c9b688d84c372821$export$b8427670a32a2793(object, fx, fy, pivotX, pivotY) {
    object.scale(fx, fy, new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY));
}
function $c9b688d84c372821$export$136fad7c848856b6(object, f, pivotX, pivotY) {
    object.scale(f, f, new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY));
}
function $c9b688d84c372821$var$computeFactorsForScaleToPoint(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY) {
    let old = new $bcd40cdc131f79c5$export$6212d225472eb66a(draggedX, draggedY);
    let target = new $bcd40cdc131f79c5$export$6212d225472eb66a(targetX, targetY);
    let pivot = new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY);
    old = object.mapPointToLocal(old);
    pivot = object.mapPointToLocal(pivot);
    target = object.mapPointToLocal(target);
    return $ad5b03a8205d6f7a$export$cb65b2ef163ba1b6(old, pivot, target);
}
function $c9b688d84c372821$export$ed6a1f2400c516ff(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY) {
    let { fx: fx , fy: fy  } = $c9b688d84c372821$var$computeFactorsForScaleToPoint(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY);
    object.scale(fx, fy, new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY));
}
function $c9b688d84c372821$export$790a046ebb3fec6e(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY) {
    let { fx: fx , fy: fy  } = $c9b688d84c372821$var$computeFactorsForScaleToPoint(object, draggedX, draggedY, targetX, targetY, pivotX, pivotY);
    fy = fx = $ad5b03a8205d6f7a$export$ba3dd70ec20ecc6e(fx, fy);
    object.scale(fx, fy, new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY));
}
function $c9b688d84c372821$export$949242f9d660edf5(object, point, vx, vy) {
    object.movePOI(point, new $bcd40cdc131f79c5$export$6212d225472eb66a(vx, vy));
}
function $c9b688d84c372821$export$3d984db7fb07f69c(object, point, vx) {
    object.movePOI(point, new $bcd40cdc131f79c5$export$6212d225472eb66a(vx, 0));
}
function $c9b688d84c372821$export$cc481b5dad075641(object, point, vy) {
    object.movePOI(point, new $bcd40cdc131f79c5$export$6212d225472eb66a(0, vy));
}
function $c9b688d84c372821$export$c417714628899d34(object, point, targetObject, targetPoint) {
    let to;
    let from;
    if (object === targetObject && object.type === $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List && object.objects.length > 1) {
        const l = object.objects.length;
        to = object.objects[l - 2].pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[targetPoint];
        from = object.objects[l - 1].pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[point];
    } else {
        to = targetObject.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[targetPoint];
        from = object.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.MANIPULATION)[point];
    }
    const v = to.copy.sub(from);
    object.movePOI(point, v);
}
function $c9b688d84c372821$export$9b2b68ce31244b03(object, angleDeg, pivotX, pivotY) {
    object.rotateByDeg(angleDeg, new $bcd40cdc131f79c5$export$6212d225472eb66a(pivotX, pivotY));
}
function $c9b688d84c372821$export$346677f925de839c(value) {
    return value.length;
}
function $c9b688d84c372821$export$8960430cfd85939f(value) {
    return Math.max.apply(null, value);
}
function $c9b688d84c372821$export$86c4352b5bd9c815(value) {
    return value.reduce((a, b)=>a + b
    ) / value.length;
}
function $c9b688d84c372821$export$9c490b34b2f16a34(value) {
    const s = [
        ...value
    ].sort((a, b)=>a - b
    );
    const c = Math.floor(s.length / 2);
    let r = s[c];
    if (s.length % 2 === 0) {
        r = r + s[c - 1];
        return r / 2;
    }
    return r;
}


const $f794df200bdd1c64$export$bb7311ec83c149ab = {
    default: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 0.2,
        "strokeWidth": 2
    },
    textDefault: {
        "fillColor": "#FF7F50",
        "strokeColor": "#FF7F50",
        "fillOpacity": 1,
        "strokeWidth": 0,
        "textAlignment": 0,
        "verticalAlignment": 0,
        "fontFamily": "Sans-serif",
        "fontSize": 50
    }
};
function $f794df200bdd1c64$export$eb688b4a3b171f3d(managerFrom, managerTo) {
    const from = managerFrom();
    Object.keys(from).forEach((name)=>{
        const top = managerTo(name);
        if (top) {
            if (top instanceof $e60ec5afccde461f$export$fefeb732093e696a) top.addObject(from[name]);
            else managerTo(name, from[name]);
        } else managerTo(name, from[name]);
    });
}
function $f794df200bdd1c64$export$9a199263f62e818d(guides = {}, parent = null) {
    const __objects = {};
    return function(name, object = null, deep = true) {
        if (!name) return __objects;
        if (object) {
            if (__objects[name] && !guides[name]) {
                let l = __objects[name];
                if (l.type !== $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List) {
                    const newL = new $e60ec5afccde461f$export$fefeb732093e696a(name);
                    newL.addObject(l);
                    __objects[name] = newL;
                    l = newL;
                }
                l.addObject(object);
            } else __objects[name] = object;
        }
        return __objects[name] || deep && parent && parent(name);
    };
}
$parcel$exportWildcard($f794df200bdd1c64$exports, $c9b688d84c372821$exports);





var $dbb33bae16b3a2f1$var$noop = {
    value: ()=>{}
};
function $dbb33bae16b3a2f1$var$dispatch() {
    for(var i = 0, n = arguments.length, _ = {}, t; i < n; ++i){
        if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
        _[t] = [];
    }
    return new $dbb33bae16b3a2f1$var$Dispatch(_);
}
function $dbb33bae16b3a2f1$var$Dispatch(_) {
    this._ = _;
}
function $dbb33bae16b3a2f1$var$parseTypenames(typenames, types) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {
            type: t,
            name: name
        };
    });
}
$dbb33bae16b3a2f1$var$Dispatch.prototype = $dbb33bae16b3a2f1$var$dispatch.prototype = {
    constructor: $dbb33bae16b3a2f1$var$Dispatch,
    on: function(typename, callback) {
        var _ = this._, T = $dbb33bae16b3a2f1$var$parseTypenames(typename + "", _), t, i = -1, n = T.length;
        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
            while(++i < n)if ((t = (typename = T[i]).type) && (t = $dbb33bae16b3a2f1$var$get(_[t], typename.name))) return t;
            return;
        }
        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while(++i < n){
            if (t = (typename = T[i]).type) _[t] = $dbb33bae16b3a2f1$var$set(_[t], typename.name, callback);
            else if (callback == null) for(t in _)_[t] = $dbb33bae16b3a2f1$var$set(_[t], typename.name, null);
        }
        return this;
    },
    copy: function() {
        var copy = {}, _ = this._;
        for(var t in _)copy[t] = _[t].slice();
        return new $dbb33bae16b3a2f1$var$Dispatch(copy);
    },
    call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for(var args = new Array(n), i = 0, n, t; i < n; ++i)args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    },
    apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for(var t = this._[type], i = 0, n = t.length; i < n; ++i)t[i].value.apply(that, args);
    }
};
function $dbb33bae16b3a2f1$var$get(type, name) {
    for(var i = 0, n = type.length, c; i < n; ++i){
        if ((c = type[i]).name === name) return c.value;
    }
}
function $dbb33bae16b3a2f1$var$set(type, name, callback) {
    for(var i = 0, n = type.length; i < n; ++i)if (type[i].name === name) {
        type[i] = $dbb33bae16b3a2f1$var$noop, type = type.slice(0, i).concat(type.slice(i + 1));
        break;
    }
    if (callback != null) type.push({
        name: name,
        value: callback
    });
    return type;
}
var $dbb33bae16b3a2f1$export$2e2bcd8739ae039 = $dbb33bae16b3a2f1$var$dispatch;



function $7c63b9ef11c1ee64$export$2e2bcd8739ae039(selector) {
    return function() {
        return this.matches(selector);
    };
}
function $7c63b9ef11c1ee64$export$90c2759c036528(selector) {
    return function(node) {
        return node.matches(selector);
    };
}

var $25bd40d93a30f931$export$201a3f7520ccc326 = "http://www.w3.org/1999/xhtml";
var $25bd40d93a30f931$export$2e2bcd8739ae039 = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: $25bd40d93a30f931$export$201a3f7520ccc326,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
};


function $3d4543eaa8d01dfb$export$2e2bcd8739ae039(name) {
    var prefix = name += "", i = prefix.indexOf(":");
    if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
    return $25bd40d93a30f931$export$2e2bcd8739ae039.hasOwnProperty(prefix) ? {
        space: $25bd40d93a30f931$export$2e2bcd8739ae039[prefix],
        local: name
    } : name; // eslint-disable-line no-prototype-builtins
}

function $2f23fd072dd98ded$export$2e2bcd8739ae039(event) {
    let sourceEvent;
    while(sourceEvent = event.sourceEvent)event = sourceEvent;
    return event;
}


function $e01916ed2668b0f2$export$2e2bcd8739ae039(event, node) {
    event = $2f23fd072dd98ded$export$2e2bcd8739ae039(event);
    if (node === undefined) node = event.currentTarget;
    if (node) {
        var svg = node.ownerSVGElement || node;
        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = event.clientX, point.y = event.clientY;
            point = point.matrixTransform(node.getScreenCTM().inverse());
            return [
                point.x,
                point.y
            ];
        }
        if (node.getBoundingClientRect) {
            var rect = node.getBoundingClientRect();
            return [
                event.clientX - rect.left - node.clientLeft,
                event.clientY - rect.top - node.clientTop
            ];
        }
    }
    return [
        event.pageX,
        event.pageY
    ];
}


function $c00a0a933450306c$var$none() {}
function $c00a0a933450306c$export$2e2bcd8739ae039(selector) {
    return selector == null ? $c00a0a933450306c$var$none : function() {
        return this.querySelector(selector);
    };
}


function $792d62152163be01$export$2e2bcd8739ae039(select) {
    if (typeof select !== "function") select = $c00a0a933450306c$export$2e2bcd8739ae039(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i)if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
        }
    }
    return new $a0973b1091907b1c$export$52baac22726c72bf(subgroups, this._parents);
}



function $9c0998471849823d$export$2e2bcd8739ae039(x) {
    return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}


function $535004fbee91642f$var$empty() {
    return [];
}
function $535004fbee91642f$export$2e2bcd8739ae039(selector) {
    return selector == null ? $535004fbee91642f$var$empty : function() {
        return this.querySelectorAll(selector);
    };
}


function $b9d44a587c0117df$var$arrayAll(select) {
    return function() {
        return $9c0998471849823d$export$2e2bcd8739ae039(select.apply(this, arguments));
    };
}
function $b9d44a587c0117df$export$2e2bcd8739ae039(select) {
    if (typeof select === "function") select = $b9d44a587c0117df$var$arrayAll(select);
    else select = $535004fbee91642f$export$2e2bcd8739ae039(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i)if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
        }
    }
    return new $a0973b1091907b1c$export$52baac22726c72bf(subgroups, parents);
}



var $76c8c827ca381496$var$find = Array.prototype.find;
function $76c8c827ca381496$var$childFind(match) {
    return function() {
        return $76c8c827ca381496$var$find.call(this.children, match);
    };
}
function $76c8c827ca381496$var$childFirst() {
    return this.firstElementChild;
}
function $76c8c827ca381496$export$2e2bcd8739ae039(match) {
    return this.select(match == null ? $76c8c827ca381496$var$childFirst : $76c8c827ca381496$var$childFind(typeof match === "function" ? match : $7c63b9ef11c1ee64$export$90c2759c036528(match)));
}



var $5185b9b72642a61a$var$filter = Array.prototype.filter;
function $5185b9b72642a61a$var$children() {
    return Array.from(this.children);
}
function $5185b9b72642a61a$var$childrenFilter(match) {
    return function() {
        return $5185b9b72642a61a$var$filter.call(this.children, match);
    };
}
function $5185b9b72642a61a$export$2e2bcd8739ae039(match) {
    return this.selectAll(match == null ? $5185b9b72642a61a$var$children : $5185b9b72642a61a$var$childrenFilter(typeof match === "function" ? match : $7c63b9ef11c1ee64$export$90c2759c036528(match)));
}




function $1b41e78cab0621db$export$2e2bcd8739ae039(match) {
    if (typeof match !== "function") match = $7c63b9ef11c1ee64$export$2e2bcd8739ae039(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i)if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
    }
    return new $a0973b1091907b1c$export$52baac22726c72bf(subgroups, this._parents);
}



function $e45281349ef151c4$export$2e2bcd8739ae039(update) {
    return new Array(update.length);
}



function $26840db5e62a1612$export$2e2bcd8739ae039() {
    return new $a0973b1091907b1c$export$52baac22726c72bf(this._enter || this._groups.map($e45281349ef151c4$export$2e2bcd8739ae039), this._parents);
}
function $26840db5e62a1612$export$67b01759a14cf6a4(parent, datum) {
    this.ownerDocument = parent.ownerDocument;
    this.namespaceURI = parent.namespaceURI;
    this._next = null;
    this._parent = parent;
    this.__data__ = datum;
}
$26840db5e62a1612$export$67b01759a14cf6a4.prototype = {
    constructor: $26840db5e62a1612$export$67b01759a14cf6a4,
    appendChild: function(child) {
        return this._parent.insertBefore(child, this._next);
    },
    insertBefore: function(child, next) {
        return this._parent.insertBefore(child, next);
    },
    querySelector: function(selector) {
        return this._parent.querySelector(selector);
    },
    querySelectorAll: function(selector) {
        return this._parent.querySelectorAll(selector);
    }
};


function $2949a43c2ecea59a$export$2e2bcd8739ae039(x) {
    return function() {
        return x;
    };
}


function $f1148316681ca8ab$var$bindIndex(parent, group, enter, update, exit, data) {
    var i = 0, node, groupLength = group.length, dataLength = data.length;
    // Put any non-null nodes that fit into update.
    // Put any null nodes into enter.
    // Put any remaining data into enter.
    for(; i < dataLength; ++i)if (node = group[i]) {
        node.__data__ = data[i];
        update[i] = node;
    } else enter[i] = new $26840db5e62a1612$export$67b01759a14cf6a4(parent, data[i]);
    // Put any non-null nodes that don’t fit into exit.
    for(; i < groupLength; ++i)if (node = group[i]) exit[i] = node;
}
function $f1148316681ca8ab$var$bindKey(parent, group, enter, update, exit, data, key) {
    var i, node, nodeByKeyValue = new Map, groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
    // Compute the key for each node.
    // If multiple nodes have the same key, the duplicates are added to exit.
    for(i = 0; i < groupLength; ++i)if (node = group[i]) {
        keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
        if (nodeByKeyValue.has(keyValue)) exit[i] = node;
        else nodeByKeyValue.set(keyValue, node);
    }
    // Compute the key for each datum.
    // If there a node associated with this key, join and add it to update.
    // If there is not (or the key is a duplicate), add it to enter.
    for(i = 0; i < dataLength; ++i){
        keyValue = key.call(parent, data[i], i, data) + "";
        if (node = nodeByKeyValue.get(keyValue)) {
            update[i] = node;
            node.__data__ = data[i];
            nodeByKeyValue.delete(keyValue);
        } else enter[i] = new $26840db5e62a1612$export$67b01759a14cf6a4(parent, data[i]);
    }
    // Add any remaining nodes that were not bound to data to exit.
    for(i = 0; i < groupLength; ++i)if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) exit[i] = node;
}
function $f1148316681ca8ab$var$datum(node) {
    return node.__data__;
}
function $f1148316681ca8ab$export$2e2bcd8739ae039(value, key) {
    if (!arguments.length) return Array.from(this, $f1148316681ca8ab$var$datum);
    var bind = key ? $f1148316681ca8ab$var$bindKey : $f1148316681ca8ab$var$bindIndex, parents = this._parents, groups = this._groups;
    if (typeof value !== "function") value = $2949a43c2ecea59a$export$2e2bcd8739ae039(value);
    for(var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j){
        var parent = parents[j], group = groups[j], groupLength = group.length, data = $f1148316681ca8ab$var$arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for(var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0)if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while(!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
        }
    }
    update = new $a0973b1091907b1c$export$52baac22726c72bf(update, parents);
    update._enter = enter;
    update._exit = exit;
    return update;
}
// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function $f1148316681ca8ab$var$arraylike(data) {
    return typeof data === "object" && "length" in data ? data // Array, TypedArray, NodeList, array-like
     : Array.from(data); // Map, Set, iterable, string, or anything else
}





function $f1f0b685c83b4f55$export$2e2bcd8739ae039() {
    return new $a0973b1091907b1c$export$52baac22726c72bf(this._exit || this._groups.map($e45281349ef151c4$export$2e2bcd8739ae039), this._parents);
}


function $72000ef0e8326807$export$2e2bcd8739ae039(onenter, onupdate, onexit) {
    var enter = this.enter(), update = this, exit = this.exit();
    if (typeof onenter === "function") {
        enter = onenter(enter);
        if (enter) enter = enter.selection();
    } else enter = enter.append(onenter + "");
    if (onupdate != null) {
        update = onupdate(update);
        if (update) update = update.selection();
    }
    if (onexit == null) exit.remove();
    else onexit(exit);
    return enter && update ? enter.merge(update).order() : update;
}



function $a7c65b68b840797a$export$2e2bcd8739ae039(context) {
    var selection = context.selection ? context.selection() : context;
    for(var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i)if (node = group0[i] || group1[i]) merge[i] = node;
    }
    for(; j < m0; ++j)merges[j] = groups0[j];
    return new $a0973b1091907b1c$export$52baac22726c72bf(merges, this._parents);
}


function $c7ddf5b0acb0a0a2$export$2e2bcd8739ae039() {
    for(var groups = this._groups, j = -1, m = groups.length; ++j < m;){
        for(var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;)if (node = group[i]) {
            if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
            next = node;
        }
    }
    return this;
}



function $a139104ce9d72859$export$2e2bcd8739ae039(compare) {
    if (!compare) compare = $a139104ce9d72859$var$ascending;
    function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
    }
    for(var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i)if (node = group[i]) sortgroup[i] = node;
        sortgroup.sort(compareNode);
    }
    return new $a0973b1091907b1c$export$52baac22726c72bf(sortgroups, this._parents).order();
}
function $a139104ce9d72859$var$ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}


function $b37ffb41ea6933d2$export$2e2bcd8739ae039() {
    var callback = arguments[0];
    arguments[0] = this;
    callback.apply(null, arguments);
    return this;
}


function $fa7ced6b4872a0ed$export$2e2bcd8739ae039() {
    return Array.from(this);
}


function $ed742027ab5527a5$export$2e2bcd8739ae039() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j)for(var group = groups[j], i = 0, n = group.length; i < n; ++i){
        var node = group[i];
        if (node) return node;
    }
    return null;
}


function $7697c99a73ad117d$export$2e2bcd8739ae039() {
    let size = 0;
    for (const node of this)++size; // eslint-disable-line no-unused-vars
    return size;
}


function $db5003801c73338e$export$2e2bcd8739ae039() {
    return !this.node();
}


function $4a3aa5a8b8deabfd$export$2e2bcd8739ae039(callback) {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i)if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
    return this;
}



function $764b3e2561390c52$var$attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function $764b3e2561390c52$var$attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function $764b3e2561390c52$var$attrConstant(name, value) {
    return function() {
        this.setAttribute(name, value);
    };
}
function $764b3e2561390c52$var$attrConstantNS(fullname, value) {
    return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
    };
}
function $764b3e2561390c52$var$attrFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
    };
}
function $764b3e2561390c52$var$attrFunctionNS(fullname, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
    };
}
function $764b3e2561390c52$export$2e2bcd8739ae039(name, value) {
    var fullname = $3d4543eaa8d01dfb$export$2e2bcd8739ae039(name);
    if (arguments.length < 2) {
        var node = this.node();
        return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
    }
    return this.each((value == null ? fullname.local ? $764b3e2561390c52$var$attrRemoveNS : $764b3e2561390c52$var$attrRemove : typeof value === "function" ? fullname.local ? $764b3e2561390c52$var$attrFunctionNS : $764b3e2561390c52$var$attrFunction : fullname.local ? $764b3e2561390c52$var$attrConstantNS : $764b3e2561390c52$var$attrConstant)(fullname, value));
}


function $260efc204a283319$export$2e2bcd8739ae039(node) {
    return node.ownerDocument && node.ownerDocument.defaultView // node is a Node
     || node.document && node // node is a Window
     || node.defaultView; // node is a Document
}


function $d4fe4e71bc8ed4b0$var$styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function $d4fe4e71bc8ed4b0$var$styleConstant(name, value, priority) {
    return function() {
        this.style.setProperty(name, value, priority);
    };
}
function $d4fe4e71bc8ed4b0$var$styleFunction(name, value, priority) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
    };
}
function $d4fe4e71bc8ed4b0$export$2e2bcd8739ae039(name, value, priority) {
    return arguments.length > 1 ? this.each((value == null ? $d4fe4e71bc8ed4b0$var$styleRemove : typeof value === "function" ? $d4fe4e71bc8ed4b0$var$styleFunction : $d4fe4e71bc8ed4b0$var$styleConstant)(name, value, priority == null ? "" : priority)) : $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this.node(), name);
}
function $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(node, name) {
    return node.style.getPropertyValue(name) || $260efc204a283319$export$2e2bcd8739ae039(node).getComputedStyle(node, null).getPropertyValue(name);
}


function $10e5c5cca8035594$var$propertyRemove(name) {
    return function() {
        delete this[name];
    };
}
function $10e5c5cca8035594$var$propertyConstant(name, value) {
    return function() {
        this[name] = value;
    };
}
function $10e5c5cca8035594$var$propertyFunction(name, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
    };
}
function $10e5c5cca8035594$export$2e2bcd8739ae039(name, value) {
    return arguments.length > 1 ? this.each((value == null ? $10e5c5cca8035594$var$propertyRemove : typeof value === "function" ? $10e5c5cca8035594$var$propertyFunction : $10e5c5cca8035594$var$propertyConstant)(name, value)) : this.node()[name];
}


function $836709729828497b$var$classArray(string) {
    return string.trim().split(/^|\s+/);
}
function $836709729828497b$var$classList(node) {
    return node.classList || new $836709729828497b$var$ClassList(node);
}
function $836709729828497b$var$ClassList(node) {
    this._node = node;
    this._names = $836709729828497b$var$classArray(node.getAttribute("class") || "");
}
$836709729828497b$var$ClassList.prototype = {
    add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
            this._names.push(name);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
            this._names.splice(i, 1);
            this._node.setAttribute("class", this._names.join(" "));
        }
    },
    contains: function(name) {
        return this._names.indexOf(name) >= 0;
    }
};
function $836709729828497b$var$classedAdd(node, names) {
    var list = $836709729828497b$var$classList(node), i = -1, n = names.length;
    while(++i < n)list.add(names[i]);
}
function $836709729828497b$var$classedRemove(node, names) {
    var list = $836709729828497b$var$classList(node), i = -1, n = names.length;
    while(++i < n)list.remove(names[i]);
}
function $836709729828497b$var$classedTrue(names) {
    return function() {
        $836709729828497b$var$classedAdd(this, names);
    };
}
function $836709729828497b$var$classedFalse(names) {
    return function() {
        $836709729828497b$var$classedRemove(this, names);
    };
}
function $836709729828497b$var$classedFunction(names, value) {
    return function() {
        (value.apply(this, arguments) ? $836709729828497b$var$classedAdd : $836709729828497b$var$classedRemove)(this, names);
    };
}
function $836709729828497b$export$2e2bcd8739ae039(name, value) {
    var names = $836709729828497b$var$classArray(name + "");
    if (arguments.length < 2) {
        var list = $836709729828497b$var$classList(this.node()), i = -1, n = names.length;
        while(++i < n)if (!list.contains(names[i])) return false;
        return true;
    }
    return this.each((typeof value === "function" ? $836709729828497b$var$classedFunction : value ? $836709729828497b$var$classedTrue : $836709729828497b$var$classedFalse)(names, value));
}


function $8a22054df28805ea$var$textRemove() {
    this.textContent = "";
}
function $8a22054df28805ea$var$textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function $8a22054df28805ea$var$textFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
    };
}
function $8a22054df28805ea$export$2e2bcd8739ae039(value) {
    return arguments.length ? this.each(value == null ? $8a22054df28805ea$var$textRemove : (typeof value === "function" ? $8a22054df28805ea$var$textFunction : $8a22054df28805ea$var$textConstant)(value)) : this.node().textContent;
}


function $00e7332acc4c621c$var$htmlRemove() {
    this.innerHTML = "";
}
function $00e7332acc4c621c$var$htmlConstant(value) {
    return function() {
        this.innerHTML = value;
    };
}
function $00e7332acc4c621c$var$htmlFunction(value) {
    return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
    };
}
function $00e7332acc4c621c$export$2e2bcd8739ae039(value) {
    return arguments.length ? this.each(value == null ? $00e7332acc4c621c$var$htmlRemove : (typeof value === "function" ? $00e7332acc4c621c$var$htmlFunction : $00e7332acc4c621c$var$htmlConstant)(value)) : this.node().innerHTML;
}


function $59e5d335a34c490f$var$raise() {
    if (this.nextSibling) this.parentNode.appendChild(this);
}
function $59e5d335a34c490f$export$2e2bcd8739ae039() {
    return this.each($59e5d335a34c490f$var$raise);
}


function $a853ecc8fc7d076c$var$lower() {
    if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function $a853ecc8fc7d076c$export$2e2bcd8739ae039() {
    return this.each($a853ecc8fc7d076c$var$lower);
}




function $a3a4134c1881bf94$var$creatorInherit(name) {
    return function() {
        var document = this.ownerDocument, uri = this.namespaceURI;
        return uri === $25bd40d93a30f931$export$201a3f7520ccc326 && document.documentElement.namespaceURI === $25bd40d93a30f931$export$201a3f7520ccc326 ? document.createElement(name) : document.createElementNS(uri, name);
    };
}
function $a3a4134c1881bf94$var$creatorFixed(fullname) {
    return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
    };
}
function $a3a4134c1881bf94$export$2e2bcd8739ae039(name) {
    var fullname = $3d4543eaa8d01dfb$export$2e2bcd8739ae039(name);
    return (fullname.local ? $a3a4134c1881bf94$var$creatorFixed : $a3a4134c1881bf94$var$creatorInherit)(fullname);
}


function $c51490f0001320c9$export$2e2bcd8739ae039(name) {
    var create = typeof name === "function" ? name : $a3a4134c1881bf94$export$2e2bcd8739ae039(name);
    return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
    });
}




function $d7073a12180a34ac$var$constantNull() {
    return null;
}
function $d7073a12180a34ac$export$2e2bcd8739ae039(name, before) {
    var create = typeof name === "function" ? name : $a3a4134c1881bf94$export$2e2bcd8739ae039(name), select = before == null ? $d7073a12180a34ac$var$constantNull : typeof before === "function" ? before : $c00a0a933450306c$export$2e2bcd8739ae039(before);
    return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
    });
}


function $f6182b91d6da5734$var$remove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}
function $f6182b91d6da5734$export$2e2bcd8739ae039() {
    return this.each($f6182b91d6da5734$var$remove);
}


function $b50c56482daa7352$var$selection_cloneShallow() {
    var clone = this.cloneNode(false), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function $b50c56482daa7352$var$selection_cloneDeep() {
    var clone = this.cloneNode(true), parent = this.parentNode;
    return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function $b50c56482daa7352$export$2e2bcd8739ae039(deep) {
    return this.select(deep ? $b50c56482daa7352$var$selection_cloneDeep : $b50c56482daa7352$var$selection_cloneShallow);
}


function $7c17a5f719ab10b5$export$2e2bcd8739ae039(value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
}


function $dae533638332c17c$var$contextListener(listener) {
    return function(event) {
        listener.call(this, event, this.__data__);
    };
}
function $dae533638332c17c$var$parseTypenames(typenames) {
    return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {
            type: t,
            name: name
        };
    });
}
function $dae533638332c17c$var$onRemove(typename) {
    return function() {
        var on = this.__on;
        if (!on) return;
        for(var j = 0, i = -1, m = on.length, o; j < m; ++j)if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) this.removeEventListener(o.type, o.listener, o.options);
        else on[++i] = o;
        if (++i) on.length = i;
        else delete this.__on;
    };
}
function $dae533638332c17c$var$onAdd(typename, value, options) {
    return function() {
        var on = this.__on, o, listener = $dae533638332c17c$var$contextListener(value);
        if (on) {
            for(var j = 0, m = on.length; j < m; ++j)if ((o = on[j]).type === typename.type && o.name === typename.name) {
                this.removeEventListener(o.type, o.listener, o.options);
                this.addEventListener(o.type, o.listener = listener, o.options = options);
                o.value = value;
                return;
            }
        }
        this.addEventListener(typename.type, listener, options);
        o = {
            type: typename.type,
            name: typename.name,
            value: value,
            listener: listener,
            options: options
        };
        if (!on) this.__on = [
            o
        ];
        else on.push(o);
    };
}
function $dae533638332c17c$export$2e2bcd8739ae039(typename, value, options) {
    var typenames = $dae533638332c17c$var$parseTypenames(typename + ""), i, n = typenames.length, t;
    if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for(var j = 0, m = on.length, o; j < m; ++j)for(i = 0, o = on[j]; i < n; ++i){
            if ((t = typenames[i]).type === o.type && t.name === o.name) return o.value;
        }
        return;
    }
    on = value ? $dae533638332c17c$var$onAdd : $dae533638332c17c$var$onRemove;
    for(i = 0; i < n; ++i)this.each(on(typenames[i], value, options));
    return this;
}



function $9f825102506ff1a6$var$dispatchEvent(node, type, params) {
    var window = $260efc204a283319$export$2e2bcd8739ae039(node), event = window.CustomEvent;
    if (typeof event === "function") event = new event(type, params);
    else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
    }
    node.dispatchEvent(event);
}
function $9f825102506ff1a6$var$dispatchConstant(type, params) {
    return function() {
        return $9f825102506ff1a6$var$dispatchEvent(this, type, params);
    };
}
function $9f825102506ff1a6$var$dispatchFunction(type, params) {
    return function() {
        return $9f825102506ff1a6$var$dispatchEvent(this, type, params.apply(this, arguments));
    };
}
function $9f825102506ff1a6$export$2e2bcd8739ae039(type, params) {
    return this.each((typeof params === "function" ? $9f825102506ff1a6$var$dispatchFunction : $9f825102506ff1a6$var$dispatchConstant)(type, params));
}


function* $ac956cd8389c4db3$export$2e2bcd8739ae039() {
    for(var groups = this._groups, j = 0, m = groups.length; j < m; ++j){
        for(var group = groups[j], i = 0, n = group.length, node; i < n; ++i)if (node = group[i]) yield node;
    }
}


var $a0973b1091907b1c$export$e8e78c978b129247 = [
    null
];
function $a0973b1091907b1c$export$52baac22726c72bf(groups, parents) {
    this._groups = groups;
    this._parents = parents;
}
function $a0973b1091907b1c$var$selection() {
    return new $a0973b1091907b1c$export$52baac22726c72bf([
        [
            document.documentElement
        ]
    ], $a0973b1091907b1c$export$e8e78c978b129247);
}
function $a0973b1091907b1c$var$selection_selection() {
    return this;
}
$a0973b1091907b1c$export$52baac22726c72bf.prototype = $a0973b1091907b1c$var$selection.prototype = {
    constructor: $a0973b1091907b1c$export$52baac22726c72bf,
    select: $792d62152163be01$export$2e2bcd8739ae039,
    selectAll: $b9d44a587c0117df$export$2e2bcd8739ae039,
    selectChild: $76c8c827ca381496$export$2e2bcd8739ae039,
    selectChildren: $5185b9b72642a61a$export$2e2bcd8739ae039,
    filter: $1b41e78cab0621db$export$2e2bcd8739ae039,
    data: $f1148316681ca8ab$export$2e2bcd8739ae039,
    enter: $26840db5e62a1612$export$2e2bcd8739ae039,
    exit: $f1f0b685c83b4f55$export$2e2bcd8739ae039,
    join: $72000ef0e8326807$export$2e2bcd8739ae039,
    merge: $a7c65b68b840797a$export$2e2bcd8739ae039,
    selection: $a0973b1091907b1c$var$selection_selection,
    order: $c7ddf5b0acb0a0a2$export$2e2bcd8739ae039,
    sort: $a139104ce9d72859$export$2e2bcd8739ae039,
    call: $b37ffb41ea6933d2$export$2e2bcd8739ae039,
    nodes: $fa7ced6b4872a0ed$export$2e2bcd8739ae039,
    node: $ed742027ab5527a5$export$2e2bcd8739ae039,
    size: $7697c99a73ad117d$export$2e2bcd8739ae039,
    empty: $db5003801c73338e$export$2e2bcd8739ae039,
    each: $4a3aa5a8b8deabfd$export$2e2bcd8739ae039,
    attr: $764b3e2561390c52$export$2e2bcd8739ae039,
    style: $d4fe4e71bc8ed4b0$export$2e2bcd8739ae039,
    property: $10e5c5cca8035594$export$2e2bcd8739ae039,
    classed: $836709729828497b$export$2e2bcd8739ae039,
    text: $8a22054df28805ea$export$2e2bcd8739ae039,
    html: $00e7332acc4c621c$export$2e2bcd8739ae039,
    raise: $59e5d335a34c490f$export$2e2bcd8739ae039,
    lower: $a853ecc8fc7d076c$export$2e2bcd8739ae039,
    append: $c51490f0001320c9$export$2e2bcd8739ae039,
    insert: $d7073a12180a34ac$export$2e2bcd8739ae039,
    remove: $f6182b91d6da5734$export$2e2bcd8739ae039,
    clone: $b50c56482daa7352$export$2e2bcd8739ae039,
    datum: $7c17a5f719ab10b5$export$2e2bcd8739ae039,
    on: $dae533638332c17c$export$2e2bcd8739ae039,
    dispatch: $9f825102506ff1a6$export$2e2bcd8739ae039,
    [Symbol.iterator]: $ac956cd8389c4db3$export$2e2bcd8739ae039
};
var $a0973b1091907b1c$export$2e2bcd8739ae039 = $a0973b1091907b1c$var$selection;


function $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(selector) {
    return typeof selector === "string" ? new $a0973b1091907b1c$export$52baac22726c72bf([
        [
            document.querySelector(selector)
        ]
    ], [
        document.documentElement
    ]) : new $a0973b1091907b1c$export$52baac22726c72bf([
        [
            selector
        ]
    ], $a0973b1091907b1c$export$e8e78c978b129247);
}



const $eb4829065ceb6410$export$524615cd03e458cc = {
    passive: false
};
const $eb4829065ceb6410$export$35431a0e47022de1 = {
    capture: true,
    passive: false
};
function $eb4829065ceb6410$export$2e2561858db9bf47(event) {
    event.stopImmediatePropagation();
}
function $eb4829065ceb6410$export$2e2bcd8739ae039(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}


function $8e91586d1a980b16$export$2e2bcd8739ae039(view) {
    var root = view.document.documentElement, selection = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(view).on("dragstart.drag", $eb4829065ceb6410$export$2e2bcd8739ae039, $eb4829065ceb6410$export$35431a0e47022de1);
    if ("onselectstart" in root) selection.on("selectstart.drag", $eb4829065ceb6410$export$2e2bcd8739ae039, $eb4829065ceb6410$export$35431a0e47022de1);
    else {
        root.__noselect = root.style.MozUserSelect;
        root.style.MozUserSelect = "none";
    }
}
function $8e91586d1a980b16$export$833237748009e1e1(view, noclick) {
    var root = view.document.documentElement, selection = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(view).on("dragstart.drag", null);
    if (noclick) {
        selection.on("click.drag", $eb4829065ceb6410$export$2e2bcd8739ae039, $eb4829065ceb6410$export$35431a0e47022de1);
        setTimeout(function() {
            selection.on("click.drag", null);
        }, 0);
    }
    if ("onselectstart" in root) selection.on("selectstart.drag", null);
    else {
        root.style.MozUserSelect = root.__noselect;
        delete root.__noselect;
    }
}



function $ce2678e81ec75804$export$2e2bcd8739ae039(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
}
function $ce2678e81ec75804$export$8b58be045bf06082(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for(var key in definition)prototype[key] = definition[key];
    return prototype;
}


function $83c1401a7435255b$export$892596cec99bc70e() {}
var $83c1401a7435255b$export$4adafc6ed0600c10 = 0.7;
var $83c1401a7435255b$export$9eace2cc0d12c98d = 1 / $83c1401a7435255b$export$4adafc6ed0600c10;
var $83c1401a7435255b$var$reI = "\\s*([+-]?\\d+)\\s*", $83c1401a7435255b$var$reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*", $83c1401a7435255b$var$reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*", $83c1401a7435255b$var$reHex = /^#([0-9a-f]{3,8})$/, $83c1401a7435255b$var$reRgbInteger = new RegExp("^rgb\\(" + [
    $83c1401a7435255b$var$reI,
    $83c1401a7435255b$var$reI,
    $83c1401a7435255b$var$reI
] + "\\)$"), $83c1401a7435255b$var$reRgbPercent = new RegExp("^rgb\\(" + [
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP
] + "\\)$"), $83c1401a7435255b$var$reRgbaInteger = new RegExp("^rgba\\(" + [
    $83c1401a7435255b$var$reI,
    $83c1401a7435255b$var$reI,
    $83c1401a7435255b$var$reI,
    $83c1401a7435255b$var$reN
] + "\\)$"), $83c1401a7435255b$var$reRgbaPercent = new RegExp("^rgba\\(" + [
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reN
] + "\\)$"), $83c1401a7435255b$var$reHslPercent = new RegExp("^hsl\\(" + [
    $83c1401a7435255b$var$reN,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP
] + "\\)$"), $83c1401a7435255b$var$reHslaPercent = new RegExp("^hsla\\(" + [
    $83c1401a7435255b$var$reN,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reP,
    $83c1401a7435255b$var$reN
] + "\\)$");
var $83c1401a7435255b$var$named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
};
$ce2678e81ec75804$export$2e2bcd8739ae039($83c1401a7435255b$export$892596cec99bc70e, $83c1401a7435255b$export$2e2bcd8739ae039, {
    copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
    },
    displayable: function() {
        return this.rgb().displayable();
    },
    hex: $83c1401a7435255b$var$color_formatHex,
    formatHex: $83c1401a7435255b$var$color_formatHex,
    formatHsl: $83c1401a7435255b$var$color_formatHsl,
    formatRgb: $83c1401a7435255b$var$color_formatRgb,
    toString: $83c1401a7435255b$var$color_formatRgb
});
function $83c1401a7435255b$var$color_formatHex() {
    return this.rgb().formatHex();
}
function $83c1401a7435255b$var$color_formatHsl() {
    return $83c1401a7435255b$export$8133dc3fa904d6d1(this).formatHsl();
}
function $83c1401a7435255b$var$color_formatRgb() {
    return this.rgb().formatRgb();
}
function $83c1401a7435255b$export$2e2bcd8739ae039(format) {
    var m, l;
    format = (format + "").trim().toLowerCase();
    return (m = $83c1401a7435255b$var$reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? $83c1401a7435255b$var$rgbn(m) // #ff0000
     : l === 3 ? new $83c1401a7435255b$export$5e05a94393ac29e3(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) // #f00
     : l === 8 ? $83c1401a7435255b$var$rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) // #ff000000
     : l === 4 ? $83c1401a7435255b$var$rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) // #f000
     : null // invalid hex
    ) : (m = $83c1401a7435255b$var$reRgbInteger.exec(format)) ? new $83c1401a7435255b$export$5e05a94393ac29e3(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
     : (m = $83c1401a7435255b$var$reRgbPercent.exec(format)) ? new $83c1401a7435255b$export$5e05a94393ac29e3(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
     : (m = $83c1401a7435255b$var$reRgbaInteger.exec(format)) ? $83c1401a7435255b$var$rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
     : (m = $83c1401a7435255b$var$reRgbaPercent.exec(format)) ? $83c1401a7435255b$var$rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
     : (m = $83c1401a7435255b$var$reHslPercent.exec(format)) ? $83c1401a7435255b$var$hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
     : (m = $83c1401a7435255b$var$reHslaPercent.exec(format)) ? $83c1401a7435255b$var$hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
     : $83c1401a7435255b$var$named.hasOwnProperty(format) ? $83c1401a7435255b$var$rgbn($83c1401a7435255b$var$named[format]) // eslint-disable-line no-prototype-builtins
     : format === "transparent" ? new $83c1401a7435255b$export$5e05a94393ac29e3(NaN, NaN, NaN, 0) : null;
}
function $83c1401a7435255b$var$rgbn(n) {
    return new $83c1401a7435255b$export$5e05a94393ac29e3(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function $83c1401a7435255b$var$rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new $83c1401a7435255b$export$5e05a94393ac29e3(r, g, b, a);
}
function $83c1401a7435255b$export$42da0a331c2802f5(o) {
    if (!(o instanceof $83c1401a7435255b$export$892596cec99bc70e)) o = $83c1401a7435255b$export$2e2bcd8739ae039(o);
    if (!o) return new $83c1401a7435255b$export$5e05a94393ac29e3;
    o = o.rgb();
    return new $83c1401a7435255b$export$5e05a94393ac29e3(o.r, o.g, o.b, o.opacity);
}
function $83c1401a7435255b$export$8972dc0e6ad9238f(r, g, b, opacity) {
    return arguments.length === 1 ? $83c1401a7435255b$export$42da0a331c2802f5(r) : new $83c1401a7435255b$export$5e05a94393ac29e3(r, g, b, opacity == null ? 1 : opacity);
}
function $83c1401a7435255b$export$5e05a94393ac29e3(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
}
$ce2678e81ec75804$export$2e2bcd8739ae039($83c1401a7435255b$export$5e05a94393ac29e3, $83c1401a7435255b$export$8972dc0e6ad9238f, $ce2678e81ec75804$export$8b58be045bf06082($83c1401a7435255b$export$892596cec99bc70e, {
    brighter: function(k) {
        k = k == null ? $83c1401a7435255b$export$9eace2cc0d12c98d : Math.pow($83c1401a7435255b$export$9eace2cc0d12c98d, k);
        return new $83c1401a7435255b$export$5e05a94393ac29e3(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? $83c1401a7435255b$export$4adafc6ed0600c10 : Math.pow($83c1401a7435255b$export$4adafc6ed0600c10, k);
        return new $83c1401a7435255b$export$5e05a94393ac29e3(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
        return this;
    },
    displayable: function() {
        return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
    },
    hex: $83c1401a7435255b$var$rgb_formatHex,
    formatHex: $83c1401a7435255b$var$rgb_formatHex,
    formatRgb: $83c1401a7435255b$var$rgb_formatRgb,
    toString: $83c1401a7435255b$var$rgb_formatRgb
}));
function $83c1401a7435255b$var$rgb_formatHex() {
    return "#" + $83c1401a7435255b$var$hex(this.r) + $83c1401a7435255b$var$hex(this.g) + $83c1401a7435255b$var$hex(this.b);
}
function $83c1401a7435255b$var$rgb_formatRgb() {
    var a = this.opacity;
    a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? "rgb(" : "rgba(") + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", " + Math.max(0, Math.min(255, Math.round(this.b) || 0)) + (a === 1 ? ")" : ", " + a + ")");
}
function $83c1401a7435255b$var$hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
}
function $83c1401a7435255b$var$hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new $83c1401a7435255b$var$Hsl(h, s, l, a);
}
function $83c1401a7435255b$export$8133dc3fa904d6d1(o) {
    if (o instanceof $83c1401a7435255b$var$Hsl) return new $83c1401a7435255b$var$Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof $83c1401a7435255b$export$892596cec99bc70e)) o = $83c1401a7435255b$export$2e2bcd8739ae039(o);
    if (!o) return new $83c1401a7435255b$var$Hsl;
    if (o instanceof $83c1401a7435255b$var$Hsl) return o;
    o = o.rgb();
    var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
    if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
    } else s = l > 0 && l < 1 ? 0 : h;
    return new $83c1401a7435255b$var$Hsl(h, s, l, o.opacity);
}
function $83c1401a7435255b$export$8f4a7c0bb78e6ea8(h, s, l, opacity) {
    return arguments.length === 1 ? $83c1401a7435255b$export$8133dc3fa904d6d1(h) : new $83c1401a7435255b$var$Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function $83c1401a7435255b$var$Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
}
$ce2678e81ec75804$export$2e2bcd8739ae039($83c1401a7435255b$var$Hsl, $83c1401a7435255b$export$8f4a7c0bb78e6ea8, $ce2678e81ec75804$export$8b58be045bf06082($83c1401a7435255b$export$892596cec99bc70e, {
    brighter: function(k) {
        k = k == null ? $83c1401a7435255b$export$9eace2cc0d12c98d : Math.pow($83c1401a7435255b$export$9eace2cc0d12c98d, k);
        return new $83c1401a7435255b$var$Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
        k = k == null ? $83c1401a7435255b$export$4adafc6ed0600c10 : Math.pow($83c1401a7435255b$export$4adafc6ed0600c10, k);
        return new $83c1401a7435255b$var$Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
        return new $83c1401a7435255b$export$5e05a94393ac29e3($83c1401a7435255b$var$hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2), $83c1401a7435255b$var$hsl2rgb(h, m1, m2), $83c1401a7435255b$var$hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2), this.opacity);
    },
    displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
    },
    formatHsl: function() {
        var a = this.opacity;
        a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(") + (this.h || 0) + ", " + (this.s || 0) * 100 + "%, " + (this.l || 0) * 100 + "%" + (a === 1 ? ")" : ", " + a + ")");
    }
}));
/* From FvD 13.37, CSS Color Module Level 3 */ function $83c1401a7435255b$var$hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}




function $f7e130bb71512ffc$export$4e41033bfeec1a4c(t1, v0, v1, v2, v3) {
    var t2 = t1 * t1, t3 = t2 * t1;
    return ((1 - 3 * t1 + 3 * t2 - t3) * v0 + (4 - 6 * t2 + 3 * t3) * v1 + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2 + t3 * v3) / 6;
}
function $f7e130bb71512ffc$export$2e2bcd8739ae039(values) {
    var n = values.length - 1;
    return function(t) {
        var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
        return $f7e130bb71512ffc$export$4e41033bfeec1a4c((t - i / n) * n, v0, v1, v2, v3);
    };
}



function $2de2f3e83c473aaa$export$2e2bcd8739ae039(values) {
    var n = values.length;
    return function(t) {
        var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
        return $f7e130bb71512ffc$export$4e41033bfeec1a4c((t - i / n) * n, v0, v1, v2, v3);
    };
}


var $92db3e957d1c828a$export$2e2bcd8739ae039 = (x)=>()=>x
;


function $a62ea94214f91b4e$var$linear(a, d) {
    return function(t) {
        return a + t * d;
    };
}
function $a62ea94214f91b4e$var$exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
    };
}
function $a62ea94214f91b4e$export$97d7b0c7ddb78dcf(a, b) {
    var d = b - a;
    return d ? $a62ea94214f91b4e$var$linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : $92db3e957d1c828a$export$2e2bcd8739ae039(isNaN(a) ? b : a);
}
function $a62ea94214f91b4e$export$a7ebe8cc6aaf8d37(y) {
    return (y = +y) === 1 ? $a62ea94214f91b4e$export$2e2bcd8739ae039 : function(a, b) {
        return b - a ? $a62ea94214f91b4e$var$exponential(a, b, y) : $92db3e957d1c828a$export$2e2bcd8739ae039(isNaN(a) ? b : a);
    };
}
function $a62ea94214f91b4e$export$2e2bcd8739ae039(a, b) {
    var d = b - a;
    return d ? $a62ea94214f91b4e$var$linear(a, d) : $92db3e957d1c828a$export$2e2bcd8739ae039(isNaN(a) ? b : a);
}


var $6179528e8f79bd1f$export$2e2bcd8739ae039 = function rgbGamma(y) {
    var color = $a62ea94214f91b4e$export$a7ebe8cc6aaf8d37(y);
    function rgb(start, end) {
        var r = color((start = $83c1401a7435255b$export$8972dc0e6ad9238f(start)).r, (end = $83c1401a7435255b$export$8972dc0e6ad9238f(end)).r), g = color(start.g, end.g), b = color(start.b, end.b), opacity = $a62ea94214f91b4e$export$2e2bcd8739ae039(start.opacity, end.opacity);
        return function(t) {
            start.r = r(t);
            start.g = g(t);
            start.b = b(t);
            start.opacity = opacity(t);
            return start + "";
        };
    }
    rgb.gamma = rgbGamma;
    return rgb;
}(1);
function $6179528e8f79bd1f$var$rgbSpline(spline) {
    return function(colors) {
        var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color;
        for(i = 0; i < n; ++i){
            color = $83c1401a7435255b$export$8972dc0e6ad9238f(colors[i]);
            r[i] = color.r || 0;
            g[i] = color.g || 0;
            b[i] = color.b || 0;
        }
        r = spline(r);
        g = spline(g);
        b = spline(b);
        color.opacity = 1;
        return function(t) {
            color.r = r(t);
            color.g = g(t);
            color.b = b(t);
            return color + "";
        };
    };
}
var $6179528e8f79bd1f$export$2c0e28f2e2852d3f = $6179528e8f79bd1f$var$rgbSpline($f7e130bb71512ffc$export$2e2bcd8739ae039);
var $6179528e8f79bd1f$export$53d5214f625ccd4c = $6179528e8f79bd1f$var$rgbSpline($2de2f3e83c473aaa$export$2e2bcd8739ae039);



function $dad4b7a00b0d0d59$export$2e2bcd8739ae039(a, b) {
    if (!b) b = [];
    var n = a ? Math.min(b.length, a.length) : 0, c = b.slice(), i;
    return function(t) {
        for(i = 0; i < n; ++i)c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
    };
}
function $dad4b7a00b0d0d59$export$5cd576d1827d40c8(x) {
    return ArrayBuffer.isView(x) && !(x instanceof DataView);
}


function $99710fcd23e48d29$export$2e2bcd8739ae039(a, b) {
    return ($dad4b7a00b0d0d59$export$5cd576d1827d40c8(b) ? $dad4b7a00b0d0d59$export$2e2bcd8739ae039 : $99710fcd23e48d29$export$15d09067c6a5ee49)(a, b);
}
function $99710fcd23e48d29$export$15d09067c6a5ee49(a, b) {
    var nb = b ? b.length : 0, na = a ? Math.min(nb, a.length) : 0, x = new Array(na), c = new Array(nb), i;
    for(i = 0; i < na; ++i)x[i] = $f8ac76f3f1f1cf7e$export$2e2bcd8739ae039(a[i], b[i]);
    for(; i < nb; ++i)c[i] = b[i];
    return function(t) {
        for(i = 0; i < na; ++i)c[i] = x[i](t);
        return c;
    };
}


function $f0f5b2c884b32c54$export$2e2bcd8739ae039(a, b) {
    var d = new Date;
    return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
    };
}


function $63cd2ddea321c92c$export$2e2bcd8739ae039(a, b) {
    return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
    };
}



function $afabd7b2b2955341$export$2e2bcd8739ae039(a, b) {
    var i = {}, c = {}, k;
    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};
    for(k in b)if (k in a) i[k] = $f8ac76f3f1f1cf7e$export$2e2bcd8739ae039(a[k], b[k]);
    else c[k] = b[k];
    return function(t) {
        for(k in i)c[k] = i[k](t);
        return c;
    };
}



var $938bd1ef775701e6$var$reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, $938bd1ef775701e6$var$reB = new RegExp($938bd1ef775701e6$var$reA.source, "g");
function $938bd1ef775701e6$var$zero(b) {
    return function() {
        return b;
    };
}
function $938bd1ef775701e6$var$one(b) {
    return function(t) {
        return b(t) + "";
    };
}
function $938bd1ef775701e6$export$2e2bcd8739ae039(a, b) {
    var bi = $938bd1ef775701e6$var$reA.lastIndex = $938bd1ef775701e6$var$reB.lastIndex = 0, am, bm, bs, i1 = -1, s = [], q = []; // number interpolators
    // Coerce inputs to strings.
    a = a + "", b = b + "";
    // Interpolate pairs of numbers in a & b.
    while((am = $938bd1ef775701e6$var$reA.exec(a)) && (bm = $938bd1ef775701e6$var$reB.exec(b))){
        if ((bs = bm.index) > bi) {
            bs = b.slice(bi, bs);
            if (s[i1]) s[i1] += bs; // coalesce with previous string
            else s[++i1] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) {
            if (s[i1]) s[i1] += bm; // coalesce with previous string
            else s[++i1] = bm;
        } else {
            s[++i1] = null;
            q.push({
                i: i1,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(am, bm)
            });
        }
        bi = $938bd1ef775701e6$var$reB.lastIndex;
    }
    // Add remains of b.
    if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i1]) s[i1] += bs; // coalesce with previous string
        else s[++i1] = bs;
    }
    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? q[0] ? $938bd1ef775701e6$var$one(q[0].x) : $938bd1ef775701e6$var$zero(b) : (b = q.length, function(t) {
        for(var i = 0, o; i < b; ++i)s[(o = q[i]).i] = o.x(t);
        return s.join("");
    });
}




function $f8ac76f3f1f1cf7e$export$2e2bcd8739ae039(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? $92db3e957d1c828a$export$2e2bcd8739ae039(b) : (t === "number" ? $63cd2ddea321c92c$export$2e2bcd8739ae039 : t === "string" ? (c = $83c1401a7435255b$export$2e2bcd8739ae039(b)) ? (b = c, $6179528e8f79bd1f$export$2e2bcd8739ae039) : $938bd1ef775701e6$export$2e2bcd8739ae039 : b instanceof $83c1401a7435255b$export$2e2bcd8739ae039 ? $6179528e8f79bd1f$export$2e2bcd8739ae039 : b instanceof Date ? $f0f5b2c884b32c54$export$2e2bcd8739ae039 : $dad4b7a00b0d0d59$export$5cd576d1827d40c8(b) ? $dad4b7a00b0d0d59$export$2e2bcd8739ae039 : Array.isArray(b) ? $99710fcd23e48d29$export$15d09067c6a5ee49 : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? $afabd7b2b2955341$export$2e2bcd8739ae039 : $63cd2ddea321c92c$export$2e2bcd8739ae039)(a, b);
}


var $cfab906b6f7fc93b$var$degrees = 180 / Math.PI;
var $cfab906b6f7fc93b$export$f0954fd7d5368655 = {
    translateX: 0,
    translateY: 0,
    rotate: 0,
    skewX: 0,
    scaleX: 1,
    scaleY: 1
};
function $cfab906b6f7fc93b$export$2e2bcd8739ae039(a, b, c, d, e, f) {
    var scaleX, scaleY, skewX;
    if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
    if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
    if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
    if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
    return {
        translateX: e,
        translateY: f,
        rotate: Math.atan2(b, a) * $cfab906b6f7fc93b$var$degrees,
        skewX: Math.atan(skewX) * $cfab906b6f7fc93b$var$degrees,
        scaleX: scaleX,
        scaleY: scaleY
    };
}


var $7de0edc45a055210$var$svgNode;
function $7de0edc45a055210$export$59ad369bf4938177(value) {
    const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
    return m.isIdentity ? $cfab906b6f7fc93b$export$f0954fd7d5368655 : $cfab906b6f7fc93b$export$2e2bcd8739ae039(m.a, m.b, m.c, m.d, m.e, m.f);
}
function $7de0edc45a055210$export$f9ef43f9a1d89a18(value) {
    if (value == null) return $cfab906b6f7fc93b$export$f0954fd7d5368655;
    if (!$7de0edc45a055210$var$svgNode) $7de0edc45a055210$var$svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
    $7de0edc45a055210$var$svgNode.setAttribute("transform", value);
    if (!(value = $7de0edc45a055210$var$svgNode.transform.baseVal.consolidate())) return $cfab906b6f7fc93b$export$f0954fd7d5368655;
    value = value.matrix;
    return $cfab906b6f7fc93b$export$2e2bcd8739ae039(value.a, value.b, value.c, value.d, value.e, value.f);
}


function $285c48c4de50b34f$var$interpolateTransform(parse, pxComma, pxParen, degParen) {
    function pop(s) {
        return s.length ? s.pop() + " " : "";
    }
    function translate(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push("translate(", null, pxComma, null, pxParen);
            q.push({
                i: i - 4,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(xa, xb)
            }, {
                i: i - 2,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(ya, yb)
            });
        } else if (xb || yb) s.push("translate(" + xb + pxComma + yb + pxParen);
    }
    function rotate(a, b, s, q) {
        if (a !== b) {
            if (a - b > 180) b += 360;
            else if (b - a > 180) a += 360; // shortest path
            q.push({
                i: s.push(pop(s) + "rotate(", null, degParen) - 2,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(a, b)
            });
        } else if (b) s.push(pop(s) + "rotate(" + b + degParen);
    }
    function skewX(a, b, s, q) {
        if (a !== b) q.push({
            i: s.push(pop(s) + "skewX(", null, degParen) - 2,
            x: $63cd2ddea321c92c$export$2e2bcd8739ae039(a, b)
        });
        else if (b) s.push(pop(s) + "skewX(" + b + degParen);
    }
    function scale(xa, ya, xb, yb, s, q) {
        if (xa !== xb || ya !== yb) {
            var i = s.push(pop(s) + "scale(", null, ",", null, ")");
            q.push({
                i: i - 4,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(xa, xb)
            }, {
                i: i - 2,
                x: $63cd2ddea321c92c$export$2e2bcd8739ae039(ya, yb)
            });
        } else if (xb !== 1 || yb !== 1) s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
    return function(a, b) {
        var s = [], q = []; // number interpolators
        a = parse(a), b = parse(b);
        translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
        rotate(a.rotate, b.rotate, s, q);
        skewX(a.skewX, b.skewX, s, q);
        scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
        a = b = null; // gc
        return function(t) {
            var i = -1, n = q.length, o;
            while(++i < n)s[(o = q[i]).i] = o.x(t);
            return s.join("");
        };
    };
}
var $285c48c4de50b34f$export$56bec7123bb3589a = $285c48c4de50b34f$var$interpolateTransform($7de0edc45a055210$export$59ad369bf4938177, "px, ", "px)", "deg)");
var $285c48c4de50b34f$export$da8cba906d64c082 = $285c48c4de50b34f$var$interpolateTransform($7de0edc45a055210$export$f9ef43f9a1d89a18, ", ", ")", ")");

var $cf7d898c413036a8$var$epsilon2 = 0.000000000001;
function $cf7d898c413036a8$var$cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
}
function $cf7d898c413036a8$var$sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
}
function $cf7d898c413036a8$var$tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var $cf7d898c413036a8$export$2e2bcd8739ae039 = function zoomRho(rho, rho2, rho4) {
    // p0 = [ux0, uy0, w0]
    // p1 = [ux1, uy1, w1]
    function zoom(p0, p1) {
        var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
        // Special case for u0 ≅ u1.
        if (d2 < $cf7d898c413036a8$var$epsilon2) {
            S = Math.log(w1 / w0) / rho;
            i = function(t) {
                return [
                    ux0 + t * dx,
                    uy0 + t * dy,
                    w0 * Math.exp(rho * t * S)
                ];
            };
        } else {
            var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b1 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
            S = (r1 - r0) / rho;
            i = function(t) {
                var s = t * S, coshr0 = $cf7d898c413036a8$var$cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * $cf7d898c413036a8$var$tanh(rho * s + r0) - $cf7d898c413036a8$var$sinh(r0));
                return [
                    ux0 + u * dx,
                    uy0 + u * dy,
                    w0 * coshr0 / $cf7d898c413036a8$var$cosh(rho * s + r0)
                ];
            };
        }
        i.duration = S * 1000 * rho / Math.SQRT2;
        return i;
    }
    zoom.rho = function(_) {
        var _1 = Math.max(0.001, +_), _2 = _1 * _1, _4 = _2 * _2;
        return zoomRho(_1, _2, _4);
    };
    return zoom;
}(Math.SQRT2, 2, 4);






var $67bcf30486668411$var$frame = 0, $67bcf30486668411$var$timeout = 0, $67bcf30486668411$var$interval = 0, $67bcf30486668411$var$pokeDelay = 1000, $67bcf30486668411$var$taskHead, $67bcf30486668411$var$taskTail, $67bcf30486668411$var$clockLast = 0, $67bcf30486668411$var$clockNow = 0, $67bcf30486668411$var$clockSkew = 0, $67bcf30486668411$var$clock = typeof performance === "object" && performance.now ? performance : Date, $67bcf30486668411$var$setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
    setTimeout(f, 17);
};
function $67bcf30486668411$export$461939dd4422153() {
    return $67bcf30486668411$var$clockNow || ($67bcf30486668411$var$setFrame($67bcf30486668411$var$clearNow), $67bcf30486668411$var$clockNow = $67bcf30486668411$var$clock.now() + $67bcf30486668411$var$clockSkew);
}
function $67bcf30486668411$var$clearNow() {
    $67bcf30486668411$var$clockNow = 0;
}
function $67bcf30486668411$export$c57e9b2d8b9e4de() {
    this._call = this._time = this._next = null;
}
$67bcf30486668411$export$c57e9b2d8b9e4de.prototype = $67bcf30486668411$export$9dc4ecf953986f04.prototype = {
    constructor: $67bcf30486668411$export$c57e9b2d8b9e4de,
    restart: function(callback, delay, time) {
        if (typeof callback !== "function") throw new TypeError("callback is not a function");
        time = (time == null ? $67bcf30486668411$export$461939dd4422153() : +time) + (delay == null ? 0 : +delay);
        if (!this._next && $67bcf30486668411$var$taskTail !== this) {
            if ($67bcf30486668411$var$taskTail) $67bcf30486668411$var$taskTail._next = this;
            else $67bcf30486668411$var$taskHead = this;
            $67bcf30486668411$var$taskTail = this;
        }
        this._call = callback;
        this._time = time;
        $67bcf30486668411$var$sleep();
    },
    stop: function() {
        if (this._call) {
            this._call = null;
            this._time = Infinity;
            $67bcf30486668411$var$sleep();
        }
    }
};
function $67bcf30486668411$export$9dc4ecf953986f04(callback, delay, time) {
    var t = new $67bcf30486668411$export$c57e9b2d8b9e4de;
    t.restart(callback, delay, time);
    return t;
}
function $67bcf30486668411$export$d60154c1d7f3990e() {
    $67bcf30486668411$export$461939dd4422153(); // Get the current time, if not already set.
    ++$67bcf30486668411$var$frame; // Pretend we’ve set an alarm, if we haven’t already.
    var t = $67bcf30486668411$var$taskHead, e;
    while(t){
        if ((e = $67bcf30486668411$var$clockNow - t._time) >= 0) t._call.call(undefined, e);
        t = t._next;
    }
    --$67bcf30486668411$var$frame;
}
function $67bcf30486668411$var$wake() {
    $67bcf30486668411$var$clockNow = ($67bcf30486668411$var$clockLast = $67bcf30486668411$var$clock.now()) + $67bcf30486668411$var$clockSkew;
    $67bcf30486668411$var$frame = $67bcf30486668411$var$timeout = 0;
    try {
        $67bcf30486668411$export$d60154c1d7f3990e();
    } finally{
        $67bcf30486668411$var$frame = 0;
        $67bcf30486668411$var$nap();
        $67bcf30486668411$var$clockNow = 0;
    }
}
function $67bcf30486668411$var$poke() {
    var $67bcf30486668411$export$461939dd4422153 = $67bcf30486668411$var$clock.now(), delay = $67bcf30486668411$export$461939dd4422153 - $67bcf30486668411$var$clockLast;
    if (delay > $67bcf30486668411$var$pokeDelay) $67bcf30486668411$var$clockSkew -= delay, $67bcf30486668411$var$clockLast = $67bcf30486668411$export$461939dd4422153;
}
function $67bcf30486668411$var$nap() {
    var t0, t1 = $67bcf30486668411$var$taskHead, t2, time = Infinity;
    while(t1)if (t1._call) {
        if (time > t1._time) time = t1._time;
        t0 = t1, t1 = t1._next;
    } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : $67bcf30486668411$var$taskHead = t2;
    }
    $67bcf30486668411$var$taskTail = t0;
    $67bcf30486668411$var$sleep(time);
}
function $67bcf30486668411$var$sleep(time) {
    if ($67bcf30486668411$var$frame) return; // Soonest alarm already set, or will be.
    if ($67bcf30486668411$var$timeout) $67bcf30486668411$var$timeout = clearTimeout($67bcf30486668411$var$timeout);
    var delay = time - $67bcf30486668411$var$clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
        if (time < Infinity) $67bcf30486668411$var$timeout = setTimeout($67bcf30486668411$var$wake, time - $67bcf30486668411$var$clock.now() - $67bcf30486668411$var$clockSkew);
        if ($67bcf30486668411$var$interval) $67bcf30486668411$var$interval = clearInterval($67bcf30486668411$var$interval);
    } else {
        if (!$67bcf30486668411$var$interval) $67bcf30486668411$var$clockLast = $67bcf30486668411$var$clock.now(), $67bcf30486668411$var$interval = setInterval($67bcf30486668411$var$poke, $67bcf30486668411$var$pokeDelay);
        $67bcf30486668411$var$frame = 1, $67bcf30486668411$var$setFrame($67bcf30486668411$var$wake);
    }
}


function $d2ca0c7fede17b96$export$2e2bcd8739ae039(callback, delay, time) {
    var t = new $67bcf30486668411$export$c57e9b2d8b9e4de;
    delay = delay == null ? 0 : +delay;
    t.restart((elapsed)=>{
        t.stop();
        callback(elapsed + delay);
    }, delay, time);
    return t;
}



var $dc4e0aa2cfa27f7c$var$emptyOn = $dbb33bae16b3a2f1$export$2e2bcd8739ae039("start", "end", "cancel", "interrupt");
var $dc4e0aa2cfa27f7c$var$emptyTween = [];
var $dc4e0aa2cfa27f7c$export$ff39ebd4bb12b718 = 0;
var $dc4e0aa2cfa27f7c$export$584530fe98d14a84 = 1;
var $dc4e0aa2cfa27f7c$export$a5d151aee16efd42 = 2;
var $dc4e0aa2cfa27f7c$export$fb935ab5849a0db9 = 3;
var $dc4e0aa2cfa27f7c$export$1573e22b087389af = 4;
var $dc4e0aa2cfa27f7c$export$a2e792214ded83b2 = 5;
var $dc4e0aa2cfa27f7c$export$9d38167254403955 = 6;
function $dc4e0aa2cfa27f7c$export$2e2bcd8739ae039(node, name, id, index, group, timing) {
    var schedules = node.__transition;
    if (!schedules) node.__transition = {};
    else if (id in schedules) return;
    $dc4e0aa2cfa27f7c$var$create(node, id, {
        name: name,
        index: index,
        group: group,
        on: $dc4e0aa2cfa27f7c$var$emptyOn,
        tween: $dc4e0aa2cfa27f7c$var$emptyTween,
        time: timing.time,
        delay: timing.delay,
        duration: timing.duration,
        ease: timing.ease,
        timer: null,
        state: $dc4e0aa2cfa27f7c$export$ff39ebd4bb12b718
    });
}
function $dc4e0aa2cfa27f7c$export$2cd8252107eb640b(node, id) {
    var schedule = $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id);
    if (schedule.state > $dc4e0aa2cfa27f7c$export$ff39ebd4bb12b718) throw new Error("too late; already scheduled");
    return schedule;
}
function $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(node, id) {
    var schedule = $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id);
    if (schedule.state > $dc4e0aa2cfa27f7c$export$fb935ab5849a0db9) throw new Error("too late; already running");
    return schedule;
}
function $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id) {
    var schedule = node.__transition;
    if (!schedule || !(schedule = schedule[id])) throw new Error("transition not found");
    return schedule;
}
function $dc4e0aa2cfa27f7c$var$create(node, id, self) {
    var schedules = node.__transition, tween;
    // Initialize the self timer when the transition is created.
    // Note the actual delay is not known until the first callback!
    schedules[id] = self;
    self.timer = $67bcf30486668411$export$9dc4ecf953986f04(schedule, 0, self.time);
    function schedule(elapsed) {
        self.state = $dc4e0aa2cfa27f7c$export$584530fe98d14a84;
        self.timer.restart(start, self.delay, self.time);
        // If the elapsed delay is less than our first sleep, start immediately.
        if (self.delay <= elapsed) start(elapsed - self.delay);
    }
    function start(elapsed) {
        var i, j, n, o;
        // If the state is not SCHEDULED, then we previously errored on start.
        if (self.state !== $dc4e0aa2cfa27f7c$export$584530fe98d14a84) return stop();
        for(i in schedules){
            o = schedules[i];
            if (o.name !== self.name) continue;
            // While this element already has a starting transition during this frame,
            // defer starting an interrupting transition until that transition has a
            // chance to tick (and possibly end); see d3/d3-transition#54!
            if (o.state === $dc4e0aa2cfa27f7c$export$fb935ab5849a0db9) return $d2ca0c7fede17b96$export$2e2bcd8739ae039(start);
            // Interrupt the active transition, if any.
            if (o.state === $dc4e0aa2cfa27f7c$export$1573e22b087389af) {
                o.state = $dc4e0aa2cfa27f7c$export$9d38167254403955;
                o.timer.stop();
                o.on.call("interrupt", node, node.__data__, o.index, o.group);
                delete schedules[i];
            } else if (+i < id) {
                o.state = $dc4e0aa2cfa27f7c$export$9d38167254403955;
                o.timer.stop();
                o.on.call("cancel", node, node.__data__, o.index, o.group);
                delete schedules[i];
            }
        }
        // Defer the first tick to end of the current frame; see d3/d3#1576.
        // Note the transition may be canceled after start and before the first tick!
        // Note this must be scheduled before the start event; see d3/d3-transition#16!
        // Assuming this is successful, subsequent callbacks go straight to tick.
        $d2ca0c7fede17b96$export$2e2bcd8739ae039(function() {
            if (self.state === $dc4e0aa2cfa27f7c$export$fb935ab5849a0db9) {
                self.state = $dc4e0aa2cfa27f7c$export$1573e22b087389af;
                self.timer.restart(tick, self.delay, self.time);
                tick(elapsed);
            }
        });
        // Dispatch the start event.
        // Note this must be done before the tween are initialized.
        self.state = $dc4e0aa2cfa27f7c$export$a5d151aee16efd42;
        self.on.call("start", node, node.__data__, self.index, self.group);
        if (self.state !== $dc4e0aa2cfa27f7c$export$a5d151aee16efd42) return; // interrupted
        self.state = $dc4e0aa2cfa27f7c$export$fb935ab5849a0db9;
        // Initialize the tween, deleting null tween.
        tween = new Array(n = self.tween.length);
        for(i = 0, j = -1; i < n; ++i)if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) tween[++j] = o;
        tween.length = j + 1;
    }
    function tick(elapsed) {
        var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = $dc4e0aa2cfa27f7c$export$a2e792214ded83b2, 1), i = -1, n = tween.length;
        while(++i < n)tween[i].call(node, t);
        // Dispatch the end event.
        if (self.state === $dc4e0aa2cfa27f7c$export$a2e792214ded83b2) {
            self.on.call("end", node, node.__data__, self.index, self.group);
            stop();
        }
    }
    function stop() {
        self.state = $dc4e0aa2cfa27f7c$export$9d38167254403955;
        self.timer.stop();
        delete schedules[id];
        for(var i in schedules)return; // eslint-disable-line no-unused-vars
        delete node.__transition;
    }
}


function $ee0d9b70c16d1a80$export$2e2bcd8739ae039(node, name) {
    var schedules = node.__transition, schedule, active, empty = true, i;
    if (!schedules) return;
    name = name == null ? null : name + "";
    for(i in schedules){
        if ((schedule = schedules[i]).name !== name) {
            empty = false;
            continue;
        }
        active = schedule.state > $dc4e0aa2cfa27f7c$export$a5d151aee16efd42 && schedule.state < $dc4e0aa2cfa27f7c$export$a2e792214ded83b2;
        schedule.state = $dc4e0aa2cfa27f7c$export$9d38167254403955;
        schedule.timer.stop();
        schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
        delete schedules[i];
    }
    if (empty) delete node.__transition;
}


function $56d33bf116bc76fd$export$2e2bcd8739ae039(name) {
    return this.each(function() {
        $ee0d9b70c16d1a80$export$2e2bcd8739ae039(this, name);
    });
}






function $e4efba5d8320c7a0$var$tweenRemove(id, name) {
    var tween0, tween1;
    return function() {
        var schedule = $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = tween0 = tween;
            for(var i = 0, n = tween1.length; i < n; ++i)if (tween1[i].name === name) {
                tween1 = tween1.slice();
                tween1.splice(i, 1);
                break;
            }
        }
        schedule.tween = tween1;
    };
}
function $e4efba5d8320c7a0$var$tweenFunction(id, name, value) {
    var tween0, tween1;
    if (typeof value !== "function") throw new Error;
    return function() {
        var schedule = $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id), tween = schedule.tween;
        // If this node shared tween with the previous node,
        // just assign the updated shared tween and we’re done!
        // Otherwise, copy-on-write.
        if (tween !== tween0) {
            tween1 = (tween0 = tween).slice();
            for(var t = {
                name: name,
                value: value
            }, i = 0, n = tween1.length; i < n; ++i)if (tween1[i].name === name) {
                tween1[i] = t;
                break;
            }
            if (i === n) tween1.push(t);
        }
        schedule.tween = tween1;
    };
}
function $e4efba5d8320c7a0$export$2e2bcd8739ae039(name, value) {
    var id = this._id;
    name += "";
    if (arguments.length < 2) {
        var tween = $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(this.node(), id).tween;
        for(var i = 0, n = tween.length, t; i < n; ++i){
            if ((t = tween[i]).name === name) return t.value;
        }
        return null;
    }
    return this.each((value == null ? $e4efba5d8320c7a0$var$tweenRemove : $e4efba5d8320c7a0$var$tweenFunction)(id, name, value));
}
function $e4efba5d8320c7a0$export$f78ce6ab10405d82(transition, name, value) {
    var id = transition._id;
    transition.each(function() {
        var schedule = $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id);
        (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
    });
    return function(node) {
        return $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id).value[name];
    };
}




function $61d834d564aa1b1b$export$2e2bcd8739ae039(a, b) {
    var c;
    return (typeof b === "number" ? $63cd2ddea321c92c$export$2e2bcd8739ae039 : b instanceof $83c1401a7435255b$export$2e2bcd8739ae039 ? $6179528e8f79bd1f$export$2e2bcd8739ae039 : (c = $83c1401a7435255b$export$2e2bcd8739ae039(b)) ? (b = c, $6179528e8f79bd1f$export$2e2bcd8739ae039) : $938bd1ef775701e6$export$2e2bcd8739ae039)(a, b);
}


function $15c7217316737daa$var$attrRemove(name) {
    return function() {
        this.removeAttribute(name);
    };
}
function $15c7217316737daa$var$attrRemoveNS(fullname) {
    return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
    };
}
function $15c7217316737daa$var$attrConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttribute(name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function $15c7217316737daa$var$attrConstantNS(fullname, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = this.getAttributeNS(fullname.space, fullname.local);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function $15c7217316737daa$var$attrFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttribute(name);
        string0 = this.getAttribute(name);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function $15c7217316737daa$var$attrFunctionNS(fullname, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0, value1 = value(this), string1;
        if (value1 == null) return void this.removeAttributeNS(fullname.space, fullname.local);
        string0 = this.getAttributeNS(fullname.space, fullname.local);
        string1 = value1 + "";
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function $15c7217316737daa$export$2e2bcd8739ae039(name, value) {
    var fullname = $3d4543eaa8d01dfb$export$2e2bcd8739ae039(name), i = fullname === "transform" ? $285c48c4de50b34f$export$da8cba906d64c082 : $61d834d564aa1b1b$export$2e2bcd8739ae039;
    return this.attrTween(name, typeof value === "function" ? (fullname.local ? $15c7217316737daa$var$attrFunctionNS : $15c7217316737daa$var$attrFunction)(fullname, i, $e4efba5d8320c7a0$export$f78ce6ab10405d82(this, "attr." + name, value)) : value == null ? (fullname.local ? $15c7217316737daa$var$attrRemoveNS : $15c7217316737daa$var$attrRemove)(fullname) : (fullname.local ? $15c7217316737daa$var$attrConstantNS : $15c7217316737daa$var$attrConstant)(fullname, i, value));
}



function $bb8fecd861df08c0$var$attrInterpolate(name, i) {
    return function(t) {
        this.setAttribute(name, i.call(this, t));
    };
}
function $bb8fecd861df08c0$var$attrInterpolateNS(fullname, i) {
    return function(t) {
        this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
    };
}
function $bb8fecd861df08c0$var$attrTweenNS(fullname, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && $bb8fecd861df08c0$var$attrInterpolateNS(fullname, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function $bb8fecd861df08c0$var$attrTween(name, value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && $bb8fecd861df08c0$var$attrInterpolate(name, i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function $bb8fecd861df08c0$export$2e2bcd8739ae039(name, value) {
    var key = "attr." + name;
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    var fullname = $3d4543eaa8d01dfb$export$2e2bcd8739ae039(name);
    return this.tween(key, (fullname.local ? $bb8fecd861df08c0$var$attrTweenNS : $bb8fecd861df08c0$var$attrTween)(fullname, value));
}



function $4619c7632394eb0b$var$delayFunction(id, value) {
    return function() {
        $dc4e0aa2cfa27f7c$export$2cd8252107eb640b(this, id).delay = +value.apply(this, arguments);
    };
}
function $4619c7632394eb0b$var$delayConstant(id, value) {
    return value = +value, function() {
        $dc4e0aa2cfa27f7c$export$2cd8252107eb640b(this, id).delay = value;
    };
}
function $4619c7632394eb0b$export$2e2bcd8739ae039(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? $4619c7632394eb0b$var$delayFunction : $4619c7632394eb0b$var$delayConstant)(id, value)) : $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(this.node(), id).delay;
}



function $f0d1d1d0975e393d$var$durationFunction(id, value) {
    return function() {
        $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id).duration = +value.apply(this, arguments);
    };
}
function $f0d1d1d0975e393d$var$durationConstant(id, value) {
    return value = +value, function() {
        $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id).duration = value;
    };
}
function $f0d1d1d0975e393d$export$2e2bcd8739ae039(value) {
    var id = this._id;
    return arguments.length ? this.each((typeof value === "function" ? $f0d1d1d0975e393d$var$durationFunction : $f0d1d1d0975e393d$var$durationConstant)(id, value)) : $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(this.node(), id).duration;
}



function $c76de9c8970e6be9$var$easeConstant(id, value) {
    if (typeof value !== "function") throw new Error;
    return function() {
        $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id).ease = value;
    };
}
function $c76de9c8970e6be9$export$2e2bcd8739ae039(value) {
    var id = this._id;
    return arguments.length ? this.each($c76de9c8970e6be9$var$easeConstant(id, value)) : $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(this.node(), id).ease;
}



function $02626393a1033b2a$var$easeVarying(id, value) {
    return function() {
        var v = value.apply(this, arguments);
        if (typeof v !== "function") throw new Error;
        $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id).ease = v;
    };
}
function $02626393a1033b2a$export$2e2bcd8739ae039(value) {
    if (typeof value !== "function") throw new Error;
    return this.each($02626393a1033b2a$var$easeVarying(this._id, value));
}




function $ab9f25ab38141f86$export$2e2bcd8739ae039(match) {
    if (typeof match !== "function") match = $7c63b9ef11c1ee64$export$2e2bcd8739ae039(match);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i)if ((node = group[i]) && match.call(node, node.__data__, i, group)) subgroup.push(node);
    }
    return new $3646a062e2780c42$export$be58926105124dd4(subgroups, this._parents, this._name, this._id);
}



function $4f8a801930b7cf42$export$2e2bcd8739ae039(transition) {
    if (transition._id !== this._id) throw new Error;
    for(var groups0 = this._groups, groups1 = transition._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j){
        for(var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i)if (node = group0[i] || group1[i]) merge[i] = node;
    }
    for(; j < m0; ++j)merges[j] = groups0[j];
    return new $3646a062e2780c42$export$be58926105124dd4(merges, this._parents, this._name, this._id);
}



function $a121a1725277f7db$var$start(name) {
    return (name + "").trim().split(/^|\s+/).every(function(t) {
        var i = t.indexOf(".");
        if (i >= 0) t = t.slice(0, i);
        return !t || t === "start";
    });
}
function $a121a1725277f7db$var$onFunction(id, name, listener) {
    var on0, on1, sit = $a121a1725277f7db$var$start(name) ? $dc4e0aa2cfa27f7c$export$2cd8252107eb640b : $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be;
    return function() {
        var schedule = sit(this, id), on = schedule.on;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0) (on1 = (on0 = on).copy()).on(name, listener);
        schedule.on = on1;
    };
}
function $a121a1725277f7db$export$2e2bcd8739ae039(name, listener) {
    var id = this._id;
    return arguments.length < 2 ? $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(this.node(), id).on.on(name) : this.each($a121a1725277f7db$var$onFunction(id, name, listener));
}


function $5420259fdc1a848a$var$removeFunction(id) {
    return function() {
        var parent = this.parentNode;
        for(var i in this.__transition)if (+i !== id) return;
        if (parent) parent.removeChild(this);
    };
}
function $5420259fdc1a848a$export$2e2bcd8739ae039() {
    return this.on("end.remove", $5420259fdc1a848a$var$removeFunction(this._id));
}





function $82f13cd4ebb0d716$export$2e2bcd8739ae039(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = $c00a0a933450306c$export$2e2bcd8739ae039(select);
    for(var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i)if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
            $dc4e0aa2cfa27f7c$export$2e2bcd8739ae039(subgroup[i], name, id, i, subgroup, $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id));
        }
    }
    return new $3646a062e2780c42$export$be58926105124dd4(subgroups, this._parents, name, id);
}





function $af09b479bbb3f7b8$export$2e2bcd8739ae039(select) {
    var name = this._name, id = this._id;
    if (typeof select !== "function") select = $535004fbee91642f$export$2e2bcd8739ae039(select);
    for(var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i)if (node = group[i]) {
            for(var children = select.call(node, node.__data__, i, group), child, inherit = $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id), k = 0, l = children.length; k < l; ++k)if (child = children[k]) $dc4e0aa2cfa27f7c$export$2e2bcd8739ae039(child, name, id, k, children, inherit);
            subgroups.push(children);
            parents.push(node);
        }
    }
    return new $3646a062e2780c42$export$be58926105124dd4(subgroups, parents, name, id);
}



var $a5bf2a9ea199e882$var$Selection = $a0973b1091907b1c$export$2e2bcd8739ae039.prototype.constructor;
function $a5bf2a9ea199e882$export$2e2bcd8739ae039() {
    return new $a5bf2a9ea199e882$var$Selection(this._groups, this._parents);
}







function $255099a89e56183f$var$styleNull(name, interpolate) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this, name), string1 = (this.style.removeProperty(name), $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
    };
}
function $255099a89e56183f$var$styleRemove(name) {
    return function() {
        this.style.removeProperty(name);
    };
}
function $255099a89e56183f$var$styleConstant(name, interpolate, value1) {
    var string00, string1 = value1 + "", interpolate0;
    return function() {
        var string0 = $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this, name);
        return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
    };
}
function $255099a89e56183f$var$styleFunction(name, interpolate, value) {
    var string00, string10, interpolate0;
    return function() {
        var string0 = $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this, name), value1 = value(this), string1 = value1 + "";
        if (value1 == null) string1 = value1 = (this.style.removeProperty(name), $d4fe4e71bc8ed4b0$export$5e3cec964f0b5efd(this, name));
        return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
    };
}
function $255099a89e56183f$var$styleMaybeRemove(id, name) {
    var on0, on1, listener0, key = "style." + name, event = "end." + key, remove;
    return function() {
        var schedule = $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id), on = schedule.on, listener = schedule.value[key] == null ? remove || (remove = $255099a89e56183f$var$styleRemove(name)) : undefined;
        // If this node shared a dispatch with the previous node,
        // just assign the updated shared dispatch and we’re done!
        // Otherwise, copy-on-write.
        if (on !== on0 || listener0 !== listener) (on1 = (on0 = on).copy()).on(event, listener0 = listener);
        schedule.on = on1;
    };
}
function $255099a89e56183f$export$2e2bcd8739ae039(name, value, priority) {
    var i = (name += "") === "transform" ? $285c48c4de50b34f$export$56bec7123bb3589a : $61d834d564aa1b1b$export$2e2bcd8739ae039;
    return value == null ? this.styleTween(name, $255099a89e56183f$var$styleNull(name, i)).on("end.style." + name, $255099a89e56183f$var$styleRemove(name)) : typeof value === "function" ? this.styleTween(name, $255099a89e56183f$var$styleFunction(name, i, $e4efba5d8320c7a0$export$f78ce6ab10405d82(this, "style." + name, value))).each($255099a89e56183f$var$styleMaybeRemove(this._id, name)) : this.styleTween(name, $255099a89e56183f$var$styleConstant(name, i, value), priority).on("end.style." + name, null);
}


function $cda5a166ed28172a$var$styleInterpolate(name, i, priority) {
    return function(t) {
        this.style.setProperty(name, i.call(this, t), priority);
    };
}
function $cda5a166ed28172a$var$styleTween(name, value, priority) {
    var t, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t = (i0 = i) && $cda5a166ed28172a$var$styleInterpolate(name, i, priority);
        return t;
    }
    tween._value = value;
    return tween;
}
function $cda5a166ed28172a$export$2e2bcd8739ae039(name, value, priority) {
    var key = "style." + (name += "");
    if (arguments.length < 2) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, $cda5a166ed28172a$var$styleTween(name, value, priority == null ? "" : priority));
}



function $b158ccda8eb7b1fa$var$textConstant(value) {
    return function() {
        this.textContent = value;
    };
}
function $b158ccda8eb7b1fa$var$textFunction(value) {
    return function() {
        var value1 = value(this);
        this.textContent = value1 == null ? "" : value1;
    };
}
function $b158ccda8eb7b1fa$export$2e2bcd8739ae039(value) {
    return this.tween("text", typeof value === "function" ? $b158ccda8eb7b1fa$var$textFunction($e4efba5d8320c7a0$export$f78ce6ab10405d82(this, "text", value)) : $b158ccda8eb7b1fa$var$textConstant(value == null ? "" : value + ""));
}


function $c276b4b1c4a78044$var$textInterpolate(i) {
    return function(t) {
        this.textContent = i.call(this, t);
    };
}
function $c276b4b1c4a78044$var$textTween(value) {
    var t0, i0;
    function tween() {
        var i = value.apply(this, arguments);
        if (i !== i0) t0 = (i0 = i) && $c276b4b1c4a78044$var$textInterpolate(i);
        return t0;
    }
    tween._value = value;
    return tween;
}
function $c276b4b1c4a78044$export$2e2bcd8739ae039(value) {
    var key = "text";
    if (arguments.length < 1) return (key = this.tween(key)) && key._value;
    if (value == null) return this.tween(key, null);
    if (typeof value !== "function") throw new Error;
    return this.tween(key, $c276b4b1c4a78044$var$textTween(value));
}




function $ddc2bcd7c1e4d230$export$2e2bcd8739ae039() {
    var name = this._name, id0 = this._id, id1 = $3646a062e2780c42$export$9ffd10a3fbdc175b();
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i)if (node = group[i]) {
            var inherit = $dc4e0aa2cfa27f7c$export$3988ae62b71be9a3(node, id0);
            $dc4e0aa2cfa27f7c$export$2e2bcd8739ae039(node, name, id1, i, group, {
                time: inherit.time + inherit.delay + inherit.duration,
                delay: 0,
                duration: inherit.duration,
                ease: inherit.ease
            });
        }
    }
    return new $3646a062e2780c42$export$be58926105124dd4(groups, this._parents, name, id1);
}




function $5f1175cad930a8be$export$2e2bcd8739ae039() {
    var on0, on1, that = this, id = that._id, size = that.size();
    return new Promise(function(resolve, reject) {
        var cancel = {
            value: reject
        }, end = {
            value: function() {
                if (--size === 0) resolve();
            }
        };
        that.each(function() {
            var schedule = $dc4e0aa2cfa27f7c$export$adaa4cf7ef1b65be(this, id), on = schedule.on;
            // If this node shared a dispatch with the previous node,
            // just assign the updated shared dispatch and we’re done!
            // Otherwise, copy-on-write.
            if (on !== on0) {
                on1 = (on0 = on).copy();
                on1._.cancel.push(cancel);
                on1._.interrupt.push(cancel);
                on1._.end.push(end);
            }
            schedule.on = on1;
        });
        // The selection was empty, resolve end immediately
        if (size === 0) resolve();
    });
}


var $3646a062e2780c42$var$id = 0;
function $3646a062e2780c42$export$be58926105124dd4(groups, parents, name, id) {
    this._groups = groups;
    this._parents = parents;
    this._name = name;
    this._id = id;
}
function $3646a062e2780c42$export$2e2bcd8739ae039(name) {
    return $a0973b1091907b1c$export$2e2bcd8739ae039().transition(name);
}
function $3646a062e2780c42$export$9ffd10a3fbdc175b() {
    return ++$3646a062e2780c42$var$id;
}
var $3646a062e2780c42$var$selection_prototype = $a0973b1091907b1c$export$2e2bcd8739ae039.prototype;
$3646a062e2780c42$export$be58926105124dd4.prototype = $3646a062e2780c42$export$2e2bcd8739ae039.prototype = {
    constructor: $3646a062e2780c42$export$be58926105124dd4,
    select: $82f13cd4ebb0d716$export$2e2bcd8739ae039,
    selectAll: $af09b479bbb3f7b8$export$2e2bcd8739ae039,
    selectChild: $3646a062e2780c42$var$selection_prototype.selectChild,
    selectChildren: $3646a062e2780c42$var$selection_prototype.selectChildren,
    filter: $ab9f25ab38141f86$export$2e2bcd8739ae039,
    merge: $4f8a801930b7cf42$export$2e2bcd8739ae039,
    selection: $a5bf2a9ea199e882$export$2e2bcd8739ae039,
    transition: $ddc2bcd7c1e4d230$export$2e2bcd8739ae039,
    call: $3646a062e2780c42$var$selection_prototype.call,
    nodes: $3646a062e2780c42$var$selection_prototype.nodes,
    node: $3646a062e2780c42$var$selection_prototype.node,
    size: $3646a062e2780c42$var$selection_prototype.size,
    empty: $3646a062e2780c42$var$selection_prototype.empty,
    each: $3646a062e2780c42$var$selection_prototype.each,
    on: $a121a1725277f7db$export$2e2bcd8739ae039,
    attr: $15c7217316737daa$export$2e2bcd8739ae039,
    attrTween: $bb8fecd861df08c0$export$2e2bcd8739ae039,
    style: $255099a89e56183f$export$2e2bcd8739ae039,
    styleTween: $cda5a166ed28172a$export$2e2bcd8739ae039,
    text: $b158ccda8eb7b1fa$export$2e2bcd8739ae039,
    textTween: $c276b4b1c4a78044$export$2e2bcd8739ae039,
    remove: $5420259fdc1a848a$export$2e2bcd8739ae039,
    tween: $e4efba5d8320c7a0$export$2e2bcd8739ae039,
    delay: $4619c7632394eb0b$export$2e2bcd8739ae039,
    duration: $f0d1d1d0975e393d$export$2e2bcd8739ae039,
    ease: $c76de9c8970e6be9$export$2e2bcd8739ae039,
    easeVarying: $02626393a1033b2a$export$2e2bcd8739ae039,
    end: $5f1175cad930a8be$export$2e2bcd8739ae039,
    [Symbol.iterator]: $3646a062e2780c42$var$selection_prototype[Symbol.iterator]
};



function $d107e5c2943b71c6$export$b1a09cb1b71f86aa(t) {
    return t * t * t;
}
function $d107e5c2943b71c6$export$68d528839c701b6(t) {
    return --t * t * t + 1;
}
function $d107e5c2943b71c6$export$89238d3bc79d3ada(t) {
    return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}




var $f604203bcc8ba433$var$defaultTiming = {
    time: null,
    delay: 0,
    duration: 250,
    ease: $d107e5c2943b71c6$export$89238d3bc79d3ada
};
function $f604203bcc8ba433$var$inherit(node, id) {
    var timing;
    while(!(timing = node.__transition) || !(timing = timing[id])){
        if (!(node = node.parentNode)) throw new Error(`transition ${id} not found`);
    }
    return timing;
}
function $f604203bcc8ba433$export$2e2bcd8739ae039(name) {
    var id, timing;
    if (name instanceof $3646a062e2780c42$export$be58926105124dd4) id = name._id, name = name._name;
    else id = $3646a062e2780c42$export$9ffd10a3fbdc175b(), (timing = $f604203bcc8ba433$var$defaultTiming).time = $67bcf30486668411$export$461939dd4422153(), name = name == null ? null : name + "";
    for(var groups = this._groups, m = groups.length, j = 0; j < m; ++j){
        for(var group = groups[j], n = group.length, node, i = 0; i < n; ++i)if (node = group[i]) $dc4e0aa2cfa27f7c$export$2e2bcd8739ae039(node, name, id, i, group, timing || $f604203bcc8ba433$var$inherit(node, id));
    }
    return new $3646a062e2780c42$export$be58926105124dd4(groups, this._parents, name, id);
}


$a0973b1091907b1c$export$2e2bcd8739ae039.prototype.interrupt = $56d33bf116bc76fd$export$2e2bcd8739ae039;
$a0973b1091907b1c$export$2e2bcd8739ae039.prototype.transition = $f604203bcc8ba433$export$2e2bcd8739ae039;







var $ffc5367d81e551eb$export$2e2bcd8739ae039 = (x)=>()=>x
;


function $9057e67de5bf1118$export$2e2bcd8739ae039(type, { sourceEvent: sourceEvent , target: target , selection: selection , mode: mode , dispatch: dispatch  }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        selection: {
            value: selection,
            enumerable: true,
            configurable: true
        },
        mode: {
            value: mode,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}


function $760ae9ad63ceeafd$export$2e2561858db9bf47(event) {
    event.stopImmediatePropagation();
}
function $760ae9ad63ceeafd$export$2e2bcd8739ae039(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}


var $a9f4b21f3fc04a97$var$MODE_DRAG = {
    name: "drag"
}, $a9f4b21f3fc04a97$var$MODE_SPACE = {
    name: "space"
}, $a9f4b21f3fc04a97$var$MODE_HANDLE = {
    name: "handle"
}, $a9f4b21f3fc04a97$var$MODE_CENTER = {
    name: "center"
};
const { abs: $a9f4b21f3fc04a97$var$abs , max: $a9f4b21f3fc04a97$var$max , min: $a9f4b21f3fc04a97$var$min  } = Math;
function $a9f4b21f3fc04a97$var$number1(e) {
    return [
        +e[0],
        +e[1]
    ];
}
function $a9f4b21f3fc04a97$var$number2(e) {
    return [
        $a9f4b21f3fc04a97$var$number1(e[0]),
        $a9f4b21f3fc04a97$var$number1(e[1])
    ];
}
var $a9f4b21f3fc04a97$var$X = {
    name: "x",
    handles: [
        "w",
        "e"
    ].map($a9f4b21f3fc04a97$var$type),
    input: function(x, e) {
        return x == null ? null : [
            [
                +x[0],
                e[0][1]
            ],
            [
                +x[1],
                e[1][1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][0],
            xy[1][0]
        ];
    }
};
var $a9f4b21f3fc04a97$var$Y = {
    name: "y",
    handles: [
        "n",
        "s"
    ].map($a9f4b21f3fc04a97$var$type),
    input: function(y, e) {
        return y == null ? null : [
            [
                e[0][0],
                +y[0]
            ],
            [
                e[1][0],
                +y[1]
            ]
        ];
    },
    output: function(xy) {
        return xy && [
            xy[0][1],
            xy[1][1]
        ];
    }
};
var $a9f4b21f3fc04a97$var$XY = {
    name: "xy",
    handles: [
        "n",
        "w",
        "e",
        "s",
        "nw",
        "ne",
        "sw",
        "se"
    ].map($a9f4b21f3fc04a97$var$type),
    input: function(xy) {
        return xy == null ? null : $a9f4b21f3fc04a97$var$number2(xy);
    },
    output: function(xy) {
        return xy;
    }
};
var $a9f4b21f3fc04a97$var$cursors = {
    overlay: "crosshair",
    selection: "move",
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
};
var $a9f4b21f3fc04a97$var$flipX = {
    e: "w",
    w: "e",
    nw: "ne",
    ne: "nw",
    se: "sw",
    sw: "se"
};
var $a9f4b21f3fc04a97$var$flipY = {
    n: "s",
    s: "n",
    nw: "sw",
    ne: "se",
    se: "ne",
    sw: "nw"
};
var $a9f4b21f3fc04a97$var$signsX = {
    overlay: 1,
    selection: 1,
    n: null,
    e: 1,
    s: null,
    w: -1,
    nw: -1,
    ne: 1,
    se: 1,
    sw: -1
};
var $a9f4b21f3fc04a97$var$signsY = {
    overlay: 1,
    selection: 1,
    n: -1,
    e: null,
    s: 1,
    w: null,
    nw: -1,
    ne: -1,
    se: 1,
    sw: 1
};
function $a9f4b21f3fc04a97$var$type(t) {
    return {
        type: t
    };
}
// Ignore right-click, since that should open the context menu.
function $a9f4b21f3fc04a97$var$defaultFilter(event) {
    return !event.ctrlKey && !event.button;
}
function $a9f4b21f3fc04a97$var$defaultExtent() {
    var svg = this.ownerSVGElement || this;
    if (svg.hasAttribute("viewBox")) {
        svg = svg.viewBox.baseVal;
        return [
            [
                svg.x,
                svg.y
            ],
            [
                svg.x + svg.width,
                svg.y + svg.height
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            svg.width.baseVal.value,
            svg.height.baseVal.value
        ]
    ];
}
function $a9f4b21f3fc04a97$var$defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
// Like d3.local, but with the name “__brush” rather than auto-generated.
function $a9f4b21f3fc04a97$var$local(node) {
    while(!node.__brush)if (!(node = node.parentNode)) return;
    return node.__brush;
}
function $a9f4b21f3fc04a97$var$empty(extent) {
    return extent[0][0] === extent[1][0] || extent[0][1] === extent[1][1];
}
function $a9f4b21f3fc04a97$export$69760394fc76f689(node) {
    var state = node.__brush;
    return state ? state.dim.output(state.selection) : null;
}
function $a9f4b21f3fc04a97$export$979ace6c88860aa8() {
    return $a9f4b21f3fc04a97$var$brush($a9f4b21f3fc04a97$var$X);
}
function $a9f4b21f3fc04a97$export$468748b530991c54() {
    return $a9f4b21f3fc04a97$var$brush($a9f4b21f3fc04a97$var$Y);
}
function $a9f4b21f3fc04a97$export$2e2bcd8739ae039() {
    return $a9f4b21f3fc04a97$var$brush($a9f4b21f3fc04a97$var$XY);
}
function $a9f4b21f3fc04a97$var$brush(dim) {
    var extent1 = $a9f4b21f3fc04a97$var$defaultExtent, filter = $a9f4b21f3fc04a97$var$defaultFilter, touchable = $a9f4b21f3fc04a97$var$defaultTouchable, keys = true, listeners = $dbb33bae16b3a2f1$export$2e2bcd8739ae039("start", "brush", "end"), handleSize = 6, touchending;
    function brush(group) {
        var overlay = group.property("__brush", initialize).selectAll(".overlay").data([
            $a9f4b21f3fc04a97$var$type("overlay")
        ]);
        overlay.enter().append("rect").attr("class", "overlay").attr("pointer-events", "all").attr("cursor", $a9f4b21f3fc04a97$var$cursors.overlay).merge(overlay).each(function() {
            var extent = $a9f4b21f3fc04a97$var$local(this).extent;
            $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this).attr("x", extent[0][0]).attr("y", extent[0][1]).attr("width", extent[1][0] - extent[0][0]).attr("height", extent[1][1] - extent[0][1]);
        });
        group.selectAll(".selection").data([
            $a9f4b21f3fc04a97$var$type("selection")
        ]).enter().append("rect").attr("class", "selection").attr("cursor", $a9f4b21f3fc04a97$var$cursors.selection).attr("fill", "#777").attr("fill-opacity", 0.3).attr("stroke", "#fff").attr("shape-rendering", "crispEdges");
        var handle = group.selectAll(".handle").data(dim.handles, function(d) {
            return d.type;
        });
        handle.exit().remove();
        handle.enter().append("rect").attr("class", function(d) {
            return "handle handle--" + d.type;
        }).attr("cursor", function(d) {
            return $a9f4b21f3fc04a97$var$cursors[d.type];
        });
        group.each(redraw).attr("fill", "none").attr("pointer-events", "all").on("mousedown.brush", started).filter(touchable).on("touchstart.brush", started).on("touchmove.brush", touchmoved).on("touchend.brush touchcancel.brush", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    brush.move = function(group, selection, event1) {
        if (group.tween) group.on("start.brush", function(event) {
            emitter(this, arguments).beforestart().start(event);
        }).on("interrupt.brush end.brush", function(event) {
            emitter(this, arguments).end(event);
        }).tween("brush", function() {
            var that = this, state = that.__brush, emit = emitter(that, arguments), selection0 = state.selection, selection1 = dim.input(typeof selection === "function" ? selection.apply(this, arguments) : selection, state.extent), i = $f8ac76f3f1f1cf7e$export$2e2bcd8739ae039(selection0, selection1);
            function tween(t) {
                state.selection = t === 1 && selection1 === null ? null : i(t);
                redraw.call(that);
                emit.brush();
            }
            return selection0 !== null && selection1 !== null ? tween : tween(1);
        });
        else group.each(function() {
            var that = this, args = arguments, state = that.__brush, selection1 = dim.input(typeof selection === "function" ? selection.apply(that, args) : selection, state.extent), emit = emitter(that, args).beforestart();
            $ee0d9b70c16d1a80$export$2e2bcd8739ae039(that);
            state.selection = selection1 === null ? null : selection1;
            redraw.call(that);
            emit.start(event1).brush(event1).end(event1);
        });
    };
    brush.clear = function(group, event) {
        brush.move(group, null, event);
    };
    function redraw() {
        var group = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this), selection = $a9f4b21f3fc04a97$var$local(this).selection;
        if (selection) {
            group.selectAll(".selection").style("display", null).attr("x", selection[0][0]).attr("y", selection[0][1]).attr("width", selection[1][0] - selection[0][0]).attr("height", selection[1][1] - selection[0][1]);
            group.selectAll(".handle").style("display", null).attr("x", function(d) {
                return d.type[d.type.length - 1] === "e" ? selection[1][0] - handleSize / 2 : selection[0][0] - handleSize / 2;
            }).attr("y", function(d) {
                return d.type[0] === "s" ? selection[1][1] - handleSize / 2 : selection[0][1] - handleSize / 2;
            }).attr("width", function(d) {
                return d.type === "n" || d.type === "s" ? selection[1][0] - selection[0][0] + handleSize : handleSize;
            }).attr("height", function(d) {
                return d.type === "e" || d.type === "w" ? selection[1][1] - selection[0][1] + handleSize : handleSize;
            });
        } else group.selectAll(".selection,.handle").style("display", "none").attr("x", null).attr("y", null).attr("width", null).attr("height", null);
    }
    function emitter(that, args, clean) {
        var emit = that.__brush.emitter;
        return emit && (!clean || !emit.clean) ? emit : new Emitter(that, args, clean);
    }
    function Emitter(that, args, clean) {
        this.that = that;
        this.args = args;
        this.state = that.__brush;
        this.active = 0;
        this.clean = clean;
    }
    Emitter.prototype = {
        beforestart: function() {
            if (++this.active === 1) this.state.emitter = this, this.starting = true;
            return this;
        },
        start: function(event, mode) {
            if (this.starting) this.starting = false, this.emit("start", event, mode);
            else this.emit("brush", event);
            return this;
        },
        brush: function(event, mode) {
            this.emit("brush", event, mode);
            return this;
        },
        end: function(event, mode) {
            if (--this.active === 0) delete this.state.emitter, this.emit("end", event, mode);
            return this;
        },
        emit: function(type, event, mode) {
            var d = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this.that).datum();
            listeners.call(type, this.that, new $9057e67de5bf1118$export$2e2bcd8739ae039(type, {
                sourceEvent: event,
                target: brush,
                selection: dim.output(this.state.selection),
                mode: mode,
                dispatch: listeners
            }), d);
        }
    };
    function started(event2) {
        if (touchending && !event2.touches) return;
        if (!filter.apply(this, arguments)) return;
        var that = this, type = event2.target.__data__.type, mode = (keys && event2.metaKey ? type = "overlay" : type) === "selection" ? $a9f4b21f3fc04a97$var$MODE_DRAG : keys && event2.altKey ? $a9f4b21f3fc04a97$var$MODE_CENTER : $a9f4b21f3fc04a97$var$MODE_HANDLE, signX = dim === $a9f4b21f3fc04a97$var$Y ? null : $a9f4b21f3fc04a97$var$signsX[type], signY = dim === $a9f4b21f3fc04a97$var$X ? null : $a9f4b21f3fc04a97$var$signsY[type], state = $a9f4b21f3fc04a97$var$local(that), extent = state.extent, selection = state.selection, W = extent[0][0], w0, w1, N = extent[0][1], n0, n1, E = extent[1][0], e0, e1, S = extent[1][1], s0, s1, dx = 0, dy = 0, moving, shifting = signX && signY && keys && event2.shiftKey, lockX, lockY, points = Array.from(event2.touches || [
            event2
        ], (t)=>{
            const i = t.identifier;
            t = $e01916ed2668b0f2$export$2e2bcd8739ae039(t, that);
            t.point0 = t.slice();
            t.identifier = i;
            return t;
        });
        $ee0d9b70c16d1a80$export$2e2bcd8739ae039(that);
        var emit = emitter(that, arguments, true).beforestart();
        if (type === "overlay") {
            if (selection) moving = true;
            const pts = [
                points[0],
                points[1] || points[0]
            ];
            state.selection = selection = [
                [
                    w0 = dim === $a9f4b21f3fc04a97$var$Y ? W : $a9f4b21f3fc04a97$var$min(pts[0][0], pts[1][0]),
                    n0 = dim === $a9f4b21f3fc04a97$var$X ? N : $a9f4b21f3fc04a97$var$min(pts[0][1], pts[1][1])
                ],
                [
                    e0 = dim === $a9f4b21f3fc04a97$var$Y ? E : $a9f4b21f3fc04a97$var$max(pts[0][0], pts[1][0]),
                    s0 = dim === $a9f4b21f3fc04a97$var$X ? S : $a9f4b21f3fc04a97$var$max(pts[0][1], pts[1][1])
                ]
            ];
            if (points.length > 1) move(event2);
        } else {
            w0 = selection[0][0];
            n0 = selection[0][1];
            e0 = selection[1][0];
            s0 = selection[1][1];
        }
        w1 = w0;
        n1 = n0;
        e1 = e0;
        s1 = s0;
        var group = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(that).attr("pointer-events", "none");
        var overlay = group.selectAll(".overlay").attr("cursor", $a9f4b21f3fc04a97$var$cursors[type]);
        if (event2.touches) {
            emit.moved = moved;
            emit.ended = ended;
        } else {
            var view = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(event2.view).on("mousemove.brush", moved, true).on("mouseup.brush", ended, true);
            if (keys) view.on("keydown.brush", keydowned, true).on("keyup.brush", keyupped, true);
            $8e91586d1a980b16$export$2e2bcd8739ae039(event2.view);
        }
        redraw.call(that);
        emit.start(event2, mode.name);
        function moved(event) {
            for (const p of event.changedTouches || [
                event
            ]){
                for (const d of points)if (d.identifier === p.identifier) d.cur = $e01916ed2668b0f2$export$2e2bcd8739ae039(p, that);
            }
            if (shifting && !lockX && !lockY && points.length === 1) {
                const point = points[0];
                if ($a9f4b21f3fc04a97$var$abs(point.cur[0] - point[0]) > $a9f4b21f3fc04a97$var$abs(point.cur[1] - point[1])) lockY = true;
                else lockX = true;
            }
            for (const point of points)if (point.cur) point[0] = point.cur[0], point[1] = point.cur[1];
            moving = true;
            $760ae9ad63ceeafd$export$2e2bcd8739ae039(event);
            move(event);
        }
        function move(event) {
            const point = points[0], point0 = point.point0;
            var t;
            dx = point[0] - point0[0];
            dy = point[1] - point0[1];
            switch(mode){
                case $a9f4b21f3fc04a97$var$MODE_SPACE:
                case $a9f4b21f3fc04a97$var$MODE_DRAG:
                    if (signX) dx = $a9f4b21f3fc04a97$var$max(W - w0, $a9f4b21f3fc04a97$var$min(E - e0, dx)), w1 = w0 + dx, e1 = e0 + dx;
                    if (signY) dy = $a9f4b21f3fc04a97$var$max(N - n0, $a9f4b21f3fc04a97$var$min(S - s0, dy)), n1 = n0 + dy, s1 = s0 + dy;
                    break;
                case $a9f4b21f3fc04a97$var$MODE_HANDLE:
                    if (points[1]) {
                        if (signX) w1 = $a9f4b21f3fc04a97$var$max(W, $a9f4b21f3fc04a97$var$min(E, points[0][0])), e1 = $a9f4b21f3fc04a97$var$max(W, $a9f4b21f3fc04a97$var$min(E, points[1][0])), signX = 1;
                        if (signY) n1 = $a9f4b21f3fc04a97$var$max(N, $a9f4b21f3fc04a97$var$min(S, points[0][1])), s1 = $a9f4b21f3fc04a97$var$max(N, $a9f4b21f3fc04a97$var$min(S, points[1][1])), signY = 1;
                    } else {
                        if (signX < 0) dx = $a9f4b21f3fc04a97$var$max(W - w0, $a9f4b21f3fc04a97$var$min(E - w0, dx)), w1 = w0 + dx, e1 = e0;
                        else if (signX > 0) dx = $a9f4b21f3fc04a97$var$max(W - e0, $a9f4b21f3fc04a97$var$min(E - e0, dx)), w1 = w0, e1 = e0 + dx;
                        if (signY < 0) dy = $a9f4b21f3fc04a97$var$max(N - n0, $a9f4b21f3fc04a97$var$min(S - n0, dy)), n1 = n0 + dy, s1 = s0;
                        else if (signY > 0) dy = $a9f4b21f3fc04a97$var$max(N - s0, $a9f4b21f3fc04a97$var$min(S - s0, dy)), n1 = n0, s1 = s0 + dy;
                    }
                    break;
                case $a9f4b21f3fc04a97$var$MODE_CENTER:
                    if (signX) w1 = $a9f4b21f3fc04a97$var$max(W, $a9f4b21f3fc04a97$var$min(E, w0 - dx * signX)), e1 = $a9f4b21f3fc04a97$var$max(W, $a9f4b21f3fc04a97$var$min(E, e0 + dx * signX));
                    if (signY) n1 = $a9f4b21f3fc04a97$var$max(N, $a9f4b21f3fc04a97$var$min(S, n0 - dy * signY)), s1 = $a9f4b21f3fc04a97$var$max(N, $a9f4b21f3fc04a97$var$min(S, s0 + dy * signY));
                    break;
            }
            if (e1 < w1) {
                signX *= -1;
                t = w0, w0 = e0, e0 = t;
                t = w1, w1 = e1, e1 = t;
                if (type in $a9f4b21f3fc04a97$var$flipX) overlay.attr("cursor", $a9f4b21f3fc04a97$var$cursors[type = $a9f4b21f3fc04a97$var$flipX[type]]);
            }
            if (s1 < n1) {
                signY *= -1;
                t = n0, n0 = s0, s0 = t;
                t = n1, n1 = s1, s1 = t;
                if (type in $a9f4b21f3fc04a97$var$flipY) overlay.attr("cursor", $a9f4b21f3fc04a97$var$cursors[type = $a9f4b21f3fc04a97$var$flipY[type]]);
            }
            if (state.selection) selection = state.selection; // May be set by brush.move!
            if (lockX) w1 = selection[0][0], e1 = selection[1][0];
            if (lockY) n1 = selection[0][1], s1 = selection[1][1];
            if (selection[0][0] !== w1 || selection[0][1] !== n1 || selection[1][0] !== e1 || selection[1][1] !== s1) {
                state.selection = [
                    [
                        w1,
                        n1
                    ],
                    [
                        e1,
                        s1
                    ]
                ];
                redraw.call(that);
                emit.brush(event, mode.name);
            }
        }
        function ended(event) {
            $760ae9ad63ceeafd$export$2e2561858db9bf47(event);
            if (event.touches) {
                if (event.touches.length) return;
                if (touchending) clearTimeout(touchending);
                touchending = setTimeout(function() {
                    touchending = null;
                }, 500); // Ghost clicks are delayed!
            } else {
                $8e91586d1a980b16$export$833237748009e1e1(event.view, moving);
                view.on("keydown.brush keyup.brush mousemove.brush mouseup.brush", null);
            }
            group.attr("pointer-events", "all");
            overlay.attr("cursor", $a9f4b21f3fc04a97$var$cursors.overlay);
            if (state.selection) selection = state.selection; // May be set by brush.move (on start)!
            if ($a9f4b21f3fc04a97$var$empty(selection)) state.selection = null, redraw.call(that);
            emit.end(event, mode.name);
        }
        function keydowned(event) {
            switch(event.keyCode){
                case 16:
                    shifting = signX && signY;
                    break;
                case 18:
                    if (mode === $a9f4b21f3fc04a97$var$MODE_HANDLE) {
                        if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                        if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                        mode = $a9f4b21f3fc04a97$var$MODE_CENTER;
                        move(event);
                    }
                    break;
                case 32:
                    if (mode === $a9f4b21f3fc04a97$var$MODE_HANDLE || mode === $a9f4b21f3fc04a97$var$MODE_CENTER) {
                        if (signX < 0) e0 = e1 - dx;
                        else if (signX > 0) w0 = w1 - dx;
                        if (signY < 0) s0 = s1 - dy;
                        else if (signY > 0) n0 = n1 - dy;
                        mode = $a9f4b21f3fc04a97$var$MODE_SPACE;
                        overlay.attr("cursor", $a9f4b21f3fc04a97$var$cursors.selection);
                        move(event);
                    }
                    break;
                default:
                    return;
            }
            $760ae9ad63ceeafd$export$2e2bcd8739ae039(event);
        }
        function keyupped(event) {
            switch(event.keyCode){
                case 16:
                    if (shifting) {
                        lockX = lockY = shifting = false;
                        move(event);
                    }
                    break;
                case 18:
                    if (mode === $a9f4b21f3fc04a97$var$MODE_CENTER) {
                        if (signX < 0) e0 = e1;
                        else if (signX > 0) w0 = w1;
                        if (signY < 0) s0 = s1;
                        else if (signY > 0) n0 = n1;
                        mode = $a9f4b21f3fc04a97$var$MODE_HANDLE;
                        move(event);
                    }
                    break;
                case 32:
                    if (mode === $a9f4b21f3fc04a97$var$MODE_SPACE) {
                        if (event.altKey) {
                            if (signX) e0 = e1 - dx * signX, w0 = w1 + dx * signX;
                            if (signY) s0 = s1 - dy * signY, n0 = n1 + dy * signY;
                            mode = $a9f4b21f3fc04a97$var$MODE_CENTER;
                        } else {
                            if (signX < 0) e0 = e1;
                            else if (signX > 0) w0 = w1;
                            if (signY < 0) s0 = s1;
                            else if (signY > 0) n0 = n1;
                            mode = $a9f4b21f3fc04a97$var$MODE_HANDLE;
                        }
                        overlay.attr("cursor", $a9f4b21f3fc04a97$var$cursors[type]);
                        move(event);
                    }
                    break;
                default:
                    return;
            }
            $760ae9ad63ceeafd$export$2e2bcd8739ae039(event);
        }
    }
    function touchmoved(event) {
        emitter(this, arguments).moved(event);
    }
    function touchended(event) {
        emitter(this, arguments).ended(event);
    }
    function initialize() {
        var state = this.__brush || {
            selection: null
        };
        state.extent = $a9f4b21f3fc04a97$var$number2(extent1.apply(this, arguments));
        state.dim = dim;
        return state;
    }
    brush.extent = function(_) {
        return arguments.length ? (extent1 = typeof _ === "function" ? _ : $ffc5367d81e551eb$export$2e2bcd8739ae039($a9f4b21f3fc04a97$var$number2(_)), brush) : extent1;
    };
    brush.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : $ffc5367d81e551eb$export$2e2bcd8739ae039(!!_), brush) : filter;
    };
    brush.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : $ffc5367d81e551eb$export$2e2bcd8739ae039(!!_), brush) : touchable;
    };
    brush.handleSize = function(_) {
        return arguments.length ? (handleSize = +_, brush) : handleSize;
    };
    brush.keyModifiers = function(_) {
        return arguments.length ? (keys = !!_, brush) : keys;
    };
    brush.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? brush : value;
    };
    return brush;
}



































var $81264fedcdbb7979$export$2e2bcd8739ae039 = (x)=>()=>x
;


function $8dff361741ae9d59$export$2e2bcd8739ae039(type, { sourceEvent: sourceEvent , target: target , transform: transform , dispatch: dispatch  }) {
    Object.defineProperties(this, {
        type: {
            value: type,
            enumerable: true,
            configurable: true
        },
        sourceEvent: {
            value: sourceEvent,
            enumerable: true,
            configurable: true
        },
        target: {
            value: target,
            enumerable: true,
            configurable: true
        },
        transform: {
            value: transform,
            enumerable: true,
            configurable: true
        },
        _: {
            value: dispatch
        }
    });
}


function $003468492b3c3d1b$export$563a914cafbdc389(k, x, y) {
    this.k = k;
    this.x = x;
    this.y = y;
}
$003468492b3c3d1b$export$563a914cafbdc389.prototype = {
    constructor: $003468492b3c3d1b$export$563a914cafbdc389,
    scale: function(k) {
        return k === 1 ? this : new $003468492b3c3d1b$export$563a914cafbdc389(this.k * k, this.x, this.y);
    },
    translate: function(x, y) {
        return x === 0 & y === 0 ? this : new $003468492b3c3d1b$export$563a914cafbdc389(this.k, this.x + this.k * x, this.y + this.k * y);
    },
    apply: function(point) {
        return [
            point[0] * this.k + this.x,
            point[1] * this.k + this.y
        ];
    },
    applyX: function(x) {
        return x * this.k + this.x;
    },
    applyY: function(y) {
        return y * this.k + this.y;
    },
    invert: function(location) {
        return [
            (location[0] - this.x) / this.k,
            (location[1] - this.y) / this.k
        ];
    },
    invertX: function(x) {
        return (x - this.x) / this.k;
    },
    invertY: function(y) {
        return (y - this.y) / this.k;
    },
    rescaleX: function(x) {
        return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
    },
    rescaleY: function(y) {
        return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
    },
    toString: function() {
        return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
    }
};
var $003468492b3c3d1b$export$f0954fd7d5368655 = new $003468492b3c3d1b$export$563a914cafbdc389(1, 0, 0);
$003468492b3c3d1b$export$2e2bcd8739ae039.prototype = $003468492b3c3d1b$export$563a914cafbdc389.prototype;
function $003468492b3c3d1b$export$2e2bcd8739ae039(node) {
    while(!node.__zoom)if (!(node = node.parentNode)) return $003468492b3c3d1b$export$f0954fd7d5368655;
    return node.__zoom;
}


function $a91d3f395d139aa5$export$2e2561858db9bf47(event) {
    event.stopImmediatePropagation();
}
function $a91d3f395d139aa5$export$2e2bcd8739ae039(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
}


// Ignore right-click, since that should open the context menu.
// except for pinch-to-zoom, which is sent as a wheel+ctrlKey event
function $0f071f8bed93edca$var$defaultFilter(event) {
    return (!event.ctrlKey || event.type === 'wheel') && !event.button;
}
function $0f071f8bed93edca$var$defaultExtent() {
    var e = this;
    if (e instanceof SVGElement) {
        e = e.ownerSVGElement || e;
        if (e.hasAttribute("viewBox")) {
            e = e.viewBox.baseVal;
            return [
                [
                    e.x,
                    e.y
                ],
                [
                    e.x + e.width,
                    e.y + e.height
                ]
            ];
        }
        return [
            [
                0,
                0
            ],
            [
                e.width.baseVal.value,
                e.height.baseVal.value
            ]
        ];
    }
    return [
        [
            0,
            0
        ],
        [
            e.clientWidth,
            e.clientHeight
        ]
    ];
}
function $0f071f8bed93edca$var$defaultTransform() {
    return this.__zoom || $003468492b3c3d1b$export$f0954fd7d5368655;
}
function $0f071f8bed93edca$var$defaultWheelDelta(event) {
    return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1);
}
function $0f071f8bed93edca$var$defaultTouchable() {
    return navigator.maxTouchPoints || "ontouchstart" in this;
}
function $0f071f8bed93edca$var$defaultConstrain(transform, extent, translateExtent) {
    var dx0 = transform.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform.invertY(extent[1][1]) - translateExtent[1][1];
    return transform.translate(dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1), dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1));
}
function $0f071f8bed93edca$export$2e2bcd8739ae039() {
    var filter = $0f071f8bed93edca$var$defaultFilter, extent1 = $0f071f8bed93edca$var$defaultExtent, constrain = $0f071f8bed93edca$var$defaultConstrain, wheelDelta = $0f071f8bed93edca$var$defaultWheelDelta, touchable = $0f071f8bed93edca$var$defaultTouchable, scaleExtent = [
        0,
        Infinity
    ], translateExtent = [
        [
            -Infinity,
            -Infinity
        ],
        [
            Infinity,
            Infinity
        ]
    ], duration = 250, interpolate = $cf7d898c413036a8$export$2e2bcd8739ae039, listeners = $dbb33bae16b3a2f1$export$2e2bcd8739ae039("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
    function zoom(selection) {
        selection.property("__zoom", $0f071f8bed93edca$var$defaultTransform).on("wheel.zoom", wheeled, {
            passive: false
        }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
    }
    zoom.transform = function(collection, transform, point, event) {
        var selection = collection.selection ? collection.selection() : collection;
        selection.property("__zoom", $0f071f8bed93edca$var$defaultTransform);
        if (collection !== selection) schedule(collection, transform, point, event);
        else selection.interrupt().each(function() {
            gesture(this, arguments).event(event).start().zoom(null, typeof transform === "function" ? transform.apply(this, arguments) : transform).end();
        });
    };
    zoom.scaleBy = function(selection, k, p, event) {
        zoom.scaleTo(selection, function() {
            var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return k0 * k1;
        }, p, event);
    };
    zoom.scaleTo = function(selection, k, p, event) {
        zoom.transform(selection, function() {
            var e = extent1.apply(this, arguments), t0 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t0.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
            return constrain(translate(scale(t0, k1), p0, p1), e, translateExtent);
        }, p, event);
    };
    zoom.translateBy = function(selection, x, y, event) {
        zoom.transform(selection, function() {
            return constrain(this.__zoom.translate(typeof x === "function" ? x.apply(this, arguments) : x, typeof y === "function" ? y.apply(this, arguments) : y), extent1.apply(this, arguments), translateExtent);
        }, null, event);
    };
    zoom.translateTo = function(selection, x, y, p, event) {
        zoom.transform(selection, function() {
            var e = extent1.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
            return constrain($003468492b3c3d1b$export$f0954fd7d5368655.translate(p0[0], p0[1]).scale(t.k).translate(typeof x === "function" ? -x.apply(this, arguments) : -x, typeof y === "function" ? -y.apply(this, arguments) : -y), e, translateExtent);
        }, p, event);
    };
    function scale(transform, k) {
        k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
        return k === transform.k ? transform : new $003468492b3c3d1b$export$563a914cafbdc389(k, transform.x, transform.y);
    }
    function translate(transform, p0, p1) {
        var x = p0[0] - p1[0] * transform.k, y = p0[1] - p1[1] * transform.k;
        return x === transform.x && y === transform.y ? transform : new $003468492b3c3d1b$export$563a914cafbdc389(transform.k, x, y);
    }
    function centroid(extent) {
        return [
            (+extent[0][0] + +extent[1][0]) / 2,
            (+extent[0][1] + +extent[1][1]) / 2
        ];
    }
    function schedule(transition, transform, point, event) {
        transition.on("start.zoom", function() {
            gesture(this, arguments).event(event).start();
        }).on("interrupt.zoom end.zoom", function() {
            gesture(this, arguments).event(event).end();
        }).tween("zoom", function() {
            var that = this, args = arguments, g = gesture(that, args).event(event), e = extent1.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform === "function" ? transform.apply(that, args) : transform, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
            return function(t) {
                if (t === 1) t = b; // Avoid rounding error on end.
                else {
                    var l = i(t), k = w / l[2];
                    t = new $003468492b3c3d1b$export$563a914cafbdc389(k, p[0] - l[0] * k, p[1] - l[1] * k);
                }
                g.zoom(null, t);
            };
        });
    }
    function gesture(that, args, clean) {
        return !clean && that.__zooming || new Gesture(that, args);
    }
    function Gesture(that, args) {
        this.that = that;
        this.args = args;
        this.active = 0;
        this.sourceEvent = null;
        this.extent = extent1.apply(that, args);
        this.taps = 0;
    }
    Gesture.prototype = {
        event: function(event) {
            if (event) this.sourceEvent = event;
            return this;
        },
        start: function() {
            if (++this.active === 1) {
                this.that.__zooming = this;
                this.emit("start");
            }
            return this;
        },
        zoom: function(key, transform) {
            if (this.mouse && key !== "mouse") this.mouse[1] = transform.invert(this.mouse[0]);
            if (this.touch0 && key !== "touch") this.touch0[1] = transform.invert(this.touch0[0]);
            if (this.touch1 && key !== "touch") this.touch1[1] = transform.invert(this.touch1[0]);
            this.that.__zoom = transform;
            this.emit("zoom");
            return this;
        },
        end: function() {
            if (--this.active === 0) {
                delete this.that.__zooming;
                this.emit("end");
            }
            return this;
        },
        emit: function(type) {
            var d = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this.that).datum();
            listeners.call(type, this.that, new $8dff361741ae9d59$export$2e2bcd8739ae039(type, {
                sourceEvent: this.sourceEvent,
                target: zoom,
                type: type,
                transform: this.that.__zoom,
                dispatch: listeners
            }), d);
        }
    };
    function wheeled(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = $e01916ed2668b0f2$export$2e2bcd8739ae039(event);
        // If the mouse is in the same location as before, reuse it.
        // If there were recent wheel events, reset the wheel idle timeout.
        if (g.wheel) {
            if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) g.mouse[1] = t.invert(g.mouse[0] = p);
            clearTimeout(g.wheel);
        } else if (t.k === k) return;
        else {
            g.mouse = [
                p,
                t.invert(p)
            ];
            $ee0d9b70c16d1a80$export$2e2bcd8739ae039(this);
            g.start();
        }
        $a91d3f395d139aa5$export$2e2bcd8739ae039(event);
        g.wheel = setTimeout(wheelidled, wheelDelay);
        g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
        function wheelidled() {
            g.wheel = null;
            g.end();
        }
    }
    function mousedowned(event1, ...args) {
        if (touchending || !filter.apply(this, arguments)) return;
        var currentTarget = event1.currentTarget, g = gesture(this, args, true).event(event1), v = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(event1.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = $e01916ed2668b0f2$export$2e2bcd8739ae039(event1, currentTarget), x0 = event1.clientX, y0 = event1.clientY;
        $8e91586d1a980b16$export$2e2bcd8739ae039(event1.view);
        $a91d3f395d139aa5$export$2e2561858db9bf47(event1);
        g.mouse = [
            p,
            this.__zoom.invert(p)
        ];
        $ee0d9b70c16d1a80$export$2e2bcd8739ae039(this);
        g.start();
        function mousemoved(event) {
            $a91d3f395d139aa5$export$2e2bcd8739ae039(event);
            if (!g.moved) {
                var dx = event.clientX - x0, dy = event.clientY - y0;
                g.moved = dx * dx + dy * dy > clickDistance2;
            }
            g.event(event).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = $e01916ed2668b0f2$export$2e2bcd8739ae039(event, currentTarget), g.mouse[1]), g.extent, translateExtent));
        }
        function mouseupped(event) {
            v.on("mousemove.zoom mouseup.zoom", null);
            $8e91586d1a980b16$export$833237748009e1e1(event.view, g.moved);
            $a91d3f395d139aa5$export$2e2bcd8739ae039(event);
            g.event(event).end();
        }
    }
    function dblclicked(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var t0 = this.__zoom, p0 = $e01916ed2668b0f2$export$2e2bcd8739ae039(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t0.invert(p0), k1 = t0.k * (event.shiftKey ? 0.5 : 2), t1 = constrain(translate(scale(t0, k1), p0, p1), extent1.apply(this, args), translateExtent);
        $a91d3f395d139aa5$export$2e2bcd8739ae039(event);
        if (duration > 0) $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this).transition().duration(duration).call(schedule, t1, p0, event);
        else $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this).call(zoom.transform, t1, p0, event);
    }
    function touchstarted(event, ...args) {
        if (!filter.apply(this, arguments)) return;
        var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
        $a91d3f395d139aa5$export$2e2561858db9bf47(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = $e01916ed2668b0f2$export$2e2bcd8739ae039(t, this);
            p = [
                p,
                this.__zoom.invert(p),
                t.identifier
            ];
            if (!g.touch0) g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
            else if (!g.touch1 && g.touch0[2] !== p[2]) g.touch1 = p, g.taps = 0;
        }
        if (touchstarting) touchstarting = clearTimeout(touchstarting);
        if (started) {
            if (g.taps < 2) touchfirst = p[0], touchstarting = setTimeout(function() {
                touchstarting = null;
            }, touchDelay);
            $ee0d9b70c16d1a80$export$2e2bcd8739ae039(this);
            g.start();
        }
    }
    function touchmoved(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
        $a91d3f395d139aa5$export$2e2bcd8739ae039(event);
        for(i = 0; i < n; ++i){
            t = touches[i], p = $e01916ed2668b0f2$export$2e2bcd8739ae039(t, this);
            if (g.touch0 && g.touch0[2] === t.identifier) g.touch0[0] = p;
            else if (g.touch1 && g.touch1[2] === t.identifier) g.touch1[0] = p;
        }
        t = g.that.__zoom;
        if (g.touch1) {
            var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
            t = scale(t, Math.sqrt(dp / dl));
            p = [
                (p0[0] + p1[0]) / 2,
                (p0[1] + p1[1]) / 2
            ];
            l = [
                (l0[0] + l1[0]) / 2,
                (l0[1] + l1[1]) / 2
            ];
        } else if (g.touch0) p = g.touch0[0], l = g.touch0[1];
        else return;
        g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
    }
    function touchended(event, ...args) {
        if (!this.__zooming) return;
        var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
        $a91d3f395d139aa5$export$2e2561858db9bf47(event);
        if (touchending) clearTimeout(touchending);
        touchending = setTimeout(function() {
            touchending = null;
        }, touchDelay);
        for(i = 0; i < n; ++i){
            t = touches[i];
            if (g.touch0 && g.touch0[2] === t.identifier) delete g.touch0;
            else if (g.touch1 && g.touch1[2] === t.identifier) delete g.touch1;
        }
        if (g.touch1 && !g.touch0) g.touch0 = g.touch1, delete g.touch1;
        if (g.touch0) g.touch0[1] = this.__zoom.invert(g.touch0[0]);
        else {
            g.end();
            // If this was a dbltap, reroute to the (optional) dblclick.zoom handler.
            if (g.taps === 2) {
                t = $e01916ed2668b0f2$export$2e2bcd8739ae039(t, this);
                if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
                    var p = $fb10b9d31a0b7b8a$export$2e2bcd8739ae039(this).on("dblclick.zoom");
                    if (p) p.apply(this, arguments);
                }
            }
        }
    }
    zoom.wheelDelta = function(_) {
        return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : $81264fedcdbb7979$export$2e2bcd8739ae039(+_), zoom) : wheelDelta;
    };
    zoom.filter = function(_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : $81264fedcdbb7979$export$2e2bcd8739ae039(!!_), zoom) : filter;
    };
    zoom.touchable = function(_) {
        return arguments.length ? (touchable = typeof _ === "function" ? _ : $81264fedcdbb7979$export$2e2bcd8739ae039(!!_), zoom) : touchable;
    };
    zoom.extent = function(_) {
        return arguments.length ? (extent1 = typeof _ === "function" ? _ : $81264fedcdbb7979$export$2e2bcd8739ae039([
            [
                +_[0][0],
                +_[0][1]
            ],
            [
                +_[1][0],
                +_[1][1]
            ]
        ]), zoom) : extent1;
    };
    zoom.scaleExtent = function(_) {
        return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [
            scaleExtent[0],
            scaleExtent[1]
        ];
    };
    zoom.translateExtent = function(_) {
        return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [
            [
                translateExtent[0][0],
                translateExtent[0][1]
            ],
            [
                translateExtent[1][0],
                translateExtent[1][1]
            ]
        ];
    };
    zoom.constrain = function(_) {
        return arguments.length ? (constrain = _, zoom) : constrain;
    };
    zoom.duration = function(_) {
        return arguments.length ? (duration = +_, zoom) : duration;
    };
    zoom.interpolate = function(_) {
        return arguments.length ? (interpolate = _, zoom) : interpolate;
    };
    zoom.on = function() {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? zoom : value;
    };
    zoom.clickDistance = function(_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
    };
    zoom.tapDistance = function(_) {
        return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
    };
    return zoom;
}








var $9976dad94f405c55$export$cd6265b069888eed;
(function($9976dad94f405c55$export$cd6265b069888eed) {
    $9976dad94f405c55$export$cd6265b069888eed["Objects"] = "Objects";
    $9976dad94f405c55$export$cd6265b069888eed["Interaction"] = "Interaction";
})($9976dad94f405c55$export$cd6265b069888eed || ($9976dad94f405c55$export$cd6265b069888eed = {}));
class $9976dad94f405c55$export$ca67b0b0fa758253 {
    constructor(onObjectClick = null, poiAvailable){
        this._objectClickCallback = onObjectClick;
        this._poiAvailable = poiAvailable;
    }
    _fireSelect(object) {
        if (this._objectClickCallback) this._objectClickCallback(object);
    }
}


var $fb74569b2db9a7e7$export$2a5c597f89453a1c;
(function($fb74569b2db9a7e7$export$2a5c597f89453a1c) {
    $fb74569b2db9a7e7$export$2a5c597f89453a1c[$fb74569b2db9a7e7$export$2a5c597f89453a1c["none"] = 0] = "none";
    $fb74569b2db9a7e7$export$2a5c597f89453a1c[$fb74569b2db9a7e7$export$2a5c597f89453a1c["pointer"] = 1] = "pointer";
    $fb74569b2db9a7e7$export$2a5c597f89453a1c[$fb74569b2db9a7e7$export$2a5c597f89453a1c["key"] = 2] = "key";
    $fb74569b2db9a7e7$export$2a5c597f89453a1c[$fb74569b2db9a7e7$export$2a5c597f89453a1c["App"] = 3] = "App";
})($fb74569b2db9a7e7$export$2a5c597f89453a1c || ($fb74569b2db9a7e7$export$2a5c597f89453a1c = {}));
var $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01;
(function($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01) {
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["Click"] = 0] = "Click";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["AlternateClick"] = 1] = "AlternateClick";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["MouseDown"] = 2] = "MouseDown";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["MouseUp"] = 3] = "MouseUp";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["MouseMove"] = 4] = "MouseMove";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["MouseLeave"] = 5] = "MouseLeave";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["MouseEnter"] = 6] = "MouseEnter";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["Selection"] = 7] = "Selection";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["ReferenceObject"] = 8] = "ReferenceObject";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["Key"] = 9] = "Key";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["App"] = 10] = "App";
    $fb74569b2db9a7e7$export$fdc6f9e2a46b1b01[$fb74569b2db9a7e7$export$fdc6f9e2a46b1b01["Cancel"] = 11] = "Cancel";
})($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01 || ($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01 = {}));







var $229862f972072627$var$ToolClasses;
(function(ToolClasses) {
    ToolClasses["object"] = "grObject";
    ToolClasses["handle"] = "transformationHandle";
    ToolClasses["poi"] = "pointOfInterest";
    ToolClasses["boundingBox"] = "boundingBox";
    ToolClasses["guide"] = "guide";
})($229862f972072627$var$ToolClasses || ($229862f972072627$var$ToolClasses = {}));
var $229862f972072627$var$ToolClassSelectors;
(function(ToolClassSelectors) {
    ToolClassSelectors["object"] = ".grObject";
    ToolClassSelectors["handle"] = ".transformationHandle";
    ToolClassSelectors["poi"] = ".pointOfInterest";
    ToolClassSelectors["boundingBox"] = ".boundingBox";
    ToolClassSelectors["guide"] = ".guide";
})($229862f972072627$var$ToolClassSelectors || ($229862f972072627$var$ToolClassSelectors = {}));
let $229862f972072627$var$infoHandle = 0;
function $229862f972072627$var$p2d(p, operation = "L") {
    return `${operation} ${p.x} ${p.y}`;
}
class $229862f972072627$export$fb77dabb7e6f239e extends $9976dad94f405c55$export$ca67b0b0fa758253 {
    constructor(onObjectClick = null, poiAvailable){
        super(onObjectClick, poiAvailable);
        this._renderedObjects = [];
        this._objectInfo = {};
    }
    init(containerId) {
        this._setupLayers($fb10b9d31a0b7b8a$export$2e2bcd8739ae039("#" + containerId));
    }
    setupMouseHandlers(onMouseMove, onClick, onAlternateClick, onMouseDown, onMouseUp) {
        this._svg.on("mousemove", onMouseMove);
        this._svg.on("click", onClick);
        this._svg.on("contextmenu", onAlternateClick);
        this._svg.on("mousedown", onMouseDown);
        this._svg.on("mouseup", onMouseUp);
    }
    _setupLayers(container) {
        this._svg = container;
        this._backgroundLayer = container.append("g");
        this._objectLayer = container.append("g");
        this._interactionLayer = container.append("g");
        this._infoLayer = container.append("g").style("pointer-events", "none");
        this._snappingLayer = container.append("g");
    }
    reset() {
        this._renderedObjects = [];
        this.clear($9976dad94f405c55$export$cd6265b069888eed.Objects);
        this.clear($9976dad94f405c55$export$cd6265b069888eed.Interaction);
    }
    clear(layer) {
        if (layer === $9976dad94f405c55$export$cd6265b069888eed.Objects) {
            this._objectLayer.selectAll("*").remove();
            this._objectInfo = {};
            this._renderedObjects = [];
        } else if (layer === $9976dad94f405c55$export$cd6265b069888eed.Interaction) this._interactionLayer.selectAll("*").remove();
    }
    remove(object) {
        this._objectLayer.select("#" + object.id).remove();
    }
    render(object, selected) {
        this._renderedObjects.push(object);
        return this._render(object, selected);
    }
    _render(object, selected, parent = null, enableMouseEvents = true) {
        switch(object.type){
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Circle:
                this._renderCircle(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Rectangle:
                this._renderRectangle(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Ellipse:
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Square:
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Line:
                this._renderLine(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Text:
                this._renderText(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Polygon:
                this._renderPolygon(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Quadratic:
                this._renderQuadratic(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Bezier:
                this._renderBezier(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Composite:
                this._renderComposite(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List:
                this._renderList(this._objectLayer, object, parent, enableMouseEvents);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Canvas:
                this._renderCanvas(this._backgroundLayer, object, parent, enableMouseEvents);
                break;
        }
        if (selected && object.type !== $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List) this.renderBoundingRepresentation(object);
        else this.removeBoundingRepresentation(object);
    }
    enablePOI(enabled, poiCallback, except) {
        if (!this._poiAvailable) return;
        if (this._poiRenderingEnabled) this._snappingLayer.selectAll("*").remove();
        if (enabled) this._renderedObjects.forEach((o)=>{
            if (!except.find((e)=>e.uniqueName === o.uniqueName
            )) this.renderPOI(o, poiCallback);
        });
        this._poiRenderingEnabled = enabled;
    }
    renderPOI(object, poiCallback) {
        let svgGroup = this._snappingLayer.select("#" + object.id + "-info");
        if (!svgGroup.empty()) svgGroup.selectAll("*").remove();
        else svgGroup = this._snappingLayer.append("g").attr("id", object.id + "-info");
        const poiIds = Object.keys(object.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.SNAPPING));
        Object.values(object.pointsOfInterest($92808e6f1672ab53$export$58fb1881ac046f3b.SNAPPING)).forEach((poi, i)=>{
            const c = svgGroup.append("circle").attr("cx", poi.x).attr("cy", poi.y).attr("r", $620bb2240d4be70e$export$d67e1898834e3885.SVG.transformationHandleSize).classed($229862f972072627$var$ToolClasses.poi, true);
            if (poiCallback) {
                c.on("mouseenter", ()=>{
                    poiCallback(object, Number(poiIds[i]), poi, true);
                });
                c.on("mouseleave", ()=>{
                    poiCallback(object, Number(poiIds[i]), poi, false);
                });
            }
        });
    }
    getObjectOrCreate(layer, object, svgTag, parent, enableMouseEvents = true) {
        let svgGroup;
        let targetLayer = parent || layer;
        svgGroup = targetLayer.select("#" + object.id);
        if (svgGroup.empty()) {
            svgGroup = targetLayer.append("g").attr("id", object.id);
            const info = {
                x: object.x,
                y: object.y,
                handles: []
            };
            this._objectInfo[object.uniqueName] = info;
            const svgObject = svgGroup.append(svgTag).attr("class", $229862f972072627$var$ToolClasses.object);
            if (enableMouseEvents) svgObject.on("click", ()=>{
                this._fireSelect(object);
            });
            svgGroup.append("g").classed($229862f972072627$var$ToolClasses.boundingBox, true);
            svgGroup.append("g").classed($229862f972072627$var$ToolClasses.handle, true);
        }
        svgGroup.classed($229862f972072627$var$ToolClasses.guide, object.isGuide);
        return svgGroup;
    }
    getObject(layer, object) {
        let svgGroup = layer.select("#" + object.id);
        if (svgGroup.empty()) return null;
        return svgGroup;
    }
    getLayer(layer) {
        if (layer === $9976dad94f405c55$export$cd6265b069888eed.Objects) return this._objectLayer;
        else if (layer === $9976dad94f405c55$export$cd6265b069888eed.Interaction) return this._interactionLayer;
    }
    _renderComposite(layer, comp, parent, enableMouseEvents) {
        const g = this.getObjectOrCreate(layer, comp, "g", parent, enableMouseEvents);
        if (g) comp.objects.forEach((child)=>{
            this._render(child, false, g.select($229862f972072627$var$ToolClassSelectors.object), false);
        });
        g.attr("transform", `translate(${comp.x - comp.width / 2} ${comp.y - comp.height / 2})`);
    }
    _renderList(layer, list, parent, enableMouseEvents) {
        const g = this.getObjectOrCreate(layer, list, "g", parent, enableMouseEvents);
        if (g) list.objects.forEach((child)=>{
            this._render(child, false, g.select($229862f972072627$var$ToolClassSelectors.object), false);
        });
    }
    _renderCircle(layer, circle, parent, enableMouseEvents) {
        const o = this.getObjectOrCreate(layer, circle, "circle", parent, enableMouseEvents);
        const c = o.select($229862f972072627$var$ToolClassSelectors.object);
        c.attr("cx", circle.x);
        c.attr("cy", circle.y);
        c.attr("r", circle.radius);
        this._createStyle(c, circle);
        return o;
    }
    renderCircle(layer, circle, enableMouseEvents = false) {
        const o = this._renderCircle(this.getLayer(layer), circle, null, enableMouseEvents);
    }
    _renderRectangle(layer, rectangle, parent, enableMouseEvents) {
        const o = this.getObjectOrCreate(layer, rectangle, "path", parent, enableMouseEvents);
        const r = o.select($229862f972072627$var$ToolClassSelectors.object);
        const d = [
            $229862f972072627$var$p2d(rectangle.topLeft, "M"),
            $229862f972072627$var$p2d(rectangle.topRight),
            $229862f972072627$var$p2d(rectangle.bottomRight),
            $229862f972072627$var$p2d(rectangle.bottomLeft),
            "Z"
        ].join(" ");
        r.attr("d", d);
        this._createStyle(r, rectangle);
        return r;
    }
    renderRectangle(layer, rectangle, enableMouseEvents = true) {
        return this._renderRectangle(this.getLayer(layer), rectangle, null, enableMouseEvents);
    }
    _renderLine(layer, line, parent, enableMouseEvents) {
        var _a, _b;
        const o = this.getObjectOrCreate(layer, line, "g", parent, enableMouseEvents);
        const g = o.select($229862f972072627$var$ToolClassSelectors.object);
        let l = g.select(".lineActualLine");
        if (l.empty()) l = g.append("line").classed("lineActualLine", true);
        l.attr("x1", line.x1);
        l.attr("y1", line.y1);
        l.attr("x2", line.x2);
        l.attr("y2", line.y2);
        this._createStyle(l, line);
        let l2 = g.select(".lineSelectionHelper");
        if (l2.empty()) l2 = g.append("line").classed("lineSelectionHelper", true);
        l2.attr("x1", line.x1);
        l2.attr("y1", line.y1);
        l2.attr("x2", line.x2);
        l2.attr("y2", line.y2);
        l2.attr("style", `fill: none; stroke-opacity: 0.0001; stroke: ${((_a = line === null || line === void 0 ? void 0 : line.style) === null || _a === void 0 ? void 0 : _a.strokeColor) || 'coral'}; stroke-width: ${Math.max(10, ((_b = line === null || line === void 0 ? void 0 : line.style) === null || _b === void 0 ? void 0 : _b.strokeWidth) || 0)}`);
        return l;
    }
    renderLine(layer, line, enableMouseEvents = true) {
        return this._renderLine(this.getLayer(layer), line, null, enableMouseEvents);
    }
    _renderText(layer, text, parent, enableMouseEvents) {
        const o = this.getObjectOrCreate(layer, text, "text", parent, enableMouseEvents);
        const t = o.select($229862f972072627$var$ToolClassSelectors.object);
        t.attr("x", 0).attr("y", 0).text(text.text);
        this._createTextStyle(t, text);
        this._textTransform(t, text);
        return t;
    }
    renderText(layer, text, enableMouseEvents) {
        return this._renderText(this.getLayer(layer), text, null, enableMouseEvents);
    }
    _textTransform(elem, text) {
        const a = -$ad5b03a8205d6f7a$export$b2ba2578f2c43d74(new $bcd40cdc131f79c5$export$6212d225472eb66a(1, 0).angleTo(text.xAxis));
        const comps = [];
        comps.push(`translate(${text.center.x} ${text.center.y})`);
        if (!$ad5b03a8205d6f7a$export$9663ddc1cf085b32(a, 0)) comps.push(`rotate(${a})`);
        if (text.scaleX !== 1 || text.scaleY !== 1) comps.push(`scale(${text.scaleX} ${text.scaleY})`);
        elem.attr("transform", comps.join(" "));
    }
    _createTextStyle(elem, text) {
        if (!text.style) return;
        let align = "start";
        let valign = "baseline";
        switch(text.style.textAlignment){
            case $9f8c1044c8011eb8$export$746e27699a54e043.center:
                align = "middle";
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.start:
                align = "start";
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.end:
                align = "end";
                break;
        }
        switch(text.style.verticalAlignment){
            case $9f8c1044c8011eb8$export$746e27699a54e043.center:
                valign = "central";
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.start:
                valign = "hanging";
                break;
            case $9f8c1044c8011eb8$export$746e27699a54e043.end:
                valign = "baseline";
                break;
        }
        valign = "central";
        elem.attr("style", `fill: ${text.style.fillColor}; fill-opacity: ${text.style.fillOpacity};` + `stroke: ${text.style.strokeColor}; stroke-width: ${text.style.strokeWidth};` + `font-family: ${text.style.fontFamily}; font-size: ${text.style.fontSize};` + `text-anchor: ${align};` + `alignment-baseline: ${valign};`);
    }
    renderPolygon(layer, polygon, enableMouseEvents = true) {
        return this._renderPolygon(this.getLayer(layer), polygon, null, enableMouseEvents);
    }
    _renderPolygon(layer, polygon, parent, enableMouseEvents) {
        const o = this.getObjectOrCreate(layer, polygon, "path", parent, enableMouseEvents);
        const p = o.select($229862f972072627$var$ToolClassSelectors.object);
        let d;
        if (polygon.points.length === 1) {
            const p = polygon.points[0];
            d = `M ${p.x - 7} ${p.y - 7} L ${p.x + 7} ${p.y + 7} M ${p.x - 7} ${p.y + 7} L ${p.x + 7} ${p.y - 7}`;
        } else {
            d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;
            for(let i = 1; i < polygon.points.length; i++)d += `L ${polygon.points[i].x} ${polygon.points[i].y}`;
            if (polygon.closed) d += " Z";
        }
        p.attr("d", d);
        this._createPathStyle(p, polygon);
        return p;
    }
    renderQuadratic(layer, polygon, enableMouseEvents = true) {
        return this._renderQuadratic(this.getLayer(layer), polygon, null, enableMouseEvents);
    }
    _renderQuadratic(layer, polygon, parent, enableMouseEvents) {
        if (polygon.points.length < 3) return this._renderPolygon(layer, polygon, parent, enableMouseEvents);
        const o = this.getObjectOrCreate(layer, polygon, "path", parent, enableMouseEvents);
        const p = o.select($229862f972072627$var$ToolClassSelectors.object);
        let d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;
        d += ` Q ${polygon.points[1].x} ${polygon.points[1].y}`;
        d += ` , ${polygon.points[2].x} ${polygon.points[2].y}`;
        for(let i = 3; i < polygon.points.length; i++)d += `T ${polygon.points[i].x} ${polygon.points[i].y}`;
        if (polygon.closed) d += " Z";
        p.attr("d", d);
        this._createPathStyle(p, polygon);
        return p;
    }
    renderBezier(layer, bezier, enableMouseEvents = true) {
        return this._renderBezier(this.getLayer(layer), bezier, null, enableMouseEvents);
    }
    _renderBezier(layer, bezier, parent, enableMouseEvents) {
        if (bezier.points.length < 4) return;
        const o = this.getObjectOrCreate(layer, bezier, "path", parent, enableMouseEvents);
        const p = o.select($229862f972072627$var$ToolClassSelectors.object);
        let d = `M ${bezier.points[0].x} ${bezier.points[0].y}`;
        d += ` C ${bezier.points[1].x} ${bezier.points[1].y}`;
        d += ` , ${bezier.points[2].x} ${bezier.points[2].y}`;
        for(let i = 3; i < bezier.points.length; i++)d += `T ${bezier.points[i].x} ${bezier.points[i].y}`;
        if (bezier.closed) d += " Z";
        p.attr("d", d);
        this._createPathStyle(p, bezier);
        return p;
    }
    _createPathStyle(elem, object) {
        if (!object.style) {
            if (!object.closed) elem.attr("style", "fill:none");
            return;
        }
        elem.attr("style", `fill: ${object.closed ? object.style.fillColor : "none"}; fill-opacity: ${object.style.fillOpacity}; stroke: ${object.style.strokeColor}; stroke-width: ${object.style.strokeWidth}`);
    }
    _createStyle(elem, object) {
        if (!object.style) return;
        if (object.isGuide) elem.classed($229862f972072627$var$ToolClasses.guide, object.isGuide);
        else elem.attr("style", `fill: ${object.style.fillColor}; fill-opacity: ${object.style.fillOpacity}; stroke: ${object.style.strokeColor}; stroke-width: ${object.style.strokeWidth}`);
    }
    renderBoundingRepresentation(object) {
        const g = this.getObject(this._objectLayer, object);
        if (g) switch(object.type){
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Circle:
                this.renderCircleBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Line:
                this.renderLineBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Polygon:
                this.renderPolygonBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Rectangle:
                this.renderRectangleBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Text:
                this.renderTextBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Composite:
                this.renderCompositeBRep(g, object);
                break;
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List:
                this.renderObjectListBRep(g, object);
            case $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Canvas:
                break;
            default:
                let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
                if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
                const bb = object.boundingBox;
                c.attr("x", -bb.w / 2 + object.x).attr("y", -bb.h / 2 + object.y).attr("width", bb.w).attr("height", bb.h).classed($229862f972072627$var$ToolClasses.boundingBox, true);
        }
    }
    renderPolygonBRep(g, polygon) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        let d;
        if (polygon.points.length === 1) {
            const p = polygon.points[0];
            d = `M ${p.x} ${p.y} m -10 0 a 10 10 0 1 0 20 0 M ${p.x} ${p.y} m -10 0 a 10 10 0 1 1 20 0`;
        } else {
            d = `M ${polygon.points[0].x} ${polygon.points[0].y}`;
            for(let i = 1; i < polygon.points.length; i++)d += `L ${polygon.points[i].x} ${polygon.points[i].y}`;
            if (polygon.closed) d += " Z";
        }
        c.attr("d", d).classed($229862f972072627$var$ToolClasses.boundingBox, true);
    }
    renderLineBRep(g, line) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        let w;
        if (!line.style) w = 3;
        else w = line.style.strokeWidth / 2 + 1;
        const n = line.end.copy.sub(line.start).getPerpendicular().normalize().scale(w);
        const p1 = line.start.copy.add(n);
        const p2 = line.end.copy.add(n);
        const p3 = line.start.copy.sub(n);
        const p4 = line.end.copy.sub(n);
        let d = `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
        d += `M ${p3.x} ${p3.y} L ${p4.x} ${p4.y}`;
        c.attr("d", d).classed($229862f972072627$var$ToolClasses.boundingBox, true);
    }
    renderCircleBRep(g, circle) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("circle").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        c.attr("cx", circle.center.x).attr("cy", circle.center.y).attr("r", circle.radius + circle.style.strokeWidth / 2).classed($229862f972072627$var$ToolClasses.boundingBox, true);
    }
    renderRectangleBRep(g, rectangle) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        c.attr("d", this.getRectanglePath(rectangle.topLeft, rectangle.topRight, rectangle.bottomLeft, rectangle.bottomRight));
    }
    renderTextBRep(g, text) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        c.attr("d", this.getRectanglePath(text.topLeft, text.topRight, text.bottomLeft, text.bottomRight));
    }
    getRectanglePath(tl, tr, bl, br) {
        return [
            $229862f972072627$var$p2d(tl, "M"),
            $229862f972072627$var$p2d(tr),
            $229862f972072627$var$p2d(br),
            $229862f972072627$var$p2d(bl),
            "Z"
        ].join(" ");
    }
    renderCompositeBRep(g, compositeObject) {
        let c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox);
        if (c.empty()) c = g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).append("path").classed($229862f972072627$var$ToolClasses.boundingBox, true);
        const d = `M 0 0 L ${compositeObject.width} 0 L ${compositeObject.width} ${compositeObject.height} L 0 ${compositeObject.height} Z`;
        c.attr("d", d);
    }
    renderObjectListBRep(g, list) {
        for (const o of list.objects)this.renderBoundingRepresentation(o);
    }
    removeObjectListBoundingRepresentation(list) {
        for (const o of list.objects)this.removeBoundingRepresentation(o);
    }
    removeBoundingRepresentation(object) {
        if (object.type === $92808e6f1672ab53$export$53f0d9fcb05d9d1d.List) this.removeObjectListBoundingRepresentation(object);
        if (object instanceof $b834cbea40bafe97$export$9b40e5dd2ee321ea) return;
        const g = this.getObject(this._objectLayer, object);
        if (g) g.select("g" + $229862f972072627$var$ToolClassSelectors.boundingBox).selectAll($229862f972072627$var$ToolClassSelectors.boundingBox).remove();
    }
    updateHandle(object, id, p) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            if (object.type !== $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Composite) g.select(`#${object.uniqueName}-handle-${id}`).attr("cx", p.x).attr("cy", p.y);
        }
    }
    renderHandle(object, id, p, onMouseEvent, data) {
        const g = this.getObject(this._objectLayer, object);
        if (g) {
            this._objectInfo[object.uniqueName].handles.push(p);
            const handle = g.append("circle");
            if (object.type === $92808e6f1672ab53$export$53f0d9fcb05d9d1d.Composite) {
                const l = object;
                handle.attr("cx", p.x - l.x + l.width / 2).attr("cy", p.y - l.y + l.height / 2).attr("r", $620bb2240d4be70e$export$d67e1898834e3885.SVG.transformationHandleSize);
            } else handle.attr("cx", p.x).attr("cy", p.y).attr("r", $620bb2240d4be70e$export$d67e1898834e3885.SVG.transformationHandleSize);
            handle.data([
                p
            ]).attr("id", `${object.uniqueName}-handle-${id}`).classed($229862f972072627$var$ToolClasses.handle, true);
            if (onMouseEvent) this._attachHandleMouseEvents(object, handle, onMouseEvent, data);
        }
    }
    removeAllHandles(object) {
        const g = this.getObject(this._objectLayer, object);
        if (g) g.selectAll($229862f972072627$var$ToolClassSelectors.handle).remove();
    }
    _attachHandleMouseEvents(object, svgObject, handler, data = null) {
        function makeEvent(interactionEvent, event) {
            const d3MEv = $e01916ed2668b0f2$export$2e2bcd8739ae039(event, svgObject.node());
            const ed = {
                kind: $fb74569b2db9a7e7$export$2a5c597f89453a1c.pointer,
                interactionEvent: interactionEvent,
                x: d3MEv[0],
                y: d3MEv[1],
                dx: event.movementX,
                dy: event.movementY,
                alt: event.altKey,
                button: event.button,
                buttons: event.buttons,
                ctrl: event.ctrlKey,
                shift: event.shiftKey,
                key: "",
                keyCode: 0
            };
            return ed;
        }
        svgObject.on("mousedown", (event)=>{
            handler(object, makeEvent($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01.MouseDown, event), data);
        });
        svgObject.on("mouseup", (event)=>{
            handler(object, makeEvent($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01.MouseUp, event), data);
        });
        svgObject.on("click", (event)=>{
            handler(object, makeEvent($fb74569b2db9a7e7$export$fdc6f9e2a46b1b01.Click, event), data);
        });
    }
    makeInfoHandle() {
        return "__svg_rndr_info_" + $229862f972072627$var$infoHandle++;
    }
    renderInfoLine(p1, p2) {
        const handle = this.makeInfoHandle();
        this._infoLayer.select("#" + handle).remove();
        this._infoLayer.append("line").attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y).attr("id", handle).style("fill", "none").style("stroke", "blue").style("stroke-width", "2");
        return handle;
    }
    updateInfoLine(handle, p1, p2) {
        const i = this._infoLayer.select("#" + handle);
        if (i.empty()) return;
        i.attr("x1", p1.x).attr("y1", p1.y).attr("x2", p2.x).attr("y2", p2.y);
    }
    renderInfoText(position, text) {
        const handle = this.makeInfoHandle();
        this._infoLayer.select("#" + handle).remove();
        this._infoLayer.append("text").attr("x", position.x).attr("y", position.y).attr("id", handle).text(text);
        return handle;
    }
    updateInfoText(handle, text, position) {
        const i = this._infoLayer.select("#" + handle);
        if (i.empty()) return;
        i.text(text);
        if (position) i.attr("x", position.x).attr("y", position.y);
    }
    removeInfo(handle) {
        this._infoLayer.selectAll("#" + handle).remove();
    }
    clearInfo() {
        this._infoLayer.selectAll("*").remove();
    }
    _renderCanvas(_backgroundLayer, object, parent, enableMouseEvents) {
        let c = _backgroundLayer.selectAll(".stsDrawableCanvasDisplay");
        if (c.empty()) c = _backgroundLayer.append("rect");
        c.attr("x", object.x - object.width / 2).attr("y", object.y - object.height / 2).attr("width", object.width).attr("height", object.height).classed("stsDrawableCanvasDisplay", true);
        if (enableMouseEvents) c.on("click", ()=>{
            this._fireSelect(object);
        });
    }
    pointerCoordsFromEvent(event) {
        return $e01916ed2668b0f2$export$2e2bcd8739ae039(event, this._svg.node());
    }
    getSVGPreview() {
        const node1 = this._objectLayer.node().cloneNode(true);
        const cleanUp = (node)=>{
            if (node.childElementCount === 0) return;
            const rem = [];
            for(let i = 0; i < node.childElementCount; i++){
                const child = node.childNodes[i];
                const classes = child.classList;
                if (classes === null || classes === void 0 ? void 0 : classes.contains($229862f972072627$var$ToolClasses.boundingBox)) rem.push(child);
                else if (classes === null || classes === void 0 ? void 0 : classes.contains($229862f972072627$var$ToolClasses.handle)) rem.push(child);
            }
            rem.forEach((child)=>node.removeChild(child)
            );
            for(let i1 = 0; i1 < node.childElementCount; i1++)cleanUp(node.childNodes[i1]);
        };
        cleanUp(node1);
        return node1.outerHTML;
    }
}




export {$b834cbea40bafe97$export$9b40e5dd2ee321ea as Canvas, $b834cbea40bafe97$export$9b40e5dd2ee321ea as GrCanvas, $229862f972072627$export$fb77dabb7e6f239e as SVGRenderer, $f794df200bdd1c64$export$bb7311ec83c149ab as $styles, $f794df200bdd1c64$export$eb688b4a3b171f3d as hoistObjects, $f794df200bdd1c64$export$9a199263f62e818d as makeObjectManager, $973b23ce99918ba1$export$37563e431fdea7bd as GrLine, $d4397e41424130cc$export$30a59a0caead8e7a as GrRectangle, $7f75fa07e5d188f3$export$150c260caa43ceb8 as GrPolygon, $f5a4253b3c677715$export$25ceb2c69899a589 as GrCircle, $56919d7b8c67450a$export$23e702491ed1c44c as GrText, $9b7a75a9356c9401$export$e840e8869344ca38 as AspectRatio, $c9b688d84c372821$export$9f17032d917177de as distance, $c9b688d84c372821$export$f2e8a19be46147af as midpoint, $c9b688d84c372821$export$9752a52f44b3771b as circleCenterRadius, $c9b688d84c372821$export$138267ac14f24cdd as circleCenterPoint, $c9b688d84c372821$export$510bcbb1daa29625 as circlePointPoint, $c9b688d84c372821$export$4f275ceaaaca1eea as rectanglePointPoint, $c9b688d84c372821$export$5699841f9034f25a as rectangleCenter, $c9b688d84c372821$export$43c3802c496dcab8 as rectangleTopLeft, $c9b688d84c372821$export$ffc9a385f68270d7 as rectangleBottomLeft, $c9b688d84c372821$export$e4174898e76ca80b as rectangleBottomRight, $c9b688d84c372821$export$be96957d972b1ea8 as rectangleTopRight, $c9b688d84c372821$export$3fd0e84e3b39983a as linePointPoint, $c9b688d84c372821$export$bfdf0cec956c91f6 as linePointVectorLength, $c9b688d84c372821$export$6f093cfa640b7166 as text, $c9b688d84c372821$export$b7b19aa0ee06c73 as polygon, $c9b688d84c372821$export$2f7de087257a5258 as extendPolygon, $c9b688d84c372821$export$b8427670a32a2793 as scaleObject, $c9b688d84c372821$export$136fad7c848856b6 as scaleObjectUniform, $c9b688d84c372821$export$ed6a1f2400c516ff as scaleObjectToPoint, $c9b688d84c372821$export$790a046ebb3fec6e as scaleObjectToPointUniform, $c9b688d84c372821$export$949242f9d660edf5 as moveObject, $c9b688d84c372821$export$3d984db7fb07f69c as moveObjectAlongX, $c9b688d84c372821$export$cc481b5dad075641 as moveObjectAlongY, $c9b688d84c372821$export$c417714628899d34 as moveObjectToPoint, $c9b688d84c372821$export$9b2b68ce31244b03 as rotateObject, $c9b688d84c372821$export$346677f925de839c as size, $c9b688d84c372821$export$8960430cfd85939f as max, $c9b688d84c372821$export$86c4352b5bd9c815 as avg, $c9b688d84c372821$export$9c490b34b2f16a34 as median};
//# sourceMappingURL=dapentryLib.mjs.map
