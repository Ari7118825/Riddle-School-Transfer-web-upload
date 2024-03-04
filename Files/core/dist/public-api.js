import { Version } from "./version";
import { VersionRange } from "./version-range";
import { SourceAPI } from "./source-api";
/**
 * Represents the Ruffle public API.
 *
 * The public API exists primarily to allow multiple installs of Ruffle on a
 * page (e.g. an extension install and a local one) to cooperate. In an ideal
 * situation, all Ruffle sources on the page install themselves into a single
 * public API, and then the public API picks the newest version by default.
 *
 * This API *is* versioned, in case we need to upgrade it. However, it must be
 * backwards- and forwards-compatible with all known sources.
 */
export class PublicAPI {
    /**
     * Construct the Ruffle public API.
     *
     * Do not use this function to negotiate a public API. Instead, use
     * `public_api` to register your Ruffle source with an existing public API
     * if it exists.
     *
     * Constructing a Public API will also trigger it to initialize Ruffle once
     * the page loads, if the API has not already been superseded.
     *
     * @param prev What used to be in the public API slot.
     *
     * This is used to upgrade from a prior version of the public API, or from
     * a user-defined configuration object placed in the public API slot.
     */
    constructor(prev) {
        var _a;
        this.sources = (prev === null || prev === void 0 ? void 0 : prev.sources) || {};
        this.config = (prev === null || prev === void 0 ? void 0 : prev.config) || {};
        this.invoked = (prev === null || prev === void 0 ? void 0 : prev.invoked) || false;
        this.newestName = (prev === null || prev === void 0 ? void 0 : prev.newestName) || null;
        (_a = prev === null || prev === void 0 ? void 0 : prev.superseded) === null || _a === void 0 ? void 0 : _a.call(prev);
        if (document.readyState === "loading") {
            // Cloudflare Rocket Loader interferes with the DOMContentLoaded event,
            // so we listen for readystatechange instead
            document.addEventListener("readystatechange", this.init.bind(this));
        }
        else {
            window.setTimeout(this.init.bind(this), 0);
        }
    }
    /**
     * The version of the public API.
     *
     * This is *not* the version of Ruffle itself.
     *
     * This allows a page with an old version of the Public API to be upgraded
     * to a new version of the API. The public API is intended to be changed
     * very infrequently, if at all, but this provides an escape mechanism for
     * newer Ruffle sources to upgrade older installations.
     *
     * @returns The version of this public API.
     */
    get version() {
        return "0.1.0";
    }
    /**
     * Register a given source with the Ruffle Public API.
     *
     * @param name The name of the source.
     */
    registerSource(name) {
        this.sources[name] = SourceAPI;
    }
    /**
     * Determine the name of the newest registered source in the Public API.
     *
     * @returns The name of the source, or `null` if no source
     * has yet to be registered.
     */
    newestSourceName() {
        let newestName = null, newestVersion = Version.fromSemver("0.0.0");
        for (const k in this.sources) {
            if (Object.prototype.hasOwnProperty.call(this.sources, k)) {
                const kVersion = Version.fromSemver(this.sources[k].version);
                if (kVersion.hasPrecedenceOver(newestVersion)) {
                    newestName = k;
                    newestVersion = kVersion;
                }
            }
        }
        return newestName;
    }
    /**
     * Negotiate and start Ruffle.
     *
     * This function reads the config parameter to determine which polyfills
     * should be enabled. If the configuration parameter is missing, then we
     * use a built-in set of defaults sufficient to fool sites with static
     * content and weak plugin detection.
     */
    init() {
        if (!this.invoked) {
            this.invoked = true;
            this.newestName = this.newestSourceName();
            if (this.newestName === null) {
                throw new Error("No registered Ruffle source!");
            }
            const polyfills = "polyfills" in this.config ? this.config.polyfills : true;
            if (polyfills !== false) {
                this.sources[this.newestName].polyfill();
            }
        }
    }
    /**
     * Look up the newest Ruffle source and return it's API.
     *
     * @returns An instance of the Source API.
     */
    newest() {
        const name = this.newestSourceName();
        return name !== null ? this.sources[name] : null;
    }
    /**
     * Look up a specific Ruffle version (or any version satisfying a given set
     * of requirements) and return it's API.
     *
     * @param requirementString A set of semantic version requirement
     * strings that the player version must satisfy.
     * @returns An instance of the Source API, if one or more
     * sources satisfied the requirement.
     */
    satisfying(requirementString) {
        const requirement = VersionRange.fromRequirementString(requirementString);
        let valid = null;
        for (const k in this.sources) {
            if (Object.prototype.hasOwnProperty.call(this.sources, k)) {
                const version = Version.fromSemver(this.sources[k].version);
                if (requirement.satisfiedBy(version)) {
                    valid = this.sources[k];
                }
            }
        }
        return valid;
    }
    /**
     * Look up the newest Ruffle version compatible with the `local` source, if
     * it's installed. Otherwise, use the latest version.
     *
     * @returns An instance of the Source API
     */
    localCompatible() {
        if (this.sources["local"] !== undefined) {
            return this.satisfying("^" + this.sources["local"].version);
        }
        else {
            return this.newest();
        }
    }
    /**
     * Look up the newest Ruffle version with the exact same version as the
     * `local` source, if it's installed. Otherwise, use the latest version.
     *
     * @returns An instance of the Source API
     */
    local() {
        if (this.sources["local"] !== undefined) {
            return this.satisfying("=" + this.sources["local"].version);
        }
        else {
            return this.newest();
        }
    }
    /**
     * Indicates that this version of the public API has been superseded by a
     * newer version.
     *
     * This should only be called by a newer version of the Public API.
     * Identical versions of the Public API should not supersede older versions
     * of that same API.
     *
     * Unfortunately, we can't disable polyfills after-the-fact, so this
     * only lets you disable the init event...
     */
    superseded() {
        this.invoked = true;
    }
    /**
     * Join a source into the public API, if it doesn't already exist.
     *
     * @param prevRuffle The previous iteration of the Ruffle API.
     *
     * The `prevRuffle` param lists the previous object in the RufflePlayer
     * slot. We perform some checks to see if this is a Ruffle public API or a
     * conflicting object. If this is conflicting, then a new public API will
     * be constructed (see the constructor information for what happens to
     * `prevRuffle`).
     *
     * Note that Public API upgrades are deliberately not enabled in this
     * version of Ruffle, since there is no Public API to upgrade from.
     * @param sourceName The name of this particular
     * Ruffle source.
     *
     * If both parameters are provided they will be used to define a new Ruffle
     * source to register with the public API.
     * @returns The Ruffle Public API.
     */
    static negotiate(prevRuffle, sourceName) {
        let publicAPI;
        if (prevRuffle instanceof PublicAPI) {
            publicAPI = prevRuffle;
        }
        else {
            publicAPI = new PublicAPI(prevRuffle);
        }
        if (sourceName !== undefined) {
            publicAPI.registerSource(sourceName);
            // Install the faux plugin detection immediately.
            // This is necessary because scripts such as SWFObject check for the
            // Flash Player immediately when they load.
            // TODO: Maybe there's a better place for this.
            const polyfills = "polyfills" in publicAPI.config
                ? publicAPI.config.polyfills
                : true;
            if (polyfills !== false) {
                SourceAPI.pluginPolyfill();
            }
        }
        return publicAPI;
    }
}
