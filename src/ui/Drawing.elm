port module Drawing exposing (..)

import Browser
import Browser.Events as Event
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Set
import Json.Decode as D


import ObjectsAndShapes as OaS exposing (..)


main =
  Browser.element { init = init, view = view, update = update, subscriptions = subscriptions }

type alias Drawing =
     List Object

type alias Model = {
    drawing: Drawing
    ,interface: Interface
    }

init : () -> ( Model, Cmd Msg )
init _ =
  (Model [] initialInterface, Cmd.none)

-- Interface

initialInterface : Interface
initialInterface =
  { mouse = Mouse 0 0 False False
  , keyboard = emptyKeyboard
  , screen = toScreen 600 600
  }

type alias Interface =
  { mouse : Mouse
  , keyboard : Keyboard
  , screen : Screen
  }

-- Mouse

type alias Mouse =
  { x : Float
  , y : Float
  , down : Bool
  , click : Bool
  }

type alias Keyboard =
  { up : Bool
  , down : Bool
  , left : Bool
  , right : Bool
  , space : Bool
  , enter : Bool
  , shift : Bool
  , backspace : Bool
  , keys : Set.Set String
  }

type alias Screen =
  { width : Float
  , height : Float
  , top : Float
  , left : Float
  , right : Float
  , bottom : Float
  }



-- Ports

type alias SentObject = {
    t: String,
    x: Float,
    y: Float,
    p1: Float,
    p2: Float,
    p3: Float
    }

port objectReceiver : (List SentObject -> msg) -> Sub msg

type Msg
  = ReceiveObjectList (List SentObject)
  | MouseButton Bool
  | MouseMove Float Float


update : Msg -> (Drawing -> Interface) -> ( Model, Cmd Msg )
update msg (Model drawing interface) =
    case msg of
        ReceiveObjectList data ->
            ( Model (List.map createObjectFromPortInfo data) model.interface, Cmd.none )
        MouseButton down ->
            ( model, Cmd.none )
        MouseMove x y ->
            ( Model model.drawing {  model.interface | }, Cmd.none )


createObjectFromPortInfo : SentObject -> OaS.Object
createObjectFromPortInfo data =
    if data.t == "rect" then
        OaS.rectangle data.x data.y data.p1 data.p2
    else
        OaS.circle data.x data.y data.p1

-- Subscriptions

subscriptions: Model -> Sub Msg
subscriptions model =
    if model.interface.mouse.down == False then
        Sub.batch [
            objectReceiver ReceiveObjectList,
            Event.onMouseDown (D.succeed (MouseButton True))
        ]
    else
        Sub.batch [
            Event.onMouseUp (D.succeed (MouseButton False)),
            Event.onMouseMove (D.map2 MouseMove (D.field "pageX" D.float) (D.field "pageY" D.float))
        ]


view : Model -> Svg Msg
view model =
  svg
      [ width "800px"
      , height "600px"
      ]
      (List.map OaS.renderObject model.drawing)



toScreen : Float -> Float -> Screen
toScreen width height =
  { width = width
  , height = height
  , top = height / 2
  , left = -width / 2
  , right = width / 2
  , bottom = -height / 2
  }

emptyKeyboard : Keyboard
emptyKeyboard =
  { up = False
  , down = False
  , left = False
  , right = False
  , space = False
  , enter = False
  , shift = False
  , backspace = False
  , keys = Set.empty
  }