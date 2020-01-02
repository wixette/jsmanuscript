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
function drawGrids(canvasElem, gridColor) {
    var ctx = canvasElem.getContext("2d");
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
    [/  /g, '\u3000'],
    [/,/g, '，'],
    [/\./g, '。'],
    [/\?/g, '？'],
    [/!/g, '！'],
    [/:/g, '：'],
    [/;/g, '；'],
    [/\r\n/gm, '\n'],
    [/\r/gm, '\n'],
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
 * Counts the lines that the formatted text requires.
 */
function countLines(text) {
    var lineCount = 0;
    var columnCount = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] == '\n') {
            columnCount = 0;
            lineCount++;
        } else {
            columnCount++;
            if (columnCount >= COLS) {
                columnCount = 0;
                lineCount++;
            }
        }
        console.log(text[i], columnCount, lineCount);
    }
    if (columnCount > 0) {
        lineCount++;
    }
    return lineCount;
}

/**
 * Gets the canvas DOM ID based on the given index.
 */
function getCanvasId(canvasIndex) {
    return 'paper-canvas-' + (canvasIndex + 1);
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
                                fontFamily = '',
                                textColor = '#000',
                                paperColor = '#fff',
                                gridColor = '#3C3') {
    var processedText = preprocessText(text);
    var lines = countLines(processedText);
    var numCanvas = Math.ceil(lines / ROWS);

    while (containerElem.firstChild) {
        containerElem.removeChild(containerElem.firstChild);
    }

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
        drawGrids(canvasElem, gridColor);
    }

    return;
}
