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
  /**
   *  provides Promise/A like functionality. modified from link
   *  @link https://github.com/ryansmith94/Pledges
   *  @returns  {deferred()}  [@todo adapt and integrate]
   */
  ( function ( $_$ ) { var Deferred = function () { var self = this, state = 0, value = null, fulfilled = [], rejected = []; var changeStateFn = function ( newState, buffer ) { return function ( givenValue ) { if ( state === 0 ) { value = givenValue;  state = newState;  buffer.forEach( function ( fn ) { fn(); } ); } return self; }; }; self.state = ( function () { var states = ['pending', 'fulfilled', 'rejected']; return function () { return states[ state ]; }; }()); self.resolve = changeStateFn( 1, fulfilled ); self.reject = changeStateFn( 2, rejected ); self.then = function ( onFulfilment, onRejection ) { var p = constructor(); var fn = function ( givenFn, protection ) { if ( typeof givenFn !== 'function' ) { givenFn = protection; } return function () { setTimeout( function () { try { p.resolve( givenFn( value ) ); } catch ( error ) { p.reject( error ); } } ); }; }; onFulfilment = fn( onFulfilment, function ( value ) { return value; } ); onRejection = fn( onRejection, function ( reason ) { throw reason; } ); if ( state === 0 ) { fulfilled.push( onFulfilment ); rejected.push( onRejection ); } else if ( state === 1 ) { onFulfilment(); } else if ( state === 2 ) { onRejection(); } return p.restrict(); }; self.restrict = function () { return { state: self.state, then: self.then }; }; return self; }; var constructor = function () { return new Deferred(); }; if ( typeof $_$.define === 'function' ) { $_$.define('deferred', [], function () { return constructor; } ); } else { $_$.deferred = constructor; } }( root ));

  /**
   *  provides jquery like $.ajax() functionality
   *  @link https://gist.github.com/mythz/1334560
   *  @returns {ajax()} [@todo adapt and integrate]
   */
  ( function ( $_$ ) {var xhrs = [ function () {return new XMLHttpRequest(); }, function () {return new ActiveXObject( "Microsoft.XMLHTTP" ); }, function () {return new ActiveXObject( "MSXML2.XMLHTTP.3.0" ); }, function () {return new ActiveXObject( "MSXML2.XMLHTTP" ); } ], _xhrf = null; var hasOwnProperty = Object.prototype.hasOwnProperty, nativeForEach = Array.prototype.forEach; var _each = function ( o, fn, ctx ) {if ( o === null ) {return; } if ( nativeForEach && o.forEach === nativeForEach ) {o.forEach( fn, ctx ); } else if ( o.length === +o.length ) {for ( var i = 0, l = o.length; i < l; i++ ) {if ( i in o && fn.call( ctx, o[ i ], i, o ) === breaker ) { return; } } } else {for ( var key in o ) {if ( hasOwnProperty.call( o, key ) ) {if ( fn.call( ctx, o[ key ], key, o ) === breaker ) {return; } } } } }; var _extend = function ( o ) {_each( Array.prototype.slice.call( arguments, 1 ), function ( a ) {for ( var p in a ) {if ( a[ p ] !== void 0 ) {o[ p ] = a[ p ]; } } } ); return o; }; $_$.xhr = function () {if ( _xhrf !== null ) {return _xhrf(); } for ( var i = 0, l = xhrs.length; i < l; i++ ) {try {var f = xhrs[ i ], req = f(); if ( req !== null ) {_xhrf = f; return req; } } catch ( e ) {continue; } } return function () {}; }; $_$._xhrResp = function ( xhr ) {switch ( xhr.getResponseHeader( "Content-Type" ).split( ";" )[ 0 ] ) {case "text/xml": return xhr.responseXML; case "text/json": case "application/json": case "text/javascript": case "application/javascript": case "application/x-javascript": return JSON.parse( xhr.responseText ); default: return xhr.responseText; } }; $_$._formData = function ( o ) {var kvps = [], regEx = /%20/g; for ( var k in o ) { kvps.push( encodeURIComponent( k ).replace( regEx, "+" ) + "=" + encodeURIComponent( o[ k ].toString() ).replace( regEx, "+" ) ); } return kvps.join( '&' ); }; $_$.ajax = function ( o ) {var xhr = $_$.xhr(), timer, n = 0, deferred = root.deferred(); o = _extend( {userAgent: "XMLHttpRequest", lang: "en", type: "GET", data: null, dataType: "application/x-www-form-urlencoded"}, o ); if ( o.timeout ) {timer = setTimeout( function () {xhr.abort(); if ( o.timeoutFn ) {o.timeoutFn( o.url ); } }, o.timeout ); } var onComplete = function ( data ) {o.success( data ); }; var onError = function ( data ) {o.error( data ); }; deferred.then( onComplete, onError ); xhr.onreadystatechange = function () {if ( xhr.readyState === 4 ) {if ( timer ) {clearTimeout( timer ); } if ( xhr.status < 300 ) {if ( o.dataType.indexOf( "json" ) >= 0 ) {xhr.responseJSON = JSON.parse( xhr.responseText ); } if ( o.success ) {if ( deferred.state() === 'pending' ) {deferred.resolve( $_$._xhrResp( xhr ) ); } else {o.success( $_$._xhrResp( xhr ), "success", xhr ); } } } else if ( o.error ) {if ( deferred.state() === 'pending' ) {deferred.reject( xhr.statusText ); } else {o.error( xhr, xhr.status, xhr.statusText ); } } if ( o.complete ) {o.complete( xhr, xhr.statusText ); } } else if ( o.progress ) {o.progress( ++n ); } }; var url = o.url, data = null; var isPost = o.type === "POST" || o.type === "PUT"; if ( !isPost && o.data ) {url += "?" + $_$._formData( o.data ); } xhr.open( o.type, url ); if ( isPost ) {var isJson = o.dataType.indexOf( "json" ) >= 0; data = isJson ? JSON.stringify( o.data ) : $_$._formData( o.data ); xhr.setRequestHeader( "Content-Type", isJson ? "application/json" : "application/x-www-form-urlencoded" ); } xhr.send( data ); }; }( root ) );

  /**
   *  creates a new Thingdom interface with methods to interact with Thingdom API
   *  @class ThingdomIO
   *  @returns {Thingdom} [Thingdom]
   */
  var ThingdomIO = function ( api_secret ) {
    var $self          = this,
        $device_secret = 'none',
        $endpoint      = 'https://api.thingdom.io/1.1/',
        $apiSecret,
        $application_token;

    this.lastError = null;

    if ( typeof api_secret !== 'undefined' ) {
      $apiSecret = api_secret;
    }

    /**
     *  handles errors
     *  @method  errorHandler
     *  @private
     *  @param   {object}      e  error object passed from function
     */
    var errorHandler = function( e ) {
      $self.lastError = e;
      return;
    };

    /**
     *  handles ajax posting
     *  @method  post
     *  @param   {string}    command   comand being sent to Thingdom API
     *  @param   {object}    data      JSON formatted Object for PostBODY
     *  @param   {function}  callback  function invoked after promise completes
     */
    var post = function ( command, data, callback ) {
      var rePost = function( returnData ) {
        var rCommand       = command,
            rData          = data,
            rCallback      = callback;
        rData.token = returnData.application_token;
        root.ajax( {
          url:              $endpoint + rCommand,
          withCredentials:  true,
          type:             'POST',
          dataType:         "json",
          data:             rData,
          success:  function(){},
          error:    function(){},
          complete: function( xhr ) { if ( xhr.responseJSON.response !== 'token_expired' ) { rCallback( xhr.responseJSON ); } else { errorHandler( 'Unable to post. Thingdom API response: ' + xhr.responseJSON.msg ); return; } }
        } );
      };

      root.ajax( {
        url:              $endpoint + command,
        withCredentials:  true,
        type:             'POST',
        dataType:         "json",
        data:             data,
        success:  function( data ) { if ( data.response !== 'token_expired' ) { callback( data ); } },
        error:    function( data ) { callback( data ); },
        complete: function( xhr ) { if ( xhr.responseJSON.response === 'token_expired' ) { getApplicationToken( $apiSecret, $device_secret, rePost ); } }
      } );
    };

    var setApplicationToken = function( application_token ) {
      $application_token = application_token;
    };

    var getApplicationToken = function( apiSecret, device_secret, callback ) {
      var applicationTokenPromise;
      if ( typeof callback === 'function' ) {
        applicationTokenPromise = root.deferred();
        applicationTokenPromise.then( callback, callback );
      }
      var postData = { api_secret: apiSecret, device_secret: device_secret };

      var getApplicationTokenCallback = function( data ) {
        setApplicationToken( data.application_token );
        if ( typeof applicationTokenPromise !== 'undefined' ) {
          applicationTokenPromise.resolve( data );
        }
      };
      post( 'token', postData, getApplicationTokenCallback );
    };

    getApplicationToken( $apiSecret, $device_secret );

    /**
     *  @class Thing
     *  @extends {Thingdom} let's be real, no, it doesn't.
     *  @param   {string}  thing_id    thing's id
     *  @param   {string}  token       application_token
     *  @param   {string}  thing_code  thing's code
     */
    var ThingIO = function ( thing_id, thing_code ) {
      var $thing_id = thing_id;

      this.thing_code = thing_code;

      /**
       *  posts to /feed for this Thing
       *  @link     https://dev.thingdom.io/docs/api/1.1/feed/
       *  @method   feed
       *  @param    {string}  message   whatever message you want.
       *  @optional {string}  category  the category name for this feed message.
       */
      var feed = function( message, category ) {
        var postData = {};

        if ( typeof message === 'undefined' ) {
          errorHandler( 'feed: You must provide a message' );
          return;
        }
        if ( typeof category !== 'undefined' ) {
          postData.feed_category = category;
        }
        postData.token    = $application_token;
        postData.thing_id = $thing_id;
        postData.message  = message;

        var feedCallback  = function( data ) {
          if ( data.response !== 'success' ) {
            errorHandler( 'feed: Error posting to /feed. Thingdom API response: ' + data.msg );
            return;
          }
        };
        post( 'feed', postData, feedCallback );
      };


      /**
       *  posts to status/ for this Thing with a single key / value pair
       *  @link https://dev.thingdom.io/docs/api/1.1/status/
       *  @method  status
       *  @param   {string}  key    key to which you'd like to update status
       *  @param   {string}  value  value for the key that you'd like to update
       *  @param   {string}  unit   unit for value
       *                            @todo should be @optional
       */
      var status = function( key, value, unit ) {
        var postData = {};

        if ( typeof key === 'undefined' || typeof value === 'undefined' ) {
          errorHandler( 'status: You must specify both a key and value' );
          return;
        }

        postData.token     = $application_token;
        postData.thing_id  = $thing_id;

        if ( typeof unit !== 'undefined' ) {
          postData.status_array = [ { name: key, value: value, unit: unit } ];
        } else {
          postData.status_array = [ { name: key, value: value } ];
        }

        var statusCallback = function ( data ) {
          if ( data.response !== 'success' ) {
            errorHandler( 'status: Error posting to /status. Thingdom API response: ' + data.msg );
          }
        };
        post( 'status', postData, statusCallback );
      };

      /**
       *  posts to status/ for this Thing with an array of key value pairs
       *  @link https://dev.thingdom.io/docs/api/1.1/status/
       *  @method  status
       *  @param   {string}  statusArr  array of key value pairs with option unit string
       */
      var statusArray = function( statusArr ) {

        if ( typeof statusArr !== 'object' ) {
          errorHandler( 'statusArray: You must pass an array containing one or more objects with appropriate key value pairs: [ { name: key, value: val, unit: unit } ]' );
        }

        var postData = {
          token: $application_token,
          thing_id: $thing_id,
          status_array: statusArr
        };
        var statusCallback = function ( data ) {
         if ( data.response !== 'success' ) {
            errorHandler( 'statusArray: Error posting to /status. Thingdom API response: ' + data.msg );
          }
        };
        post( 'status', postData, statusCallback );
      };

      this.feed = feed;
      this.status = status;
      this.statusArray = statusArray;
      return this;
    };

    /**
     *  posts to /thing then performs passed user callback in proper scope ( theoretically ).
     *  @link  https://dev.thingdom.io/docs/api/1.1/thing/
     *  @method  getThing
     *  @param   {string}  name          name of the thing
     *  @param   {string}  product_type  the product type for this new thing
     *                                   @todo  should be @optional
     *  @todo  allow invoke of existing thing with control passed to new Thing?
     */
    this.getThing = function ( name, product_type, callback ) {

      if ( typeof $device_secret === 'undefined' || typeof $apiSecret === 'undefined' || typeof $application_token === 'undefined' ) {
        errorHandler( "getThing: Thingdom requires a valid API Secret. Log in at dev.thingdom.io for yours." );
        return;
      }

      if ( typeof callback !== 'function' ) {
        errorHandler( "getThing: You must provide a valid callback to get instantiated Thing. Try a good variation of: function( newThing ) { thing = newThing; } ");
        return;
      }


      if ( typeof name === 'undefined' ) {
        errorHandler( "getThing: You must define the name for your Thing" );
        return;
      }

      var postData = { name: name };

      if ( typeof product_type !== 'undefined' ) {
        postData.product_type = product_type;
      }

      postData.token = $application_token;

      var getThingCallback = function ( data ) {
        if ( data.response !== 'success' ) {
          errorHandler( 'getThing: Error posting to /thing. Error from Thingdom API: ' + data.msg );
          return;
        }
        callback( new ThingIO( data.thing_id, data.code ) );
      };
      post( 'thing', postData, getThingCallback );
    };
    return $self;
  };
  root.Thingdom = ThingdomIO;
} ).call( this );
