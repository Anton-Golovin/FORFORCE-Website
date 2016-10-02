function infinitiLoad() {
	if ($('.catalog-content .new-item').length > 0) {
		$(".content-wrapper > li").clone().appendTo('.new-item');
	} else {
		$(".load-inf-button").before('<ul class="new-item row"></ul>');
		$(".content-wrapper > li").clone().appendTo('.new-item');
	}
};