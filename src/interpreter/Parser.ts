import {generate} from "pegjs"

export enum TokenTypes {
    OPCODE,
    REGISTER,
    NUMBER,
    STRING,
    LABEL,
    POINT,
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

pegParser = generate(`
{
  function flatten(stuff) {
    return stuff.map(a => a.filter(a => a != null)).map(a => a[0]) ;
  }
}
  Expression "Expression"
      = exp:(Label/Operation/Comment) _ Comment? {
      \treturn exp
      }
      
  Operation "Operation"
  \t= exp:Opcode args:(_ ArgumentOrTuple)* {
      \treturn [exp, ...flatten(args)]
      }

  ArgumentOrTuple "Argument or Tuple"
      = aot:(Argument/Tuple) {
      \treturn aot
      }

  Argument "Argument"
      = arg:(Register/Number/String) {
      \treturn arg
      }

  Register "Register"
      = reg:([a-zA-Z][a-zA-Z0-9.]*[a-zA-Z0-9]*) {
      \treturn {
        \ttype: ${TokenTypes.REGISTER},
            value: text()
            }
      }

      
      
  Comment "Comment"
  \t= "#" .* {
    \treturn null
    } 

  Number "Number"
      = sign:("+"/"-")? num:[0-9]+ dot:("." tail:[0-9]+)? {
        /*let n = num.join("");
        if (dot) n += "." + dot[1].join("");        
        if (sign) n = sign + n;*/
        return { type: ${TokenTypes.NUMBER}, value: Number(text()) }
      }
      
  String "String"
  \t =  '"' string:StringChars* '"' {
     \treturn { type: ${TokenTypes.STRING}, value: string.join("") }
     }
     
  StringChars
  \t= [^'"'\\n]

  Tuple "Tuple"
      = "("_ args:(_ Argument)* _ ")" {
      \treturn { type: ${TokenTypes.POINT}, value: flatten(args) }
      }
      
  Opcode "Opcode"
      = [A-Z][A-Z0-9]+ {
      	return { type: ${TokenTypes.OPCODE}, value: text() }
      }

  Label "Label"
      = label:([A-Z0-9]+)":" {
      \treturn [{
        \ttype: ${TokenTypes.LABEL},
            value: label.join("")
        }]
      }     

  _ "whitespace"
    = [\\t ]* {
    \treturn null
    }
    
`)