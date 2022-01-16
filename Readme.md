GFXBCTS
=======

## What is it

http://worrydream.com/DrawingDynamicVisualizationsTalkAddendum/

## How to build and run

`$ npm run start`

then open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Next steps

* [x] Annotate generated code to define
  * [x] what statements to display on the ui
  * [x] where to insert code
* ~~[ ] denote Points with <> instead of ()~~ Don't do that because we want to use () in expressions
* ~~[ ] denote expressions with () instead of {}~~ Don't do that because we want to use () in expressions
* [x] Make a parameter type that evaluates an expression
* [x] Properly recognize when the user enters an expression when editing a statement
* [x] Add a method getPointAtPercentage to GrObject
  * [x] implement for lines
  * [x] implement for circles
  * [ ] implement for rects
  * [ ] implement for polygons
* [ ] rotate around pivot
* [ ] enable move and creation tools to use percentage points
  * [x] create line on lines and circles
* [ ] enable move and creation operations to use percentage points
  * [x] move
  * [x] create line
  * [ ] create circle
  * [ ] create rectangle
  * [ ] create polygon
* [ ] extend parser to recognize 43.34% as  the number 0.4334
* [ ] create operation to append a point to a polygon
* [ ] make polygons open by default
* [ ] autoclose polygons
* [ ] enable fill rendering for open polygons
* Maybe configure what kind of Parameter-Class to use for a given token type. This removes dependency of Point2D from core runtime
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