port module Drawing exposing (..)

import Browser
import Svg exposing (..)
import Svg.Attributes exposing (..)

import ObjectsAndShapes as OaS exposing (..)


main =
  Browser.element { init = init, view = view, update = update, subscriptions = subscriptions }

type alias Model = List Object

init : () -> ( Model, Cmd Msg )
init _ =
  ([], Cmd.none )

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


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        ReceiveObjectList data ->
            ( (List.map  createObjectFromPortInfo  data), Cmd.none )


createObjectFromPortInfo : SentObject -> OaS.Object
createObjectFromPortInfo data =
    if data.t == "rect" then
        OaS.rectangle data.x data.y data.p1 data.p2
    else
        OaS.circle data.x data.y data.p1

-- Subscriptions

subscriptions: Model -> Sub Msg
subscriptions _ =
    objectReceiver ReceiveObjectList


view : Model -> Svg Msg
view model =
  svg
      [ width "800px"
      , height "600px"
      ]
      (List.map OaS.renderObject model)
