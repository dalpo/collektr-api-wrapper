collektr-api-wrapper
====================

It's a javascript plugin made for developers that serves as wrapper for Collektr's API
It render Collektr's cards client-side on a given html tag using doT.js as templating framework.


INSTRUCTIONS
---------------

Given the fact you already [signed up](http://collektr.com/users/sign_up) or [signed in](http://collektr.com/users/sign_in) on Collektr and had your own [board](http://collektr.com/boards/new) filled with cards, you should get your `Api Access Token` on the [profile](http://collektr.com/users/edit) page and save it for later use.

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
    );

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

    );


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
Do not ask about IE, i dont even bother testing on it :)


LICENSE
-------

Copyright 2014 Develon Srl

Wrote by Davide Manea <hello@dmanea.com>

Released under the MIT License.

