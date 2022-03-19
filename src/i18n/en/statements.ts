/**
 * Satementeditor interprets parameters as follows
 *  {i}     Create an appropriate editor for token i
 *  [{i}]     Display token i's value as plain text
 *
 */


export const statements = {
    "CIRCLE": "Draw {1} center at {3} with radius {4}",
    "CIRCLECR": "Draw {1} center at {3} with radius {4}",
    "CIRCLECP": "Draw {1} center at {3} touching {4}",
    "RECT": "Draw {1} starting at {3} with width {4} and height {5}",
    "RECTPP": "Draw {1} from {3} to {4}",
    "RECTC": "Draw {1} center at {3} width {4} and height {5}",
    "RECTTL": "Draw {1} top left at {3} width {4} and height {5}",
    "RECTTR": "Draw {1} top right at {3} width {4} and height {5}",
    "RECTBL": "Draw {1} bottom left at {3} width {4} and height {5}",
    "RECTBR": "Draw {1} bottom right at {3} width {4} and height {5}",
    "LINE": "Draw {1} from {3} to {4}",
    "LINEPP": "Draw {1} from {3} to {4}",
    "TEXT": "Draw {1} at {3} saying {4}",
    "POLY": "Draw {1} with {3} closed {4}",
    "EXTPOLY": "Extend {1} with {2}",
    "QUAD": "Draw {1}",
    "MOVE": "Move [{1}] by {2}",
    "MOVEBY": "Move [{1}] by {2}",
    "MOVETO": "Move [{1}] to {2}",
    "MOVEX": "Move [{1}] along x by {2}",
    "MOVEY": "Move [{1}] along y by {2}",
    "FILL": "Fill [{1}] with {2} and an opacity of {3}",
    "STROKE": "Make [{1}] stroke {2} wide",
    "ROTATE": "Rotate [{1}] by {2}",
    "APPEND": "Append {2} to [{1}]",
    "SCALE": "Scale [{1}] by {2} and {3} around {4}",
    "SCALEU": "Scale [{1}] uniformly by {2} around {3}",
    "SCALEP": "Scale [{1}] around it's {4} so it's {2} meets {3}",
    "SCALEPU": "Scale [{1}] uniformly around it's {4} so it's {2} meets {3}",
    "DO_NONE": "Repeat {1} times",
    "DO_VALUE": "Repeat {2} times",
    "DO_VALUE_INDEX": "Repeat {3} times",
    "FOREACH": "For each value of {1}",
    "ENDEACH": "end each",
    "MAKE": "Insert {1} size {4} at {5} with",
    "ENDDO": "end repeat"
}