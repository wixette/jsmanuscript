/**
 *  Copyright 2020 wixette@gmail.com
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * @fileoverview A utility to generate 20x20 manuscript paper format
 * for Chinese document.
 */

var jsm = jsm || {};

/**
 * Constant variables to format the canvas.
 */
jsm.CANVAS_WIDTH = 1920;
jsm.CANVAS_HEIGHT = 2560;
jsm.ROWS = 20;
jsm.COLS = 20;
jsm.PADDING = 160;
jsm.GRID_WIDTH = 80;
jsm.GRID_HEIGHT = 80;
jsm.LINE_STROKE = 2;
jsm.FONT_SIZE = '50px';
jsm.GRID_LEFT_PADDING = 15;
jsm.LINE_HEIGHT = 112;
jsm.FOOTER_POSITION = 1600;
jsm.FOOTER_HEIGHT = 80;
jsm.FOOTER_FONT_SIZE = '30px';

jsm.DEFAULT_FONT = "sans-serif";

/**
 * Candidate list of font familiy and display name.
 */
jsm.FONTS = [
    {
        family: 'STKaiti',
        name: '华文楷体',
    },
    {
        family: 'BiauKai',
        name: '标楷体',
    },
    {
        family: 'Kai',
        name: '楷体',
    },
    {
        family: 'KaiTi',
        name: '楷体',
    },
    {
        family: 'DFKai-SB',
        name: '华康标楷',
    },
    {
        family: 'STSong',
        name: '华文宋体',
    },
    {
        family: 'Songti SC',
        name: '宋体简体',
    },
    {
        family: 'Song',
        name: '宋体',
    },
    {
        family: 'SimSun',
        name: '宋体',
    },
    {
        family: 'NSimSun',
        name: '新宋体',
    },
    {
        family: 'LiSong Pro',
        name: '俪宋',
    },
    {
        family: 'PMingLiU',
        name: '细明体',
    },
    {
        family: 'PingFang SC',
        name: '平方简体',
    },
    {
        family: 'Hei',
        name: '黑体',
    },
    {
        family: 'STHeiti',
        name: '华文黑体',
    },
    {
        family: 'Heiti SC',
        name: '黑体简体',
    },
    {
        family: 'LiHei Pro',
        name: '俪黑',
    },
    {
        family: 'Microsoft JhengHei',
        name: '微软正黑',
    },
    {
        family: 'Microsoft YaHei',
        name: '微软雅黑',
    },
    {
        family: 'SimHei',
        name: '新黑体',
    },
    {
        family: 'Noto Sans CJK SC',
        name: 'Noto黑体简',
    },
    {
        family: 'STXihei',
        name: '华文细黑',
    },
    {
        family: 'FangSong',
        name: '仿宋',
    },
    {
        family: 'Fang Song',
        name: '仿宋',
    },
    {
        family: 'STFangSong',
        name: '华文仿宋',
    },
    {
        family: 'Yuanti SC',
        name: '圆体简体',
    },
    {
        family: 'Xingkai SC',
        name: '行楷简体',
    },
    {
        family: 'STXingkai',
        name: '华文行楷',
    },
    {
        family: 'LiSu',
        name: '隶书',
    },
    {
        family: 'STLiti',
        name: '华文隶书',
    },
    {
        family: 'YouYuan',
        name: '幼圆',
    },
    {
        family: 'Weibei SC',
        name: '魏碑简体',
    },
    {
        family: 'STXinwei',
        name: '华文新魏',
    },
    {
        family: 'Yuppy SC',
        name: '雅痞简体',
    },
    {
        family: 'Wawati SC',
        name: '娃娃体简体',
    },
];

/**
 * Whether the current window is in text editing status.
 * @type {boolean}
 */
jsm.isEditing = false;

/**
 * Number of canvas that are generated (pages).
 * @type {nubmer}
 */
jsm.numCanvas = 0;

/**
 * Draws the grid lines.
 */
