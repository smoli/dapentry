GFXBCTS
=======

## What is it

http://worrydream.com/DrawingDynamicVisualizationsTalkAddendum/

## How to build and run

`$ npm run start`

Maybe you need to do that twice in order to work

then open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Next steps

* Annotate generated code to define
  * what statements to display on the ui
  * where to insert code
* Maybe configure what kind of Parameter-Class to use for a given token type. This remives dependency of Point2D from core runtime
* Array index like r1[0]?



## Tests

make sure that the peg-parser-module is build:

```
$ cd src/runtime/interpreter
$ pegjs language.peg
```


then simply

`$ npm test`

## Test coverage

`$ npm run coverage`

Then open [coverage/index.html](coverage/index.html)

## Documentation

See [doc/Readme.md](doc/Readme.md)


## License

Pending

(c) 2021 Stephan Smola