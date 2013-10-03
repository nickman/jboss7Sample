/** **************** Application JS ****************** */

/* Common variables for third party plugins */
// Google Analytics
var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-29404929-1' ]);
_gaq.push(['_setCustomVar', 1, 'AppType', 'Desktop', 3 ]);
_gaq.push([ '_trackPageview' ]);
// ShareThis
var switchTo5x = true;

$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = "slide";
});

/* Configuration of localStorage usage */
localStorageInfo = {
	onMobileKey : "planet.onMobile",
	navigationSearchUrls : "planet.navigation.search.urls",

	/* Checks if local storage is supported */
	isSupported : function() {
		return Modernizr.localstorage;
	}
};

/**
 * Main application
 */
planet = {
	onMobileFlag : null,
	// resourcesPrefix : "http://goomba.mw.lab.eng.bos.redhat.com/themes/jbossorg-sbs-theme-stk/common_header/",
	resourcesPrefix : "/templates/",

	/* Checks if user is on mobile or not. Can be overridden by flag in local storage */
	onMobile : function() {
		if (planet.onMobileFlag == null) {
			if (localStorageInfo.isSupported()) {
				planet.onMobileFlag = (localStorage[localStorageInfo.onMobileKey] == "true");
			} else {
				planet.onMobileFlag = Modernizr.touch;
			}
		}

		return planet.onMobileFlag;
	},

	/* Function to load all resources based on user is on mobile or not */
	loadAllResources : function() {
		if (planet.onMobile()) {
			// remove CSS files just in case that are loaded on mobile
			css1 = document.getElementById("scss1");
			css1.parentNode.removeChild(css1);
			css2 = document.getElementById("scss2");
			css2.parentNode.removeChild(css2);
			css3 = document.getElementById("scss3");
			css3.parentNode.removeChild(css3);
		}

		yepnope([ {
			test : planet.onMobile(),
			yep : {
				"jqmcss" : "/resources/css/jquery.mobile-1.1.0.min.css",
				"mcss" : planet.resourcesPrefix + "theme/css/planet/planetmobile.css"
			},
			nope : {
				"searchjs" : planet.resourcesPrefix + "theme/js/magnolia/search.js",
				"tabzillajs" : planet.resourcesPrefix + "theme/js/tabzilla.js"
			},
			callback : {
				"mcss" : function(url, result, key) {
					planet.mobileInit();
					yepnope.injectJs("/resources/js/jquery.mobile-1.1.0.min.js");
				},
				"tabzillajs" : function(url, result, key) {
					$(document).ready(function() {
						if (typeof appLoadedOnDesktop == "function") {
							appLoadedOnDesktop();
						}
					});

					if (typeof showShareThis != "undefined" && showShareThis) {
						yepnope.injectJs(document.location.protocol + "//w.sharethis.com/button/buttons.js", function() {
							stLight.options({
								publisher : "0c0850b9-23f0-4286-b05a-7593cc190675"
							});
						});
					}
				}
			},
			complete : planet.initAfterResourcesLoaded
		} ]);

		var ga = document.createElement('script');
		ga.type = 'text/javascript';
		ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(ga, s);
	},

	initAfterResourcesLoaded : function() {
		$(window).bind('storage', function(e) {
			if (e.originalEvent.key == localStorageInfo.onMobileKey) {
				planet.refreshPage();
			}
		});
	},

	/* Refresh entire page */
	refreshPage : function() {
		window.location.href = window.location.href;
	},

	canRetrieveNewPosts : true,

	/* Global method for retrieving new posts */
	retrieveNewPosts : function(currentFrom, count, callback, feedName) {
		planet.canRetrieveNewPosts = false;
		var url = "/rest/recent-posts?from=" + currentFrom + "&count=" + count;
		if (typeof feedName != "undefined") {
			url += "&feedName=" + feedName;
		}

		$.ajax({
			url : url,
			type : "get",
			dataType : 'json',
			success : function(data) {
				// must be before callback because it can turn off retrieving new posts in case of "no more posts"
				planet.canRetrieveNewPosts = true;
				callback(data);
			}
		});
	},

	/* Do mobile initialization */
	mobileInit : function() {
		// Google Analytics
		$('[data-role=page]').live('pageshow', function(event, ui) {
			try {
				_gaq.push([ '_setAccount', 'UA-29404929-1' ]);
				_gaq.push(['_setCustomVar', 1, 'AppType', 'Mobile', 3 ]);
				hash = location.hash;
				if (hash) {
					_gaq.push([ '_trackPageview', hash.substr(1) ]);
				} else {
					_gaq.push([ '_trackPageview' ]);
				}
			} catch (err) {

			}

		});

		$("#page-id-home").live('pageshow', function() {
			home.init($(this));
		});
		$("#page-id-home").live('pagebeforehide', home.destroy);
		$("#page-id-browse").live('pagebeforecreate', function() {
			browse.displaySwitchDisplay($(this));
		});

		if (typeof mobilePageInit == "function") {
			mobilePageInit();
		}
	},
};

