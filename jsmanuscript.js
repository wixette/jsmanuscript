/**
 * @fileoverview A utility to generate 20x20 manuscript paper format
 * for Chinese document.
 */

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
    console.log(['Formatting:', text, containerElem, fontFamily,
                 textColor, paperColor, gridColor]);

    while (containerElem.firstChild) {
        containerElem.removeChild(containerElem.firstChild);
    }

    var canvasId = 'paper-canvas-1';
    containerElem.insertAdjacentHTML(
        'beforeend',
        '<canvas id="' + canvasId +
            '" class="paper-canvas" ' +
            'width="960" height="1280"></canvas>');
    var canvasElem = document.getElementById(canvasId);
    canvasElem.style.backgroundColor = paperColor;

    return;
}
