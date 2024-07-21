// BETA
// Needs cleaning

// TODO limit comment depth

$(function() {

	const END_POINT = "/addons/comments/zcomments.php";
	const POST_KEY = $("#pk").val();
	
	if(!POST_KEY)
	{
		var posts = [];
		$(".comment-count").each(function(i){
			var id = parseInt($(this).attr("id").substring(7));
			posts.push(id);
		});
		
		if(posts.length)
		{
			var jqXHR = $.get({
				url: END_POINT,
				timeout: 20000,
				data: { "pk": posts, "counts": 1 },
				dataType: "json",
				success: function(data, textStatus, jqXHR){
					$.each(data, function(index, value) {
						if(value)
							$("#ccount-" + index + " > a").text(value + " Comments");
						else
							$("#ccount-" + index + " > a").text("Leave a comment");
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {

				}
			});
		}
	
		return;
	}

	var sendingComment = false;
	var sendingSubs = false;
	var commentPage = 0;
	
	var pageBasePath = $(location).attr("pathname");// + "/comment-page-2/";
	var c = pageBasePath.indexOf("/comment-page-");
	if(c >= 0)
		pageBasePath = pageBasePath.substring(0, c + 1);

	var commentHash = $(location).attr("hash").match(/#comment-([0-9]+)/);
	commentHash = (commentHash != null) ? commentHash[1] : 0;

	var cpage = $(location).attr("pathname").match(/\/comment-page-([0-9]+)\//);
	if(cpage != null)
		commentPage = cpage[1];
	else
	{
		cpage = $(location).attr("search").match(/cpage=([0-9]+)/);
		if(cpage != null)
			commentPage = cpage[1];

		// https://stackoverflow.com/questions/824349/how-do-i-modify-the-url-without-reloading-the-page
		if(history && history.replaceState)
		{
			var url = pageBasePath + "comment-page-" + commentPage + "/" + $(location).attr("hash");
			//history.replaceState(null, "", url); // TODO
		}
			
		/*if (history && history.replaceState && location.search)
		{
			var params = location.search.slice(1).split('&');
			var newParams = params.filter(paramIsNotUtm);
			if (newParams.length < params.length)
			{
				var search = newParams.length ? '?' + newParams.join('&') : '';
				var url = location.pathname + search + location.hash;
				history.replaceState(null, null, url);
			}
		}*/
	}

	// Fix this...
	var s = $("#subscribe");
	s.change(function() {
		$(this).prev().removeClass();
		if(this.checked)
			$(this).prev().addClass("fas fa-check-circle checked");
		else
			$(this).prev().addClass("far fa-circle");
	});
	s.parent().click(function() {
		s.prop("checked", !s.prop("checked"));
		s.trigger("change");
	});

	$("#commentform").submit(function(event){
		event.preventDefault();
		
		if(sendingComment)
			return;
		sendingComment = true;
		
		var sendStatus = $("#sendstatus");
		var btn = $("#submit");
		var form = $(this);

		var btnText = btn.val();

		sendStatus.empty();
		sendStatus.removeClass();
		btn.val("Please wait...");

		var values = {};
		$.each(form.serializeArray(), function(i, field){
			values[field.name] = field.value;
		});
		var json = JSON.stringify(values);

		form.find(":input").prop("disabled", true);

		var jqXHR = $.ajax({
			type: "POST",
			timeout: 20000,
			url: END_POINT,
			//headers:{
			//	'Access-Control-Allow-Origin': 'http://server'
			//},
			dataType: "json",
			contentType : "application/json",
			data: json,
			success: function(data, textStatus, jqXHR){
				
				if(!Array.isArray(data) || data.length < 2)
					data = [false, "Bad response format"];

				if(data[0])
				{
					sendStatus.text(data[1]);
					sendStatus.addClass("text-success");
					//form.trigger("reset");
					form.find("textarea").val("");
				}
				else
				{
					sendStatus.text("An error occured: " + data[1]);
					sendStatus.addClass("text-danger");
				}
				
				btn.val(btnText);
				form.find(":input").prop("disabled", false);
				sendingComment = false;
			},
			error: function(jqXHR, textStatus, errorThrown){
				btn.val(btnText);
				sendStatus.text("An error occured: " + textStatus + " " + errorThrown);
				sendStatus.addClass("text-danger");
				form.find(":input").prop("disabled", false);
				sendingComment = false;
			}
		});
	});


	$("#subscribeform").submit(function(event){
		event.preventDefault();
		
		if(sendingSubs)
			return;
		sendingSubs = true;
		
		var sendStatus = $("#subs_sendstatus");
		var btn = $("#subs_submit");
		var form = $(this);

		var btnText = btn.val();

		sendStatus.empty();
		sendStatus.removeClass();
		btn.val("Please wait...");

		var values = {};
		$.each(form.serializeArray(), function(i, field){
			values[field.name] = field.value;
		});
		var json = JSON.stringify(values);

		form.find(":input").prop("disabled", true);

		var jqXHR = $.ajax({
			type: "POST",
			timeout: 20000,
			url: END_POINT,
			//headers:{
			//	'Access-Control-Allow-Origin': 'http://server'
			//},
			dataType: "json",
			contentType : "application/json",
			data: json,
			success: function(data, textStatus, jqXHR){
				
				if(!Array.isArray(data) || data.length < 2)
					data = [false, "Bad response format"];

				if(data[0])
				{
					sendStatus.text(data[1]);
					sendStatus.addClass("text-success");
					form.trigger("reset");
				}
				else
				{
					sendStatus.text("An error occured: " + data[1]);
					sendStatus.addClass("text-danger");
				}
				
				btn.val(btnText);
				form.find(":input").prop("disabled", false);
				sendingSubs = false;
			},
			error: function(jqXHR, textStatus, errorThrown){
				btn.val(btnText);
				sendStatus.text("An error occured: " + textStatus + " " + errorThrown);
				sendStatus.addClass("text-danger");
				form.find(":input").prop("disabled", false);
				sendingSubs = false;
			}
		});
	});
	
	$("#cancel-comment-reply-link").click(function(e){
		e.preventDefault();
		
		var sendStatus = $("#sendstatus");
		sendStatus.empty();
		sendStatus.removeClass();

		$("#respond").appendTo($("#reply_container"));
		$("#reply_to").val("0");
		$(this).hide();
	});

	loadCommentsPage(commentPage, commentHash, commentHash, 1);
	
	var pageHelper = function(i){
		return function(e){
			e.preventDefault();
			$("#cancel-comment-reply-link").trigger("click");
			loadCommentsPage(i, true, 0, 2);
		}
	};

	function makePagesList(pageCount, page)
	{
		page = parseInt(page);
		if(isNaN(page) || page == 0)
			page = pageCount;

		// Previous page
		var prev = $("<li>");
		if(page <= 1)
		{
			prev.addClass("disabled");
			prev.append($("<span>", {
					class: "prev page-numbers",
					text: "« Prev"
				})
			);
		}
		else
		{
			prev.append($("<a>", {
					class: "prev page-numbers",
					href: pageBasePath + "comment-page-" + (page - 1) + "/",
					click: pageHelper(page - 1),
					text: "« Prev"
				})
			);
		}

		// Next page
		var next = $("<li>");
		if(page >= pageCount)
		{
			next.addClass("disabled");
			next.append($("<span>", {
					class: "next page-numbers",
					text: "Next »"
				})
			);
		}
		else
		{
			next.append($("<a>", {
					class: "next page-numbers",
					href: pageBasePath + "comment-page-" + (page + 1) + "/",
					click: pageHelper(page + 1),
					text: "Next »"
				})
			);
		}

		var pages = $("<ul>", {
			class: "pagination"
		});
		pages.append(prev);
		for(var i=0;i<pageCount;i++)
		{
			var num = i + 1;
			
			var p = $("<li>", {
				class: "page-numbers"
			});
			var a = $("<a>", {
				class: "",
				href: pageBasePath + "comment-page-" + num + "/",
				click: pageHelper(num),
				text: num
			});
			if(num == page)
				p.addClass("active");
			pages.append(p.append(a));
		}
		pages.append(next);
		
		$("#pages_container").html(pages);
	}
	
	function renderComments(data, page)
	{
		var main = $("<ol>", {
			class: "clearfix comments-list"
		});

		function genComment(data, depth)
		{
			var item = $("<li>", {
				id: "comment-" + data.id,
				class: "comment depth-" + depth
			});

			if(data.post_author)
				item.addClass("bypostauthor");
			
			if(depth % 2)
				item.addClass("even");
			else
				item.addClass("odd");




			var avatar = $("<li>", {
				class: "comment-avatar"
			});
			avatar.append($("<img>", {
					class: "avatar avatar-50 photo",
					src: "https://www.gravatar.com/avatar/" + data.email + "?s=50&d=retro&r=pg",
					srcset: "https://www.gravatar.com/avatar/" + data.email + "?s=100&d=retro&r=pg 2x",
					alt: "Avatar",
					loading: "lazy",
					width: "50",
					height: "50"
				})
			);

			var attr = $("<li>", {
				class: "comment-attr"
			});
			attr.append($("<span>", {
					text: data.name,
					class: "comment-author"
				})
			);
			attr.append(" on ");
			attr.append($("<span>", {
					text: new Date(Date.parse(data.date)).toLocaleString("default", { year: "numeric", month: "long", day: "numeric" }),
					class: "comment-date"
				})
			);
			attr.append("<br />");
			if(data.post_author)
			{
				attr.append($("<span>", {
						text: "Author",
						class: "label label-primary author-cred"
					})
				);
			}
			
			var commlink = $("<li>", {
				class: "single-comment-link"
			});
			commlink.append($("<a>", {
					href: "#comment-" + data.id,
					text: "#"
				})
			);
			
			var reply = $("<li>", {
				class: "comment-reply"
			});
			reply.append($("<a>", {
					//href: "?replytocom=" + data.id + "#respond",
					href: "#",
					text: "Reply",
					class: "btn btn-xs comment-reply-link",
					rel: "nofollow"
				}).click(function(event){
					event.preventDefault();
					
					$("#respond").appendTo(content);
					$("#reply_to").val(data.id);
					$("#cancel-comment-reply-link").show();
					
					$([document.documentElement, document.body]).animate({
						scrollTop: $("#respond").offset().top
					}, 500);
				})
			);

			var header = $("<ul>", {
				class: "comment-meta"
			});
			header.append(avatar);
			header.append(" ");
			header.append(attr);
			header.append(" ");
			header.append(commlink);
			header.append(" ");
			header.append(reply);
			
			
			var wrapper = $("<div>", {
				class: "comment-wrap col-md-12"
			}).append(header);

			var content = $("<div>", {
				class: "comment-entry"
			}).append($("<p>", {
				html: data.content
			}));

			var row = $("<div>", {
				class: "row"
			}).append(wrapper.append(content));

			var comment = item.append(row);
			
			// Add replies
			if(Object.keys(data.replies).length)
			{
				var children = $("<ol>", {
					class: "children"
				});
				
				$.each(data.replies, function(index, value) {
					children.append(genComment(value, depth + 1));
				});

				comment.append(children);
			}

			return comment;
		}
		
		$.each(data.comments, function(index, value) {
			main.append(genComment(value, 1));
		});

		$("#comments_container").html(main);
		$("#comments_count").text(data.total + " Comments");
		

		makePagesList(data.pages, page);
	}
	
	function loadCommentsPage(page, scrollToComments, scrollToCommentId, doHistory)
	{
		// TODO what if page click while still loading comments?
		
		$("#comments_container").removeClass();
		$("#comments_container").text("Loading comments...");
		
		if(scrollToComments)
		{
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#comments_count").offset().top
			}, 500);
		}
		
		// TODO (fixed now) click on page number (/comment-page-X/), then click back to no /comment-page-X/, does not load page 0

		if(doHistory > 0 && history && history.pushState)
		{
			var url = pageBasePath;
			if(doHistory == 2)
			{
				url += "comment-page-" + page + "/";
				window.history.pushState({page: page}, "", url);
			}
			else if(doHistory == 1)
				window.history.replaceState({page: page}, "");
		}

		var jqXHR = $.get({
			url: END_POINT,
			timeout: 20000,
			data: {
				pk: POST_KEY,
				page: page
			},
			dataType: "json",
			success: function(data, textStatus, jqXHR){
				renderComments(data, page);

				if(scrollToCommentId)
				{
					var elem = $("#comment-" + scrollToCommentId);
					if(elem.length)
					{
						$([document.documentElement, document.body]).animate({
							scrollTop: $("#comment-" + scrollToCommentId).offset().top
						}, 500);
					}
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
				$("#comments_container").text("An error occured: " + textStatus + " " + errorThrown);
				$("#comments_container").addClass("text-danger");
			}
		});
	}

	window.addEventListener("popstate", function(e){
		if(e.state)
			loadCommentsPage(e.state.page, true, 0, 0);
	});
});
