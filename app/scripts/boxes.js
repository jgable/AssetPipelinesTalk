define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {

	var boxTemplate,
		colorMap,
		BoxModel,
		BoxView,
		BoxesView;

	colorMap = {
		0: "one",
		1: "two",
		2: "three",
		3: "four"
	};

	BoxModel = Backbone.Model.extend({
		defaults: {
			color: colorMap[0]
		},

		startChanging: function () {
			var self = this,
				randomDelay = 2000 + Math.floor(Math.random() * 2000);

			this.intervalId = setInterval(function () {
				self.set({color: self.getRandomColor()})
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

	boxTemplate = _.template("<div class='color <%= color %>'></div>");

	BoxView = Backbone.View.extend({
		className: 'box',

		initialize: function () {
			this.model.on("change:color", this.transitionColor, this);
		},

		render: function () {
			var data = this.model.toJSON();

			this.$el.html(boxTemplate(data));

			return this;
		},

		transitionColor: function () {
			// Generate the next color element
			var $current = this.$el.find(".color"),
				$next = $(boxTemplate(this.model.toJSON()));

			$next.one("transitionend webkitTransitionEnd oTransitionEnd otransitionend", function () {
				console.log("Removing old element");
				// Remove the old .color element after transitioned
				$current.remove();

				// Remove the extra classes from the next element
				// TODO: Necessary?
				$next.removeClass('next')
					 .removeClass('transition');
			});

			$next.addClass("next");

			// Add the next color to this view
			this.$el.append($next);

			// Kick off the transition after a wait so the .next class is applied
			_.defer(function () {
				$next.addClass("transition");
			});
		}
	});

	BoxesView = Backbone.View.extend({
		el: "#boxes",

		initialize: function () {
			// A collection of box models auto generated
			this.collection = new Backbone.Collection([
				new BoxModel({color: colorMap[0]}),
				new BoxModel({color: colorMap[1]}),
				new BoxModel({color: colorMap[2]}),
				new BoxModel({color: colorMap[3]})
			]);

			// Auto render for simplicity
			this.render();
		},

		render: function () {
			var self = this;
			
			this.boxes = this.collection.map(function (model) {
				var randDelay = Math.floor((Math.random() * 2000)),
					// Instantiate and render the box view
					view = new BoxView({model: model}).render();

				// Start the color changing after a random delay
				setTimeout(function () {
					model.startChanging();
				}, randDelay);

				// Append the box view to our boxes container
				self.$el.append(view.$el);

				return view;
			});

			return this;
		}
	});

	return BoxesView;
});