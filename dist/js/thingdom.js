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


/**
 *  @returns  {new Thingdom()}  [Thingdom]
 *  @todo  describe
 *  @todo  update for AMD / Require?
 */

( function () {
  "use strict";
  var root = this,
      previous_thingdom = root.Thingdom;
/**
 *  provides Promise/A like functionality. modified from link
 *  @link https://github.com/ryansmith94/Pledges
 *  @returns  {deferred()}  [@todo adapt and integrate]
 */
  ( function ( $_$ ) {
    var Deferred = function () {
      var self = this, state = 0, value = null, fulfilled = [], rejected = [];
      var changeStateFn = function ( newState, buffer ) { return function ( givenValue ) { if ( state === 0 ) { value = givenValue;  state = newState;  buffer.forEach( function ( fn ) { fn(); } ); } return self; }; };
      self.state = ( function () { var states = ['pending', 'fulfilled', 'rejected']; return function () { return states[ state ]; }; }());
      self.resolve = changeStateFn( 1, fulfilled );
      self.reject = changeStateFn( 2, rejected );
      self.then = function ( onFulfilment, onRejection ) { var p = constructor(); var fn = function ( givenFn, protection ) { if ( typeof givenFn !== 'function' ) { givenFn = protection; } return function () { setTimeout( function () { try { p.resolve( givenFn( value ) ); } catch ( error ) { p.reject( error ); } } ); }; }; onFulfilment = fn( onFulfilment, function ( value ) { return value; } ); onRejection = fn( onRejection, function ( reason ) { throw reason; } ); if ( state === 0 ) { fulfilled.push( onFulfilment ); rejected.push( onRejection ); } else if ( state === 1 ) { onFulfilment(); } else if ( state === 2 ) { onRejection(); } return p.restrict(); };
      self.restrict = function () { return { state: self.state, then: self.then }; };
      return self;
    };
    var constructor = function () { return new Deferred(); };
    // AMD Support.
    if ( typeof $_$.define === 'function' ) { $_$.define('deferred', [], function () { return constructor; } ); } else { $_$.deferred = constructor; }
  }( root ));
/**
 *  provides jquery like $.ajax() functionality
 *  @link https://gist.github.com/mythz/1334560
 *  @returns {ajax()} [@todo adapt and integrate]
 */
  ( function ( $_$ ) {
    var xhrs = [ function () { return new XMLHttpRequest(); }, function () { return new ActiveXObject( "Microsoft.XMLHTTP" ); }, function () { return new ActiveXObject( "MSXML2.XMLHTTP.3.0" ); }, function () { return new ActiveXObject( "MSXML2.XMLHTTP" ); } ], _xhrf = null;
    var hasOwnProperty = Object.prototype.hasOwnProperty, nativeForEach = Array.prototype.forEach;
    var _each = function ( o, fn, ctx ) { if ( o === null ) { return; } if (nativeForEach && o.forEach === nativeForEach) { o.forEach(fn, ctx); } else if ( o.length === +o.length ) { for ( var i = 0, l = o.length; i < l; i++ ) { if ( i in o && fn.call( ctx, o[i], i, o ) === breaker ) return; } } else { for ( var key in o ) { if ( hasOwnProperty.call( o, key )) { if ( fn.call( ctx, o[key], key, o ) === breaker ) { return; } } } } };
    var _extend = function ( o ) { _each( Array.prototype.slice.call( arguments, 1 ), function ( a ) { for ( var p in a ) if ( a[p] !== void 0 ) o[ p ] = a[ p ]; } ); return o; };
    $_$.xhr = function () { if ( _xhrf !== null ) { return _xhrf(); } for ( var i = 0, l = xhrs.length; i < l; i++ ) { try { var f = xhrs[ i ], req = f(); if ( req !== null ) { _xhrf = f; return req; } } catch ( e ) { continue; } } return function () {}; };
    $_$._xhrResp = function ( xhr ) { switch ( xhr.getResponseHeader( "Content-Type" ).split( ";" )[ 0 ]) { case "text/xml": return xhr.responseXML; case "text/json": case "application/json": case "text/javascript": case "application/javascript": case "application/x-javascript": return JSON.parse( xhr.responseText ); default: return xhr.responseText; } };
    $_$._formData = function ( o ) { var kvps = [], regEx = /%20/g; for ( var k in o ) kvps.push( encodeURIComponent( k ).replace( regEx, "+" ) + "=" + encodeURIComponent( o[ k ].toString() ).replace( regEx, "+" ) ); return kvps.join( '&' ); };
    $_$.ajax = function ( o ) { var xhr = $_$.xhr(), timer, n = 0, deferred = root.deferred(); o = _extend( { userAgent: "XMLHttpRequest", lang: "en", type: "GET", data: null, dataType: "application/x-www-form-urlencoded" }, o ); if (o.timeout) { timer = setTimeout( function () { xhr.abort(); if ( o.timeoutFn ) { o.timeoutFn( o.url ); } }, o.timeout );} var onComplete = function( data ) { return o.success( data ); }; var onError = function( data ) { return o.error( data ); }; deferred.then( onComplete, onError ); xhr.onreadystatechange = function () { if ( xhr.readyState == 4 ) { if ( timer ) { clearTimeout( timer ); } if ( xhr.status < 300 ) { if ( o.dataType.indexOf( "json" ) >= 0 ) { xhr.responseJSON = JSON.parse( xhr.responseText ); } if ( o.success ) { if ( deferred.state() === 'pending' ) { deferred.resolve( $_$._xhrResp( xhr ) ); } else { o.success( $_$._xhrResp( xhr ), "success", xhr ); } } } else if ( o.error ) { if ( deferred.state() === 'pending' ) { deferred.reject( xhr.statusText ); } else { o.error( xhr, xhr.status, xhr.statusText ); } } if ( o.complete ) { o.complete( xhr, xhr.statusText ); } } else if ( o.progress ) { o.progress( ++n ); } }; var url = o.url, data = null; var isPost = o.type == "POST" || o.type == "PUT"; if ( !isPost && o.data ) { url += "?" + $_$._formData( o.data ); } xhr.open( o.type, url ); if ( isPost ) { var isJson = o.dataType.indexOf( "json" ) >= 0; data = isJson ? JSON.stringify( o.data ) : $_$._formData( o.data ); xhr.setRequestHeader( "Content-Type", isJson ? "application/json" : "application/x-www-form-urlencoded" ); } xhr.send( data ); };
  } ( root ));

/**
 *  creates a new Thingdom
 *  @class creates a new ThingdomClass
 *  @returns {ThingdomClass} [ThingdomClass]
 */

  var ThingdomClass = root.Thingdom = function () {
    var $self     = this,
        $endpoint = 'https://api.thingdom.io/1.1/';

    $self.responses = [];
    $self.errors    = [];

    /**
     *  handles errors
     *  @method  errorHandler
     *  @param   {object}      e  error object passed from function
     */
    var errorHandler = function( e ) {
      $self.errors.push( e );
      console.error( $self.errors[ $self.errors.length - 1 ] ); // @todo var self.dev === true ??
    };

    /**
     *  handles ajax posting
     *  @method  post
     *  @param   {string}    command   comand being sent to Thingdom API
     *  @param   {object}    data      JSON formatted Object for PostBODY
     *  @param   {function}  callback  function invoked after promise completes
     */
    var post = function ( command, data, callback ) {
      root.ajax( {
        url:              $endpoint + command,
        withCredentials:  true,
        type:             'POST',
        dataType:         "json",
        data:             data,
        success: function( data ) { callback( data ); },
        error: function( data ) { callback( data ); },
        complete: function( xhr ) { $self.responses.push( xhr.responseJSON ); }
      } );
    };

    /**
     *  gets API secret from script call
     *  @method  getAPISecret
     *  @returns  {string}      apiSecret
     */
    var getAPISecret = function () {
      var scripts = document.getElementsByTagName( "script" ),
          apiSecret,
          src,
          uri = null;

      /**
       *  parses URI modified from link
       *  @link http://blog.stevenlevithan.com/archives/parseuri
       *  @method   parseUri
       *  @param    {string}  str  string to parse
       *  @returns  {string}  str  string that was parsed
       */
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
        if ( uri.file === "thingdom.js" || uri.file === "thingdom-min.js" ) {
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

    /**
     *  initilizes self with Thingdom API using apiSecret
     *  @method  intitialize
     *  @private
     */
    var _intitialize = function () {
      var postData = {};

      if ( typeof $self.apiSecret === 'undefined' ) {
        $self.apiSecret = getAPISecret();
      }

      if ( typeof $self.device_secret !== 'undefined' ) {
        postData = {
          'api_secret':    $self.apiSecret,
          'device_secret': $self.device_secret
        };
      } else {
        postData = {
          'api_secret': $self.apiSecret
        };
      }

      /**
       *  sticks data in the places where it goes
       *  @method   intitializeCallback
       *  @param    {object}  data  JSON response from Thingdom API
       *  @todo hide / protect values better
       */
      var intitializeCallback = function ( data ) {
        if ( data.response === 'success' ) {
          for ( var key in data ) {
            $self[ key ] = data[ key ];
          }
        } else if ( data.response === 'error' ) {
          errorHandler( 'Initializion of Thingdom failed. Server responded: ' + data.msg );
          return;
        }
      };
      post( 'token', postData, intitializeCallback );
    };

    _intitialize();

    /**
     *  @class Thing
     *  @extends {Thingdom} let's be real, no, it doesn't but it will soon as possible.
     *  @param   {string}  thing_id    thing's id
     *  @param   {string}  token       application_token
     *  @param   {string}  thing_code  thing's code
     */
    var Thing = function ( thing_id, token, thing_code ) {
      var $parent             = root.Thingdom,
          $_post              = post;

      this.thing_id           = thing_id;
      this.application_token  = token;
      this.thing_code         = thing_code;
      this.responses          = [];
      this.errors             = [];
      this.feed_categories    = [];
      this.status_keys        = [];

      /**
       *  posts to settings/feed_category & settings/feed_category/delete for this Thing
       *  @link   https://dev.thingdom.io/docs/api/1.1/settings/feed_category/
       *  @method  feed_category
       *  @param  {string}  action        action to take
       *  @param  {string}  name          the internal name for the category.
       *  @param  {string}  display_name  the display name for the category.
       *  @param  {string}  product_type  set which product type this category applies to
       *                                  @todo  should be @optional
       *  @todo describe what's gonna happen.
       */
      var feed_category = function( action, name, display_name, product_type ) {
        var actions = [ 'create', 'update', 'delete' ],
            cmd = 'settings/feed_category',
            postData = {};

        if ( typeof action !== 'undefined' && actions.indexOf( action ) === -1 ) {
          this.errors.push( "Cannot perform operation '" + action + "' as its not valid." );
          return;
        } else if ( action === 'delete' ) {
          cmd += '/' + action;
        }

        if ( typeof name === 'undefined' || typeof display_name === 'undefined' ) {
          var values = JSON.stringify( { name: typeof name, product_name: typeof product_name }, null, 4 );
          this.errors.push( "Cannot '" + action + "' feed_category. You must define both name and product_name. Saw: " + values );
        }

        postData.token = this.application_token;
        postData.name = name;
        postData.display_name = display_name;
        postData.product_type = ( typeof product_type !== 'undefined' ) ? product_type : '';

        var feed_categoryCallback = function( data ) {
          console.log( data );
          if ( data.response === 'success' ) {
            this.responses.push( data );
            this.feed_categories.push( { name: postData.name, display_name: postData.display_name, product_type: postData.product_type } );
          } else{
            this.errors.push( 'Error in feed_category. Server responded: ' + data.msg );
          };
        }
        $_post( cmd , postData, feed_categoryCallback );
      };

      /**
       *  posts to /feed for this Thing
       *  @link    https://dev.thingdom.io/docs/api/1.1/feed/
       *  @method  feed
       *  @param   {string}  category  the category name for this feed message.
       *  @param   {string}  message   whatever message you want.
       *  @todo     describe what's gonna happen.
       */
      var feed = function( category, message ) {
        var postData = {
              token:          this.application_token,
              thing_id:       this.thing_id,
              message:        message,
              feed_category:  category,
        };
        var feedCallback = function( data ) {
          console.log( data );
          if ( data.msg === 'success' ) {
            this.responses.push( data )
          } else {
            this.errors.push( 'Error in feed. Server responded: ' + data.msg );
          }
        };
        $_post( 'feed', postData, feedCallback );
      };

      /**
       *  posts to settings/status_key & settings/status_key/delete for this Thing
       *  @link   https://dev.thingdom.io/docs/api/1.1/settings/status_key/
       *  @method status_key
       *  @param  {string}  action  action to take
       *  @param  {string}  name          the name for the key
       *  @param  {string}  display_name  the display name for the key
       *  @param  {string}  product_type  the name of the product type this key applies to
       *  @param  {bool}    is_digital    define whether value for key digital
       *                                  @todo  should be @optional
       */
      var status_key = function( action, name, display_name, product_type, is_digital ) {
        var actions = [ 'create', 'update', 'delete' ],
            cmd = 'settings/status_key',
            postData = {};

        if ( typeof action !== 'undefined' && actions.indexOf( action ) === -1 ) {
          this.errors.push( "Cannot perform settings/status_key with operation '" + action + "' as its not valid." );
          return;
        } else if ( action === 'delete' ) {
          cmd += '/' + action;
        }

        if ( typeof name === 'undefined' || typeof display_name === 'undefined' ) {
          var values = JSON.stringify( { name: typeof name, product_name: typeof product_name }, null, 4 );
          this.errors.push( "Cannot '" + action + "' feed_category. You must define both name and product_name. Saw: " + values );
        }

        postData.token = this.application_token;
        postData.name = name;
        postData.display_name = display_name;
        postData.product_type = ( typeof product_type !== 'undefined' ) ? product_type : '';
        postData.is_digital   = ( typeof is_digital !== 'undefined' ) ? is_digital : false;

        var status_keyCallback = function( data ) {
          console.log( data );
          if ( data.response === 'success' ) {
            this.responses.push( data );
            this.status_keys.push( { name: postData.name, display_name: postData.display_name, product_type: postData.product_type, is_digital: is_digital } );
          } else{
            this.errors.push( 'Error in status_key. Server responded: ' + data.msg );
          };
        }
        $_post( cmd , postData, status_keyCallback );
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
        var postData = {
          token: this.application_token,
          thing_id: this.thing_id,
          status_array: {
            name: key,
            value: value,
            unit: unit
          }
        };
        var statusCallback = function ( data ) {
          console.log( data );
          if ( data.msg === 'success' ) {
            this.responses.push( data )
          } else {
            this.errors.push( 'Error in feed. Server responded: ' + data.msg );
          }
        };
        $_post( 'status', postData, statusCallback );
      };

      /**
       *  posts to status/ for this Thing with an array of key value pairs
       *  @link https://dev.thingdom.io/docs/api/1.1/status/
       *  @method  status
       *  @param   {string}  statusArr  array of key value pairs
       */
      var statusArray = function( statusArr ) {
        var postData = {
          token: this.application_token,
          thing_id: this.thing_id,
          status_array: statusArr
        };
        var statusCallback = function ( data ) {
          console.log( data );
        };
        $_post( 'status', postData, statusCallback );
      };

      this.feed_category = feed_category;
      this.feed = feed;
      this.status_key = status_key;
      this.status = status;
      this.statusArray = statusArray;

      return this;
    };

    var things = [];

    $self.things = ( typeof $self.things === 'undefined' ) ? things : $self.things;

    /**
     *  posts to thing/ then attaches new Thing() to Thingdom.things[] at the end.
     *  @link  https://dev.thingdom.io/docs/api/1.1/thing/
     *  @method  getThing
     *  @param   {string}  name          name of the thing
     *  @param   {string}  product_type  the product type for this new thing
     *                                   @todo  should be @optional
     *  @todo  allow invoke of existing thing with control passed to new Thing?
     */
    var getThing = function ( name, product_type ) {
      var getThingPromise = new deferred();

      if ( typeof $self.device_secret === 'undefined' || typeof $self.apiSecret === 'undefined' || typeof $self.application_token === 'undefined' ) {
        var values = JSON.stringify( { api_secret: $self.apiSecret, application_token: $self.application_token, device_secret: $self.device_secret }, null, 4 );
        errorHandler( "Unable to get Thing, Thingdom requires an API Secret, an Application Token, and a Device Secret. Currently Thingdom has initialized with: " + values );
        return;
      }

      var postData = {};

      if ( typeof name !== 'undefined' ) {
        postData.name = name;
      } else {
        errorHandler( "getThing Error: You must define the name for your Thing" );
        return;
      }

      if ( typeof product_type !== 'undefined' ) {
        postData.product_type = product_type;
      } else {
        postData.product_type = '';
      }

      postData.token = $self.application_token;

      /**
       *  callback to attach new Thing to end of $self.things array and return postion
       *  @method   onThingGot
       *  @param    {Thing}    data  new Thing object
       *  @returns  {integer}    array pointer
       *  @todo     the scope of this means the return never happens. fix that.
       */
      var onThingGot = function( data ) {
        var pointer = $self.things.push( new Thing( data._xhr.thing_id, data.$parent.application_token, data._xhr.code ) );
        return $self.things[ pointer - 1 ];
      };

      var onThingError = function( data ) {
        errorHandler( 'getThing Error: Unable to create Thing. Server responded: ' + data.msg );
      };

      getThingPromise.then( onThingGot, onThingError );

      /**
       *  callback to handle resolution of Promise for server response when creating a thing.
       *  @rationale quiet & performant async without blocking single threaded.
       *  @todo      better solution? i'm open to suggestions. scope scope scope scope scope compatibility????
       *  @method  getThingCallback
       *  @param   {callbackXHR}  data  JSON from AJAX response
       */
      var getThingCallback = function ( data ) {
        var resolve = { _xhr: data, $parent: $self };
        if ( resolve._xhr.response === 'success' ) {
          getThingPromise.resolve( resolve );
        } else {
          getThingPromise.reject( resolve._xhr.msg );
        }
      };
      post( 'thing', postData, getThingCallback );
    };

    $self.getThing = getThing;

    /**
     *  noConflict
     *  @method  noConflict
     *  @returns  {Thingom}    The best darn Thingdom ever!
     */
    $self.noConflict = function () {
      root.previous_thingdom = previous_thingdom;
      return $self;
    };
  };
  /**
   *  self invokation
   *  @returns  {Thingdom}  the Thingdoms!!!
   */

  (function() {
    var Thingdom = new ThingdomClass();
    return Thingdom;
  })( root );

  Thingdom.ThingdomClass = Thingdom;
  root.Thingdom = Thingdom;

} ).call( this );