jsm.drawGrids = function(canvasElem, paperColor, gridColor) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = paperColor;
    ctx.fillRect(0, 0, jsm.CANVAS_WIDTH, jsm.CANVAS_HEIGHT);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = jsm.LINE_STROKE;

    for (let i = 0; i < jsm.ROWS; i++) {
        ctx.moveTo(jsm.PADDING, jsm.PADDING + jsm.LINE_HEIGHT * i);
        ctx.lineTo(jsm.CANVAS_WIDTH - jsm.PADDING,
                   jsm.PADDING + jsm.LINE_HEIGHT * i);
        ctx.moveTo(jsm.PADDING,
                   jsm.PADDING + jsm.LINE_HEIGHT * i +
                   jsm.LINE_HEIGHT - jsm.GRID_HEIGHT);
        ctx.lineTo(jsm.CANVAS_WIDTH - jsm.PADDING,
                   jsm.PADDING + jsm.LINE_HEIGHT * i +
                   jsm.LINE_HEIGHT - jsm.GRID_HEIGHT);
        for (let j = 1; j < jsm.COLS; j++) {
            ctx.moveTo(jsm.PADDING + j * jsm.GRID_WIDTH,
                       jsm.PADDING + jsm.LINE_HEIGHT * i +
                       jsm.LINE_HEIGHT - jsm.GRID_HEIGHT);
            ctx.lineTo(jsm.PADDING + j * jsm.GRID_WIDTH,
                       jsm.PADDING + jsm.LINE_HEIGHT * i + jsm.LINE_HEIGHT);
        }
    }
    ctx.rect(jsm.PADDING, jsm.PADDING,
             jsm.CANVAS_WIDTH - 2 * jsm.PADDING,
             jsm.CANVAS_HEIGHT - 2 * jsm.PADDING);
    ctx.stroke();
};

/**
 * Constant variables for text processing.
 */
jsm.REPLACE_TABLE = [
    [/\r\n/gm, '\n'],
    [/\r/gm, '\n']
];

/**
 * Preprocesses the text.
 */
jsm.preprocessText = function (text) {
    var ret = text;
    for (let i = 0; i < jsm.REPLACE_TABLE.length; i++) {
        ret = ret.replace(jsm.REPLACE_TABLE[i][0], jsm.REPLACE_TABLE[i][1]);
    }
    return ret;
};

/**
 * Parses the text into separated lines. The lines are separated
 * either by \n or by the limit of characters per line.
 */
jsm.splitLines = function (text) {
    var lines = text.split('\n');
    var ret = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.length <= 0) {
            ret.push('');
        } else {
            for (let j = 0; j < line.length; j += jsm.COLS) {
                ret.push(line.substr(j, Math.min(jsm.COLS, line.length - j)));
            }
        }
    }
    return ret;
};

/**
 * Gets the canvas DOM ID based on the given index.
 */
jsm.getCanvasId = function (canvasIndex) {
    return 'paper-canvas-' + (canvasIndex + 1);
};

/**
 * Draws a footer line on each canvas.
 */
jsm.drawFooter = function(canvasElem, canvasIndex,
                          numCanvas, fontFamily, textColor) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = textColor;
    ctx.font = jsm.FOOTER_FONT_SIZE + ' ' + fontFamily;
    ctx.textBaseline = "top";
    ctx.fillText('第 ' + (canvasIndex + 1) + ' 页  共 ' + numCanvas + ' 页',
                 jsm.FOOTER_POSITION,
                 jsm.CANVAS_HEIGHT - jsm.FOOTER_HEIGHT);
};

/**
 * Draws a single character onto the canvas.
 */
jsm.drawChar = function (c, canvasElem, fontFamily, textColor, row, col) {
    var ctx = canvasElem.getContext("2d");
    ctx.fillStyle = textColor;
    ctx.font = jsm.FONT_SIZE + ' '+ fontFamily;
    ctx.textBaseline = "middle";
    ctx.fillText(c,
                 jsm.PADDING + col * jsm.GRID_WIDTH + jsm.GRID_LEFT_PADDING,
                 jsm.PADDING + row * jsm.LINE_HEIGHT +
                 jsm.LINE_HEIGHT - jsm.GRID_HEIGHT / 2);
};

/**
 * Draws the text onto the canvases.
 */
jsm.drawText = function(lines, fontFamily, textColor) {
    var canvasIndex = 0;
    for (let i = 0; i < lines.length; i += jsm.ROWS) {
        var x = jsm.getCanvasId(canvasIndex);
        var canvasElem = document.getElementById(jsm.getCanvasId(canvasIndex));
        for (let row = 0; row < Math.min(jsm.ROWS, lines.length - i); row++) {
            let line = lines[i + row];
            for (let col = 0; col < line.length; col++) {
                jsm.drawChar(line[col],
                             canvasElem,
                             fontFamily,
                             textColor,
                             row,
                             col);
            }
        }
        canvasIndex++;
    }
};

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
jsm.formatText = function (text,
                           containerElem,
                           fontFamily = 'sans-serif',
                           textColor = '#000',
                           paperColor = '#fff',
                           gridColor = '#3C3') {
    while (containerElem.firstChild) {
        containerElem.removeChild(containerElem.firstChild);
    }
    var processedText = jsm.preprocessText(text);
    var lines = jsm.splitLines(processedText);
    if (lines.length <= 0) {
        lines = [''];
    }
    fontFamily = fontFamily.trim();
    if (fontFamily === '')
        fontFamily = 'sans-serif';
    jsm.numCanvas = Math.ceil(lines.length / jsm.ROWS);
    for (let i = 0; i < jsm.numCanvas; i++) {
        var canvasId = jsm.getCanvasId(i);
        containerElem.insertAdjacentHTML(
            'beforeend',
            '<canvas id="' + canvasId +
                '" class="paper-canvas" ' +
                'width="' + jsm.CANVAS_WIDTH +
                '" height="' + jsm.CANVAS_HEIGHT +
                '"></canvas>');
        var canvasElem = document.getElementById(canvasId);
        canvasElem.style.backgroundColor = paperColor;
        jsm.drawGrids(canvasElem, paperColor, gridColor);
        jsm.drawFooter(canvasElem, i, jsm.numCanvas, fontFamily, textColor);
    }
    jsm.drawText(lines, fontFamily, textColor);
};

