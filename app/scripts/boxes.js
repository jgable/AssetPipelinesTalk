/* global define */
define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {
	'use strict';

	var boxTemplate,
		colorMap,
		BoxModel,
		BoxView,
		BoxesView;

	colorMap = {
		0: 'one',
		1: 'two',
		2: 'three',
		3: 'four'
	};

	BoxModel = Backbone.Model.extend({
		defaults: {
			color: colorMap[0]
		},

		startChanging: function () {
			var self = this,
				randomDelay = 2000 + Math.floor(Math.random() * 2000);

			this.intervalId = setInterval(function () {
                self.collection.enqueueChange(self); 
				//self.set({color: self.getRandomColor()});
			}, randomDelay);
		},

		stopChanging: function () {
			clearInterval(this.intervalId);
		},

		getRandomColor: function () {
			var randNum = Math.floor((Math.random() * 1000)) % 4;

			return colorMap[randNum];
		}

	});

	boxTemplate = _.template('<div class="color <%= color %>"></div>');

	BoxView = Backbone.View.extend({
		className: 'box',

		initialize: function () {
			this.model.on('change:color', this.transitionColor, this);
		},

		render: function () {
			var data = this.model.toJSON();

			this.$el.html(boxTemplate(data));

			return this;
		},

		transitionColor: function (model) {
			var $el = this.$el.find('.color');
            $el.removeClass(model.previous("color"));
            $el.addClass(model.get("color"));
		}
	});

	BoxesView = Backbone.View.extend({
		el: '#boxes',

		initialize: function () {
			_.bindAll(this, 'render', 'createBoxView');
            var self = this;
            var boxCount = _.range(2000);
            var boxes = _.map(boxCount, function (each, i) {
				return new BoxModel({color: colorMap[i % 4]});
            });

			this.collection = new Backbone.Collection(boxes);
            this.collection.queue = [];
            this.collection.enqueueChange = function (model) {
               this.queue.push(model);  
            };
            this.collection.flushQueue = function () {
               _.forEach(this.queue, function (model) {
                    model.set({color: model.getRandomColor()}); 
               });
               this.queue = [];
            };
            setInterval(function () {
               requestAnimationFrame(function () {
                   self.collection.flushQueue();
               });
            }, 500); 

			// Auto render for simplicity
			_.defer(this.render);
		},

		render: function () {
			// Create and store the box views from the box models
			this.boxes = this.collection.map(this.createBoxView);
			return this;
		},

		createBoxView: function (model) {
			var randDelay = Math.floor((Math.random() * 2000)),
				// Instantiate and render the box view
				view = new BoxView({model: model}).render();

			// Start the color changing after a random delay
			setTimeout(function () {
				model.startChanging();
			}, randDelay);

			// Append the box view to our boxes container
			this.$el.append(view.$el);

			return view;
		}
	});

	return BoxesView;
});
