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
    return;
}
