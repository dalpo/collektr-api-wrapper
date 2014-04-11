collektr-api-wrapper
====================

It's a javascript plugin made for developers that serves as wrapper for Collektr's API
It render Collektr's cards client-side on a given html tag using doT.js as templating framework.


INSTRUCTIONS
---------------

Given the fact you already [signed up](http://collektr.com/users/sign_up) or [signed in](http://collektr.com/users/sign_in) on Collektr and you have your own [board](http://collektr.com/boards/new) filled with cards, you should get your `Api Access Token` on the [profile](http://collektr.com/users/edit) page and save it for later use.

#Markup

Markup does not need any hierarchy, but as a starting point i suggest to wrap the board on this simple structure to match his css:

    <div class="widget collektr">
      <div class="collektr-contents"></div>
    </div>

#Configuration

The wrapper `replace the html` of a given element with the api's result. The basic usage of the wrapper needs two parameteres:

* `Api Access Token`
* `Board Name`

Simple example:

    $('.collektr-contents').collektrApiWrapper({
      auth_token:"API-ACCESS-TOKEN",
      id:"YOUR-BOARD-NAME"
    });

Full configuration list parameters:

    $('.collektr-contents').collektrApiWrapper({

      auth_token:"API-ACCESS-TOKEN",

      id:"YOUR-BOARD-NAME",

      limit : '4', // Number of cards to render

      wrapper_class: 'collektr-api-wrapper', // Wrapper name

      css_glyph: 'glyph', // provider class ('glyph' and 'verbose' comes precompiled)

      template: { // Key/Value relationship for card-type/template-name
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

      nodes: {  // Template basic nodes
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
      }

    });


HOW TO BUILD
------------

I use [Bower](http://bower.io/) and [Broccoli](https://github.com/joliss/broccoli) to manage and export assets. Broccoli is still in alpha, but if you want to follow this approach just:

    npm install -g bower
    npm install --save broccoli
    npm install --global broccoli-cli

with the following Libraries:

    npm --save-dev broccoli-bower
    npm install broccoli-uglify-js
    npm install broccoli-merge-trees
    npm install broccoli-concat
    npm install --save broccoli-csso

To update or install Bower dependencies run

    bower install

and rebuild all the assets with Broccoli

    broccoli build public


TODO LIST
---------

* Add styling section
* Add Api section
* Add templating examples
* Add search functionality
* Add Api version in options


BROWSER SUPPORT
---------------

Currently collektrApiWrapper.js works fine in latest Chrome browser, Safari 5.1 and Firefox 10.
Do not ask about IE, I dont even bother testing on it :)


LICENSE
-------

Copyright 2014 Develon Srl

Wrote by Davide Manea <hello@dmanea.com>

Released under the MIT License.

