import { getProperty, copyToAudioBufferInterleaved } from './ruffle-imports';

const lAudioContext = (typeof AudioContext !== 'undefined' ? AudioContext : (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : undefined));
let wasm;

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let cachedFloat64Memory0 = null;

function getFloat64Memory0() {
    if (cachedFloat64Memory0 === null || cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

let cachedBigInt64Memory0 = null;

function getBigInt64Memory0() {
    if (cachedBigInt64Memory0 === null || cachedBigInt64Memory0.byteLength === 0) {
        cachedBigInt64Memory0 = new BigInt64Array(wasm.memory.buffer);
    }
    return cachedBigInt64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_3.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_54(arg0, arg1, arg2) {
    wasm.closure535_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_63(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures__invoke0_mut__h7fd47b877a882b3b(arg0, arg1);
}

function __wbg_adapter_66(arg0, arg1, arg2) {
    wasm.wasm_bindgen__convert__closures__invoke1_mut__hbcefae22b2764867(arg0, arg1, arg2);
}

function __wbg_adapter_71(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7793c37b133eb84b(arg0, arg1);
}

function __wbg_adapter_74(arg0, arg1, arg2) {
    wasm.closure2058_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_79(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9cb8ac78234b63be(arg0, arg1);
}

function __wbg_adapter_84(arg0, arg1, arg2) {
    wasm.closure5566_externref_shim(arg0, arg1, arg2);
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_2.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addToExternrefTable0(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

let cachedFloat32Memory0 = null;

function getFloat32Memory0() {
    if (cachedFloat32Memory0 === null || cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

function getArrayI32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getInt32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedUint8ClampedMemory0 = null;

function getUint8ClampedMemory0() {
    if (cachedUint8ClampedMemory0 === null || cachedUint8ClampedMemory0.byteLength === 0) {
        cachedUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64Memory0().subarray(ptr / 8, ptr / 8 + len);
}
function __wbg_adapter_1114(arg0, arg1, arg2, arg3) {
    wasm.closure9315_externref_shim(arg0, arg1, arg2, arg3);
}

/**
* An opaque handle to a `RuffleInstance` inside the pool.
*
* This type is exported to JS, and is used to interact with the library.
*/
export class Ruffle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ruffle.prototype);
        obj.__wbg_ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ruffle_free(ptr);
    }
    /**
    * @param {HTMLElement} parent
    * @param {any} js_player
    * @param {any} config
    */
    constructor(parent, js_player, config) {
        const ret = wasm.ruffle_new(parent, js_player, config);
        return ret;
    }
    /**
    * Stream an arbitrary movie file from (presumably) the Internet.
    *
    * This method should only be called once per player.
    *
    * `parameters` are *extra* parameters to set on the LoaderInfo -
    * parameters from `movie_url` query parameters will be automatically added.
    * @param {string} movie_url
    * @param {any} parameters
    */
    stream_from(movie_url, parameters) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(movie_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.ruffle_stream_from(retptr, this.__wbg_ptr, ptr0, len0, parameters);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Play an arbitrary movie on this instance.
    *
    * This method should only be called once per player.
    * @param {Uint8Array} swf_data
    * @param {any} parameters
    * @param {string} swf_name
    */
    load_data(swf_data, parameters, swf_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(swf_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.ruffle_load_data(retptr, this.__wbg_ptr, swf_data, parameters, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            if (r1) {
                throw takeFromExternrefTable0(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    */
    play() {
        wasm.ruffle_play(this.__wbg_ptr);
    }
    /**
    */
    pause() {
        wasm.ruffle_pause(this.__wbg_ptr);
    }
    /**
    * @returns {boolean}
    */
    is_playing() {
        const ret = wasm.ruffle_is_playing(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
    * @returns {number}
    */
    volume() {
        const ret = wasm.ruffle_volume(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} value
    */
    set_volume(value) {
        wasm.ruffle_set_volume(this.__wbg_ptr, value);
    }
    /**
    * @returns {any}
    */
    renderer_debug_info() {
        const ret = wasm.ruffle_renderer_debug_info(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {any}
    */
    renderer_name() {
        const ret = wasm.ruffle_renderer_name(this.__wbg_ptr);
        return ret;
    }
    /**
    * @returns {any}
    */
    prepare_context_menu() {
        const ret = wasm.ruffle_prepare_context_menu(this.__wbg_ptr);
        return ret;
    }
    /**
    * @param {number} index
    */
    run_context_menu_callback(index) {
        wasm.ruffle_run_context_menu_callback(this.__wbg_ptr, index);
    }
    /**
    * @param {boolean} is_fullscreen
    */
    set_fullscreen(is_fullscreen) {
        wasm.ruffle_set_fullscreen(this.__wbg_ptr, is_fullscreen);
    }
    /**
    */
    clear_custom_menu_items() {
        wasm.ruffle_clear_custom_menu_items(this.__wbg_ptr);
    }
    /**
    */
    destroy() {
        wasm.ruffle_destroy(this.__wbg_ptr);
    }
    /**
    * @param {string} font_name
    * @param {Uint8Array} data
    */
    add_font(font_name, data) {
        const ptr0 = passStringToWasm0(font_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.ruffle_add_font(this.__wbg_ptr, ptr0, len0, data);
    }
    /**
    * @param {string} default_name
    * @param {any[]} fonts
    */
    set_default_font(default_name, fonts) {
        const ptr0 = passStringToWasm0(default_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(fonts, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        wasm.ruffle_set_default_font(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
    * @param {string} name
    * @param {any[]} args
    * @returns {any}
    */
    call_exposed_callback(name, args) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayJsValueToWasm0(args, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.ruffle_call_exposed_callback(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        return ret;
    }
    /**
    * @param {any} observer
    */
    set_trace_observer(observer) {
        wasm.ruffle_set_trace_observer(this.__wbg_ptr, observer);
    }
    /**
    * Returns the web AudioContext used by this player.
    * Returns `None` if the audio backend does not use Web Audio.
    * @returns {AudioContext | undefined}
    */
    audio_context() {
        const ret = wasm.ruffle_audio_context(this.__wbg_ptr);
        return ret;
    }
    /**
    * Returns whether the `simd128` target feature was enabled at build time.
    * This is intended to discriminate between the two WebAssembly module
    * versions, one of which uses WebAssembly extensions, and the other one
    * being "vanilla". `simd128` is used as proxy for most extensions, since
    * no other WebAssembly target feature is exposed to `cfg!`.
    * @returns {boolean}
    */
    static is_wasm_simd_used() {
        const ret = wasm.ruffle_is_wasm_simd_used();
        return ret !== 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_setMetadata_128bd20648a12d07 = function(arg0, arg1) {
        arg0.setMetadata(arg1);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_getProperty_af1b259e02b39917 = function() { return handleError(function (arg0, arg1) {
        const ret = getProperty(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_onCallbackAvailable_d54d3847055a0720 = function(arg0, arg1, arg2) {
        arg0.onCallbackAvailable(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_onFSCommand_68fd9326a1eb7ff5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.onFSCommand(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = arg0 === null;
        return ret;
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbg_panic_52092d3d09d11787 = function(arg0, arg1) {
        arg0.panic(arg1);
    };
    imports.wbg.__wbg_displayRootMovieDownloadFailedMessage_ed4ad3ae9522c8a3 = function(arg0) {
        arg0.displayRootMovieDownloadFailedMessage();
    };
    imports.wbg.__wbg_displayMessage_6b8a0011f836541f = function(arg0, arg1, arg2) {
        arg0.displayMessage(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_setFullscreen_85ac797b8823b727 = function() { return handleError(function (arg0, arg1) {
        arg0.setFullscreen(arg1 !== 0);
    }, arguments) };
    imports.wbg.__wbg_openVirtualKeyboard_e0659b8d0c7b81ed = function(arg0) {
        arg0.openVirtualKeyboard();
    };
    imports.wbg.__wbg_isVirtualKeyboardFocused_1719ab4ec034b0ab = function(arg0) {
        const ret = arg0.isVirtualKeyboardFocused();
        return ret;
    };
    imports.wbg.__wbg_displayUnsupportedVideo_619cdc62d232655a = function(arg0, arg1, arg2) {
        arg0.displayUnsupportedVideo(getStringFromWasm0(arg1, arg2));
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_ruffle_new = function(arg0) {
        const ret = Ruffle.__wrap(arg0);
        return ret;
    };
    imports.wbg.__wbg_copyToAudioBufferInterleaved_efb71b16faf5adb2 = function(arg0, arg1, arg2) {
        copyToAudioBufferInterleaved(arg0, getArrayF32FromWasm0(arg1, arg2));
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(arg0) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = arg0 === arg1;
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = arg0 == arg1;
        return ret;
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +arg0;
        return ret;
    };
    imports.wbg.__wbg_String_389b54bd9d25375f = function(arg0, arg1) {
        const ret = String(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getwithrefkey_4a92a5eca60879b9 = function(arg0, arg1) {
        const ret = arg0[arg1];
        return ret;
    };
    imports.wbg.__wbg_set_9182712abebf82ef = function(arg0, arg1, arg2) {
        arg0[arg1] = arg2;
    };
    imports.wbg.__wbg_log_c9486ca5d8e2cbe8 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_log_aba5996d9bde071f = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_mark_40e050a77cc39fea = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_measure_aa7a73f17813f708 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        let deferred0_0;
        let deferred0_1;
        let deferred1_0;
        let deferred1_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            deferred1_0 = arg2;
            deferred1_1 = arg3;
            performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }, arguments) };
    imports.wbg.__wbg_queueMicrotask_4d890031a6a5a50c = typeof queueMicrotask == 'function' ? queueMicrotask : notDefined('queueMicrotask');
    imports.wbg.__wbg_queueMicrotask_adae4bc085237231 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_performance_eeefc685c9bc38b4 = function(arg0) {
        const ret = arg0.performance;
        return ret;
    };
    imports.wbg.__wbg_now_e0d8ec93dd25766a = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_crypto_58f13aa23ffcb166 = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_process_5b786e71d465a513 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_versions_c2ab80650590b6a2 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbg_node_523d7bd03ef69fba = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_msCrypto_abcb1295e768d1f2 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_require_2784e593a4674877 = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_a0d98aa11c81fe89 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_504510b5564925af = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_2a0a9b7be3acc66a = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGL2RenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_beginQuery_91a71d14184dc3b1 = function(arg0, arg1, arg2) {
        arg0.beginQuery(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindBufferRange_d9f0a9fc3adda248 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.bindBufferRange(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_bindSampler_d6c4782741c69639 = function(arg0, arg1, arg2) {
        arg0.bindSampler(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindVertexArray_7b37e9d04dfd27d9 = function(arg0, arg1) {
        arg0.bindVertexArray(arg1);
    };
    imports.wbg.__wbg_blitFramebuffer_df3bca038546840e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.blitFramebuffer(arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0);
    };
    imports.wbg.__wbg_bufferData_7afee98828aad464 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_a05a44a5492e757f = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferSubData_07b03f17d75b6db7 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_clearBufferfi_d57bee264d59476a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferfi(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearBufferfv_ddf1d2c0a5f293c5 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferfv(arg1 >>> 0, arg2, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clearBufferiv_e26fb1758242f7f4 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferiv(arg1 >>> 0, arg2, getArrayI32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clearBufferuiv_75891c672ddef82a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearBufferuiv(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_clientWaitSync_31956a1ff24ab2d7 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.clientWaitSync(arg1, arg2 >>> 0, arg3 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_compressedTexSubImage2D_bc2325e36c328ef3 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8, arg9);
    };
    imports.wbg.__wbg_compressedTexSubImage2D_b9e80ce57234bf68 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
    };
    imports.wbg.__wbg_compressedTexSubImage3D_e237c5dd8b328f82 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10, arg11);
    };
    imports.wbg.__wbg_compressedTexSubImage3D_fa81691b7cb3b7e4 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.compressedTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10);
    };
    imports.wbg.__wbg_copyBufferSubData_926f5ccd6e693b1f = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_copyTexSubImage3D_d694f427199991b8 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.copyTexSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
    };
    imports.wbg.__wbg_createQuery_3a315cf1eec44e3d = function(arg0) {
        const ret = arg0.createQuery();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createSampler_3a2ddaedd95dc2c5 = function(arg0) {
        const ret = arg0.createSampler();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArray_7466a685c3b93a65 = function(arg0) {
        const ret = arg0.createVertexArray();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_deleteQuery_d51a96512c6c3f3f = function(arg0, arg1) {
        arg0.deleteQuery(arg1);
    };
    imports.wbg.__wbg_deleteSampler_e33ef80c17eb0896 = function(arg0, arg1) {
        arg0.deleteSampler(arg1);
    };
    imports.wbg.__wbg_deleteSync_3e63862ea7783216 = function(arg0, arg1) {
        arg0.deleteSync(arg1);
    };
    imports.wbg.__wbg_deleteVertexArray_56114a4faffe5e22 = function(arg0, arg1) {
        arg0.deleteVertexArray(arg1);
    };
    imports.wbg.__wbg_drawArraysInstanced_f7080bf0ad1d976e = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawArraysInstanced(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_drawBuffers_770b4e7949774930 = function(arg0, arg1) {
        arg0.drawBuffers(arg1);
    };
    imports.wbg.__wbg_drawElementsInstanced_1f828577186777cb = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_endQuery_7f4678342575164a = function(arg0, arg1) {
        arg0.endQuery(arg1 >>> 0);
    };
    imports.wbg.__wbg_fenceSync_88242349a578d268 = function(arg0, arg1, arg2) {
        const ret = arg0.fenceSync(arg1 >>> 0, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_framebufferTextureLayer_3776751a08a004cd = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTextureLayer(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_getBufferSubData_3d5a446fc6edc0d6 = function(arg0, arg1, arg2, arg3) {
        arg0.getBufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_getIndexedParameter_498208e84138d6d0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getIndexedParameter(arg1 >>> 0, arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getSyncParameter_268f427e8d9f123e = function(arg0, arg1, arg2) {
        const ret = arg0.getSyncParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getUniformBlockIndex_bdf0666cfd18218e = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformBlockIndex(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_invalidateFramebuffer_233280f8e97054a6 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.invalidateFramebuffer(arg1 >>> 0, arg2);
    }, arguments) };
    imports.wbg.__wbg_readBuffer_908a6eccf79eb471 = function(arg0, arg1) {
        arg0.readBuffer(arg1 >>> 0);
    };
    imports.wbg.__wbg_readPixels_070533492e105754 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_d3c0e1ee54deb785 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_renderbufferStorageMultisample_77d1555e1b4be5d5 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.renderbufferStorageMultisample(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_samplerParameterf_726502cef2fc6dff = function(arg0, arg1, arg2, arg3) {
        arg0.samplerParameterf(arg1, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_samplerParameteri_d0f51895de24bcbb = function(arg0, arg1, arg2, arg3) {
        arg0.samplerParameteri(arg1, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texImage2D_c2a2f1076b5318d1 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
    }, arguments) };
    imports.wbg.__wbg_texStorage2D_612a56ff2dc6ac9e = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.texStorage2D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_texStorage3D_102ea8c301d9573e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.texStorage3D(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_texSubImage2D_be9f61a79f57b819 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_8694c2fdf6ffae77 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_09f65ee13c9715c2 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_586bd03abd8b9645 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_009f28c178ac0ef3 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_c81838d3b14e2574 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_1629275aaeddba7f = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_55f32eefc1c80c07 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_b3b3c1e1aaaa99a9 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_texSubImage3D_4491b14dacde659b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10, arg11) {
        arg0.texSubImage3D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9 >>> 0, arg10 >>> 0, arg11);
    }, arguments) };
    imports.wbg.__wbg_uniform2fv_c9bafe596aaa6f96 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2iv_c44d289b86e7b9c0 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3fv_7c6cc849b0150aaa = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3iv_d92618b7fac63d5f = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4fv_4aa6ac4f94369a8f = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4iv_7b54b6a063120eb2 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformBlockBinding_efdd3c56716c6289 = function(arg0, arg1, arg2, arg3) {
        arg0.uniformBlockBinding(arg1, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_uniformMatrix2fv_aaecec3c7496646f = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix3fv_8ebebb0a689c27ea = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix4fv_674d03cda2d50ccc = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_vertexAttribDivisor_938fb64827607dbe = function(arg0, arg1, arg2) {
        arg0.vertexAttribDivisor(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_vertexAttribIPointer_12bfde6cf8b7b821 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.vertexAttribIPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_activeTexture_713ce7d3e753740f = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_184a61d345c20d42 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_a0055fe364603e72 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindFramebuffer_80ab0501951cc2c3 = function(arg0, arg1, arg2) {
        arg0.bindFramebuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindRenderbuffer_248119e9b6532f19 = function(arg0, arg1, arg2) {
        arg0.bindRenderbuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_ba764bb08be120f7 = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_blendColor_bd7597cf4f926625 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_blendEquation_e933afa2d360ea3b = function(arg0, arg1) {
        arg0.blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_821c15a65234ac9e = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFunc_f148dd374b130586 = function(arg0, arg1, arg2) {
        arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_285a70ec8276ccab = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_colorMask_048d9f7d86363300 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_710b082356f5014b = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_copyTexSubImage2D_bc4fe74768b6add0 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    };
    imports.wbg.__wbg_createBuffer_210de590ff501232 = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createFramebuffer_66918f52f84fb0a9 = function(arg0) {
        const ret = arg0.createFramebuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_36349c11c5d787f1 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createRenderbuffer_6d6e37cbb502ca33 = function(arg0) {
        const ret = arg0.createRenderbuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_a56f470ffa1c92a5 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_0a5d95233724c9fb = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_cullFace_d2f78f39007f1d5d = function(arg0, arg1) {
        arg0.cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_3129e4f30c465a14 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteFramebuffer_33112863fa4f3eb0 = function(arg0, arg1) {
        arg0.deleteFramebuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_100d1c04b7f0f6ee = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteRenderbuffer_5229b7175bb0b009 = function(arg0, arg1) {
        arg0.deleteRenderbuffer(arg1);
    };
    imports.wbg.__wbg_deleteShader_40389978f329df9f = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_ad998c535ddaaf67 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_depthFunc_aa8fdb5bf66ce5dc = function(arg0, arg1) {
        arg0.depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_depthMask_03551bf1079ca4f3 = function(arg0, arg1) {
        arg0.depthMask(arg1 !== 0);
    };
    imports.wbg.__wbg_depthRange_ded9f852ad909448 = function(arg0, arg1, arg2) {
        arg0.depthRange(arg1, arg2);
    };
    imports.wbg.__wbg_disable_483aff0769a6f791 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_0c9e77abfba9ee15 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_ac75b6b4a565dfde = function(arg0, arg1, arg2, arg3) {
        arg0.drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_enable_c5caba1636ec3c96 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_0424d3842911d8b6 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_framebufferRenderbuffer_6b4d1a1c53ccc57d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_framebufferTexture2D_f8b0567baae853d2 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_frontFace_a08d3e57a0667c73 = function(arg0, arg1) {
        arg0.frontFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_getActiveUniform_4f96fab0067ee961 = function(arg0, arg1, arg2) {
        const ret = arg0.getActiveUniform(arg1, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getError_2a7bd3d31e0d4a22 = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getExtension_b32d1f4b44a2464b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getParameter_92e1c06daec0a5db = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_5caeb981d27a790c = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getProgramParameter_69a29687a127f713 = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderInfoLog_e78ccbd4507b9d0c = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getShaderParameter_033044aa2910ba65 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getSupportedExtensions_24ca3063e6cb52dc = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getUniformLocation_50b6838495678a49 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_linkProgram_79a9e7719a86a93e = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_pixelStorei_b4b6c5d89e9b5f96 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_polygonOffset_f7ac1393deab0d93 = function(arg0, arg1, arg2) {
        arg0.polygonOffset(arg1, arg2);
    };
    imports.wbg.__wbg_renderbufferStorage_14a5ac06c7f68729 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_c1bf95c48721deac = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_shaderSource_f58b7f19ccf7f292 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_stencilFuncSeparate_639e870ff536309e = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilMask_9a8f03321c1dea66 = function(arg0, arg1) {
        arg0.stencilMask(arg1 >>> 0);
    };
    imports.wbg.__wbg_stencilMaskSeparate_a5a7c370cd12a043 = function(arg0, arg1, arg2) {
        arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_stencilOpSeparate_497a2305c23d697a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_texParameteri_31d32c2b86548f8e = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1f_0c8a4e0444282098 = function(arg0, arg1, arg2) {
        arg0.uniform1f(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_a949331c579124f5 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform4f_998813a169b13f40 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_useProgram_45855699f032d49a = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_vertexAttribPointer_7be57c972fbee1d0 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_146f8499414eebc9 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_instanceof_Window_3e5cd1f48c152d01 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_document_d609202d16c38224 = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_location_176c34e89c2c9d80 = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_navigator_96ba491902f8f083 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_devicePixelRatio_964a528c661f5575 = function(arg0) {
        const ret = arg0.devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_localStorage_8c507fd281456944 = function() { return handleError(function (arg0) {
        const ret = arg0.localStorage;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_confirm_1c06783e8e1a3b07 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.confirm(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_focus_ecb3c5c45d2bc67c = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_open_1526872b77d837c5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_cb9c6f65eaa83d76 = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_requestAnimationFrame_74309aadebde12fa = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_fetch_6c415b3a07763878 = function(arg0, arg1) {
        const ret = arg0.fetch(arg1);
        return ret;
    };
    imports.wbg.__wbg_setid_26cf25dc305dcc43 = function(arg0, arg1, arg2) {
        arg0.id = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_clientWidth_eca2065ae6dd9dcd = function(arg0) {
        const ret = arg0.clientWidth;
        return ret;
    };
    imports.wbg.__wbg_clientHeight_530993c2aa871aaf = function(arg0) {
        const ret = arg0.clientHeight;
        return ret;
    };
    imports.wbg.__wbg_setinnerHTML_ce0d6527ce4086f2 = function(arg0, arg1, arg2) {
        arg0.innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_querySelector_efbef0bce19ae6c9 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_releasePointerCapture_92157e89415e8db2 = function() { return handleError(function (arg0, arg1) {
        arg0.releasePointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_e7b72a5e7cfcb5a3 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setAttributeNS_f0b9b213840a56ac = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setAttributeNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4), getStringFromWasm0(arg5, arg6));
    }, arguments) };
    imports.wbg.__wbg_setPointerCapture_ba1b525b85454761 = function() { return handleError(function (arg0, arg1) {
        arg0.setPointerCapture(arg1);
    }, arguments) };
    imports.wbg.__wbg_remove_0d26d36fd4f25c4e = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_body_64abc9aba1891e91 = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createElement_fdd5c113cb84539e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createElementNS_524b05a6070757b6 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createElementNS(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_querySelector_c72dce5ac4b6bc3e = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_9bf60ea8a362e5e4 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_374cbfd2bbc19ccf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_addEventListener_0db99e77c776d7b3 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_dispatchEvent_40c3472e9e4dcf5e = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.dispatchEvent(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_66ee1536a0b32c11 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_9ece7e86d1135657 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_name_bbf9c43b9611377a = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_lastModified_435cb62cf983296f = function(arg0) {
        const ret = arg0.lastModified;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlDocument_ef158f8a3ac2b493 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLDocument;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_execCommand_cdbf492982bc5595 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.execCommand(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_pointerId_32f8345c9e0f0ed8 = function(arg0) {
        const ret = arg0.pointerId;
        return ret;
    };
    imports.wbg.__wbg_readyState_c8f9a5deaec3bb41 = function(arg0) {
        const ret = arg0.readyState;
        return ret;
    };
    imports.wbg.__wbg_setbinaryType_68fc3c6feda7310c = function(arg0, arg1) {
        arg0.binaryType = arg1;
    };
    imports.wbg.__wbg_new_2575c598b4006174 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_328b8b803521cbdd = function() { return handleError(function (arg0) {
        arg0.close();
    }, arguments) };
    imports.wbg.__wbg_send_5bf3f962e9ffe0f6 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_send_2ba7d32fcb03b9a4 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.send(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlElement_55a0f0f0f0f0118e = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setinnerText_47d4c1467f41881d = function(arg0, arg1, arg2) {
        arg0.innerText = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_style_97c680a5cbdf49cd = function(arg0) {
        const ret = arg0.style;
        return ret;
    };
    imports.wbg.__wbg_setonclick_36de38d8556bb281 = function(arg0, arg1) {
        arg0.onclick = arg1;
    };
    imports.wbg.__wbg_result_d1e1134585be8336 = function() { return handleError(function (arg0) {
        const ret = arg0.result;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setonload_7edf3cf67d18c0a2 = function(arg0, arg1) {
        arg0.onload = arg1;
    };
    imports.wbg.__wbg_new_d881a9e329b0c6bb = function() { return handleError(function () {
        const ret = new FileReader();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_readAsArrayBuffer_a3d6ef46725fe135 = function() { return handleError(function (arg0, arg1) {
        arg0.readAsArrayBuffer(arg1);
    }, arguments) };
    imports.wbg.__wbg_new_f85b35894e5d6d23 = function() { return handleError(function () {
        const ret = new Path2D();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_addPath_96feb8c666405c03 = function(arg0, arg1, arg2) {
        arg0.addPath(arg1, arg2);
    };
    imports.wbg.__wbg_bezierCurveTo_a8f590732dfb5bc2 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.bezierCurveTo(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_closePath_0aec0bc46b4096f3 = function(arg0) {
        arg0.closePath();
    };
    imports.wbg.__wbg_lineTo_65438c54fb8d82e7 = function(arg0, arg1, arg2) {
        arg0.lineTo(arg1, arg2);
    };
    imports.wbg.__wbg_moveTo_d8f8621612c093cc = function(arg0, arg1, arg2) {
        arg0.moveTo(arg1, arg2);
    };
    imports.wbg.__wbg_quadraticCurveTo_fb8fd2af29818092 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.quadraticCurveTo(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_rect_4100a1f06e58250d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.rect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_length_6398c56dda6ca34d = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_connect_7374783233c39eda = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.connect(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_size_5c0f6bdb97c23ee9 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_newwithbuffersourcesequenceandoptions_d4fb14923409c20d = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithu8arraysequenceandoptions_8a6b4effbcac4a62 = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_inverse_61e98f889bab215e = function(arg0) {
        const ret = arg0.inverse();
        return ret;
    };
    imports.wbg.__wbg_width_92a4f62e9eba6c6e = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_12290722b8519015 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_newwithsw_a11db7b3b4b19417 = function() { return handleError(function (arg0, arg1) {
        const ret = new ImageData(arg0 >>> 0, arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithu8clampedarray_37ad5b92c7f416b0 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_href_160af2ae1328d7b7 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.href;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_protocol_51a4e630fff75abb = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_assign_71a27ef88f45f078 = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.assign(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_instanceof_Response_4c3b1446206114d1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_url_83a6a4f65f7a2b38 = function(arg0, arg1) {
        const ret = arg1.url;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_redirected_8fe7aaf7e40a1256 = function(arg0) {
        const ret = arg0.redirected;
        return ret;
    };
    imports.wbg.__wbg_status_d6d47ad2837621eb = function(arg0) {
        const ret = arg0.status;
        return ret;
    };
    imports.wbg.__wbg_ok_b502b947066a9cb5 = function(arg0) {
        const ret = arg0.ok;
        return ret;
    };
    imports.wbg.__wbg_statusText_cdd819d53918687a = function(arg0, arg1) {
        const ret = arg1.statusText;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_arrayBuffer_5b2688e3dd873fed = function() { return handleError(function (arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_size_5818c0d8de7ee6ea = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_type_a25c4f950b3b3797 = function(arg0) {
        const ret = arg0.type;
        return ret;
    };
    imports.wbg.__wbg_name_89f5e0e88ec3b968 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_a_67490ac08d71fb5b = function(arg0) {
        const ret = arg0.a;
        return ret;
    };
    imports.wbg.__wbg_seta_5f8f8112c3e019ac = function(arg0, arg1) {
        arg0.a = arg1;
    };
    imports.wbg.__wbg_b_fdff8cce20441498 = function(arg0) {
        const ret = arg0.b;
        return ret;
    };
    imports.wbg.__wbg_c_541f2335759b101c = function(arg0) {
        const ret = arg0.c;
        return ret;
    };
    imports.wbg.__wbg_d_9184230ce24d030e = function(arg0) {
        const ret = arg0.d;
        return ret;
    };
    imports.wbg.__wbg_setd_fc4b61f1dd5d6fb5 = function(arg0, arg1) {
        arg0.d = arg1;
    };
    imports.wbg.__wbg_e_78476e42931c4152 = function(arg0) {
        const ret = arg0.e;
        return ret;
    };
    imports.wbg.__wbg_f_b0ef3dba394740b2 = function(arg0) {
        const ret = arg0.f;
        return ret;
    };
    imports.wbg.__wbg_new_98db60dd7d513df9 = function() { return handleError(function () {
        const ret = new DOMMatrix();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwitharray64_c11264b5c396f0dd = function() { return handleError(function (arg0, arg1) {
        const ret = new DOMMatrix(getArrayF64FromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_fba0ac991170cc00 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_width_cfc58d9656d60465 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_7591ce24118fd14a = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_1ba9072bd4001d19 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_setheight_f7ae862183d88bd5 = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_164dc98953ddbc68 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_52cc019050c5f7bd = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2), arg3);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlFormElement_7d89e65c39841f5c = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLFormElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setaction_21bbf446e322df5d = function(arg0, arg1, arg2) {
        arg0.action = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmethod_2349f96646545672 = function(arg0, arg1, arg2) {
        arg0.method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settarget_82671231acf68ef9 = function(arg0, arg1, arg2) {
        arg0.target = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_submit_263548262311ecdd = function() { return handleError(function (arg0) {
        arg0.submit();
    }, arguments) };
    imports.wbg.__wbg_ctrlKey_977280484bcead08 = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_55894418ec38c771 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_16606958d932a374 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_key_cf8022c18f47869e = function(arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_code_878e76a4ddb70157 = function(arg0, arg1) {
        const ret = arg1.code;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_data_ba3ea616b5392abf = function(arg0) {
        const ret = arg0.data;
        return ret;
    };
    imports.wbg.__wbg_width_87fb7beca76ecb6a = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_a04b04d18cb81715 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_0fb9764a1a78e3f6 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_setheight_ae3c51b7555bd27d = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_instanceof_HtmlButtonElement_edc54e80ec7dfee1 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLButtonElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlTextAreaElement_ce81e455dc21bc93 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLTextAreaElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setvalue_a11f3069fd7a1805 = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_select_22eeec5a0072d3e5 = function(arg0) {
        arg0.select();
    };
    imports.wbg.__wbg_baseURI_28e2af0de537e816 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.baseURI;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_parentElement_72e144c2e8d9e0b5 = function(arg0) {
        const ret = arg0.parentElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_appendChild_d30e6b83791d04c0 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_removeChild_942eb9c02243d84d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.removeChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_drawArraysInstancedANGLE_efcd706fccb1a8f0 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawArraysInstancedANGLE(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_drawElementsInstancedANGLE_924b2ff704a740e7 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawElementsInstancedANGLE(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_vertexAttribDivisorANGLE_c01f8657d1933822 = function(arg0, arg1, arg2) {
        arg0.vertexAttribDivisorANGLE(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_addColorStop_531494a8b7ed94b2 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.addColorStop(arg1, getStringFromWasm0(arg2, arg3));
    }, arguments) };
    imports.wbg.__wbg_wasClean_1efd9561c5671b45 = function(arg0) {
        const ret = arg0.wasClean;
        return ret;
    };
    imports.wbg.__wbg_code_72a380a2ce61a242 = function(arg0) {
        const ret = arg0.code;
        return ret;
    };
    imports.wbg.__wbg_reason_ad453a16ee68a1b9 = function(arg0, arg1) {
        const ret = arg1.reason;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_newwitheventinitdict_744eb6eb61245b7c = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new CloseEvent(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setProperty_ecf331459a4d3891 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_currentTarget_3d91c66261b52a1d = function(arg0) {
        const ret = arg0.currentTarget;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_preventDefault_7f821f72e7c6b5d4 = function(arg0) {
        arg0.preventDefault();
    };
    imports.wbg.__wbg_instanceof_HtmlAnchorElement_76fafcefedd51299 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLAnchorElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setdownload_00b872f4dec08d27 = function(arg0, arg1, arg2) {
        arg0.download = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_sethref_cee4da6cb0bbecbe = function(arg0, arg1, arg2) {
        arg0.href = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_offsetX_e8c2e5379a90ae29 = function(arg0) {
        const ret = arg0.offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_b8587366f6d36a25 = function(arg0) {
        const ret = arg0.offsetY;
        return ret;
    };
    imports.wbg.__wbg_button_cd87b6dabbde9631 = function(arg0) {
        const ret = arg0.button;
        return ret;
    };
    imports.wbg.__wbg_headers_d135d2bb8cc60413 = function(arg0) {
        const ret = arg0.headers;
        return ret;
    };
    imports.wbg.__wbg_newwithstrandinit_f581dff0d19a8b03 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_get_d318e9f4fc512c6b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1[getStringFromWasm0(arg2, arg3)];
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_set_623e41d5080ad261 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0[getStringFromWasm0(arg1, arg2)] = getStringFromWasm0(arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_delete_dcd337b67a87b9d0 = function() { return handleError(function (arg0, arg1, arg2) {
        delete arg0[getStringFromWasm0(arg1, arg2)];
    }, arguments) };
    imports.wbg.__wbg_deltaY_7d9a7eb25f83e193 = function(arg0) {
        const ret = arg0.deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_5f43eb63f3077df7 = function(arg0) {
        const ret = arg0.deltaMode;
        return ret;
    };
    imports.wbg.__wbg_setTransform_6d44ea5918785d75 = function(arg0, arg1) {
        arg0.setTransform(arg1);
    };
    imports.wbg.__wbg_clipboardData_e265cdf86dee361a = function(arg0) {
        const ret = arg0.clipboardData;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_width_eb7805903efd7fd3 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_height_aac6bd5616201da3 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_framebufferTextureMultiviewOVR_6ec7a85f3367d20e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.framebufferTextureMultiviewOVR(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_instanceof_WebGlRenderingContext_275e63499db8b412 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGLRenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_drawingBufferWidth_368cb9201721dc2a = function(arg0) {
        const ret = arg0.drawingBufferWidth;
        return ret;
    };
    imports.wbg.__wbg_drawingBufferHeight_81142285b519593f = function(arg0) {
        const ret = arg0.drawingBufferHeight;
        return ret;
    };
    imports.wbg.__wbg_bufferData_9f6454cde4211a84 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_11f5ff31cb447750 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_80aff01feac6a736 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
    };
    imports.wbg.__wbg_bufferSubData_361bebad2e19dbcf = function(arg0, arg1, arg2, arg3) {
        arg0.bufferSubData(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_compressedTexSubImage2D_6ab7ed818e5e4070 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.compressedTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8);
    };
    imports.wbg.__wbg_readPixels_1324fe35287c6abc = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_eb08115320c1e7e8 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9, arg10) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9 === 0 ? undefined : getArrayU8FromWasm0(arg9, arg10));
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_1b4def2ea95bfb31 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_uniform1fv_aeb863a2ac722b46 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform1fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2fv_dee4625f08f7518e = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform2iv_5a9f8821b3d44adb = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3fv_38d48a2561b89815 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform3iv_482ad890ad013578 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform3iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4fv_85d4d7ef22366b93 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4fv(arg1, getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform4iv_6b5d31657261615b = function(arg0, arg1, arg2, arg3) {
        arg0.uniform4iv(arg1, getArrayI32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformMatrix2fv_0ec0bb00ca04ae0f = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix2fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix3fv_6c6cf9285fa50932 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix3fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_uniformMatrix4fv_47822ae94c519f11 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.uniformMatrix4fv(arg1, arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_activeTexture_123afbbc8970fe31 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_289e2f1d24149257 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_c71ed62c7c21bed0 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindFramebuffer_33174ee82d938627 = function(arg0, arg1, arg2) {
        arg0.bindFramebuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindRenderbuffer_0c7738e79a575fdb = function(arg0, arg1, arg2) {
        arg0.bindRenderbuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_df13ba7e7ee5d984 = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_blendColor_bf0aca4480ec191b = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_blendEquation_b53426d0d37db246 = function(arg0, arg1) {
        arg0.blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_68fd537772dc05eb = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFunc_3edf09b56fbb3ffd = function(arg0, arg1, arg2) {
        arg0.blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_c3c9b0213697920c = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_clear_5e252567fe8f1763 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clearColor_253d33d2ea420d1a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_colorMask_ee95cb90b5399c1d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_df38c9b4d109df2c = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_copyTexSubImage2D_66766abee23288ff = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        arg0.copyTexSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    };
    imports.wbg.__wbg_createBuffer_993ecd2e92aabe3c = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createFramebuffer_1b0ce659f44b2562 = function(arg0) {
        const ret = arg0.createFramebuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_76ddcf5596a96a1a = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createRenderbuffer_cd7b8379638f7c64 = function(arg0) {
        const ret = arg0.createRenderbuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_25391a4dceb30291 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_fc71efc6d11fdbcb = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_cullFace_f7631a823163010d = function(arg0, arg1) {
        arg0.cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_f4994a64cdd473a3 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteFramebuffer_2cc015c1b281e8a1 = function(arg0, arg1) {
        arg0.deleteFramebuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_ffe51c2159e56aeb = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteRenderbuffer_80239f946eea133d = function(arg0, arg1) {
        arg0.deleteRenderbuffer(arg1);
    };
    imports.wbg.__wbg_deleteShader_c10a3e2a689f8115 = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_b8458a96b71a0a04 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_depthFunc_4706c33c9966db3b = function(arg0, arg1) {
        arg0.depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_depthMask_b520fa172dc50fdd = function(arg0, arg1) {
        arg0.depthMask(arg1 !== 0);
    };
    imports.wbg.__wbg_depthRange_2d0d6f020c3d5566 = function(arg0, arg1, arg2) {
        arg0.depthRange(arg1, arg2);
    };
    imports.wbg.__wbg_disable_8938e1da156fa7d9 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_b196e82af1f9e794 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_4ae5359a7c3c5279 = function(arg0, arg1, arg2, arg3) {
        arg0.drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_drawElements_44afd9c142d1e01f = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_enable_e39f53a946b9e3a0 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_f8678d164c294659 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_framebufferRenderbuffer_09dddaeb9b013985 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.framebufferRenderbuffer(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_framebufferTexture2D_8d99f62eee2d1757 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.framebufferTexture2D(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_frontFace_70a1886745b75bc9 = function(arg0, arg1) {
        arg0.frontFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_getActiveUniform_f9072bcc7895dac1 = function(arg0, arg1, arg2) {
        const ret = arg0.getActiveUniform(arg1, arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getAttribLocation_b08751ecb11d328d = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getExtension_f109da65b46fbeb8 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getParameter_fedfba9017d5fbcd = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_99334d62bea10332 = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getProgramParameter_ac16a850d3f251f3 = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderInfoLog_207d91c9201acffa = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_getShaderParameter_d5af258ca8110f13 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getUniformLocation_29cc1018d110f9f0 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_linkProgram_1ab5d0990c565f87 = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_pixelStorei_48bb580e625ac760 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_polygonOffset_784d0bd354450685 = function(arg0, arg1, arg2) {
        arg0.polygonOffset(arg1, arg2);
    };
    imports.wbg.__wbg_renderbufferStorage_fcb8aee479a5dd50 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.renderbufferStorage(arg1 >>> 0, arg2 >>> 0, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_6691dacd4ecb8e80 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_shaderSource_8581035b723a56a7 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_stencilFunc_9b4baecb1446ab2a = function(arg0, arg1, arg2, arg3) {
        arg0.stencilFunc(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_stencilFuncSeparate_3b5e111c83147417 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3, arg4 >>> 0);
    };
    imports.wbg.__wbg_stencilMask_3d9c0a4e72ab96ea = function(arg0, arg1) {
        arg0.stencilMask(arg1 >>> 0);
    };
    imports.wbg.__wbg_stencilMaskSeparate_ef23e92802d8f995 = function(arg0, arg1, arg2) {
        arg0.stencilMaskSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_stencilOp_df3817ee6e53545e = function(arg0, arg1, arg2, arg3) {
        arg0.stencilOp(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_stencilOpSeparate_62ee06a95a1f36a4 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.stencilOpSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_texParameteri_fba016345d388fd9 = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1f_97c947ddb8aeacf8 = function(arg0, arg1, arg2) {
        arg0.uniform1f(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_59bbe75ef84036ac = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform4f_83cd1c05881edfde = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.uniform4f(arg1, arg2, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_useProgram_667ebfb0fb0de4c0 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_vertexAttribPointer_1241d48b9272fc9d = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_2464c396536924a3 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_getSupportedProfiles_25ed88a41293cb71 = function(arg0) {
        const ret = arg0.getSupportedProfiles();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getData_9bb88de49d7a730d = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_set_27f236f6d7a28c29 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlInputElement_e7869aaef9cbb0e6 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setaccept_2ec9309cca225b9d = function(arg0, arg1, arg2) {
        arg0.accept = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_files_84acf164900adf19 = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_setmultiple_663fcea4a63a185b = function(arg0, arg1) {
        arg0.multiple = arg1 !== 0;
    };
    imports.wbg.__wbg_setname_1c7a46b8709a2075 = function(arg0, arg1, arg2) {
        arg0.name = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settype_e14774f24df5f349 = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setvalue_5b3442ff620b4a5d = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_createObjectURL_9fbd9480174d7f02 = function() { return handleError(function (arg0, arg1) {
        const ret = URL.createObjectURL(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_setbuffer_fcb9ea4265b72e7f = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setonended_7d1552abbde0045d = function(arg0, arg1) {
        arg0.onended = arg1;
    };
    imports.wbg.__wbg_start_88b66d1c6c29149b = function() { return handleError(function (arg0, arg1) {
        arg0.start(arg1);
    }, arguments) };
    imports.wbg.__wbg_length_c8f895dad5ec94df = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_get_6756090dbec4b385 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_videoWidth_ca6d86a1026278ad = function(arg0) {
        const ret = arg0.videoWidth;
        return ret;
    };
    imports.wbg.__wbg_videoHeight_55466ec3a1cae41c = function(arg0) {
        const ret = arg0.videoHeight;
        return ret;
    };
    imports.wbg.__wbg_platform_bb21421f654c6c90 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.platform;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    }, arguments) };
    imports.wbg.__wbg_language_4fad184e312b8f92 = function(arg0, arg1) {
        const ret = arg1.language;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbg_bindVertexArrayOES_d0c90ddc7c6360d2 = function(arg0, arg1) {
        arg0.bindVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_createVertexArrayOES_528c4cd10c985d11 = function(arg0) {
        const ret = arg0.createVertexArrayOES();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_deleteVertexArrayOES_09c67a658698d158 = function(arg0, arg1) {
        arg0.deleteVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_destination_4d44007f7d08d71b = function(arg0) {
        const ret = arg0.destination;
        return ret;
    };
    imports.wbg.__wbg_sampleRate_e93ec05848502295 = function(arg0) {
        const ret = arg0.sampleRate;
        return ret;
    };
    imports.wbg.__wbg_currentTime_d2be936586614ff4 = function(arg0) {
        const ret = arg0.currentTime;
        return ret;
    };
    imports.wbg.__wbg_new_db252a952beaf4fa = function() { return handleError(function () {
        const ret = new lAudioContext();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_close_b87bff143de234d5 = function() { return handleError(function (arg0) {
        const ret = arg0.close();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_suspend_893c39d681c66f6f = function() { return handleError(function (arg0) {
        const ret = arg0.suspend();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_444ba95ef8d4d0ff = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createBuffer(arg1 >>> 0, arg2 >>> 0, arg3);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBufferSource_2900236a9a0ed333 = function() { return handleError(function (arg0) {
        const ret = arg0.createBufferSource();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_resume_61e2f63e5d5444cd = function() { return handleError(function (arg0) {
        const ret = arg0.resume();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_CanvasRenderingContext2d_b43c8f92c4744b7b = function(arg0) {
        let result;
        try {
            result = arg0 instanceof CanvasRenderingContext2D;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_setglobalAlpha_e0ca444d935ec28d = function(arg0, arg1) {
        arg0.globalAlpha = arg1;
    };
    imports.wbg.__wbg_setglobalCompositeOperation_fe372fcb9787ddef = function() { return handleError(function (arg0, arg1, arg2) {
        arg0.globalCompositeOperation = getStringFromWasm0(arg1, arg2);
    }, arguments) };
    imports.wbg.__wbg_setstrokeStyle_1b4551387606453b = function(arg0, arg1) {
        arg0.strokeStyle = arg1;
    };
    imports.wbg.__wbg_setfillStyle_1ebd7d8f502888fa = function(arg0, arg1) {
        arg0.fillStyle = arg1;
    };
    imports.wbg.__wbg_setfilter_d28bcf74aa2e424c = function(arg0, arg1, arg2) {
        arg0.filter = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setimageSmoothingEnabled_09ef00d9928b0eb4 = function(arg0, arg1) {
        arg0.imageSmoothingEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setlineWidth_d101118d79143f42 = function(arg0, arg1) {
        arg0.lineWidth = arg1;
    };
    imports.wbg.__wbg_setlineCap_330669b74ac7930c = function(arg0, arg1, arg2) {
        arg0.lineCap = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlineJoin_c500a2f6269415a3 = function(arg0, arg1, arg2) {
        arg0.lineJoin = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setmiterLimit_ba6b996b10cbafc7 = function(arg0, arg1) {
        arg0.miterLimit = arg1;
    };
    imports.wbg.__wbg_drawImage_45d204c54b878764 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.drawImage(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clip_7568c376a8f06185 = function(arg0, arg1, arg2) {
        arg0.clip(arg1, arg2);
    };
    imports.wbg.__wbg_fill_fd7080dff7ee1b36 = function(arg0, arg1, arg2) {
        arg0.fill(arg1, arg2);
    };
    imports.wbg.__wbg_stroke_17e131a9f9d9d9bc = function(arg0, arg1) {
        arg0.stroke(arg1);
    };
    imports.wbg.__wbg_createLinearGradient_d31916a29ae282cf = function(arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.createLinearGradient(arg1, arg2, arg3, arg4);
        return ret;
    };
    imports.wbg.__wbg_createPattern_4449c740654c6232 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg0.createPattern(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_createRadialGradient_5b291849d303d31e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = arg0.createRadialGradient(arg1, arg2, arg3, arg4, arg5, arg6);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_putImageData_181e576ffc22ca61 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.putImageData(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_clearRect_d976768ba14de6f9 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_fillRect_ae135cf52671cb3d = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.fillRect(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_restore_7c05e5338cb2f7dc = function(arg0) {
        arg0.restore();
    };
    imports.wbg.__wbg_save_7222a99e05e4831b = function(arg0) {
        arg0.save();
    };
    imports.wbg.__wbg_resetTransform_f32a8099ff2909bd = function() { return handleError(function (arg0) {
        arg0.resetTransform();
    }, arguments) };
    imports.wbg.__wbg_setTransform_1e902886ef6ea486 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setTransform(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_transform_f1cd583f652d907c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.transform(arg1, arg2, arg3, arg4, arg5, arg6);
    }, arguments) };
    imports.wbg.__wbg_drawBuffersWEBGL_7b1f12f2ee6598f5 = function(arg0, arg1) {
        arg0.drawBuffersWEBGL(arg1);
    };
    imports.wbg.__wbg_get_f01601b5a68d10e3 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_length_1009b1af0c481d7b = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_new_ffc6d4d085022169 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_newnoargs_c62ea9419c21fbac = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_next_9b877f231f476d01 = function(arg0) {
        const ret = arg0.next;
        return ret;
    };
    imports.wbg.__wbg_next_6529ee0cca8d57ed = function() { return handleError(function (arg0) {
        const ret = arg0.next();
        return ret;
    }, arguments) };
    imports.wbg.__wbg_done_5fe336b092d60cf2 = function(arg0) {
        const ret = arg0.done;
        return ret;
    };
    imports.wbg.__wbg_value_0c248a78fdc8e19f = function(arg0) {
        const ret = arg0.value;
        return ret;
    };
    imports.wbg.__wbg_iterator_db7ca081358d4fb2 = function() {
        const ret = Symbol.iterator;
        return ret;
    };
    imports.wbg.__wbg_get_7b48513de5dc5ea4 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_90c26b09837aba1c = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_9fb8d994e1c0aaac = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_self_f0e34d89f33b99fd = function() { return handleError(function () {
        const ret = self.self;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_window_d3b084224f4774d7 = function() { return handleError(function () {
        const ret = window.window;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_globalThis_9caa27ff917c6860 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_global_35dfdd59a4da3e74 = function() { return handleError(function () {
        const ret = global.global;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_f2740edb12e318cd = function(arg0, arg1, arg2) {
        arg0[arg1 >>> 0] = arg2;
    };
    imports.wbg.__wbg_includes_cafdff20dd66763c = function(arg0, arg1, arg2) {
        const ret = arg0.includes(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_isArray_74fb723e24f76012 = function(arg0) {
        const ret = Array.isArray(arg0);
        return ret;
    };
    imports.wbg.__wbg_of_c36972ad824ef061 = function(arg0) {
        const ret = Array.of(arg0);
        return ret;
    };
    imports.wbg.__wbg_of_4de328e6ee3463e3 = function(arg0, arg1) {
        const ret = Array.of(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_push_901f3914205d44de = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e7d53d51371448e2 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_values_92a487cb5ee7606a = function(arg0) {
        const ret = arg0.values();
        return ret;
    };
    imports.wbg.__wbg_instanceof_Error_31ca8d97f188bfbc = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_new_a64e3f2afc2cf2f8 = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_message_55b9ea8030688597 = function(arg0) {
        const ret = arg0.message;
        return ret;
    };
    imports.wbg.__wbg_name_e5eede664187fed6 = function(arg0) {
        const ret = arg0.name;
        return ret;
    };
    imports.wbg.__wbg_toString_a44236e90224e279 = function(arg0) {
        const ret = arg0.toString();
        return ret;
    };
    imports.wbg.__wbg_apply_a6b207475e344bf9 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.apply(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_5da1969d7cd31ccd = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_isSafeInteger_f93fde0dca9820f8 = function(arg0) {
        const ret = Number.isSafeInteger(arg0);
        return ret;
    };
    imports.wbg.__wbg_getTime_9272be78826033e1 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_getTimezoneOffset_e742a5098e2c04d3 = function(arg0) {
        const ret = arg0.getTimezoneOffset();
        return ret;
    };
    imports.wbg.__wbg_new_d77fabdc03b9edd6 = function(arg0) {
        const ret = new Date(arg0);
        return ret;
    };
    imports.wbg.__wbg_new0_622c21a64f3d83ea = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_702c4990f4c3db8d = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_entries_9e2e2aa45aa5094a = function(arg0) {
        const ret = Object.entries(arg0);
        return ret;
    };
    imports.wbg.__wbg_fromEntries_5b80b07f03e6d61e = function() { return handleError(function (arg0) {
        const ret = Object.fromEntries(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_is_ff7acd231c75c0e4 = function(arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_new_60f57089c7563e81 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_1114(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return ret;
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_6e1c6553a82f85b7 = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_then_3ab08cd4fbb91ae9 = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_8371cc12cfedc5a2 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_buffer_a448f833075b71ba = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_b2f5b737836be06b = function(arg0, arg1, arg2) {
        const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_c370f7b5f8986669 = function(arg0, arg1, arg2) {
        const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_be0a0b31d480f4b2 = function(arg0, arg1, arg2) {
        const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d0482f893617af71 = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_new_8f67e318f15d7254 = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_set_2357bf09366ee480 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_length_1d25fa9e4ac21ce7 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_099217381c451830 = function(arg0, arg1, arg2) {
        const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_7a23ee7b263abe07 = function(arg0, arg1, arg2) {
        const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_fa811509d2a67254 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_bced6f43aed8c1aa = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_6c2df9e2f3028c43 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_buffer_261f267c3396c59b = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_subarray_2e940e41c0f5a1d9 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_ownKeys_7ac8657f7af0c859 = function() { return handleError(function (arg0) {
        const ret = Reflect.ownKeys(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_759f75cd92b612d2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = arg1;
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getBigInt64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? BigInt(0) : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len1;
        getInt32Memory0()[arg0 / 4 + 0] = ptr1;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1306 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_54);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1307 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_54);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1308 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_54);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1309 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_54);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1310 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_63);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1311 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_66);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1312 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 536, __wbg_adapter_54);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4031 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2014, __wbg_adapter_71);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4117 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2059, __wbg_adapter_74);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4119 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2059, __wbg_adapter_74);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4121 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2059, __wbg_adapter_79);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper4123 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 2059, __wbg_adapter_74);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper11586 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 5567, __wbg_adapter_84);
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };

    return imports;
}

function __wbg_init_memory(imports, maybe_memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedBigInt64Memory0 = null;
    cachedFloat32Memory0 = null;
    cachedFloat64Memory0 = null;
    cachedInt32Memory0 = null;
    cachedUint32Memory0 = null;
    cachedUint8Memory0 = null;
    cachedUint8ClampedMemory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(input) {
    if (wasm !== undefined) return wasm;

    if (typeof input === 'undefined') {
        input = new URL('ruffle_web-wasm_extensions_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await input, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync }
export default __wbg_init;
