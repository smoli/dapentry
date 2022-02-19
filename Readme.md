GFXBCTS
=======

## What is this?

This is heavily based on - some might call it a clone of - http://worrydream.com/DrawingDynamicVisualizationsTalkAddendum/

## How to build and run

`$ npm run start`

then open [http://localhost:8080/index.html](http://localhost:8080/index.html)

## How does it work?

It uses an interpreted language that resembles something like assembly to draw pictures. User interaction
creates the program in the background. [See here](doc/opcodes.md) for more details on the language and the interpreter.


## Todos:

[https://trello.com/b/4Lzs5OFu/dapentry](https://trello.com/b/4Lzs5OFu/dapentry)



### Main Page
* [ ] cool design
* [ ] Why that name?

### Introduction
* [ ] Possibility to preload code into the designer instance
* [ ] create polygons
* [ ] extend polygons
* [ ] working with data fields


### Language/Interpreter
* [ ] Language Version annotation
* [ ] extend parser to recognize 43.34% as  the number 0.4334
* [ ] extend parser to recognise 1e12 as the number it is
* [ ] Maybe configure what kind of Parameter-Class to use for a given token type. This removes dependency of Point2D from core runtime




## Done
* [x] rotate around pivot
  * [x] GrLine
* [x] Define aspect ratio for a drawing
  * [ ] ~~Maybe determine bounding box for drawing automatically when storing~~
* [x] Rename fields
* [x] define stroke color separately
* [x] Show hints on what the active tool supports, like "hold shift to axis align, ..."
* [x] User friendly error messages.
* [X] Operation Editor
  * [X] FOREACH
  * [X] Enable the user to switch an DO/ENDDO to a FOREACH when assigning an array as the count
* [x] Auto growing input field
* [x] Fix scaling of rotated objects
* [x] Percentage-Point on vertical lines does not work
* [x] Tool Lifecycle: Abort/teardown is not called properly
* [x] Expressions are not displayed in steps and operation editor
* [x] Program does not always run as far as expected (better description needed)
* [x] Store app configuration in a central point
* [x] Annotate generated code to define
  * [x] what statements to display on the ui
  * [x] where to insert code
* ~~[ ] denote Points with <> instead of ()~~ Don't do that because we want to use () in expressions
* ~~[ ] denote expressions with () instead of {}~~ Don't do that because we want to use () in expressions
* [x] Make a parameter type that evaluates an expression
* [x] Properly recognize when the user enters an expression when editing a statement
* [x] Switch the complex array iteration to FOREACH in updateStatement
* [x] Make DO/ENDDO work without an index register
* Operation Editor
  * [x] Make at-access working
  * [x] DO
* [x] Enable the user to wrap the selected code into a DO/ENDDO 2
* [x] Delete Objects
* Add a method getPointAtPercentage to GrObject
  * [x] implement for lines
  * [x] implement for circles
* enable move and creation tools to use percentage points
  * [x] create line on lines and circles
* enable move and creation operations to use percentage points
  * [x] move
  * [x] create line
* [x] create operation to append a point to a polygon
* Data Editor
  * [x] Allow for expression in fields

## Cancelled
* [ ] ~~make polygons open by default?~~
* [ ] ~~autoclose polygons?~~
* [ ] ~~enable fill rendering for open polygons~~

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

## Profiling

You first need to build the code for node-js. Use WebstormConfig buildPerf for that.
There are some WebstormConfigs for profiling. They run the buildPerf beforehand but complain about
the test file not being there if the build didn't run once.

## Documentation

See [doc/Readme.md](doc/Readme.md)


## License

Pending

(c) 2021, 2022 Stephan Smola
