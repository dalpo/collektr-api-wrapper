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

    // Enable providers's glyph sprites ['glyph', 'verbose', 'verbose with_prefix']
    css_glyph: 'glyph',

    // Additional search params
    search: '',

    // Key/Value relationship for card-type/template-name
    template: {
      collektr_photo:         'with_media',
      collektr:               'only_text',
      facebook_photo:         'with_media',
      facebook_status_link:   'only_text',
      facebook_status_photo:  'with_media_facebook',
      facebook_status_video:  'with_video_facebook',
      facebook_status:        'only_text_facebook',
      facebook:               'with_media',
      flickr_photo:           'with_media',
      google_activity:        'only_text',
      instagram_image:        'with_media',
      instagram_video:        'with_media',
      pin:                    'with_media',
      tweet_photo:            'with_media_tweet',
      tweet_spotify:          'with_media_tweet',
      tweet_vimeo:            'with_media_tweet',
      tweet_vine:             'with_media_tweet',
      tweet_youtube:          'with_media_video',
      tweet:                  'only_text'
    }
  },
  // Template basic structure
  BASIC_NODE_LIST = {
    "section":"<section class='card card_{{=it.id}} {{=it.card_type}}' data-id='{{=it.id}}'>{{#def.box}}</section>",
    "box":"<div class='box show online tween'>{{#def.thumbnail_wrap}}</div>",
    "thumbnail_wrap":"<div class='thumbnail-wrap {{=it.provider_name}}'>{{#def.tpl_block}}</div>",
    "mediaurl":"<figure class='card-image'><img src='{{=it.media_url}}'></figure>",
    "mediavideo":"<figure class='card-image'><img src='{{=it.options.table.video_thumbnail}}'></figure>",
    "caption":"<div class='caption'>{{=it.content || ''}}</div>",
    "captiontext":"<div class='caption eq-cap'><div class='vertical-align'>{{ out+=$.collektrApiWrapper.truncate(it.content); }}</div></div>",
    "captionempty":"<div class='caption'></div>",
    "captioneq":"<div class='caption eq-cap'><div class='vertical-align'>{{=it.content}}</div></div>",
    "created":"<small class='created'>{{ out+=$.collektrApiWrapper.dateFormat(it.created_at); }}</small>",
    "headerpict":"<hgroup><img class='media-object' src='{{=it.options.table.user_info.profile_picture}}'><h6><p>{{=it.options.table.user_info.username}}</p></h6><div class='{{ out+=$.collektrApiWrapper.glyph_class(); }}'></div></hgroup>",
    "header":"<hgroup><img class='media-object' src='{{=it.options.table.profile_image_url}}'><h6><p>{{=it.from}}</p></h6><div class='{{ out+=$.collektrApiWrapper.glyph_class(); }}'></div></hgroup>"
  },
  // Template list
  TEMPLATES = {},
  BASE_URL = 'http://collektr.com/api/1/boards',
  jsonData = '', $element, callbackEvent;


  /*-------------------
        Constructor
  --------------------*/

  $.collektrApiWrapper = function( options, element, callback ) {
    $element = $( element );
    callbackEvent = callback;
    _init( options );
    _create_default_templates();
    _getData();
  };

  /*-------------------
        Private
  --------------------*/


  var _init = function( options ) {
    OPTIONS = {};
    OPTIONS = $.extend( true, {}, DEFAULTS, options );
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
    _render_board();
  };

  var _error = function( xhr, ajaxOptions, thrownError ) {};

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

  var _render_board = function() {
    var html_output = "";
    // var scopedObj = this;
    $.each(jsonData, function(index, card){
      html_output += _render_card(card);
    });
    $element.html("<div class='"+OPTIONS.wrapper_class+" eq-wrapper'>"+html_output+"</div>");
  };

  var _render_card = function(card) {
    return TEMPLATES[OPTIONS.template[card.card_type]](card);
  };

  var _createTemplate = function(name, block) {
    TEMPLATES[name] = doT.template("{{#def.section}}",null,$.extend( true, {}, BASIC_NODE_LIST, {"tpl_block":block}));
  };

  var _addBasicNode = function(name, block) {
    BASIC_NODE_LIST[name] = block;
  };

  var _create_default_templates = function() {
    _createTemplate("with_media", "<div class='eq-item'>{{#def.mediaurl}}{{#def.headerpict}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("with_media_facebook", "<div class='eq-item'>{{#def.mediaurl}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("only_text_facebook", "<div class='eq-item'>{{#def.captiontext}}{{#def.header}}</div>{{#def.created}}");
    _createTemplate("with_video_facebook", "<div class='eq-item'>{{#def.mediavideo}}{{#def.header}}{{#def.captionempty}}</div>{{#def.created}}");
    _createTemplate("with_media_tweet", "<div class='eq-item'>{{#def.mediaurl}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("with_media_video", "<div class='eq-item'>{{#def.mediavideo}}{{#def.header}}{{#def.caption}}</div>{{#def.created}}");
    _createTemplate("only_text", "<div class='eq-item'>{{#def.captioneq}}{{#def.header}}</div>{{#def.created}}");
  };


  /*-------------------
      jQuery Plugin
  --------------------*/

  $.fn.collektrApiWrapper = function( options, callback ) {
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
          instance = $.data( this, 'collektr-api-wrapper', new $.collektrApiWrapper( options, this, callback ) );
        }
      });
    }
    return this;
  };


  /*-------------------
      Public methods
  --------------------*/


  $.collektrApiWrapper.equalizeHeights = function() {
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
        $('.collektr-api-wrapper section .caption').each(function(){
          var html = $(this).html();
          html = $.collektrApiWrapper.emojify(html);
          html = $.collektrApiWrapper.urlify(html);
          $(this).html(html);
        });
        $.collektrApiWrapper.show();
      });
    } else {
      throw new Error('collektrApiWrapper\'s equalizeHeights method requires imagesLoaded.js and equalize.js');
    }
  };

  $.collektrApiWrapper.dateFormat = function(date) {
    var cdate =  new Date(date);
    return cdate.toLocaleDateString()+" "+cdate.toLocaleTimeString();
  };

  $.collektrApiWrapper.truncate = function(text) {
    var txt =  (text.length > 300) ? text.substring(0,300)+'...' : text;
    return txt;
  };

  $.collektrApiWrapper.show = function() {
    setTimeout(function(){
      $('section .box').addClass('slidein');
    },100);
  };

  $.collektrApiWrapper.urlify = function (text) {
    var urlRegex = /(https?:\/\/[^\s<]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    });
  };

  $.collektrApiWrapper.emojify = function (text) {
    if (hasJEMOJI) {
      var html = text.trim().replace(/\n/g, '<br/>');
      return jEmoji.unifiedToHTML(html);
    }
  };

  $.collektrApiWrapper.glyph_class = function() {
    return OPTIONS.css_glyph;
  };

  $.collektrApiWrapper.createTemplate = function() {
   _createTemplate();
 };

  $.collektrApiWrapper.addBasicNode = function() {
    _addBasicNode();
  }

  $.collektrApiWrapper.resetTemplates = function() {
    _create_default_template;
  };


} )( jQuery, window );

