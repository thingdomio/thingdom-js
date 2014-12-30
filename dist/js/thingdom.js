/**
 * Thingdom API JavaScript Wrapper
 *
 * @author     Andrew Welters <andrew.welters@mts.com>
 * @author     F. Stephen Kirschbaum <stephen.kirschbaum@mts.com>
 * @copyright  2014-2015 MTS Systems
 * @license    http://www.opensource.org/licenses/mit-license.html MIT License
 * @version    1.1
 * @link       https://github.com/thingdomio/thingdom-js
 * @website    https://thingdom.io
 */

( function () {
  "use strict";
  var root = this;
  var previous_thingdom = root.Thingdom;

  //@link https://gist.github.com/mythz/1334560
  ( function ( $_$ ) {
    var win = window, xhrs = [ function () { return new XMLHttpRequest(); }, function () { return new ActiveXObject( "Microsoft.XMLHTTP" ); }, function () { return new ActiveXObject( "MSXML2.XMLHTTP.3.0" ); }, function () { return new ActiveXObject( "MSXML2.XMLHTTP" ); } ], _xhrf = null;
    var hasOwnProperty = Object.prototype.hasOwnProperty, nativeForEach = Array.prototype.forEach;
    var _each = function ( o, fn, ctx ) { if ( o === null ) { return; } if ( nativeForEach && o.forEach === nativeForEach ) { o.forEach( fn, ctx ); } else if ( o.length === +o.length ) {for ( var i = 0, l = o.length; i < l; i++ ) { if ( i in o && fn.call( ctx, o[ i ], i, o ) === breaker ) { return; } } } else {for ( var key in o ) { if ( hasOwnProperty.call( o, key ) ) { if ( fn.call( ctx, o[ key ], key, o ) === breaker ) { return; } } } } };
    var _extend = function ( o ) { _each( Array.prototype.slice.call( arguments, 1 ), function ( a ) { for ( var p in a ) { if ( a[ p ] !== void 0 ) { o[ p ] = a[ p ]; } } } ); return o; };
    $_$.xhr = function () { if ( _xhrf !== null ) { return _xhrf(); } for ( var i = 0, l = xhrs.length; i < l; i++ ) { try { var f = xhrs[ i ], req = f(); if ( req !== null ) { _xhrf = f; return req; } } catch ( e ) { continue; } } return function () {}; };
    $_$._xhrResp = function ( xhr ) { switch ( xhr.getResponseHeader( "Content-Type" ).split( ";" )[ 0 ] ) { case "text/xml": return xhr.responseXML; case "text/json": case "application/json": case "text/javascript": case "application/javascript": case "application/x-javascript": return win.JSON ? JSON.parse( xhr.responseText ) : eval( xhr.responseText ); default: return xhr.responseText; } };
    $_$._formData = function ( o ) {var kvps = [], regEx = /%20/g; for ( var k in o ) { kvps.push( encodeURIComponent( k ).replace( regEx, "+" ) + "=" + encodeURIComponent( o[ k ].toString() ).replace( regEx, "+" ) ); } return kvps.join( '&' ); };
    $_$.ajax = function ( o ) { var xhr = $_$.xhr(), n = 0, timer; o = _extend( { userAgent: "XMLHttpRequest", lang: "en", type: "GET", data: null, dataType: "application/x-www-form-urlencoded" }, o ); if ( o.timeout ) { timer = setTimeout( function () { xhr.abort(); if ( o.timeoutFn ) { o.timeoutFn( o.url ); } }, o.timeout ); } xhr.onreadystatechange = function () { if ( xhr.readyState === 4 ) { if ( timer ) { clearTimeout( timer ); } if ( xhr.status < 300 ) { if ( o.success ) { o.success( $_$._xhrResp( xhr ) ); } } else if ( o.error ) { o.error( xhr, xhr.status, xhr.statusText ); } if ( o.complete ) { o.complete( xhr, xhr.statusText ); } } else if ( o.progress ) { o.progress( ++n ); } }; var url = o.url, data = null; var isPost = o.type === "POST" || o.type === "PUT"; if ( !isPost && o.data ) { url += "?" + $_$._formData( o.data ); } xhr.open( o.type, url ); if ( isPost ) { var isJson = o.dataType.indexOf( "json" ) >= 0; data = isJson ? JSON.stringify( o.data ) : $_$._formData( o.data ); xhr.setRequestHeader( "Content-Type", isJson ? "application/json" : "application/x-www-form-urlencoded" ); } xhr.send( data ); };
  } )( root );

  var ThingdomIO = root.Thingdom = function () {

    var self = this,
      endpoint = 'https://api.thingdom.io/1.1/';

    self.responses = [];

    var post = function ( command, data, callback ) {
      root.ajax( {
        url:              endpoint + command,
        withCredentials:  true,
        type:             'POST',
        dataType:         "json",
        data:             data,
        success: function ( data ) { self.responses.push( data ); if ( typeof callback === 'function' ) { callback( data ); } },
        error: function ( data ) { self.responses.push( data ); if ( typeof callback === 'function' ) { callback( data ); } }
      } );
    };

    var getAPISecret = function () {
      var apiSecret = '',
          scripts = document.getElementsByTagName( "script" ),
          src = '',
          uri = null;

      // parseUri 1.2.2
      // (c) Steven Levithan <stevenlevithan.com>
      // MIT License
      var parseUri = function ( str ) { var o = parseUri.options, m = o.parser[ o.strictMode ? "strict" : "loose" ].exec( str ), uri = {}, i = 14; while ( i-- ) { uri[ o.key[ i ] ] = m[ i ] || ""; } uri[ o.q.name ] = {}; uri[ o.key[ 12 ] ].replace( o.q.parser, function ( $0, $1, $2 ) { if ( $1 ) { uri[ o.q.name ][ $1 ] = $2; } } ); return uri; };
      parseUri.options = {
        strictMode: true,
        key:  [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ],
        q:    { name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: { strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                  loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      };

      for ( var i = 0; i < scripts.length; ++i ) {
        src = scripts[ 0 ].getAttribute( 'src' );
        uri = parseUri( src );
        if ( uri.file === "thingdom.js" || uri.file === "thingdom.min.js" ) {
          try {
            apiSecret = uri.queryKey.api_secret;
          } catch ( e ) {
            // absorb error for now.
          }
          break;
        }
      }
      return apiSecret;
    };

    var intitialize = function () {
      var settings = {};

      var initCallback = function ( data ) {
        if ( data.response === 'success' ) {
          for ( var key in data ) {
            self[ key ] = data[ key ];
          }
        } else {
          console.log( data );
        }
      };

      if ( typeof self.apiSecret === 'undefined' ) {
        self.apiSecret = getAPISecret();
      }

      if ( typeof self.device_secret !== 'undefined' ) {
        settings = {
          'api_secret': self.apiSecret,
          'device_secret': self.device_secret
        };
      } else {
        settings = {
          'api_secret': self.apiSecret
        };
      }
      post( 'token', settings, initCallback );
    };

    intitialize();

    self.noConflict = function () {
      root.previous_thingdom = previous_thingdom;
      return self;
    };
  };

  function Thingdom() {
    var Thingdom = new ThingdomIO();
    return Thingdom;
  }

  Thingdom.ThingdomIO = Thingdom;
  root.Thingdom = Thingdom;

} ).call( this );
