# Draw

[![Build Status](https://travis-ci.org/WrathOfZombies/draw.svg?branch=master)](https://travis-ci.org/WrathOfZombies/draw)
[![dependencies](https://david-dm.org/WrathOfZombies/draw.svg)](https://david-dm.org/WrathOfZombies/draw)

Draw is a simple canvas drawing utility for JavaScript. Its built on top of fabric-js.

## Getting Started

### Installation

#### Development
> This assumes you are using npm as your package manager.

To install the dependencies:

`npm install`

To start the tool:

`npm start`

#### Building
To build a production copy of the library use the command 
`npm run build`

It will generate the `draw.css` and `draw.js` required and will also generate a sample `index.html` and `app.css` listing all the necessary dependencies.

### Structure
The entire `draw` library is inspired by Redux. 

1. The tools are listed in each file in the draw/tools folder where they define, the structure of the Tool, the drawing function and the default properties.
2. Then in the draw/tools/index.ts a massive switch case is written which determines the right tool based on what tool as selected on the UI.
3. The drawing state/drawing loop is maintained in the DrawStateService which is located in draw/reducers/index.ts.
4. When a user performs any action, the state is maintained and if its a tool based action, the toolservice is invoked to determine the right action to be performed.

### Limitations
There are some limitations of the code and currently SVG imports arent working. All other bugs are documented within the code and features can be extended/added accordingly.

## License

This project is licensed under the MIT License - see the [License](LICENSE) file for details.
