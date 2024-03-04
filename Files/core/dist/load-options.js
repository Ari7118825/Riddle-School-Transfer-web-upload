/**
 * Represents the various types of auto-play behaviours that are supported.
 */
export var AutoPlay;
(function (AutoPlay) {
    /**
     * The player should automatically play the movie as soon as it is loaded.
     *
     * If the browser does not support automatic audio, the movie will begin
     * muted.
     */
    AutoPlay["On"] = "on";
    /**
     * The player should not attempt to automatically play the movie.
     *
     * This will leave it to the user or API to actually play when appropriate.
     */
    AutoPlay["Off"] = "off";
    /**
     * The player should automatically play the movie as soon as it is deemed
     * "appropriate" to do so.
     *
     * The exact behaviour depends on the browser, but commonly requires some
     * form of user interaction on the page in order to allow auto playing videos
     * with sound.
     */
    AutoPlay["Auto"] = "auto";
})(AutoPlay || (AutoPlay = {}));
/**
 * Controls whether the content is letterboxed or pillarboxed when the
 * player's aspect ratio does not match the movie's aspect ratio.
 *
 * When letterboxed, black bars will be rendered around the exterior
 * margins of the content.
 */
export var Letterbox;
(function (Letterbox) {
    /**
     * The content will never be letterboxed.
     */
    Letterbox["Off"] = "off";
    /**
     * The content will only be letterboxed if the content is running fullscreen.
     */
    Letterbox["Fullscreen"] = "fullscreen";
    /**
     * The content will always be letterboxed.
     */
    Letterbox["On"] = "on";
})(Letterbox || (Letterbox = {}));
/**
 * When the player is muted, this controls whether or not Ruffle will show a
 * "click to unmute" overlay on top of the movie.
 */
export var UnmuteOverlay;
(function (UnmuteOverlay) {
    /**
     * Show an overlay explaining that the movie is muted.
     */
    UnmuteOverlay["Visible"] = "visible";
    /**
     * Don't show an overlay and pretend that everything is fine.
     */
    UnmuteOverlay["Hidden"] = "hidden";
})(UnmuteOverlay || (UnmuteOverlay = {}));
/**
 * Console logging level.
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["Error"] = "error";
    LogLevel["Warn"] = "warn";
    LogLevel["Info"] = "info";
    LogLevel["Debug"] = "debug";
    LogLevel["Trace"] = "trace";
})(LogLevel || (LogLevel = {}));
/**
 * The window mode of a Ruffle player.
 */
export var WindowMode;
(function (WindowMode) {
    /**
     * The Flash content is rendered in its own window and layering is done with the browser's
     * default behavior.
     *
     * In Ruffle, this mode functions like `WindowMode::Opaque` and will layer the Flash content
     * together with other HTML elements.
     */
    WindowMode["Window"] = "window";
    /**
     * The Flash content is layered together with other HTML elements, and the stage color is
     * opaque. Content can render above or below Ruffle based on CSS rendering order.
     */
    WindowMode["Opaque"] = "opaque";
    /**
     * The Flash content is layered together with other HTML elements, and the SWF stage color is
     * transparent. Content beneath Ruffle will be visible through transparent areas.
     */
    WindowMode["Transparent"] = "transparent";
    /**
     * Request compositing with hardware acceleration when possible.
     * This mode has no effect in Ruffle and will function like `WindowMode.Opaque`.
     */
    WindowMode["Direct"] = "direct";
    /**
     * Request a direct rendering path, bypassing browser compositing when possible.
     * This mode has no effect in Ruffle and will function like `WindowMode::Opaque`.
     */
    WindowMode["Gpu"] = "gpu";
})(WindowMode || (WindowMode = {}));
/**
 * The render backend of a Ruffle player.
 *
 * The available backends may change in future releases.
 */
