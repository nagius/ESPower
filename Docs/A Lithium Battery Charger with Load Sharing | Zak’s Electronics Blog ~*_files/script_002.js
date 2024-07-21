
// BETA

$(function() {
/*
	if(document.referrer != null)
	{
		$.ajax({
			type: "POST",
			timeout: 2000,
			url: "?r=" + document.referrer,
			dataType: "json",
			contentType : "application/json",
			data: {},
			success: function(data, textStatus, jqXHR){

			},
			error: function(jqXHR, textStatus, errorThrown){

			}
		});
	}
*/

	$(".dropdown-link").click(function(event){
		event.preventDefault();
	});


// https://stackoverflow.com/questions/21561480/trigger-event-when-user-scroll-to-specific-element-with-jquery
/*
	$(window).scroll(function() {
		var hT = $(".pagination").offset().top;
		var hH = $(".pagination").outerHeight();
		var wH = $(window).height();
		var wS = $(this).scrollTop();
		if (wS > (hT+hH-wH))
		{
			var jqXHR = $.get({
				url: "",
				timeout: 5000,
				//dataType: "json",
				success: function(data, textStatus, jqXHR){
					var postElems = $(data).find("#post-list");
					if(!postElems)
						return;
					postElems.remove("script");
					// get comment counts
					$("#post-list").append(postElems.html());
				},
				error: function(jqXHR, textStatus, errorThrown) {

				}
			});
		}
	});
*/
});