jsm.format = function () {
    var text = document.getElementById('input-text').value;
    var fontIndex = parseInt(document.getElementById('font-select').value);
    var fontFamily = isNaN(fontIndex) ?
        jsm.DEFAULT_FONT :
        jsm.FONTS[fontIndex].family;
    var textColor = document.getElementById('text-color').value;
    var paperColor = document.getElementById('paper-color').value;
    var gridColor = document.getElementById('grid-color').value;
    jsm.formatText(text,
                   document.getElementById('paper-container'),
                   fontFamily,
                   textColor,
                   paperColor,
                   gridColor);
    jsm.isEditing = false;
    jsm.updateElements();
};

/**
 * Checks exsiting Chinese font families and initializes the font select control.
 */
jsm.initFontList = function() {
    window.setTimeout(function() {
        var fontDetector = new FontDetector();
        var selectElem = document.getElementById('font-select');
        selectElem.innerHTML = '';
        for (let i = 0; i < jsm.FONTS.length; i++) {
            let fontInfo = jsm.FONTS[i];
            if (fontInfo.family) {
                if (fontDetector.isInstalled(fontInfo.family)) {
                    let optionElem = document.createElement('option');
                    optionElem.setAttribute('value', i);
                    optionElem.innerText = fontInfo.name;
                    selectElem.appendChild(optionElem);
                }
            }
        }
    }, 1);
};

/**
 * Initializes event listeners.
 */
jsm.initEventListeners = function () {
    document.getElementById('btn-format').addEventListener('click',
                                                           jsm.format);
    document.getElementById('btn-input').addEventListener('click',
                                                          jsm.switchToInput);
    document.getElementById('btn-print').addEventListener('click',
                                                          jsm.print);
    document.getElementById('btn-export').addEventListener('click',
                                                           jsm.export);
};

/**
 * Updates the visibility of UI elements, or enables them by the
 * current status of jsm.isEditing.
 */
jsm.updateElements = function () {
    document.getElementById('text-container').style.display =
        jsm.isEditing ? 'block' : 'none';
    document.getElementById('paper-container').style.display =
        jsm.isEditing ? 'none' : 'block';

    if (jsm.isEditing) {
        document.getElementById('input-text').focus();
        document.getElementById('btn-input').setAttribute('disabled',
                                                          'disabled');
        document.getElementById('btn-print').setAttribute('disabled',
                                                          'disabled');
        document.getElementById('btn-export').setAttribute('disabled',
                                                           'disabled');
        document.getElementById('page-select').setAttribute('disabled',
                                                            'disabled');
    } else {
        document.getElementById('page-select').removeAttribute('disabled');
        document.getElementById('btn-input').removeAttribute('disabled');
        document.getElementById('btn-print').removeAttribute('disabled');
        document.getElementById('btn-export').removeAttribute('disabled');

        if (jsm.numCanvas > 0) {
            var selectElem = document.getElementById('page-select');
            selectElem.innerHTML = '';
            for (let i = 0; i < jsm.numCanvas; i++) {
                let optionElem = document.createElement('option');
                optionElem.setAttribute('value', i);
                optionElem.innerText = '' + (i + 1);
                selectElem.appendChild(optionElem);
            }
        }
    }
};

jsm.switchToInput = function () {
    jsm.isEditing = true;
    jsm.updateElements();
};

jsm.print = function () {
    window.print();
};

jsm.export = function () {
};

/**
 * Initializes input controls and event listeners.
 */
jsm.init = function () {
    jsm.initFontList();
    jsm.initEventListeners();
    jsm.isEditing = true;
    jsm.updateElements();
};
