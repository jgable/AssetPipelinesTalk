/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        deck: {
            deps: [
                'jquery'
            ],
            exports: '$.deck'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone-amd/backbone',
        underscore: '../bower_components/underscore-amd/underscore',
        deck: 'vendor/deck'
    }
});

require([
    'deck',
    'boxes'
], function (DeckJs, BoxesView) {
    DeckJs(".slide");
    console.log("Loaded Deck");

    // TODO: Create only when loading the first slide
    new BoxesView();
    console.log("Loaded Boxes");
});