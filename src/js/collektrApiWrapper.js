/*!
 * CollektrApiWrapper - v1.0.0
 * jQuery plugin made to render Collektr's card throught an API call
 * Copyright (c) 2014 Develon Srl
 * developed by Davide Manea <hello@dmanea.com>
 * MIT license
 */

if (typeof jQuery === 'undefined') { throw new Error('collektrApiWrapper\'s JavaScript requires jQuery'); }
if (typeof doT === 'undefined') { throw new Error('collektrApiWrapper\'s JavaScript requires doT'); }

;( function( $, window, undefined ) {

  'use strict';

  /********************
        Constants
  *********************/

  var VERSION = "1.0.0",

  hasIMAGESLOADED = !(typeof imagesLoaded === 'undefined'),
  hasEQUALIZE = !(typeof $.fn.equalize === 'undefined'),
  hasJEMOJI = !(typeof jEmoji === 'undefined'),

  OPTIONS,
  DEFAULTS = {

    // Number of cards to render
    limit : '4',

    // Wrapper name
    wrapper_class: 'collektr-api-wrapper',

    // Additional search params
    search: '',

    /**
     * Change the render flow
     * used to render specific card among a non-linear structure
     *
     * @param  {String} all | partial
     */
    render_flow: 'all',

    // Key/Value relationship for card-type/template-name
    templates: {
      collektr_photo:         'with_media',
      collektr:               'only_text',
      facebook_photo:         'with_media_facebook',
      facebook_status_link:   'only_text',
      facebook_status_photo:  'with_media_facebook',
      facebook_status_video:  'with_video_facebook',
      facebook_status:        'only_text_facebook',
      facebook:               'with_media',
      flickr_photo:           'with_media',
      google_activity:        'only_text',
      instagram_image:        'with_media',
      instagram_video:        'with_media',
      pin:                    'with_media_pin',
      tweet_photo:            'with_media_tweet',
      tweet_spotify:          'with_media_tweet',
      tweet_vimeo:            'with_media_tweet',
      tweet_vine:             'with_media_tweet',
      tweet_youtube:          'with_media_video',
      tweet:                  'only_text'
    },
    // Template basic nodes
    nodes: {
      "section":"<section class='card card_{{=it.id}} {{=it.card_type}}' data-id='{{=it.id}}'>{{#def.box}}</section>",
      "box":"<div class='box show online tween'>{{#def.thumbnail_wrap}}</div>",
      "thumbnail_wrap":"<div class='thumbnail-wrap {{=it.provider_name}}'>{{#def.tpl_block}}</div>",
      "mediaurl":"<figure class='card-image'><img src='{{=it.media_url}}'></figure>",
      "mediavideo":"<figure class='card-image'><img src='{{=it.options.table.video_thumbnail}}'></figure>",
      "caption":"<div class='caption'>{{=it.content || ''}}</div>",
      "captiontext":"<div class='caption eq-cap'><div class='vertical-align'>{{ out+=$.fn.collektrApiWrapper.truncate(it.content); }}</div></div>",
      "captionempty":"<div class='caption'></div>",
      "captioneq":"<div class='caption eq-cap'><div class='vertical-align'>{{=it.content}}</div></div>",
      "created":"<small class='created'>{{ out+=$.fn.collektrApiWrapper.dateFormat(it.created_at); }}</small>",
      "headerpict":"<hgroup><img class='media-object' src='{{=it.options.table.user_info.profile_picture}}'><h6><p>{{=it.options.table.user_info.username}}</p></h6><div class='glyph'></div></hgroup>",
      "header":"<hgroup><img class='media-object' src='{{=it.options.table.profile_image_url}}'><h6><p>{{=it.from}}</p></h6><div class='glyph'></div></hgroup>"
    },

    messages: {
      '404': '<p class="error">Oops.. Content not found!<br>Try that again in a few moments.</p>',
      '500': '<p class="error">Server error.<br>Try that again in a few moments.</p>'
    }

  },
  // Template list
  TEMPLATES = {},
  BASE_URL = 'http://collektr.com/api/1/boards',
  RENDER = [],
  jsonData = '', $element, callbackEvent;


  /*-------------------
        Private
  --------------------*/

  var _collektrApiWrapper = function( options, element, callback ) {
    $element = $( element );
    callbackEvent = callback;
    _init( options );
  };

  var _init = function( options ) {
    OPTIONS = {};
    OPTIONS = $.extend( true, {}, DEFAULTS, options );
    _create_default_templates();
    _getData();
  };

  var _getData = function() {
    $.ajax({
      context: this,
      dataType: "jsonp",
      url: _cards_url(),
      data: {
        auth_token: OPTIONS.auth_token,
        per: OPTIONS.limit,
        page: OPTIONS.page,
        'q[aasm_state_eq]': 'online'
      },
      success: _success,
      error: _error,
      complete: _complete
    });
  };

  var _success = function( data ) {
    jsonData = data.response;
    _compose_board();
  };

  var _error = function( xhr, ajaxOptions, thrownError ) {
    var msg = OPTIONS.messages[xhr.status];
    if (msg) $element.html(msg);
  };

  var _complete = function( xhr, text ) { _callback_handling(); };

  var _callback_handling = function() {
    if (callbackEvent && typeof callbackEvent === 'function') {
      callbackEvent.call(this);
      callbackEvent = null;
    }
  };

  var _cards_url = function() {
    return BASE_URL+'/'+OPTIONS.id+'/cards'+OPTIONS.search;
  };

  var _compose_board = function() {
    $.each(jsonData, function(index, card){
      var contents = _urlify(card.content);
      if (hasJEMOJI) contents = _emojify(contents);
      card.content = contents;
      RENDER.push(_render_card(card));
    });
    if (OPTIONS.render_flow == 'all') {
      _render_board();
    }
  };

  var _render_board = function() {
    $element.html("<div class='"+OPTIONS.wrapper_class+" eq-wrapper'>"+RENDER.join('')+"</div>");
  };

  var _render_card = function(card) {
    return TEMPLATES[OPTIONS.templates[card.card_type]](card);
  };

  var _render_partial = function(index) {
    return RENDER[index];
  };

  var truncate = function(text) {
    var txt =  (text.length > 300) ? text.substring(0,300)+'...' : text;
    return txt;
  };

  var dateFormat = function(date) {
    var cdate =  new Date(date);
    return cdate.toLocaleDateString()+" "+cdate.toLocaleTimeString();
  };

  var _createTemplate = function(name, block) {
    TEMPLATES[name] = doT.template("{{#def.section}}",null,$.extend( true, {}, OPTIONS.nodes, {"tpl_block":block}));
  };

  var _addBasicNode = function(name, block) {
    OPTIONS.nodes[name] = block;
  };

  var _create_default_templates = function() {
    _createTemplate("with_media", "<div class='eq-item'>{{#def.mediaurl}}{{#def.headerpict}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("with_media_pin", "<div class='eq-item'>{{#def.mediaurl}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("with_media_facebook", "<div class='eq-item'>{{#def.mediaurl}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("only_text_facebook", "<div class='eq-item'>{{#def.captiontext}}{{#def.header}}</div>{{#def.created}}");
    _createTemplate("with_video_facebook", "<div class='eq-item'>{{#def.mediavideo}}{{#def.header}}{{#def.captionempty}}</div>{{#def.created}}");
    _createTemplate("with_media_tweet", "<div class='eq-item'>{{#def.mediaurl}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("with_media_video", "<div class='eq-item'>{{#def.mediavideo}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("only_text", "<div class='eq-item'>{{#def.captioneq}}{{#def.header}}</div>{{#def.created}}");
  };

  var _emojify = function (text) {
    if (hasJEMOJI) {
      var html = text.trim().replace(/\n/g, '<br/>');
      return jEmoji.unifiedToHTML(html);
    }
  };

  var _urlify = function (text) {
    if (text == undefined) return text;
    var urlRegex = /(https?:\/\/[^\s<]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    });
  };

  var _show = function() {
    setTimeout(function(){
      $('section .box').addClass('slidein');
    },100);
  };

  var _truncate = function(text) {
    var txt =  (text.length > 300) ? text.substring(0,300)+'...' : text;
    return txt;
  };

  var _dateFormat = function(date) {
    var cdate =  new Date(date);
    return cdate.toLocaleDateString()+" "+cdate.toLocaleTimeString();
  };

  var _equalizeHeights = function() {
    if (hasIMAGESLOADED && hasEQUALIZE) {
      imagesLoaded('.collektr-api-wrapper.eq-wrapper img', function() {
        $('.collektr-api-wrapper.eq-wrapper').equalize({
          children: '.eq-item',
          reset: true
        });
        $('.collektr-api-wrapper.eq-wrapper').equalize({
          children: '.eq-cap',
          reset: true
        });
        $('section.collektr, section.facebook_status_link, section.facebook_status, section.tweet').each(function(){
          var h = $(this).find('.eq-item').outerHeight() - $(this).find('hgroup').outerHeight();
          $(this).find('.eq-cap').outerHeight(h);
        });
        _show();
      });
    } else {
      throw new Error('collektrApiWrapper\'s equalizeHeights method requires imagesLoaded.js and equalize.js');
    }
  };

  /*-------------------
      jQuery Plugin
  --------------------*/

  $.fn.extend({
    collektrApiWrapper: function( options, callback ) {
      if ( typeof options === 'string' ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        this.each(function() {
          var instance = $.data( this, 'collektr-api-wrapper' );
          if ( !instance ) {
            logError( "cannot call methods on collektr-api-wrapper prior to initialization; " +
            "attempted to call method '" + options + "'" );
            return;
          }
          if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
            logError( "no such method '" + options + "' for collektr-api-wrapper instance" );
            return;
          }
          instance[ options ].apply( instance, args );
        });
      }
      else {
        this.each(function() {
          var instance = $.data( this, 'collektr-api-wrapper' );
          if ( instance ) {
            instance._init();
          }
          else {
            instance = $.data( this, 'collektr-api-wrapper', new _collektrApiWrapper( options, this, callback ) );
          }
        });
      }
      return this;
    }
  });


 /*-------------------
    Exposed Utilities
  --------------------*/

  $.fn.collektrApiWrapper.dateFormat = _dateFormat;

  $.fn.collektrApiWrapper.truncate = _truncate;

  $.fn.collektrApiWrapper.show = _show;

  $.fn.collektrApiWrapper.urlify = _urlify;

  $.fn.collektrApiWrapper.emojify = _emojify;

  $.fn.collektrApiWrapper.equalizeHeights = _equalizeHeights;

  $.fn.collektrApiWrapper.createTemplate = _createTemplate;

  $.fn.collektrApiWrapper.addBasicNode = _addBasicNode;

  $.fn.collektrApiWrapper.resetTemplates = _create_default_templates;

  $.fn.collektrApiWrapper.getCard = _render_partial;

} )( jQuery, window );

