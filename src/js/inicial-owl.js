(function catalogViewed() {
	$(document).ready(function(){
		$(".owl-carousel").owlCarousel({
			nav:false,
			margin: 30,
			navText: [
			'<img class="img-responsive" src="dist/img/arrow.svg" alt="">',
			'<img class="img-responsive" src="dist/img/arrow.svg" alt="">'
			],
			responsive:{
				0:{
					items:1
				},
				380:{
					items:2
				},
				600:{
					items:3
				},
				1000:{
					items:4
				},
				1200:{
					items:5,
					nav:true
				}
			}
		});
	});
})();