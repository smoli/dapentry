The Editor
==========

The editor is very much alpha. Most of the features are accessed through hotkeys

# Tools

| Key | Action                                                                                      |
|-----|---------------------------------------------------------------------------------------------|
| L   | Create a line                                                                               |
| R   | Create a rectangle                                                                          |
| C   | Create a circle                                                                             |
| P   | Create a polygon. End with right click. Hold shift on right click to create an open polygon |
| G   | Move object                                                                                 |
| T   | Rotate object                                                                               |
| S   | Scale Object                                                                                |


# Points of interest

Each object publishes a set of points of interest. Most use their center, the top, left, right and bottom. These points
are used for snapping and grabbing.

# Snapping on objects

Some operations allow for snapping on an object, e.g. when creating a line. Use `left-Alt` to cycle through the objects
to snap on.

# Code editor

The code editor allows for directly manipulating the code - which defeats the purpose of this whole thing but helps with
development of the editor and the language.

```
CIRCLE Circle2, $styles.default, ( 317, 448 ), f3
LINE Line3, $styles.default, Circle2, "left", Circle2, "right"
CIRCLE Circle4, $styles.default, (611, 522), 19.697715603592208
MOVE Circle4, "center", Line3, "end"
DO i, f2
    ROTATE Line3, 360 / f2
    LINE Line5, $styles.default, Circle4, "center", Line3, "end"
    MOVE Circle4, "center", Line5, "end"
ENDDO
```

# Inner workings

## What happens when the user draws a circle

* Select the circle tool using `c`
* Using the [ToolManager](/src/drawing/ToolManager.ts) the [Drawing.ts](/ui5stuff/controls/drawing/Drawing.ts) switches to the [DrawCircleTool](/src/tools/DrawCircle.ts)
* The Tool waits for the user to draw the circle
* When done, the ToolManager gets the result
  * This result will be an instruction to draw the circle like `CIRCLE Circle1, $styles.default, (100, 100), 100`
* The new instruction is added to the current program
* The whole drawing is cleared and the [ComponentController](/ui5stuff/ComponentController.ts) reruns the program
* A special [interpreter](/src/core/GfxInterpreter.ts) intercepts all created objects
* Once the program is done running the ComponentController passes the list of intercepted objects to the renderer
  * The renderer, [SvgObjectRenderer](/src/drawing/SvgObjectRenderer.ts) redraws the whole thing