/**
 * @fileoverview A utility to generate 20x20 manuscript paper format
 * for Chinese document.
 */

/**
 * Constant variables to format the canvas.
 */
const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 1280;
const ROWS = 20;
const COLS = 20;
const PADDING = 80;
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;
const LINE_HEIGHT = 56;

/**
 * Draws the grid lines.
 */
function drawGrids(canvasElem, paperColor, gridColor) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    for (let i = 0; i < ROWS; i++) {
        ctx.moveTo(PADDING, PADDING + LINE_HEIGHT * i);
        ctx.lineTo(CANVAS_WIDTH - PADDING, PADDING + LINE_HEIGHT * i);
        ctx.moveTo(PADDING,
                   PADDING + LINE_HEIGHT * i + LINE_HEIGHT - GRID_HEIGHT);
        ctx.lineTo(CANVAS_WIDTH - PADDING,
                   PADDING + LINE_HEIGHT * i + LINE_HEIGHT - GRID_HEIGHT);
        for (let j = 1; j < COLS; j++) {
            ctx.moveTo(PADDING + j * GRID_WIDTH,
                       PADDING + LINE_HEIGHT * i + LINE_HEIGHT - GRID_HEIGHT);
            ctx.lineTo(PADDING + j * GRID_WIDTH,
                       PADDING + LINE_HEIGHT * i + LINE_HEIGHT);
        }
    }
    ctx.rect(PADDING, PADDING,
             CANVAS_WIDTH - 2 * PADDING, CANVAS_HEIGHT - 2 * PADDING);
    ctx.stroke();
}

/**
 * Constant variables for text processing.
 */
const REPLACE_TABLE = [
    [/\r\n/gm, '\n'],
    [/\r/gm, '\n']
];

/**
 * Preprocesses the text.
 */
function preprocessText(text) {
    var ret = text;
    for (let i = 0; i < REPLACE_TABLE.length; i++) {
        ret = ret.replace(REPLACE_TABLE[i][0], REPLACE_TABLE[i][1]);
    }
    return ret;
}

/**
 * Parses the text into separated lines. The lines are separated
 * either by \n or by the limit of characters per line.
 */
function splitLines(text) {
    var lines = text.split('\n');
    var ret = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.length <= 0) {
            ret.push('');
        } else {
            for (let j = 0; j < line.length; j += COLS) {
                ret.push(line.substr(j, Math.min(COLS, line.length - j)));
            }
        }
    }
    return ret;
}

/**
 * Gets the canvas DOM ID based on the given index.
 */
function getCanvasId(canvasIndex) {
    return 'paper-canvas-' + (canvasIndex + 1);
}

/**
 * Draws a single character onto the canvas.
 */
function drawChar(c, canvasElem, fontFamily, textColor, row, col) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = textColor;
    ctx.font = '20px ' + fontFamily;
    ctx.textBaseline = "top";
    ctx.fillText(c,
                 PADDING + col * GRID_WIDTH + 10,
                 PADDING + row * LINE_HEIGHT + LINE_HEIGHT - GRID_HEIGHT + 10);
}

/**
 * Draws the text onto the canvases.
 */
function drawText(lines, fontFamily, textColor) {
    var canvasIndex = 0;
    for (let i = 0; i < lines.length; i += ROWS) {
        var x = getCanvasId(canvasIndex);
        var canvasElem = document.getElementById(getCanvasId(canvasIndex));
        for (let row = 0; row < Math.min(ROWS, lines.length - i); row++) {
            let line = lines[i + row];
            for (let col = 0; col < line.length; col++) {
                drawChar(line[col],
                         canvasElem,
                         fontFamily,
                         textColor,
                         row,
                         col);
            }
        }
        canvasIndex++;
    }
}

/**
 * Formats the input text and renders one or more canvases.
 * @param {!string} text The string that contains the input Chinese text.
 * @param {Element} containerElem The container DOM element for
 *     holding the generated canvases.
 * @param {string=} fontFamily The font family string for setting the text
 *     style.
 * @param {string=} textColor The color string for setting the text style.
 * @param {string=} paperColor The color string for setting the paper background
 *     style.
 * @param {string=} gridColor The color string for setting the grid style.
 */
function JsManuscriptFormatText(text,
                                containerElem,
                                fontFamily = 'sans-serif',
                                textColor = '#000',
                                paperColor = '#fff',
                                gridColor = '#3C3') {
    while (containerElem.firstChild) {
        containerElem.removeChild(containerElem.firstChild);
    }
    var processedText = preprocessText(text);
    var lines = splitLines(processedText);
    if (lines.length >= 0) {
        var numCanvas = Math.ceil(lines.length / ROWS);
        for (let i = 0; i < numCanvas; i++) {
            var canvasId = getCanvasId(i);
            containerElem.insertAdjacentHTML(
                'beforeend',
                '<canvas id="' + canvasId +
                    '" class="paper-canvas" ' +
                    'width="' + CANVAS_WIDTH +
                    '" height="' + CANVAS_HEIGHT +
                    '"></canvas>');
            var canvasElem = document.getElementById(canvasId);
            canvasElem.style.backgroundColor = paperColor;
            drawGrids(canvasElem, paperColor, gridColor);
        }
        drawText(lines, fontFamily, textColor);
    }
}
