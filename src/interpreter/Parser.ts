import {generate} from "pegjs"

export enum TokenTypes {
    OPCODE,
    REGISTER,
    NUMBER,
    STRING,
    LABEL,
    POINT,
    ARRAY,
    OTHER
}

export interface Token {
    type: TokenTypes,
    value: number | string | Array<any>
}

let pegParser;

export class Parser {

    public static parseLine(line):Array<Token> {
        if (!line.trim()) {
            return [];
        }
        return pegParser.parse(line.trim(), {}) || [];
    }

}

let grammar = `
{
  function flatten(stuff) {
    return stuff.map(a => a.filter(a => a != null)).map(a => a[0]) ;
  }
}
  Expression "Expression"
      = exp:(Label/Operation/Comment) _ Comment? {
      return exp
      }
      
  Operation "Operation"
  = exp:Opcode args:(_ ArgumentOrTuple)* {
      return [exp, ...flatten(args)]
      }

  ArgumentOrTuple "Argument or Tuple"
      = aot:(Argument/Tuple/Array) {
      return aot
      }

  Argument "Argument"
      = arg:(Register/Number/String) {
      return arg
      }


   Register "Register"
      = reg:([a-zA-Z][a-zA-Z0-9.]*[a-zA-Z0-9]*) {
      return {
        type: "TT_REGISTER",
            value: text()
            }
      }

      
      
  Comment "Comment"
  = "#" .* {
    return null
    } 

  Number "Number"
      = sign:("+"/"-")? num:[0-9]+ dot:("." tail:[0-9]+)? {
        /*let n = num.join("");
        if (dot) n += "." + dot[1].join("");        
        if (sign) n = sign + n;*/
        return { type: "TT_NUMBER", value: Number(text()) }
      }
      
  String "String"
   =  '"' string:StringChars* '"' {
     return { type: "TT_STRING", value: string.join("") }
     }
     
  StringChars
  = [^'"'\\n]

  Tuple "Tuple"
      = "("_ args:(_ Argument)* _ ")" {
      return { type: "TT_POINT", value: flatten(args) }
      }
      
      
      
  Array "Array"
      = "["_ args:(_ ArgumentOrTuple)* _ "]" {
      return { type: "TT_ARRAY", value: flatten(args) }
      }
      
  Opcode "Opcode"
      = [A-Z][A-Z0-9]+ {
      	return { type: "TT_OPCODE", value: text() }
      }

  Label "Label"
      = label:([A-Z0-9]+)":" {
      return [{
        type: "TT_LABEL",
            value: label.join("")
        }]
      }     

  _ "whitespace"
    = [\t ]* {
    return null
    }
    
`

Object.keys(TokenTypes)
    .forEach(key => {
        grammar = grammar.replace(new RegExp(`"TT_${TokenTypes[key]}"`, "g"), key)
    })


pegParser = generate(grammar)