export const Icons = {

    CircleTool: `<svg viewbox="-10 -10 120 120">
  <circle cx="50" cy="50" r="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>`,

    RectangleTool: `<svg viewbox="-10 -10 120 120">
  <rect x="0" y="0" width="100" height="100" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>`,

    LineTool: `<svg viewbox="-10 -10 120 120">
  <line x1="0" y1="100" x2="100" y2="0" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>`,

    PolygonTool: ` <svg viewbox="-10 -10 120 120">
  <path d="M0 100 l0 -50 l50 -50 l50 0 l0 100Z" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
</svg>`,

    TextTool: `<svg viewbox="-10 -10 120 120">
  <text x="50" y="95" style="fill:rgb(0,0,0);font-size: 140; font-family: serif; text-anchor:middle">T</text>
</svg>`,

    MoveTool: `<svg viewbox="-10 -10 120 120">
 <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   <marker id="arrowheads" markerWidth="3" markerHeight="4"
    refX="3" refY="2" orient="auto">
      <polygon points="3 0, 3 4, 0 2" />
    </marker>
  </defs>
   <line x1="10" y1="50" x2="90" y2="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-start="url(#arrowheads)" marker-end="url(#arrowheade)" />
   <line x1="50" y1="10" x2="50" y2="90" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-start="url(#arrowheads)" marker-end="url(#arrowheade)" />
  </svg>`,

    RotateTool: ` <svg viewbox="-10 -10 120 120">
 <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   </defs>
   <path d="M100 50 A 45 45 0 1 1 50 10" style="fill: none; stroke:black;stroke-width:7" marker-end="url(#arrowheade)"/>
 </svg>`,

    ScaleTool: ` <svg viewbox="-10 -10 120 120">
   <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
   </defs>
  <rect x="0" y="50" width="50" height="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" />
  <rect x="0" y="0" width="100" height="100" style="fill:none;stroke-dasharray:10 10;stroke:black;stroke-width:7" />
  <line x1="50" y1="50" x2="70" y2="30" style="stroke:black;stroke-width:7" marker-end="url(#arrowheade)"/>
</svg>`,

    Pause: `<svg viewBox="-10 -10 120 120">
  <circle cx="50" cy="50" r="50" style="fill: none; stroke: black; stroke-width:9"/>
  <line x1="35" y1="25" x2="35" y2="75" style="fill: none; stroke: black; stroke-width:9; stroke-linecap:round"/>
  <line x1="65" y1="25" x2="65" y2="75" style="fill: none; stroke: black; stroke-width:9; stroke-linecap:round"/>
</svg>`,

    NewDrawing: `<svg viewbox="-10 -10 100 120" width="2em">
  <path d="M0 100 l0 -70 l 30 -30 l 50 0 l 0 100Z " style="fill:none;stroke:black;stroke-width:7" />
  <path d="M0 30 l30 0 l 0 -30" style="fill:none;stroke:black;stroke-width:7" />
</svg>`,

    SaveDrawing: `<svg viewbox="-10 -10 100 120" width="2em">
  <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
  </defs>
   <line x1="40" y1="90" x2="40" y2="50" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-end="url(#arrowheade)" />
  <path d="M0 60 l 0 40 l 80 0 l 0 -40" style="fill: none;stroke:black;stroke-width:7" />
  <text x="40" y="20" style="font-family:sans-serif; font-size: 2em;font-weight:bold;text-anchor:middle">Lib</text>
</svg>`,

    ExportSVG: `<svg viewbox="-10 -10 100 120" width="2em">
  <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
  </defs>
   <line x1="40" y1="30" x2="40" y2="70" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-end="url(#arrowheade)" />
  <path d="M0 60 l 0 40 l 80 0 l 0 -40" style="fill: none;stroke:black;stroke-width:7" />
  <text x="40" y="20" style="font-family:sans-serif; font-size: 2em;font-weight:bold;text-anchor:middle">SVG</text>
</svg>`,

    ExportJS: `<svg viewbox="-10 -10 100 120" width="2em">
  <defs>
    <marker id="arrowheade" markerWidth="3" markerHeight="4"
    refX="0" refY="2" orient="auto">
      <polygon points="0 0, 3 2, 0 4" />
    </marker>
  </defs>
   <line x1="40" y1="30" x2="40" y2="70" style="fill:rgb(180,180,180);stroke:black;stroke-width:7" marker-end="url(#arrowheade)" />
  <path d="M0 60 l 0 40 l 80 0 l 0 -40" style="fill: none;stroke:black;stroke-width:7" />
  <text x="40" y="20" style="font-family:sans-serif; font-size: 2em;font-weight:bold;text-anchor:middle">JS</text>
</svg>`
}