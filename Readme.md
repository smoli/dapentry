GFXBCTS
=======

## What is this?

http://worrydream.com/DrawingDynamicVisualizationsTalkAddendum/

## How to build and run

`$ npm run start`

then open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## Bugs
* [ ] Expressions are not displayed in steps and operation editor
* [ ] Fix scaling of rotated objects
* [ ] Hide Objects
* [ ] Program not always run as far as expected (better description needed)

## Next steps

### Drawing
* [x] Add a method getPointAtPercentage to GrObject
  * [ ] implement for rects
  * [ ] implement for polygons
* [ ] rotate around pivot
* [ ] enable move and creation tools to use percentage points
* [ ] enable move and creation operations to use percentage points
  * [ ] create circle
  * [ ] create rectangle
  * [ ] create polygon
* [ ] make polygons open by default?
* [ ] autoclose polygons?
* [ ] enable fill rendering for open polygons
* [ ] Define aspect ratio for a drawing
  * [ ] Maybe determine bounding box for drawing automatically when storing

### Data editor
* [ ] Create tables
* [ ] Load data from file

### Style editor
* [ ] define stroke color separately

### Operation editor
* [ ] Operation Editor
  * [ ] FOREACH
  * [ ] Enable the user to switch an DO/ENDDO to a FOREACH when assigning an array as the count
* [ ] Auto growing input field

### Language/Interpreter
* [ ] Language Version annotation
* [ ] extend parser to recognize 43.34% as  the number 0.4334
* [ ] Maybe configure what kind of Parameter-Class to use for a given token type. This removes dependency of Point2D from core runtime

### Library
* [ ] Library



## Done
* [x] Annotate generated code to define
  * [x] what statements to display on the ui
  * [x] where to insert code
* ~~[ ] denote Points with <> instead of ()~~ Don't do that because we want to use () in expressions
* ~~[ ] denote expressions with () instead of {}~~ Don't do that because we want to use () in expressions
* [x] Make a parameter type that evaluates an expression
* [x] Properly recognize when the user enters an expression when editing a statement
* [x] Switch the complex array iteration to FOREACH in updateStatement
* [x] Make DO/ENDDO work without an index register
* [x] Operation Editor
  * [x] Make at-access working
  * [x] DO
* [x] Enable the user to wrap the selected code into a DO/ENDDO 2
* [x] Delete Objects
* [x] Add a method getPointAtPercentage to GrObject
  * [x] implement for lines
  * [x] implement for circles
* [ ] enable move and creation tools to use percentage points
  * [x] create line on lines and circles
* [ ] enable move and creation operations to use percentage points
  * [x] move
  * [x] create line
* [x] create operation to append a point to a polygon
* [ ] Data Editor
  * [x] Allow for expression in fields


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

(c) 2021, 2022 Stephan Smola