planet.loadAllResources();

/**
 * Logic for navigation in browser
 */
navigation = {
	changePage : function(url, options) {
		if (planet.onMobile()) {
			$.mobile.changePage(url, options);
		} else {
			$(location).attr('href', url);
		}
	},

	getSearchUrls : function() {
		if (localStorageInfo.isSupported()) {
			if (localStorage[localStorageInfo.navigationSearchUrls] == null) {
				return null;
			} else {
				return JSON.parse(localStorage[localStorageInfo.navigationSearchUrls]).urls;
			}
		} else {
			return null;
		}
	},

	setSearchUrls : function(u) {
		if (localStorageInfo.isSupported()) {
			var urls = {
				"urls" : u
			};
			localStorage[localStorageInfo.navigationSearchUrls] = JSON.stringify(urls);
		}
	},
	appendSearchUrl : function(url) {
		var fromCache = navigation.getSearchUrls();
		if (fromCache != null) {
			fromCache.push(url);
			navigation.setSearchUrls(fromCache);
		}
	},
	clearSearchUrls : function() {
		navigation.setSearchUrls([]);
	},

	isLast : function(url) {

	},

	setSearchUrlsFromLinks : function(links) {
		array = [];
		$.each(links, function(i) {
			array.push($(links[i]).attr('href'));
		});
		navigation.setSearchUrls(array);
	},

	currentUrl : null,

	getNextUrl : function() {
		var currentPath = window.location.pathname;
		if (navigation.currentUrl != null) {
			currentPath = navigation.currentUrl;
		}
		var searchUrls = navigation.getSearchUrls();
		var index = $.inArray(currentPath, searchUrls);
		if (index >= 0 && index < searchUrls.length) {
			return searchUrls[index + 1];
		} else {
			return null;
		}
	},

	next : function() {
		var url = navigation.getNextUrl();
		if (url == null) {
			return;
		}
		navigation.changePage(url, {
			showLoadMsg : false
		});
	},

	getPreviousUrl : function() {
		var currentPath = window.location.pathname;
		if (navigation.currentUrl != null) {
			currentPath = navigation.currentUrl;
		}
		var searchUrls = navigation.getSearchUrls();
		var index = $.inArray(currentPath, searchUrls);
		if (index >= 1) {
			return searchUrls[index - 1];
		} else {
			return null;
		}
	},

	previous : function() {
		var url = navigation.getPreviousUrl();
		if (url == null) {
			return;
		}
		navigation.changePage(url, {
			reverse : true,
			showLoadMsg : false
		});
	}

};

/**
 * Logic for page 'home'
 */
