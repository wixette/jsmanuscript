/**
 * @fileoverview Util to detect if one or more fonts are installed.
 */

class FontDetector {
    /**
     * Initializes the instance of the detector. The function
     * isInstalled() of the instance can be invoked for multiple times
     * to detect more than one fonts.
     */
    constructor () {
        this.rulers = {
            latinRulers: this.createRulers_('iillMmmWww'),
            chineseRulers: this.createRulers_('汉字，。“”'),
        };
    }

    createRulers_(sampleText) {
        var elems = [];
        for (const font of FontDetector.RULER_FONTS.values()) {
            let rulerElem = document.createElement('div');
            rulerElem.style.position = 'absolute';
            rulerElem.style.zIndex = '-999';
            rulerElem.style.margin = '0';
            rulerElem.style.padding = '0';
            rulerElem.style.left = '-99999px';
            rulerElem.style.top = '0';
            rulerElem.style.visibility = 'hidden';
            rulerElem.style.fontSize = '192px';
            document.getElementsByTagName("body")[0].appendChild(rulerElem);
            rulerElem.style.fontFamily = font;
            rulerElem.innerText = sampleText;
            let width = rulerElem.offsetWidth;
            let height = rulerElem.offsetHeight;
            elems.push({
                elem: rulerElem,
                font: font,
                text: sampleText,
                width: width,
                height: height,
            });
        }
        return elems;
    }

    /**
     * Detects if a font is installed.
     * @param {string} fontFamily The font family to be detected.
     * @param {boolean} isChineseFont If it is a Chinese font family.
     * @return {boolean} If the font is installed and can be used in web page.
     */
    isInstalled (fontFamily, isChineseFont) {
        var rulers = isChineseFont ?
            this.rulers.chineseRulers :
            this.rulers.latinRulers;

        for (const ruler of rulers.values()) {
            let newFont = '"' + fontFamily + '",' + ruler.font;
            ruler.elem.style.fontFamily = newFont;
            let newWidth = ruler.elem.offsetWidth;
            let newHeight = ruler.elem.offsetHeight;
            ruler.elem.style.fontFamily = ruler.font;
            if (newWidth != ruler.width || newHeight != ruler.height) {
                return true;
            }
        }
        return false;
    }
}

FontDetector.RULER_FONTS = [
    "monospace",
    "sans-serif",
    "serif",
];
