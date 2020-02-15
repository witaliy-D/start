/* eslint-env jquery*/

const slider = $('#slider');

slider.slick({
	arrows: false,
	dots: true,
	speed: 800,
	slidesToShow: 2,
	slidesToScroll: 2
});

$('#slider-arrow-prev').on('click', function (event) {
	event.preventDefault();

	slider.slick('slickPrev');
});

$('#slider-arrow-next').on('click', function (event) {
	event.preventDefault();

	slider.slick('slickNext');
});