home = {
	data : {
		currentFrom : 10,
		count : 10
	},
	currentPage : null,
	previewDiv : null,
	previewDivInitialPosition : null,
	init : function(page) {
		home.currentPage = page;
		planet.canRetrieveNewPosts = true;
		home.previewDiv = $("#home-right-preview", page);

		$(window)
				.scroll(
						function() {
							if (home.previewDivInitialPosition == null && $(this).scrollTop() > 0) {
								home.previewDivInitialPosition = home.previewDiv.offset();
							}
							if (planet.canRetrieveNewPosts) {
								if (($(window).height() + $(window).scrollTop()) >= ($("#home-left-panel", home.currentPage).offset().top + $(
										"#home-left-panel", home.currentPage).height())) {
									$("#loading-div-home", home.currentPage).show();
									planet.retrieveNewPosts(home.data.currentFrom, home.data.count, home.addPosts);
								}
							}
							if ($(this).scrollTop() > 0 && ($(this).scrollTop() > (home.previewDivInitialPosition.top - 48))) {
								if (home.previewDiv.css("position") != "fixed") {
									home.previewDiv.css({
										"top" : 48,
										"position" : "fixed"
									});
								}
							} else {
								if (home.previewDiv.css("position") != "absolute") {
									home.previewDiv.css({
										"top" : home.previewDivInitialPosition.top,
										"position" : "absolute"
									});
								}
							}
						});

		var ul = $("#home-posts-ul", home.currentPage);
		var links = $("a", ul);
		links.unbind('click');
		links.bind("click", function(event) {
			return home.showPreview($(this).attr("data-url"));
		});
		navigation.setSearchUrlsFromLinks($("a", "#home-posts-ul"));

		if (planet.onMobile()) {
			page.unbind('swipeleft');
			page.swipeleft(function() {
				if (home.previewDiv.css("display") == "block") {
					var url = navigation.getNextUrl();
					if (url != null) {
						home.showPreview(url);
					}
				}
			});
			page.unbind('swiperight');
			page.swiperight(function() {
				if (home.previewDiv.css("display") == "block") {
					var url = navigation.getPreviousUrl();
					if (url != null) {
						home.showPreview(url);
					}
				}
			});
		}

	},
	showPreview : function(postURL) {
		if (typeof postURL == "undefined") {
			return false;
		}
		if (home.previewDiv.css("display") == "block") {
			if (planet.onMobile()) {
				if (navigation.currentUrl != null) {
					var prevTitleAsId = navigation.currentUrl.substring(6);
					var prevTitleElm = $("#home-post-li-" + prevTitleAsId, home.currentPage);
					prevTitleElm.removeClass("ui-btn-active ui-btn-up-b");
					prevTitleElm.addClass("ui-btn-up-c");
				}

				var titleAsId = postURL.substring(6);
				var titleElm = $("#home-post-li-" + titleAsId, home.currentPage);
				titleElm.removeClass("ui-btn-up-c");
				titleElm.addClass("ui-btn-active ui-btn-up-b");

				$("#home-posts-ul", home.currentPage).listview('refresh');
			}

			home.previewDiv.css("max-height", $(window).height() - 75);
			var url = "/rest/entity?path=" + postURL;
			var loadingPreviewDiv = $("#loading-div-home-preview", home.previewDiv);
			$("#home-right-preview-content", home.previewDiv).empty();
			$("#home-right-preview-title", home.previewDiv).empty();
			loadingPreviewDiv.show();

			// Retrieve post server JSON
			$.getJSON(url, function(data) {
				$("#loading-div-home-preview", home.previewDiv).hide();
				$("#home-right-preview-content", home.previewDiv).append(data.body);
				$("#home-right-preview-title", home.previewDiv).append(
						"<a href='" + postURL + "' class='ui-link-inherit'>" + data.title + "</a>");
				$("#home-right-preview-title", home.previewDiv).show();
			});

			navigation.currentUrl = postURL;
			return false;
		} else {
			return true;
		}
	},
	addPosts : function(data) {
		var postsList = $("#home-posts-ul", home.currentPage);
		size = 0;
		$.each(data, function(key, val) {
			var post = '<li id="home-post-li-' + val.titleAsId + '"><a href="' + val.url + '" data-url="' + val.url
					+ '"><img src="' + val.avatarLink + '" class="ui-li-thumb" height="46px" width="46px"/>'
					+ '<h2 class="ui-li-heading">' + val.title + '</h2>'
					+ '<p class="ui-li-desc"><span class="blog-post-list-date">' + val.published + ', by ' + val.author
					+ '</span><br/>' + val.desc + '</p></a></li>';
			postsList.append(post);
			navigation.appendSearchUrl(val.url);
			size++;
		});
		var links = $("a", postsList);
		links.unbind('click');
		links.bind("click", function() {
			return home.showPreview($(this).attr('data-url'));
		});
		$("#loading-div-home", home.currentPage).hide();

		if (size == 0 || size != home.data.count) {
			postsList.append('<li><h2 class="ui-li-heading"><center>No More Posts</center></h2></li>');
			planet.canRetrieveNewPosts = false;
		}
		home.data.currentFrom = home.data.currentFrom + size;
		if (planet.onMobile()) {
			postsList.listview("refresh");
		}
	},
	refresh : function() {
		home.data.currentFrom = 0;
		$("#home-posts-ul").empty();
		$("#loading-div-home").show();
		navigation.clearSearchUrls();
		planet.retrieveNewPosts(home.data.currentFrom, home.data.count, home.addPosts);
	},
	destroy : function() {
		$(window).unbind("scroll");
	}
};

