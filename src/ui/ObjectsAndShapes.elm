module ObjectsAndShapes exposing(
    Object
    , Shape
    , circle, rectangle, square, ellipse, polygon,
    renderObject
    )

import Svg exposing (..)
import Svg.Attributes exposing (..)


-- Objects
type Object =
  Object
    Float -- x
    Float -- y
    Float -- angle
    Float -- scale
    Float -- alpha
    Shape


type Shape
  = Circle Float
  | Rectangle Float Float
  | Ellipse Float Float
  | Polygon (List (Float, Float))


{-| Make circles:
    dot = circle red 10
    sun = circle yellow 300
You give a color and then the radius. So the higher the Float, the larger
the circle.
-}
circle : Float -> Float -> Float -> Object
circle x y radius =
  Object x y 0 1 1 (Circle radius)


{-| Make ovals:
    football = oval brown 200 100
You give the color, and then the width and height. So our `football` example
is 200 pixels wide and 100 pixels tall.
-}
ellipse : Float -> Float -> Float -> Float -> Object
ellipse x y width height =
  Object x y 0 1 1 (Ellipse width height)


{-| Make squares. Here are two squares combined to look like an empty box:
    import Playground exposing (..)
    main =
      picture
        [ square purple 80
        , square white 60
        ]
The Float you give is the dimension of each side. So that purple square would
be 80 pixels by 80 pixels.
-}
square : Float -> Object
square size =
  Object 0 0 0 1 1 (Rectangle size size)


{-| Make rectangles. This example makes a red cross:
    import Playground exposing (..)
    main =
      picture
        [ rectangle red 20 60
        , rectangle red 60 20
        ]
You give the color, width, and then height. So the first shape is vertical
part of the cross, the thinner and taller part.
-}
rectangle : Float -> Float -> Float -> Float -> Object
rectangle x y width height =
  Object x y 0 1 1 (Rectangle width height)


-- TODO: Ngons. See Playground https://github.com/evancz/elm-playground/blob/1.0.3/src/Playground.elm

{-| Make any shape you want! Here is a very thin triangle:
    import Playground exposing (..)
    main =
      picture
        [ polygon black [ (-10,-20), (0,100), (10,-20) ]
        ]
**Note:** If you [`rotate`](#rotate) a polygon, it will always rotate around
`(0,0)`. So it is best to build your shapes around that point, and then use
[`move`](#move) or [`group`](#group) so that rotation makes more sense.
-}
polygon : List (Float, Float) -> Object
polygon points =
  Object 0 0 0 1 1 (Polygon points)

renderObject : Object -> Svg msg
renderObject (Object x y angle scale alpha shape) =
    case shape of
        Circle radius ->
            renderCircle x y radius
        Rectangle width height ->
            renderRectangle x y width height
        Ellipse width height ->
            renderCircle x y width
        Polygon points ->
            renderCircle x y 100


renderCircle : Float -> Float -> Float -> Svg msg
renderCircle x y radius =
    Svg.circle [ r (String.fromFloat radius)
            , transform (renderTransform x y 0 1)
    ] []

renderRectangle : Float -> Float -> Float -> Float -> Svg msg
renderRectangle x1 y1 w h =
    Svg.rect [
        x (String.fromFloat (x1 - w / 2))
      , y (String.fromFloat (y1 - h / 2))
      , width (String.fromFloat w)
      , height (String.fromFloat h)] []

renderTransform : Float -> Float -> Float -> Float -> String
renderTransform x y a s =
  if a == 0 then
    if s == 1 then
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat y ++ ")"
    else
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat y ++ ") scale(" ++ String.fromFloat s ++ ")"
  else
    if s == 1 then
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat y ++ ") rotate(" ++ String.fromFloat -a ++ ")"
    else
      "translate(" ++ String.fromFloat x ++ "," ++ String.fromFloat y ++ ") rotate(" ++ String.fromFloat -a ++ ") scale(" ++ String.fromFloat s ++ ")"