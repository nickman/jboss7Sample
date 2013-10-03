/*!
 * jQuery JavaScript Library v1.6.4
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Sep 12 18:54:48 2011 -0400
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
    navigator = window.navigator,
    location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
        // The jQuery object is actually just the init constructor 'enhanced'
        return new jQuery.fn.init( selector, context, rootjQuery );
    },

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
    _$ = window.$,

    // A central reference to the root jQuery(document)
    rootjQuery,

    // A simple way to check for HTML strings or ID strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

    // Check if a string has a non-whitespace character in it
    rnotwhite = /\S/,

    // Used for trimming whitespace
    trimLeft = /^\s+/,
    trimRight = /\s+$/,

    // Check for digits
    rdigit = /\d/,

    // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

    // JSON RegExp
    rvalidchars = /^[\],:{}\s]*$/,
    rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
    rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
    rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

    // Useragent RegExp
    rwebkit = /(webkit)[ \/]([\w.]+)/,
    ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
    rmsie = /(msie) ([\w.]+)/,
    rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

    // Matches dashed string for camelizing
    rdashAlpha = /-([a-z]|[0-9])/ig,
    rmsPrefix = /^-ms-/,

    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function( all, letter ) {
        return ( letter + "" ).toUpperCase();
    },

    // Keep a UserAgent string for use with jQuery.browser
    userAgent = navigator.userAgent,

    // For matching the engine and version of the browser
    browserMatch,

    // The deferred used on DOM ready
    readyList,

    // The ready event handler
    DOMContentLoaded,

    // Save a reference to some core methods
    toString = Object.prototype.toString,
    hasOwn = Object.prototype.hasOwnProperty,
    push = Array.prototype.push,
    slice = Array.prototype.slice,
    trim = String.prototype.trim,
    indexOf = Array.prototype.indexOf,

    // [[Class]] -> type pairs
    class2type = {};

jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    init: function( selector, context, rootjQuery ) {
        var match, elem, ret, doc;

        // Handle $(""), $(null), or $(undefined)
        if ( !selector ) {
            return this;
        }

        // Handle $(DOMElement)
        if ( selector.nodeType ) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;
        }

        // The body element only exists once, optimize finding it
        if ( selector === "body" && !context && document.body ) {
            this.context = document;
            this[0] = document.body;
            this.selector = selector;
            this.length = 1;
            return this;
        }

        // Handle HTML strings
        if ( typeof selector === "string" ) {
            // Are we dealing with HTML string or an ID?
            if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [ null, selector, null ];

            } else {
                match = quickExpr.exec( selector );
            }

            // Verify a match, and that no context was specified for #id
            if ( match && (match[1] || !context) ) {

                // HANDLE: $(html) -> $(array)
                if ( match[1] ) {
                    context = context instanceof jQuery ? context[0] : context;
                    doc = (context ? context.ownerDocument || context : document);

                    // If a single string is passed in and it's a single tag
                    // just do a createElement and skip the rest
                    ret = rsingleTag.exec( selector );

                    if ( ret ) {
                        if ( jQuery.isPlainObject( context ) ) {
                            selector = [ document.createElement( ret[1] ) ];
                            jQuery.fn.attr.call( selector, context, true );

                        } else {
                            selector = [ doc.createElement( ret[1] ) ];
                        }

                    } else {
                        ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
                        selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
                    }

                    return jQuery.merge( this, selector );

                // HANDLE: $("#id")
                } else {
                    elem = document.getElementById( match[2] );

                    // Check parentNode to catch when Blackberry 4.6 returns
                    // nodes that are no longer in the document #6963
                    if ( elem && elem.parentNode ) {
                        // Handle the case where IE and Opera return items
                        // by name instead of ID
                        if ( elem.id !== match[2] ) {
                            return rootjQuery.find( selector );
                        }

                        // Otherwise, we inject the element directly into the jQuery object
                        this.length = 1;
                        this[0] = elem;
                    }

                    this.context = document;
                    this.selector = selector;
                    return this;
                }

            // HANDLE: $(expr, $(...))
            } else if ( !context || context.jquery ) {
                return (context || rootjQuery).find( selector );

            // HANDLE: $(expr, context)
            // (which is just equivalent to: $(context).find(expr)
            } else {
                return this.constructor( context ).find( selector );
            }

        // HANDLE: $(function)
        // Shortcut for document ready
        } else if ( jQuery.isFunction( selector ) ) {
            return rootjQuery.ready( selector );
        }

        if (selector.selector !== undefined) {
            this.selector = selector.selector;
            this.context = selector.context;
        }

        return jQuery.makeArray( selector, this );
    },

    // Start with an empty selector
    selector: "",

    // The current version of jQuery being used
    jquery: "1.6.4",

    // The default length of a jQuery object is 0
    length: 0,

    // The number of elements contained in the matched element set
    size: function() {
        return this.length;
    },

    toArray: function() {
        return slice.call( this, 0 );
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function( num ) {
        return num == null ?

            // Return a 'clean' array
            this.toArray() :

            // Return just the object
            ( num < 0 ? this[ this.length + num ] : this[ num ] );
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    pushStack: function( elems, name, selector ) {
        // Build a new jQuery matched element set
        var ret = this.constructor();

        if ( jQuery.isArray( elems ) ) {
            push.apply( ret, elems );

        } else {
            jQuery.merge( ret, elems );
        }

        // Add the old object onto the stack (as a reference)
        ret.prevObject = this;

        ret.context = this.context;

        if ( name === "find" ) {
            ret.selector = this.selector + (this.selector ? " " : "") + selector;
        } else if ( name ) {
            ret.selector = this.selector + "." + name + "(" + selector + ")";
        }

        // Return the newly-formed element set
        return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    each: function( callback, args ) {
        return jQuery.each( this, callback, args );
    },

    ready: function( fn ) {
        // Attach the listeners
        jQuery.bindReady();

        // Add the callback
        readyList.done( fn );

        return this;
    },

    eq: function( i ) {
        return i === -1 ?
            this.slice( i ) :
            this.slice( i, +i + 1 );
    },

    first: function() {
        return this.eq( 0 );
    },

    last: function() {
        return this.eq( -1 );
    },

    slice: function() {
        return this.pushStack( slice.apply( this, arguments ),
            "slice", slice.call(arguments).join(",") );
    },

    map: function( callback ) {
        return this.pushStack( jQuery.map(this, function( elem, i ) {
            return callback.call( elem, i, elem );
        }));
    },

    end: function() {
        return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: push,
    sort: [].sort,
    splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
        target = {};
    }

    // extend jQuery itself if only one argument is passed
    if ( length === i ) {
        target = this;
        --i;
    }

    for ( ; i < length; i++ ) {
        // Only deal with non-null/undefined values
        if ( (options = arguments[ i ]) != null ) {
            // Extend the base object
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];

                // Prevent never-ending loop
                if ( target === copy ) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray(src) ? src : [];

                    } else {
                        clone = src && jQuery.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[ name ] = jQuery.extend( deep, clone, copy );

                // Don't bring in undefined values
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

jQuery.extend({
    noConflict: function( deep ) {
        if ( window.$ === jQuery ) {
            window.$ = _$;
        }

        if ( deep && window.jQuery === jQuery ) {
            window.jQuery = _jQuery;
        }

        return jQuery;
    },

    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    holdReady: function( hold ) {
        if ( hold ) {
            jQuery.readyWait++;
        } else {
            jQuery.ready( true );
        }
    },

    // Handle when the DOM is ready
    ready: function( wait ) {
        // Either a released hold or an DOMready/load event and not yet ready
        if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( !document.body ) {
                return setTimeout( jQuery.ready, 1 );
            }

            // Remember that the DOM is ready
            jQuery.isReady = true;

            // If a normal DOM Ready event fired, decrement, and wait if need be
            if ( wait !== true && --jQuery.readyWait > 0 ) {
                return;
            }

            // If there are functions bound, to execute
            readyList.resolveWith( document, [ jQuery ] );

            // Trigger any bound ready events
            if ( jQuery.fn.trigger ) {
                jQuery( document ).trigger( "ready" ).unbind( "ready" );
            }
        }
    },

    bindReady: function() {
        if ( readyList ) {
            return;
        }

        readyList = jQuery._Deferred();

        // Catch cases where $(document).ready() is called after the
        // browser event has already occurred.
        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            return setTimeout( jQuery.ready, 1 );
        }

        // Mozilla, Opera and webkit nightlies currently support this event
        if ( document.addEventListener ) {
            // Use the handy event callback
            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

            // A fallback to window.onload, that will always work
            window.addEventListener( "load", jQuery.ready, false );

        // If IE event model is used
        } else if ( document.attachEvent ) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent( "onreadystatechange", DOMContentLoaded );

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", jQuery.ready );

            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;

            try {
                toplevel = window.frameElement == null;
            } catch(e) {}

            if ( document.documentElement.doScroll && toplevel ) {
                doScrollCheck();
            }
        }
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    isFunction: function( obj ) {
        return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray || function( obj ) {
        return jQuery.type(obj) === "array";
    },

    // A crude way of determining if an object is a window
    isWindow: function( obj ) {
        return obj && typeof obj === "object" && "setInterval" in obj;
    },

    isNaN: function( obj ) {
        return obj == null || !rdigit.test( obj ) || isNaN( obj );
    },

    type: function( obj ) {
        return obj == null ?
            String( obj ) :
            class2type[ toString.call(obj) ] || "object";
    },

    isPlainObject: function( obj ) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if ( obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
                return false;
            }
        } catch ( e ) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.

        var key;
        for ( key in obj ) {}

        return key === undefined || hasOwn.call( obj, key );
    },

    isEmptyObject: function( obj ) {
        for ( var name in obj ) {
            return false;
        }
        return true;
    },

    error: function( msg ) {
        throw msg;
    },

    parseJSON: function( data ) {
        if ( typeof data !== "string" || !data ) {
            return null;
        }

        // Make sure leading/trailing whitespace is removed (IE can't handle it)
        data = jQuery.trim( data );

        // Attempt to parse using the native JSON parser first
        if ( window.JSON && window.JSON.parse ) {
            return window.JSON.parse( data );
        }

        // Make sure the incoming data is actual JSON
        // Logic borrowed from http://json.org/json2.js
        if ( rvalidchars.test( data.replace( rvalidescape, "@" )
            .replace( rvalidtokens, "]" )
            .replace( rvalidbraces, "")) ) {

            return (new Function( "return " + data ))();

        }
        jQuery.error( "Invalid JSON: " + data );
    },

    // Cross-browser xml parsing
    parseXML: function( data ) {
        var xml, tmp;
        try {
            if ( window.DOMParser ) { // Standard
                tmp = new DOMParser();
                xml = tmp.parseFromString( data , "text/xml" );
            } else { // IE
                xml = new ActiveXObject( "Microsoft.XMLDOM" );
                xml.async = "false";
                xml.loadXML( data );
            }
        } catch( e ) {
            xml = undefined;
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            jQuery.error( "Invalid XML: " + data );
        }
        return xml;
    },

    noop: function() {},

    // Evaluates a script in a global context
    // Workarounds based on findings by Jim Driscoll
    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
    globalEval: function( data ) {
        if ( data && rnotwhite.test( data ) ) {
            // We use execScript on Internet Explorer
            // We use an anonymous function so that context is window
            // rather than jQuery in Firefox
            ( window.execScript || function( data ) {
                window[ "eval" ].call( window, data );
            } )( data );
        }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function( string ) {
        return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    },

    nodeName: function( elem, name ) {
        return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
    },

    // args is for internal usage only
    each: function( object, callback, args ) {
        var name, i = 0,
            length = object.length,
            isObj = length === undefined || jQuery.isFunction( object );

        if ( args ) {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.apply( object[ name ], args ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.apply( object[ i++ ], args ) === false ) {
                        break;
                    }
                }
            }

        // A special, fast, case for the most common use of each
        } else {
            if ( isObj ) {
                for ( name in object ) {
                    if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
                        break;
                    }
                }
            } else {
                for ( ; i < length; ) {
                    if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
                        break;
                    }
                }
            }
        }

        return object;
    },

    // Use native String.trim function wherever possible
    trim: trim ?
        function( text ) {
            return text == null ?
                "" :
                trim.call( text );
        } :

        // Otherwise use our own trimming functionality
        function( text ) {
            return text == null ?
                "" :
                text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
        },

    // results is for internal usage only
    makeArray: function( array, results ) {
        var ret = results || [];

        if ( array != null ) {
            // The window, strings (and functions) also have 'length'
            // The extra typeof function check is to prevent crashes
            // in Safari 2 (See: #3039)
            // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
            var type = jQuery.type( array );

            if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
                push.call( ret, array );
            } else {
                jQuery.merge( ret, array );
            }
        }

        return ret;
    },

    inArray: function( elem, array ) {
        if ( !array ) {
            return -1;
        }

        if ( indexOf ) {
            return indexOf.call( array, elem );
        }

        for ( var i = 0, length = array.length; i < length; i++ ) {
            if ( array[ i ] === elem ) {
                return i;
            }
        }

        return -1;
    },

    merge: function( first, second ) {
        var i = first.length,
            j = 0;

        if ( typeof second.length === "number" ) {
            for ( var l = second.length; j < l; j++ ) {
                first[ i++ ] = second[ j ];
            }

        } else {
            while ( second[j] !== undefined ) {
                first[ i++ ] = second[ j++ ];
            }
        }

        first.length = i;

        return first;
    },

    grep: function( elems, callback, inv ) {
        var ret = [], retVal;
        inv = !!inv;

        // Go through the array, only saving the items
        // that pass the validator function
        for ( var i = 0, length = elems.length; i < length; i++ ) {
            retVal = !!callback( elems[ i ], i );
            if ( inv !== retVal ) {
                ret.push( elems[ i ] );
            }
        }

        return ret;
    },

    // arg is for internal usage only
    map: function( elems, callback, arg ) {
        var value, key, ret = [],
            i = 0,
            length = elems.length,
            // jquery objects are treated as arrays
            isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

        // Go through the array, translating each of the items to their
        if ( isArray ) {
            for ( ; i < length; i++ ) {
                value = callback( elems[ i ], i, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }

        // Go through every key on the object,
        } else {
            for ( key in elems ) {
                value = callback( elems[ key ], key, arg );

                if ( value != null ) {
                    ret[ ret.length ] = value;
                }
            }
        }

        // Flatten any nested arrays
        return ret.concat.apply( [], ret );
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    proxy: function( fn, context ) {
        if ( typeof context === "string" ) {
            var tmp = fn[ context ];
            context = fn;
            fn = tmp;
        }

        // Quick check to determine if target is callable, in the spec
        // this throws a TypeError, but we will just return undefined.
        if ( !jQuery.isFunction( fn ) ) {
            return undefined;
        }

        // Simulated bind
        var args = slice.call( arguments, 2 ),
            proxy = function() {
                return fn.apply( context, args.concat( slice.call( arguments ) ) );
            };

        // Set the guid of unique handler to the same of original handler, so it can be removed
        proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

        return proxy;
    },

    // Mutifunctional method to get and set values to a collection
    // The value/s can optionally be executed if it's a function
    access: function( elems, key, value, exec, fn, pass ) {
        var length = elems.length;

        // Setting many attributes
        if ( typeof key === "object" ) {
            for ( var k in key ) {
                jQuery.access( elems, k, key[k], exec, fn, value );
            }
            return elems;
        }

        // Setting one attribute
        if ( value !== undefined ) {
            // Optionally, function values get executed if exec is true
            exec = !pass && exec && jQuery.isFunction(value);

            for ( var i = 0; i < length; i++ ) {
                fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
            }

            return elems;
        }

        // Getting an attribute
        return length ? fn( elems[0], key ) : undefined;
    },

    now: function() {
        return (new Date()).getTime();
    },

    // Use of jQuery.browser is frowned upon.
    // More details: http://docs.jquery.com/Utilities/jQuery.browser
    uaMatch: function( ua ) {
        ua = ua.toLowerCase();

        var match = rwebkit.exec( ua ) ||
            ropera.exec( ua ) ||
            rmsie.exec( ua ) ||
            ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
            [];

        return { browser: match[1] || "", version: match[2] || "0" };
    },

    sub: function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        return jQuerySub;
    },

    browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
    jQuery.browser[ browserMatch.browser ] = true;
    jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
    jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
    trimLeft = /^[\s\xA0]+/;
    trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
    DOMContentLoaded = function() {
        document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
        jQuery.ready();
    };

} else if ( document.attachEvent ) {
    DOMContentLoaded = function() {
        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if ( document.readyState === "complete" ) {
            document.detachEvent( "onreadystatechange", DOMContentLoaded );
            jQuery.ready();
        }
    };
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
    if ( jQuery.isReady ) {
        return;
    }

    try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
    } catch(e) {
        setTimeout( doScrollCheck, 1 );
        return;
    }

    // and execute any waiting functions
    jQuery.ready();
}

return jQuery;

})();


var // Promise methods
    promiseMethods = "done fail isResolved isRejected promise then always pipe".split( " " ),
    // Static reference to slice
    sliceDeferred = [].slice;

jQuery.extend({
    // Create a simple deferred (one callbacks list)
    _Deferred: function() {
        var // callbacks list
            callbacks = [],
            // stored [ context , args ]
            fired,
            // to avoid firing when already doing so
            firing,
            // flag to know if the deferred has been cancelled
            cancelled,
            // the deferred itself
            deferred  = {

                // done( f1, f2, ...)
                done: function() {
                    if ( !cancelled ) {
                        var args = arguments,
                            i,
                            length,
                            elem,
                            type,
                            _fired;
                        if ( fired ) {
                            _fired = fired;
                            fired = 0;
                        }
                        for ( i = 0, length = args.length; i < length; i++ ) {
                            elem = args[ i ];
                            type = jQuery.type( elem );
                            if ( type === "array" ) {
                                deferred.done.apply( deferred, elem );
                            } else if ( type === "function" ) {
                                callbacks.push( elem );
                            }
                        }
                        if ( _fired ) {
                            deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                        }
                    }
                    return this;
                },

                // resolve with given context and args
                resolveWith: function( context, args ) {
                    if ( !cancelled && !fired && !firing ) {
                        // make sure args are available (#8421)
                        args = args || [];
                        firing = 1;
                        try {
                            while( callbacks[ 0 ] ) {
                                callbacks.shift().apply( context, args );
                            }
                        }
                        finally {
                            fired = [ context, args ];
                            firing = 0;
                        }
                    }
                    return this;
                },

                // resolve with this as context and given arguments
                resolve: function() {
                    deferred.resolveWith( this, arguments );
                    return this;
                },

                // Has this deferred been resolved?
                isResolved: function() {
                    return !!( firing || fired );
                },

                // Cancel
                cancel: function() {
                    cancelled = 1;
                    callbacks = [];
                    return this;
                }
            };

        return deferred;
    },

    // Full fledged deferred (two callbacks list)
    Deferred: function( func ) {
        var deferred = jQuery._Deferred(),
            failDeferred = jQuery._Deferred(),
            promise;
        // Add errorDeferred methods, then and promise
        jQuery.extend( deferred, {
            then: function( doneCallbacks, failCallbacks ) {
                deferred.done( doneCallbacks ).fail( failCallbacks );
                return this;
            },
            always: function() {
                return deferred.done.apply( deferred, arguments ).fail.apply( this, arguments );
            },
            fail: failDeferred.done,
            rejectWith: failDeferred.resolveWith,
            reject: failDeferred.resolve,
            isRejected: failDeferred.isResolved,
            pipe: function( fnDone, fnFail ) {
                return jQuery.Deferred(function( newDefer ) {
                    jQuery.each( {
                        done: [ fnDone, "resolve" ],
                        fail: [ fnFail, "reject" ]
                    }, function( handler, data ) {
                        var fn = data[ 0 ],
                            action = data[ 1 ],
                            returned;
                        if ( jQuery.isFunction( fn ) ) {
                            deferred[ handler ](function() {
                                returned = fn.apply( this, arguments );
                                if ( returned && jQuery.isFunction( returned.promise ) ) {
                                    returned.promise().then( newDefer.resolve, newDefer.reject );
                                } else {
                                    newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                                }
                            });
                        } else {
                            deferred[ handler ]( newDefer[ action ] );
                        }
                    });
                }).promise();
            },
            // Get a promise for this deferred
            // If obj is provided, the promise aspect is added to the object
            promise: function( obj ) {
                if ( obj == null ) {
                    if ( promise ) {
                        return promise;
                    }
                    promise = obj = {};
                }
                var i = promiseMethods.length;
                while( i-- ) {
                    obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
                }
                return obj;
            }
        });
        // Make sure only one callback list will be used
        deferred.done( failDeferred.cancel ).fail( deferred.cancel );
        // Unexpose cancel
        delete deferred.cancel;
        // Call given func if any
        if ( func ) {
            func.call( deferred, deferred );
        }
        return deferred;
    },

    // Deferred helper
    when: function( firstParam ) {
        var args = arguments,
            i = 0,
            length = args.length,
            count = length,
            deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
                firstParam :
                jQuery.Deferred();
        function resolveFunc( i ) {
            return function( value ) {
                args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
                if ( !( --count ) ) {
                    // Strange bug in FF4:
                    // Values changed onto the arguments object sometimes end up as undefined values
                    // outside the $.when method. Cloning the object into a fresh array solves the issue
                    deferred.resolveWith( deferred, sliceDeferred.call( args, 0 ) );
                }
            };
        }
        if ( length > 1 ) {
            for( ; i < length; i++ ) {
                if ( args[ i ] && jQuery.isFunction( args[ i ].promise ) ) {
                    args[ i ].promise().then( resolveFunc(i), deferred.reject );
                } else {
                    --count;
                }
            }
            if ( !count ) {
                deferred.resolveWith( deferred, args );
            }
        } else if ( deferred !== firstParam ) {
            deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
        }
        return deferred.promise();
    }
});



jQuery.support = (function() {

    var div = document.createElement( "div" ),
        documentElement = document.documentElement,
        all,
        a,
        select,
        opt,
        input,
        marginDiv,
        support,
        fragment,
        body,
        testElementParent,
        testElement,
        testElementStyle,
        tds,
        events,
        eventName,
        i,
        isSupported;

    // Preliminary tests
    div.setAttribute("className", "t");
    div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";


    all = div.getElementsByTagName( "*" );
    a = div.getElementsByTagName( "a" )[ 0 ];

    // Can't get basic test support
    if ( !all || !all.length || !a ) {
        return {};
    }

    // First batch of supports tests
    select = document.createElement( "select" );
    opt = select.appendChild( document.createElement("option") );
    input = div.getElementsByTagName( "input" )[ 0 ];

    support = {
        // IE strips leading whitespace when .innerHTML is used
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName( "tbody" ).length,

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName( "link" ).length,

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        style: /top/.test( a.getAttribute("style") ),

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        opacity: /^0.55$/.test( a.style.opacity ),

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        cssFloat: !!a.style.cssFloat,

        // Make sure that if no value is specified for a checkbox
        // that it defaults to "on".
        // (WebKit defaults to "" instead)
        checkOn: ( input.value === "on" ),

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        optSelected: opt.selected,

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        getSetAttribute: div.className !== "t",

        // Will be defined later
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true
    };

    // Make sure checked status is properly cloned
    input.checked = true;
    support.noCloneChecked = input.cloneNode( true ).checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Test to see if it's possible to delete an expando from an element
    // Fails in Internet Explorer
    try {
        delete div.test;
    } catch( e ) {
        support.deleteExpando = false;
    }

    if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", function() {
            // Cloning a node shouldn't copy over any
            // bound event handlers (IE does this)
            support.noCloneEvent = false;
        });
        div.cloneNode( true ).fireEvent( "onclick" );
    }

    // Check if a radio maintains it's value
    // after being appended to the DOM
    input = document.createElement("input");
    input.value = "t";
    input.setAttribute("type", "radio");
    support.radioValue = input.value === "t";

    input.setAttribute("checked", "checked");
    div.appendChild( input );
    fragment = document.createDocumentFragment();
    fragment.appendChild( div.firstChild );

    // WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

    div.innerHTML = "";

    // Figure out if the W3C box model works as expected
    div.style.width = div.style.paddingLeft = "1px";

    body = document.getElementsByTagName( "body" )[ 0 ];
    // We use our own, invisible, body unless the body is already present
    // in which case we use a div (#9239)
    testElement = document.createElement( body ? "div" : "body" );
    testElementStyle = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        background: "none"
    };
    if ( body ) {
        jQuery.extend( testElementStyle, {
            position: "absolute",
            left: "-1000px",
            top: "-1000px"
        });
    }
    for ( i in testElementStyle ) {
        testElement.style[ i ] = testElementStyle[ i ];
    }
    testElement.appendChild( div );
    testElementParent = body || documentElement;
    testElementParent.insertBefore( testElement, testElementParent.firstChild );

    // Check if a disconnected checkbox will retain its checked
    // value of true after appended to the DOM (IE6/7)
    support.appendChecked = input.checked;

    support.boxModel = div.offsetWidth === 2;

    if ( "zoom" in div.style ) {
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        // (IE < 8 does this)
        div.style.display = "inline";
        div.style.zoom = 1;
        support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

        // Check if elements with layout shrink-wrap their children
        // (IE 6 does this)
        div.style.display = "";
        div.innerHTML = "<div style='width:4px;'></div>";
        support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
    }

    div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName( "td" );

    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    // (only IE 8 fails this test)
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Check if empty table cells still have offsetWidth/Height
    // (IE < 8 fail this test)
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
    div.innerHTML = "";

    // Check if div with explicit width and no margin-right incorrectly
    // gets computed margin-right based on width of container. For more
    // info see bug #3333
    // Fails in WebKit before Feb 2011 nightlies
    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    if ( document.defaultView && document.defaultView.getComputedStyle ) {
        marginDiv = document.createElement( "div" );
        marginDiv.style.width = "0";
        marginDiv.style.marginRight = "0";
        div.appendChild( marginDiv );
        support.reliableMarginRight =
            ( parseInt( ( document.defaultView.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
    }

    // Remove the body element we added
    testElement.innerHTML = "";
    testElementParent.removeChild( testElement );

    // Technique from Juriy Zaytsev
    // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
    // We only care about the case where non-standard event systems
    // are used, namely in IE. Short-circuiting here helps us to
    // avoid an eval call (in setAttribute) which can cause CSP
    // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
    if ( div.attachEvent ) {
        for( i in {
            submit: 1,
            change: 1,
            focusin: 1
        } ) {
            eventName = "on" + i;
            isSupported = ( eventName in div );
            if ( !isSupported ) {
                div.setAttribute( eventName, "return;" );
                isSupported = ( typeof div[ eventName ] === "function" );
            }
            support[ i + "Bubbles" ] = isSupported;
        }
    }

    // Null connected elements to avoid leaks in IE
    testElement = fragment = select = opt = body = marginDiv = div = input = null;

    return support;
})();

// Keep track of boxModel
jQuery.boxModel = jQuery.support.boxModel;




var rbrace = /^(?:\{.*\}|\[.*\])$/,
    rmultiDash = /([A-Z])/g;

jQuery.extend({
    cache: {},

    // Please use with caution
    uuid: 0,

    // Unique for each copy of jQuery on the page
    // Non-digits removed to match rinlinejQuery
    expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

    // The following elements throw uncatchable exceptions if you
    // attempt to add expando properties to them.
    noData: {
        "embed": true,
        // Ban all objects except for Flash (which handle expandos)
        "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
        "applet": true
    },

    hasData: function( elem ) {
        elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

        return !!elem && !isEmptyDataObject( elem );
    },

    data: function( elem, name, data, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache, ret,
            internalKey = jQuery.expando,
            getByName = typeof name === "string",

            // We have to handle DOM nodes and JS objects differently because IE6-7
            // can't GC object references properly across the DOM-JS boundary
            isNode = elem.nodeType,

            // Only DOM nodes need the global jQuery cache; JS object data is
            // attached directly to the object so GC can occur automatically
            cache = isNode ? jQuery.cache : elem,

            // Only defining an ID for JS objects if its cache already exists allows
            // the code to shortcut on the same path as a DOM node with no cache
            id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

        // Avoid doing any more work than we need to when trying to get data on an
        // object that has no data at all
        if ( (!id || (pvt && id && (cache[ id ] && !cache[ id ][ internalKey ]))) && getByName && data === undefined ) {
            return;
        }

        if ( !id ) {
            // Only DOM nodes need a new unique ID for each element since their data
            // ends up in the global cache
            if ( isNode ) {
                elem[ jQuery.expando ] = id = ++jQuery.uuid;
            } else {
                id = jQuery.expando;
            }
        }

        if ( !cache[ id ] ) {
            cache[ id ] = {};

            // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
            // metadata on plain JS objects when the object is serialized using
            // JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }
        }

        // An object can be passed to jQuery.data instead of a key/value pair; this gets
        // shallow copied over onto the existing cache
        if ( typeof name === "object" || typeof name === "function" ) {
            if ( pvt ) {
                cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
            } else {
                cache[ id ] = jQuery.extend(cache[ id ], name);
            }
        }

        thisCache = cache[ id ];

        // Internal jQuery data is stored in a separate object inside the object's data
        // cache in order to avoid key collisions between internal data and user-defined
        // data
        if ( pvt ) {
            if ( !thisCache[ internalKey ] ) {
                thisCache[ internalKey ] = {};
            }

            thisCache = thisCache[ internalKey ];
        }

        if ( data !== undefined ) {
            thisCache[ jQuery.camelCase( name ) ] = data;
        }

        // TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
        // not attempt to inspect the internal events object using jQuery.data, as this
        // internal data object is undocumented and subject to change.
        if ( name === "events" && !thisCache[name] ) {
            return thisCache[ internalKey ] && thisCache[ internalKey ].events;
        }

        // Check for both converted-to-camel and non-converted data property names
        // If a data property was specified
        if ( getByName ) {

            // First Try to find as-is property data
            ret = thisCache[ name ];

            // Test for null|undefined property data
            if ( ret == null ) {

                // Try to find the camelCased property
                ret = thisCache[ jQuery.camelCase( name ) ];
            }
        } else {
            ret = thisCache;
        }

        return ret;
    },

    removeData: function( elem, name, pvt /* Internal Use Only */ ) {
        if ( !jQuery.acceptData( elem ) ) {
            return;
        }

        var thisCache,

            // Reference to internal data cache key
            internalKey = jQuery.expando,

            isNode = elem.nodeType,

            // See jQuery.data for more information
            cache = isNode ? jQuery.cache : elem,

            // See jQuery.data for more information
            id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

        // If there is already no cache entry for this object, there is no
        // purpose in continuing
        if ( !cache[ id ] ) {
            return;
        }

        if ( name ) {

            thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

            if ( thisCache ) {

                // Support interoperable removal of hyphenated or camelcased keys
                if ( !thisCache[ name ] ) {
                    name = jQuery.camelCase( name );
                }

                delete thisCache[ name ];

                // If there is no data left in the cache, we want to continue
                // and let the cache object itself get destroyed
                if ( !isEmptyDataObject(thisCache) ) {
                    return;
                }
            }
        }

        // See jQuery.data for more information
        if ( pvt ) {
            delete cache[ id ][ internalKey ];

            // Don't destroy the parent cache unless the internal data object
            // had been the only thing left in it
            if ( !isEmptyDataObject(cache[ id ]) ) {
                return;
            }
        }

        var internalCache = cache[ id ][ internalKey ];

        // Browsers that fail expando deletion also refuse to delete expandos on
        // the window, but it will allow it on all other JS objects; other browsers
        // don't care
        // Ensure that `cache` is not a window object #10080
        if ( jQuery.support.deleteExpando || !cache.setInterval ) {
            delete cache[ id ];
        } else {
            cache[ id ] = null;
        }

        // We destroyed the entire user cache at once because it's faster than
        // iterating through each key, but we need to continue to persist internal
        // data if it existed
        if ( internalCache ) {
            cache[ id ] = {};
            // TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
            // metadata on plain JS objects when the object is serialized using
            // JSON.stringify
            if ( !isNode ) {
                cache[ id ].toJSON = jQuery.noop;
            }

            cache[ id ][ internalKey ] = internalCache;

        // Otherwise, we need to eliminate the expando on the node to avoid
        // false lookups in the cache for entries that no longer exist
        } else if ( isNode ) {
            // IE does not allow us to delete expando properties from nodes,
            // nor does it have a removeAttribute function on Document nodes;
            // we must handle all of these cases
            if ( jQuery.support.deleteExpando ) {
                delete elem[ jQuery.expando ];
            } else if ( elem.removeAttribute ) {
                elem.removeAttribute( jQuery.expando );
            } else {
                elem[ jQuery.expando ] = null;
            }
        }
    },

    // For internal use only.
    _data: function( elem, name, data ) {
        return jQuery.data( elem, name, data, true );
    },

    // A method for determining if a DOM node can handle the data expando
    acceptData: function( elem ) {
        if ( elem.nodeName ) {
            var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

            if ( match ) {
                return !(match === true || elem.getAttribute("classid") !== match);
            }
        }

        return true;
    }
});

jQuery.fn.extend({
    data: function( key, value ) {
        var data = null;

        if ( typeof key === "undefined" ) {
            if ( this.length ) {
                data = jQuery.data( this[0] );

                if ( this[0].nodeType === 1 ) {
                var attr = this[0].attributes, name;
                    for ( var i = 0, l = attr.length; i < l; i++ ) {
                        name = attr[i].name;

                        if ( name.indexOf( "data-" ) === 0 ) {
                            name = jQuery.camelCase( name.substring(5) );

                            dataAttr( this[0], name, data[ name ] );
                        }
                    }
                }
            }

            return data;

        } else if ( typeof key === "object" ) {
            return this.each(function() {
                jQuery.data( this, key );
            });
        }

        var parts = key.split(".");
        parts[1] = parts[1] ? "." + parts[1] : "";

        if ( value === undefined ) {
            data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

            // Try to fetch any internally stored data first
            if ( data === undefined && this.length ) {
                data = jQuery.data( this[0], key );
                data = dataAttr( this[0], key, data );
            }

            return data === undefined && parts[1] ?
                this.data( parts[0] ) :
                data;

        } else {
            return this.each(function() {
                var $this = jQuery( this ),
                    args = [ parts[0], value ];

                $this.triggerHandler( "setData" + parts[1] + "!", args );
                jQuery.data( this, key, value );
                $this.triggerHandler( "changeData" + parts[1] + "!", args );
            });
        }
    },

    removeData: function( key ) {
        return this.each(function() {
            jQuery.removeData( this, key );
        });
    }
});

function dataAttr( elem, key, data ) {
    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if ( data === undefined && elem.nodeType === 1 ) {

        var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

        data = elem.getAttribute( name );

        if ( typeof data === "string" ) {
            try {
                data = data === "true" ? true :
                data === "false" ? false :
                data === "null" ? null :
                !jQuery.isNaN( data ) ? parseFloat( data ) :
                    rbrace.test( data ) ? jQuery.parseJSON( data ) :
                    data;
            } catch( e ) {}

            // Make sure we set the data so it isn't changed later
            jQuery.data( elem, key, data );

        } else {
            data = undefined;
        }
    }

    return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
    for ( var name in obj ) {
        if ( name !== "toJSON" ) {
            return false;
        }
    }

    return true;
}




function handleQueueMarkDefer( elem, type, src ) {
    var deferDataKey = type + "defer",
        queueDataKey = type + "queue",
        markDataKey = type + "mark",
        defer = jQuery.data( elem, deferDataKey, undefined, true );
    if ( defer &&
        ( src === "queue" || !jQuery.data( elem, queueDataKey, undefined, true ) ) &&
        ( src === "mark" || !jQuery.data( elem, markDataKey, undefined, true ) ) ) {
        // Give room for hard-coded callbacks to fire first
        // and eventually mark/queue something else on the element
        setTimeout( function() {
            if ( !jQuery.data( elem, queueDataKey, undefined, true ) &&
                !jQuery.data( elem, markDataKey, undefined, true ) ) {
                jQuery.removeData( elem, deferDataKey, true );
                defer.resolve();
            }
        }, 0 );
    }
}

jQuery.extend({

    _mark: function( elem, type ) {
        if ( elem ) {
            type = (type || "fx") + "mark";
            jQuery.data( elem, type, (jQuery.data(elem,type,undefined,true) || 0) + 1, true );
        }
    },

    _unmark: function( force, elem, type ) {
        if ( force !== true ) {
            type = elem;
            elem = force;
            force = false;
        }
        if ( elem ) {
            type = type || "fx";
            var key = type + "mark",
                count = force ? 0 : ( (jQuery.data( elem, key, undefined, true) || 1 ) - 1 );
            if ( count ) {
                jQuery.data( elem, key, count, true );
            } else {
                jQuery.removeData( elem, key, true );
                handleQueueMarkDefer( elem, type, "mark" );
            }
        }
    },

    queue: function( elem, type, data ) {
        if ( elem ) {
            type = (type || "fx") + "queue";
            var q = jQuery.data( elem, type, undefined, true );
            // Speed up dequeue by getting out quickly if this is just a lookup
            if ( data ) {
                if ( !q || jQuery.isArray(data) ) {
                    q = jQuery.data( elem, type, jQuery.makeArray(data), true );
                } else {
                    q.push( data );
                }
            }
            return q || [];
        }
    },

    dequeue: function( elem, type ) {
        type = type || "fx";

        var queue = jQuery.queue( elem, type ),
            fn = queue.shift(),
            defer;

        // If the fx queue is dequeued, always remove the progress sentinel
        if ( fn === "inprogress" ) {
            fn = queue.shift();
        }

        if ( fn ) {
            // Add a progress sentinel to prevent the fx queue from being
            // automatically dequeued
            if ( type === "fx" ) {
                queue.unshift("inprogress");
            }

            fn.call(elem, function() {
                jQuery.dequeue(elem, type);
            });
        }

        if ( !queue.length ) {
            jQuery.removeData( elem, type + "queue", true );
            handleQueueMarkDefer( elem, type, "queue" );
        }
    }
});

jQuery.fn.extend({
    queue: function( type, data ) {
        if ( typeof type !== "string" ) {
            data = type;
            type = "fx";
        }

        if ( data === undefined ) {
            return jQuery.queue( this[0], type );
        }
        return this.each(function() {
            var queue = jQuery.queue( this, type, data );

            if ( type === "fx" && queue[0] !== "inprogress" ) {
                jQuery.dequeue( this, type );
            }
        });
    },
    dequeue: function( type ) {
        return this.each(function() {
            jQuery.dequeue( this, type );
        });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    delay: function( time, type ) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";

        return this.queue( type, function() {
            var elem = this;
            setTimeout(function() {
                jQuery.dequeue( elem, type );
            }, time );
        });
    },
    clearQueue: function( type ) {
        return this.queue( type || "fx", [] );
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    promise: function( type, object ) {
        if ( typeof type !== "string" ) {
            object = type;
            type = undefined;
        }
        type = type || "fx";
        var defer = jQuery.Deferred(),
            elements = this,
            i = elements.length,
            count = 1,
            deferDataKey = type + "defer",
            queueDataKey = type + "queue",
            markDataKey = type + "mark",
            tmp;
        function resolve() {
            if ( !( --count ) ) {
                defer.resolveWith( elements, [ elements ] );
            }
        }
        while( i-- ) {
            if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
                    ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
                        jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
                    jQuery.data( elements[ i ], deferDataKey, jQuery._Deferred(), true ) )) {
                count++;
                tmp.done( resolve );
            }
        }
        resolve();
        return defer.promise();
    }
});




var rclass = /[\n\t\r]/g,
    rspace = /\s+/,
    rreturn = /\r/g,
    rtype = /^(?:button|input)$/i,
    rfocusable = /^(?:button|input|object|select|textarea)$/i,
    rclickable = /^a(?:rea)?$/i,
    rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
    nodeHook, boolHook;

jQuery.fn.extend({
    attr: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.attr );
    },

    removeAttr: function( name ) {
        return this.each(function() {
            jQuery.removeAttr( this, name );
        });
    },

    prop: function( name, value ) {
        return jQuery.access( this, name, value, true, jQuery.prop );
    },

    removeProp: function( name ) {
        name = jQuery.propFix[ name ] || name;
        return this.each(function() {
            // try/catch handles cases where IE balks (such as removing a property on window)
            try {
                this[ name ] = undefined;
                delete this[ name ];
            } catch( e ) {}
        });
    },

    addClass: function( value ) {
        var classNames, i, l, elem,
            setClass, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).addClass( value.call(this, j, this.className) );
            });
        }

        if ( value && typeof value === "string" ) {
            classNames = value.split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 ) {
                    if ( !elem.className && classNames.length === 1 ) {
                        elem.className = value;

                    } else {
                        setClass = " " + elem.className + " ";

                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                                setClass += classNames[ c ] + " ";
                            }
                        }
                        elem.className = jQuery.trim( setClass );
                    }
                }
            }
        }

        return this;
    },

    removeClass: function( value ) {
        var classNames, i, l, elem, className, c, cl;

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( j ) {
                jQuery( this ).removeClass( value.call(this, j, this.className) );
            });
        }

        if ( (value && typeof value === "string") || value === undefined ) {
            classNames = (value || "").split( rspace );

            for ( i = 0, l = this.length; i < l; i++ ) {
                elem = this[ i ];

                if ( elem.nodeType === 1 && elem.className ) {
                    if ( value ) {
                        className = (" " + elem.className + " ").replace( rclass, " " );
                        for ( c = 0, cl = classNames.length; c < cl; c++ ) {
                            className = className.replace(" " + classNames[ c ] + " ", " ");
                        }
                        elem.className = jQuery.trim( className );

                    } else {
                        elem.className = "";
                    }
                }
            }
        }

        return this;
    },

    toggleClass: function( value, stateVal ) {
        var type = typeof value,
            isBool = typeof stateVal === "boolean";

        if ( jQuery.isFunction( value ) ) {
            return this.each(function( i ) {
                jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
            });
        }

        return this.each(function() {
            if ( type === "string" ) {
                // toggle individual class names
                var className,
                    i = 0,
                    self = jQuery( this ),
                    state = stateVal,
                    classNames = value.split( rspace );

                while ( (className = classNames[ i++ ]) ) {
                    // check each className given, space seperated list
                    state = isBool ? state : !self.hasClass( className );
                    self[ state ? "addClass" : "removeClass" ]( className );
                }

            } else if ( type === "undefined" || type === "boolean" ) {
                if ( this.className ) {
                    // store className if set
                    jQuery._data( this, "__className__", this.className );
                }

                // toggle whole className
                this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
            }
        });
    },

    hasClass: function( selector ) {
        var className = " " + selector + " ";
        for ( var i = 0, l = this.length; i < l; i++ ) {
            if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
                return true;
            }
        }

        return false;
    },

    val: function( value ) {
        var hooks, ret,
            elem = this[0];

        if ( !arguments.length ) {
            if ( elem ) {
                hooks = jQuery.valHooks[ elem.nodeName.toLowerCase() ] || jQuery.valHooks[ elem.type ];

                if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
                    return ret;
                }

                ret = elem.value;

                return typeof ret === "string" ?
                    // handle most common string cases
                    ret.replace(rreturn, "") :
                    // handle cases where value is null/undef or number
                    ret == null ? "" : ret;
            }

            return undefined;
        }

        var isFunction = jQuery.isFunction( value );

        return this.each(function( i ) {
            var self = jQuery(this), val;

            if ( this.nodeType !== 1 ) {
                return;
            }

            if ( isFunction ) {
                val = value.call( this, i, self.val() );
            } else {
                val = value;
            }

            // Treat null/undefined as ""; convert numbers to string
            if ( val == null ) {
                val = "";
            } else if ( typeof val === "number" ) {
                val += "";
            } else if ( jQuery.isArray( val ) ) {
                val = jQuery.map(val, function ( value ) {
                    return value == null ? "" : value + "";
                });
            }

            hooks = jQuery.valHooks[ this.nodeName.toLowerCase() ] || jQuery.valHooks[ this.type ];

            // If set returns undefined, fall back to normal setting
            if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
                this.value = val;
            }
        });
    }
});

jQuery.extend({
    valHooks: {
        option: {
            get: function( elem ) {
                // attributes.value is undefined in Blackberry 4.7 but
                // uses .value. See #6932
                var val = elem.attributes.value;
                return !val || val.specified ? elem.value : elem.text;
            }
        },
        select: {
            get: function( elem ) {
                var value,
                    index = elem.selectedIndex,
                    values = [],
                    options = elem.options,
                    one = elem.type === "select-one";

                // Nothing was selected
                if ( index < 0 ) {
                    return null;
                }

                // Loop through all the selected options
                for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
                    var option = options[ i ];

                    // Don't return options that are disabled or in a disabled optgroup
                    if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
                            (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

                        // Get the specific value for the option
                        value = jQuery( option ).val();

                        // We don't need an array for one selects
                        if ( one ) {
                            return value;
                        }

                        // Multi-Selects return an array
                        values.push( value );
                    }
                }

                // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
                if ( one && !values.length && options.length ) {
                    return jQuery( options[ index ] ).val();
                }

                return values;
            },

            set: function( elem, value ) {
                var values = jQuery.makeArray( value );

                jQuery(elem).find("option").each(function() {
                    this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
                });

                if ( !values.length ) {
                    elem.selectedIndex = -1;
                }
                return values;
            }
        }
    },

    attrFn: {
        val: true,
        css: true,
        html: true,
        text: true,
        data: true,
        width: true,
        height: true,
        offset: true
    },

    attrFix: {
        // Always normalize to ensure hook usage
        tabindex: "tabIndex"
    },

    attr: function( elem, name, value, pass ) {
        var nType = elem.nodeType;

        // don't get/set attributes on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return undefined;
        }

        if ( pass && name in jQuery.attrFn ) {
            return jQuery( elem )[ name ]( value );
        }

        // Fallback to prop when attributes are not supported
        if ( !("getAttribute" in elem) ) {
            return jQuery.prop( elem, name, value );
        }

        var ret, hooks,
            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        // Normalize the name if needed
        if ( notxml ) {
            name = jQuery.attrFix[ name ] || name;

            hooks = jQuery.attrHooks[ name ];

            if ( !hooks ) {
                // Use boolHook for boolean attributes
                if ( rboolean.test( name ) ) {
                    hooks = boolHook;

                // Use nodeHook if available( IE6/7 )
                } else if ( nodeHook ) {
                    hooks = nodeHook;
                }
            }
        }

        if ( value !== undefined ) {

            if ( value === null ) {
                jQuery.removeAttr( elem, name );
                return undefined;

            } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                elem.setAttribute( name, "" + value );
                return value;
            }

        } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
            return ret;

        } else {

            ret = elem.getAttribute( name );

            // Non-existent attributes return null, we normalize to undefined
            return ret === null ?
                undefined :
                ret;
        }
    },

    removeAttr: function( elem, name ) {
        var propName;
        if ( elem.nodeType === 1 ) {
            name = jQuery.attrFix[ name ] || name;

            jQuery.attr( elem, name, "" );
            elem.removeAttribute( name );

            // Set corresponding property to false for boolean attributes
            if ( rboolean.test( name ) && (propName = jQuery.propFix[ name ] || name) in elem ) {
                elem[ propName ] = false;
            }
        }
    },

    attrHooks: {
        type: {
            set: function( elem, value ) {
                // We can't allow the type property to be changed (since it causes problems in IE)
                if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
                    jQuery.error( "type property can't be changed" );
                } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
                    // Setting the type on a radio button after the value resets the value in IE6-9
                    // Reset value to it's default in case type is set after value
                    // This is for element creation
                    var val = elem.value;
                    elem.setAttribute( "type", value );
                    if ( val ) {
                        elem.value = val;
                    }
                    return value;
                }
            }
        },
        // Use the value property for back compat
        // Use the nodeHook for button elements in IE6/7 (#1954)
        value: {
            get: function( elem, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.get( elem, name );
                }
                return name in elem ?
                    elem.value :
                    null;
            },
            set: function( elem, value, name ) {
                if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
                    return nodeHook.set( elem, value, name );
                }
                // Does not return so that setAttribute is also used
                elem.value = value;
            }
        }
    },

    propFix: {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    },

    prop: function( elem, name, value ) {
        var nType = elem.nodeType;

        // don't get/set properties on text, comment and attribute nodes
        if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
            return undefined;
        }

        var ret, hooks,
            notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

        if ( notxml ) {
            // Fix name and attach hooks
            name = jQuery.propFix[ name ] || name;
            hooks = jQuery.propHooks[ name ];
        }

        if ( value !== undefined ) {
            if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
                return ret;

            } else {
                return (elem[ name ] = value);
            }

        } else {
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
                return ret;

            } else {
                return elem[ name ];
            }
        }
    },

    propHooks: {
        tabIndex: {
            get: function( elem ) {
                // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
                // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
                var attributeNode = elem.getAttributeNode("tabindex");

                return attributeNode && attributeNode.specified ?
                    parseInt( attributeNode.value, 10 ) :
                    rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
                        0 :
                        undefined;
            }
        }
    }
});

// Add the tabindex propHook to attrHooks for back-compat
jQuery.attrHooks.tabIndex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
    get: function( elem, name ) {
        // Align boolean attributes with corresponding properties
        // Fall back to attribute presence where some booleans are not supported
        var attrNode;
        return jQuery.prop( elem, name ) === true || ( attrNode = elem.getAttributeNode( name ) ) && attrNode.nodeValue !== false ?
            name.toLowerCase() :
            undefined;
    },
    set: function( elem, value, name ) {
        var propName;
        if ( value === false ) {
            // Remove boolean attributes when set to false
            jQuery.removeAttr( elem, name );
        } else {
            // value is true since we know at this point it's type boolean and not false
            // Set boolean attributes to the same name and set the DOM property
            propName = jQuery.propFix[ name ] || name;
            if ( propName in elem ) {
                // Only set the IDL specifically if it already exists on the element
                elem[ propName ] = true;
            }

            elem.setAttribute( name, name.toLowerCase() );
        }
        return name;
    }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !jQuery.support.getSetAttribute ) {

    // Use this for any attribute in IE6/7
    // This fixes almost every IE6/7 issue
    nodeHook = jQuery.valHooks.button = {
        get: function( elem, name ) {
            var ret;
            ret = elem.getAttributeNode( name );
            // Return undefined if nodeValue is empty string
            return ret && ret.nodeValue !== "" ?
                ret.nodeValue :
                undefined;
        },
        set: function( elem, value, name ) {
            // Set the existing or create a new attribute node
            var ret = elem.getAttributeNode( name );
            if ( !ret ) {
                ret = document.createAttribute( name );
                elem.setAttributeNode( ret );
            }
            return (ret.nodeValue = value + "");
        }
    };

    // Set width and height to auto instead of 0 on empty string( Bug #8150 )
    // This is for removals
    jQuery.each([ "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            set: function( elem, value ) {
                if ( value === "" ) {
                    elem.setAttribute( name, "auto" );
                    return value;
                }
            }
        });
    });
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
    jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
        jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
            get: function( elem ) {
                var ret = elem.getAttribute( name, 2 );
                return ret === null ? undefined : ret;
            }
        });
    });
}

if ( !jQuery.support.style ) {
    jQuery.attrHooks.style = {
        get: function( elem ) {
            // Return undefined in the case of empty string
            // Normalize to lowercase since IE uppercases css property names
            return elem.style.cssText.toLowerCase() || undefined;
        },
        set: function( elem, value ) {
            return (elem.style.cssText = "" + value);
        }
    };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
    jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
        get: function( elem ) {
            var parent = elem.parentNode;

            if ( parent ) {
                parent.selectedIndex;

                // Make sure that it also works with optgroups, see #5701
                if ( parent.parentNode ) {
                    parent.parentNode.selectedIndex;
                }
            }
            return null;
        }
    });
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[ this ] = {
            get: function( elem ) {
                // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
                return elem.getAttribute("value") === null ? "on" : elem.value;
            }
        };
    });
}
jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
        set: function( elem, value ) {
            if ( jQuery.isArray( value ) ) {
                return (elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0);
            }
        }
    });
});




var rnamespaces = /\.(.*)$/,
    rformElems = /^(?:textarea|input|select)$/i,
    rperiod = /\./g,
    rspaces = / /g,
    rescape = /[^\w\s.|`]/g,
    fcleanup = function( nm ) {
        return nm.replace(rescape, "\\$&");
    };

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

    // Bind an event to an element
    // Original by Dean Edwards
    add: function( elem, types, handler, data ) {
        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        if ( handler === false ) {
            handler = returnFalse;
        } else if ( !handler ) {
            // Fixes bug #7229. Fix recommended by jdalton
            return;
        }

        var handleObjIn, handleObj;

        if ( handler.handler ) {
            handleObjIn = handler;
            handler = handleObjIn.handler;
        }

        // Make sure that the function being executed has a unique ID
        if ( !handler.guid ) {
            handler.guid = jQuery.guid++;
        }

        // Init the element's event structure
        var elemData = jQuery._data( elem );

        // If no elemData is found then we must be trying to bind to one of the
        // banned noData elements
        if ( !elemData ) {
            return;
        }

        var events = elemData.events,
            eventHandle = elemData.handle;

        if ( !events ) {
            elemData.events = events = {};
        }

        if ( !eventHandle ) {
            elemData.handle = eventHandle = function( e ) {
                // Discard the second event of a jQuery.event.trigger() and
                // when an event is called after a page has unloaded
                return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
                    jQuery.event.handle.apply( eventHandle.elem, arguments ) :
                    undefined;
            };
        }

        // Add elem as a property of the handle function
        // This is to prevent a memory leak with non-native events in IE.
        eventHandle.elem = elem;

        // Handle multiple events separated by a space
        // jQuery(...).bind("mouseover mouseout", fn);
        types = types.split(" ");

        var type, i = 0, namespaces;

        while ( (type = types[ i++ ]) ) {
            handleObj = handleObjIn ?
                jQuery.extend({}, handleObjIn) :
                { handler: handler, data: data };

            // Namespaced event handlers
            if ( type.indexOf(".") > -1 ) {
                namespaces = type.split(".");
                type = namespaces.shift();
                handleObj.namespace = namespaces.slice(0).sort().join(".");

            } else {
                namespaces = [];
                handleObj.namespace = "";
            }

            handleObj.type = type;
            if ( !handleObj.guid ) {
                handleObj.guid = handler.guid;
            }

            // Get the current list of functions bound to this event
            var handlers = events[ type ],
                special = jQuery.event.special[ type ] || {};

            // Init the event handler queue
            if ( !handlers ) {
                handlers = events[ type ] = [];

                // Check for a special event handler
                // Only use addEventListener/attachEvent if the special
                // events handler returns false
                if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
                    // Bind the global event handler to the element
                    if ( elem.addEventListener ) {
                        elem.addEventListener( type, eventHandle, false );

                    } else if ( elem.attachEvent ) {
                        elem.attachEvent( "on" + type, eventHandle );
                    }
                }
            }

            if ( special.add ) {
                special.add.call( elem, handleObj );

                if ( !handleObj.handler.guid ) {
                    handleObj.handler.guid = handler.guid;
                }
            }

            // Add the function to the element's handler list
            handlers.push( handleObj );

            // Keep track of which events have been used, for event optimization
            jQuery.event.global[ type ] = true;
        }

        // Nullify elem to prevent memory leaks in IE
        elem = null;
    },

    global: {},

    // Detach an event or set of events from an element
    remove: function( elem, types, handler, pos ) {
        // don't do events on text and comment nodes
        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        if ( handler === false ) {
            handler = returnFalse;
        }

        var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
            elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
            events = elemData && elemData.events;

        if ( !elemData || !events ) {
            return;
        }

        // types is actually an event object here
        if ( types && types.type ) {
            handler = types.handler;
            types = types.type;
        }

        // Unbind all events for the element
        if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
            types = types || "";

            for ( type in events ) {
                jQuery.event.remove( elem, type + types );
            }

            return;
        }

        // Handle multiple events separated by a space
        // jQuery(...).unbind("mouseover mouseout", fn);
        types = types.split(" ");

        while ( (type = types[ i++ ]) ) {
            origType = type;
            handleObj = null;
            all = type.indexOf(".") < 0;
            namespaces = [];

            if ( !all ) {
                // Namespaced event handlers
                namespaces = type.split(".");
                type = namespaces.shift();

                namespace = new RegExp("(^|\\.)" +
                    jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
            }

            eventType = events[ type ];

            if ( !eventType ) {
                continue;
            }

            if ( !handler ) {
                for ( j = 0; j < eventType.length; j++ ) {
                    handleObj = eventType[ j ];

                    if ( all || namespace.test( handleObj.namespace ) ) {
                        jQuery.event.remove( elem, origType, handleObj.handler, j );
                        eventType.splice( j--, 1 );
                    }
                }

                continue;
            }

            special = jQuery.event.special[ type ] || {};

            for ( j = pos || 0; j < eventType.length; j++ ) {
                handleObj = eventType[ j ];

                if ( handler.guid === handleObj.guid ) {
                    // remove the given handler for the given type
                    if ( all || namespace.test( handleObj.namespace ) ) {
                        if ( pos == null ) {
                            eventType.splice( j--, 1 );
                        }

                        if ( special.remove ) {
                            special.remove.call( elem, handleObj );
                        }
                    }

                    if ( pos != null ) {
                        break;
                    }
                }
            }

            // remove generic event handler if no more handlers exist
            if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
                if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
                    jQuery.removeEvent( elem, type, elemData.handle );
                }

                ret = null;
                delete events[ type ];
            }
        }

        // Remove the expando if it's no longer used
        if ( jQuery.isEmptyObject( events ) ) {
            var handle = elemData.handle;
            if ( handle ) {
                handle.elem = null;
            }

            delete elemData.events;
            delete elemData.handle;

            if ( jQuery.isEmptyObject( elemData ) ) {
                jQuery.removeData( elem, undefined, true );
            }
        }
    },

    // Events that are safe to short-circuit if no handlers are attached.
    // Native DOM events should not be added, they may have inline handlers.
    customEvent: {
        "getData": true,
        "setData": true,
        "changeData": true
    },

    trigger: function( event, data, elem, onlyHandlers ) {
        // Event object or event type
        var type = event.type || event,
            namespaces = [],
            exclusive;

        if ( type.indexOf("!") >= 0 ) {
            // Exclusive events trigger only for the exact event (no namespaces)
            type = type.slice(0, -1);
            exclusive = true;
        }

        if ( type.indexOf(".") >= 0 ) {
            // Namespaced trigger; create a regexp to match event type in handle()
            namespaces = type.split(".");
            type = namespaces.shift();
            namespaces.sort();
        }

        if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
            // No jQuery handlers for this event type, and it can't have inline handlers
            return;
        }

        // Caller can pass in an Event, Object, or just an event type string
        event = typeof event === "object" ?
            // jQuery.Event object
            event[ jQuery.expando ] ? event :
            // Object literal
            new jQuery.Event( type, event ) :
            // Just the event type (string)
            new jQuery.Event( type );

        event.type = type;
        event.exclusive = exclusive;
        event.namespace = namespaces.join(".");
        event.namespace_re = new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)");

        // triggerHandler() and global events don't bubble or run the default action
        if ( onlyHandlers || !elem ) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Handle a global trigger
        if ( !elem ) {
            // TODO: Stop taunting the data cache; remove global events and always attach to document
            jQuery.each( jQuery.cache, function() {
                // internalKey variable is just used to make it easier to find
                // and potentially change this stuff later; currently it just
                // points to jQuery.expando
                var internalKey = jQuery.expando,
                    internalCache = this[ internalKey ];
                if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
                    jQuery.event.trigger( event, data, internalCache.handle.elem );
                }
            });
            return;
        }

        // Don't do events on text and comment nodes
        if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
            return;
        }

        // Clean up the event in case it is being reused
        event.result = undefined;
        event.target = elem;

        // Clone any incoming data and prepend the event, creating the handler arg list
        data = data != null ? jQuery.makeArray( data ) : [];
        data.unshift( event );

        var cur = elem,
            // IE doesn't like method names with a colon (#3533, #8272)
            ontype = type.indexOf(":") < 0 ? "on" + type : "";

        // Fire event on the current element, then bubble up the DOM tree
        do {
            var handle = jQuery._data( cur, "handle" );

            event.currentTarget = cur;
            if ( handle ) {
                handle.apply( cur, data );
            }

            // Trigger an inline bound script
            if ( ontype && jQuery.acceptData( cur ) && cur[ ontype ] && cur[ ontype ].apply( cur, data ) === false ) {
                event.result = false;
                event.preventDefault();
            }

            // Bubble up to document, then to window
            cur = cur.parentNode || cur.ownerDocument || cur === event.target.ownerDocument && window;
        } while ( cur && !event.isPropagationStopped() );

        // If nobody prevented the default action, do it now
        if ( !event.isDefaultPrevented() ) {
            var old,
                special = jQuery.event.special[ type ] || {};

            if ( (!special._default || special._default.call( elem.ownerDocument, event ) === false) &&
                !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

                // Call a native DOM method on the target with the same name name as the event.
                // Can't use an .isFunction)() check here because IE6/7 fails that test.
                // IE<9 dies on focus to hidden element (#1486), may want to revisit a try/catch.
                try {
                    if ( ontype && elem[ type ] ) {
                        // Don't re-trigger an onFOO event when we call its FOO() method
                        old = elem[ ontype ];

                        if ( old ) {
                            elem[ ontype ] = null;
                        }

                        jQuery.event.triggered = type;
                        elem[ type ]();
                    }
                } catch ( ieError ) {}

                if ( old ) {
                    elem[ ontype ] = old;
                }

                jQuery.event.triggered = undefined;
            }
        }

        return event.result;
    },

    handle: function( event ) {
        event = jQuery.event.fix( event || window.event );
        // Snapshot the handlers list since a called handler may add/remove events.
        var handlers = ((jQuery._data( this, "events" ) || {})[ event.type ] || []).slice(0),
            run_all = !event.exclusive && !event.namespace,
            args = Array.prototype.slice.call( arguments, 0 );

        // Use the fix-ed Event rather than the (read-only) native event
        args[0] = event;
        event.currentTarget = this;

        for ( var j = 0, l = handlers.length; j < l; j++ ) {
            var handleObj = handlers[ j ];

            // Triggered event must 1) be non-exclusive and have no namespace, or
            // 2) have namespace(s) a subset or equal to those in the bound event.
            if ( run_all || event.namespace_re.test( handleObj.namespace ) ) {
                // Pass in a reference to the handler function itself
                // So that we can later remove it
                event.handler = handleObj.handler;
                event.data = handleObj.data;
                event.handleObj = handleObj;

                var ret = handleObj.handler.apply( this, args );

                if ( ret !== undefined ) {
                    event.result = ret;
                    if ( ret === false ) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }

                if ( event.isImmediatePropagationStopped() ) {
                    break;
                }
            }
        }
        return event.result;
    },

    props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

    fix: function( event ) {
        if ( event[ jQuery.expando ] ) {
            return event;
        }

        // store a copy of the original event object
        // and "clone" to set read-only properties
        var originalEvent = event;
        event = jQuery.Event( originalEvent );

        for ( var i = this.props.length, prop; i; ) {
            prop = this.props[ --i ];
            event[ prop ] = originalEvent[ prop ];
        }

        // Fix target property, if necessary
        if ( !event.target ) {
            // Fixes #1925 where srcElement might not be defined either
            event.target = event.srcElement || document;
        }

        // check if target is a textnode (safari)
        if ( event.target.nodeType === 3 ) {
            event.target = event.target.parentNode;
        }

        // Add relatedTarget, if necessary
        if ( !event.relatedTarget && event.fromElement ) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        }

        // Calculate pageX/Y if missing and clientX/Y available
        if ( event.pageX == null && event.clientX != null ) {
            var eventDocument = event.target.ownerDocument || document,
                doc = eventDocument.documentElement,
                body = eventDocument.body;

            event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }

        // Add which for key events
        if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
            event.which = event.charCode != null ? event.charCode : event.keyCode;
        }

        // Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
        if ( !event.metaKey && event.ctrlKey ) {
            event.metaKey = event.ctrlKey;
        }

        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        if ( !event.which && event.button !== undefined ) {
            event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
        }

        return event;
    },

    // Deprecated, use jQuery.guid instead
    guid: 1E8,

    // Deprecated, use jQuery.proxy instead
    proxy: jQuery.proxy,

    special: {
        ready: {
            // Make sure the ready event is setup
            setup: jQuery.bindReady,
            teardown: jQuery.noop
        },

        live: {
            add: function( handleObj ) {
                jQuery.event.add( this,
                    liveConvert( handleObj.origType, handleObj.selector ),
                    jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
            },

            remove: function( handleObj ) {
                jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
            }
        },

        beforeunload: {
            setup: function( data, namespaces, eventHandle ) {
                // We only want to do this special case on windows
                if ( jQuery.isWindow( this ) ) {
                    this.onbeforeunload = eventHandle;
                }
            },

            teardown: function( namespaces, eventHandle ) {
                if ( this.onbeforeunload === eventHandle ) {
                    this.onbeforeunload = null;
                }
            }
        }
    }
};

jQuery.removeEvent = document.removeEventListener ?
    function( elem, type, handle ) {
        if ( elem.removeEventListener ) {
            elem.removeEventListener( type, handle, false );
        }
    } :
    function( elem, type, handle ) {
        if ( elem.detachEvent ) {
            elem.detachEvent( "on" + type, handle );
        }
    };

jQuery.Event = function( src, props ) {
    // Allow instantiation without the 'new' keyword
    if ( !this.preventDefault ) {
        return new jQuery.Event( src, props );
    }

    // Event object
    if ( src && src.type ) {
        this.originalEvent = src;
        this.type = src.type;

        // Events bubbling up the document may have been marked as prevented
        // by a handler lower down the tree; reflect the correct value.
        this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
            src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

    // Event type
    } else {
        this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if ( props ) {
        jQuery.extend( this, props );
    }

    // timeStamp is buggy for some events on Firefox(#3843)
    // So we won't rely on the native value
    this.timeStamp = jQuery.now();

    // Mark it as fixed
    this[ jQuery.expando ] = true;
};

function returnFalse() {
    return false;
}
function returnTrue() {
    return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
    preventDefault: function() {
        this.isDefaultPrevented = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }

        // if preventDefault exists run it on the original event
        if ( e.preventDefault ) {
            e.preventDefault();

        // otherwise set the returnValue property of the original event to false (IE)
        } else {
            e.returnValue = false;
        }
    },
    stopPropagation: function() {
        this.isPropagationStopped = returnTrue;

        var e = this.originalEvent;
        if ( !e ) {
            return;
        }
        // if stopPropagation exists run it on the original event
        if ( e.stopPropagation ) {
            e.stopPropagation();
        }
        // otherwise set the cancelBubble property of the original event to true (IE)
        e.cancelBubble = true;
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = returnTrue;
        this.stopPropagation();
    },
    isDefaultPrevented: returnFalse,
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {

    // Check if mouse(over|out) are still within the same parent element
    var related = event.relatedTarget,
        inside = false,
        eventType = event.type;

    event.type = event.data;

    if ( related !== this ) {

        if ( related ) {
            inside = jQuery.contains( this, related );
        }

        if ( !inside ) {

            jQuery.event.handle.apply( this, arguments );

            event.type = eventType;
        }
    }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
    event.type = event.data;
    jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function( orig, fix ) {
    jQuery.event.special[ orig ] = {
        setup: function( data ) {
            jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
        },
        teardown: function( data ) {
            jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
        }
    };
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

    jQuery.event.special.submit = {
        setup: function( data, namespaces ) {
            if ( !jQuery.nodeName( this, "form" ) ) {
                jQuery.event.add(this, "click.specialSubmit", function( e ) {
                    // Avoid triggering error on non-existent type attribute in IE VML (#7071)
                    var elem = e.target,
                        type = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.type : "";

                    if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
                        trigger( "submit", this, arguments );
                    }
                });

                jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
                    var elem = e.target,
                        type = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.type : "";

                    if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
                        trigger( "submit", this, arguments );
                    }
                });

            } else {
                return false;
            }
        },

        teardown: function( namespaces ) {
            jQuery.event.remove( this, ".specialSubmit" );
        }
    };

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

    var changeFilters,

    getVal = function( elem ) {
        var type = jQuery.nodeName( elem, "input" ) ? elem.type : "",
            val = elem.value;

        if ( type === "radio" || type === "checkbox" ) {
            val = elem.checked;

        } else if ( type === "select-multiple" ) {
            val = elem.selectedIndex > -1 ?
                jQuery.map( elem.options, function( elem ) {
                    return elem.selected;
                }).join("-") :
                "";

        } else if ( jQuery.nodeName( elem, "select" ) ) {
            val = elem.selectedIndex;
        }

        return val;
    },

    testChange = function testChange( e ) {
        var elem = e.target, data, val;

        if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
            return;
        }

        data = jQuery._data( elem, "_change_data" );
        val = getVal(elem);

        // the current data will be also retrieved by beforeactivate
        if ( e.type !== "focusout" || elem.type !== "radio" ) {
            jQuery._data( elem, "_change_data", val );
        }

        if ( data === undefined || val === data ) {
            return;
        }

        if ( data != null || val ) {
            e.type = "change";
            e.liveFired = undefined;
            jQuery.event.trigger( e, arguments[1], elem );
        }
    };

    jQuery.event.special.change = {
        filters: {
            focusout: testChange,

            beforedeactivate: testChange,

            click: function( e ) {
                var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

                if ( type === "radio" || type === "checkbox" || jQuery.nodeName( elem, "select" ) ) {
                    testChange.call( this, e );
                }
            },

            // Change has to be called before submit
            // Keydown will be called before keypress, which is used in submit-event delegation
            keydown: function( e ) {
                var elem = e.target, type = jQuery.nodeName( elem, "input" ) ? elem.type : "";

                if ( (e.keyCode === 13 && !jQuery.nodeName( elem, "textarea" ) ) ||
                    (e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
                    type === "select-multiple" ) {
                    testChange.call( this, e );
                }
            },

            // Beforeactivate happens also before the previous element is blurred
            // with this event you can't trigger a change event, but you can store
            // information
            beforeactivate: function( e ) {
                var elem = e.target;
                jQuery._data( elem, "_change_data", getVal(elem) );
            }
        },

        setup: function( data, namespaces ) {
            if ( this.type === "file" ) {
                return false;
            }

            for ( var type in changeFilters ) {
                jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
            }

            return rformElems.test( this.nodeName );
        },

        teardown: function( namespaces ) {
            jQuery.event.remove( this, ".specialChange" );

            return rformElems.test( this.nodeName );
        }
    };

    changeFilters = jQuery.event.special.change.filters;

    // Handle when the input is .focus()'d
    changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    // Don't pass args or remember liveFired; they apply to the donor event.
    var event = jQuery.extend( {}, args[ 0 ] );
    event.type = type;
    event.originalEvent = {};
    event.liveFired = undefined;
    jQuery.event.handle.call( elem, event );
    if ( event.isDefaultPrevented() ) {
        args[ 0 ].preventDefault();
    }
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
    jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

        // Attach a single capturing handler while someone wants focusin/focusout
        var attaches = 0;

        jQuery.event.special[ fix ] = {
            setup: function() {
                if ( attaches++ === 0 ) {
                    document.addEventListener( orig, handler, true );
                }
            },
            teardown: function() {
                if ( --attaches === 0 ) {
                    document.removeEventListener( orig, handler, true );
                }
            }
        };

        function handler( donor ) {
            // Donor event is always a native one; fix it and switch its type.
            // Let focusin/out handler cancel the donor focus/blur event.
            var e = jQuery.event.fix( donor );
            e.type = fix;
            e.originalEvent = {};
            jQuery.event.trigger( e, null, e.target );
            if ( e.isDefaultPrevented() ) {
                donor.preventDefault();
            }
        }
    });
}

jQuery.each(["bind", "one"], function( i, name ) {
    jQuery.fn[ name ] = function( type, data, fn ) {
        var handler;

        // Handle object literals
        if ( typeof type === "object" ) {
            for ( var key in type ) {
                this[ name ](key, data, type[key], fn);
            }
            return this;
        }

        if ( arguments.length === 2 || data === false ) {
            fn = data;
            data = undefined;
        }

        if ( name === "one" ) {
            handler = function( event ) {
                jQuery( this ).unbind( event, handler );
                return fn.apply( this, arguments );
            };
            handler.guid = fn.guid || jQuery.guid++;
        } else {
            handler = fn;
        }

        if ( type === "unload" && name !== "one" ) {
            this.one( type, data, fn );

        } else {
            for ( var i = 0, l = this.length; i < l; i++ ) {
                jQuery.event.add( this[i], type, handler, data );
            }
        }

        return this;
    };
});

jQuery.fn.extend({
    unbind: function( type, fn ) {
        // Handle object literals
        if ( typeof type === "object" && !type.preventDefault ) {
            for ( var key in type ) {
                this.unbind(key, type[key]);
            }

        } else {
            for ( var i = 0, l = this.length; i < l; i++ ) {
                jQuery.event.remove( this[i], type, fn );
            }
        }

        return this;
    },

    delegate: function( selector, types, data, fn ) {
        return this.live( types, data, fn, selector );
    },

    undelegate: function( selector, types, fn ) {
        if ( arguments.length === 0 ) {
            return this.unbind( "live" );

        } else {
            return this.die( types, null, fn, selector );
        }
    },

    trigger: function( type, data ) {
        return this.each(function() {
            jQuery.event.trigger( type, data, this );
        });
    },

    triggerHandler: function( type, data ) {
        if ( this[0] ) {
            return jQuery.event.trigger( type, data, this[0], true );
        }
    },

    toggle: function( fn ) {
        // Save reference to arguments for access in closure
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    },

    hover: function( fnOver, fnOut ) {
        return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    }
});

var liveMap = {
    focus: "focusin",
    blur: "focusout",
    mouseenter: "mouseover",
    mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
    jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
        var type, i = 0, match, namespaces, preType,
            selector = origSelector || this.selector,
            context = origSelector ? this : jQuery( this.context );

        if ( typeof types === "object" && !types.preventDefault ) {
            for ( var key in types ) {
                context[ name ]( key, data, types[key], selector );
            }

            return this;
        }

        if ( name === "die" && !types &&
                    origSelector && origSelector.charAt(0) === "." ) {

            context.unbind( origSelector );

            return this;
        }

        if ( data === false || jQuery.isFunction( data ) ) {
            fn = data || returnFalse;
            data = undefined;
        }

        types = (types || "").split(" ");

        while ( (type = types[ i++ ]) != null ) {
            match = rnamespaces.exec( type );
            namespaces = "";

            if ( match )  {
                namespaces = match[0];
                type = type.replace( rnamespaces, "" );
            }

            if ( type === "hover" ) {
                types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
                continue;
            }

            preType = type;

            if ( liveMap[ type ] ) {
                types.push( liveMap[ type ] + namespaces );
                type = type + namespaces;

            } else {
                type = (liveMap[ type ] || type) + namespaces;
            }

            if ( name === "live" ) {
                // bind live handler
                for ( var j = 0, l = context.length; j < l; j++ ) {
                    jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
                        { data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
                }

            } else {
                // unbind live handler
                context.unbind( "live." + liveConvert( type, selector ), fn );
            }
        }

        return this;
    };
});

function liveHandler( event ) {
    var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
        elems = [],
        selectors = [],
        events = jQuery._data( this, "events" );

    // Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
    if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
        return;
    }

    if ( event.namespace ) {
        namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
    }

    event.liveFired = this;

    var live = events.live.slice(0);

    for ( j = 0; j < live.length; j++ ) {
        handleObj = live[j];

        if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
            selectors.push( handleObj.selector );

        } else {
            live.splice( j--, 1 );
        }
    }

    match = jQuery( event.target ).closest( selectors, event.currentTarget );

    for ( i = 0, l = match.length; i < l; i++ ) {
        close = match[i];

        for ( j = 0; j < live.length; j++ ) {
            handleObj = live[j];

            if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
                elem = close.elem;
                related = null;

                // Those two events require additional checking
                if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
                    event.type = handleObj.preType;
                    related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];

                    // Make sure not to accidentally match a child element with the same selector
                    if ( related && jQuery.contains( elem, related ) ) {
                        related = elem;
                    }
                }

                if ( !related || related !== elem ) {
                    elems.push({ elem: elem, handleObj: handleObj, level: close.level });
                }
            }
        }
    }

    for ( i = 0, l = elems.length; i < l; i++ ) {
        match = elems[i];

        if ( maxLevel && match.level > maxLevel ) {
            break;
        }

        event.currentTarget = match.elem;
        event.data = match.handleObj.data;
        event.handleObj = match.handleObj;

        ret = match.handleObj.origHandler.apply( match.elem, arguments );

        if ( ret === false || event.isPropagationStopped() ) {
            maxLevel = match.level;

            if ( ret === false ) {
                stop = false;
            }
            if ( event.isImmediatePropagationStopped() ) {
                break;
            }
        }
    }

    return stop;
}

function liveConvert( type, selector ) {
    return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspaces, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error").split(" "), function( i, name ) {

    // Handle event binding
    jQuery.fn[ name ] = function( data, fn ) {
        if ( fn == null ) {
            fn = data;
            data = null;
        }

        return arguments.length > 0 ?
            this.bind( name, data, fn ) :
            this.trigger( name );
    };

    if ( jQuery.attrFn ) {
        jQuery.attrFn[ name ] = true;
    }
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
    done = 0,
    toString = Object.prototype.toString,
    hasDuplicate = false,
    baseHasDuplicate = true,
    rBackslash = /\\/g,
    rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
    baseHasDuplicate = false;
    return 0;
});

var Sizzle = function( selector, context, results, seed ) {
    results = results || [];
    context = context || document;

    var origContext = context;

    if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
        return [];
    }

    if ( !selector || typeof selector !== "string" ) {
        return results;
    }

    var m, set, checkSet, extra, ret, cur, pop, i,
        prune = true,
        contextXML = Sizzle.isXML( context ),
        parts = [],
        soFar = selector;

    // Reset the position of the chunker regexp (start from head)
    do {
        chunker.exec( "" );
        m = chunker.exec( soFar );

        if ( m ) {
            soFar = m[3];

            parts.push( m[1] );

            if ( m[2] ) {
                extra = m[3];
                break;
            }
        }
    } while ( m );

    if ( parts.length > 1 && origPOS.exec( selector ) ) {

        if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
            set = posProcess( parts[0] + parts[1], context );

        } else {
            set = Expr.relative[ parts[0] ] ?
                [ context ] :
                Sizzle( parts.shift(), context );

            while ( parts.length ) {
                selector = parts.shift();

                if ( Expr.relative[ selector ] ) {
                    selector += parts.shift();
                }

                set = posProcess( selector, set );
            }
        }

    } else {
        // Take a shortcut and set the context if the root selector is an ID
        // (but not if it'll be faster if the inner selector is an ID)
        if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
                Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

            ret = Sizzle.find( parts.shift(), context, contextXML );
            context = ret.expr ?
                Sizzle.filter( ret.expr, ret.set )[0] :
                ret.set[0];
        }

        if ( context ) {
            ret = seed ?
                { expr: parts.pop(), set: makeArray(seed) } :
                Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

            set = ret.expr ?
                Sizzle.filter( ret.expr, ret.set ) :
                ret.set;

            if ( parts.length > 0 ) {
                checkSet = makeArray( set );

            } else {
                prune = false;
            }

            while ( parts.length ) {
                cur = parts.pop();
                pop = cur;

                if ( !Expr.relative[ cur ] ) {
                    cur = "";
                } else {
                    pop = parts.pop();
                }

                if ( pop == null ) {
                    pop = context;
                }

                Expr.relative[ cur ]( checkSet, pop, contextXML );
            }

        } else {
            checkSet = parts = [];
        }
    }

    if ( !checkSet ) {
        checkSet = set;
    }

    if ( !checkSet ) {
        Sizzle.error( cur || selector );
    }

    if ( toString.call(checkSet) === "[object Array]" ) {
        if ( !prune ) {
            results.push.apply( results, checkSet );

        } else if ( context && context.nodeType === 1 ) {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
                    results.push( set[i] );
                }
            }

        } else {
            for ( i = 0; checkSet[i] != null; i++ ) {
                if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
                    results.push( set[i] );
                }
            }
        }

    } else {
        makeArray( checkSet, results );
    }

    if ( extra ) {
        Sizzle( extra, origContext, results, seed );
        Sizzle.uniqueSort( results );
    }

    return results;
};

Sizzle.uniqueSort = function( results ) {
    if ( sortOrder ) {
        hasDuplicate = baseHasDuplicate;
        results.sort( sortOrder );

        if ( hasDuplicate ) {
            for ( var i = 1; i < results.length; i++ ) {
                if ( results[i] === results[ i - 1 ] ) {
                    results.splice( i--, 1 );
                }
            }
        }
    }

    return results;
};

Sizzle.matches = function( expr, set ) {
    return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
    return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
    var set;

    if ( !expr ) {
        return [];
    }

    for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
        var match,
            type = Expr.order[i];

        if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
            var left = match[1];
            match.splice( 1, 1 );

            if ( left.substr( left.length - 1 ) !== "\\" ) {
                match[1] = (match[1] || "").replace( rBackslash, "" );
                set = Expr.find[ type ]( match, context, isXML );

                if ( set != null ) {
                    expr = expr.replace( Expr.match[ type ], "" );
                    break;
                }
            }
        }
    }

    if ( !set ) {
        set = typeof context.getElementsByTagName !== "undefined" ?
            context.getElementsByTagName( "*" ) :
            [];
    }

    return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
    var match, anyFound,
        old = expr,
        result = [],
        curLoop = set,
        isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

    while ( expr && set.length ) {
        for ( var type in Expr.filter ) {
            if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
                var found, item,
                    filter = Expr.filter[ type ],
                    left = match[1];

                anyFound = false;

                match.splice(1,1);

                if ( left.substr( left.length - 1 ) === "\\" ) {
                    continue;
                }

                if ( curLoop === result ) {
                    result = [];
                }

                if ( Expr.preFilter[ type ] ) {
                    match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

                    if ( !match ) {
                        anyFound = found = true;

                    } else if ( match === true ) {
                        continue;
                    }
                }

                if ( match ) {
                    for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
                        if ( item ) {
                            found = filter( item, match, i, curLoop );
                            var pass = not ^ !!found;

                            if ( inplace && found != null ) {
                                if ( pass ) {
                                    anyFound = true;

                                } else {
                                    curLoop[i] = false;
                                }

                            } else if ( pass ) {
                                result.push( item );
                                anyFound = true;
                            }
                        }
                    }
                }

                if ( found !== undefined ) {
                    if ( !inplace ) {
                        curLoop = result;
                    }

                    expr = expr.replace( Expr.match[ type ], "" );

                    if ( !anyFound ) {
                        return [];
                    }

                    break;
                }
            }
        }

        // Improper expression
        if ( expr === old ) {
            if ( anyFound == null ) {
                Sizzle.error( expr );

            } else {
                break;
            }
        }

        old = expr;
    }

    return curLoop;
};

Sizzle.error = function( msg ) {
    throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
    order: [ "ID", "NAME", "TAG" ],

    match: {
        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },

    leftMatch: {},

    attrMap: {
        "class": "className",
        "for": "htmlFor"
    },

    attrHandle: {
        href: function( elem ) {
            return elem.getAttribute( "href" );
        },
        type: function( elem ) {
            return elem.getAttribute( "type" );
        }
    },

    relative: {
        "+": function(checkSet, part){
            var isPartStr = typeof part === "string",
                isTag = isPartStr && !rNonWord.test( part ),
                isPartStrNotTag = isPartStr && !isTag;

            if ( isTag ) {
                part = part.toLowerCase();
            }

            for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
                if ( (elem = checkSet[i]) ) {
                    while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

                    checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
                        elem || false :
                        elem === part;
                }
            }

            if ( isPartStrNotTag ) {
                Sizzle.filter( part, checkSet, true );
            }
        },

        ">": function( checkSet, part ) {
            var elem,
                isPartStr = typeof part === "string",
                i = 0,
                l = checkSet.length;

            if ( isPartStr && !rNonWord.test( part ) ) {
                part = part.toLowerCase();

                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        var parent = elem.parentNode;
                        checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
                    }
                }

            } else {
                for ( ; i < l; i++ ) {
                    elem = checkSet[i];

                    if ( elem ) {
                        checkSet[i] = isPartStr ?
                            elem.parentNode :
                            elem.parentNode === part;
                    }
                }

                if ( isPartStr ) {
                    Sizzle.filter( part, checkSet, true );
                }
            }
        },

        "": function(checkSet, part, isXML){
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
        },

        "~": function( checkSet, part, isXML ) {
            var nodeCheck,
                doneName = done++,
                checkFn = dirCheck;

            if ( typeof part === "string" && !rNonWord.test( part ) ) {
                part = part.toLowerCase();
                nodeCheck = part;
                checkFn = dirNodeCheck;
            }

            checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
        }
    },

    find: {
        ID: function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);
                // Check parentNode to catch when Blackberry 4.6 returns
                // nodes that are no longer in the document #6963
                return m && m.parentNode ? [m] : [];
            }
        },

        NAME: function( match, context ) {
            if ( typeof context.getElementsByName !== "undefined" ) {
                var ret = [],
                    results = context.getElementsByName( match[1] );

                for ( var i = 0, l = results.length; i < l; i++ ) {
                    if ( results[i].getAttribute("name") === match[1] ) {
                        ret.push( results[i] );
                    }
                }

                return ret.length === 0 ? null : ret;
            }
        },

        TAG: function( match, context ) {
            if ( typeof context.getElementsByTagName !== "undefined" ) {
                return context.getElementsByTagName( match[1] );
            }
        }
    },
    preFilter: {
        CLASS: function( match, curLoop, inplace, result, not, isXML ) {
            match = " " + match[1].replace( rBackslash, "" ) + " ";

            if ( isXML ) {
                return match;
            }

            for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
                if ( elem ) {
                    if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
                        if ( !inplace ) {
                            result.push( elem );
                        }

                    } else if ( inplace ) {
                        curLoop[i] = false;
                    }
                }
            }

            return false;
        },

        ID: function( match ) {
            return match[1].replace( rBackslash, "" );
        },

        TAG: function( match, curLoop ) {
            return match[1].replace( rBackslash, "" ).toLowerCase();
        },

        CHILD: function( match ) {
            if ( match[1] === "nth" ) {
                if ( !match[2] ) {
                    Sizzle.error( match[0] );
                }

                match[2] = match[2].replace(/^\+|\s*/g, '');

                // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
                var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
                    match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
                    !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

                // calculate the numbers (first)n+(last) including if they are negative
                match[2] = (test[1] + (test[2] || 1)) - 0;
                match[3] = test[3] - 0;
            }
            else if ( match[2] ) {
                Sizzle.error( match[0] );
            }

            // TODO: Move to normal caching system
            match[0] = done++;

            return match;
        },

        ATTR: function( match, curLoop, inplace, result, not, isXML ) {
            var name = match[1] = match[1].replace( rBackslash, "" );

            if ( !isXML && Expr.attrMap[name] ) {
                match[1] = Expr.attrMap[name];
            }

            // Handle if an un-quoted value was used
            match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

            if ( match[2] === "~=" ) {
                match[4] = " " + match[4] + " ";
            }

            return match;
        },

        PSEUDO: function( match, curLoop, inplace, result, not ) {
            if ( match[1] === "not" ) {
                // If we're dealing with a complex expression, or a simple one
                if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
                    match[3] = Sizzle(match[3], null, null, curLoop);

                } else {
                    var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

                    if ( !inplace ) {
                        result.push.apply( result, ret );
                    }

                    return false;
                }

            } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
                return true;
            }

            return match;
        },

        POS: function( match ) {
            match.unshift( true );

            return match;
        }
    },

    filters: {
        enabled: function( elem ) {
            return elem.disabled === false && elem.type !== "hidden";
        },

        disabled: function( elem ) {
            return elem.disabled === true;
        },

        checked: function( elem ) {
            return elem.checked === true;
        },

        selected: function( elem ) {
            // Accessing this property makes selected-by-default
            // options in Safari work properly
            if ( elem.parentNode ) {
                elem.parentNode.selectedIndex;
            }

            return elem.selected === true;
        },

        parent: function( elem ) {
            return !!elem.firstChild;
        },

        empty: function( elem ) {
            return !elem.firstChild;
        },

        has: function( elem, i, match ) {
            return !!Sizzle( match[3], elem ).length;
        },

        header: function( elem ) {
            return (/h\d/i).test( elem.nodeName );
        },

        text: function( elem ) {
            var attr = elem.getAttribute( "type" ), type = elem.type;
            // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
            // use getAttribute instead to test this case
            return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
        },

        radio: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
        },

        checkbox: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
        },

        file: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
        },

        password: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
        },

        submit: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "submit" === elem.type;
        },

        image: function( elem ) {
            return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
        },

        reset: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return (name === "input" || name === "button") && "reset" === elem.type;
        },

        button: function( elem ) {
            var name = elem.nodeName.toLowerCase();
            return name === "input" && "button" === elem.type || name === "button";
        },

        input: function( elem ) {
            return (/input|select|textarea|button/i).test( elem.nodeName );
        },

        focus: function( elem ) {
            return elem === elem.ownerDocument.activeElement;
        }
    },
    setFilters: {
        first: function( elem, i ) {
            return i === 0;
        },

        last: function( elem, i, match, array ) {
            return i === array.length - 1;
        },

        even: function( elem, i ) {
            return i % 2 === 0;
        },

        odd: function( elem, i ) {
            return i % 2 === 1;
        },

        lt: function( elem, i, match ) {
            return i < match[3] - 0;
        },

        gt: function( elem, i, match ) {
            return i > match[3] - 0;
        },

        nth: function( elem, i, match ) {
            return match[3] - 0 === i;
        },

        eq: function( elem, i, match ) {
            return match[3] - 0 === i;
        }
    },
    filter: {
        PSEUDO: function( elem, match, i, array ) {
            var name = match[1],
                filter = Expr.filters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );

            } else if ( name === "contains" ) {
                return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

            } else if ( name === "not" ) {
                var not = match[3];

                for ( var j = 0, l = not.length; j < l; j++ ) {
                    if ( not[j] === elem ) {
                        return false;
                    }
                }

                return true;

            } else {
                Sizzle.error( name );
            }
        },

        CHILD: function( elem, match ) {
            var type = match[1],
                node = elem;

            switch ( type ) {
                case "only":
                case "first":
                    while ( (node = node.previousSibling) )	 {
                        if ( node.nodeType === 1 ) {
                            return false;
                        }
                    }

                    if ( type === "first" ) {
                        return true;
                    }

                    node = elem;

                case "last":
                    while ( (node = node.nextSibling) )	 {
                        if ( node.nodeType === 1 ) {
                            return false;
                        }
                    }

                    return true;

                case "nth":
                    var first = match[2],
                        last = match[3];

                    if ( first === 1 && last === 0 ) {
                        return true;
                    }

                    var doneName = match[0],
                        parent = elem.parentNode;

                    if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
                        var count = 0;

                        for ( node = parent.firstChild; node; node = node.nextSibling ) {
                            if ( node.nodeType === 1 ) {
                                node.nodeIndex = ++count;
                            }
                        }

                        parent.sizcache = doneName;
                    }

                    var diff = elem.nodeIndex - last;

                    if ( first === 0 ) {
                        return diff === 0;

                    } else {
                        return ( diff % first === 0 && diff / first >= 0 );
                    }
            }
        },

        ID: function( elem, match ) {
            return elem.nodeType === 1 && elem.getAttribute("id") === match;
        },

        TAG: function( elem, match ) {
            return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
        },

        CLASS: function( elem, match ) {
            return (" " + (elem.className || elem.getAttribute("class")) + " ")
                .indexOf( match ) > -1;
        },

        ATTR: function( elem, match ) {
            var name = match[1],
                result = Expr.attrHandle[ name ] ?
                    Expr.attrHandle[ name ]( elem ) :
                    elem[ name ] != null ?
                        elem[ name ] :
                        elem.getAttribute( name ),
                value = result + "",
                type = match[2],
                check = match[4];

            return result == null ?
                type === "!=" :
                type === "=" ?
                value === check :
                type === "*=" ?
                value.indexOf(check) >= 0 :
                type === "~=" ?
                (" " + value + " ").indexOf(check) >= 0 :
                !check ?
                value && result !== false :
                type === "!=" ?
                value !== check :
                type === "^=" ?
                value.indexOf(check) === 0 :
                type === "$=" ?
                value.substr(value.length - check.length) === check :
                type === "|=" ?
                value === check || value.substr(0, check.length + 1) === check + "-" :
                false;
        },

        POS: function( elem, match, i, array ) {
            var name = match[2],
                filter = Expr.setFilters[ name ];

            if ( filter ) {
                return filter( elem, i, match, array );
            }
        }
    }
};

var origPOS = Expr.match.POS,
    fescape = function(all, num){
        return "\\" + (num - 0 + 1);
    };

for ( var type in Expr.match ) {
    Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
    Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
    array = Array.prototype.slice.call( array, 0 );

    if ( results ) {
        results.push.apply( results, array );
        return results;
    }

    return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
    Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
    makeArray = function( array, results ) {
        var i = 0,
            ret = results || [];

        if ( toString.call(array) === "[object Array]" ) {
            Array.prototype.push.apply( ret, array );

        } else {
            if ( typeof array.length === "number" ) {
                for ( var l = array.length; i < l; i++ ) {
                    ret.push( array[i] );
                }

            } else {
                for ( ; array[i]; i++ ) {
                    ret.push( array[i] );
                }
            }
        }

        return ret;
    };
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
    sortOrder = function( a, b ) {
        if ( a === b ) {
            hasDuplicate = true;
            return 0;
        }

        if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
            return a.compareDocumentPosition ? -1 : 1;
        }

        return a.compareDocumentPosition(b) & 4 ? -1 : 1;
    };

} else {
    sortOrder = function( a, b ) {
        // The nodes are identical, we can exit early
        if ( a === b ) {
            hasDuplicate = true;
            return 0;

        // Fallback to using sourceIndex (in IE) if it's available on both nodes
        } else if ( a.sourceIndex && b.sourceIndex ) {
            return a.sourceIndex - b.sourceIndex;
        }

        var al, bl,
            ap = [],
            bp = [],
            aup = a.parentNode,
            bup = b.parentNode,
            cur = aup;

        // If the nodes are siblings (or identical) we can do a quick check
        if ( aup === bup ) {
            return siblingCheck( a, b );

        // If no parents were found then the nodes are disconnected
        } else if ( !aup ) {
            return -1;

        } else if ( !bup ) {
            return 1;
        }

        // Otherwise they're somewhere else in the tree so we need
        // to build up a full list of the parentNodes for comparison
        while ( cur ) {
            ap.unshift( cur );
            cur = cur.parentNode;
        }

        cur = bup;

        while ( cur ) {
            bp.unshift( cur );
            cur = cur.parentNode;
        }

        al = ap.length;
        bl = bp.length;

        // Start walking down the tree looking for a discrepancy
        for ( var i = 0; i < al && i < bl; i++ ) {
            if ( ap[i] !== bp[i] ) {
                return siblingCheck( ap[i], bp[i] );
            }
        }

        // We ended someplace up the tree so do a sibling check
        return i === al ?
            siblingCheck( a, bp[i], -1 ) :
            siblingCheck( ap[i], b, 1 );
    };

    siblingCheck = function( a, b, ret ) {
        if ( a === b ) {
            return ret;
        }

        var cur = a.nextSibling;

        while ( cur ) {
            if ( cur === b ) {
                return -1;
            }

            cur = cur.nextSibling;
        }

        return 1;
    };
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
    var ret = "", elem;

    for ( var i = 0; elems[i]; i++ ) {
        elem = elems[i];

        // Get the text from text nodes and CDATA nodes
        if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
            ret += elem.nodeValue;

        // Traverse everything else, except comment nodes
        } else if ( elem.nodeType !== 8 ) {
            ret += Sizzle.getText( elem.childNodes );
        }
    }

    return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
    // We're going to inject a fake input element with a specified name
    var form = document.createElement("div"),
        id = "script" + (new Date()).getTime(),
        root = document.documentElement;

    form.innerHTML = "<a name='" + id + "'/>";

    // Inject it into the root element, check its status, and remove it quickly
    root.insertBefore( form, root.firstChild );

    // The workaround has to do additional checks after a getElementById
    // Which slows things down for other browsers (hence the branching)
    if ( document.getElementById( id ) ) {
        Expr.find.ID = function( match, context, isXML ) {
            if ( typeof context.getElementById !== "undefined" && !isXML ) {
                var m = context.getElementById(match[1]);

                return m ?
                    m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
                        [m] :
                        undefined :
                    [];
            }
        };

        Expr.filter.ID = function( elem, match ) {
            var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

            return elem.nodeType === 1 && node && node.nodeValue === match;
        };
    }

    root.removeChild( form );

    // release memory in IE
    root = form = null;
})();

(function(){
    // Check to see if the browser returns only elements
    // when doing getElementsByTagName("*")

    // Create a fake element
    var div = document.createElement("div");
    div.appendChild( document.createComment("") );

    // Make sure no comments are found
    if ( div.getElementsByTagName("*").length > 0 ) {
        Expr.find.TAG = function( match, context ) {
            var results = context.getElementsByTagName( match[1] );

            // Filter out possible comments
            if ( match[1] === "*" ) {
                var tmp = [];

                for ( var i = 0; results[i]; i++ ) {
                    if ( results[i].nodeType === 1 ) {
                        tmp.push( results[i] );
                    }
                }

                results = tmp;
            }

            return results;
        };
    }

    // Check to see if an attribute returns normalized href attributes
    div.innerHTML = "<a href='#'></a>";

    if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
            div.firstChild.getAttribute("href") !== "#" ) {

        Expr.attrHandle.href = function( elem ) {
            return elem.getAttribute( "href", 2 );
        };
    }

    // release memory in IE
    div = null;
})();

if ( document.querySelectorAll ) {
    (function(){
        var oldSizzle = Sizzle,
            div = document.createElement("div"),
            id = "__sizzle__";

        div.innerHTML = "<p class='TEST'></p>";

        // Safari can't handle uppercase or unicode characters when
        // in quirks mode.
        if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
            return;
        }

        Sizzle = function( query, context, extra, seed ) {
            context = context || document;

            // Only use querySelectorAll on non-XML documents
            // (ID selectors don't work in non-HTML documents)
            if ( !seed && !Sizzle.isXML(context) ) {
                // See if we find a selector to speed up
                var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

                if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
                    // Speed-up: Sizzle("TAG")
                    if ( match[1] ) {
                        return makeArray( context.getElementsByTagName( query ), extra );

                    // Speed-up: Sizzle(".CLASS")
                    } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
                        return makeArray( context.getElementsByClassName( match[2] ), extra );
                    }
                }

                if ( context.nodeType === 9 ) {
                    // Speed-up: Sizzle("body")
                    // The body element only exists once, optimize finding it
                    if ( query === "body" && context.body ) {
                        return makeArray( [ context.body ], extra );

                    // Speed-up: Sizzle("#ID")
                    } else if ( match && match[3] ) {
                        var elem = context.getElementById( match[3] );

                        // Check parentNode to catch when Blackberry 4.6 returns
                        // nodes that are no longer in the document #6963
                        if ( elem && elem.parentNode ) {
                            // Handle the case where IE and Opera return items
                            // by name instead of ID
                            if ( elem.id === match[3] ) {
                                return makeArray( [ elem ], extra );
                            }

                        } else {
                            return makeArray( [], extra );
                        }
                    }

                    try {
                        return makeArray( context.querySelectorAll(query), extra );
                    } catch(qsaError) {}

                // qSA works strangely on Element-rooted queries
                // We can work around this by specifying an extra ID on the root
                // and working up from there (Thanks to Andrew Dupont for the technique)
                // IE 8 doesn't work on object elements
                } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
                    var oldContext = context,
                        old = context.getAttribute( "id" ),
                        nid = old || id,
                        hasParent = context.parentNode,
                        relativeHierarchySelector = /^\s*[+~]/.test( query );

                    if ( !old ) {
                        context.setAttribute( "id", nid );
                    } else {
                        nid = nid.replace( /'/g, "\\$&" );
                    }
                    if ( relativeHierarchySelector && hasParent ) {
                        context = context.parentNode;
                    }

                    try {
                        if ( !relativeHierarchySelector || hasParent ) {
                            return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
                        }

                    } catch(pseudoError) {
                    } finally {
                        if ( !old ) {
                            oldContext.removeAttribute( "id" );
                        }
                    }
                }
            }

            return oldSizzle(query, context, extra, seed);
        };

        for ( var prop in oldSizzle ) {
            Sizzle[ prop ] = oldSizzle[ prop ];
        }

        // release memory in IE
        div = null;
    })();
}

(function(){
    var html = document.documentElement,
        matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

    if ( matches ) {
        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9 fails this)
        var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
            pseudoWorks = false;

        try {
            // This should fail with an exception
            // Gecko does not error, returns false instead
            matches.call( document.documentElement, "[test!='']:sizzle" );

        } catch( pseudoError ) {
            pseudoWorks = true;
        }

        Sizzle.matchesSelector = function( node, expr ) {
            // Make sure that attribute selectors are quoted
            expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

            if ( !Sizzle.isXML( node ) ) {
                try {
                    if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
                        var ret = matches.call( node, expr );

                        // IE 9's matchesSelector returns false on disconnected nodes
                        if ( ret || !disconnectedMatch ||
                                // As well, disconnected nodes are said to be in a document
                                // fragment in IE 9, so check for that
                                node.document && node.document.nodeType !== 11 ) {
                            return ret;
                        }
                    }
                } catch(e) {}
            }

            return Sizzle(expr, null, null, [node]).length > 0;
        };
    }
})();

(function(){
    var div = document.createElement("div");

    div.innerHTML = "<div class='test e'></div><div class='test'></div>";

    // Opera can't find a second classname (in 9.6)
    // Also, make sure that getElementsByClassName actually exists
    if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
        return;
    }

    // Safari caches class attributes, doesn't catch changes (in 3.2)
    div.lastChild.className = "e";

    if ( div.getElementsByClassName("e").length === 1 ) {
        return;
    }

    Expr.order.splice(1, 0, "CLASS");
    Expr.find.CLASS = function( match, context, isXML ) {
        if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
            return context.getElementsByClassName(match[1]);
        }
    };

    // release memory in IE
    div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;

            elem = elem[dir];

            while ( elem ) {
                if ( elem.sizcache === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 && !isXML ){
                    elem.sizcache = doneName;
                    elem.sizset = i;
                }

                if ( elem.nodeName.toLowerCase() === cur ) {
                    match = elem;
                    break;
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
    for ( var i = 0, l = checkSet.length; i < l; i++ ) {
        var elem = checkSet[i];

        if ( elem ) {
            var match = false;

            elem = elem[dir];

            while ( elem ) {
                if ( elem.sizcache === doneName ) {
                    match = checkSet[elem.sizset];
                    break;
                }

                if ( elem.nodeType === 1 ) {
                    if ( !isXML ) {
                        elem.sizcache = doneName;
                        elem.sizset = i;
                    }

                    if ( typeof cur !== "string" ) {
                        if ( elem === cur ) {
                            match = true;
                            break;
                        }

                    } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
                        match = elem;
                        break;
                    }
                }

                elem = elem[dir];
            }

            checkSet[i] = match;
        }
    }
}

if ( document.documentElement.contains ) {
    Sizzle.contains = function( a, b ) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };

} else if ( document.documentElement.compareDocumentPosition ) {
    Sizzle.contains = function( a, b ) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

} else {
    Sizzle.contains = function() {
        return false;
    };
}

Sizzle.isXML = function( elem ) {
    // documentElement is verified for cases where it doesn't yet exist
    // (such as loading iframes in IE - #4833)
    var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

    return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
    var match,
        tmpSet = [],
        later = "",
        root = context.nodeType ? [context] : context;

    // Position selectors must be done after the filter
    // And so must :not(positional) so we move all PSEUDOs to the end
    while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
        later += match[0];
        selector = selector.replace( Expr.match.PSEUDO, "" );
    }

    selector = Expr.relative[selector] ? selector + "*" : selector;

    for ( var i = 0, l = root.length; i < l; i++ ) {
        Sizzle( selector, root[i], tmpSet );
    }

    return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
    rparentsprev = /^(?:parents|prevUntil|prevAll)/,
    // Note: This RegExp should be improved, or likely pulled from Sizzle
    rmultiselector = /,/,
    isSimple = /^.[^:#\[\.,]*$/,
    slice = Array.prototype.slice,
    POS = jQuery.expr.match.POS,
    // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };

jQuery.fn.extend({
    find: function( selector ) {
        var self = this,
            i, l;

        if ( typeof selector !== "string" ) {
            return jQuery( selector ).filter(function() {
                for ( i = 0, l = self.length; i < l; i++ ) {
                    if ( jQuery.contains( self[ i ], this ) ) {
                        return true;
                    }
                }
            });
        }

        var ret = this.pushStack( "", "find", selector ),
            length, n, r;

        for ( i = 0, l = this.length; i < l; i++ ) {
            length = ret.length;
            jQuery.find( selector, this[i], ret );

            if ( i > 0 ) {
                // Make sure that the results are unique
                for ( n = length; n < ret.length; n++ ) {
                    for ( r = 0; r < length; r++ ) {
                        if ( ret[r] === ret[n] ) {
                            ret.splice(n--, 1);
                            break;
                        }
                    }
                }
            }
        }

        return ret;
    },

    has: function( target ) {
        var targets = jQuery( target );
        return this.filter(function() {
            for ( var i = 0, l = targets.length; i < l; i++ ) {
                if ( jQuery.contains( this, targets[i] ) ) {
                    return true;
                }
            }
        });
    },

    not: function( selector ) {
        return this.pushStack( winnow(this, selector, false), "not", selector);
    },

    filter: function( selector ) {
        return this.pushStack( winnow(this, selector, true), "filter", selector );
    },

    is: function( selector ) {
        return !!selector && ( typeof selector === "string" ?
            jQuery.filter( selector, this ).length > 0 :
            this.filter( selector ).length > 0 );
    },

    closest: function( selectors, context ) {
        var ret = [], i, l, cur = this[0];

        // Array
        if ( jQuery.isArray( selectors ) ) {
            var match, selector,
                matches = {},
                level = 1;

            if ( cur && selectors.length ) {
                for ( i = 0, l = selectors.length; i < l; i++ ) {
                    selector = selectors[i];

                    if ( !matches[ selector ] ) {
                        matches[ selector ] = POS.test( selector ) ?
                            jQuery( selector, context || this.context ) :
                            selector;
                    }
                }

                while ( cur && cur.ownerDocument && cur !== context ) {
                    for ( selector in matches ) {
                        match = matches[ selector ];

                        if ( match.jquery ? match.index( cur ) > -1 : jQuery( cur ).is( match ) ) {
                            ret.push({ selector: selector, elem: cur, level: level });
                        }
                    }

                    cur = cur.parentNode;
                    level++;
                }
            }

            return ret;
        }

        // String
        var pos = POS.test( selectors ) || typeof selectors !== "string" ?
                jQuery( selectors, context || this.context ) :
                0;

        for ( i = 0, l = this.length; i < l; i++ ) {
            cur = this[i];

            while ( cur ) {
                if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
                    ret.push( cur );
                    break;

                } else {
                    cur = cur.parentNode;
                    if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
                        break;
                    }
                }
            }
        }

        ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

        return this.pushStack( ret, "closest", selectors );
    },

    // Determine the position of an element within
    // the matched set of elements
    index: function( elem ) {

        // No argument, return index in parent
        if ( !elem ) {
            return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
        }

        // index in selector
        if ( typeof elem === "string" ) {
            return jQuery.inArray( this[0], jQuery( elem ) );
        }

        // Locate the position of the desired element
        return jQuery.inArray(
            // If it receives a jQuery object, the first element is used
            elem.jquery ? elem[0] : elem, this );
    },

    add: function( selector, context ) {
        var set = typeof selector === "string" ?
                jQuery( selector, context ) :
                jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
            all = jQuery.merge( this.get(), set );

        return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
            all :
            jQuery.unique( all ) );
    },

    andSelf: function() {
        return this.add( this.prevObject );
    }
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
    return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
    parent: function( elem ) {
        var parent = elem.parentNode;
        return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
        return jQuery.dir( elem, "parentNode" );
    },
    parentsUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "parentNode", until );
    },
    next: function( elem ) {
        return jQuery.nth( elem, 2, "nextSibling" );
    },
    prev: function( elem ) {
        return jQuery.nth( elem, 2, "previousSibling" );
    },
    nextAll: function( elem ) {
        return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
        return jQuery.dir( elem, "previousSibling" );
    },
    nextUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "nextSibling", until );
    },
    prevUntil: function( elem, i, until ) {
        return jQuery.dir( elem, "previousSibling", until );
    },
    siblings: function( elem ) {
        return jQuery.sibling( elem.parentNode.firstChild, elem );
    },
    children: function( elem ) {
        return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
        return jQuery.nodeName( elem, "iframe" ) ?
            elem.contentDocument || elem.contentWindow.document :
            jQuery.makeArray( elem.childNodes );
    }
}, function( name, fn ) {
    jQuery.fn[ name ] = function( until, selector ) {
        var ret = jQuery.map( this, fn, until ),
            // The variable 'args' was introduced in
            // https://github.com/jquery/jquery/commit/52a0238
            // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
            // http://code.google.com/p/v8/issues/detail?id=1050
            args = slice.call(arguments);

        if ( !runtil.test( name ) ) {
            selector = until;
        }

        if ( selector && typeof selector === "string" ) {
            ret = jQuery.filter( selector, ret );
        }

        ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

        if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
            ret = ret.reverse();
        }

        return this.pushStack( ret, name, args.join(",") );
    };
});

jQuery.extend({
    filter: function( expr, elems, not ) {
        if ( not ) {
            expr = ":not(" + expr + ")";
        }

        return elems.length === 1 ?
            jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
            jQuery.find.matches(expr, elems);
    },

    dir: function( elem, dir, until ) {
        var matched = [],
            cur = elem[ dir ];

        while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
            if ( cur.nodeType === 1 ) {
                matched.push( cur );
            }
            cur = cur[dir];
        }
        return matched;
    },

    nth: function( cur, result, dir, elem ) {
        result = result || 1;
        var num = 0;

        for ( ; cur; cur = cur[dir] ) {
            if ( cur.nodeType === 1 && ++num === result ) {
                break;
            }
        }

        return cur;
    },

    sibling: function( n, elem ) {
        var r = [];

        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                r.push( n );
            }
        }

        return r;
    }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

    // Can't pass null or undefined to indexOf in Firefox 4
    // Set to 0 to skip string check
    qualifier = qualifier || 0;

    if ( jQuery.isFunction( qualifier ) ) {
        return jQuery.grep(elements, function( elem, i ) {
            var retVal = !!qualifier.call( elem, i, elem );
            return retVal === keep;
        });

    } else if ( qualifier.nodeType ) {
        return jQuery.grep(elements, function( elem, i ) {
            return (elem === qualifier) === keep;
        });

    } else if ( typeof qualifier === "string" ) {
        var filtered = jQuery.grep(elements, function( elem ) {
            return elem.nodeType === 1;
        });

        if ( isSimple.test( qualifier ) ) {
            return jQuery.filter(qualifier, filtered, !keep);
        } else {
            qualifier = jQuery.filter( qualifier, filtered );
        }
    }

    return jQuery.grep(elements, function( elem, i ) {
        return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
    });
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
    rleadingWhitespace = /^\s+/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rtagName = /<([\w:]+)/,
    rtbody = /<tbody/i,
    rhtml = /<|&#?\w+;/,
    rnocache = /<(?:script|object|embed|option|style)/i,
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /\/(java|ecma)script/i,
    rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
    wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
    };

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
    wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
    text: function( text ) {
        if ( jQuery.isFunction(text) ) {
            return this.each(function(i) {
                var self = jQuery( this );

                self.text( text.call(this, i, self.text()) );
            });
        }

        if ( typeof text !== "object" && text !== undefined ) {
            return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
        }

        return jQuery.text( this );
    },

    wrapAll: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapAll( html.call(this, i) );
            });
        }

        if ( this[0] ) {
            // The elements to wrap the target around
            var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

            if ( this[0].parentNode ) {
                wrap.insertBefore( this[0] );
            }

            wrap.map(function() {
                var elem = this;

                while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
                    elem = elem.firstChild;
                }

                return elem;
            }).append( this );
        }

        return this;
    },

    wrapInner: function( html ) {
        if ( jQuery.isFunction( html ) ) {
            return this.each(function(i) {
                jQuery(this).wrapInner( html.call(this, i) );
            });
        }

        return this.each(function() {
            var self = jQuery( this ),
                contents = self.contents();

            if ( contents.length ) {
                contents.wrapAll( html );

            } else {
                self.append( html );
            }
        });
    },

    wrap: function( html ) {
        return this.each(function() {
            jQuery( this ).wrapAll( html );
        });
    },

    unwrap: function() {
        return this.parent().each(function() {
            if ( !jQuery.nodeName( this, "body" ) ) {
                jQuery( this ).replaceWith( this.childNodes );
            }
        }).end();
    },

    append: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.appendChild( elem );
            }
        });
    },

    prepend: function() {
        return this.domManip(arguments, true, function( elem ) {
            if ( this.nodeType === 1 ) {
                this.insertBefore( elem, this.firstChild );
            }
        });
    },

    before: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this );
            });
        } else if ( arguments.length ) {
            var set = jQuery(arguments[0]);
            set.push.apply( set, this.toArray() );
            return this.pushStack( set, "before", arguments );
        }
    },

    after: function() {
        if ( this[0] && this[0].parentNode ) {
            return this.domManip(arguments, false, function( elem ) {
                this.parentNode.insertBefore( elem, this.nextSibling );
            });
        } else if ( arguments.length ) {
            var set = this.pushStack( this, "after", arguments );
            set.push.apply( set, jQuery(arguments[0]).toArray() );
            return set;
        }
    },

    // keepData is for internal use only--do not document
    remove: function( selector, keepData ) {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
                if ( !keepData && elem.nodeType === 1 ) {
                    jQuery.cleanData( elem.getElementsByTagName("*") );
                    jQuery.cleanData( [ elem ] );
                }

                if ( elem.parentNode ) {
                    elem.parentNode.removeChild( elem );
                }
            }
        }

        return this;
    },

    empty: function() {
        for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
            // Remove element nodes and prevent memory leaks
            if ( elem.nodeType === 1 ) {
                jQuery.cleanData( elem.getElementsByTagName("*") );
            }

            // Remove any remaining nodes
            while ( elem.firstChild ) {
                elem.removeChild( elem.firstChild );
            }
        }

        return this;
    },

    clone: function( dataAndEvents, deepDataAndEvents ) {
        dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
        deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

        return this.map( function () {
            return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
        });
    },

    html: function( value ) {
        if ( value === undefined ) {
            return this[0] && this[0].nodeType === 1 ?
                this[0].innerHTML.replace(rinlinejQuery, "") :
                null;

        // See if we can take a shortcut and just use innerHTML
        } else if ( typeof value === "string" && !rnocache.test( value ) &&
            (jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
            !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

            value = value.replace(rxhtmlTag, "<$1></$2>");

            try {
                for ( var i = 0, l = this.length; i < l; i++ ) {
                    // Remove element nodes and prevent memory leaks
                    if ( this[i].nodeType === 1 ) {
                        jQuery.cleanData( this[i].getElementsByTagName("*") );
                        this[i].innerHTML = value;
                    }
                }

            // If using innerHTML throws an exception, use the fallback method
            } catch(e) {
                this.empty().append( value );
            }

        } else if ( jQuery.isFunction( value ) ) {
            this.each(function(i){
                var self = jQuery( this );

                self.html( value.call(this, i, self.html()) );
            });

        } else {
            this.empty().append( value );
        }

        return this;
    },

    replaceWith: function( value ) {
        if ( this[0] && this[0].parentNode ) {
            // Make sure that the elements are removed from the DOM before they are inserted
            // this can help fix replacing a parent with child elements
            if ( jQuery.isFunction( value ) ) {
                return this.each(function(i) {
                    var self = jQuery(this), old = self.html();
                    self.replaceWith( value.call( this, i, old ) );
                });
            }

            if ( typeof value !== "string" ) {
                value = jQuery( value ).detach();
            }

            return this.each(function() {
                var next = this.nextSibling,
                    parent = this.parentNode;

                jQuery( this ).remove();

                if ( next ) {
                    jQuery(next).before( value );
                } else {
                    jQuery(parent).append( value );
                }
            });
        } else {
            return this.length ?
                this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
                this;
        }
    },

    detach: function( selector ) {
        return this.remove( selector, true );
    },

    domManip: function( args, table, callback ) {
        var results, first, fragment, parent,
            value = args[0],
            scripts = [];

        // We can't cloneNode fragments that contain checked, in WebKit
        if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
            return this.each(function() {
                jQuery(this).domManip( args, table, callback, true );
            });
        }

        if ( jQuery.isFunction(value) ) {
            return this.each(function(i) {
                var self = jQuery(this);
                args[0] = value.call(this, i, table ? self.html() : undefined);
                self.domManip( args, table, callback );
            });
        }

        if ( this[0] ) {
            parent = value && value.parentNode;

            // If we're in a fragment, just use that instead of building a new one
            if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
                results = { fragment: parent };

            } else {
                results = jQuery.buildFragment( args, this, scripts );
            }

            fragment = results.fragment;

            if ( fragment.childNodes.length === 1 ) {
                first = fragment = fragment.firstChild;
            } else {
                first = fragment.firstChild;
            }

            if ( first ) {
                table = table && jQuery.nodeName( first, "tr" );

                for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
                    callback.call(
                        table ?
                            root(this[i], first) :
                            this[i],
                        // Make sure that we do not leak memory by inadvertently discarding
                        // the original fragment (which might have attached data) instead of
                        // using it; in addition, use the original fragment object for the last
                        // item instead of first because it can end up being emptied incorrectly
                        // in certain situations (Bug #8070).
                        // Fragments from the fragment cache must always be cloned and never used
                        // in place.
                        results.cacheable || (l > 1 && i < lastIndex) ?
                            jQuery.clone( fragment, true, true ) :
                            fragment
                    );
                }
            }

            if ( scripts.length ) {
                jQuery.each( scripts, evalScript );
            }
        }

        return this;
    }
});

function root( elem, cur ) {
    return jQuery.nodeName(elem, "table") ?
        (elem.getElementsByTagName("tbody")[0] ||
        elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
        elem;
}

function cloneCopyEvent( src, dest ) {

    if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
        return;
    }

    var internalKey = jQuery.expando,
        oldData = jQuery.data( src ),
        curData = jQuery.data( dest, oldData );

    // Switch to use the internal data object, if it exists, for the next
    // stage of data copying
    if ( (oldData = oldData[ internalKey ]) ) {
        var events = oldData.events;
                curData = curData[ internalKey ] = jQuery.extend({}, oldData);

        if ( events ) {
            delete curData.handle;
            curData.events = {};

            for ( var type in events ) {
                for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
                    jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
                }
            }
        }
    }
}

function cloneFixAttributes( src, dest ) {
    var nodeName;

    // We do not need to do anything for non-Elements
    if ( dest.nodeType !== 1 ) {
        return;
    }

    // clearAttributes removes the attributes, which we don't want,
    // but also removes the attachEvent events, which we *do* want
    if ( dest.clearAttributes ) {
        dest.clearAttributes();
    }

    // mergeAttributes, in contrast, only merges back on the
    // original attributes, not the events
    if ( dest.mergeAttributes ) {
        dest.mergeAttributes( src );
    }

    nodeName = dest.nodeName.toLowerCase();

    // IE6-8 fail to clone children inside object elements that use
    // the proprietary classid attribute value (rather than the type
    // attribute) to identify the type of content to display
    if ( nodeName === "object" ) {
        dest.outerHTML = src.outerHTML;

    } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
        // IE6-8 fails to persist the checked state of a cloned checkbox
        // or radio button. Worse, IE6-7 fail to give the cloned element
        // a checked appearance if the defaultChecked value isn't also set
        if ( src.checked ) {
            dest.defaultChecked = dest.checked = src.checked;
        }

        // IE6-7 get confused and end up setting the value of a cloned
        // checkbox/radio button to an empty string instead of "on"
        if ( dest.value !== src.value ) {
            dest.value = src.value;
        }

    // IE6-8 fails to return the selected option to the default selected
    // state when cloning options
    } else if ( nodeName === "option" ) {
        dest.selected = src.defaultSelected;

    // IE6-8 fails to set the defaultValue to the correct value when
    // cloning other types of input fields
    } else if ( nodeName === "input" || nodeName === "textarea" ) {
        dest.defaultValue = src.defaultValue;
    }

    // Event data gets referenced instead of copied if the expando
    // gets copied too
    dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
    var fragment, cacheable, cacheresults, doc;

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
    // Chrome and Firefox seem to allow this to occur and will throw exception
    // Fixes #8950
    if ( !doc.createDocumentFragment ) {
        doc = document;
    }

    // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
    // Cloning options loses the selected state, so don't cache them
    // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
    // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
    if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
        args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

        cacheable = true;

        cacheresults = jQuery.fragments[ args[0] ];
        if ( cacheresults && cacheresults !== 1 ) {
            fragment = cacheresults;
        }
    }

    if ( !fragment ) {
        fragment = doc.createDocumentFragment();
        jQuery.clean( args, doc, fragment, scripts );
    }

    if ( cacheable ) {
        jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
    }

    return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function( name, original ) {
    jQuery.fn[ name ] = function( selector ) {
        var ret = [],
            insert = jQuery( selector ),
            parent = this.length === 1 && this[0].parentNode;

        if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
            insert[ original ]( this[0] );
            return this;

        } else {
            for ( var i = 0, l = insert.length; i < l; i++ ) {
                var elems = (i > 0 ? this.clone(true) : this).get();
                jQuery( insert[i] )[ original ]( elems );
                ret = ret.concat( elems );
            }

            return this.pushStack( ret, name, insert.selector );
        }
    };
});

function getAll( elem ) {
    if ( "getElementsByTagName" in elem ) {
        return elem.getElementsByTagName( "*" );

    } else if ( "querySelectorAll" in elem ) {
        return elem.querySelectorAll( "*" );

    } else {
        return [];
    }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
    if ( elem.type === "checkbox" || elem.type === "radio" ) {
        elem.defaultChecked = elem.checked;
    }
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
    if ( jQuery.nodeName( elem, "input" ) ) {
        fixDefaultChecked( elem );
    } else if ( "getElementsByTagName" in elem ) {
        jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
    }
}

jQuery.extend({
    clone: function( elem, dataAndEvents, deepDataAndEvents ) {
        var clone = elem.cloneNode(true),
                srcElements,
                destElements,
                i;

        if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
                (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
            // IE copies events bound via attachEvent when using cloneNode.
            // Calling detachEvent on the clone will also remove the events
            // from the original. In order to get around this, we use some
            // proprietary methods to clear the events. Thanks to MooTools
            // guys for this hotness.

            cloneFixAttributes( elem, clone );

            // Using Sizzle here is crazy slow, so we use getElementsByTagName
            // instead
            srcElements = getAll( elem );
            destElements = getAll( clone );

            // Weird iteration because IE will replace the length property
            // with an element if you are cloning the body and one of the
            // elements on the page has a name or id of "length"
            for ( i = 0; srcElements[i]; ++i ) {
                // Ensure that the destination node is not null; Fixes #9587
                if ( destElements[i] ) {
                    cloneFixAttributes( srcElements[i], destElements[i] );
                }
            }
        }

        // Copy the events from the original to the clone
        if ( dataAndEvents ) {
            cloneCopyEvent( elem, clone );

            if ( deepDataAndEvents ) {
                srcElements = getAll( elem );
                destElements = getAll( clone );

                for ( i = 0; srcElements[i]; ++i ) {
                    cloneCopyEvent( srcElements[i], destElements[i] );
                }
            }
        }

        srcElements = destElements = null;

        // Return the cloned set
        return clone;
    },

    clean: function( elems, context, fragment, scripts ) {
        var checkScriptType;

        context = context || document;

        // !context.createElement fails in IE with an error but returns typeof 'object'
        if ( typeof context.createElement === "undefined" ) {
            context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
        }

        var ret = [], j;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( typeof elem === "number" ) {
                elem += "";
            }

            if ( !elem ) {
                continue;
            }

            // Convert html string into DOM nodes
            if ( typeof elem === "string" ) {
                if ( !rhtml.test( elem ) ) {
                    elem = context.createTextNode( elem );
                } else {
                    // Fix "XHTML"-style tags in all browsers
                    elem = elem.replace(rxhtmlTag, "<$1></$2>");

                    // Trim whitespace, otherwise indexOf won't work as expected
                    var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
                        wrap = wrapMap[ tag ] || wrapMap._default,
                        depth = wrap[0],
                        div = context.createElement("div");

                    // Go to html and back, then peel off extra wrappers
                    div.innerHTML = wrap[1] + elem + wrap[2];

                    // Move to the right depth
                    while ( depth-- ) {
                        div = div.lastChild;
                    }

                    // Remove IE's autoinserted <tbody> from table fragments
                    if ( !jQuery.support.tbody ) {

                        // String was a <table>, *may* have spurious <tbody>
                        var hasBody = rtbody.test(elem),
                            tbody = tag === "table" && !hasBody ?
                                div.firstChild && div.firstChild.childNodes :

                                // String was a bare <thead> or <tfoot>
                                wrap[1] === "<table>" && !hasBody ?
                                    div.childNodes :
                                    [];

                        for ( j = tbody.length - 1; j >= 0 ; --j ) {
                            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                                tbody[ j ].parentNode.removeChild( tbody[ j ] );
                            }
                        }
                    }

                    // IE completely kills leading whitespace when innerHTML is used
                    if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
                        div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
                    }

                    elem = div.childNodes;
                }
            }

            // Resets defaultChecked for any radios and checkboxes
            // about to be appended to the DOM in IE 6/7 (#8060)
            var len;
            if ( !jQuery.support.appendChecked ) {
                if ( elem[0] && typeof (len = elem.length) === "number" ) {
                    for ( j = 0; j < len; j++ ) {
                        findInputs( elem[j] );
                    }
                } else {
                    findInputs( elem );
                }
            }

            if ( elem.nodeType ) {
                ret.push( elem );
            } else {
                ret = jQuery.merge( ret, elem );
            }
        }

        if ( fragment ) {
            checkScriptType = function( elem ) {
                return !elem.type || rscriptType.test( elem.type );
            };
            for ( i = 0; ret[i]; i++ ) {
                if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
                    scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

                } else {
                    if ( ret[i].nodeType === 1 ) {
                        var jsTags = jQuery.grep( ret[i].getElementsByTagName( "script" ), checkScriptType );

                        ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                    }
                    fragment.appendChild( ret[i] );
                }
            }
        }

        return ret;
    },

    cleanData: function( elems ) {
        var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
            deleteExpando = jQuery.support.deleteExpando;

        for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
            if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
                continue;
            }

            id = elem[ jQuery.expando ];

            if ( id ) {
                data = cache[ id ] && cache[ id ][ internalKey ];

                if ( data && data.events ) {
                    for ( var type in data.events ) {
                        if ( special[ type ] ) {
                            jQuery.event.remove( elem, type );

                        // This is a shortcut to avoid jQuery.event.remove's overhead
                        } else {
                            jQuery.removeEvent( elem, type, data.handle );
                        }
                    }

                    // Null the DOM reference to avoid IE6/7/8 leak (#7054)
                    if ( data.handle ) {
                        data.handle.elem = null;
                    }
                }

                if ( deleteExpando ) {
                    delete elem[ jQuery.expando ];

                } else if ( elem.removeAttribute ) {
                    elem.removeAttribute( jQuery.expando );
                }

                delete cache[ id ];
            }
        }
    }
});

function evalScript( i, elem ) {
    if ( elem.src ) {
        jQuery.ajax({
            url: elem.src,
            async: false,
            dataType: "script"
        });
    } else {
        jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
    }

    if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
    }
}




var ralpha = /alpha\([^)]*\)/i,
    ropacity = /opacity=([^)]*)/,
    // fixed for IE9, see #8346
    rupper = /([A-Z]|^ms)/g,
    rnumpx = /^-?\d+(?:px)?$/i,
    rnum = /^-?\d/,
    rrelNum = /^([\-+])=([\-+.\de]+)/,

    cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    cssWidth = [ "Left", "Right" ],
    cssHeight = [ "Top", "Bottom" ],
    curCSS,

    getComputedStyle,
    currentStyle;

jQuery.fn.css = function( name, value ) {
    // Setting 'undefined' is a no-op
    if ( arguments.length === 2 && value === undefined ) {
        return this;
    }

    return jQuery.access( this, name, value, true, function( elem, name, value ) {
        return value !== undefined ?
            jQuery.style( elem, name, value ) :
            jQuery.css( elem, name );
    });
};

jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
        opacity: {
            get: function( elem, computed ) {
                if ( computed ) {
                    // We should always get a number back from opacity
                    var ret = curCSS( elem, "opacity", "opacity" );
                    return ret === "" ? "1" : ret;

                } else {
                    return elem.style.opacity;
                }
            }
        }
    },

    // Exclude the following css properties to add px
    cssNumber: {
        "fillOpacity": true,
        "fontWeight": true,
        "lineHeight": true,
        "opacity": true,
        "orphans": true,
        "widows": true,
        "zIndex": true,
        "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
        // normalize float css property
        "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
    },

    // Get and set the style property on a DOM Node
    style: function( elem, name, value, extra ) {
        // Don't set styles on text and comment nodes
        if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
            return;
        }

        // Make sure that we're working with the right name
        var ret, type, origName = jQuery.camelCase( name ),
            style = elem.style, hooks = jQuery.cssHooks[ origName ];

        name = jQuery.cssProps[ origName ] || origName;

        // Check if we're setting a value
        if ( value !== undefined ) {
            type = typeof value;

            // convert relative number strings (+= or -=) to relative numbers. #7345
            if ( type === "string" && (ret = rrelNum.exec( value )) ) {
                value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
                // Fixes bug #9237
                type = "number";
            }

            // Make sure that NaN and null values aren't set. See: #7116
            if ( value == null || type === "number" && isNaN( value ) ) {
                return;
            }

            // If a number was passed in, add 'px' to the (except for certain CSS properties)
            if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
                value += "px";
            }

            // If a hook was provided, use that value, otherwise just set the specified value
            if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
                // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
                // Fixes bug #5509
                try {
                    style[ name ] = value;
                } catch(e) {}
            }

        } else {
            // If a hook was provided get the non-computed value from there
            if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
                return ret;
            }

            // Otherwise just get the value from the style object
            return style[ name ];
        }
    },

    css: function( elem, name, extra ) {
        var ret, hooks;

        // Make sure that we're working with the right name
        name = jQuery.camelCase( name );
        hooks = jQuery.cssHooks[ name ];
        name = jQuery.cssProps[ name ] || name;

        // cssFloat needs a special treatment
        if ( name === "cssFloat" ) {
            name = "float";
        }

        // If a hook was provided get the computed value from there
        if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
            return ret;

        // Otherwise, if a way to get the computed value exists, use that
        } else if ( curCSS ) {
            return curCSS( elem, name );
        }
    },

    // A method for quickly swapping in/out CSS properties to get correct calculations
    swap: function( elem, options, callback ) {
        var old = {};

        // Remember the old values, and insert the new ones
        for ( var name in options ) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        callback.call( elem );

        // Revert the old values
        for ( name in options ) {
            elem.style[ name ] = old[ name ];
        }
    }
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
    jQuery.cssHooks[ name ] = {
        get: function( elem, computed, extra ) {
            var val;

            if ( computed ) {
                if ( elem.offsetWidth !== 0 ) {
                    return getWH( elem, name, extra );
                } else {
                    jQuery.swap( elem, cssShow, function() {
                        val = getWH( elem, name, extra );
                    });
                }

                return val;
            }
        },

        set: function( elem, value ) {
            if ( rnumpx.test( value ) ) {
                // ignore negative width and height values #1599
                value = parseFloat( value );

                if ( value >= 0 ) {
                    return value + "px";
                }

            } else {
                return value;
            }
        }
    };
});

if ( !jQuery.support.opacity ) {
    jQuery.cssHooks.opacity = {
        get: function( elem, computed ) {
            // IE uses filters for opacity
            return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
                ( parseFloat( RegExp.$1 ) / 100 ) + "" :
                computed ? "1" : "";
        },

        set: function( elem, value ) {
            var style = elem.style,
                currentStyle = elem.currentStyle,
                opacity = jQuery.isNaN( value ) ? "" : "alpha(opacity=" + value * 100 + ")",
                filter = currentStyle && currentStyle.filter || style.filter || "";

            // IE has trouble with opacity if it does not have layout
            // Force it by setting the zoom level
            style.zoom = 1;

            // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
            if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

                // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
                // if "filter:" is present at all, clearType is disabled, we want to avoid this
                // style.removeAttribute is IE Only, but so apparently is this code path...
                style.removeAttribute( "filter" );

                // if there there is no filter style applied in a css rule, we are done
                if ( currentStyle && !currentStyle.filter ) {
                    return;
                }
            }

            // otherwise, set new filter values
            style.filter = ralpha.test( filter ) ?
                filter.replace( ralpha, opacity ) :
                filter + " " + opacity;
        }
    };
}

jQuery(function() {
    // This hook cannot be added until DOM ready because the support test
    // for it is not run until after DOM ready
    if ( !jQuery.support.reliableMarginRight ) {
        jQuery.cssHooks.marginRight = {
            get: function( elem, computed ) {
                // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
                // Work around by temporarily setting element display to inline-block
                var ret;
                jQuery.swap( elem, { "display": "inline-block" }, function() {
                    if ( computed ) {
                        ret = curCSS( elem, "margin-right", "marginRight" );
                    } else {
                        ret = elem.style.marginRight;
                    }
                });
                return ret;
            }
        };
    }
});

if ( document.defaultView && document.defaultView.getComputedStyle ) {
    getComputedStyle = function( elem, name ) {
        var ret, defaultView, computedStyle;

        name = name.replace( rupper, "-$1" ).toLowerCase();

        if ( !(defaultView = elem.ownerDocument.defaultView) ) {
            return undefined;
        }

        if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
            ret = computedStyle.getPropertyValue( name );
            if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
                ret = jQuery.style( elem, name );
            }
        }

        return ret;
    };
}

if ( document.documentElement.currentStyle ) {
    currentStyle = function( elem, name ) {
        var left,
            ret = elem.currentStyle && elem.currentStyle[ name ],
            rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
            style = elem.style;

        // From the awesome hack by Dean Edwards
        // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

        // If we're not dealing with a regular pixel number
        // but a number that has a weird ending, we need to convert it to pixels
        if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
            // Remember the original values
            left = style.left;

            // Put in the new values to get a computed value out
            if ( rsLeft ) {
                elem.runtimeStyle.left = elem.currentStyle.left;
            }
            style.left = name === "fontSize" ? "1em" : (ret || 0);
            ret = style.pixelLeft + "px";

            // Revert the changed values
            style.left = left;
            if ( rsLeft ) {
                elem.runtimeStyle.left = rsLeft;
            }
        }

        return ret === "" ? "auto" : ret;
    };
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {

    // Start with offset property
    var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
        which = name === "width" ? cssWidth : cssHeight;

    if ( val > 0 ) {
        if ( extra !== "border" ) {
            jQuery.each( which, function() {
                if ( !extra ) {
                    val -= parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
                }
                if ( extra === "margin" ) {
                    val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
                } else {
                    val -= parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
                }
            });
        }

        return val + "px";
    }

    // Fall back to computed then uncomputed css if necessary
    val = curCSS( elem, name, name );
    if ( val < 0 || val == null ) {
        val = elem.style[ name ] || 0;
    }
    // Normalize "", auto, and prepare for extra
    val = parseFloat( val ) || 0;

    // Add padding, border, margin
    if ( extra ) {
        jQuery.each( which, function() {
            val += parseFloat( jQuery.css( elem, "padding" + this ) ) || 0;
            if ( extra !== "padding" ) {
                val += parseFloat( jQuery.css( elem, "border" + this + "Width" ) ) || 0;
            }
            if ( extra === "margin" ) {
                val += parseFloat( jQuery.css( elem, extra + this ) ) || 0;
            }
        });
    }

    return val + "px";
}

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.hidden = function( elem ) {
        var width = elem.offsetWidth,
            height = elem.offsetHeight;

        return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
    };

    jQuery.expr.filters.visible = function( elem ) {
        return !jQuery.expr.filters.hidden( elem );
    };
}




var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rhash = /#.*$/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
    rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rquery = /\?/,
    rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    rselectTextarea = /^(?:select|textarea)/i,
    rspacesAjax = /\s+/,
    rts = /([?&])_=[^&]*/,
    rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

    // Keep a copy of the old load method
    _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    // Document location
    ajaxLocation,

    // Document location segments
    ajaxLocParts,

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
    ajaxLocation = location.href;
} catch( e ) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement( "a" );
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

    // dataTypeExpression is optional and defaults to "*"
    return function( dataTypeExpression, func ) {

        if ( typeof dataTypeExpression !== "string" ) {
            func = dataTypeExpression;
            dataTypeExpression = "*";
        }

        if ( jQuery.isFunction( func ) ) {
            var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
                i = 0,
                length = dataTypes.length,
                dataType,
                list,
                placeBefore;

            // For each dataType in the dataTypeExpression
            for(; i < length; i++ ) {
                dataType = dataTypes[ i ];
                // We control if we're asked to add before
                // any existing element
                placeBefore = /^\+/.test( dataType );
                if ( placeBefore ) {
                    dataType = dataType.substr( 1 ) || "*";
                }
                list = structure[ dataType ] = structure[ dataType ] || [];
                // then we add to the structure accordingly
                list[ placeBefore ? "unshift" : "push" ]( func );
            }
        }
    };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
        dataType /* internal */, inspected /* internal */ ) {

    dataType = dataType || options.dataTypes[ 0 ];
    inspected = inspected || {};

    inspected[ dataType ] = true;

    var list = structure[ dataType ],
        i = 0,
        length = list ? list.length : 0,
        executeOnly = ( structure === prefilters ),
        selection;

    for(; i < length && ( executeOnly || !selection ); i++ ) {
        selection = list[ i ]( options, originalOptions, jqXHR );
        // If we got redirected to another dataType
        // we try there if executing only and not done already
        if ( typeof selection === "string" ) {
            if ( !executeOnly || inspected[ selection ] ) {
                selection = undefined;
            } else {
                options.dataTypes.unshift( selection );
                selection = inspectPrefiltersOrTransports(
                        structure, options, originalOptions, jqXHR, selection, inspected );
            }
        }
    }
    // If we're only executing or nothing was selected
    // we try the catchall dataType if not done already
    if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
        selection = inspectPrefiltersOrTransports(
                structure, options, originalOptions, jqXHR, "*", inspected );
    }
    // unnecessary when only executing (prefilters)
    // but it'll be ignored by the caller in that case
    return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
    var key, deep,
        flatOptions = jQuery.ajaxSettings.flatOptions || {};
    for( key in src ) {
        if ( src[ key ] !== undefined ) {
            ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
        }
    }
    if ( deep ) {
        jQuery.extend( true, target, deep );
    }
}

jQuery.fn.extend({
    load: function( url, params, callback ) {
        if ( typeof url !== "string" && _load ) {
            return _load.apply( this, arguments );

        // Don't do a request if no elements are being requested
        } else if ( !this.length ) {
            return this;
        }

        var off = url.indexOf( " " );
        if ( off >= 0 ) {
            var selector = url.slice( off, url.length );
            url = url.slice( 0, off );
        }

        // Default to a GET request
        var type = "GET";

        // If the second parameter was provided
        if ( params ) {
            // If it's a function
            if ( jQuery.isFunction( params ) ) {
                // We assume that it's the callback
                callback = params;
                params = undefined;

            // Otherwise, build a param string
            } else if ( typeof params === "object" ) {
                params = jQuery.param( params, jQuery.ajaxSettings.traditional );
                type = "POST";
            }
        }

        var self = this;

        // Request the remote document
        jQuery.ajax({
            url: url,
            type: type,
            dataType: "html",
            data: params,
            // Complete callback (responseText is used internally)
            complete: function( jqXHR, status, responseText ) {
                // Store the response as specified by the jqXHR object
                responseText = jqXHR.responseText;
                // If successful, inject the HTML into all the matched elements
                if ( jqXHR.isResolved() ) {
                    // #4825: Get the actual response in case
                    // a dataFilter is present in ajaxSettings
                    jqXHR.done(function( r ) {
                        responseText = r;
                    });
                    // See if a selector was specified
                    self.html( selector ?
                        // Create a dummy div to hold the results
                        jQuery("<div>")
                            // inject the contents of the document in, removing the scripts
                            // to avoid any 'Permission Denied' errors in IE
                            .append(responseText.replace(rscript, ""))

                            // Locate the specified elements
                            .find(selector) :

                        // If not, just inject the full result
                        responseText );
                }

                if ( callback ) {
                    self.each( callback, [ responseText, status, jqXHR ] );
                }
            }
        });

        return this;
    },

    serialize: function() {
        return jQuery.param( this.serializeArray() );
    },

    serializeArray: function() {
        return this.map(function(){
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        })
        .filter(function(){
            return this.name && !this.disabled &&
                ( this.checked || rselectTextarea.test( this.nodeName ) ||
                    rinput.test( this.type ) );
        })
        .map(function( i, elem ){
            var val = jQuery( this ).val();

            return val == null ?
                null :
                jQuery.isArray( val ) ?
                    jQuery.map( val, function( val, i ){
                        return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
                    }) :
                    { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
        }).get();
    }
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
    jQuery.fn[ o ] = function( f ){
        return this.bind( o, f );
    };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        // shift arguments if data argument was omitted
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
});

jQuery.extend({

    getScript: function( url, callback ) {
        return jQuery.get( url, undefined, callback, "script" );
    },

    getJSON: function( url, data, callback ) {
        return jQuery.get( url, data, callback, "json" );
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function( target, settings ) {
        if ( settings ) {
            // Building a settings object
            ajaxExtend( target, jQuery.ajaxSettings );
        } else {
            // Extending ajaxSettings
            settings = target;
            target = jQuery.ajaxSettings;
        }
        ajaxExtend( target, settings );
        return target;
    },

    ajaxSettings: {
        url: ajaxLocation,
        isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
        global: true,
        type: "GET",
        contentType: "application/x-www-form-urlencoded",
        processData: true,
        async: true,
        /*
        timeout: 0,
        data: null,
        dataType: null,
        username: null,
        password: null,
        cache: null,
        traditional: false,
        headers: {},
        */

        accepts: {
            xml: "application/xml, text/xml",
            html: "text/html",
            text: "text/plain",
            json: "application/json, text/javascript",
            "*": allTypes
        },

        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },

        responseFields: {
            xml: "responseXML",
            text: "responseText"
        },

        // List of data converters
        // 1) key format is "source_type destination_type" (a single space in-between)
        // 2) the catchall symbol "*" can be used for source_type
        converters: {

            // Convert anything to text
            "* text": window.String,

            // Text to html (true = no transformation)
            "text html": true,

            // Evaluate text as a json expression
            "text json": jQuery.parseJSON,

            // Parse text as xml
            "text xml": jQuery.parseXML
        },

        // For options that shouldn't be deep extended:
        // you can add your own custom options here if
        // and when you create one that shouldn't be
        // deep extended (see ajaxExtend)
        flatOptions: {
            context: true,
            url: true
        }
    },

    ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    ajaxTransport: addToPrefiltersOrTransports( transports ),

    // Main method
    ajax: function( url, options ) {

        // If url is an object, simulate pre-1.5 signature
        if ( typeof url === "object" ) {
            options = url;
            url = undefined;
        }

        // Force options to be an object
        options = options || {};

        var // Create the final options object
            s = jQuery.ajaxSetup( {}, options ),
            // Callbacks context
            callbackContext = s.context || s,
            // Context for global events
            // It's the callbackContext if one was provided in the options
            // and if it's a DOM node or a jQuery collection
            globalEventContext = callbackContext !== s &&
                ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
                        jQuery( callbackContext ) : jQuery.event,
            // Deferreds
            deferred = jQuery.Deferred(),
            completeDeferred = jQuery._Deferred(),
            // Status-dependent callbacks
            statusCode = s.statusCode || {},
            // ifModified key
            ifModifiedKey,
            // Headers (they are sent all at once)
            requestHeaders = {},
            requestHeadersNames = {},
            // Response headers
            responseHeadersString,
            responseHeaders,
            // transport
            transport,
            // timeout handle
            timeoutTimer,
            // Cross-domain detection vars
            parts,
            // The jqXHR state
            state = 0,
            // To know if global events are to be dispatched
            fireGlobals,
            // Loop variable
            i,
            // Fake xhr
            jqXHR = {

                readyState: 0,

                // Caches the header
                setRequestHeader: function( name, value ) {
                    if ( !state ) {
                        var lname = name.toLowerCase();
                        name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
                        requestHeaders[ name ] = value;
                    }
                    return this;
                },

                // Raw string
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },

                // Builds headers hashtable if needed
                getResponseHeader: function( key ) {
                    var match;
                    if ( state === 2 ) {
                        if ( !responseHeaders ) {
                            responseHeaders = {};
                            while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
                            }
                        }
                        match = responseHeaders[ key.toLowerCase() ];
                    }
                    return match === undefined ? null : match;
                },

                // Overrides response content-type header
                overrideMimeType: function( type ) {
                    if ( !state ) {
                        s.mimeType = type;
                    }
                    return this;
                },

                // Cancel the request
                abort: function( statusText ) {
                    statusText = statusText || "abort";
                    if ( transport ) {
                        transport.abort( statusText );
                    }
                    done( 0, statusText );
                    return this;
                }
            };

        // Callback for when everything is done
        // It is defined here because jslint complains if it is declared
        // at the end of the function (which would be more logical and readable)
        function done( status, nativeStatusText, responses, headers ) {

            // Called once
            if ( state === 2 ) {
                return;
            }

            // State is "done" now
            state = 2;

            // Clear timeout if it exists
            if ( timeoutTimer ) {
                clearTimeout( timeoutTimer );
            }

            // Dereference transport for early garbage collection
            // (no matter how long the jqXHR object will be used)
            transport = undefined;

            // Cache response headers
            responseHeadersString = headers || "";

            // Set readyState
            jqXHR.readyState = status > 0 ? 4 : 0;

            var isSuccess,
                success,
                error,
                statusText = nativeStatusText,
                response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
                lastModified,
                etag;

            // If successful, handle type chaining
            if ( status >= 200 && status < 300 || status === 304 ) {

                // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
                if ( s.ifModified ) {

                    if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
                        jQuery.lastModified[ ifModifiedKey ] = lastModified;
                    }
                    if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
                        jQuery.etag[ ifModifiedKey ] = etag;
                    }
                }

                // If not modified
                if ( status === 304 ) {

                    statusText = "notmodified";
                    isSuccess = true;

                // If we have data
                } else {

                    try {
                        success = ajaxConvert( s, response );
                        statusText = "success";
                        isSuccess = true;
                    } catch(e) {
                        // We have a parsererror
                        statusText = "parsererror";
                        error = e;
                    }
                }
            } else {
                // We extract error from statusText
                // then normalize statusText and status for non-aborts
                error = statusText;
                if( !statusText || status ) {
                    statusText = "error";
                    if ( status < 0 ) {
                        status = 0;
                    }
                }
            }

            // Set data for the fake xhr object
            jqXHR.status = status;
            jqXHR.statusText = "" + ( nativeStatusText || statusText );

            // Success/Error
            if ( isSuccess ) {
                deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
            } else {
                deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
            }

            // Status-dependent callbacks
            jqXHR.statusCode( statusCode );
            statusCode = undefined;

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
                        [ jqXHR, s, isSuccess ? success : error ] );
            }

            // Complete
            completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
                // Handle the global AJAX counter
                if ( !( --jQuery.active ) ) {
                    jQuery.event.trigger( "ajaxStop" );
                }
            }
        }

        // Attach deferreds
        deferred.promise( jqXHR );
        jqXHR.success = jqXHR.done;
        jqXHR.error = jqXHR.fail;
        jqXHR.complete = completeDeferred.done;

        // Status-dependent callbacks
        jqXHR.statusCode = function( map ) {
            if ( map ) {
                var tmp;
                if ( state < 2 ) {
                    for( tmp in map ) {
                        statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
                    }
                } else {
                    tmp = map[ jqXHR.status ];
                    jqXHR.then( tmp, tmp );
                }
            }
            return this;
        };

        // Remove hash character (#7531: and string promotion)
        // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
        // We also use the url parameter if available
        s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

        // Extract dataTypes list
        s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

        // Determine if a cross-domain request is in order
        if ( s.crossDomain == null ) {
            parts = rurl.exec( s.url.toLowerCase() );
            s.crossDomain = !!( parts &&
                ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
                    ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
                        ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
            );
        }

        // Convert data if not already a string
        if ( s.data && s.processData && typeof s.data !== "string" ) {
            s.data = jQuery.param( s.data, s.traditional );
        }

        // Apply prefilters
        inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

        // If request was aborted inside a prefiler, stop there
        if ( state === 2 ) {
            return false;
        }

        // We can fire global events as of now if asked to
        fireGlobals = s.global;

        // Uppercase the type
        s.type = s.type.toUpperCase();

        // Determine if request has content
        s.hasContent = !rnoContent.test( s.type );

        // Watch for a new set of requests
        if ( fireGlobals && jQuery.active++ === 0 ) {
            jQuery.event.trigger( "ajaxStart" );
        }

        // More options handling for requests with no content
        if ( !s.hasContent ) {

            // If data is available, append data to url
            if ( s.data ) {
                s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
                // #9682: remove data so that it's not used in an eventual retry
                delete s.data;
            }

            // Get ifModifiedKey before adding the anti-cache parameter
            ifModifiedKey = s.url;

            // Add anti-cache in url if needed
            if ( s.cache === false ) {

                var ts = jQuery.now(),
                    // try replacing _= if it is there
                    ret = s.url.replace( rts, "$1_=" + ts );

                // if nothing was replaced, add timestamp to the end
                s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
            }
        }

        // Set the correct header, if data is being sent
        if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
            jqXHR.setRequestHeader( "Content-Type", s.contentType );
        }

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {
            ifModifiedKey = ifModifiedKey || s.url;
            if ( jQuery.lastModified[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
            }
            if ( jQuery.etag[ ifModifiedKey ] ) {
                jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
            }
        }

        // Set the Accepts header for the server, depending on the dataType
        jqXHR.setRequestHeader(
            "Accept",
            s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
                s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
                s.accepts[ "*" ]
        );

        // Check for headers option
        for ( i in s.headers ) {
            jqXHR.setRequestHeader( i, s.headers[ i ] );
        }

        // Allow custom headers/mimetypes and early abort
        if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
                // Abort if not done already
                jqXHR.abort();
                return false;

        }

        // Install callbacks on deferreds
        for ( i in { success: 1, error: 1, complete: 1 } ) {
            jqXHR[ i ]( s[ i ] );
        }

        // Get transport
        transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

        // If no transport, we auto-abort
        if ( !transport ) {
            done( -1, "No Transport" );
        } else {
            jqXHR.readyState = 1;
            // Send global event
            if ( fireGlobals ) {
                globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
            }
            // Timeout
            if ( s.async && s.timeout > 0 ) {
                timeoutTimer = setTimeout( function(){
                    jqXHR.abort( "timeout" );
                }, s.timeout );
            }

            try {
                state = 1;
                transport.send( requestHeaders, done );
            } catch (e) {
                // Propagate exception as error if not done
                if ( state < 2 ) {
                    done( -1, e );
                // Simply rethrow otherwise
                } else {
                    jQuery.error( e );
                }
            }
        }

        return jqXHR;
    },

    // Serialize an array of form elements or a set of
    // key/values into a query string
    param: function( a, traditional ) {
        var s = [],
            add = function( key, value ) {
                // If value is a function, invoke it and return its value
                value = jQuery.isFunction( value ) ? value() : value;
                s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
            };

        // Set traditional to true for jQuery <= 1.3.2 behavior.
        if ( traditional === undefined ) {
            traditional = jQuery.ajaxSettings.traditional;
        }

        // If an array was passed in, assume that it is an array of form elements.
        if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
            // Serialize the form elements
            jQuery.each( a, function() {
                add( this.name, this.value );
            });

        } else {
            // If traditional, encode the "old" way (the way 1.3.2 or older
            // did it), otherwise encode params recursively.
            for ( var prefix in a ) {
                buildParams( prefix, a[ prefix ], traditional, add );
            }
        }

        // Return the resulting serialization
        return s.join( "&" ).replace( r20, "+" );
    }
});

function buildParams( prefix, obj, traditional, add ) {
    if ( jQuery.isArray( obj ) ) {
        // Serialize array item.
        jQuery.each( obj, function( i, v ) {
            if ( traditional || rbracket.test( prefix ) ) {
                // Treat each array item as a scalar.
                add( prefix, v );

            } else {
                // If array item is non-scalar (array or object), encode its
                // numeric index to resolve deserialization ambiguity issues.
                // Note that rack (as of 1.0.0) can't currently deserialize
                // nested arrays properly, and attempting to do so may cause
                // a server error. Possible fixes are to modify rack's
                // deserialization algorithm or to provide an option or flag
                // to force array serialization to be shallow.
                buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
            }
        });

    } else if ( !traditional && obj != null && typeof obj === "object" ) {
        // Serialize object item.
        for ( var name in obj ) {
            buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
        }

    } else {
        // Serialize scalar item.
        add( prefix, obj );
    }
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

    var contents = s.contents,
        dataTypes = s.dataTypes,
        responseFields = s.responseFields,
        ct,
        type,
        finalDataType,
        firstDataType;

    // Fill responseXXX fields
    for( type in responseFields ) {
        if ( type in responses ) {
            jqXHR[ responseFields[type] ] = responses[ type ];
        }
    }

    // Remove auto dataType and get content-type in the process
    while( dataTypes[ 0 ] === "*" ) {
        dataTypes.shift();
        if ( ct === undefined ) {
            ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
        }
    }

    // Check if we're dealing with a known content-type
    if ( ct ) {
        for ( type in contents ) {
            if ( contents[ type ] && contents[ type ].test( ct ) ) {
                dataTypes.unshift( type );
                break;
            }
        }
    }

    // Check to see if we have a response for the expected dataType
    if ( dataTypes[ 0 ] in responses ) {
        finalDataType = dataTypes[ 0 ];
    } else {
        // Try convertible dataTypes
        for ( type in responses ) {
            if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
                finalDataType = type;
                break;
            }
            if ( !firstDataType ) {
                firstDataType = type;
            }
        }
        // Or just use first one
        finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if ( finalDataType ) {
        if ( finalDataType !== dataTypes[ 0 ] ) {
            dataTypes.unshift( finalDataType );
        }
        return responses[ finalDataType ];
    }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

    // Apply the dataFilter if provided
    if ( s.dataFilter ) {
        response = s.dataFilter( response, s.dataType );
    }

    var dataTypes = s.dataTypes,
        converters = {},
        i,
        key,
        length = dataTypes.length,
        tmp,
        // Current and previous dataTypes
        current = dataTypes[ 0 ],
        prev,
        // Conversion expression
        conversion,
        // Conversion function
        conv,
        // Conversion functions (transitive conversion)
        conv1,
        conv2;

    // For each dataType in the chain
    for( i = 1; i < length; i++ ) {

        // Create converters map
        // with lowercased keys
        if ( i === 1 ) {
            for( key in s.converters ) {
                if( typeof key === "string" ) {
                    converters[ key.toLowerCase() ] = s.converters[ key ];
                }
            }
        }

        // Get the dataTypes
        prev = current;
        current = dataTypes[ i ];

        // If current is auto dataType, update it to prev
        if( current === "*" ) {
            current = prev;
        // If no auto and dataTypes are actually different
        } else if ( prev !== "*" && prev !== current ) {

            // Get the converter
            conversion = prev + " " + current;
            conv = converters[ conversion ] || converters[ "* " + current ];

            // If there is no direct converter, search transitively
            if ( !conv ) {
                conv2 = undefined;
                for( conv1 in converters ) {
                    tmp = conv1.split( " " );
                    if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
                        conv2 = converters[ tmp[1] + " " + current ];
                        if ( conv2 ) {
                            conv1 = converters[ conv1 ];
                            if ( conv1 === true ) {
                                conv = conv2;
                            } else if ( conv2 === true ) {
                                conv = conv1;
                            }
                            break;
                        }
                    }
                }
            }
            // If we found no converter, dispatch an error
            if ( !( conv || conv2 ) ) {
                jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
            }
            // If found converter is not an equivalence
            if ( conv !== true ) {
                // Convert with 1 or 2 converters accordingly
                response = conv ? conv( response ) : conv2( conv1(response) );
            }
        }
    }
    return response;
}




var jsc = jQuery.now(),
    jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        return jQuery.expando + "_" + ( jsc++ );
    }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    var inspectData = s.contentType === "application/x-www-form-urlencoded" &&
        ( typeof s.data === "string" );

    if ( s.dataTypes[ 0 ] === "jsonp" ||
        s.jsonp !== false && ( jsre.test( s.url ) ||
                inspectData && jsre.test( s.data ) ) ) {

        var responseContainer,
            jsonpCallback = s.jsonpCallback =
                jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
            previous = window[ jsonpCallback ],
            url = s.url,
            data = s.data,
            replace = "$1" + jsonpCallback + "$2";

        if ( s.jsonp !== false ) {
            url = url.replace( jsre, replace );
            if ( s.url === url ) {
                if ( inspectData ) {
                    data = data.replace( jsre, replace );
                }
                if ( s.data === data ) {
                    // Add callback manually
                    url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
                }
            }
        }

        s.url = url;
        s.data = data;

        // Install callback
        window[ jsonpCallback ] = function( response ) {
            responseContainer = [ response ];
        };

        // Clean-up function
        jqXHR.always(function() {
            // Set callback back to previous value
            window[ jsonpCallback ] = previous;
            // Call if it was a function and we have a response
            if ( responseContainer && jQuery.isFunction( previous ) ) {
                window[ jsonpCallback ]( responseContainer[ 0 ] );
            }
        });

        // Use data converter to retrieve json after script execution
        s.converters["script json"] = function() {
            if ( !responseContainer ) {
                jQuery.error( jsonpCallback + " was not called" );
            }
            return responseContainer[ 0 ];
        };

        // force json dataType
        s.dataTypes[ 0 ] = "json";

        // Delegate to script
        return "script";
    }
});




// Install script dataType
jQuery.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /javascript|ecmascript/
    },
    converters: {
        "text script": function( text ) {
            jQuery.globalEval( text );
            return text;
        }
    }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
    if ( s.cache === undefined ) {
        s.cache = false;
    }
    if ( s.crossDomain ) {
        s.type = "GET";
        s.global = false;
    }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

    // This transport only deals with cross domain requests
    if ( s.crossDomain ) {

        var script,
            head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

        return {

            send: function( _, callback ) {

                script = document.createElement( "script" );

                script.async = "async";

                if ( s.scriptCharset ) {
                    script.charset = s.scriptCharset;
                }

                script.src = s.url;

                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function( _, isAbort ) {

                    if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;

                        // Remove the script
                        if ( head && script.parentNode ) {
                            head.removeChild( script );
                        }

                        // Dereference the script
                        script = undefined;

                        // Callback if not abort
                        if ( !isAbort ) {
                            callback( 200, "success" );
                        }
                    }
                };
                // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
                // This arises when a base node is used (#2709 and #4378).
                head.insertBefore( script, head.firstChild );
            },

            abort: function() {
                if ( script ) {
                    script.onload( 0, 1 );
                }
            }
        };
    }
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
    xhrOnUnloadAbort = window.ActiveXObject ? function() {
        // Abort all pending requests
        for ( var key in xhrCallbacks ) {
            xhrCallbacks[ key ]( 0, 1 );
        }
    } : false,
    xhrId = 0,
    xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
    try {
        return new window.XMLHttpRequest();
    } catch( e ) {}
}

function createActiveXHR() {
    try {
        return new window.ActiveXObject( "Microsoft.XMLHTTP" );
    } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
    /* Microsoft failed to properly
     * implement the XMLHttpRequest in IE7 (can't request local files),
     * so we use the ActiveXObject when it is available
     * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
     * we need a fallback.
     */
    function() {
        return !this.isLocal && createStandardXHR() || createActiveXHR();
    } :
    // For all other browsers, use the standard XMLHttpRequest object
    createStandardXHR;

// Determine support properties
(function( xhr ) {
    jQuery.extend( jQuery.support, {
        ajax: !!xhr,
        cors: !!xhr && ( "withCredentials" in xhr )
    });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

    jQuery.ajaxTransport(function( s ) {
        // Cross domain only allowed if supported through XMLHttpRequest
        if ( !s.crossDomain || jQuery.support.cors ) {

            var callback;

            return {
                send: function( headers, complete ) {

                    // Get a new xhr
                    var xhr = s.xhr(),
                        handle,
                        i;

                    // Open the socket
                    // Passing null username, generates a login popup on Opera (#2865)
                    if ( s.username ) {
                        xhr.open( s.type, s.url, s.async, s.username, s.password );
                    } else {
                        xhr.open( s.type, s.url, s.async );
                    }

                    // Apply custom fields if provided
                    if ( s.xhrFields ) {
                        for ( i in s.xhrFields ) {
                            xhr[ i ] = s.xhrFields[ i ];
                        }
                    }

                    // Override mime type if needed
                    if ( s.mimeType && xhr.overrideMimeType ) {
                        xhr.overrideMimeType( s.mimeType );
                    }

                    // X-Requested-With header
                    // For cross-domain requests, seeing as conditions for a preflight are
                    // akin to a jigsaw puzzle, we simply never set it to be sure.
                    // (it can always be set on a per-request basis or even using ajaxSetup)
                    // For same-domain requests, won't change header if already provided.
                    if ( !s.crossDomain && !headers["X-Requested-With"] ) {
                        headers[ "X-Requested-With" ] = "XMLHttpRequest";
                    }

                    // Need an extra try/catch for cross domain requests in Firefox 3
                    try {
                        for ( i in headers ) {
                            xhr.setRequestHeader( i, headers[ i ] );
                        }
                    } catch( _ ) {}

                    // Do send the request
                    // This may raise an exception which is actually
                    // handled in jQuery.ajax (so no try/catch here)
                    xhr.send( ( s.hasContent && s.data ) || null );

                    // Listener
                    callback = function( _, isAbort ) {

                        var status,
                            statusText,
                            responseHeaders,
                            responses,
                            xml;

                        // Firefox throws exceptions when accessing properties
                        // of an xhr when a network error occured
                        // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
                        try {

                            // Was never called and is aborted or complete
                            if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                                // Only called once
                                callback = undefined;

                                // Do not keep as active anymore
                                if ( handle ) {
                                    xhr.onreadystatechange = jQuery.noop;
                                    if ( xhrOnUnloadAbort ) {
                                        delete xhrCallbacks[ handle ];
                                    }
                                }

                                // If it's an abort
                                if ( isAbort ) {
                                    // Abort it manually if needed
                                    if ( xhr.readyState !== 4 ) {
                                        xhr.abort();
                                    }
                                } else {
                                    status = xhr.status;
                                    responseHeaders = xhr.getAllResponseHeaders();
                                    responses = {};
                                    xml = xhr.responseXML;

                                    // Construct response list
                                    if ( xml && xml.documentElement /* #4958 */ ) {
                                        responses.xml = xml;
                                    }
                                    responses.text = xhr.responseText;

                                    // Firefox throws an exception when accessing
                                    // statusText for faulty cross-domain requests
                                    try {
                                        statusText = xhr.statusText;
                                    } catch( e ) {
                                        // We normalize with Webkit giving an empty statusText
                                        statusText = "";
                                    }

                                    // Filter status for non standard behaviors

                                    // If the request is local and we have data: assume a success
                                    // (success with no data won't get notified, that's the best we
                                    // can do given current implementations)
                                    if ( !status && s.isLocal && !s.crossDomain ) {
                                        status = responses.text ? 200 : 404;
                                    // IE - #1450: sometimes returns 1223 when it should be 204
                                    } else if ( status === 1223 ) {
                                        status = 204;
                                    }
                                }
                            }
                        } catch( firefoxAccessException ) {
                            if ( !isAbort ) {
                                complete( -1, firefoxAccessException );
                            }
                        }

                        // Call complete if needed
                        if ( responses ) {
                            complete( status, statusText, responses, responseHeaders );
                        }
                    };

                    // if we're in sync mode or it's in cache
                    // and has been retrieved directly (IE6 & IE7)
                    // we need to manually fire the callback
                    if ( !s.async || xhr.readyState === 4 ) {
                        callback();
                    } else {
                        handle = ++xhrId;
                        if ( xhrOnUnloadAbort ) {
                            // Create the active xhrs callbacks list if needed
                            // and attach the unload handler
                            if ( !xhrCallbacks ) {
                                xhrCallbacks = {};
                                jQuery( window ).unload( xhrOnUnloadAbort );
                            }
                            // Add to list of active xhrs callbacks
                            xhrCallbacks[ handle ] = callback;
                        }
                        xhr.onreadystatechange = callback;
                    }
                },

                abort: function() {
                    if ( callback ) {
                        callback(0,1);
                    }
                }
            };
        }
    });
}




var elemdisplay = {},
    iframe, iframeDoc,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
    timerId,
    fxAttrs = [
        // height animations
        [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
        // width animations
        [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
        // opacity animations
        [ "opacity" ]
    ],
    fxNow;

jQuery.fn.extend({
    show: function( speed, easing, callback ) {
        var elem, display;

        if ( speed || speed === 0 ) {
            return this.animate( genFx("show", 3), speed, easing, callback);

        } else {
            for ( var i = 0, j = this.length; i < j; i++ ) {
                elem = this[i];

                if ( elem.style ) {
                    display = elem.style.display;

                    // Reset the inline display of this element to learn if it is
                    // being hidden by cascaded rules or not
                    if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
                        display = elem.style.display = "";
                    }

                    // Set elements which have been overridden with display: none
                    // in a stylesheet to whatever the default browser style is
                    // for such an element
                    if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
                        jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                    }
                }
            }

            // Set the display of most of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                elem = this[i];

                if ( elem.style ) {
                    display = elem.style.display;

                    if ( display === "" || display === "none" ) {
                        elem.style.display = jQuery._data(elem, "olddisplay") || "";
                    }
                }
            }

            return this;
        }
    },

    hide: function( speed, easing, callback ) {
        if ( speed || speed === 0 ) {
            return this.animate( genFx("hide", 3), speed, easing, callback);

        } else {
            for ( var i = 0, j = this.length; i < j; i++ ) {
                if ( this[i].style ) {
                    var display = jQuery.css( this[i], "display" );

                    if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
                        jQuery._data( this[i], "olddisplay", display );
                    }
                }
            }

            // Set the display of the elements in a second loop
            // to avoid the constant reflow
            for ( i = 0; i < j; i++ ) {
                if ( this[i].style ) {
                    this[i].style.display = "none";
                }
            }

            return this;
        }
    },

    // Save the old toggle function
    _toggle: jQuery.fn.toggle,

    toggle: function( fn, fn2, callback ) {
        var bool = typeof fn === "boolean";

        if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
            this._toggle.apply( this, arguments );

        } else if ( fn == null || bool ) {
            this.each(function() {
                var state = bool ? fn : jQuery(this).is(":hidden");
                jQuery(this)[ state ? "show" : "hide" ]();
            });

        } else {
            this.animate(genFx("toggle", 3), fn, fn2, callback);
        }

        return this;
    },

    fadeTo: function( speed, to, easing, callback ) {
        return this.filter(":hidden").css("opacity", 0).show().end()
                    .animate({opacity: to}, speed, easing, callback);
    },

    animate: function( prop, speed, easing, callback ) {
        var optall = jQuery.speed(speed, easing, callback);

        if ( jQuery.isEmptyObject( prop ) ) {
            return this.each( optall.complete, [ false ] );
        }

        // Do not change referenced properties as per-property easing will be lost
        prop = jQuery.extend( {}, prop );

        return this[ optall.queue === false ? "each" : "queue" ](function() {
            // XXX 'this' does not always have a nodeName when running the
            // test suite

            if ( optall.queue === false ) {
                jQuery._mark( this );
            }

            var opt = jQuery.extend( {}, optall ),
                isElement = this.nodeType === 1,
                hidden = isElement && jQuery(this).is(":hidden"),
                name, val, p,
                display, e,
                parts, start, end, unit;

            // will store per property easing and be used to determine when an animation is complete
            opt.animatedProperties = {};

            for ( p in prop ) {

                // property name normalization
                name = jQuery.camelCase( p );
                if ( p !== name ) {
                    prop[ name ] = prop[ p ];
                    delete prop[ p ];
                }

                val = prop[ name ];

                // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
                if ( jQuery.isArray( val ) ) {
                    opt.animatedProperties[ name ] = val[ 1 ];
                    val = prop[ name ] = val[ 0 ];
                } else {
                    opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
                }

                if ( val === "hide" && hidden || val === "show" && !hidden ) {
                    return opt.complete.call( this );
                }

                if ( isElement && ( name === "height" || name === "width" ) ) {
                    // Make sure that nothing sneaks out
                    // Record all 3 overflow attributes because IE does not
                    // change the overflow attribute when overflowX and
                    // overflowY are set to the same value
                    opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

                    // Set display property to inline-block for height/width
                    // animations on inline elements that are having width/height
                    // animated
                    if ( jQuery.css( this, "display" ) === "inline" &&
                            jQuery.css( this, "float" ) === "none" ) {
                        if ( !jQuery.support.inlineBlockNeedsLayout ) {
                            this.style.display = "inline-block";

                        } else {
                            display = defaultDisplay( this.nodeName );

                            // inline-level elements accept inline-block;
                            // block-level elements need to be inline with layout
                            if ( display === "inline" ) {
                                this.style.display = "inline-block";

                            } else {
                                this.style.display = "inline";
                                this.style.zoom = 1;
                            }
                        }
                    }
                }
            }

            if ( opt.overflow != null ) {
                this.style.overflow = "hidden";
            }

            for ( p in prop ) {
                e = new jQuery.fx( this, opt, p );
                val = prop[ p ];

                if ( rfxtypes.test(val) ) {
                    e[ val === "toggle" ? hidden ? "show" : "hide" : val ]();

                } else {
                    parts = rfxnum.exec( val );
                    start = e.cur();

                    if ( parts ) {
                        end = parseFloat( parts[2] );
                        unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

                        // We need to compute starting value
                        if ( unit !== "px" ) {
                            jQuery.style( this, p, (end || 1) + unit);
                            start = ((end || 1) / e.cur()) * start;
                            jQuery.style( this, p, start + unit);
                        }

                        // If a +=/-= token was provided, we're doing a relative animation
                        if ( parts[1] ) {
                            end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
                        }

                        e.custom( start, end, unit );

                    } else {
                        e.custom( start, val, "" );
                    }
                }
            }

            // For JS strict compliance
            return true;
        });
    },

    stop: function( clearQueue, gotoEnd ) {
        if ( clearQueue ) {
            this.queue([]);
        }

        this.each(function() {
            var timers = jQuery.timers,
                i = timers.length;
            // clear marker counters if we know they won't be
            if ( !gotoEnd ) {
                jQuery._unmark( true, this );
            }
            while ( i-- ) {
                if ( timers[i].elem === this ) {
                    if (gotoEnd) {
                        // force the next step to be the last
                        timers[i](true);
                    }

                    timers.splice(i, 1);
                }
            }
        });

        // start the next in the queue if the last step wasn't forced
        if ( !gotoEnd ) {
            this.dequeue();
        }

        return this;
    }

});

// Animations created synchronously will run synchronously
function createFxNow() {
    setTimeout( clearFxNow, 0 );
    return ( fxNow = jQuery.now() );
}

function clearFxNow() {
    fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
    var obj = {};

    jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
        obj[ this ] = type;
    });

    return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
    slideDown: genFx("show", 1),
    slideUp: genFx("hide", 1),
    slideToggle: genFx("toggle", 1),
    fadeIn: { opacity: "show" },
    fadeOut: { opacity: "hide" },
    fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
    jQuery.fn[ name ] = function( speed, easing, callback ) {
        return this.animate( props, speed, easing, callback );
    };
});

jQuery.extend({
    speed: function( speed, easing, fn ) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing ||
                jQuery.isFunction( speed ) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };

        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
            opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

        // Queueing
        opt.old = opt.complete;
        opt.complete = function( noUnmark ) {
            if ( jQuery.isFunction( opt.old ) ) {
                opt.old.call( this );
            }

            if ( opt.queue !== false ) {
                jQuery.dequeue( this );
            } else if ( noUnmark !== false ) {
                jQuery._unmark( this );
            }
        };

        return opt;
    },

    easing: {
        linear: function( p, n, firstNum, diff ) {
            return firstNum + diff * p;
        },
        swing: function( p, n, firstNum, diff ) {
            return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
        }
    },

    timers: [],

    fx: function( elem, options, prop ) {
        this.options = options;
        this.elem = elem;
        this.prop = prop;

        options.orig = options.orig || {};
    }

});

jQuery.fx.prototype = {
    // Simple function for setting a style value
    update: function() {
        if ( this.options.step ) {
            this.options.step.call( this.elem, this.now, this );
        }

        (jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
    },

    // Get the current size
    cur: function() {
        if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
            return this.elem[ this.prop ];
        }

        var parsed,
            r = jQuery.css( this.elem, this.prop );
        // Empty strings, null, undefined and "auto" are converted to 0,
        // complex values such as "rotate(1rad)" are returned as is,
        // simple values such as "10px" are parsed to Float.
        return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
    },

    // Start an animation from one number to another
    custom: function( from, to, unit ) {
        var self = this,
            fx = jQuery.fx;

        this.startTime = fxNow || createFxNow();
        this.start = from;
        this.end = to;
        this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
        this.now = this.start;
        this.pos = this.state = 0;

        function t( gotoEnd ) {
            return self.step(gotoEnd);
        }

        t.elem = this.elem;

        if ( t() && jQuery.timers.push(t) && !timerId ) {
            timerId = setInterval( fx.tick, fx.interval );
        }
    },

    // Simple 'show' function
    show: function() {
        // Remember where we started, so that we can go back to it later
        this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
        this.options.show = true;

        // Begin the animation
        // Make sure that we start at a small width/height to avoid any
        // flash of content
        this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

        // Start by showing the element
        jQuery( this.elem ).show();
    },

    // Simple 'hide' function
    hide: function() {
        // Remember where we started, so that we can go back to it later
        this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
        this.options.hide = true;

        // Begin the animation
        this.custom(this.cur(), 0);
    },

    // Each step of an animation
    step: function( gotoEnd ) {
        var t = fxNow || createFxNow(),
            done = true,
            elem = this.elem,
            options = this.options,
            i, n;

        if ( gotoEnd || t >= options.duration + this.startTime ) {
            this.now = this.end;
            this.pos = this.state = 1;
            this.update();

            options.animatedProperties[ this.prop ] = true;

            for ( i in options.animatedProperties ) {
                if ( options.animatedProperties[i] !== true ) {
                    done = false;
                }
            }

            if ( done ) {
                // Reset the overflow
                if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

                    jQuery.each( [ "", "X", "Y" ], function (index, value) {
                        elem.style[ "overflow" + value ] = options.overflow[index];
                    });
                }

                // Hide the element if the "hide" operation was done
                if ( options.hide ) {
                    jQuery(elem).hide();
                }

                // Reset the properties, if the item has been hidden or shown
                if ( options.hide || options.show ) {
                    for ( var p in options.animatedProperties ) {
                        jQuery.style( elem, p, options.orig[p] );
                    }
                }

                // Execute the complete function
                options.complete.call( elem );
            }

            return false;

        } else {
            // classical easing cannot be used with an Infinity duration
            if ( options.duration == Infinity ) {
                this.now = t;
            } else {
                n = t - this.startTime;
                this.state = n / options.duration;

                // Perform the easing function, defaults to swing
                this.pos = jQuery.easing[ options.animatedProperties[ this.prop ] ]( this.state, n, 0, 1, options.duration );
                this.now = this.start + ((this.end - this.start) * this.pos);
            }
            // Perform the next step of the animation
            this.update();
        }

        return true;
    }
};

jQuery.extend( jQuery.fx, {
    tick: function() {
        for ( var timers = jQuery.timers, i = 0 ; i < timers.length ; ++i ) {
            if ( !timers[i]() ) {
                timers.splice(i--, 1);
            }
        }

        if ( !timers.length ) {
            jQuery.fx.stop();
        }
    },

    interval: 13,

    stop: function() {
        clearInterval( timerId );
        timerId = null;
    },

    speeds: {
        slow: 600,
        fast: 200,
        // Default speed
        _default: 400
    },

    step: {
        opacity: function( fx ) {
            jQuery.style( fx.elem, "opacity", fx.now );
        },

        _default: function( fx ) {
            if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
                fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
            } else {
                fx.elem[ fx.prop ] = fx.now;
            }
        }
    }
});

if ( jQuery.expr && jQuery.expr.filters ) {
    jQuery.expr.filters.animated = function( elem ) {
        return jQuery.grep(jQuery.timers, function( fn ) {
            return elem === fn.elem;
        }).length;
    };
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

    if ( !elemdisplay[ nodeName ] ) {

        var body = document.body,
            elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
            display = elem.css( "display" );

        elem.remove();

        // If the simple way fails,
        // get element's real default display by attaching it to a temp iframe
        if ( display === "none" || display === "" ) {
            // No iframe to use yet, so create it
            if ( !iframe ) {
                iframe = document.createElement( "iframe" );
                iframe.frameBorder = iframe.width = iframe.height = 0;
            }

            body.appendChild( iframe );

            // Create a cacheable copy of the iframe document on first call.
            // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
            // document to it; WebKit & Firefox won't allow reusing the iframe document.
            if ( !iframeDoc || !iframe.createElement ) {
                iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
                iframeDoc.write( ( document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>" );
                iframeDoc.close();
            }

            elem = iframeDoc.createElement( nodeName );

            iframeDoc.body.appendChild( elem );

            display = jQuery.css( elem, "display" );

            body.removeChild( iframe );
        }

        // Store the correct default display
        elemdisplay[ nodeName ] = display;
    }

    return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
    rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
    jQuery.fn.offset = function( options ) {
        var elem = this[0], box;

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        try {
            box = elem.getBoundingClientRect();
        } catch(e) {}

        var doc = elem.ownerDocument,
            docElem = doc.documentElement;

        // Make sure we're not dealing with a disconnected DOM node
        if ( !box || !jQuery.contains( docElem, elem ) ) {
            return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
        }

        var body = doc.body,
            win = getWindow(doc),
            clientTop  = docElem.clientTop  || body.clientTop  || 0,
            clientLeft = docElem.clientLeft || body.clientLeft || 0,
            scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
            scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
            top  = box.top  + scrollTop  - clientTop,
            left = box.left + scrollLeft - clientLeft;

        return { top: top, left: left };
    };

} else {
    jQuery.fn.offset = function( options ) {
        var elem = this[0];

        if ( options ) {
            return this.each(function( i ) {
                jQuery.offset.setOffset( this, options, i );
            });
        }

        if ( !elem || !elem.ownerDocument ) {
            return null;
        }

        if ( elem === elem.ownerDocument.body ) {
            return jQuery.offset.bodyOffset( elem );
        }

        jQuery.offset.initialize();

        var computedStyle,
            offsetParent = elem.offsetParent,
            prevOffsetParent = elem,
            doc = elem.ownerDocument,
            docElem = doc.documentElement,
            body = doc.body,
            defaultView = doc.defaultView,
            prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
            top = elem.offsetTop,
            left = elem.offsetLeft;

        while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
            if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
                break;
            }

            computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
            top  -= elem.scrollTop;
            left -= elem.scrollLeft;

            if ( elem === offsetParent ) {
                top  += elem.offsetTop;
                left += elem.offsetLeft;

                if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
                    top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                    left += parseFloat( computedStyle.borderLeftWidth ) || 0;
                }

                prevOffsetParent = offsetParent;
                offsetParent = elem.offsetParent;
            }

            if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
                top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
                left += parseFloat( computedStyle.borderLeftWidth ) || 0;
            }

            prevComputedStyle = computedStyle;
        }

        if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
            top  += body.offsetTop;
            left += body.offsetLeft;
        }

        if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
            top  += Math.max( docElem.scrollTop, body.scrollTop );
            left += Math.max( docElem.scrollLeft, body.scrollLeft );
        }

        return { top: top, left: left };
    };
}

jQuery.offset = {
    initialize: function() {
        var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
            html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

        jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

        container.innerHTML = html;
        body.insertBefore( container, body.firstChild );
        innerDiv = container.firstChild;
        checkDiv = innerDiv.firstChild;
        td = innerDiv.nextSibling.firstChild.firstChild;

        this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
        this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

        checkDiv.style.position = "fixed";
        checkDiv.style.top = "20px";

        // safari subtracts parent border width here which is 5px
        this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
        checkDiv.style.position = checkDiv.style.top = "";

        innerDiv.style.overflow = "hidden";
        innerDiv.style.position = "relative";

        this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

        this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

        body.removeChild( container );
        jQuery.offset.initialize = jQuery.noop;
    },

    bodyOffset: function( body ) {
        var top = body.offsetTop,
            left = body.offsetLeft;

        jQuery.offset.initialize();

        if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
            top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
            left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
        }

        return { top: top, left: left };
    },

    setOffset: function( elem, options, i ) {
        var position = jQuery.css( elem, "position" );

        // set position first, in-case top/left are set even on static elem
        if ( position === "static" ) {
            elem.style.position = "relative";
        }

        var curElem = jQuery( elem ),
            curOffset = curElem.offset(),
            curCSSTop = jQuery.css( elem, "top" ),
            curCSSLeft = jQuery.css( elem, "left" ),
            calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
            props = {}, curPosition = {}, curTop, curLeft;

        // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
        if ( calculatePosition ) {
            curPosition = curElem.position();
            curTop = curPosition.top;
            curLeft = curPosition.left;
        } else {
            curTop = parseFloat( curCSSTop ) || 0;
            curLeft = parseFloat( curCSSLeft ) || 0;
        }

        if ( jQuery.isFunction( options ) ) {
            options = options.call( elem, i, curOffset );
        }

        if (options.top != null) {
            props.top = (options.top - curOffset.top) + curTop;
        }
        if (options.left != null) {
            props.left = (options.left - curOffset.left) + curLeft;
        }

        if ( "using" in options ) {
            options.using.call( elem, props );
        } else {
            curElem.css( props );
        }
    }
};


jQuery.fn.extend({
    position: function() {
        if ( !this[0] ) {
            return null;
        }

        var elem = this[0],

        // Get *real* offsetParent
        offsetParent = this.offsetParent(),

        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

        // Subtract element margins
        // note: when an element has margin: auto the offsetLeft and marginLeft
        // are the same in Safari causing offset.left to incorrectly be 0
        offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
        offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

        // Add offsetParent borders
        parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
        parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

        // Subtract the two offsets
        return {
            top:  offset.top  - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    },

    offsetParent: function() {
        return this.map(function() {
            var offsetParent = this.offsetParent || document.body;
            while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        });
    }
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
    var method = "scroll" + name;

    jQuery.fn[ method ] = function( val ) {
        var elem, win;

        if ( val === undefined ) {
            elem = this[ 0 ];

            if ( !elem ) {
                return null;
            }

            win = getWindow( elem );

            // Return the scroll offset
            return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
                jQuery.support.boxModel && win.document.documentElement[ method ] ||
                    win.document.body[ method ] :
                elem[ method ];
        }

        // Set the scroll offset
        return this.each(function() {
            win = getWindow( this );

            if ( win ) {
                win.scrollTo(
                    !i ? val : jQuery( win ).scrollLeft(),
                     i ? val : jQuery( win ).scrollTop()
                );

            } else {
                this[ method ] = val;
            }
        });
    };
});

function getWindow( elem ) {
    return jQuery.isWindow( elem ) ?
        elem :
        elem.nodeType === 9 ?
            elem.defaultView || elem.parentWindow :
            false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

    var type = name.toLowerCase();

    // innerHeight and innerWidth
    jQuery.fn[ "inner" + name ] = function() {
        var elem = this[0];
        return elem && elem.style ?
            parseFloat( jQuery.css( elem, type, "padding" ) ) :
            null;
    };

    // outerHeight and outerWidth
    jQuery.fn[ "outer" + name ] = function( margin ) {
        var elem = this[0];
        return elem && elem.style ?
            parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
            null;
    };

    jQuery.fn[ type ] = function( size ) {
        // Get window width or height
        var elem = this[0];
        if ( !elem ) {
            return size == null ? null : this;
        }

        if ( jQuery.isFunction( size ) ) {
            return this.each(function( i ) {
                var self = jQuery( this );
                self[ type ]( size.call( this, i, self[ type ]() ) );
            });
        }

        if ( jQuery.isWindow( elem ) ) {
            // Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
            // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
            var docElemProp = elem.document.documentElement[ "client" + name ],
                body = elem.document.body;
            return elem.document.compatMode === "CSS1Compat" && docElemProp ||
                body && body[ "client" + name ] || docElemProp;

        // Get document width or height
        } else if ( elem.nodeType === 9 ) {
            // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
            return Math.max(
                elem.documentElement["client" + name],
                elem.body["scroll" + name], elem.documentElement["scroll" + name],
                elem.body["offset" + name], elem.documentElement["offset" + name]
            );

        // Get or set width or height on the element
        } else if ( size === undefined ) {
            var orig = jQuery.css( elem, type ),
                ret = parseFloat( orig );

            return jQuery.isNaN( ret ) ? orig : ret;

        // Set the width or height on the element (default to pixels if value is unitless)
        } else {
            return this.css( type, typeof size === "string" ? size : size + "px" );
        }
    };

});


// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;
})(window);;// $Id: drupal.js,v 1.41.2.4 2009/07/21 08:59:10 goba Exp $

var Drupal = Drupal || { 'settings': {}, 'behaviors': {}, 'themes': {}, 'locale': {} };

/**
 * Set the variable that indicates if JavaScript behaviors should be applied
 */
Drupal.jsEnabled = document.getElementsByTagName && document.createElement && document.createTextNode && document.documentElement && document.getElementById;

/**
 * Attach all registered behaviors to a page element.
 *
 * Behaviors are event-triggered actions that attach to page elements, enhancing
 * default non-Javascript UIs. Behaviors are registered in the Drupal.behaviors
 * object as follows:
 * @code
 *    Drupal.behaviors.behaviorName = function () {
 *      ...
 *    };
 * @endcode
 *
 * Drupal.attachBehaviors is added below to the jQuery ready event and so
 * runs on initial page load. Developers implementing AHAH/AJAX in their
 * solutions should also call this function after new page content has been
 * loaded, feeding in an element to be processed, in order to attach all
 * behaviors to the new content.
 *
 * Behaviors should use a class in the form behaviorName-processed to ensure
 * the behavior is attached only once to a given element. (Doing so enables
 * the reprocessing of given elements, which may be needed on occasion despite
 * the ability to limit behavior attachment to a particular element.)
 *
 * @param context
 *   An element to attach behaviors to. If none is given, the document element
 *   is used.
 */
Drupal.attachBehaviors = function(context) {
  context = context || document;
  if (Drupal.jsEnabled) {
    // Execute all of them.
    jQuery.each(Drupal.behaviors, function() {
      this(context);
    });
  }
};

/**
 * Encode special characters in a plain-text string for display as HTML.
 */
Drupal.checkPlain = function(str) {
  str = String(str);
  var replace = { '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' };
  for (var character in replace) {
    var regex = new RegExp(character, 'g');
    str = str.replace(regex, replace[character]);
  }
  return str;
};

/**
 * Translate strings to the page language or a given language.
 *
 * See the documentation of the server-side t() function for further details.
 *
 * @param str
 *   A string containing the English string to translate.
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   Based on the first character of the key, the value is escaped and/or themed:
 *    - !variable: inserted as is
 *    - @variable: escape plain text to HTML (Drupal.checkPlain)
 *    - %variable: escape text and theme as a placeholder for user-submitted
 *      content (checkPlain + Drupal.theme('placeholder'))
 * @return
 *   The translated string.
 */
Drupal.t = function(str, args) {
  // Fetch the localized version of the string.
  if (Drupal.locale.strings && Drupal.locale.strings[str]) {
    str = Drupal.locale.strings[str];
  }

  if (args) {
    // Transform arguments before inserting them
    for (var key in args) {
      switch (key.charAt(0)) {
        // Escaped only
        case '@':
          args[key] = Drupal.checkPlain(args[key]);
        break;
        // Pass-through
        case '!':
          break;
        // Escaped and placeholder
        case '%':
        default:
          args[key] = Drupal.theme('placeholder', args[key]);
          break;
      }
      str = str.replace(key, args[key]);
    }
  }
  return str;
};

/**
 * Format a string containing a count of items.
 *
 * This function ensures that the string is pluralized correctly. Since Drupal.t() is
 * called by this function, make sure not to pass already-localized strings to it.
 *
 * See the documentation of the server-side format_plural() function for further details.
 *
 * @param count
 *   The item count to display.
 * @param singular
 *   The string for the singular case. Please make sure it is clear this is
 *   singular, to ease translation (e.g. use "1 new comment" instead of "1 new").
 *   Do not use @count in the singular string.
 * @param plural
 *   The string for the plural case. Please make sure it is clear this is plural,
 *   to ease translation. Use @count in place of the item count, as in "@count
 *   new comments".
 * @param args
 *   An object of replacements pairs to make after translation. Incidences
 *   of any key in this array are replaced with the corresponding value.
 *   Based on the first character of the key, the value is escaped and/or themed:
 *    - !variable: inserted as is
 *    - @variable: escape plain text to HTML (Drupal.checkPlain)
 *    - %variable: escape text and theme as a placeholder for user-submitted
 *      content (checkPlain + Drupal.theme('placeholder'))
 *   Note that you do not need to include @count in this array.
 *   This replacement is done automatically for the plural case.
 * @return
 *   A translated string.
 */
Drupal.formatPlural = function(count, singular, plural, args) {
  var args = args || {};
  args['@count'] = count;
  // Determine the index of the plural form.
  var index = Drupal.locale.pluralFormula ? Drupal.locale.pluralFormula(args['@count']) : ((args['@count'] == 1) ? 0 : 1);

  if (index == 0) {
    return Drupal.t(singular, args);
  }
  else if (index == 1) {
    return Drupal.t(plural, args);
  }
  else {
    args['@count['+ index +']'] = args['@count'];
    delete args['@count'];
    return Drupal.t(plural.replace('@count', '@count['+ index +']'));
  }
};

/**
 * Generate the themed representation of a Drupal object.
 *
 * All requests for themed output must go through this function. It examines
 * the request and routes it to the appropriate theme function. If the current
 * theme does not provide an override function, the generic theme function is
 * called.
 *
 * For example, to retrieve the HTML that is output by theme_placeholder(text),
 * call Drupal.theme('placeholder', text).
 *
 * @param func
 *   The name of the theme function to call.
 * @param ...
 *   Additional arguments to pass along to the theme function.
 * @return
 *   Any data the theme function returns. This could be a plain HTML string,
 *   but also a complex object.
 */
Drupal.theme = function(func) {
  for (var i = 1, args = []; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  return (Drupal.theme[func] || Drupal.theme.prototype[func]).apply(this, args);
};

/**
 * Parse a JSON response.
 *
 * The result is either the JSON object, or an object with 'status' 0 and 'data' an error message.
 */
Drupal.parseJson = function (data) {
  if ((data.substring(0, 1) != '{') && (data.substring(0, 1) != '[')) {
    return { status: 0, data: data.length ? data : Drupal.t('Unspecified error') };
  }
  return eval('(' + data + ');');
};

/**
 * Freeze the current body height (as minimum height). Used to prevent
 * unnecessary upwards scrolling when doing DOM manipulations.
 */
Drupal.freezeHeight = function () {
  Drupal.unfreezeHeight();
  var div = document.createElement('div');
  $(div).css({
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: '1px',
    height: $('body').css('height')
  }).attr('id', 'freeze-height');
  $('body').append(div);
};

/**
 * Unfreeze the body height
 */
Drupal.unfreezeHeight = function () {
  $('#freeze-height').remove();
};

/**
 * Wrapper around encodeURIComponent() which avoids Apache quirks (equivalent of
 * drupal_urlencode() in PHP). This function should only be used on paths, not
 * on query string arguments.
 */
Drupal.encodeURIComponent = function (item, uri) {
  uri = uri || location.href;
  item = encodeURIComponent(item).replace(/%2F/g, '/');
  return (uri.indexOf('?q=') != -1) ? item : item.replace(/%26/g, '%2526').replace(/%23/g, '%2523').replace(/\/\//g, '/%252F');
};

/**
 * Get the text selection in a textarea.
 */
Drupal.getSelection = function (element) {
  if (typeof(element.selectionStart) != 'number' && document.selection) {
    // The current selection
    var range1 = document.selection.createRange();
    var range2 = range1.duplicate();
    // Select all text.
    range2.moveToElementText(element);
    // Now move 'dummy' end point to end point of original range.
    range2.setEndPoint('EndToEnd', range1);
    // Now we can calculate start and end points.
    var start = range2.text.length - range1.text.length;
    var end = start + range1.text.length;
    return { 'start': start, 'end': end };
  }
  return { 'start': element.selectionStart, 'end': element.selectionEnd };
};

/**
 * Build an error message from ahah response.
 */
Drupal.ahahError = function(xmlhttp, uri) {
  if (xmlhttp.status == 200) {
    if (jQuery.trim($(xmlhttp.responseText).text())) {
      var message = Drupal.t("An error occurred. \n@uri\n@text", {'@uri': uri, '@text': xmlhttp.responseText });
    }
    else {
      var message = Drupal.t("An error occurred. \n@uri\n(no information available).", {'@uri': uri, '@text': xmlhttp.responseText });
    }
  }
  else {
    var message = Drupal.t("An HTTP error @status occurred. \n@uri", {'@uri': uri, '@status': xmlhttp.status });
  }
  return message;
}

// Global Killswitch on the <html> element
if (Drupal.jsEnabled) {
  // Global Killswitch on the <html> element
  $(document.documentElement).addClass('js');
  // 'js enabled' cookie
  document.cookie = 'has_js=1; path=/';
  // Attach all behaviors.
  $(document).ready(function() {
    Drupal.attachBehaviors(this);
  });
}

/**
 * The default themes.
 */
Drupal.theme.prototype = {

  /**
   * Formats text for emphasized display in a placeholder inside a sentence.
   *
   * @param str
   *   The text to format (plain-text).
   * @return
   *   The formatted text (html).
   */
  placeholder: function(str) {
    return '<em>' + Drupal.checkPlain(str) + '</em>';
  }
};
;// $Id: jstools.js,v 1.26 2008/04/03 17:59:37 nedjo Exp $

Drupal.preventSelect = function (elt) {
  // IE hack to prevent selection of the text when users click.
  if (document.onselectstart) {
    elt.onselectstart = function () {
      return false;
    }
  }
  else {
    $(elt).mousedown(function () {
      return false;
    });
  }
};

Drupal.url = function (path, query, fragment) {
  query = query ? query : '';
  fragment = fragment ? '#' + fragment : '';
  var base = Drupal.settings.basePath;
  if (!Drupal.settings.jstools.cleanurls) {
    if (query) {
      return base + '?q=' + path + '&' + query + fragment;
    }
    else {
      return base + '?q=' + path + fragment;
    }
  }
  else {
    if (query) {
      return base + path + '?' + query + fragment;
    }
    else {
      return base + path + fragment;
    }
  }
};

/**
 * Return the Drupal path portion of an href.
 */
Drupal.getPath = function (href) {
  href = Drupal.pathPortion(href);
  // 3 is the length of the '?q=' added to the url without clean urls.
  href = href.substring(Drupal.settings.basePath.length + (Drupal.settings.jstools.cleanurls ? 0 : 3), href.length);
  var chars = ['#', '?', '&'];
  for (i in chars) {
    if (href.indexOf(chars[i]) > -1) {
      href = href.substr(0, href.indexOf(chars[i]));
    }
  }
  return href;
};

/**
 * Add a segment to the beginning of a path.
 */
Drupal.prependPath = function (href, segment) {
  href = Drupal.pathPortion(href);
  // 3 is the length of the '?q=' added to the url without clean urls.
  var baseLength = Drupal.settings.jstools.basePath.length + (Drupal.settings.jstools.cleanurls ? 0 : 3);
  var base = href.substring(0, baseLength);
  return base + segment + '/' + href.substring(baseLength, href.length);
};

/**
 * Strip off the protocol plus domain from an href.
 */
Drupal.pathPortion = function (href) {
  // Remove e.g. http://example.com if present.
  var protocol = window.location.protocol;
  if (href.substring(0, protocol.length) == protocol) {
    // 2 is the length of the '//' that normally follows the protocol
    href = href.substring(href.indexOf('/', protocol.length + 2));
  }
  return href;
};

/**
 * Scroll to a given element's vertical page position.
 */
Drupal.scrollTo = function(el) {
  var pos = Drupal.absolutePosition(el);
  window.scrollTo(0, pos.y);
};

Drupal.elementChildren = function (element) {
  var children = [];
  for (i in element) {
    if (i.substr(0, 1) != '#') {
      children[children.length] = i;
    }
  }
  return children;
};

Drupal.elementProperties = function (element) {
  var properties = [];
  for (i in element) {
    if (i.substr(0, 1) == '#') {
      properties[properties.length] = i;
    }
  }
  return properties;
};

Drupal.parseQueryString = function (href) {
  query = Drupal.getQueryString(href);
  var args = {};
  var pairs = query.split("&");
  for(var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf('=');
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    args[argname] = unescape(value.replace(/\+/g, " "));
  }
  return args;
};

Drupal.getQueryString = function (href) {
  if (href) {
    var index = href.indexOf('?');
    href = (index == -1) ? '' : href.substring(index + 1);
  }
  query = href ? href : location.search.substring(1);
  if (!Drupal.settings.jstools.cleanurls) {
    var index = query.indexOf('&');
    query = (index == -1) ? '' : query.substring(index + 1);
  }
  return query;
};

Drupal.pathMatch = function (path, paths, type) {
  // Convert paths into a regular expression.
  paths = '^' + paths + '$';
  paths = paths.replace(/\n/g, '$|^');
  paths = paths.replace(/\*/g, '.*');
  var search = path.search(new RegExp(paths)) > -1 ? true : false;
  return (type == 0) ? search : !search;
};

/**
 * Retrieves the absolute position of an element on the screen
 */
Drupal.absolutePosition = function (el) {
  var sLeft = 0, sTop = 0;
  var isDiv = /^div$/i.test(el.tagName);
  if (isDiv && el.scrollLeft) {
    sLeft = el.scrollLeft;
  }
  if (isDiv && el.scrollTop) {
    sTop = el.scrollTop;
  }
  var r = { x: el.offsetLeft - sLeft, y: el.offsetTop - sTop };
  if (el.offsetParent) {
    var tmp = Drupal.absolutePosition(el.offsetParent);
    r.x += tmp.x;
    r.y += tmp.y;
  }
  return r;
};

/**
 *  Returns the position of the mouse cursor based on the event object passed
 */
Drupal.mousePosition = function(e) {
  return { x: e.clientX + document.documentElement.scrollLeft, y: e.clientY + document.documentElement.scrollTop };
};;// $Id: activemenu.js,v 1.1 2008/03/28 16:36:44 nedjo Exp $

Drupal.behaviors.activeMenu = function (context) {
  // The elements supported. Each can designate a different uri.
  var menus = Drupal.settings.activemenu;
  for (var menu in menus) {
    $(menu + ' li.expanded:not(.activemenu-processed)').each(function () {
      Drupal.preventSelect(this);
      $(this)
        .click(function (e) {
          Drupal.activemenuToggle(this, e);
        })
        .addClass('activemenu-processed')
      });
    $(menu + ' li.collapsed:not(.activemenu-processed)').each(function() {
      if ($(this).children('ul').length > 0) {
        return;
      }
      var path = Drupal.getPath($('a:first', this).attr('href'));
      var url = Drupal.url(menus[menu]);
      var elt = this;
      Drupal.preventSelect(this);
      $(this)
        .click(function (e) {
          var offset = Drupal.mousePosition(e).x - Drupal.absolutePosition(this).x;
          var padding = $(this).css('padding-left');
          // Determine if we are in the selection area.
          if (offset < (padding.slice(-2) == "px" ? parseInt(padding) : 18)) {
            $(elt).addClass('loading');
            $.ajax({
              type: 'POST',
              url: url,
              data: {path: path},
              dataType: 'json',
              success: function (data) {
                $(elt).removeClass('loading');
                if ($(elt).children('ul').length > 0) {
                  return;
                }
                var dummy = document.createElement('div');
                $(dummy).html(data.content);
                $(elt)
                  .append($(dummy).find('li:has(> a[href*='+ path +'])').find('> ul'))
                  .removeClass('collapsed')
                  .addClass('expanded')
                  .unbind('click')
                  .click(function (e) {
                    Drupal.activemenuToggle(this, e);
                  })
                  .find('ul:first')
                  .slideDown(200);
                Drupal.attachBehaviors(elt);
              },
              error: function (xmlhttp) {
                if(xmlhttp.status >= 400)
                  alert('An HTTP error '+ xmlhttp.status +' occured.\n' + url);
              }
            });
            return false;
          }
        })
        .addClass('activemenu-processed');
    });
  }
};

Drupal.activemenuToggle = function (menu, e) {
  // Only toggle if this is the element that was clicked.
  // Otherwise, a parent li element might be toggled too.
  // Don't animate multiple times.
  if (menu == e.target && !$(menu).is('.animating')) {
    if ($(menu).is('.collapsed')) {
      $(menu)
        .addClass('animating')
        .removeClass('collapsed')
        .addClass('expanded')
        .find('ul:first')
        .slideDown(200, function(){
          $(this).parents('.animating').removeClass('animating')
        });
    } 
    else {
      $(menu)
        .addClass('animating')
        .removeClass('expanded')
        .addClass('collapsed')
        .find('ul:first')
        .slideUp(200, function(){
          $(this).parents('.animating').removeClass('animating')
        });
    }
  }
};
;<!--
function _antispam_switch_provider_js(myobj) {
  wpapikey = document.getElementById('div-antispam-wpapikey');
  tpapikey = document.getElementById('div-antispam-tpapikey');
  deapikey = document.getElementById('div-antispam-deapikey');
  if (myobj.value == 2) {
    // defensio
    deapikey.style.visibility = "visible";
    deapikey.style.height = ""; // undefined

    wpapikey.style.visibility = "hidden";
    wpapikey.style.height = 0;
    tpapikey.style.visibility = "hidden";
    tpapikey.style.height = 0;
  }
  else if (myobj.value == 1) {
    // typepad antispam
    tpapikey.style.visibility = "visible";
    tpapikey.style.height = ""; // undefined

    wpapikey.style.visibility = "hidden";
    wpapikey.style.height = 0;
    deapikey.style.visibility = "hidden";
    deapikey.style.height = 0;
  }
  else {
    // akismet
    wpapikey.style.visibility = "visible";
    wpapikey.style.height = ""; // undefined

    tpapikey.style.visibility = "hidden";
    tpapikey.style.height = 0;
    deapikey.style.visibility = "hidden";
    deapikey.style.height = 0;
  }
}
// -->
;/* $Id: img_assist.js,v 1.6.4.2 2008/07/22 23:08:13 sun Exp $ */

Drupal.behaviors.img_assist = function(context) {
  $('textarea.img_assist:not(.img_assist-processed)', context).each(function() {
    // Drupal's teaser behavior is a destructive one and needs to be run first.
    if ($(this).is('textarea.teaser:not(.teaser-processed)')) {
      Drupal.behaviors.teaser(context);  
    }
    $(this).addClass('img_assist-processed').parent().append(Drupal.theme('img_assist_link', this));
  });
}

Drupal.theme.prototype.img_assist_link = function(el) {
  var html = '<div class="img_assist-button">', link = Drupal.t('Add image');
  if (Drupal.settings.img_assist.link == 'icon') {
    link = '<img src="'+ Drupal.settings.basePath + Drupal.settings.img_assist.icon +'" alt="'+ link +'" title="'+ link +'" />';
  }
  html += '<a href="'+ Drupal.settings.basePath +'index.php?q=img_assist/load/textarea&textarea='+ el.name +'" class="img_assist-link" id="img_assist-link-'+ el.id +'" title="'+ Drupal.t('Click here to add images') +'" onclick="window.open(this.href, \'img_assist_link\', \'width=600,height=350,scrollbars=yes,status=yes,resizable=yes,toolbar=no,menubar=no\'); return false;">'+ link +'</a>';
  html += '</div>';
  return html;
}

function launch_popup(nid, mw, mh) {
  var ox = mw;
  var oy = mh;
  if((ox>=screen.width) || (oy>=screen.height)) {
    var ox = screen.width-150;
    var oy = screen.height-150;
    var winx = (screen.width / 2)-(ox / 2);
    var winy = (screen.height / 2)-(oy / 2);
    var use_scrollbars = 1;
  }
  else {
    var winx = (screen.width / 2)-(ox / 2);
    var winy = (screen.height / 2)-(oy / 2);
    var use_scrollbars = 0;
  }
  var win = window.open(Drupal.settings.basePath + 'index.php?q=img_assist/popup/' + nid, 'imagev', 'height='+oy+'-10,width='+ox+',top='+winy+',left='+winx+',scrollbars='+use_scrollbars+',resizable');
}

;// $Id: nice_menus.js,v 1.16 2008/08/04 23:45:22 add1sun Exp $

// We need to do some browser sniffing to weed out IE 6 only
// because only IE6 needs this hover hack.
if (document.all && !window.opera && (navigator.appVersion.search("MSIE 6.0") != -1) && $.browser.msie) {
  function IEHoverPseudo() {
      $("ul.nice-menu li.menuparent").hover(function(){
          $(this).addClass("over").find("> ul").show().addShim();
        },function(){
          $(this).removeClass("over").find("> ul").removeShim().hide();
        }
      );
      // Add a hover class to all li for CSS styling. Silly naming is done
      // so we don't break CSS compatibility for .over class already in use
      // and due to the fact that IE6 doesn't understand multiple selectors.
      $("ul.nice-menu li").hover(function(){
          $(this).addClass("ie-over");
        },function(){
          $(this).removeClass("ie-over");
        }
      );
    }

    // This is the jquery method of adding a function
    // to the BODY onload event.  (See jquery.com)
    $(document).ready(function(){ IEHoverPseudo() });
}

$.fn.addShim = function() {
  return this.each(function(){
	  if(document.all && $("select").size() > 0) {
	    var ifShim = document.createElement('iframe');
	    ifShim.src = "javascript:false";
			ifShim.style.width=$(this).width()+1+"px";
      ifShim.style.height=$(this).find("> li").size()*23+20+"px";
			ifShim.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
		  ifShim.style.zIndex="0";
    $(this).prepend(ifShim);
      $(this).css("zIndex","99");
		}
	});
};

$.fn.removeShim = function() {
  return this.each(function(){
	  if (document.all) $("iframe", this).remove();
	});
};
;			$.fn.stickyfloat = function(options, lockBottom) {
				var $obj 				= this;
				var parentPaddingTop 	= parseInt($obj.parent().css('padding-top'));
				var startOffset 		= $obj.parent().offset().top;
				var opts 				= $.extend({ startOffset: startOffset, offsetY: parentPaddingTop, duration: 200, lockBottom:true }, options);
				
				$obj.css({ position: 'absolute' });
				
				if(opts.lockBottom){
					var bottomPos = $obj.parent().height() - $obj.height() + parentPaddingTop;
					if( bottomPos < 0 )
						bottomPos = 0;
				}
				
				$(window).scroll(function () { 
					$obj.stop(); 

					var pastStartOffset			= $(document).scrollTop() > opts.startOffset;	
					var objFartherThanTopPos	= $obj.offset().top > startOffset;	
					var objBiggerThanWindow 	= $obj.outerHeight() < $(window).height();	

					if( (pastStartOffset || objFartherThanTopPos) && objBiggerThanWindow ){ 
						var newpos = ($(document).scrollTop() -startOffset + opts.offsetY );
						if ( newpos > bottomPos )
							newpos = bottomPos;
						if ( $(document).scrollTop() < opts.startOffset ) 
							newpos = parentPaddingTop;
			
						$obj.animate({ top: newpos }, opts.duration );
					}
				});
			};

;/*
	Redactor v8.0.3
	Updated: September 3, 2012
	
	http://redactorjs.com/
	
	Copyright (c) 2009-2012, Imperavi Inc.
	License: http://redactorjs.com/license/
	
	Usage: $('#content').redactor();
*/

// selection mechanism
var _0xf6db=["(6(){11 49=24;11 14={50:6(8,10){5 10.58(8)\x2692},57:6(8,10){7(8.58!=12){5 8.58(10)\x2616}46{5 8.57(10)}},55:6(8,18,10,20){7(8===10){5 18\x3C=20}7(14.29(8)\x26\x2614.29(10)){5 14.50(8,10)}7(14.29(8)\x26\x26!14.29(10)){5!14.55(10,20,8,18)}7(!14.57(8,10)){5 14.50(8,10)}7(8.47.85\x3C=18){5 40}7(8.47[18]===10){5 0\x3C=20}5 14.50(8.47[18],10)},29:6(61){5(61!=12?61.93==3:40)},81:6(41){11 62=0;88(41=41.59){62++}5 62}};11 4=49.4=(6(){6 4(2){24.2=2}4.34.31=6(){5 4.31(24.2)};4.34.37=6(){5 4.37(24.2)};4.34.38=6(){5 4.38(24.2)};4.34.45=6(){5 4.45(24.2)};4.34.44=6(){5 4.44(24.2)};4.34.52=6(25,26,23,22){5 4.52(24.2,25,26,23,22)};4.34.51=6(){5 4.51(24.2)};5 4})();7(49.35){4.67=43;4.31=6(2){11 9;5(9=2.35())\x26\x26(9.63!=12)\x26\x26(9.36!=12)};4.37=6(2){11 9;7(!((9=2.35())\x26\x26(9.36!=12))){5 12}5[9.36,9.97]};4.38=6(2){11 9;7(!((9=2.35())\x26\x26(9.63!=12))){5 12}5[9.63,9.91]};4.45=6(2){11 8,10,18,20,27,28;7(!4.31(2)){5 12}27=4.37(2),8=27[0],18=27[1];28=4.38(2),10=28[0],20=28[1];7(14.55(8,18,10,20)){5[8,18]}5[10,20]};4.44=6(2){11 8,10,18,20,27,28;7(!4.31(2)){5 12}27=4.37(2),8=27[0],18=27[1];28=4.38(2),10=28[0],20=28[1];7(14.55(8,18,10,20)){5[10,20]}5[8,18]};4.52=6(2,25,26,23,22){11 9=2.35();7(!9){5}7(23==12){23=25}7(22==12){22=26}7(9.60\x26\x269.79){9.60(25,26);9.79(23,22)}46{54=2.15.56();54.106(25,26);54.107(23,22);71{9.73()}80(41){}9.98(54)}};4.51=6(2){71{11 9=2.35();7(!9){5}9.73()}80(41){}}}46 7(49.15.39){11 69=6(42,32,30){11 19,13,21,33,64;13=42.90(\x2789\x27);19=32.103();19.60(30);64=19.77();88(43){64.86(13,13.59);19.82(13);7(!(19.87((30?\x2766\x27:\x2783\x27),32)\x3E0\x26\x26(13.59!=12))){99}}7(19.87((30?\x2766\x27:\x2783\x27),32)===-1\x26\x2613.84){19.74((30?\x27100\x27:\x2778\x27),32);21=13.84;33=19.101.85}46{21=13.48;33=14.81(13)}13.48.72(13);5[21,33]};11 68=6(42,32,30,21,33){11 36,65,19,13,53;53=0;36=14.29(21)?21:21.47[33];65=14.29(21)?21.48:21;7(14.29(21)){53=33}13=42.90(\x2789\x27);65.86(13,36||12);19=42.76.75();19.82(13);13.48.72(13);32.74((30?\x2766\x27:\x2778\x27),19);5 32[30?\x27105\x27:\x27104\x27](\x27102\x27,53)};4.67=43;4.31=6(2){11 17;2.70();7(!2.15.39){5 40}17=2.15.39.56();5 17\x26\x2617.77().15===2.15};4.45=6(2){11 17;2.70();7(!4.31(2)){5 12}17=2.15.39.56();5 69(2.15,17,43)};4.44=6(2){11 17;2.70();7(!4.31(2)){5 12}17=2.15.39.56();5 69(2.15,17,40)};4.37=6(2){5 4.45(2)};4.38=6(2){5 4.44(2)};4.52=6(2,25,26,23,22){7(23==12){23=25}7(22==12){22=26}11 17=2.15.76.75();68(2.15,17,40,23,22);68(2.15,17,43,25,26);5 17.96()};4.51=6(2){5 2.15.39.95()}}46{4.67=40}}).94(24);","|","split","||win||Selection|return|function|if|n1|sel|n2|var|null|cursorNode|Dom|document||range|o1|cursor|o2|node|foco|focn|this|orgn|orgo|_ref|_ref2|isText|bStart|hasSelection|textRange|offset|prototype|getSelection|anchorNode|getOrigin|getFocus|selection|false|e|doc|true|getEnd|getStart|else|childNodes|parentNode|root|isPreceding|clearSelection|setSelection|textOffset|r|isCursorPreceding|createRange|contains|compareDocumentPosition|previousSibling|collapse|d|k|focusNode|parent|anchorParent|StartToStart|supported|moveBoundary|getBoundary|focus|try|removeChild|removeAllRanges|setEndPoint|createTextRange|body|parentElement|EndToEnd|extend|catch|getChildIndex|moveToElementText|StartToEnd|nextSibling|length|insertBefore|compareEndPoints|while|a|createElement|focusOffset|0x02|nodeType|call|empty|select|anchorOffset|addRange|break|EndToStart|text|character|duplicate|moveEnd|moveStart|setStart|setEnd","replace","","\x5Cw+","\x5Cb","g"];eval(function (p,a,c,k,e,d){e=function (c){return c;} ;if(!_0xf6db[5][_0xf6db[4]](/^/,String)){while(c--){d[c]=k[c]||c;} ;k=[function (e){return d[e];} ];e=function (){return _0xf6db[6];} ;c=1;} ;while(c--){if(k[c]){p=p[_0xf6db[4]]( new RegExp(_0xf6db[7]+e(c)+_0xf6db[7],_0xf6db[8]),k[c]);} ;} ;return p;} (_0xf6db[0],10,108,_0xf6db[3][_0xf6db[2]](_0xf6db[1]),0,{}));

if (typeof RELANG === 'undefined')
{
	var RELANG = {};
}

var RLANG = {
	html: 'HTML',
	video: 'Insert Video...',
	image: 'Insert Image...',
	table: 'Table',
	link: 'Link',
	link_insert: 'Insert Link ...',
	unlink: 'Unlink',
	formatting: 'Formatting',
	paragraph: 'Paragraph',
	quote: 'Quote',
	code: 'Code',
	header1: 'Header 1',
	header2: 'Header 2',
	header3: 'Header 3',
	header4: 'Header 4',
	bold:  'Bold',
	italic: 'Italic',
	fontcolor: 'Font Color',
	backcolor: 'Back Color',
	unorderedlist: 'Unordered List',
	orderedlist: 'Ordered List',
	outdent: 'Outdent',
	indent: 'Indent',
	cancel: 'Cancel',
	insert: 'Insert',
	save: 'Save',
	_delete: 'Delete',
	insert_table: 'Insert Table...',
	insert_row_above: 'Add Row Above',
	insert_row_below: 'Add Row Below',
	insert_column_left: 'Add Column Left',
	insert_column_right: 'Add Column Right',
	delete_column: 'Delete Column',
	delete_row: 'Delete Row',
	delete_table: 'Delete Table',
	rows: 'Rows',
	columns: 'Columns',	
	add_head: 'Add Head',
	delete_head: 'Delete Head',	
	title: 'Title',
	image_position: 'Position',
	none: 'None',
	left: 'Left',
	right: 'Right',
	image_web_link: 'Image Web Link',
	text: 'Text',
	mailto: 'Email',
	web: 'URL',
	video_html_code: 'Video Embed Code',
	file: 'Insert File...',	
	upload: 'Upload',
	download: 'Download',
	choose: 'Choose',
	or_choose: 'Or choose',
	drop_file_here: 'Drop file here',
	align_left:	'Align Left',	
	align_center: 'Align Center',
	align_right: 'Align Right',
	align_justify: 'Justify',
	horizontalrule: 'Insert Horizontal Rule',
	deleted: 'Deleted',
	anchor: 'Anchor',
	link_new_tab: 'Open link in new tab'
};

(function($){

	// Plugin
	jQuery.fn.redactor = function(option)
	{
		return this.each(function() 
		{
			var $obj = $(this);
			
			var data = $obj.data('redactor');
			if (!data) 
			{
				$obj.data('redactor', (data = new Redactor(this, option)));
			}
		});
	};
	
	
	// Initialization
	var Redactor = function(element, options)
	{
		// Element
		this.$el = $(element);
		
		// Lang
		if (typeof options !== 'undefined' && typeof options.lang !== 'undefined' && options.lang !== 'en' && typeof RELANG[options.lang] !== 'undefined') 
		{
			RLANG = RELANG[options.lang];
		}		
	
		// Options
		this.opts = $.extend({
	
			lang: 'en',
			direction: 'ltr', // ltr or rtl
	
			callback: false, // function
			keyupCallback: false, // function
			keydownCallback: false, // function
			execCommandCallback: false, // function
		
			cleanup: true,
		
			focus: false,
			tabindex: false,
			autoresize: true,
			minHeight: false,
			fixed: false,
			fixedTop: 0, // pixels
			fixedBox: false,
			source: true,
			shortcuts: true,
	
			mobile: true,
			air: false,
			wym: false,
			
			paragraphy: true,		
			convertLinks: true,
			convertDivs: true,
			protocol: 'http://', // for links http or https
	
			autosave: false, // false or url
			autosaveCallback: false, // function
			interval: 60, // seconds
	
			imageGetJson: false, // url (ex. /folder/images.json ) or false
			
			imageUpload: false, // url
			imageUploadCallback: false, // function
			
			fileUpload: false, // url
			fileUploadCallback: false, // function
	
			uploadCrossDomain: false,
			uploadFields: false,
	
			observeImages: true,
			overlay: true, // modal overlay
			
			allowedTags: ["code", "span", "div", "label", "a", "br", "p", "b", "i", "del", "strike", "u", 
					"img", "video", "audio", "iframe", "object", "embed", "param", "blockquote", 
					"mark", "cite", "small", "ul", "ol", "li", "hr", "dl", "dt", "dd", "sup", "sub", 
					"big", "pre", "code", "figure", "figcaption", "strong", "em", "table", "tr", "td", 
					"th", "tbody", "thead", "tfoot", "h1", "h2", "h3", "h4", "h5", "h6"],
			
			buttonsCustom: {},
			buttonsAdd: [],
			buttons: ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
					'image', 'video', 'file', 'table', 'link', '|',
					'fontcolor', 'backcolor', '|', 'alignleft', 'aligncenter', 'alignright', 'justify', '|', 'horizontalrule'],
	
			airButtons: ['formatting', '|', 'bold', 'italic', 'deleted', '|', 'unorderedlist', 'orderedlist', 'outdent', 'indent', '|', 'fontcolor', 'backcolor'],
	
			colors: [
				'#ffffff', '#000000', '#eeece1', '#1f497d', '#4f81bd', '#c0504d', '#9bbb59', '#8064a2', '#4bacc6', '#f79646', '#ffff00',
				'#f2f2f2', '#7f7f7f', '#ddd9c3', '#c6d9f0', '#dbe5f1', '#f2dcdb', '#ebf1dd', '#e5e0ec', '#dbeef3', '#fdeada', '#fff2ca',
				'#d8d8d8', '#595959', '#c4bd97', '#8db3e2', '#b8cce4', '#e5b9b7', '#d7e3bc', '#ccc1d9', '#b7dde8', '#fbd5b5', '#ffe694',
				'#bfbfbf', '#3f3f3f', '#938953', '#548dd4', '#95b3d7', '#d99694', '#c3d69b', '#b2a2c7', '#b7dde8', '#fac08f', '#f2c314',
				'#a5a5a5', '#262626', '#494429', '#17365d', '#366092', '#953734', '#76923c', '#5f497a', '#92cddc', '#e36c09', '#c09100',
				'#7f7f7f', '#0c0c0c', '#1d1b10', '#0f243e', '#244061', '#632423', '#4f6128', '#3f3151', '#31859b', '#974806', '#7f6000'],
	
			// private
			allEmptyHtml: '<p><br /></p>',
			mozillaEmptyHtml: '<p>&nbsp;</p>',
			buffer: false,
			visual: true,
						
			// modal windows container
			modal_file: String() + 
				'<form id="redactorUploadFileForm" method="post" action="" enctype="multipart/form-data">' +
					'<label>Name (optional)</label>' +
					'<input type="text" id="redactor_filename" class="redactor_input" />' +
					'<div style="margin-top: 7px;">' +
						'<input type="file" id="redactor_file" name="file" />' +
					'</div>' +
				'</form>',
	
			modal_image_edit: String() + 
				'<label>' + RLANG.title + '</label>' +
				'<input id="redactor_file_alt" class="redactor_input" />' +
				'<label>' + RLANG.link + '</label>' +
				'<input id="redactor_file_link" class="redactor_input" />' +
				'<label>' + RLANG.image_position + '</label>' +
				'<select id="redactor_form_image_align">' +
					'<option value="none">' + RLANG.none + '</option>' +
					'<option value="left">' + RLANG.left + '</option>' +
					'<option value="right">' + RLANG.right + '</option>' +
				'</select>' +
				'<div id="redactor_modal_footer">' +
					'<a href="javascript:void(null);" id="redactor_image_delete_btn" style="color: #000;">' + RLANG._delete + '</a>' +
					'<span class="redactor_btns_box">' +
						'<input type="button" name="save" id="redactorSaveBtn" value="' + RLANG.save + '" />' +
						'<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
					'</span>' +
				'</div>',
	
			modal_image: String() + 
				'<div id="redactor_tabs">' +
					'<a href="javascript:void(null);" class="redactor_tabs_act">' + RLANG.upload + '</a>' +
					'<a href="javascript:void(null);">' + RLANG.choose + '</a>' +
					'<a href="javascript:void(null);">' + RLANG.link + '</a>' +
				'</div>' +
				'<form id="redactorInsertImageForm" method="post" action="" enctype="multipart/form-data">' +
					'<div id="redactor_tab1" class="redactor_tab">' +
						'<input type="file" id="redactor_file" name="file" />' +
					'</div>' +
					'<div id="redactor_tab2" class="redactor_tab" style="display: none;">' +
						'<div id="redactor_image_box"></div>' +
					'</div>' +
				'</form>' +
				'<div id="redactor_tab3" class="redactor_tab" style="display: none;">' +
					'<label>' + RLANG.image_web_link + '</label>' +
					'<input name="redactor_file_link" id="redactor_file_link" class="redactor_input"  />' +
				'</div>' +
				'<div id="redactor_modal_footer">' +
					'<span class="redactor_btns_box">' +
						'<input type="button" name="upload" id="redactor_upload_btn" value="' + RLANG.insert + '" />' +
						'<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
					'</span>' +
				'</div>',
	
			modal_link: String() + 
				'<form id="redactorInsertLinkForm" method="post" action="">' +
					'<div id="redactor_tabs">' +
						'<a href="javascript:void(null);" class="redactor_tabs_act">URL</a>' +
						'<a href="javascript:void(null);">Email</a>' +
						'<a href="javascript:void(null);">' + RLANG.anchor + '</a>' +
					'</div>' +
					'<input type="hidden" id="redactor_tab_selected" value="1" />' +
					'<div class="redactor_tab" id="redactor_tab1">' +
						'<label>URL</label><input id="redactor_link_url" class="redactor_input"  />' +
						'<label>' + RLANG.text + '</label><input class="redactor_input redactor_link_text" id="redactor_link_url_text" />' +
						'<label><input type="checkbox" id="redactor_link_blank"> ' + RLANG.link_new_tab + 
					'</div>' +
					'<div class="redactor_tab" id="redactor_tab2" style="display: none;">' +
						'<label>Email</label><input id="redactor_link_mailto" class="redactor_input" />' +
						'<label>' + RLANG.text + '</label><input class="redactor_input redactor_link_text" id="redactor_link_mailto_text" />' +
					'</div>' +
					'<div class="redactor_tab" id="redactor_tab3" style="display: none;">' +
						'<label>' + RLANG.anchor + '</label><input class="redactor_input" id="redactor_link_anchor"  />' +
						'<label>' + RLANG.text + '</label><input class="redactor_input redactor_link_text" id="redactor_link_anchor_text" />' +
					'</div>' +
				'</form>' +
				'<div id="redactor_modal_footer">' +
					'<span class="redactor_btns_box">' +
						'<input type="button" id="redactor_insert_link_btn" value="' + RLANG.insert + '" />' +
						'<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
					'</span>' +
				'</div>',
			
			modal_table: String() + 
					'<label>' + RLANG.rows + '</label>' +
					'<input size="5" value="2" id="redactor_table_rows" />' +
					'<label>' + RLANG.columns + '</label>' +
					'<input size="5" value="3" id="redactor_table_columns" />' +
					'<div id="redactor_modal_footer">' +
						'<span class="redactor_btns_box">' +
							'<input type="button" name="upload" id="redactor_insert_table_btn" value="' + RLANG.insert + '" />' +
							'<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
						'</span>' +
					'</div>',
			
			modal_video: String() + 
				'<form id="redactorInsertVideoForm">' +
					'<label>' + RLANG.video_html_code + '</label>' +
					'<textarea id="redactor_insert_video_area" style="width: 99%; height: 160px;"></textarea>' +
				'</form>' +
				'<div id="redactor_modal_footer">' +
					'<span class="redactor_btns_box">' +
						'<input type="button" id="redactor_insert_video_btn" value="' + RLANG.insert + '" />' +
						'<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
					'</span>' +
				'</div>',

            modal_code: String() +
                '<label>Language</label>'+
                '<select id="redactor_code_syntax">' +
                '<option value="as3">ActionScript 3</option>' +
                '<option value="shell">Shell</option>' +
                '<option value="csharp">C#</option>' +
                '<option value="cpp">C++</option>' +
                '<option value="css">CSS</option>' +
                '<option value="groovy">Groovy</option>' +
                '<option value="javascript">JavaScript</option>' +
                '<option value="java">Java</option>' +
                '<option value="javafx">JavaFX</option>' +
                '<option value="perl">Perl</option>' +
                '<option value="php">PHP</option>' +
                '<option value="python">Python</option>' +
                '<option value="ruby">Ruby</option>' +
                '<option value="sql">SQL</option>' +
                '<option value="vbnet">Visual Basic</option>' +
                '<option value="xml">XML</option>' +
            '</select>' +
            '<form id="redactorInsertCodeForm" method="post">' +
                '<label>Code Snippet</label><textarea id="redactor_code" class="redactor_input"  />' +
                '</form>' +
                '<div id="redactor_modal_footer">' +
                '<span class="redactor_btns_box">' +
                '<input type="button" id="redactor_insert_code_button" value="' + RLANG.insert + '" />' +
                '<a href="javascript:void(null);" id="redactor_btn_modal_close">' + RLANG.cancel + '</a>' +
                '</span>' +
                '</div>',
	
	
			toolbar: {
				html:
				{
					title: RLANG.html,
					func: 'toggle'
				},
				formatting:
				{
					title: RLANG.formatting,
					func: 'show',
					dropdown: 
					{
						p:
						{
							title: RLANG.paragraph,
							exec: 'formatblock'
						},
						blockquote:
						{
							title: RLANG.quote,
							exec: 'formatblock',	
							className: 'redactor_format_blockquote'
						},
						pre:
						{
							title: RLANG.code,
							exec: 'formatblock',
							className: 'redactor_format_pre'
						},
						h1:
						{
							title: RLANG.header1,
							exec: 'formatblock',
							className: 'redactor_format_h1'
						},
						h2:
						{
							title: RLANG.header2,
							exec: 'formatblock',
							className: 'redactor_format_h2'
						},
						h3:
						{
							title: RLANG.header3,
							exec: 'formatblock',
							className: 'redactor_format_h3'
						},
						h4:
						{
							title: RLANG.header4,
							exec: 'formatblock',
							className: 'redactor_format_h4'
						}
					}
				},
				bold:
				{ 
					title: RLANG.bold,
					exec: 'bold'	
				}, 
				italic:
				{
					title: RLANG.italic,
					exec: 'italic'
				},
				deleted:
				{
					title: RLANG.deleted,
					exec: 'strikethrough'
				},	
				unorderedlist:
				{
					title: '&bull; ' + RLANG.unorderedlist,
					exec: 'insertunorderedlist'
				},
				orderedlist:
				{
					title: '1. ' + RLANG.orderedlist,
					exec: 'insertorderedlist'
				},
				outdent:
				{
					title: '< ' + RLANG.outdent,
					exec: 'outdent'	
				},
				indent:
				{
					title: '> ' + RLANG.indent,
					exec: 'indent'
				},
				image:
				{
					title: RLANG.image,
					func: 'showImage'
				},
				video:
				{
					title: RLANG.video,
					func: 'showVideo'
				},
				file:
				{
					title: RLANG.file,
					func: 'showFile'
				},	
				table:
				{ 
					title: RLANG.table,
					func: 'show',
					dropdown:
					{
						insert_table:	
						{
							title: RLANG.insert_table,
							func: 'showTable'
						},
						separator_drop1:
						{
							name: 'separator'
						},
						insert_row_above:
						{
							title: RLANG.insert_row_above,
							func: 'insertRowAbove'
						},
						insert_row_below:
						{
							title: RLANG.insert_row_below,
							func: 'insertRowBelow'
						},
						insert_column_left:
						{
							title: RLANG.insert_column_left,
							func: 'insertColumnLeft'
						},
						insert_column_right:
						{
							title: RLANG.insert_column_right,
							func: 'insertColumnRight'
						},
						separator_drop2:
						{
							name: 'separator'
						},
						add_head:
						{
							title: RLANG.add_head,
							func: 'addHead'
						},
						delete_head:
						{
							title: RLANG.delete_head,
							func: 'deleteHead'
						},
						separator_drop3:
						{
							name: 'separator'
						},
						delete_column:
						{
							title: RLANG.delete_column,
							func: 'deleteColumn'
						},
						delete_row:
						{
							title: RLANG.delete_row,
							func: 'deleteRow'
						},
						delete_table:
						{
							title: RLANG.delete_table,
							func: 'deleteTable'
						}
					}
				},
				link:
				{ 
					title: RLANG.link,
					func: 'show',
					dropdown:
					{
						link:
						{
							title: RLANG.link_insert,
							func: 'showLink'
						},
						unlink: 
						{
							title: RLANG.unlink,
							exec: 'unlink'
						}
					}
				},
				fontcolor:
				{
					title: RLANG.fontcolor,
					func: 'show'
				},	
				backcolor:
				{
					title: RLANG.backcolor,
					func: 'show'	
				},
				alignleft:
				{	
					exec: 'JustifyLeft',
					title: RLANG.align_left
				},					
				aligncenter:
				{
					exec: 'JustifyCenter',
					title: RLANG.align_center
				},
				alignright: 
				{
					exec: 'JustifyRight',
					title: RLANG.align_right
				},	
				justify: 
				{
					exec: 'justifyfull',
					title: RLANG.align_justify
				},	
				horizontalrule: 
				{
					exec: 'inserthorizontalrule',
					title: RLANG.horizontalrule
				}	
			}
			
	
		}, options, this.$el.data());
	
		this.dropdowns = [];
	
		// Init
		this.init();
	};
	
	// Functionality
	Redactor.prototype = {
	
	
		// Initialization
		init: function()
		{	
	
			// get dimensions
			this.height = this.$el.css('height');
			this.width = this.$el.css('width');		
		
			// mobile
			if (this.opts.mobile === false && this.isMobile())
			{
				this.build(true);
				return false;
			}
			
			if (this.opts.paragraphy === false)
			{
				this.opts.convertDivs = false;
			}
		
			// extend buttons
			if (this.opts.air)
			{
				this.opts.buttons = this.opts.airButtons;
			}
			else if (this.opts.toolbar !== false)
			{
				if (this.opts.source === false)
				{
					var index = this.opts.buttons.indexOf('html');	
					var next = this.opts.buttons[index+1];				
					this.opts.buttons.splice(index, 1);
					if (typeof next !== 'undefined' && next === '|')
					{
						this.opts.buttons.splice(index, 1);
					}
				}				
			
				$.extend(this.opts.toolbar, this.opts.buttonsCustom);			
				$.each(this.opts.buttonsAdd, $.proxy(function(i,s)
				{
					this.opts.buttons.push(s);
					
				}, this));
			}
	
			// construct editor
			this.build();
			
			// air enable
			this.enableAir();		
			
			// toolbar
			this.buildToolbar();				
	
			// paste
			var oldsafari = false;
			if ($.browser.webkit && navigator.userAgent.indexOf('Chrome') === -1) 
			{
				var arr = $.browser.version.split('.');
				if (arr[0] < 536) oldsafari = true;
			}
			
			if (this.isMobile(true) === false && oldsafari === false)
			{
				this.$editor.bind('paste', $.proxy(function(e)
				{
					if (this.opts.cleanup === false)
					{
						return true;
					}
					
					this.setBuffer();
	
					if (this.opts.autoresize === true)
					{
						this.saveScroll = document.body.scrollTop;
					}
					else
					{
						this.saveScroll = this.$editor.scrollTop();
					}
		
					var frag = this.extractContent();
					
					setTimeout($.proxy(function()
					{				
						var pastedFrag = this.extractContent();
						this.$editor.append(frag);				
						this.restoreSelection();
						
						var html = this.getFragmentHtml(pastedFrag);
						this.pasteCleanUp(html);
					
					}, this), 1);
		
				}, this));	
			}
	
			// key handlers
			this.keyup();	
			this.keydown();			
	
			// autosave
			if (this.opts.autosave !== false)
			{
				this.autoSave();
			}			
	
			// observers
			this.observeImages();
			this.observeTables();	
			
			// FF fix
			if ($.browser.mozilla)
			{
				document.execCommand('enableObjectResizing', false, false);
				document.execCommand('enableInlineTableEditing', false, false);			
			}
				
			// focus
			if (this.opts.focus) 
			{
				this.$editor.focus();
			}
	
			// fixed
			if (this.opts.fixed)
			{
				this.observeScroll();
				$(document).scroll($.proxy(this.observeScroll, this));
			}
			
			// callback
			if (typeof this.opts.callback === 'function')
			{
				this.opts.callback(this);
			}
			
		},
		shortcuts: function(e, cmd)
		{
			e.preventDefault();		
			this.execCommand(cmd, false);
		},		
		keyup: function()
		{
			this.$editor.keyup($.proxy(function(e)
			{
				var key = e.keyCode || e.which;
				
				// callback as you type
				if (typeof this.opts.keyupCallback === 'function')
				{
					this.opts.keyupCallback(this, e);
				}
				
				// if empty
				if (key === 8 || key === 46)
				{
					this.observeImages();
					return this.formatEmpty(e);
				}
	
				// new line p
				if (key === 13 && !e.shiftKey && !e.ctrlKey && !e.metaKey)
				{
					if ($.browser.webkit && this.opts.paragraphy)
					{
						this.formatNewLine(e);
					}
					
					// convert links
					if (this.opts.convertLinks)
					{
						this.$editor.linkify();
					}							
				}
				
				this.syncCode();
	
			}, this));		
		},
		keydown: function()
		{
			this.$editor.keydown($.proxy(function(e)
			{
				var key = e.keyCode || e.which;
				var parent = this.getParentNode();
				var pre = false;
				var ctrl = e.ctrlKey || e.metaKey;
				
				if (parent && $(parent).get(0).tagName === 'PRE')
				{
					pre = true;
				}
	
				// callback keydown
				if (typeof this.opts.keydownCallback === 'function') 
				{
					this.opts.keydownCallback(this, e);	
				}
				
				// breakline
				if (this.opts.paragraphy === false && $.browser.webkit && key === 13 && !e.shiftKey && !e.ctrlKey && !e.metaKey)
				{
					e.preventDefault();			
					this.insertNodeAtCaret($('<span class="redactor-breakline"><br></span>').get(0));
					setTimeout($.proxy(function()
					{
						this.$editor.find('span.redactor-breakline').replaceWith('<br>');						
						setTimeout($.proxy(function()
						{
							this.syncCode();
						}, this), 10);
					
					}, this), 10);
					return false;
				}
				
				if (ctrl && this.opts.shortcuts)
				{
					if (key === 90)
					{
						if (this.opts.buffer !== false)
						{
							e.preventDefault();
							this.getBuffer();
						}
						else if (e.shiftKey)
						{
							this.shortcuts(e, 'redo');	// Ctrl + Shift + z
						}					
						else
						{
							this.shortcuts(e, 'undo'); // Ctrl + z
						}
					}
					else if (key === 77)
					{
						this.shortcuts(e, 'removeFormat'); // Ctrl + m
					}
					else if (key === 66)
					{
						this.shortcuts(e, 'bold'); // Ctrl + b
					}
					else if (key === 73)
					{
						this.shortcuts(e, 'italic'); // Ctrl + i
					}
					else if (key === 74) 
					{
						this.shortcuts(e, 'insertunorderedlist'); // Ctrl + j
					}
					else if (key === 75)
					{
						this.shortcuts(e, 'insertorderedlist'); // Ctrl + k
					}
					else if (key === 76)
					{
						this.shortcuts(e, 'superscript'); // Ctrl + l
					}
					else if (key === 72)
					{
						this.shortcuts(e, 'subscript'); // Ctrl + h
					}					
				}
	
				// clear undo buffer
				if (!ctrl && key !== 90)
				{
					this.opts.buffer = false;
				}
				
				// enter
				if (pre === true && key === 13)
				{
					e.preventDefault();					
					this.insertNodeAtCaret(document.createTextNode('\r\n'));
				}
	
				// tab
				if (this.opts.shortcuts && !e.shiftKey && key === 9)
				{
					if (pre === false)
					{
						this.shortcuts(e, 'indent'); // Tab
					}
					else
					{
						e.preventDefault();					
						this.insertNodeAtCaret(document.createTextNode('\t'));
					}
				}
				else if (this.opts.shortcuts && e.shiftKey && key === 9 )
				{
					this.shortcuts(e, 'outdent'); // Shift + tab
				}
				
				// safari shift key + enter
				if ($.browser.webkit && navigator.userAgent.indexOf('Chrome') === -1)
				{
					return this.safariShiftKeyEnter(e, key);
				}
			}, this));		
		},
		build: function(mobile)
		{
			if (mobile !== true)
			{		
				// container
				this.$box = $('<div class="redactor_box"></div>');
		
				// air box
				if (this.opts.air)
				{
					this.air = $('<div class="redactor_air" style="display: none;"></div>');
				}
		
				// editor
				this.textareamode = true;
				if (this.$el.get(0).tagName === 'TEXTAREA')
				{
					this.$editor = $('<div></div>');
				}
				else
				{
					this.textareamode = false;
					this.$editor = this.$el;				
					this.$el = $('<textarea name="' + this.$editor.attr('id') + '"></textarea>').css('height', this.height);
				}
				
				this.$editor.addClass('redactor_editor').attr('contenteditable', true).attr('dir', this.opts.direction);
				
				if (this.opts.tabindex !== false)
				{
					this.$editor.attr('tabindex', this.opts.tabindex);
				}
	
				if (this.opts.minHeight !== false)
				{
					this.$editor.css('min-height', this.opts.minHeight + 'px');
				}
	
				if (this.opts.wym === true)
				{
					this.$editor.addClass('redactor_editor_wym');
				}
	
				if (this.opts.autoresize === false)
				{
					this.$editor.css('height', this.height);
				}
	
				// hide textarea
				this.$el.hide();
	
				// append box and frame
				var html = '';
				if (this.textareamode)
				{
					// get html
					html = this.$el.val();
	
					this.$box.insertAfter(this.$el).append(this.$editor).append(this.$el);
				}
				else
				{	
					// get html
					html = this.$editor.html();	
					
					this.$box.insertAfter(this.$editor).append(this.$el).append(this.$editor);
								
				}
				
				// conver newlines to p
				if (this.opts.paragraphy)
				{
					html = this.paragraphy(html);
				}
				else
				{
					html = html.replace(/<p>([\w\W]*?)<\/p>/gi, '$1<br><br>');
				}
	
				// enable
				this.$editor.html(html);
				
				if (this.textareamode === false)
				{
					this.syncCode();
				}
			}
			else
			{
				if (this.$el.get(0).tagName !== 'TEXTAREA')
				{
					var html = this.$el.val();
					var textarea = $('<textarea name="' + this.$editor.attr('id') + '"></textarea>').css('height', this.height).val(html);
					this.$el.hide();
					this.$el.after(textarea);
				}
			}
			
		},
		enableAir: function()
		{
			if (this.opts.air === false)
			{
				return false;
			}
	
			this.air.hide();
			
			this.$editor.bind('textselect', $.proxy(function(e)
			{
				this.showAir(e);
				
			}, this));
			
			this.$editor.bind('textunselect', $.proxy(function()
			{
				this.air.hide();
			
			}, this));
	
		},	
		showAir: function(e)
		{
			$('.redactor_air').hide();
			
			var width = this.air.innerWidth();
			var left = e.clientX;
			
			if ($(document).width() < (left + width))
			{
				left = left - width;
			}
			
			this.air.css({ left: left + 'px', top: (e.clientY + $(document).scrollTop() + 14) + 'px' }).show();
		},
		syncCode: function()
		{
			this.$el.val(this.$editor.html());
		},
		
		// API functions
		setCode: function(html)
		{
			this.$editor.html(html).focus();
	
			this.syncCode();
		},
		getCode: function()
		{
			if (this.opts.visual)
			{
				return this.$editor.html()
			}
			else
			{
				return this.$el.val();
			}
		},
		insertHtml: function(html)
		{	
			this.$editor.focus();
			this.execCommand('inserthtml', html);
			this.observeImages();
		},
		destroy: function()
		{
			var html = this.getCode();
			
			if (this.textareamode)
			{
				this.$box.after(this.$el);
				this.$box.remove();
				this.$el.height(this.height).val(html).show();			
			}
			else
			{
				this.$box.after(this.$editor);
				this.$box.remove();
				this.$editor.removeClass('redactor_editor').removeClass('redactor_editor_wym').attr('contenteditable', false).html(html).show();					
			}
			
			$('.redactor_air').remove();
			
			for (var i = 0; i < this.dropdowns.length; i++)
			{
				this.dropdowns[i].remove();
				delete(this.dropdowns[i]);
			}			
			
		},
		// end API functions
	
		// OBSERVERS
		observeImages: function()
		{
			if (this.opts.observeImages === false)
			{
				return false;
			}
	
			this.$editor.find('img').each($.proxy(function(i,s)
			{
				if ($.browser.msie)
				{
					$(s).attr('unselectable', 'on');
				}		
		
				this.resizeImage(s);
		
			}, this));
		
		},
		observeTables: function()
		{
			this.$editor.find('table').click($.proxy(this.tableObserver, this));
		},
		observeScroll: function()
		{
			var scrolltop = $(document).scrollTop();
			var boxtop = this.$box.offset().top;
			var left = 0;

			if (scrolltop > boxtop)
			{
				var width = '100%';
				if (this.opts.fixedBox)
				{
					left = this.$editor.offset().left;
					width = this.$editor.innerWidth();
				}	
						
				this.fixed = true;
				this.$toolbar.css({ position: 'fixed', width: width, zIndex: 100, top: this.opts.fixedTop + 'px', left: left });
			}
			else
			{
				this.fixed = false;
				this.$toolbar.css({ position: 'relative', width: 'auto', zIndex: 1, top: 0, left: left });
			}
		},
	
		// BUFFER
		setBuffer: function()
		{
			this.saveSelection();
			this.opts.buffer = this.$editor.html();
		},
		getBuffer: function()
		{	
			if (this.opts.buffer === false)
			{
				return false;
			}

			this.$editor.html(this.opts.buffer);
			
			if (!$.browser.msie)
			{
				this.restoreSelection();
			}	
				
			this.opts.buffer = false;
		},
	
		// EXECCOMMAND
		execCommand: function(cmd, param)
		{
			if (this.opts.visual == false)
			{
				this.$el.focus();
				return false;
			}
		
			try
			{
				var parent;
	
				if (cmd === 'inserthtml' && $.browser.msie)
				{
					 /*** IE-Insertion-Fix by Fabio Poloni ***/
					if (!this.$editor.is(":focus"))
					{
						this.$editor.focus();
					} 
					
					document.selection.createRange().pasteHTML(param);					
				}
				else if (cmd === 'formatblock' && $.browser.msie)
				{
					document.execCommand(cmd, false, '<' + param + '>');
				}
				else if (cmd === 'unlink')
				{
					parent = this.getParentNode();
					if ($(parent).get(0).tagName === 'A')
					{
						$(parent).replaceWith($(parent).text());
					}
					else
					{
						document.execCommand(cmd, false, param);
					}
				}
				else if (cmd === 'formatblock' && param === 'blockquote')
				{
					parent = this.getParentNode();
					if ($(parent).get(0).tagName === 'BLOCKQUOTE')
					{
						document.execCommand(cmd, false, 'p');
					}
					else if ($(parent).get(0).tagName === 'P')
					{
						var parent2 = $(parent).parent();
						if ($(parent2).get(0).tagName === 'BLOCKQUOTE')
						{						
							var node = $('<p>' + $(parent).html() + '</p>');
							$(parent2).replaceWith(node);	
							this.setFocusNode(node.get(0));						
						}
						else
						{
							document.execCommand(cmd, false, param);
						}
					}
					else
					{
						document.execCommand(cmd, false, param);
					}
				}
				else if (cmd === 'formatblock' && param === 'pre')
				{
					parent = this.getParentNode();
					if ($(parent).get(0).tagName === 'PRE')
					{
						$(parent).replaceWith('<p>' + $(parent).text() + '</p>');
					}
					else
					{
						document.execCommand(cmd, false, param);
					}
				}				
				else
				{
					document.execCommand(cmd, false, param);
				}	
				
				if (cmd === 'inserthorizontalrule')
				{
					this.$editor.find('hr').removeAttr('id');
				}
				
				this.syncCode();
				
				if (this.oldIE())
				{
					this.$editor.focus();
				}
				
				if (typeof this.opts.execCommandCallback === 'function')
				{
					this.opts.execCommandCallback(this, cmd);
				}
								
				if (this.opts.air)
				{
					this.air.hide();	
				}
			}
			catch (e) { }
		},
	
		// FORMAT NEW LINE
		formatNewLine: function(e)
		{
			var parent = this.getParentNode();	
	
			if (parent.nodeName === 'DIV' && parent.className === 'redactor_editor')
			{
				var element = $(this.getCurrentNode());
	
				if (element.get(0).tagName === 'DIV' && (element.html() === '' || element.html() === '<br>'))
				{
					var newElement = $('<p>').append(element.clone().get(0).childNodes);
					element.replaceWith(newElement);
					newElement.html('<br />');
					this.setFocusNode(newElement.get(0));				
				}
			}			
		},
	
		// SAFARI SHIFT KEY + ENTER
		safariShiftKeyEnter: function(e, key)
		{
			if (e.shiftKey && key === 13)
			{
				e.preventDefault();
				this.insertNodeAtCaret($('<span><br /></span>').get(0));
				this.syncCode();
				return false;
			}
			else
			{
				return true;
			}
		},
		
		// FORMAT EMPTY
		formatEmpty: function(e)
		{
			var html = $.trim(this.$editor.html());
			
			if ($.browser.mozilla)
			{
				html = html.replace(/<br>/i, '');
			}
			
			if (html === '')
			{
				e.preventDefault();
				
				var nodehtml = this.opts.allEmptyHtml;
				if ($.browser.mozilla)
				{
					nodehtml = this.opts.mozillaEmptyHtml;
				}
				
				var node = $(nodehtml).get(0);
				this.$editor.html(node);
				this.setFocusNode(node);
	
				this.syncCode();
				return false;
			}
			else
			{
				this.syncCode();
			}
		},
	
		// PARAGRAPHY
		paragraphy: function (str)
		{

		
			str = $.trim(str);			
			if (str === '')
			{
				if (!$.browser.mozilla)
				{
					return this.opts.allEmptyHtml;
				}
				else
				{
					return this.opts.mozillaEmptyHtml;
				}
			}

			// convert div to p
			if (this.opts.convertDivs)
			{
				
				str = str.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');
			}
			
			// inner functions
			var X = function(x, a, b) { return x.replace(new RegExp(a, 'g'), b); };
			var R = function(a, b) { return X(str, a, b); };
	
			// block elements
			var blocks = '(table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|blockquote|address|math|style|script|object|input|param|p|h[1-6])';
		
			//str = '<p>' + str;		
			str += '\n';
	
			R('<br />\\s*<br />', '\n\n');
			R('(<' + blocks + '[^>]*>)', '\n$1');
			R('(</' + blocks + '>)', '$1\n\n');
			R('\r\n|\r', '\n'); // newlines
			R('\n\n+', '\n\n'); // remove duplicates
			R('\n?((.|\n)+?)$', '<p>$1</p>\n'); // including one at the end
			R('<p>\\s*?</p>', ''); // remove empty p
			R('<p>(<div[^>]*>\\s*)', '$1<p>');
			R('<p>([^<]+)\\s*?(</(div|address|form)[^>]*>)', '<p>$1</p>$2');
			R('<p>\\s*(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
			R('<p>(<li.+?)</p>', '$1');
			R('<p>\\s*(</?' + blocks + '[^>]*>)', '$1');
			R('(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
			R('(</?' + blocks + '[^>]*>)\\s*<br />', '$1');
			R('<br />(\\s*</?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', '$1');
	
			// pre
			if (str.indexOf('<pre') != -1)
			{
				R('(<pre(.|\n)*?>)((.|\n)*?)</pre>', function(m0, m1, m2, m3)
				{
					return X(m1, '\\\\([\'\"\\\\])', '$1') + X(X(X(m3, '<p>', '\n'), '</p>|<br />', ''), '\\\\([\'\"\\\\])', '$1') + '</pre>';
				});
			}
	
			return R('\n</p>$', '</p>');
		},
		
		// REMOVE TAGS
		stripTags: function(html) 
		{
			var allowed = this.opts.allowedTags;
			var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
			return html.replace(tags, function ($0, $1) 
			{
				return $.inArray($1.toLowerCase(), allowed) > '-1' ? $0 : '';
			});
		},
	
		
		// PASTE CLEANUP
		pasteCleanUp: function(html)
		{	
			// remove comments and php tags		
			html = html.replace(/<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi, '');
		
			// remove nbsp
			html = html.replace(/(&nbsp;){1,}/gi, '&nbsp;');					
		
			// remove google docs marker
			html = html.replace(/<b\sid="internal-source-marker(.*?)">([\w\W]*?)<\/b>/gi, "$2");		
		
			// strip tags
			html = this.stripTags(html);
				
			// prevert
			html = html.replace(/<td><br><\/td>/gi, '[td]');
			html = html.replace(/<a(.*?)>([\w\W]*?)<\/a>/gi, '[a$1]$2[/a]');
			html = html.replace(/<iframe(.*?)>([\w\W]*?)<\/iframe>/gi, '[iframe$1]$2[/iframe]');
			html = html.replace(/<video(.*?)>([\w\W]*?)<\/video>/gi, '[video$1]$2[/video]');
			html = html.replace(/<audio(.*?)>([\w\W]*?)<\/audio>/gi, '[audio$1]$2[/audio]');
			html = html.replace(/<embed(.*?)>([\w\W]*?)<\/embed>/gi, '[embed$1]$2[/embed]');
			html = html.replace(/<object(.*?)>([\w\W]*?)<\/object>/gi, '[object$1]$2[/object]');
			html = html.replace(/<param(.*?)>/gi, '[param$1]');
			html = html.replace(/<img(.*?)>/gi, '[img$1]');
		
			// remove attributes
			html = html.replace(/<(\w+)([\w\W]*?)>/gi, '<$1>');
			
			// remove empty
			html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '');
			html = html.replace(/<[^\/>][^>]*>(\s*|\t*|\n*|&nbsp;|<br>)<\/[^>]+>/gi, '');
			
			// revert
			html = html.replace(/\[td\]/gi, '<td><br></td>');
			html = html.replace(/\[a(.*?)\]([\w\W]*?)\[\/a\]/gi, '<a$1>$2</a>');
			html = html.replace(/\[iframe(.*?)\]([\w\W]*?)\[\/iframe\]/gi, '<iframe$1>$2</iframe>');
			html = html.replace(/\[video(.*?)\]([\w\W]*?)\[\/video\]/gi, '<video$1>$2</video>');
			html = html.replace(/\[audio(.*?)\]([\w\W]*?)\[\/audio\]/gi, '<audio$1>$2</audio>');
			html = html.replace(/\[embed(.*?)\]([\w\W]*?)\[\/embed\]/gi, '<embed$1>$2</embed>');
			html = html.replace(/\[object(.*?)\]([\w\W]*?)\[\/object\]/gi, '<object$1>$2</object>');
			html = html.replace(/\[param(.*?)\]/gi, '<param$1>');
			html = html.replace(/\[img(.*?)\]/gi, '<img$1>');				
		
			// convert div to p
			if (this.opts.convertDivs)
			{
				html = html.replace(/<div(.*?)>([\w\W]*?)<\/div>/gi, '<p>$2</p>');	
			}
			
			if (this.opts.paragraphy === false)
			{
				html = html.replace(/<p>([\w\W]*?)<\/p>/gi, '$1<br>');
			}
			
			// remove span
			html = html.replace(/<span>([\w\W]*?)<\/span>/gi, '$1');
			
			html = html.replace(/\n{3,}/gi, '\n');
		
			// remove dirty p
			html = html.replace(/<p><p>/g, '<p>');
			html = html.replace(/<\/p><\/p>/g, '</p>');	
		
			this.execCommand('inserthtml', html);	
			
			if (this.opts.autoresize === true)
			{
				$(document.body).scrollTop(this.saveScroll);
			}
			else
			{
				this.$editor.scrollTop(this.saveScroll);
			}
			
		},	
		
			
		// TEXTAREA CODE FORMATTING
		formattingRemove: function(html)
		{
			// save pre
			var prebuffer = [];
			var pre = html.match(/<pre(.*?)>([\w\W]*?)<\/pre>/gi);
			if (pre !== null)
			{
				$.each(pre, function(i,s)
				{
					html = html.replace(s, 'prebuffer_' + i);
					prebuffer.push(s);
				});
			}
		
			html = html.replace(/\s{2,}/g, ' ');
			html = html.replace(/\n/g, ' ');	
			html = html.replace(/[\t]*/g, '');
			html = html.replace(/\n\s*\n/g, "\n");
			html = html.replace(/^[\s\n]*/g, '');
			html = html.replace(/[\s\n]*$/g, '');	
			html = html.replace(/>\s+</g, '><');
			
			if (prebuffer)
			{
				$.each(prebuffer, function(i,s)
				{
					html = html.replace('prebuffer_' + i, s);
				});		
			
				prebuffer = [];
			}
			
			return html;		
		},
		formattingIndenting: function(html)
		{
			html = html.replace(/<li/g, "\t<li");
			html = html.replace(/<tr/g, "\t<tr");
			html = html.replace(/<td/g, "\t\t<td");
			html = html.replace(/<\/tr>/g, "\t</tr>");	
			
			return html;	
		},
		formattingEmptyTags: function(html)		
		{
			var etags = ["<pre></pre>","<blockquote>\\s*</blockquote>","<em>\\s*</em>","<ul></ul>","<ol></ol>","<li></li>","<table></table>","<tr></tr>","<span>\\s*<span>", "<span>&nbsp;<span>", "<b>\\s*</b>", "<b>&nbsp;</b>", "<p>\\s*</p>", "<p>&nbsp;</p>",  "<p>\\s*<br>\\s*</p>", "<div>\\s*</div>", "<div>\\s*<br>\\s*</div>"];
			for (var i = 0; i < etags.length; ++i)
			{
				var bbb = etags[i];
				html = html.replace(new RegExp(bbb,'gi'), "");
			}
			
			return html;
		},
		formattingAddBefore: function(html)
		{
			var lb = '\r\n';
			var btags = ["<p", "<form","</ul>", '</ol>', "<fieldset","<legend","<object","<embed","<select","<option","<input","<textarea","<pre","<blockquote","<ul","<ol","<li","<dl","<dt","<dd","<table", "<thead","<tbody","<caption","</caption>","<th","<tr","<td","<figure"];
			for (var i = 0; i < btags.length; ++i)
			{
				var eee = btags[i];
				html = html.replace(new RegExp(eee,'gi'),lb+eee);
			}
			
			return html;
		},
		formattingAddAfter: function(html)
		{
			var lb = '\r\n';		
			var atags = ['</p>', '</div>', '</h1>', '</h2>', '</h3>', '</h4>', '</h5>', '</h6>', '<br>', '<br />', '</dl>', '</dt>', '</dd>', '</form>', '</blockquote>', '</pre>', '</legend>', '</fieldset>', '</object>', '</embed>', '</textarea>', '</select>', '</option>', '</table>', '</thead>', '</tbody>', '</tr>', '</td>', '</th>', '</figure>'];
			for (var i = 0; i < atags.length; ++i)
			{
				var aaa = atags[i];
				html = html.replace(new RegExp(aaa,'gi'),aaa+lb);
			}
			
			return html;
		},	
		formatting: function(html)
		{
			html = this.formattingRemove(html);
		
			// empty tags
			html = this.formattingEmptyTags(html);
						
			// add formatting before
			html = this.formattingAddBefore(html);
			
			// add formatting after
			html = this.formattingAddAfter(html);
	
			// indenting
			html = this.formattingIndenting(html);	
		
			return html;	
		},
		
		// TOGGLE
		toggle: function()
		{
			var html;
		
			if (this.opts.visual)
			{
				this.$editor.hide();
				
				html = this.$editor.html();
				html = $.trim(this.formatting(html));
					
				this.$el.height(this.$editor.innerHeight()).val(html).show().focus();
				
				this.setBtnActive('html');
				this.opts.visual = false;
			}
			else
			{
				this.$el.hide();
				
				
				var html = this.stripTags(this.$el.val());
				this.$editor.html(html);
				this.$editor.show();
	
				if (this.$editor.html() === '')
				{
					if (!$.browser.mozilla)
					{
						html = this.opts.allEmptyHtml;
					}
					else
					{
						html = this.opts.mozillaEmptyHtml;
					}
	
					this.setCode(html);
				}
	
				this.$editor.focus();
				
				this.setBtnInactive('html');
				this.opts.visual = true;
				
				this.observeImages();
				this.observeTables();
			}
		},	
	
		// AUTOSAVE
		autoSave: function()
		{
			setInterval($.proxy(function()
			{
				$.ajax({
					url: this.opts.autosave,
					type: 'post',
					data: this.$el.attr('name') + '=' + this.getCode(),
					success: $.proxy(function(data)
					{
						// callback					
						if (typeof this.opts.autosaveCallback === 'function')
						{
							this.opts.autosaveCallback(data, this);
						}
						
					}, this)
				});
	
	
			}, this), this.opts.interval*1000);
		},
	
		// TOOLBAR
		buildToolbar: function()
		{
			if (this.opts.toolbar === false)
			{
				return false;
			}
			
			this.$toolbar = $('<ul>').addClass('redactor_toolbar');
			
			if (this.opts.air)
			{
				$(this.air).append(this.$toolbar);
				$('body').prepend(this.air);
			}
			else
			{
				this.$box.prepend(this.$toolbar);
			}
			
			$.each(this.opts.buttons, $.proxy(function(i,key)
			{
				
				if (key !== '|' && typeof this.opts.toolbar[key] !== 'undefined') 
				{
					var s = this.opts.toolbar[key];
				
					if (this.opts.fileUpload === false && key === 'file')
					{
						return true;
					}
				
					var li = $('<li>');
					var a = this.buildButton(key, s);
	
					// dropdown
					if (key === 'backcolor' || key === 'fontcolor' || typeof(s.dropdown) !== 'undefined')
					{
						var dropdown = $('<div class="redactor_dropdown" style="display: none;">');
						
						if (key === 'backcolor' || key === 'fontcolor')
						{
							dropdown = this.buildColorPicker(dropdown, key);
						}
						else
						{
							dropdown = this.buildDropdown(dropdown, s.dropdown);
						}
	
						this.dropdowns.push(dropdown.appendTo($(document.body)));
	
						// observing dropdown
						this.hdlHideDropDown = $.proxy(function(e) { this.hideDropDown(e, dropdown, key); }, this);
						this.hdlShowDropDown = $.proxy(function(e) { this.showDropDown(e, dropdown, key); }, this);
	
						a.click(this.hdlShowDropDown);
					}
					
					this.$toolbar.append($(li).append(a));
				}
	
				
				if (key === '|')
				{
					this.$toolbar.append($('<li class="redactor_separator"></li>'));
				}
	
			}, this));
	
			$(document).click(this.hdlHideDropDown);
			this.$editor.click(this.hdlHideDropDown);
	
		},
		buildButton: function(key, s)
		{
			var button = $('<a href="javascript:void(null);" title="' + s.title + '" class="redactor_btn_' + key + '"></a>');
			
			if (typeof s.func === 'undefined')
			{
				button.click($.proxy(function() { this.execCommand(s.exec, key); }, this));
			}
			else if (s.func !== 'show')
			{
				button.click($.proxy(function(e) {
				
					this[s.func](e); 
					
				}, this));
			}
	
			if (typeof s.callback !== 'undefined') 
			{
				button.click($.proxy(function(e) { s.callback(this, e, key); }, this));
			}
	
			return button;
		},
		buildDropdown: function(dropdown, obj)
		{
			$.each(obj, $.proxy(
				function (x, d)
				{
					if (typeof(d.className) === 'undefined')
					{
						d.className = '';
					}
					
					var drop_a;
					if (typeof d.name !== 'undefined' && d.name === 'separator')
					{
						drop_a = $('<a class="redactor_separator_drop">');
					}
					else
					{
						drop_a = $('<a href="javascript:void(null);" class="' + d.className + '">' + d.title + '</a>');
	
						if (typeof(d.func) === 'undefined')
						{
							$(drop_a).click($.proxy(function() { this.execCommand(d.exec, x); }, this));
						}
						else
						{
							$(drop_a).click($.proxy(function(e) { this[d.func](e); }, this));
						}
					}
	
					$(dropdown).append(drop_a);
					
				}, this)
			);
	
			return dropdown;
	
		},
		buildColorPicker: function(dropdown, key)
		{
			var mode;
			if (key === 'backcolor')
			{
				if ($.browser.msie)
				{
					mode = 'BackColor';
				}
				else
				{
					mode = 'hilitecolor';
				}
			}
			else
			{
				mode = 'forecolor';
			}
			
			$(dropdown).width(210);
	
			var len = this.opts.colors.length;
			for (var i = 0; i < len; ++i)
			{
				var color = this.opts.colors[i];
	
				var swatch = $('<a rel="' + color + '" href="javascript:void(null);" class="redactor_color_link"></a>').css({ 'backgroundColor': color });
				$(dropdown).append(swatch);
	
				var _self = this;
				$(swatch).click(function() 
				{ 
					_self.execCommand(mode, $(this).attr('rel'));
					
					if (mode === 'forecolor')
					{
						_self.$editor.find('font').replaceWith(function() {
							
							return $('<span style="color: ' + $(this).attr('color') + ';">' + $(this).html() + '</span>');
							
						});
					}
					
					if ($.browser.msie && mode === 'BackColor')
					{
						_self.$editor.find('font').replaceWith(function() {
							
							return $('<span style="' + $(this).attr('style') + '">' + $(this).html() + '</span>');
							
						});						
					}
					
				});
			}
	
			var elnone = $('<a href="javascript:void(null);" class="redactor_color_none"></a>').html(RLANG.none);
	
			if (key === 'backcolor')
			{
				elnone.click($.proxy(this.setBackgroundNone, this));
			}
			else
			{
				elnone.click($.proxy(this.setColorNone, this));
			}
	
			$(dropdown).append(elnone);
	
			return dropdown;
		},
		setBackgroundNone: function()
		{
			$(this.getParentNode()).css('background-color', 'transparent');
			this.syncCode();
		},
		setColorNone: function()
		{
			$(this.getParentNode()).attr('color', '').css('color', '');
			this.syncCode();
		},
	
		
		// DROPDOWNS
		showDropDown: function(e, dropdown, key)
		{
			if (this.getBtn(key).hasClass('dropact'))
			{
				this.hideAllDropDown();
			}
			else
			{	
				this.hideAllDropDown();
	
				this.setBtnActive(key);
				this.getBtn(key).addClass('dropact');
	
				var left = this.getBtn(key).offset().left;
				
				if (this.opts.air)
				{
					var air_top = this.air.offset().top;	
	
					$(dropdown).css({ position: 'absolute', left: left + 'px', top: air_top+30 + 'px' }).show();		
				}				
				else if (this.opts.fixed && this.fixed)
				{
					$(dropdown).css({ position: 'fixed', left: left + 'px', top: '30px' }).show();
				}
				else 
				{
					var top = this.$toolbar.offset().top + 30;
					$(dropdown).css({ position: 'absolute', left: left + 'px', top: top + 'px' }).show();
				}
			}
			
		},
		hideAllDropDown: function()
		{
			this.$toolbar.find('a.dropact').removeClass('act').removeClass('dropact');
			$('.redactor_dropdown').hide();
		},
		hideDropDown: function(e, dropdown, key)
		{
			if (!$(e.target).hasClass('dropact'))
			{
				$(dropdown).removeClass('act');
				this.showedDropDown = false;
				this.hideAllDropDown();
			}
		},
		
		// SELECTION AND NODE MANIPULATION		
		getSelection: function ()
		{
			if (typeof window.getSelection !== 'undefined')
			{
				return document.getSelection();
			}
			else if (typeof document.selection !== 'undefined')
			{
				return document.selection.createRange();
			}
		},
		getFragmentHtml: function (fragment)
		{
			var cloned = fragment.cloneNode(true);
			var div = document.createElement('div');
			div.appendChild(cloned);
			return div.innerHTML;
		},
		extractContent: function()
		{   
			var node = this.$editor.get(0);
			var frag = document.createDocumentFragment(), child;
			while ((child = node.firstChild))
			{
				frag.appendChild(child);
			}
			
			return frag;
		},
		saveSelection: function()
		{
			this.savedSel = null;
			this.savedSelObj = null;
		
			if ($.browser.msie && parseInt($.browser.version, 10) < 9)
			{
				var node = this.$editor.get(0);
				this.savedSel = window.Selection.getOrigin(node);
				this.savedSelObj = window.Selection.getFocus(node);
			}
			else
			{
				this.savedSel = window.Selection.getOrigin(window);
				this.savedSelObj = window.Selection.getFocus(window);			
			}
		},
		restoreSelection: function()
		{	
			if (this.savedSel !== null && this.savedSelObj !== null && this.savedSel[0].tagName !== 'BODY')
			{		
				if ($(this.savedSel[0]).closest('.redactor_editor').size() == 0)
				{
					this.$editor.focus();
				}
				else
				{
					window.Selection.setSelection(window, this.savedSel[0], this.savedSel[1], this.savedSelObj[0], this.savedSelObj[1]);
				}
			}
			else 
			{
				this.$editor.focus();
			}	
		},
		getParentNode: function()
		{
			if (typeof window.getSelection !== 'undefined')
			{
				var s = window.getSelection();
				if (s.rangeCount > 0) 
				{
					return this.getSelection().getRangeAt(0).startContainer.parentNode;
				}
				else return false;
				
			}
			else if (typeof document.selection !== 'undefined')
			{
				return this.getSelection().parentElement();
			}
		},
		getCurrentNode: function()
		{
			if (typeof window.getSelection !== 'undefined')
			{
				return this.getSelection().getRangeAt(0).startContainer;
			}
			else if (typeof document.selection !== 'undefined')
			{
				return this.getSelection();
			}
		},
		setFocusNode: function(node)
		{
			if (typeof node === 'undefined')
			{
				return false;
			}
		
			try {
		
				var range = document.createRange();
				var selection = this.getSelection();
	
				if (selection !== null)
				{
					range.selectNodeContents(node);
					selection.addRange(range);
					selection.collapse(node, 0);
				}
	
				this.$editor.focus();
			
			} catch (e) { }
			
		},
		insertNodeAtCaret: function (node)
		{
			if (window.getSelection)
			{
				var sel = this.getSelection();
				if (sel.rangeCount) 
				{
					var range = sel.getRangeAt(0);
					range.collapse(false);
					range.insertNode(node);
					range = range.cloneRange();
					range.selectNodeContents(node);
					range.collapse(false);
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
			else if (document.selection)
			{
				var html = (node.nodeType === 1) ? node.outerHTML : node.data;
				var id = "marker_" + ("" + Math.random()).slice(2);
				html += '<span id="' + id + '"></span>';
				var textRange = this.getSelection();
				textRange.collapse(false);
				textRange.pasteHTML(html);
				var markerSpan = document.getElementById(id);
				textRange.moveToElementText(markerSpan);
				textRange.select();
				markerSpan.parentNode.removeChild(markerSpan);
			}
		},
		getSelectedHtml: function()
		{
			var html = '';
			if (window.getSelection)
			{
				var sel = window.getSelection();
				if (sel.rangeCount)
				{
					var container = document.createElement("div");
					for (var i = 0, len = sel.rangeCount; i < len; ++i)
					{
						container.appendChild(sel.getRangeAt(i).cloneContents());
					}
					
					html = container.innerHTML;
		
				}
			}
			else if (document.selection)
			{
				if (document.selection.type === "Text")
				{
					html = document.selection.createRange().htmlText;
				}
			}
		
			return html;
		},
		
		// BUTTONS MANIPULATIONS
		getBtn: function(key)
		{
			return $(this.$toolbar.find('a.redactor_btn_' + key));
		},
		setBtnActive: function(key)
		{
			this.getBtn(key).addClass('act');
		},
		setBtnInactive: function(key)
		{
			this.getBtn(key).removeClass('act');
		},
		
		// RESIZE IMAGES
		resizeImage: function(resize)
		{
			var clicked = false;
			var clicker = false;
			var start_x;
			var start_y;
			var ratio = $(resize).width()/$(resize).height();
			var min_w = 10;
			var min_h = 10;
	
			$(resize).hover(function() { $(resize).css('cursor', 'nw-resize'); }, function() { $(resize).css('cursor','default'); clicked = false; });
	
			$(resize).mousedown(function(e)
			{
				e.preventDefault();
	
				ratio = $(resize).width()/$(resize).height();
	
				clicked = true;
				clicker = true;
	
				start_x = Math.round(e.pageX - $(resize).eq(0).offset().left);
				start_y = Math.round(e.pageY - $(resize).eq(0).offset().top);
			});
			
			$(resize).mouseup($.proxy(function(e)
			{
				clicked = false;
				this.syncCode();
				
			}, this));
			
			$(resize).click($.proxy(function(e)
			{
				if (clicker)
				{
					this.imageEdit(e);
				}
	
			}, this));
	
			$(resize).mousemove(function(e)
			{
				if (clicked)
				{
					clicker = false;
				
					var mouse_x = Math.round(e.pageX - $(this).eq(0).offset().left) - start_x;
					var mouse_y = Math.round(e.pageY - $(this).eq(0).offset().top) - start_y;
					
					var div_h = $(resize).height();
					
					var new_h = parseInt(div_h, 10) + mouse_y;
					var new_w = new_h*ratio;
	
					if (new_w > min_w)
					{
						$(resize).width(new_w);
					}
					
					if (new_h > min_h)
					{
						$(resize).height(new_h);
					}
					
					start_x = Math.round(e.pageX - $(this).eq(0).offset().left);
					start_y = Math.round(e.pageY - $(this).eq(0).offset().top);
				}
			});
		},
	
		// TABLE
		showTable: function()
		{
			this.saveSelection();
		
			this.modalInit(RLANG.table, 'table', 300, $.proxy(function()
				{				
					$('#redactor_insert_table_btn').click($.proxy(this.insertTable, this));
				}, this),
				
				function()
				{
					$('#redactor_table_rows').focus();
				}			
			);
		},
		insertTable: function()
		{
			var rows = $('#redactor_table_rows').val();
			var columns = $('#redactor_table_columns').val();
			
			var table_box = $('<div></div>');
			
			var tableid = Math.floor(Math.random() * 99999);
			var table = $('<table id="table' + tableid + '"><tbody></tbody></table>');
			
			for (var i = 0; i < rows; i++)
			{
				var row = $('<tr></tr>');
				for (var z = 0; z < columns; z++)
				{
					var column = $('<td><br></td>');
					$(row).append(column);
				}
				$(table).append(row);
			}
			
			$(table_box).append(table);
			var html = $(table_box).html() + '<p></p>';
			
			this.restoreSelection();
			this.execCommand('inserthtml', html);
			this.modalClose();			
			this.observeTables();
	
		},
		tableObserver: function(e)
		{
			this.$table = $(e.target).closest('table');
	
			this.$table_tr = this.$table.find('tr');
			this.$table_td = this.$table.find('td');
	
			this.$table_td.removeClass('redactor-current-td');
	
			this.$tbody = $(e.target).closest('tbody');
			this.$thead = $(this.$table).find('thead');
	
			this.$current_td = $(e.target);
			this.$current_td.addClass('redactor-current-td');
			
			this.$current_tr = $(e.target).closest('tr');
		},
		deleteTable: function()
		{
			$(this.$table).remove();
			this.$table = false;
			this.syncCode();
		},
		deleteRow: function()
		{
			$(this.$current_tr).remove();
			this.syncCode();
		},
		deleteColumn: function()
		{
			var index = $(this.$current_td).get(0).cellIndex;
			
			$(this.$table).find('tr').each(function()
			{
				$(this).find('td').eq(index).remove();
			});
			
			this.syncCode();
		},
		addHead: function()
		{
			if ($(this.$table).find('thead').size() !== 0)
			{
				this.deleteHead();
			}
			else
			{
				var tr = $(this.$table).find('tr').first().clone();
				tr.find('td').html('&nbsp;');
				this.$thead = $('<thead></thead>');
				this.$thead.append(tr);
				$(this.$table).prepend(this.$thead);
				this.syncCode();
			}
		},
		deleteHead: function()
		{
			$(this.$thead).remove();
			this.$thead = false;
			this.syncCode();
		},
		insertRowAbove: function()
		{
			this.insertRow('before');
		},
		insertRowBelow: function()
		{
			this.insertRow('after');
		},
		insertColumnLeft: function()
		{
			this.insertColumn('before');
		},
		insertColumnRight: function()
		{
			this.insertColumn('after');
		},
		insertRow: function(type)
		{
			var new_tr = $(this.$current_tr).clone();
			new_tr.find('td').html('&nbsp;');
			if (type === 'after')
			{
				$(this.$current_tr).after(new_tr);
			}
			else
			{
				$(this.$current_tr).before(new_tr);
			}
	
			this.syncCode();
		},
		insertColumn: function(type)
		{
			var index = 0;
	
			this.$current_td.addClass('redactor-current-td');
	
			this.$current_tr.find('td').each(function(i,s)
			{
				if ($(s).hasClass('redactor-current-td'))
				{
					index = i;
				}
			});
	
			this.$table_tr.each(function(i,s)
			{
				var current = $(s).find('td').eq(index);
				
				var td = current.clone();
				td.html('&nbsp;');
				
				if (type === 'after')
				{
					$(current).after(td);
				}
				else
				{
					$(current).before(td);
				}
	
			});
	
			this.syncCode();
		},
	
		// INSERT VIDEO
		showVideo: function()
		{
			this.saveSelection();
			this.modalInit(RLANG.video, 'video', 600, $.proxy(function()
				{
					$('#redactor_insert_video_btn').click($.proxy(this.insertVideo, this));
				}, this),
				
				function()
				{
					$('#redactor_insert_video_area').focus();
				}
			);
		},
		insertVideo: function()
		{
			var data = $('#redactor_insert_video_area').val();
			data = this.stripTags(data);
			
			this.restoreSelection();
			this.execCommand('inserthtml', data);
			this.modalClose();
		},
	
		// INSERT IMAGE
		imageEdit: function(e)
		{
			var $el = $(e.target);
			var parent = $el.parent();
	
			var handler = $.proxy(function()
			{
				$('#redactor_file_alt').val($el.attr('alt'));
				$('#redactor_image_edit_src').attr('href', $el.attr('src'));
				$('#redactor_form_image_align').val($el.css('float'));
	
				if ($(parent).get(0).tagName === 'A')
				{
					$('#redactor_file_link').val($(parent).attr('href'));
				}
	
				$('#redactor_image_delete_btn').click($.proxy(function() { this.imageDelete($el); }, this));
				$('#redactorSaveBtn').click($.proxy(function() { this.imageSave($el); }, this));
	
			}, this);
	
			this.modalInit(RLANG.image, 'image_edit', 380,  handler);
	
		},
		imageDelete: function(el)
		{
			$(el).remove();
			this.modalClose();
			this.syncCode();			
		},
		imageSave: function(el)
		{
			var parent = $(el).parent();
	
			$(el).attr('alt', $('#redactor_file_alt').val());
	
			var floating = $('#redactor_form_image_align').val();
		
			if (floating === 'left')
			{
				$(el).css({ 'float': 'left', margin: '0 10px 10px 0' });
			}
			else if (floating === 'right')
			{
				$(el).css({ 'float': 'right', margin: '0 0 10px 10px' });
			}
			else
			{
				$(el).css({ 'float': 'none', margin: '0' });
			}
			
			// as link
			var link = $.trim($('#redactor_file_link').val());
			if (link !== '')
			{
				if ($(parent).get(0).tagName !== 'A')
				{
					$(el).replaceWith('<a href="' + link + '">' + this.outerHTML(el) + '</a>');
				}
				else
				{
					$(parent).attr('href', link);
				}
			}
			else
			{
				if ($(parent).get(0).tagName === 'A')
				{
					$(parent).replaceWith(this.outerHTML(el));
				}
			}
	
			this.modalClose();
			this.observeImages();
			this.syncCode();
			
		},
		showImage: function()
		{
			this.saveSelection();
	
			var handler = $.proxy(function()
			{
				// json
				if (this.opts.imageGetJson !== false)
				{
					$.getJSON(this.opts.imageGetJson, $.proxy(function(data) {
						
						var folders = {};
						var z = 0;
						
						// folders
						$.each(data, $.proxy(function(key, val)
						{
							if (typeof val.folder !== 'undefined')
							{
								z++;
								folders[val.folder] = z;							
							}
												
						}, this));
						
						var folderclass = false;
						$.each(data, $.proxy(function(key, val)
						{
							// title
							var thumbtitle = '';
							if (typeof val.title !== 'undefined')
							{
								thumbtitle = val.title;
							}
							
							var folderkey = 0;						
							if (!$.isEmptyObject(folders) && typeof val.folder !== 'undefined')
							{
								folderkey = folders[val.folder];
								if (folderclass === false)
								{
									folderclass = '.redactorfolder' + folderkey;
								}
							}
							
							var img = $('<img src="' + val.thumb + '" class="redactorfolder redactorfolder' + folderkey + '" rel="' + val.image + '" title="' + thumbtitle + '" />');
							$('#redactor_image_box').append(img);
							$(img).click($.proxy(this.imageSetThumb, this));
							
							
						}, this));
						
						// folders
						if (!$.isEmptyObject(folders))
						{
							$('.redactorfolder').hide();
							$(folderclass).show();
												
							var onchangeFunc = function(e)
							{
								$('.redactorfolder').hide();
								$('.redactorfolder' + $(e.target).val()).show();
							}
						
							var select = $('<select id="redactor_image_box_select">');
							$.each(folders, function(k,v)
							{
								select.append($('<option value="' + v + '">' + k + '</option>'));
							});
							
							$('#redactor_image_box').before(select);
							select.change(onchangeFunc);
						}
	
					}, this));
				}
				else
				{
					$('#redactor_tabs a').eq(1).remove();
				}
				
				if (this.opts.imageUpload !== false)
				{
					
					// dragupload
					if (this.opts.uploadCrossDomain === false && this.isMobile() === false)
					{
						
						if ($('#redactor_file').size() !== 0)
						{
							$('#redactor_file').dragupload(
							{
								url: this.opts.imageUpload,
								uploadFields: this.opts.uploadFields,
								success: $.proxy(this.imageUploadCallback, this)
							});
						}
					}
	
					// ajax upload
					this.uploadInit('redactor_file', { auto: true, url: this.opts.imageUpload, success: $.proxy(this.imageUploadCallback, this)  });
				}
				else
				{
					$('.redactor_tab').hide();
					if (this.opts.imageGetJson === false) 
					{
						$('#redactor_tabs').remove();
						$('#redactor_tab3').show();
					}
					else 
					{
						var tabs = $('#redactor_tabs a');
						tabs.eq(0).remove();
						tabs.eq(1).addClass('redactor_tabs_act');
						$('#redactor_tab2').show();
					}
				}
	
				$('#redactor_upload_btn').click($.proxy(this.imageUploadCallbackLink, this));
	
			}, this);
			
			var endCallback = $.proxy(function()
			{
				if (this.opts.imageUpload === false && this.opts.imageGetJson === false)
				{
					$('#redactor_file_link').focus();
				}				
			}, this);
	
			this.modalInit(RLANG.image, 'image', 570, handler, endCallback, true);
	
		},
		imageSetThumb: function(e)
		{
			this._imageSet('<img src="' + $(e.target).attr('rel') + '" alt="' + $(e.target).attr('title') + '" />', true);
		},
		imageUploadCallbackLink: function()
		{
			if ($('#redactor_file_link').val() !== '')
			{
				var data = '<img src="' + $('#redactor_file_link').val() + '" />';
				this._imageSet(data, true);
			}
			else
			{
				this.modalClose();
			}
		},
		imageUploadCallback: function(data)
		{        
			this._imageSet(data);
		},
		_imageSet: function(json, link)
		{
			this.restoreSelection();		
		
			if (json !== false)
			{
				var html = '', data = '';
				if (link !== true)
				{
					data = $.parseJSON(json);		
					html = '<p><img src="' + data.filelink + '" /></p>';
				}
				else
				{
					html = json;
				}
				
				this.execCommand('inserthtml', html);
			
				// upload image callback
				if (link !== true && typeof this.opts.imageUploadCallback === 'function') 
				{
					this.opts.imageUploadCallback(this, data);
				}
			}
			
			this.modalClose();
			this.observeImages();
		},
	
		// INSERT LINK
		showLink: function()
		{
			this.saveSelection();
	
			var handler = $.proxy(function()
			{			
				this.insert_link_node = false;
				var sel = this.getSelection();
				var url = '', text = '', target = '';
				
				if ($.browser.msie)
				{
					var parent = this.getParentNode();
					if (parent.nodeName === 'A')
					{
						this.insert_link_node = $(parent);
						text = this.insert_link_node.text();
						url = this.insert_link_node.attr('href');
						target = this.insert_link_node.attr('target');
					}
					else
					{
						if (this.oldIE())
						{
							text = sel.text;
						}
						else
						{
							text = sel.toString();
						}
					}
				}
				else
				{					
					if (sel && sel.anchorNode && sel.anchorNode.parentNode.tagName === 'A')
					{
						url = sel.anchorNode.parentNode.href;
						text = sel.anchorNode.parentNode.text;
						target = sel.anchorNode.parentNode.target;
						
						if (sel.toString() === '')
						{
							this.insert_link_node = sel.anchorNode.parentNode;
						}
					}
					else
					{
						text = sel.toString();
					}
				}
				
				$('.redactor_link_text').val(text);
				
				var turl = url.replace(self.location.href, '');
				
				if (url.search('mailto:') === 0)
				{
					this.setModalTab(2);
	
					$('#redactor_tab_selected').val(2);
					$('#redactor_link_mailto').val(url.replace('mailto:', ''));
				}
				else if (turl.search(/^#/gi) === 0)
				{
					this.setModalTab(3);	
					
					$('#redactor_tab_selected').val(3);
					$('#redactor_link_anchor').val(turl.replace(/^#/gi, ''));
				}
				else
				{
					$('#redactor_link_url').val(url);
				}
				
				if (target === '_blank')
				{
					$('#redactor_link_blank').attr('checked', true);
				}
				
				$('#redactor_insert_link_btn').click($.proxy(this.insertLink, this));
				
	
			}, this);
			
			var endCallback = function(url)
			{
				$('#redactor_link_url').focus();
			};
	
	
			this.modalInit(RLANG.link, 'link', 460, handler, endCallback);
	
		},
		insertLink: function()
		{
			var tab_selected = $('#redactor_tab_selected').val();
			var link = '', text = '', target = '';
			
			if (tab_selected === '1') // url
			{
				link = $('#redactor_link_url').val();
				text = $('#redactor_link_url_text').val();
	
				if ($('#redactor_link_blank').attr('checked'))
				{
					target = '_blank';
				}
			
				// test http
				var re = new RegExp('^https?://', 'i');
				if (link.search(re) == -1)
				{
					link = this.opts.protocol + link;
				}
			}
			else if (tab_selected === '2') // mailto
			{
				link = 'mailto:' + $('#redactor_link_mailto').val();
				text = $('#redactor_link_mailto_text').val();
			}
			else if (tab_selected === '3') // anchor
			{
				link = '#' + $('#redactor_link_anchor').val();
				text = $('#redactor_link_anchor_text').val();
			}
	
			this._insertLink('<a href="' + link + '" target="' + target + '">' +  text + '</a>&nbsp;', $.trim(text), link, target);
	
		},
		_insertLink: function(a, text, link, target)
		{
			this.$editor.focus();
			this.restoreSelection();	
		
			if (text !== '')
			{
				if (this.insert_link_node)
				{				
					$(this.insert_link_node).text(text);
					$(this.insert_link_node).attr('href', link);
					if (target !== '')
					{
						$(this.insert_link_node).attr('target', target);
					}
					this.syncCode();
				}
				else
				{
					this.execCommand('inserthtml', a);
				}
			}
			
			this.modalClose();
		},

        //INSERT CODE SNIPPET
        showCode: function(){
            this.saveSelection();

            var handler = $.proxy(function()
            {
                this.insert_link_node = false;
                var sel = this.getSelection();
                var url = '', text = '', target = '';

                if ($.browser.msie)
                {
                    var parent = this.getParentNode();
                    if (parent.nodeName === 'A')
                    {
                        this.insert_link_node = $(parent);
                        text = this.insert_link_node.text();
                        url = this.insert_link_node.attr('href');
                        target = this.insert_link_node.attr('target');
                    }
                    else
                    {
                        if (this.oldIE())
                        {
                            text = sel.text;
                        }
                        else
                        {
                            text = sel.toString();
                        }
                    }
                }
                else
                {
                    if (sel && sel.anchorNode && sel.anchorNode.parentNode.tagName === 'A')
                    {
                        url = sel.anchorNode.parentNode.href;
                        text = sel.anchorNode.parentNode.text;
                        target = sel.anchorNode.parentNode.target;

                        if (sel.toString() === '')
                        {
                            this.insert_link_node = sel.anchorNode.parentNode;
                        }
                    }
                    else
                    {
                        text = sel.toString();
                    }
                }

                $('.redactor_link_text').val(text);

                var turl = url.replace(self.location.href, '');

                $('#redactor_insert_code_button').click($.proxy(this.insertCode, this));


            }, this);

            var endCallback = function(url)
            {
                $('#redactor_code').focus();
            };


            this.modalInit('Code', 'code', 460, handler, endCallback);

        },
        insertCode: function(el)
        {
            var sel = $('#redactor_code').val().replace(/<code.*?>|<\/code>/g, '').replace(/</g,'&lt;');
            var syntax = $('#redactor_code_syntax').val();
            this.$editor.focus();
            this.restoreSelection();
            this.execCommand('inserthtml', "<pre class='brush:" + syntax + "'>"+ sel + "</pre>");
            this.modalClose();
        },
	
		// INSERT FILE
		showFile: function()
		{
			this.saveSelection();
		
			var handler = $.proxy(function()
			{
				var sel = this.getSelection();
			
				var text = '';
				
				if (this.oldIE())
				{
					text = sel.text;
				}				
				else
				{
					text = sel.toString();
				}
	
				$('#redactor_filename').val(text);
	
				// dragupload
				if (this.opts.uploadCrossDomain === false && this.isMobile() === false)
				{						
					$('#redactor_file').dragupload(
					{
						url: this.opts.fileUpload,
						uploadFields: this.opts.uploadFields,
						success: $.proxy(function(data)
						{
							this.fileUploadCallback(data);
						}, this)
					});
				}
	
				this.uploadInit('redactor_file', { auto: true, url: this.opts.fileUpload, success: $.proxy(function(data) {
	
					this.fileUploadCallback(data);
	
				}, this)});
				
			}, this);
	
			this.modalInit(RLANG.file, 'file', 500, handler);
		},
		fileUploadCallback: function(json)
		{
			this.restoreSelection();		
		
			if (json !== false)
			{
				var data = $.parseJSON(json);
				var text = $('#redactor_filename').val();
				
				if (text === '')
				{
					text = data.filename;
				}
				
				var link = '<a href="' + data.filelink + '">' + text + '</a>';
			
				// chrome fix
				if ($.browser.webkit && !!window.chrome)
				{
					link = link + '&nbsp;'; 
				}
	
				this.execCommand('inserthtml', link);
	
				// file upload callback
				if (typeof this.opts.fileUploadCallback === 'function') 
				{
					this.opts.fileUploadCallback(this, data);
				}
			}
			
			this.modalClose();
		},	
	
		
		
		// MODAL
		modalInit: function(title, url, width, handler, endCallback)
		{
			// modal overlay
			if ($('#redactor_modal_overlay').size() === 0)
			{
				this.overlay = $('<div id="redactor_modal_overlay" style="display: none;"></div>');
				$('body').prepend(this.overlay);
			}
	
			if (this.opts.overlay)
			{
				$('#redactor_modal_overlay').show();
				$('#redactor_modal_overlay').click($.proxy(this.modalClose, this));
			}
	
			if ($('#redactor_modal').size() === 0)
			{
				this.modal = $('<div id="redactor_modal" style="display: none;"><div id="redactor_modal_close">&times;</div><div id="redactor_modal_header"></div><div id="redactor_modal_inner"></div></div>');
				$('body').append(this.modal);
			}
	
			$('#redactor_modal_close').click($.proxy(this.modalClose, this));
	
			this.hdlModalClose = $.proxy(function(e) { if ( e.keyCode === 27) { this.modalClose(); } }, this);
			
			$(document).keyup(this.hdlModalClose);
			this.$editor.keyup(this.hdlModalClose);

			$('#redactor_modal_inner').html(this.opts['modal_' + url]);
			$('#redactor_modal_header').html(title);

			// tabs
			if ($('#redactor_tabs').size() !== 0)
			{
				var that = this;
				$('#redactor_tabs a').each(function(i,s)
				{
					i++;
					$(s).click(function()
					{
						$('#redactor_tabs a').removeClass('redactor_tabs_act');
						$(this).addClass('redactor_tabs_act');
						$('.redactor_tab').hide();
						$('#redactor_tab' + i).show();
						$('#redactor_tab_selected').val(i);
						
						if (that.isMobile() === false)
						{
							var height = $('#redactor_modal').outerHeight();
							$('#redactor_modal').css('margin-top', '-' + (height+10)/2 + 'px');
						}
					});
				});
			}
	
			$('#redactor_btn_modal_close').click($.proxy(this.modalClose, this));
			
			// callback
			if (typeof(handler) === 'function')
			{
				handler();
			}
			
			// setup
			var height = $('#redactor_modal').outerHeight();
	
			if (this.isMobile() === false)
			{		
				$('#redactor_modal').css({ position: 'fixed', top: '50%', left: '50%', width: width + 'px', height: 'auto', minHeight: 'auto', marginTop: '-' + (height+10)/2 + 'px', marginLeft: '-' + (width+60)/2 + 'px' }).fadeIn('fast');
				
				this.modalSaveBodyOveflow = $(document.body).css('overflow');
				$(document.body).css('overflow', 'hidden');			
			}
			else
			{
				$('#redactor_modal').css({ position: 'fixed', width: '100%', height: '100%', top: '0', left: '0', margin: '0', minHeight: '300px' }).show();			
			}
	
			// end callback
			if (typeof(endCallback) === 'function')
			{
				endCallback();
			}
	
		},
		modalClose: function()
		{
	
			$('#redactor_modal_close').unbind('click', this.modalClose);
			$('#redactor_modal').fadeOut('fast', $.proxy(function()
			{
				$('#redactor_modal_inner').html('');
	
				if (this.opts.overlay)
				{
					$('#redactor_modal_overlay').hide();
					$('#redactor_modal_overlay').unbind('click', this.modalClose);
				}
				
				$(document).unbind('keyup', this.hdlModalClose);
				this.$editor.unbind('keyup', this.hdlModalClose);
	
			}, this));
			
			if (this.isMobile() === false)
			{
				$(document.body).css('overflow', this.modalSaveBodyOveflow);	
			}
	
		},
		setModalTab: function(num)
		{
			$('.redactor_tab').hide();
			var tabs = $('#redactor_tabs a');
			tabs.removeClass('redactor_tabs_act');
			tabs.eq(num-1).addClass('redactor_tabs_act');
			$('#redactor_tab' + num).show();			
		},
	
		// UPLOAD
		uploadInit: function(element, options)
		{
			// Upload Options
			this.uploadOptions = {
				url: false,
				success: false,
				start: false,
				trigger: false,
				auto: false,
				input: false
			};
	
			$.extend(this.uploadOptions, options);
	
			// Test input or form
			if ($('#' + element).size() !== 0 && $('#' + element).get(0).tagName === 'INPUT')
			{
				this.uploadOptions.input = $('#' + element);
				this.element = $($('#' + element).get(0).form);
			}
			else
			{
				this.element = $('#' + element);
			}
			
			this.element_action = this.element.attr('action');
			
			// Auto or trigger
			if (this.uploadOptions.auto)
			{
				$(this.uploadOptions.input).change($.proxy(function()
				{
					this.element.submit(function(e) { return false; });
					this.uploadSubmit();
				}, this));
	
			}
			else if (this.uploadOptions.trigger)
			{
				$('#' + this.uploadOptions.trigger).click($.proxy(this.uploadSubmit, this));
			}
		},
		uploadSubmit : function()
		{
			this.uploadForm(this.element, this.uploadFrame());
		},
		uploadFrame : function()
		{
			this.id = 'f' + Math.floor(Math.random() * 99999);
		
			var d = document.createElement('div');
			var iframe = '<iframe style="display:none" id="'+this.id+'" name="'+this.id+'"></iframe>';
			d.innerHTML = iframe;
			document.body.appendChild(d);
		
			// Start
			if (this.uploadOptions.start)
			{
				this.uploadOptions.start();
			}
		
			$('#' + this.id).load($.proxy(this.uploadLoaded, this));
		
			return this.id;
		},
		uploadForm : function(f, name)
		{
			if (this.uploadOptions.input)
			{
				var formId = 'redactorUploadForm' + this.id;
				var fileId = 'redactorUploadFile' + this.id;
				this.form = $('<form  action="' + this.uploadOptions.url + '" method="POST" target="' + name + '" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
				
				// append hidden fields
				if (this.opts.uploadFields !== false && typeof this.opts.uploadFields === 'object')
				{
					$.each(this.opts.uploadFields, $.proxy(function(k,v)
					{					
						if (v.indexOf('#') === 0)
						{
							v = $(v).val();
						}
						
						var hidden = $('<input type="hidden" name="' + k + '" value="' + v + '">');
						$(this.form).append(hidden);
			
					}, this));
				}				
				
				var oldElement = this.uploadOptions.input;
				var newElement = $(oldElement).clone();
				$(oldElement).attr('id', fileId);
				$(oldElement).before(newElement);
				$(oldElement).appendTo(this.form);
				$(this.form).css('position', 'absolute');
				$(this.form).css('top', '-2000px');
				$(this.form).css('left', '-2000px');
				$(this.form).appendTo('body');  
	
				this.form.submit();
			}
			else
			{
				f.attr('target', name);
				f.attr('method', 'POST');
				f.attr('enctype', 'multipart/form-data');
				f.attr('action', this.uploadOptions.url);
		
				this.element.submit();
			}
		
		},
		uploadLoaded : function()
		{
			var i = $('#' + this.id);
			var d;
			
			if (i.contentDocument)
			{
				d = i.contentDocument;
			}
			else if (i.contentWindow)
			{
				d = i.contentWindow.document;
			}
			else
			{
				d = window.frames[this.id].document;
			}
			
			// Success
			if (this.uploadOptions.success)
			{
				if (typeof d !== 'undefined')
				{
					// Remove bizarre <pre> tag wrappers around our json data:				
					var rawString = d.body.innerHTML;
					var jsonString = rawString.match(/\{.*\}/)[0];
					this.uploadOptions.success(jsonString);
				}
				else
				{
					alert('Upload failed!');
					this.uploadOptions.success(false);
				}
			}
		
			this.element.attr('action', this.element_action);
			this.element.attr('target', '');
		
		},
		
		// UTILITY
		oldIE: function()
		{
			if ($.browser.msie && parseInt($.browser.version, 10) < 9)
			{
				return true;
			}
			
			return false;
		},
		outerHTML: function(s) 
		{
			return $("<p>").append($(s).eq(0).clone()).html();
		},
		normalize: function(str)
		{
			return parseInt(str.replace('px',''), 10);
		},
		isMobile: function(ipad) 
		{
			if (ipad === true && /(iPhone|iPod|iPad|BlackBerry|Android)/.test(navigator.userAgent))
			{
				return true;
			}
			else if (/(iPhone|iPod|BlackBerry|Android)/.test(navigator.userAgent))
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	
	};
	
	
	// API
	$.fn.getEditor = function() 
	{
		return this.data('redactor').$editor;
	};
	
	$.fn.getCode = function() 
	{
		return this.data('redactor').getCode();
	};
	
	$.fn.getText = function() 
	{
		return this.data('redactor').$editor.text();	
	};	
	
	$.fn.getSelected = function() 
	{
		return this.data('redactor').getSelectedHtml();	
	};			
	
	$.fn.setCode = function(html)
	{
		this.data('redactor').setCode(html);
	};
	
	$.fn.insertHtml = function(html)
	{
		this.data('redactor').insertHtml(html);
	};
	
	$.fn.destroyEditor = function()
	{
		this.data('redactor').destroy();
		this.removeData('redactor');
	};
	
	$.fn.setFocus = function()
	{
		this.data('redactor').$editor.focus();
	};
	
	$.fn.execCommand = function(cmd, param)
	{
		this.data('redactor').execCommand(cmd, param);
	};

})(jQuery);

/*
	Plugin Drag and drop Upload v1.0.2
	http://imperavi.com/ 
	Copyright 2012, Imperavi Inc.
*/
(function($){
	
	"use strict";
	
	// Initialization	
	$.fn.dragupload = function(options)
	{		
		return this.each(function() {
			var obj = new Construct(this, options);
			obj.init();
		});
	};
	
	// Options and variables	
	function Construct(el, options) {

		this.opts = $.extend({
		
			url: false,
			success: false,
			preview: false,
			uploadFields: false,
			
			text: RLANG.drop_file_here,
			atext: RLANG.or_choose
			
		}, options);
		
		this.$el = $(el);
	}

	// Functionality
	Construct.prototype = {
		init: function()
		{	
			if (!$.browser.msie) 
			{	
				this.droparea = $('<div class="redactor_droparea"></div>');
				this.dropareabox = $('<div class="redactor_dropareabox">' + this.opts.text + '</div>');	
				this.dropalternative = $('<div class="redactor_dropalternative">' + this.opts.atext + '</div>');
				
				this.droparea.append(this.dropareabox);
				
				this.$el.before(this.droparea);
				this.$el.before(this.dropalternative);

				// drag over
				this.dropareabox.bind('dragover', $.proxy(function() { return this.ondrag(); }, this));
				
				// drag leave
				this.dropareabox.bind('dragleave', $.proxy(function() { return this.ondragleave(); }, this));
		
				var uploadProgress = $.proxy(function(e) 
				{ 
					var percent = parseInt(e.loaded / e.total * 100, 10);
					this.dropareabox.text('Loading ' + percent + '%');
					
				}, this);
		
				var xhr = jQuery.ajaxSettings.xhr();
				
				if (xhr.upload)
				{
					xhr.upload.addEventListener('progress', uploadProgress, false);
				}
				
				var provider = function () { return xhr; };
		
				// drop
				this.dropareabox.get(0).ondrop = $.proxy(function(event)
				{
					event.preventDefault();
					
					this.dropareabox.removeClass('hover').addClass('drop');
					
					var file = event.dataTransfer.files[0];
					var fd = new FormData();

					// append hidden fields
					if (this.opts.uploadFields !== false && typeof this.opts.uploadFields === 'object')
					{
						$.each(this.opts.uploadFields, $.proxy(function(k,v)
						{					
							if (v.indexOf('#') === 0)
							{
								v = $(v).val();
							}
							
							fd.append(k, v);
					
						}, this));
					}	
					
					// append file data
					fd.append('file', file);
					

					$.ajax({
						dataType: 'html',
						url: this.opts.url,
						data: fd,
						xhr: provider,
						cache: false,
						contentType: false,
						processData: false,
						type: 'POST',
						success: $.proxy(function(data)
						{
							if (this.opts.success !== false)
							{
								this.opts.success(data);
							}
							
							if (this.opts.preview === true)
							{
								this.dropareabox.html(data);
							}
							
						}, this)
					});


				}, this);
			}
		},
		ondrag: function()
		{
			this.dropareabox.addClass('hover');
			return false;
		},
		ondragleave: function()
		{
			this.dropareabox.removeClass('hover');
			return false;
		}
	};

})(jQuery);


// Define: Linkify plugin from stackoverflow
(function($){

	"use strict";

	var protocol = 'http://';
	var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
	url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,

		linkifyThis = function () 
		{
			var childNodes = this.childNodes,
			i = childNodes.length;
			while(i--)
			{
				var n = childNodes[i];
				if (n.nodeType === 3) 
				{
					var html = n.nodeValue;
					if (html)
					{
						html = html.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(url1, '$1<a href="' + protocol + '$2">$2</a>$3')
									.replace(url2, '$1<a href="$2">$2</a>$5');

						$(n).after(html).remove();
					}
				}
				else if (n.nodeType === 1  &&  !/^(a|button|textarea)$/i.test(n.tagName))
				{
					linkifyThis.call(n);
				}
			}
		};
	
	$.fn.linkify = function ()
	{
		this.each(linkifyThis);
	};

})(jQuery);




/* jQuery plugin textselect
 * version: 0.9
 * author: Josef Moravec, josef.moravec@gmail.com
 * updated: Imperavi Inc.
 * 
 */
(function($){$.event.special.textselect={setup:function(data,namespaces){$(this).data("textselected",false);$(this).data("ttt",data);$(this).bind('mouseup',$.event.special.textselect.handler)},teardown:function(data){$(this).unbind('mouseup',$.event.special.textselect.handler)},handler:function(event){var data=$(this).data("ttt");var text=$.event.special.textselect.getSelectedText(data).toString();if(text!=''){$(this).data("textselected",true);event.type="textselect";event.text=text;$.event.handle.apply(this,arguments)}},getSelectedText:function(data){var text='';if(window.getSelection)text=window.getSelection();else if(document.getSelection) text=document.getSelection();else if(document.selection)text=document.selection.createRange().text;return text}};$.event.special.textunselect={setup:function(data,namespaces){$(this).data("rttt",data);$(this).data("textselected",false);$(this).bind('mouseup',$.event.special.textunselect.handler);$(this).bind('keyup',$.event.special.textunselect.handlerKey)},teardown:function(data){$(this).unbind('mouseup',$.event.special.textunselect.handler)},handler:function(event){if($(this).data("textselected")){var data=$(this).data("rttt");var text=$.event.special.textselect.getSelectedText(data).toString();if(text==''){$(this).data("textselected",false);event.type="textunselect";$.event.handle.apply(this,arguments)}}},handlerKey:function(event){if($(this).data("textselected")){var data=$(this).data("rttt");var text=$.event.special.textselect.getSelectedText(data).toString();if((event.keyCode=27)&&(text=='')){$(this).data("textselected",false);event.type="textunselect";$.event.handle.apply(this,arguments)}}}}})(jQuery);;function toggleLogin() {
	if($('#login-form').css('display')=='none') {
		$('.subscribe').css('display','none');
		$('#login-form').css('display', 'inline');
		$('#login-link').css('display', 'none');
		$('#join-link').css('display', 'none');
		$('.account-area').css('width','400px');
		$('#login-form').show()		
	} else {
		$('#login-form').hide();
		$('.subscribe').css('display','block');
		$('.account-area').css('width','300px');
		$('#login-link').css('display', 'inline');
		$('#join-link').css('display', 'inline');
	}
	return false;
}

$(document).click(function() {
    $('.login-register-box').hide();
});

function show_login_register_box(event, id) {
    $('.login-register-box').hide();
    $('#login-register-box-' + id).show();
    event.stopPropagation();
    return false;
}

$(document).ready(function() {

    //Set content editor redactor on add/edit pages and comments

    $('#edit-body').redactor({
        convertDivs: false,
        autoresize: false,
        path: '/sites/all/themes/dzone2012/scripts/redactor',
        buttons:     ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|',
            'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
            'image', 'video', 'file', 'table', 'link', '|',
            'alignleft', 'aligncenter', 'alignright', 'justify', '|',
            'fullscreen', 'code'],
        buttonsCustom: {
            code: {
                title: 'Code',
                func: 'showCode'
            }
        }
    });

    $('#edit-comment').redactor({
        convertDivs: false,
        autoresize: false,
        path: '/sites/all/themes/dzone2012/scripts/redactor',
        buttons:     ['html', '|', 'formatting', '|', 'bold', 'italic', 'deleted', '|',
            'unorderedlist', 'orderedlist', 'outdent', 'indent', '|',
            'image', 'video', 'file', 'table', 'link', '|',
            'alignleft', 'aligncenter', 'alignright', 'justify', '|',
            'fullscreen', 'code'],
        buttonsCustom: {
            code: {
                title: 'Code',
                func: 'showCode'
            }
        }
    });

    // $('#download-form').html($('#download-table'));
    $('#download-form').show();

//    var oTable = $("#download-table").dataTable();

	// Load the country/state JS if we're on the reg page
	if ($("#edit-extprofile-country").length > 0) {
		$("#edit-extprofile-country").bind("change", function() { 
			if ($("#edit-extprofile-country").val() != "US" && $("#edit-extprofile-country").val() != 'CA') {
				$("#edit-extprofile-state").val("Outside US/Canada");
				$("#edit-extprofile-state option:lt(67)").attr("disabled", "disabled");
				$("#edit-extprofile-state option:last").removeAttr("disabled");
				$("#edit-extprofile-state option:last").attr("selected", "selected");
			} else {
				if ($("#edit-extprofile-country").val() == 'CA') {
					$("#edit-extprofile-state").val("--");
					$("#edit-extprofile-state option:lt(53)").attr("disabled", "disabled");
					$("#edit-extprofile-state option:gt(53)").removeAttr("disabled");
					$("#edit-extprofile-state option:gt(66)").attr("disabled", "disabled");
				} else {
					$("#edit-extprofile-state").val("0");	
					$("#edit-extprofile-state option:gt(53)").attr("disabled", "disabled");	
					$("#edit-extprofile-state option:lt(53)").removeAttr("disabled");
                    $("#edit-extprofile-state option:gt(66)").attr("disabled", "disabled");
				}
//				$("#edit-extprofile-state option:last").attr("disabled", "disabled");
			}
		});
		
		if ($("#edit-extprofile-country").val() == "US" &&
			$("#edit-extprofile-state").val() != "0" && $("#edit-extprofile-state").val() != '--') {
			$("#edit-extprofile-state option:gt(53)").attr("disabled", "disabled");
			$("#edit-extprofile-state option:lt(53)").removeAttr("disabled");
			$("#edit-extprofile-state option:last").attr("disabled", "disabled");
		}

		if ($("#edit-extprofile-country").val() != "US" && $("#edit-extprofile-country").val() != 'CA') {
			$("#edit-extprofile-state").val("Outside US/Canada");
			$("#edit-extprofile-state option:gt(-1)").attr("disabled", "disabled");
			$("#edit-extprofile-state option:last").removeAttr("disabled");
			$("#edit-extprofile-state option:last").attr("selected", "selected");
		}
	}
});

var $t = 0;

$('.submitted #author span').click(function(){
   $('#author_block').slideToggle('fast');
   $(this).toggleClass('author_selected');
});

$('.username').click(function(){
   $('.user-controls').slideDown('fast');
});

$('.user-controls').mouseout(function(){
    $t = setTimeout("$('.user-controls').slideUp('fast');", 700);
    $('.user-controls').mouseover(function(){
        clearTimeout($t);
    });
});;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('f(!1h.2I){l 2I=h(){l p={61:{"1b-1d":"","7f-2R":1,"1W-1P":u,"1B":u,"85-6L":U,"1H-1P":4,"5p":M,"5z":U,"1u":U,"5E":M,"7R-6e":U,"6n":M},R:{59:u,4x:16,4P:16,8h:M,7I:"4p",1n:{4t:"98 1c",4o:"99 1c",67:"97 96 7C",6y:"93 I 94 2a 95 7C 9a",38:"38",6B:"?",1q:"2I\\n\\n",6t:"9b\'t 9h 7J C: ",6b:"9i 9g\'t 9f C 2c-2q 9c: ",77:"<!9d 2c 9e \\"-//92//7d 91 1.0 8P//8Q\\" \\"2j://8e.8f.8c/8R/7e/7d/7e-8O.8N\\"><2c 8K=\\"2j://8e.8f.8c/8L/8M\\"><84><8S 2j-8T=\\"8Z-90\\" 5u=\\"2g/2c; 8Y=8X-8\\" /><4O>8U 2I</4O></84><2E 1g=\\"1W-6l:8V,\\"6g 8W 9j\\",6g,5Y;9k-4H:#9J;4H:#9K;1W-1P:9I;2g-6r:6p;\\"><z 1g=\\"2g-6r:6p;5v-4S:9H;\\"><z 1g=\\"1W-6l:9E,9F,8J,9L-5Y;1W-1P:9M-9S;\\">2I</z><z 1g=\\"1W-1P:.9T;5v-9R:9Q;\\"><z>5T 2.0.9N (9O 9P 6C)</z><z><a 2e=\\"2j://74.58\\" 9D=\\"55\\" 1g=\\"4H:#9C;2g-9q:9r;\\">2j://74.58</a></z></z><z>9s I 9p 9o.</z><z>9l 9m-6C 9n 9t.</z></z></2E></2c>"},7F:M},1t:{5j:u,3w:u,3f:u,5F:{}},2T:{},7b:{9u:/\\/\\*[\\s\\S]*?\\*\\//4G,9A:/\\/\\/.*$/4G,9B:/#.*$/4G,9y:/"(?:\\.|(\\\\\\")|[^\\""\\n])*"/g,9v:/\'(?:\\.|(\\\\\\\')|[^\\\'\'\\n])*\'/g,9w:/"(?:\\.|(\\\\\\")|[^\\""])*"/g,9x:/\'(?:\\.|(\\\\\\\')|[^\\\'\'])*\'/g,3L:/\\w+:\\/\\/[\\w-.\\/?%&=]*/g,9U:{D:/(&1I;|<)\\?=?/g,19:/\\?(&2x;|>)/g},8r:{D:/(&1I;|<)%=?/g,19:/%(&2x;|>)/g},8s:{D:/(&1I;|<)\\s*2q.*?(&2x;|>)/4l,19:/(&1I;|<)\\/\\s*2q\\s*(&2x;|>)/4l}},1u:{18:h(3G){l 3E=J.1w("39"),4F=p.1u.7V;3E.Z="1u";C(l 2J 2a 4F){l 6J=4F[2J],4D=Q 6J(3G),1V=4D.18();3G.5o[2J]=4D;f(1V==u){1O}f(8I(1V)=="8H"){1V=p.1u.6T(1V,3G.1j,2J)}1V.Z+="8z "+2J;3E.1K(1V)}q 3E},6T:h(4M,6Y,4N){l a=J.1w("a"),4L=a.1g,4J=p.R,4K=4J.4x,4C=4J.4P;a.2e="#"+4N;a.4O=4M;a.4Q=6Y;a.6q=4N;a.1x=4M;f(5r(4K)==M){4L.1M=4K+"5q"}f(5r(4C)==M){4L.2i=4C+"5q"}a.8p=h(e){8k{p.1u.6W(c,e||1h.68,c.4Q,c.6q)}8l(e){p.B.1q(e.6M)}q M};q a},6W:h(7Z,89,81,86,7W){l 4B=p.1t.5F[81],4s;f(4B==u||(4s=4B.5o[86])==u){q u}q 4s.2f(7Z,89,7W)},7V:{4t:h(4r){c.18=h(){f(4r.T("5E")!=U){q}q p.R.1n.4t};c.2f=h(4q,8C,8w){l z=4r.z;4q.7x.4j(4q);z.Z=z.Z.E("5D","")}},4o:h(7N){c.18=h(){q p.R.1n.4o};c.2f=h(8o,8E,8x){l 3C=p.B.3y(7N.5B).E(/</g,"&1I;"),2d=p.B.4R("","55",8F,8v,"70=0, 8n=1, 8u=0, 75=1");3C=p.B.2z(3C);2d.J.35("<4p>"+3C+"</4p>");2d.J.54()}},67:h(5c){l 3c,9G,5a=5c.1j;c.18=h(){l 2K=p.R;f(1h.70.a8=="b8:"||2K.59==u){q u}h 1y(4u){l 4A="";C(l 4v 2a 4u){4A+="<b7 1d=\'"+4v+"\' 1N=\'"+4u[4v]+"\'/>"}q 4A};h 2k(4z){l 4w="";C(l 4y 2a 4z){4w+=" "+4y+"=\'"+4z[4y]+"\'"}q 4w};l 56={1M:2K.4x,2i:2K.4P,1j:5a+"b6",6w:"b4/x-6c-6o"},57={b5:"b9",ba:"bf",be:"4Q="+5a,bd:"M"},5b=2K.59,3a;f(/bc/i.1X(80.83)){3a="<5R"+2k({b3:"b2:aU-aT-aS-aQ-aR",aW:"2j://b0.aZ.58/aX/6c/bh/6o/bg.bm#5T=9,0,0,0"})+2k(56)+">"+1y(57)+1y({bD:5b})+"</5R>"}F{3a="<bB"+2k(56)+2k(57)+2k({bC:5b})+"/>"}3c=J.1w("z");3c.1x=3a;q 3c};c.2f=h(bE,bF,5g){l 71=5g.by;6V(71){2H"5Q":l 5h=p.B.2z(p.B.3y(5c.5B).E(/&1I;/g,"<").E(/&2x;/g,">").E(/&bw;/g,"&"));f(1h.6P){1h.6P.bx("2g",5h)}F{q p.B.2z(5h)}2H"bl":p.B.1q(p.R.1n.6y);30;2H"bk":p.B.1q(5g.6M);30}}},bi:h(5f){c.18=h(){q p.R.1n.38};c.2f=h(bj,bo,9V){l 1U=J.1w("bv"),1J=u;f(p.1t.3f!=u){J.2E.4j(p.1t.3f)}p.1t.3f=1U;1U.1g.bu="bt:bq;1M:6H;2i:6H;D:-6G;4S:-6G;";J.2E.1K(1U);1J=1U.5d.J;6F(1J,1h.J);1J.35("<z 1b=\\""+5f.z.Z.E("5D","")+" bs\\">"+5f.z.1x+"</z>");1J.54();1U.5d.52();1U.5d.38();h 6F(6x,6E){l 2L=6E.7v("5e");C(l i=0;i<2L.v;i++){f(2L[i].6v.aP()=="6z"&&/ac\\.12$/.1X(2L[i].2e)){6x.35("<5e 6w=\\"2g/12\\" 6v=\\"6z\\" 2e=\\""+2L[i].2e+"\\"></5e>")}}}}},af:h(ag){c.18=h(){q p.R.1n.6B};c.2f=h(al,ak){l 2d=p.B.4R("","55",ah,ai,"75=0"),1J=2d.J;1J.35(p.R.1n.77);1J.54();2d.52()}}}},B:{5w:h(6Z){q 6Z+3I.a0(3I.9Y()*9W).2t()},5H:h(4V,4U){l 3g={},20;C(20 2a 4V){3g[20]=4V[20]}C(20 2a 4U){3g[20]=4U[20]}q 3g},5V:h(4T){6V(4T){2H"U":q U;2H"M":q M}q 4T},4R:h(3L,63,4W,4n,2G){l x=(79.1M-4W)/2,y=(79.2i-4n)/2;2G+=", D="+x+", 4S="+y+", 1M="+4W+", 2i="+4n;2G=2G.E(/^,/,"");l 51=1h.a2(3L,63,2G);51.52();q 51},7D:h(1L,23,1Z){f(1L.5X){1L["e"+23+1Z]=1Z;1L[23+1Z]=h(){1L["e"+23+1Z](1h.68)};1L.5X("a6"+23,1L[23+1Z])}F{1L.a3(23,1Z,M)}},1q:h(A){1q(p.R.1n.1q+A)},41:h(4Z,65){l 2y=p.1t.5j,3l=u;f(2y==u){2y={};C(l 4Y 2a p.2T){l 3k=p.2T[4Y].am;f(3k==u){1O}C(l i=0;i<3k.v;i++){2y[3k[i]]=4Y}}p.1t.5j=2y}3l=p.2T[2y[4Z]];f(3l==u&&65!=M){p.B.1q(p.R.1n.6t+4Z)}q 3l},4a:h(A,6m){l 2C=A.27("\\n");C(l i=0;i<2C.v;i++){2C[i]=6m(2C[i])}q 2C.5n("\\n")},7q:h(){l z=J.1w("z"),3m=J.1w("z"),6s=10,i=1;1S(i<=aE){f(i%6s===0){z.1x+=i;i+=(i+"").v}F{z.1x+="&aC;";i++}}3m.Z="5p 2R";3m.1K(z);q 3m},6D:h(A){q A.E(/^[ ]*[\\n]+|[\\n]*[ ]*$/g,"")},7H:h(A){l 3i,3V={},5i=Q O("^\\\\[(?<4f>(.*?))\\\\]$"),6k=Q O("(?<1d>[\\\\w-]+)"+"\\\\s*:\\\\s*"+"(?<1N>"+"[\\\\w-%]+|"+"\\\\[.*?\\\\]|"+"\\".*?\\"|"+"\'.*?\'"+")\\\\s*;?","g");1S((3i=6k.N(A))!=u){l 2u=3i.1N.E(/^[\'"]|[\'"]$/g,"");f(2u!=u&&5i.1X(2u)){l m=5i.N(2u);2u=m.4f.v>0?m.4f.27(/\\s*,\\s*/):[]}3V[3i.1d]=2u}q 3V},6a:h(A,12){f(A==u||A.v==0||A=="\\n"){q A}A=A.E(/</g,"&1I;");A=A.E(/ {2,}/g,h(m){l 3U="";C(l i=0;i<m.v-1;i++){3U+="&1R;"}q 3U+" "});f(12!=u){A=p.B.4a(A,h(2s){f(2s.v==0){q""}l 3r="";2s=2s.E(/^(&1R;| )+/,h(s){3r=s;q""});f(2s.v==0){q 3r}q 3r+"<I 1b=\\""+12+"\\">"+2s+"</I>"})}q A},7P:h(6f,7a){l 2D=6f.2t();1S(2D.v<7a){2D="0"+2D}q 2D},5G:h(){l 36=J.1w("z"),3h,37=0,4i=J.2E,1j=p.B.5w("5G"),2F="<z 1b=\\"",2M="</z>",4h="</1Q>";36.1x=2F+"6u\\">"+2F+"28\\">"+2F+"2R\\">"+2F+"5u"+"\\"><1Q 1b=\\"7Q\\"><1Q 1j=\\""+1j+"\\">&1R;"+4h+4h+2M+2M+2M+2M;4i.1K(36);3h=J.aJ(1j);f(/aK/i.1X(80.83)){l 87=1h.aB(3h,u);37=7i(87.aA("1M"))}F{37=3h.as}4i.4j(36);q 37},72:h(7U,7T){l 1H="";C(l i=0;i<7T;i++){1H+=" "}q 7U.E(/\\t/g,1H)},6A:h(2N,4c){l ar=2N.27("\\n"),1H="\\t",47="";C(l i=0;i<50;i++){47+="                    "}h 8j(3e,17,88){q 3e.22(0,17)+47.22(0,88)+3e.22(17+1,3e.v)};2N=p.B.4a(2N,h(24){f(24.1e(1H)==-1){q 24}l 17=0;1S((17=24.1e(1H))!=-1){l 8g=4c-17%4c;24=8j(24,17,8g)}q 24});q 2N},3y:h(A){q(p.R.8h==U)?A.E(/<br\\s*\\/?>|&1I;br\\s*\\/?&2x;/4l,"\\n"):A},3O:h(A){q A.E(/\\s*$/g,"").E(/^\\s*/,"")},2z:h(A){l 29=p.B.3y(A).27("\\n"),az=Q 5A(),7X=/^\\s*/,25=ay;C(l i=0;i<29.v&&25>0;i++){l 43=29[i];f(p.B.3O(43).v==0){1O}l 44=7X.N(43);f(44==u){q A}25=3I.25(44[0].v,25)}f(25>0){C(l i=0;i<29.v;i++){29[i]=29[i].22(25)}}q 29.5n("\\n")},7K:h(2U,2V){f(2U.H<2V.H){q-1}F{f(2U.H>2V.H){q 1}F{f(2U.v<2V.v){q-1}F{f(2U.v>2V.v){q 1}}}}q 0},2Q:h(7l,2Y){h 7r(3X,7s){q[Q p.4m(3X[0],3X.H,7s.12)]};l av=0,4e=u,3M=[],7k=2Y.3R?2Y.3R:7r;1S((4e=2Y.3D.N(7l))!=u){3M=3M.2P(7k(4e,2Y))}q 3M},6d:h(7c){q 7c.E(p.7b.3L,h(m){q"<a 2e=\\""+m+"\\">"+m+"</a>"})}},1B:h(7G,46){h 7u(4g){l 49=[];C(l i=0;i<4g.v;i++){49.K(4g[i])}q 49};l 3J=46?[46]:7u(J.7v(p.R.7I)),7M="1x",2l=u;f(3J.v===0){q}C(l i=0;i<3J.v;i++){l 2B=3J[i],2b=p.B.7H(2B.Z),2W;2b=p.B.5H(7G,2b);2W=2b["7J"];f(2W==u){1O}f(2b["2c-2q"]=="U"){2l=Q p.4X(2W)}F{l 48=p.B.41(2W);f(48){2l=Q 48()}F{1O}}2l.1B(2B[7M],2b);l 2h=2l.z;f(p.R.7F){2h=J.1w("an");2h.1N=2l.z.1x;2h.1g.1M="a4";2h.1g.2i="a7"}2B.7x.a1(2h,2B)}},9Z:h(7B){p.B.7D(1h,"ae",h(){p.1B(7B)})}};p.4m=h(45,6i,12){c.1N=45;c.H=6i;c.v=45.v;c.12=12};p.4m.Y.2t=h(){q c.1N};p.4X=h(3S){l 1C=p.B.41(3S),3Q=Q p.2T.aO(),bn=u;f(1C==u){q}1C=Q 1C();c.5O=3Q;f(1C.3z==u){p.B.1q(p.R.1n.6b+3S);q}3Q.5s.K({3D:1C.3z.I,3R:66});h 3F(42,5Z){C(l j=0;j<42.v;j++){42[j].H+=5Z}};h 66(13,bA){l 6X=13.I,1D=[],3Y=1C.5s,6Q=13.H+13.D.v,2S=1C.3z,1o;C(l i=0;i<3Y.v;i++){1o=p.B.2Q(6X,3Y[i]);3F(1o,6Q);1D=1D.2P(1o)}f(2S.D!=u&&13.D!=u){1o=p.B.2Q(13.D,2S.D);3F(1o,13.H);1D=1D.2P(1o)}f(2S.19!=u&&13.19!=u){1o=p.B.2Q(13.19,2S.19);3F(1o,13.H+13[0].aV(13.19));1D=1D.2P(1o)}q 1D}};p.4X.Y.1B=h(6O,6R){c.5O.1B(6O,6R);c.z=c.5O.z};p.6U=h(){};p.6U.Y={T:h(64,69){l 5M=c.1y[64];q p.B.5V(5M==u?69:5M)},18:h(7j){q J.1w(7j)},7h:h(5N){C(l i=0;i<c.26.v;i++){l 2O=c.26[i];f(2O===u){1O}f((5N.H>2O.H)&&(5N.H<2O.H+2O.v)){q U}}q M},7y:h(3A,7L){l 2v=[];f(3A!=u){C(l i=0;i<3A.v;i++){2v=2v.2P(p.B.2Q(7L,3A[i]))}}2v=2v.aF(p.B.7K);q 2v},7w:h(){C(l i=0;i<c.26.v;i++){f(c.7h(c.26[i])){c.26[i]=u}}},7A:h(2X){l 3N=2X.27(/\\n/g),3x=7i(c.T("7f-2R")),7o=(3x+3N.v).2t().v,7O=c.T("1B",[]);2X="";C(l i=0;i<3N.v;i++){l 1v=3N[i],2r=/^(&1R;|\\s)+/.N(1v),5t="2R aw"+(i%2==0?1:2),8i=p.B.7P(3x+i,7o),8d=7O.1e((3x+i).2t())!=-1,1A=u;f(2r!=u){1A=2r[0].2t();1v=1v.22(1A.v);1A=1A.E(/&1R;/g," ");2r=p.1t.3w*1A.v}F{2r=0}1v=p.B.3O(1v);f(1v.v==0){1v="&1R;"}f(8d){5t+=" au"}2X+="<z 1b=\\""+5t+"\\">"+"<I 1b=\\"ap\\">"+8i+".</I>"+"<1Q 1b=\\"5u\\">"+(1A!=u?"<I 1b=\\"ao\\">"+1A.E(/\\s/g,"&1R;")+"</I>":"")+"<1Q 1b=\\"7Q\\" 1g=\\"5v-D: "+2r+"5q;\\">"+1v+"</1Q>"+"</1Q>"+"</z>"}q 2X},7z:h(5k,5l){l 17=0,3o="",3j=p.B.6a;C(l i=0;i<5l.v;i++){l 1z=5l[i];f(1z===u||1z.v===0){1O}3o+=3j(5k.22(17,1z.H-17),"6j")+3j(1z.1N,1z.12);17=1z.H+1z.v}3o+=3j(5k.22(17),"6j");q 3o},1B:h(1a,62){l aG=p.R,3v=p.1t,z,3d;c.1y={};c.z=u;c.28=u;c.I=u;c.2n=u;c.5o={};c.1j=p.B.5w("a5");3v.5F[c.1j]=c;f(1a===u){1a=""}f(3v.3w===u){3v.3w=p.B.5G()}c.1y=p.B.5H(p.61,62||{});f(c.T("6n")==U){c.1y.1u=c.1y.5z=M}c.z=z=c.18("39");c.28=c.18("39");c.28.Z="28";z.Z="6u";z.1j=c.1j;f(c.T("5E")){z.Z+=" 5D"}f(c.T("5z")==M){z.Z+=" a9"}z.Z+=" "+c.T("1b-1d");z.1g.aj=c.T("1W-1P","");c.5B=1a;c.I=p.B.6D(1a).E(/\\r/g," ");3d=c.T("1H-1P");c.I=c.T("85-6L")==U?p.B.6A(c.I,3d):p.B.72(c.I,3d);c.I=p.B.2z(c.I);f(c.T("1u")){c.2n=c.18("39");c.2n.Z="2n";c.2n.1K(p.1u.18(c));z.1K(c.2n)}f(c.T("5p")){z.1K(p.B.7q())}z.1K(c.28);c.26=c.7y(c.5s,c.I);c.7w();1a=c.7z(c.I,c.26);1a=c.7A(p.B.3O(1a));f(c.T("7R-6e")){1a=p.B.6d(1a)}c.28.1x=1a},8t:h(A){A=A.E(/^\\s+|\\s+$/g,"").E(/\\s+/g,"\\\\b|\\\\b");q"\\\\b"+A+"\\\\b"},8q:h(2A){c.3z={D:{3D:2A.D,12:"2q"},19:{3D:2A.19,12:"2q"},I:Q O("(?<D>"+2A.D.1c+")"+"(?<I>.*?)"+"(?<19>"+2A.19.1c+")","8y")}}};q p}()}f(!5A.1e){5A.Y.1e=h(73,3H){3H=3I.8D(3H||0,0);C(l i=3H;i<c.v;i++){f(c[i]==73){q i}}q-1}}f(!1h.O){(h(){l 2o={N:W.Y.N,6N:5C.Y.6N,E:5C.Y.E,27:5C.Y.27},1E={X:/(?:[^\\\\([#\\s.]+|\\\\(?!k<[\\w$]+>|[5U]{[^}]+})[\\S\\s]?|\\((?=\\?(?!#|<[\\w$]+>)))+|(\\()(?:\\?(?:(#)[^)]*\\)|<([$\\w]+)>))?|\\\\(?:k<([\\w$]+)>|[5U]{([^}]+)})|(\\[\\^?)|([\\S\\s])/g,9z:/(?:[^$]+|\\$(?![1-9$&`\']|{[$\\w]+}))+|\\$(?:([1-9]\\d*|[$&`\'])|{([$\\w]+)})/g,3b:/^(?:\\s+|#.*)+/,5I:/^(?:[?*+]|{\\d+(?:,\\d*)?})/,6S:/&&\\[\\^?/g,6K:/]/g},5W=h(5x,5P,60){C(l i=60||0;i<5x.v;i++){f(5x[i]===5P){q i}}q-1},7t=/()??/.N("")[1]!==33,3t={};O=h(1f,21){f(1f 4k W){f(21!==33){32 7n("4d\'t 4b 8B 82 8m 7p W 8G 8A")}q 1f.3B()}l 21=21||"",78=21.1e("s")>-1,76=21.1e("x")>-1,5m=M,3n=[],15=[],X=1E.X,G,34,3s,3P,3q;X.L=0;1S(G=2o.N.2p(X,1f)){f(G[2]){f(!1E.5I.1X(1f.14(X.L))){15.K("(?:)")}}F{f(G[1]){3n.K(G[3]||u);f(G[3]){5m=U}15.K("(")}F{f(G[4]){3P=5W(3n,G[4]);15.K(3P>-1?"\\\\"+(3P+1)+(5r(1f.5y(X.L))?"":"(?:)"):G[0])}F{f(G[5]){15.K(3t.7g?3t.7g.5Q(G[5],G[0].5y(1)==="P"):G[0])}F{f(G[6]){f(1f.5y(X.L)==="]"){15.K(G[6]==="["?"(?!)":"[\\\\S\\\\s]");X.L++}F{34=O.7Y("&&"+1f.14(G.H),1E.6S,1E.6K,"",{8a:"\\\\"})[0];15.K(G[6]+34+"]");X.L+=34.v+1}}F{f(G[7]){f(78&&G[7]==="."){15.K("[\\\\S\\\\s]")}F{f(76&&1E.3b.1X(G[7])){3s=2o.N.2p(1E.3b,1f.14(X.L-1))[0].v;f(!1E.5I.1X(1f.14(X.L-1+3s))){15.K("(?:)")}X.L+=3s-1}F{15.K(G[7])}}}F{15.K(G[0])}}}}}}}3q=W(15.5n(""),2o.E.2p(21,/[aD]+/g,""));3q.1r={1c:1f,2m:5m?3n:u};q 3q};O.aH=h(1d,o){3t[1d]=o};W.Y.N=h(A){l 1i=2o.N.2p(c,A),1d,i,5K;f(1i){f(7t&&1i.v>1){5K=Q W("^"+c.1c+"$(?!\\\\s)",c.5J());2o.E.2p(1i[0],5K,h(){C(i=1;i<7S.v-2;i++){f(7S[i]===33){1i[i]=33}}})}f(c.1r&&c.1r.2m){C(i=1;i<1i.v;i++){1d=c.1r.2m[i-1];f(1d){1i[1d]=1i[i]}}}f(c.3K&&c.L>(1i.H+1i[0].v)){c.L--}}q 1i}})()}W.Y.5J=h(){q(c.3K?"g":"")+(c.aq?"i":"")+(c.6h?"m":"")+(c.3b?"x":"")+(c.aI?"y":"")};W.Y.3B=h(7E){l 5L=Q O(c.1c,(7E||"")+c.5J());f(c.1r){5L.1r={1c:c.1r.1c,2m:c.1r.2m?c.1r.2m.14(0):u}}q 5L};W.Y.2p=h(bG,A){q c.N(A)};W.Y.bH=h(bp,6I){q c.N(6I[0])};O.3W=h(3Z,3T){l 40="/"+3Z+"/"+(3T||"");q O.3W[40]||(O.3W[40]=Q O(3Z,3T))};O.3u=h(A){q A.E(/[-[\\]{}()*+?.\\\\^$|,#\\s]/g,"\\\\$&")};O.7Y=h(A,D,V,1k,31){l 31=31||{},2Z=31.8a,11=31.9X,1k=1k||"",4I=1k.1e("g")>-1,5S=1k.1e("i")>-1,7m=1k.1e("m")>-1,4E=1k.1e("y")>-1,1k=1k.E(/y/g,""),D=D 4k W?(D.3K?D:D.3B("g")):Q O(D,"g"+1k),V=V 4k W?(V.3K?V:V.3B("g")):Q O(V,"g"+1k),1F=[],2w=0,1l=0,1m=0,1p=0,1T,1Y,1s,1G,3p,53;f(2Z){f(2Z.v>1){32 at("4d\'t 4b ad ax 7p 3u 8b")}f(7m){32 7n("4d\'t 4b 3u 8b 82 aL aM 6h aN")}3p=O.3u(2Z);53=Q W("^(?:"+3p+"[\\\\S\\\\s]|(?:(?!"+D.1c+"|"+V.1c+")[^"+3p+"])+)+",5S?"i":"")}1S(U){D.L=V.L=1m+(2Z?(53.N(A.14(1m))||[""])[0].v:0);1s=D.N(A);1G=V.N(A);f(1s&&1G){f(1s.H<=1G.H){1G=u}F{1s=u}}f(1s||1G){1l=(1s||1G).H;1m=(1s?D:V).L}F{f(!2w){30}}f(4E&&!2w&&1l>1p){30}f(1s){f(!2w++){1T=1l;1Y=1m}}F{f(1G&&2w){f(!--2w){f(11){f(11[0]&&1T>1p){1F.K([11[0],A.14(1p,1T),1p,1T])}f(11[1]){1F.K([11[1],A.14(1T,1Y),1T,1Y])}f(11[2]){1F.K([11[2],A.14(1Y,1l),1Y,1l])}f(11[3]){1F.K([11[3],A.14(1l,1m),1l,1m])}}F{1F.K(A.14(1Y,1l))}1p=1m;f(!4I){30}}}F{D.L=V.L=0;32 ab("aa aY bz b1 bb")}}f(1l===1m){1m++}}f(4I&&!4E&&11&&11[0]&&A.v>1p){1F.K([11[0],A.14(1p),1p,A.v])}D.L=V.L=0;q 1F};',62,726,'||||||||||||this|||if||function||||var||||sh|return||||null|length||||div|str|utils|for|left|replace|else|_109|index|code|document|push|lastIndex|false|exec|XRegExp||new|config||getParam|true|_121|RegExp|part|prototype|className||vN|css|_c3|slice|_107||pos|create|right|_ed|class|source|name|indexOf|_101|style|window|_111|id|_122|_12c|_12d|strings|_ca|_12e|alert|_x|_131|vars|toolbar|_e0|createElement|innerHTML|params|_ec|_e5|highlight|_bd|_c6|lib|_12a|_132|tab|lt|doc|appendChild|obj|width|value|continue|size|span|nbsp|while|_12f|_3c|_8|font|test|_130|_57|_4b|_102|substr|_56|_91|min|matches|split|lines|_97|in|_b4|html|wnd|href|execute|text|_b7|height|http|attributes|_b1|captureNames|bar|_f8|call|script|_e1|_75|toString|_6e|_d7|_12b|gt|_5b|unindent|_f4|_b3|_62|_7a|body|_80|_51|case|SyntaxHighlighter|_5|_28|_40|_81|_88|_d4|concat|getMatches|line|_c9|brushes|m1|m2|_b5|_da|_a1|_124|break|_123|throw|undefined|cc|write|_7b|_7d|print|DIV|_32|extended|_25|_f2|_8e|printFrame|_4a|_7c|_6a|_ea|_5e|_5c|_65|_106|_e9|_133|_10d|_76|len|_100|escape|_f0|spaceWidth|_dc|fixForBlogger|htmlScript|_d5|addFlags|_22|regex|_3|offsetMatches|_2|_f6|Math|_af|global|url|_a6|_db|trim|_10c|_be|func|_bc|_11c|_73|_6b|cache|_a2|_c7|_11b|key|findBrush|_c0|_9c|_9d|_b9|_ab|_8c|_b6|_ad|eachLine|supply|_89|can|_a5|values|_ac|_82|_7e|removeChild|instanceof|gi|Match|_50|viewSource|pre|_1a|_19|_18|expandSource|_29|_2b|_2d|toolbarItemWidth|_2e|_2c|_2a|_17|_10|_7|_129|_4|gm|color|_126|_e|_f|_d|_9|_b|title|toolbarItemHeight|highlighterId|popup|top|_4c|_49|_48|_4f|HtmlScript|_5d|_59||win|focus|esc|close|_blank|_2f|_30|com|clipboardSwf|_27|swf|_24|contentWindow|link|_38|_35|_37|_6c|discoveredBrushes|_e6|_e7|_105|join|toolbarCommands|ruler|px|isNaN|regexList|_e2|content|margin|guid|_fb|charAt|gutter|Array|originalCode|String|collapsed|collapse|highlighters|measureSpace|merge|quantifier|getNativeFlags|r2|_116|_d0|_d2|xmlBrush|_fc|get|object|_127|version|pP|toBoolean|_fa|attachEvent|serif|_c1|_fd|defaults|_ee|_4e|_ce|_5a|process|copyToClipboard|event|_cf|decorate|brushNotHtmlScript|shockwave|processUrls|links|_78|Times|multiline|_ba|plain|_6d|family|_61|light|flash|center|commandName|align|_66|noBrush|syntaxhighlighter|rel|type|_3e|copyToClipboardConfirmation|stylesheet|processSmartTabs|help|2009|trimFirstAndLastLines|_3f|copyStyles|500px|0px|args|_6|classRight|tabs|message|match|_cc|clipboardData|_c8|_cd|classLeft|createButton|Highlighter|switch|executeCommand|_c5|_a|_47|location|_36|processTabs|_f5|alexgorbatchev|scrollbars|_104|aboutDialog|_103|screen|_79|regexLib|_a8|DTD|xhtml1|first|unicode|isMatchNested|parseInt|_d1|_a7|_a0|_128|TypeError|_dd|one|createRuler|defaultAdd|_a3|_ff|toArray|getElementsByTagName|removeNestedMatches|parentNode|findMatches|processMatches|createDisplayLines|_b8|clipboard|addEvent|_115|debug|_aa|parseParams|tagName|brush|matchesSortCallback|_d6|_b0|_1e|_de|padNumber|block|auto|arguments|_85|_84|items|_16|_99|matchRecursive|_12|navigator|_14|when|userAgent|head|smart|_15|_83|_90|_13|escapeChar|character|org|_e4|www|w3|_93|bloggerMode|_e3|insertSpaces|try|catch|constructing|resizable|_1f|onclick|forHtmlScript|aspScriptTags|scriptScriptTags|getKeywords|menubar|400|_1c|_21|sgi|item|another|flags|_1b|max|_20|750|from|string|typeof|Helvetica|xmlns|1999|xhtml|dtd|transitional|Transitional|EN|TR|meta|equiv|About|Georgia|New|utf|charset|Content|Type|XHTML|W3C|The|is|your|to|copy|expand|view|now|Can|option|DOCTYPE|PUBLIC|configured|wasn|find|Brush|Roman|background|Copyright|2004|Alex|highlighter|syntax|decoration|none|JavaScript|Gorbatchev|multiLineCComments|singleQuotedString|multiLineDoubleQuotedString|multiLineSingleQuotedString|doubleQuotedString|replaceVar|singleLineCComments|singleLinePerlComments|0099FF|target|Geneva|Arial|_26|3em|1em|fff|000|sans|xx|278|February|03|4em|bottom|large|75em|phpScriptTags|_3b|1000000|valueNames|random|all|round|replaceChild|open|addEventListener|70em|highlighter_|on|30em|protocol|nogutter|subject|Error|shCore|more|load|about|_42|500|250|fontSize|_44|_43|aliases|textarea|spaces|number|ignoreCase|_8a|offsetWidth|SyntaxError|highlighted|_a4|alt|than|1000|_98|getPropertyValue|getComputedStyle|middot|sx|150|sort|_ef|addPlugin|sticky|getElementById|opera|using|the|flag|Xml|toLowerCase|96b8|444553540000|11cf|ae6d|d27cdb6e|lastIndexOf|codebase|pub|data|macromedia|download|unbalanced|clsid|classid|application|allowScriptAccess|_clipboard|param|file|always|wmode|delimiters|msie|menu|flashVars|transparent|swflash|cabs|printSource|_39|error|ok|cab|_bf|_3a|_119|absolute||printing|position|cssText|IFRAME|amp|setData|command|contains|_c4|embed|src|movie|_33|_34|_117|apply'.split('|'),0,{}))
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
var dp = {
	SyntaxHighlighter : {}
};

dp.SyntaxHighlighter = {
	parseParams: function(
						input,
						showGutter, 
						showControls, 
						collapseAll, 
						firstLine, 
						showColumns
						)
	{
		function getValue(list, name)
		{
			var regex = new XRegExp('^' + name + '\\[(?<value>\\w+)\\]$', 'gi'),
				match = null
				;
			
			for (var i = 0; i < list.length; i++) 
				if ((match = regex.exec(list[i])) != null)
					return match.value;
			
			return null;
		};
		
		function defaultValue(value, def)
		{
			return value != null ? value : def;
		};
		
		function asString(value)
		{
			return value != null ? value.toString() : null;
		};

		var parts = input.split(':'),
			brushName = parts[0],
			options = {},
			straight = { 'true' : 'true' }
			reverse = { 'true' : 'false' },
			result = null,
			defaults = SyntaxHighlighter.defaults
			;
		
		for (var i in parts)
			options[parts[i]] = 'true';

		showGutter = asString(defaultValue(showGutter, defaults.gutter));
		showControls = asString(defaultValue(showControls, defaults.toolbar));
		collapseAll = asString(defaultValue(collapseAll, defaults.collapse)); 
		showColumns = asString(defaultValue(showColumns, defaults.ruler));
		firstLine = asString(defaultValue(firstLine, defaults['first-line'])); 
		
		result = {
			brush			: brushName,
			gutter			: defaultValue(reverse[options.nogutter], showGutter),
			toolbar			: defaultValue(reverse[options.nocontrols], showControls),
			collapse		: defaultValue(straight[options.collapse], collapseAll),
			ruler			: defaultValue(straight[options.showcolumns], showColumns),
			'first-line'	: defaultValue(getValue(parts, 'firstline'), firstLine)
		};
		
		return result;
	},
	
	HighlightAll: function(
						name, 
						showGutter /* optional */, 
						showControls /* optional */, 
						collapseAll /* optional */, 
						firstLine /* optional */, 
						showColumns /* optional */
						)
	{
		function findValue()
		{
			var a = arguments;
			
			for (var i = 0; i < a.length; i++) 
			{
				if (a[i] === null) 
					continue;
				
				if (typeof(a[i]) == 'string' && a[i] != '') 
					return a[i] + '';
				
				if (typeof(a[i]) == 'object' && a[i].value != '') 
					return a[i].value + '';
			}
			
			return null;
		};

		function findTagsByName(list, name, tagName)
		{
			var tags = document.getElementsByTagName(tagName);
			
			for (var i = 0; i < tags.length; i++) 
				//if (tags[i].getAttribute('name') == name) 
					list.push(tags[i]);
		}
		
		var elements = [],
			highlighter = null,
			registered = {},
			propertyName = 'innerHTML'
			;
		
		// for some reason IE doesn't find <pre/> by name, however it does see them just fine by tag name... 
		findTagsByName(elements, name, 'pre');
		//findTagsByName(elements, name, 'textarea');

		if (elements.length === 0)
			return;
		
		for (var i = 0; i < elements.length; i++)
		{
			var element = elements[i],
				params = findValue(
					element.attributes['class'], element.className, 
					element.attributes['language'], element.language
					),
				language = ''
				;
			
			if (params === null) 
				continue;

			params = dp.SyntaxHighlighter.parseParams(
				params,
				showGutter, 
				showControls, 
				collapseAll, 
				firstLine, 
				showColumns
				);

			SyntaxHighlighter.highlight(params, element);
		}
	}
};
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Java = function()
{
	var keywords =	'abstract assert boolean break byte case catch char class const ' +
					'continue default do double else enum extends ' +
					'false final finally float for goto if implements import ' +
					'instanceof int interface long native new null ' +
					'package private protected public return ' +
					'short static strictfp super switch synchronized this throw throws true ' +
					'transient try void volatile while';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },		// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },		// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// strings
		{ regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },			// numbers
		{ regex: /(?!\@interface\b)\@[\$\w]+\b/g,					css: 'color1' },		// annotation @anno
		{ regex: /\@interface\b/g,									css: 'color2' },		// @interface keyword
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }		// java keyword
		];

	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
};

SyntaxHighlighter.brushes.Java.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Java.aliases		= ['java'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		// Created by Peter Atoria @ http://iAtoria.com
	
		var inits 	 =  'class interface function package';
	
		var keywords =	'-Infinity ...rest Array as AS3 Boolean break case catch const continue Date decodeURI ' + 
						'decodeURIComponent default delete do dynamic each else encodeURI encodeURIComponent escape ' + 
						'extends false final finally flash_proxy for get if implements import in include Infinity ' + 
						'instanceof int internal is isFinite isNaN isXMLName label namespace NaN native new null ' + 
						'Null Number Object object_proxy override parseFloat parseInt private protected public ' + 
						'return set static String super switch this throw true try typeof uint undefined unescape ' + 
						'use void while with'
						;
	
		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },		// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },		// multiline comments
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// double quoted strings
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// single quoted strings
			{ regex: /\b([\d]+(\.[\d]+)?|0x[a-f0-9]+)\b/gi,				css: 'value' },			// numbers
			{ regex: new RegExp(this.getKeywords(inits), 'gm'),			css: 'color3' },		// initializations
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },		// keywords
			{ regex: new RegExp('var', 'gm'),							css: 'variable' },		// variable
			{ regex: new RegExp('trace', 'gm'),							css: 'color1' }			// trace
			];
	
		this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['actionscript3', 'as3'];

	SyntaxHighlighter.brushes.AS3 = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Groovy = function()
{
	// Contributed by Andres Almiray
	// http://jroller.com/aalmiray/entry/nice_source_code_syntax_highlighter

	var keywords =	'as assert break case catch class continue def default do else extends finally ' +
					'if in implements import instanceof interface new package property return switch ' +
					'throw throws try while public protected private static';
	var types    =  'void boolean byte char short int long float double';
	var constants = 'null';
	var methods   = 'allProperties count get size '+
					'collect each eachProperty eachPropertyName eachWithIndex find findAll ' +
					'findIndexOf grep inject max min reverseEach sort ' +
					'asImmutable asSynchronized flatten intersect join pop reverse subMap toList ' +
					'padRight padLeft contains eachMatch toCharacter toLong toUrl tokenize ' +
					'eachFile eachFileRecurse eachB yte eachLine readBytes readLine getText ' +
					'splitEachLine withReader append encodeBase64 decodeBase64 filterLine ' +
					'transformChar transformLine withOutputStream withPrintWriter withStream ' +
					'withStreams withWriter withWriterAppend write writeLine '+
					'dump inspect invokeMethod print println step times upto use waitForOrKill '+
					'getText';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,				css: 'comments' },		// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,					css: 'comments' },		// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,					css: 'string' },		// strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,					css: 'string' },		// strings
		{ regex: /""".*"""/g,													css: 'string' },		// GStrings
		{ regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'),	css: 'value' },			// numbers
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),					css: 'keyword' },		// goovy keyword
		{ regex: new RegExp(this.getKeywords(types), 'gm'),						css: 'color1' },		// goovy/java type
		{ regex: new RegExp(this.getKeywords(constants), 'gm'),					css: 'constants' },		// constants
		{ regex: new RegExp(this.getKeywords(methods), 'gm'),					css: 'functions' }		// methods
		];

	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
}

SyntaxHighlighter.brushes.Groovy.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Groovy.aliases	= ['groovy'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Xml = function()
{
	function process(match, regexInfo)
	{
		var constructor = SyntaxHighlighter.Match,
			code = match[0],
			tag = new XRegExp('(&lt;|<)[\\s\\/\\?]*(?<name>[:\\w-\\.]+)', 'xg').exec(code),
			result = []
			;
		
		if (match.attributes != null) 
		{
			var attributes,
				regex = new XRegExp('(?<name> [\\w:\\-\\.]+)' +
									'\\s*=\\s*' +
									'(?<value> ".*?"|\'.*?\'|\\w+)',
									'xg');

			while ((attributes = regex.exec(code)) != null) 
			{
				result.push(new constructor(attributes.name, match.index + attributes.index, 'color1'));
				result.push(new constructor(attributes.value, match.index + attributes.index + attributes[0].indexOf(attributes.value), 'string'));
			}
		}

		if (tag != null)
			result.push(
				new constructor(tag.name, match.index + tag[0].indexOf(tag.name), 'keyword')
			);

		return result;
	}
	
	this.regexList = [
		{ regex: new XRegExp('(\\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\\&gt;|>)', 'gm'),			css: 'color2' },	// <![ ... [ ... ]]>
		{ regex: new XRegExp('(\\&lt;|<)!--\\s*.*?\\s*--(\\&gt;|>)', 'gm'),								css: 'comments' },	// <!-- ... -->
		{ regex: new XRegExp('(&lt;|<)[\\s\\/\\?]*(\\w+)(?<attributes>.*?)[\\s\\/\\?]*(&gt;|>)', 'sg'), func: process }
	];
};

SyntaxHighlighter.brushes.Xml.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Xml.aliases	= ['xml', 'xhtml', 'xslt', 'html', 'xhtml'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.CSS = function()
{
	function getKeywordsCSS(str)
	{
		return '\\b([a-z_]|)' + str.replace(/ /g, '(?=:)\\b|\\b([a-z_\\*]|\\*|)') + '(?=:)\\b';
	};
	
	function getValuesCSS(str)
	{
		return '\\b' + str.replace(/ /g, '(?!-)(?!:)\\b|\\b()') + '\:\\b';
	};

	var keywords =	'ascent azimuth background-attachment background-color background-image background-position ' +
					'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top ' +
					'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color ' +
					'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width ' +
					'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color ' +
					'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display ' +
					'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font ' +
					'height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top ' +
					'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans ' +
					'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page ' +
					'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position ' +
					'quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress ' +
					'table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em ' +
					'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index';

	var values =	'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder '+
					'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed '+
					'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double '+
					'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia '+
					'gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic '+
					'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha '+
					'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower '+
					'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset '+
					'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side '+
					'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow '+
					'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize '+
					'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal '+
					'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin '+
					'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';

	var fonts =		'[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif [cC]ourier mono sans serif';
	
	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },	// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },	// double quoted strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },	// single quoted strings
		{ regex: /\#[a-fA-F0-9]{3,6}/g,								css: 'value' },		// html colors
		{ regex: /(-?\d+)(\.\d+)?(px|em|pt|\:|\%|)/g,				css: 'value' },		// sizes
		{ regex: /!important/g,										css: 'color3' },	// !important
		{ regex: new RegExp(getKeywordsCSS(keywords), 'gm'),		css: 'keyword' },	// keywords
		{ regex: new RegExp(getValuesCSS(values), 'g'),				css: 'value' },		// values
		{ regex: new RegExp(this.getKeywords(fonts), 'g'),			css: 'color1' }		// fonts
		];

	this.forHtmlScript({ 
		left: /(&lt;|<)\s*style.*?(&gt;|>)/gi, 
		right: /(&lt;|<)\/\s*style\s*(&gt;|>)/gi 
		});
};

SyntaxHighlighter.brushes.CSS.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.CSS.aliases	= ['css'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Sql = function()
{
	var funcs	=	'abs avg case cast coalesce convert count current_timestamp ' +
					'current_user day isnull left lower month nullif replace right ' +
					'session_user space substring sum system_user upper user year';

	var keywords =	'absolute action add after alter as asc at authorization begin bigint ' +
					'binary bit by cascade char character check checkpoint close collate ' +
					'column commit committed connect connection constraint contains continue ' +
					'create cube current current_date current_time cursor database date ' +
					'deallocate dec decimal declare default delete desc distinct double drop ' +
					'dynamic else end end-exec escape except exec execute false fetch first ' +
					'float for force foreign forward free from full function global goto grant ' +
					'group grouping having hour ignore index inner insensitive insert instead ' +
					'int integer intersect into is isolation key last level load local max min ' +
					'minute modify move name national nchar next no numeric of off on only ' +
					'open option order out output partial password precision prepare primary ' +
					'prior privileges procedure public read real references relative repeatable ' +
					'restrict return returns revoke rollback rollup rows rule schema scroll ' +
					'second section select sequence serializable set size smallint static ' +
					'statistics table temp temporary then time timestamp to top transaction ' +
					'translation trigger true truncate uncommitted union unique update values ' +
					'varchar varying view when where with work';

	var operators =	'all and any between cross in join like not null or outer some';

	this.regexList = [
		{ regex: /--(.*)$/gm,												css: 'comments' },			// one line and multiline comments
		{ regex: SyntaxHighlighter.regexLib.multiLineDoubleQuotedString,	css: 'string' },			// double quoted strings
		{ regex: SyntaxHighlighter.regexLib.multiLineSingleQuotedString,	css: 'string' },			// single quoted strings
		{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),				css: 'color2' },			// functions
		{ regex: new RegExp(this.getKeywords(operators), 'gmi'),			css: 'color1' },			// operators and such
		{ regex: new RegExp(this.getKeywords(keywords), 'gmi'),				css: 'keyword' }			// keyword
		];
};

SyntaxHighlighter.brushes.Sql.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Sql.aliases	= ['sql'];

;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Php = function()
{
	var funcs	=	'abs acos acosh addcslashes addslashes ' +
					'array_change_key_case array_chunk array_combine array_count_values array_diff '+
					'array_diff_assoc array_diff_key array_diff_uassoc array_diff_ukey array_fill '+
					'array_filter array_flip array_intersect array_intersect_assoc array_intersect_key '+
					'array_intersect_uassoc array_intersect_ukey array_key_exists array_keys array_map '+
					'array_merge array_merge_recursive array_multisort array_pad array_pop array_product '+
					'array_push array_rand array_reduce array_reverse array_search array_shift '+
					'array_slice array_splice array_sum array_udiff array_udiff_assoc '+
					'array_udiff_uassoc array_uintersect array_uintersect_assoc '+
					'array_uintersect_uassoc array_unique array_unshift array_values array_walk '+
					'array_walk_recursive atan atan2 atanh base64_decode base64_encode base_convert '+
					'basename bcadd bccomp bcdiv bcmod bcmul bindec bindtextdomain bzclose bzcompress '+
					'bzdecompress bzerrno bzerror bzerrstr bzflush bzopen bzread bzwrite ceil chdir '+
					'checkdate checkdnsrr chgrp chmod chop chown chr chroot chunk_split class_exists '+
					'closedir closelog copy cos cosh count count_chars date decbin dechex decoct '+
					'deg2rad delete ebcdic2ascii echo empty end ereg ereg_replace eregi eregi_replace error_log '+
					'error_reporting escapeshellarg escapeshellcmd eval exec exit exp explode extension_loaded '+
					'feof fflush fgetc fgetcsv fgets fgetss file_exists file_get_contents file_put_contents '+
					'fileatime filectime filegroup fileinode filemtime fileowner fileperms filesize filetype '+
					'floatval flock floor flush fmod fnmatch fopen fpassthru fprintf fputcsv fputs fread fscanf '+
					'fseek fsockopen fstat ftell ftok getallheaders getcwd getdate getenv gethostbyaddr gethostbyname '+
					'gethostbynamel getimagesize getlastmod getmxrr getmygid getmyinode getmypid getmyuid getopt '+
					'getprotobyname getprotobynumber getrandmax getrusage getservbyname getservbyport gettext '+
					'gettimeofday gettype glob gmdate gmmktime ini_alter ini_get ini_get_all ini_restore ini_set '+
					'interface_exists intval ip2long is_a is_array is_bool is_callable is_dir is_double '+
					'is_executable is_file is_finite is_float is_infinite is_int is_integer is_link is_long '+
					'is_nan is_null is_numeric is_object is_readable is_real is_resource is_scalar is_soap_fault '+
					'is_string is_subclass_of is_uploaded_file is_writable is_writeable mkdir mktime nl2br '+
					'parse_ini_file parse_str parse_url passthru pathinfo readlink realpath rewind rewinddir rmdir '+
					'round str_ireplace str_pad str_repeat str_replace str_rot13 str_shuffle str_split '+
					'str_word_count strcasecmp strchr strcmp strcoll strcspn strftime strip_tags stripcslashes '+
					'stripos stripslashes stristr strlen strnatcasecmp strnatcmp strncasecmp strncmp strpbrk '+
					'strpos strptime strrchr strrev strripos strrpos strspn strstr strtok strtolower strtotime '+
					'strtoupper strtr strval substr substr_compare';

	var keywords =	'and or xor array as break case ' +
					'cfunction class const continue declare default die do else ' +
					'elseif empty enddeclare endfor endforeach endif endswitch endwhile ' +
					'extends for foreach function include include_once global if ' +
					'new old_function return static switch use require require_once ' +
					'var while abstract interface public implements extends private protected throw';
	
	var constants	= '__FILE__ __LINE__ __METHOD__ __FUNCTION__ __CLASS__';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// double quoted strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// single quoted strings
		{ regex: /\$\w+/g,											css: 'variable' },			// variables
		{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),		css: 'functions' },			// common functions
		{ regex: new RegExp(this.getKeywords(constants), 'gmi'),	css: 'constants' },			// constants
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }			// keyword
		];

	this.forHtmlScript(SyntaxHighlighter.regexLib.phpScriptTags);
};

SyntaxHighlighter.brushes.Php.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Php.aliases	= ['php'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.JScript = function()
{
	var keywords =	'abstract boolean break byte case catch char class const continue debugger ' +
					'default delete do double else enum export extends false final finally float ' +
					'for function goto if implements import in instanceof int interface long native ' +
					'new null package private protected public return short static super switch ' +
					'synchronized this throw throws transient true try typeof var void volatile while with';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// double quoted strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// single quoted strings
		{ regex: /\s*#.*/gm,										css: 'preprocessor' },		// preprocessor tags like #region and #endregion
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }			// keywords
		];
	
	this.forHtmlScript(SyntaxHighlighter.regexLib.scriptScriptTags);
};

SyntaxHighlighter.brushes.JScript.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.JScript.aliases	= ['js', 'jscript', 'javascript'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.CSharp = function()
{
	var keywords =	'abstract as base bool break byte case catch char checked class const ' +
					'continue decimal default delegate do double else enum event explicit ' +
					'extern false finally fixed float for foreach get goto if implicit in int ' +
					'interface internal is lock long namespace new null object operator out ' +
					'override params private protected public readonly ref return sbyte sealed set ' +
					'short sizeof stackalloc static string struct switch this throw true try ' +
					'typeof uint ulong unchecked unsafe ushort using virtual void while';

	function fixComments(match, regexInfo)
	{
		var css = (match[0].indexOf("///") == 0)
			? 'color1'
			: 'comments'
			;
			
		return [new SyntaxHighlighter.Match(match[0], match.index, css)];
	}

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	func : fixComments },		// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
		{ regex: /^\s*#.*/gm,										css: 'preprocessor' },		// preprocessor tags like #region and #endregion
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' }			// c# keyword
		];
		
	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
};

SyntaxHighlighter.brushes.CSharp.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.CSharp.aliases	= ['c-sharp', 'csharp'];

;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Vb = function()
{
	var keywords =	'AddHandler AddressOf AndAlso Alias And Ansi As Assembly Auto ' +
					'Boolean ByRef Byte ByVal Call Case Catch CBool CByte CChar CDate ' +
					'CDec CDbl Char CInt Class CLng CObj Const CShort CSng CStr CType ' +
					'Date Decimal Declare Default Delegate Dim DirectCast Do Double Each ' +
					'Else ElseIf End Enum Erase Error Event Exit False Finally For Friend ' +
					'Function Get GetType GoSub GoTo Handles If Implements Imports In ' +
					'Inherits Integer Interface Is Let Lib Like Long Loop Me Mod Module ' +
					'MustInherit MustOverride MyBase MyClass Namespace New Next Not Nothing ' +
					'NotInheritable NotOverridable Object On Option Optional Or OrElse ' +
					'Overloads Overridable Overrides ParamArray Preserve Private Property ' +
					'Protected Public RaiseEvent ReadOnly ReDim REM RemoveHandler Resume ' +
					'Return Select Set Shadows Shared Short Single Static Step Stop String ' +
					'Structure Sub SyncLock Then Throw To True Try TypeOf Unicode Until ' +
					'Variant When While With WithEvents WriteOnly Xor';

	this.regexList = [
		{ regex: /'.*$/gm,										css: 'comments' },			// one line comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },			// strings
		{ regex: /^\s*#.*$/gm,									css: 'preprocessor' },		// preprocessor tags like #region and #endregion
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }			// vb keyword
		];

	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
};

SyntaxHighlighter.brushes.Vb.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Vb.aliases	= ['vb', 'vbnet'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Bash = function()
{
	var keywords =	'if fi then elif else for do done until while break continue case function return in eq ne gt lt ge le';
	var commands =  'alias apropos awk bash bc bg builtin bzip2 cal cat cd cfdisk chgrp chmod chown chroot' +
					'cksum clear cmp comm command cp cron crontab csplit cut date dc dd ddrescue declare df ' +
					'diff diff3 dig dir dircolors dirname dirs du echo egrep eject enable env ethtool eval ' +
					'exec exit expand export expr false fdformat fdisk fg fgrep file find fmt fold format ' +
					'free fsck ftp gawk getopts grep groups gzip hash head history hostname id ifconfig ' +
					'import install join kill less let ln local locate logname logout look lpc lpr lprint ' +
					'lprintd lprintq lprm ls lsof make man mkdir mkfifo mkisofs mknod more mount mtools ' +
					'mv netstat nice nl nohup nslookup open op passwd paste pathchk ping popd pr printcap ' +
					'printenv printf ps pushd pwd quota quotacheck quotactl ram rcp read readonly renice ' +
					'remsync rm rmdir rsync screen scp sdiff sed select seq set sftp shift shopt shutdown ' +
					'sleep sort source split ssh strace su sudo sum symlink sync tail tar tee test time ' +
					'times touch top traceroute trap tr true tsort tty type ulimit umask umount unalias ' +
					'uname unexpand uniq units unset unshar useradd usermod users uuencode uudecode v vdir ' +
					'vi watch wc whereis which who whoami Wget xargs yes'
					;
    
	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments,		css: 'comments' },		// one line comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,			css: 'string' },		// double quoted strings
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),			css: 'keyword' },		// keywords
		{ regex: new RegExp(this.getKeywords(commands), 'gm'),			css: 'functions' }		// commands
		];
}

SyntaxHighlighter.brushes.Bash.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Bash.aliases		= ['bash', 'shell'];

;SyntaxHighlighter.brushes.JavaFX = function()
{
				var keywords =	'as assert break case catch class continue def default do else extends finally ' +
                        'if in implements import instanceof interface new package property return switch ' +
                        'throw throws try while';
        var types    =  'void boolean byte char short int long float double';
        var modifiers = 'public protected private static readonly';
        var constants = 'null';
        var methods   = 'abstract attribute bind delete false ' +
												'for function init insert not e postinit ' +
												'super sizeof this true ' +
												'var after and before by from indexof ' +
												'into inverse lazy on or replace step typeof with where';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments, css: 'comments' },	// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,	css: 'comments' },	// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },	// strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,	css: 'string' },	// strings
		{ regex: /""".*"""/g, css: 'string' },	// strings
		{ regex: new RegExp('\\b([\\d]+(\\.[\\d]+)?|0x[a-f0-9]+)\\b', 'gi'), css: 'value' },	// numbers
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'), css: 'keyword' },	// keyword
		{ regex: new RegExp(this.getKeywords(types), 'gm'),	css: 'color1' },		// java type
		{ regex: new RegExp(this.getKeywords(modifiers), 'gm'),	css: 'keyword' }, //java modifier
		{ regex: new RegExp(this.getKeywords(constants), 'gm'),	css: 'constants' }, // constants
		{ regex: new RegExp(this.getKeywords(methods), 'gm'),	css: 'functions' }	// methods
		];

		this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);

}

SyntaxHighlighter.brushes.JavaFX.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.JavaFX.aliases	= ['javafx'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Cpp = function()
{
	// Copyright 2006 Shin, YoungJin
	
	var datatypes =	'ATOM BOOL BOOLEAN BYTE CHAR COLORREF DWORD DWORDLONG DWORD_PTR ' +
					'DWORD32 DWORD64 FLOAT HACCEL HALF_PTR HANDLE HBITMAP HBRUSH ' +
					'HCOLORSPACE HCONV HCONVLIST HCURSOR HDC HDDEDATA HDESK HDROP HDWP ' +
					'HENHMETAFILE HFILE HFONT HGDIOBJ HGLOBAL HHOOK HICON HINSTANCE HKEY ' +
					'HKL HLOCAL HMENU HMETAFILE HMODULE HMONITOR HPALETTE HPEN HRESULT ' +
					'HRGN HRSRC HSZ HWINSTA HWND INT INT_PTR INT32 INT64 LANGID LCID LCTYPE ' +
					'LGRPID LONG LONGLONG LONG_PTR LONG32 LONG64 LPARAM LPBOOL LPBYTE LPCOLORREF ' +
					'LPCSTR LPCTSTR LPCVOID LPCWSTR LPDWORD LPHANDLE LPINT LPLONG LPSTR LPTSTR ' +
					'LPVOID LPWORD LPWSTR LRESULT PBOOL PBOOLEAN PBYTE PCHAR PCSTR PCTSTR PCWSTR ' +
					'PDWORDLONG PDWORD_PTR PDWORD32 PDWORD64 PFLOAT PHALF_PTR PHANDLE PHKEY PINT ' +
					'PINT_PTR PINT32 PINT64 PLCID PLONG PLONGLONG PLONG_PTR PLONG32 PLONG64 POINTER_32 ' +
					'POINTER_64 PSHORT PSIZE_T PSSIZE_T PSTR PTBYTE PTCHAR PTSTR PUCHAR PUHALF_PTR ' +
					'PUINT PUINT_PTR PUINT32 PUINT64 PULONG PULONGLONG PULONG_PTR PULONG32 PULONG64 ' +
					'PUSHORT PVOID PWCHAR PWORD PWSTR SC_HANDLE SC_LOCK SERVICE_STATUS_HANDLE SHORT ' +
					'SIZE_T SSIZE_T TBYTE TCHAR UCHAR UHALF_PTR UINT UINT_PTR UINT32 UINT64 ULONG ' +
					'ULONGLONG ULONG_PTR ULONG32 ULONG64 USHORT USN VOID WCHAR WORD WPARAM WPARAM WPARAM ' +
					'char bool short int __int32 __int64 __int8 __int16 long float double __wchar_t ' +
					'clock_t _complex _dev_t _diskfree_t div_t ldiv_t _exception _EXCEPTION_POINTERS ' +
					'FILE _finddata_t _finddatai64_t _wfinddata_t _wfinddatai64_t __finddata64_t ' +
					'__wfinddata64_t _FPIEEE_RECORD fpos_t _HEAPINFO _HFILE lconv intptr_t ' +
					'jmp_buf mbstate_t _off_t _onexit_t _PNH ptrdiff_t _purecall_handler ' +
					'sig_atomic_t size_t _stat __stat64 _stati64 terminate_function ' +
					'time_t __time64_t _timeb __timeb64 tm uintptr_t _utimbuf ' +
					'va_list wchar_t wctrans_t wctype_t wint_t signed';

	var keywords =	'break case catch class const __finally __exception __try ' +
					'const_cast continue private public protected __declspec ' +
					'default delete deprecated dllexport dllimport do dynamic_cast ' +
					'else enum explicit extern if for friend goto inline ' +
					'mutable naked namespace new noinline noreturn nothrow ' +
					'register reinterpret_cast return selectany ' +
					'sizeof static static_cast struct switch template this ' +
					'thread throw true false try typedef typeid typename union ' +
					'using uuid virtual void volatile whcar_t while';
					
	var functions =	'assert isalnum isalpha iscntrl isdigit isgraph islower isprint' +
					'ispunct isspace isupper isxdigit tolower toupper errno localeconv ' +
					'setlocale acos asin atan atan2 ceil cos cosh exp fabs floor fmod ' +
					'frexp ldexp log log10 modf pow sin sinh sqrt tan tanh jmp_buf ' +
					'longjmp setjmp raise signal sig_atomic_t va_arg va_end va_start ' +
					'clearerr fclose feof ferror fflush fgetc fgetpos fgets fopen ' +
					'fprintf fputc fputs fread freopen fscanf fseek fsetpos ftell ' +
					'fwrite getc getchar gets perror printf putc putchar puts remove ' +
					'rename rewind scanf setbuf setvbuf sprintf sscanf tmpfile tmpnam ' +
					'ungetc vfprintf vprintf vsprintf abort abs atexit atof atoi atol ' +
					'bsearch calloc div exit free getenv labs ldiv malloc mblen mbstowcs ' +
					'mbtowc qsort rand realloc srand strtod strtol strtoul system ' +
					'wcstombs wctomb memchr memcmp memcpy memmove memset strcat strchr ' +
					'strcmp strcoll strcpy strcspn strerror strlen strncat strncmp ' +
					'strncpy strpbrk strrchr strspn strstr strtok strxfrm asctime ' +
					'clock ctime difftime gmtime localtime mktime strftime time';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
		{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },			// strings
		{ regex: /^ *#.*/gm,										css: 'preprocessor' },
		{ regex: new RegExp(this.getKeywords(datatypes), 'gm'),		css: 'color1 bold' },
		{ regex: new RegExp(this.getKeywords(functions), 'gm'),		css: 'functions bold' },
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword bold' }
		];
};

SyntaxHighlighter.brushes.Cpp.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Cpp.aliases	= ['cpp', 'c'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Python = function()
{
	// Contributed by Gheorghe Milas
	
    var keywords =  'and assert break class continue def del elif else ' +
                    'except exec finally for from global if import in is ' +
                    'lambda not or pass print raise return try yield while';

    var special =  'None True False self cls class_';

    this.regexList = [
        { regex: SyntaxHighlighter.regexLib.singleLinePerlComments, css: 'comments' },
        { regex: /^\s*@\w+/gm, 										css: 'decorator' },
        { regex: /(['\"]{3})([^\1])*?\1/gm, 						css: 'comments' },
        { regex: /"(?!")(?:\.|\\\"|[^\""\n])*"/gm, 					css: 'string' },
        { regex: /'(?!')(?:\.|(\\\')|[^\''\n])*'/gm, 				css: 'string' },
        { regex: /\+|\-|\*|\/|\%|=|==/gm, 								css: 'keyword' },
        { regex: /\b\d+\.?\w*/g, 									css: 'value' },
        { regex: new RegExp(this.getKeywords(keywords), 'gm'), 		css: 'keyword' },
        { regex: new RegExp(this.getKeywords(special), 'gm'), 		css: 'color1' }
        ];

	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
};

SyntaxHighlighter.brushes.Python.prototype  = new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Python.aliases    = ['py', 'python'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/
 *
 * @version
 * 2.0.278 (February 03 2009)
 *
 * @author
 * Alex Gorbatchev
 * 
 * @copyright
 * Copyright (C) 2004-2009 Alex Gorbatchev.
 *
 * Licensed under a GNU Lesser General Public License.
 * http://creativecommons.org/licenses/LGPL/2.1/
 *
 * SyntaxHighlighter is donationware. You are allowed to download, modify and distribute 
 * the source code in accordance with LGPL 2.1 license, however if you want to use 
 * SyntaxHighlighter on your site or include it in your product, you must donate.
 * http://alexgorbatchev.com/wiki/SyntaxHighlighter:Donate
 */
SyntaxHighlighter.brushes.Ruby = function()
{
	// Contributed by Erik Peterson.
	
	var keywords =	'alias and BEGIN begin break case class def define_method defined do each else elsif ' +
					'END end ensure false for if in module new next nil not or raise redo rescue retry return ' +
					'self super then throw true undef unless until when while yield';

	var builtins =	'Array Bignum Binding Class Continuation Dir Exception FalseClass File::Stat File Fixnum Fload ' +
					'Hash Integer IO MatchData Method Module NilClass Numeric Object Proc Range Regexp String Struct::TMS Symbol ' +
					'ThreadGroup Thread Time TrueClass';

	this.regexList = [
		{ regex: SyntaxHighlighter.regexLib.singleLinePerlComments,	css: 'comments' },		// one line comments
		{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },		// double quoted strings
		{ regex: SyntaxHighlighter.regexLib.singleQuotedString,		css: 'string' },		// single quoted strings
		{ regex: /\b[A-Z0-9_]+\b/g,									css: 'constants' },		// constants
		{ regex: /:[a-z][A-Za-z0-9_]*/g,							css: 'color2' },		// symbols
		{ regex: /(\$|@@|@)\w+/g,									css: 'variable bold' },	// $global, @instance, and @@class variables
		{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword' },		// keywords
		{ regex: new RegExp(this.getKeywords(builtins), 'gm'),		css: 'color1' }			// builtins
		];

	this.forHtmlScript(SyntaxHighlighter.regexLib.aspScriptTags);
};

SyntaxHighlighter.brushes.Ruby.prototype	= new SyntaxHighlighter.Highlighter();
SyntaxHighlighter.brushes.Ruby.aliases		= ['ruby', 'rails', 'ror'];
;/**
 * SyntaxHighlighter
 * http://alexgorbatchev.com/SyntaxHighlighter
 *
 * SyntaxHighlighter is donationware. If you are using it, please donate.
 * http://alexgorbatchev.com/SyntaxHighlighter/donate.html
 *
 * @version
 * 3.0.83 (July 02 2010)
 * 
 * @copyright
 * Copyright (C) 2004-2010 Alex Gorbatchev.
 *
 * @license
 * Dual licensed under the MIT and GPL licenses.
 */
;(function()
{
	// CommonJS
	typeof(require) != 'undefined' ? SyntaxHighlighter = require('shCore').SyntaxHighlighter : null;

	function Brush()
	{
		// Contributed by David Simmons-Duffin and Marty Kube
	
		var funcs = 
			'abs accept alarm atan2 bind binmode chdir chmod chomp chop chown chr ' + 
			'chroot close closedir connect cos crypt defined delete each endgrent ' + 
			'endhostent endnetent endprotoent endpwent endservent eof exec exists ' + 
			'exp fcntl fileno flock fork format formline getc getgrent getgrgid ' + 
			'getgrnam gethostbyaddr gethostbyname gethostent getlogin getnetbyaddr ' + 
			'getnetbyname getnetent getpeername getpgrp getppid getpriority ' + 
			'getprotobyname getprotobynumber getprotoent getpwent getpwnam getpwuid ' + 
			'getservbyname getservbyport getservent getsockname getsockopt glob ' + 
			'gmtime grep hex index int ioctl join keys kill lc lcfirst length link ' + 
			'listen localtime lock log lstat map mkdir msgctl msgget msgrcv msgsnd ' + 
			'oct open opendir ord pack pipe pop pos print printf prototype push ' + 
			'quotemeta rand read readdir readline readlink readpipe recv rename ' + 
			'reset reverse rewinddir rindex rmdir scalar seek seekdir select semctl ' + 
			'semget semop send setgrent sethostent setnetent setpgrp setpriority ' + 
			'setprotoent setpwent setservent setsockopt shift shmctl shmget shmread ' + 
			'shmwrite shutdown sin sleep socket socketpair sort splice split sprintf ' + 
			'sqrt srand stat study substr symlink syscall sysopen sysread sysseek ' + 
			'system syswrite tell telldir time times tr truncate uc ucfirst umask ' + 
			'undef unlink unpack unshift utime values vec wait waitpid warn write';
    
		var keywords =  
			'bless caller continue dbmclose dbmopen die do dump else elsif eval exit ' +
			'for foreach goto if import last local my next no our package redo ref ' + 
			'require return sub tie tied unless untie until use wantarray while';
    
		this.regexList = [
			{ regex: new RegExp('#[^!].*$', 'gm'),					css: 'comments' },
			{ regex: new RegExp('^\\s*#!.*$', 'gm'),				css: 'preprocessor' }, // shebang
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,	css: 'string' },
			{ regex: SyntaxHighlighter.regexLib.singleQuotedString,	css: 'string' },
			{ regex: new RegExp('(\\$|@|%)\\w+', 'g'),				css: 'variable' },
			{ regex: new RegExp(this.getKeywords(funcs), 'gmi'),	css: 'functions' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),	css: 'keyword' }
		    ];

		this.forHtmlScript(SyntaxHighlighter.regexLib.phpScriptTags);
	}

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases		= ['perl', 'Perl', 'pl'];

	SyntaxHighlighter.brushes.Perl = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
;