browse = {
	displaySwitchDisplay : function(source) {
		switchLi = $("#browse-switch-display", source);
		if (localStorageInfo.isSupported()) {
			var linkText = "Switch to mobile application";
			if (planet.onMobile()) {
				linkText = "Switch to standard display";
			}
			switchLi.find("a").text(linkText);
			switchLi.find("a").click(browse.switchDisplay);
			switchLi.show();
		} else {
			switchLi.remove();
		}
	},
	/* Switch to mobile or to desktop view */
	switchDisplay : function() {
		if (localStorageInfo.isSupported()) {
			newValue = (localStorage[localStorageInfo.onMobileKey] == "true") ? "false" : "true";
			localStorage[localStorageInfo.onMobileKey] = newValue;
			planet.refreshPage();
		}
		return false;
	}
};

/**
 * Logic for page 'feed'
 */
feed = {
	/* Data holder for count, name etc. */
	data : null,

	init : function(feedData) {
		planet.canRetrieveNewPosts = true;
		feed.data = feedData;

		$(window).scroll(function() {
			if (planet.canRetrieveNewPosts) {
				if ($(window).scrollTop() >= ($(document).height() - $(window).height() - 5)) {
					$("#" + feed.data.loadingDivId).show();
					planet.retrieveNewPosts(feed.data.currentFrom, feed.data.count, feed.addPosts, feed.data.name);
				}
			}
		});
		navigation.setSearchUrlsFromLinks($("a", feed.data.postsList));
	},
	addPosts : function(data) {
		var postsList = feed.data.postsList;
		size = 0;
		$.each(data, function(key, val) {
			var post = '<li><a href="' + val.url + '"><h2 class="ui-li-heading">' + val.title + '</h2>'
					+ '<p class="ui-li-desc"><span class="blog-post-list-date">' + val.published + ', by ' + val.author
					+ '</span><br/>' + val.desc + '</p></a></li>';
			postsList.append(post);
			navigation.appendSearchUrl(val.url);
			size++;
		});
		$("#" + feed.data.loadingDivId).hide();
		if (size == 0 || size != feed.data.count) {
			postsList.append('<li><h2 class="ui-li-heading"><center>No More Posts</center></h2></li>');
			planet.canRetrieveNewPosts = false;
		}
		feed.data.currentFrom = feed.data.currentFrom + size;
		if (planet.onMobile()) {
			postsList.listview("refresh");
		}
	},
	destroy : function() {
		$(window).unbind("scroll");
	}
};

/**
 * Post page logic
 */
post = {
	init : function(page) {
		// reset navigation and force retrieving URL from browser
		navigation.currentUrl = null;

		var prevLink = $("#post-prev", page);
		var nextLink = $("#post-next", page);
		if (navigation.getPreviousUrl() == null && navigation.getNextUrl() == null) {
			prevLink.hide();
			nextLink.hide();
			return;
		} else {
			prevLink.show();
			nextLink.show();
		}
		if (navigation.getPreviousUrl() == null) {
			prevLink.addClass('ui-disabled');
		} else {
			if ($.mobile) {
				// disabled - it makes troubles to rendered next URLo
				// $.mobile.loadPage(navigation.getPreviousUrl());
			}
		}

		if (navigation.getNextUrl() == null) {
			nextLink.addClass('ui-disabled');
		} else {
			if ($.mobile) {
				$.mobile.loadPage(navigation.getNextUrl());
			}
		}

		prevLink.unbind('click');
		prevLink.click(function() {
			navigation.previous();
			return false;
		});
		nextLink.unbind('click');
		nextLink.click(function() {
			navigation.next();
			return false;
		});
		if (planet.onMobile()) {
			page.unbind('swipeleft');
			page.bind('swipeleft', function() {
				navigation.next();
			});
			page.unbind('swiperight');
			page.bind('swiperight', function() {
				navigation.previous();
			});
		}
	}
};

/**
 * Logic for page 'search'
 */
searchpage = {
	submit : function(form) {
		var query = $("#query", form);
		var url = "/search/search.seam?query=" + query.val();
		navigation.changePage(url);
		return false;
	}
};