export var RenderBackend;
(function (RenderBackend) {
    /**
     * An [in-development API](https://caniuse.com/webgpu) that will be preferred if available in the future.
     * Should behave the same as wgpu-webgl, except with lower overhead and thus better performance.
     */
    RenderBackend["WebGpu"] = "webgpu";
    /**
     * The most featureful and currently preferred backend.
     * Rendering is done the same way as in the desktop app, then translated to WebGL on-the-fly.
     */
    RenderBackend["WgpuWebgl"] = "wgpu-webgl";
    /**
     * A vanilla WebGL backend. Was the default backend until the start of 2023,
     * but is now used as a fallback for devices that do not support WebGL 2.
     * Supports fewer features and has a faster initialization time;
     * may be useful for content that does not need advanced features like bitmap drawing or blend modes.
     */
    RenderBackend["Webgl"] = "webgl";
    /**
     * The slowest and most basic backend, used as a fallback when all else fails.
     * However, this is currently the only backend that accurately scales hairline strokes.
     * If you notice excessively thick strokes in specific content,
     * you may want to use the canvas renderer for that content until the issue is resolved.
     */
    RenderBackend["Canvas"] = "canvas";
})(RenderBackend || (RenderBackend = {}));
/**
 * Represents the various context menu options that are supported.
 */
export var ContextMenu;
(function (ContextMenu) {
    /**
     * The context menu should appear when right-clicking or long-pressing
     * the Ruffle instance.
     */
    ContextMenu["On"] = "on";
    /**
     * The context menu should only appear when right-clicking
     * the Ruffle instance.
     */
    ContextMenu["RightClickOnly"] = "rightClickOnly";
    /**
     * The context menu should not appear when right-clicking or long-pressing
     * the Ruffle instance.
     */
    ContextMenu["Off"] = "off";
})(ContextMenu || (ContextMenu = {}));
/**
 * Represents the player runtime to emulate.
 */
export var PlayerRuntime;
(function (PlayerRuntime) {
    /**
     * Emulate Adobe AIR.
     */
    PlayerRuntime["AIR"] = "air";
    /**
     * Emulate Adobe Flash Player.
     */
    PlayerRuntime["FlashPlayer"] = "flashPlayer";
})(PlayerRuntime || (PlayerRuntime = {}));
/**
 * The handling mode of links opening a new website.
 */
export var OpenURLMode;
(function (OpenURLMode) {
    /**
     * Allow all links to open a new website.
     */
    OpenURLMode["Allow"] = "allow";
    /**
     * A confirmation dialog opens with every link trying to open a new website.
     */
    OpenURLMode["Confirm"] = "confirm";
    /**
     * Deny all links to open a new website.
     */
    OpenURLMode["Deny"] = "deny";
})(OpenURLMode || (OpenURLMode = {}));
/**
 * The networking API access mode of the Ruffle player.
 */
export var NetworkingAccessMode;
(function (NetworkingAccessMode) {
    /**
     * All networking APIs are permitted in the SWF file.
     */
    NetworkingAccessMode["All"] = "all";
    /**
     * The SWF file may not call browser navigation or browser interaction APIs.
     *
     * The APIs navigateToURL(), fscommand() and ExternalInterface.call() are
     * prevented in this mode.
     */
    NetworkingAccessMode["Internal"] = "internal";
    /**
     * The SWF file may not call browser navigation or browser interaction APIs
     * and it cannot use any SWF-to-SWF communication APIs.
     *
     * Additionally to the ones in internal mode, the APIs sendToURL(),
     * FileReference.download(), FileReference.upload(), Loader.load(),
     * LocalConnection.connect(), LocalConnection.send(), NetConnection.connect(),
     * NetStream.play(), Security.loadPolicyFile(), SharedObject.getLocal(),
     * SharedObject.getRemote(), Socket.connect(), Sound.load(), URLLoader.load(),
     * URLStream.load() and XMLSocket.connect() are prevented in this mode.
     *
     * This mode is not implemented yet.
     */
    NetworkingAccessMode["None"] = "none";
})(NetworkingAccessMode || (NetworkingAccessMode = {}));
