/*
	Spectral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly.
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

		// Header.
			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

			}

		// Before / After sliders.
			var initBeforeAfterSliders = function($scope) {
				$scope.find('[data-before-after]').each(function() {
				var $slider = $(this),
					$range = $slider.find('input[type="range"]'),
					isDragging = false;

				var updateSlider = function() {
					$slider.css('--position', $range.val() + '%');
				};

				var updateFromPoint = function(pageX) {
					var offset = $slider.offset().left,
						width = $slider.outerWidth(),
						value = ((pageX - offset) / width) * 100;

					value = Math.max(0, Math.min(100, value));
					$range.val(value);
					updateSlider();
				};

				$range.on('input change', updateSlider);

				$slider.on('mousedown', function(event) {
					isDragging = true;
					updateFromPoint(event.pageX);
				});

				$window.on('mousemove', function(event) {
					if (isDragging)
						updateFromPoint(event.pageX);
				});

				$window.on('mouseup', function() {
					isDragging = false;
				});

				$slider.on('touchstart touchmove', function(event) {
					var touch = event.originalEvent.touches[0];

					if (touch)
						updateFromPoint(touch.pageX);
				});

				updateSlider();
				});
			};

		// Project galleries.
			$('[data-gallery]').each(function() {
				var $gallery = $(this),
					$track = $gallery.find('[data-gallery-track]'),
					$dots = $gallery.find('.gallery-dots'),
					index = 0,
					$slides;

				var loadImage = function(url) {
					return new Promise(function(resolve, reject) {
						var image = new Image();
						image.onload = function() { resolve(url); };
						image.onerror = reject;
						image.src = url;
					});
				};

				var addSlide = function(number, before, after) {
					var $slide = $('<article class="gallery-slide"></article>'),
						$comparison = $('<div class="before-after-slider" data-before-after></div>');

					$comparison.append(
						$('<div class="before-after-image before-after-after"></div>')
							.append($('<img>').attr({src: after, alt: 'Travaux après rénovation - image ' + number}))
							.append('<span>Après</span>')
					);
					$comparison.append(
						$('<div class="before-after-image before-after-before"></div>')
							.append($('<img>').attr({src: before, alt: 'État avant travaux - image ' + number}))
							.append('<span>Avant</span>')
					);
					$comparison.append('<div class="before-after-divider" aria-hidden="true"><span></span></div>');
					$comparison.append('<input type="range" min="0" max="100" value="50" aria-label="Comparer la photo avant et après, image ' + number + '" />');
					$slide.append($comparison);
					$track.append($slide);
				};

				var loadSlides = function(number) {
					var before = 'images/slider/image ' + number + ' - before.jpeg',
						after = 'images/slider/image ' + number + ' - after.jpeg';

					return Promise.all([loadImage(before), loadImage(after)]).then(function() {
						addSlide(number, before, after);
						return loadSlides(number + 1);
					}).catch(function() {
						return number;
					});
				};

				loadSlides(1).then(function() {
					$slides = $gallery.find('.gallery-slide');
					if (!$slides.length)
						return;

					initBeforeAfterSliders($gallery);
					$gallery.find('.gallery-control-prev, .gallery-control-next').prop('disabled', $slides.length < 2);

					var showSlide = function(nextIndex) {
						index = (nextIndex + $slides.length) % $slides.length;
						$track.css('transform', 'translateX(' + (-index * 100) + '%)');
						$slides.removeClass('is-active').eq(index).addClass('is-active');
						$dots.find('button').removeClass('is-active').eq(index).addClass('is-active');
					};

					$slides.each(function(slideIndex) {
						var $dot = $('<button type="button"></button>');
						$dot.attr('aria-label', 'Afficher la réalisation ' + (slideIndex + 1));
						$dot.on('click', function() { showSlide(slideIndex); });
						$dots.append($dot);
					});

					$gallery.find('.gallery-control-prev').on('click', function() { showSlide(index - 1); });
					$gallery.find('.gallery-control-next').on('click', function() { showSlide(index + 1); });
					$gallery.attr('tabindex', '0').on('keydown', function(event) {
						if (event.key === 'ArrowLeft') showSlide(index - 1);
						if (event.key === 'ArrowRight') showSlide(index + 1);
					});
					showSlide(0);
				});
			});

			$('[data-legal-open]').on('click', function(event) {
				event.preventDefault();
				$('#legal-modal').removeAttr('hidden');
				$('body').addClass('is-legal-modal-visible');
				$('#legal-modal .legal-modal-close').trigger('focus');
			});

			$('[data-legal-close]').on('click', function() {
				$('#legal-modal').attr('hidden', true);
				$('body').removeClass('is-legal-modal-visible');
			});

			$(document).on('keydown', function(event) {
				if (event.key === 'Escape' && !$('#legal-modal').is('[hidden]'))
					$('[data-legal-close]').first().trigger('click');
			});

	})(jQuery);
