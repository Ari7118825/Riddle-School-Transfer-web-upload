import { getPolyfillOptions, isFallbackElement, isYoutubeFlashSource, RufflePlayer, workaroundYoutubeMixedContent, } from "./ruffle-player";
import { registerElement } from "./register-element";
import { isSwf } from "./swf-utils";
/**
 * A polyfill html element.
 *
 * This specific class tries to polyfill existing `<embed>` tags,
 * and should not be used. Prefer [[RufflePlayer]] instead.
 *
 * @internal
 */
export class RuffleEmbed extends RufflePlayer {
    /**
     * Constructs a new Ruffle flash player for insertion onto the page.
     *
     * This specific class tries to polyfill existing `<embed>` tags,
     * and should not be used. Prefer [[RufflePlayer]] instead.
     */
    constructor() {
        super();
    }
    /**
     * @ignore
     * @internal
     */
    connectedCallback() {
        super.connectedCallback();
        const src = this.attributes.getNamedItem("src");
        if (src) {
            // Get the configuration options that have been overwritten for this movie.
            const getOptionString = (optionName) => { var _a, _b; return (_b = (_a = this.attributes.getNamedItem(optionName)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null; };
            const options = getPolyfillOptions(src.value, getOptionString);
            // Kick off the SWF download.
            this.load(options, true);
        }
    }
    /**
     * Polyfill of HTMLObjectElement.
     *
     * @ignore
     * @internal
     */
    get src() {
        var _a;
        return (_a = this.attributes.getNamedItem("src")) === null || _a === void 0 ? void 0 : _a.value;
    }
    /**
     * Polyfill of HTMLObjectElement.
     *
     * @ignore
     * @internal
     */
    set src(srcval) {
        if (srcval) {
            const attr = document.createAttribute("src");
            attr.value = srcval;
            this.attributes.setNamedItem(attr);
        }
        else {
            this.attributes.removeNamedItem("src");
        }
    }
    /**
     * @ignore
     * @internal
     */
    static get observedAttributes() {
        return ["src", "width", "height"];
    }
    /**
     * @ignore
     * @internal
     */
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (this.isConnected && name === "src") {
            const src = this.attributes.getNamedItem("src");
            if (src) {
                const getOptionString = (optionName) => { var _a, _b; return (_b = (_a = this.attributes.getNamedItem(optionName)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : null; };
                const options = getPolyfillOptions(src.value, getOptionString);
                this.load(options, true);
            }
        }
    }
    /**
     * Checks if the given element may be polyfilled with this one.
     *
     * @param elem Element to check.
     * @returns True if the element looks like a Flash embed.
     */
    static isInterdictable(elem) {
        const src = elem.getAttribute("src");
        const type = elem.getAttribute("type");
        // Don't polyfill when no file is specified.
        if (!src) {
            return false;
        }
        // Don't polyfill if the element is inside a specific node.
        if (isFallbackElement(elem)) {
            return false;
        }
        // Don't polyfill when the file is a YouTube Flash source.
        if (isYoutubeFlashSource(src)) {
            // Workaround YouTube mixed content; this isn't what browsers do automatically, but while we're here, we may as well.
            workaroundYoutubeMixedContent(elem, "src");
            return false;
        }
        return isSwf(src, type);
    }
    /**
     * Creates a RuffleEmbed that will polyfill and replace the given element.
     *
     * @param elem Element to replace.
     * @returns Created RuffleEmbed.
     */
    static fromNativeEmbedElement(elem) {
        const externalName = registerElement("ruffle-embed", RuffleEmbed);
        const ruffleObj = document.createElement(externalName);
        ruffleObj.copyElement(elem);
        return ruffleObj;
    }
}
