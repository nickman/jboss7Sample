// Search functionality that redirect search request to either SBS search or Google (site:) search.

var _srch = window.search = {};

_srch.context = [
	{ // community
		description: "Search the Community",
		url: "http://community.jboss.org/search.jspa?"
	},
	{ // project
		description: "Search Project Pages",
		url: "http://www.google.com/search?as_sitesearch=jboss.org"
	}
];

// default configuration
_srch.disappearDelay = 250;
_srch.hideMenuOnClick = true;
_srch.selectedContext = 0;
_srch.initialized = false;

_srch.init = function () {

    var searchBar = jQuery("#searchbar");
    if (searchBar.length == 0) {
        // can not initialize now, #searchbar is not available yet
        return;
    }
    if (_srch.initialized) {
	// can be called only once
	return;
    }

    var innerMenuContent =
        // Adding class="selected" to one <html  xmlns="http://www.w3.org/1999/xhtml"><head></head><a> tag makes this options
        // visually selected by default. Even if there is not selected any option by default
        // there is a default option where the search request will be sent to though.
        // We want by deault not to show the search scope description in the search box.
        "<div><a href='#' context='0'>"+_srch.context[0].description+"</a></div>" +
        "<div><a href='#' context='1'>"+_srch.context[1].description+"</a></div>";

    var searchButton = jQuery("#searchGo");
    var dropDownMenu = jQuery("#dropmenudiv");
    if (dropDownMenu.length == 0) {
        var htmlContent = "<div id='dropmenudiv' style='display: none; position: absolute; left: 0px; top: 0px;' />";
        jQuery('body').prepend(htmlContent);
        dropDownMenu = jQuery("#dropmenudiv");
    }

    // we must define some handlers upfront
    var leaveSearchBarHandler = function (searchBar, dropDownMenu) {
        var text = searchBar.val();
        if (text == undefined || text == "" || equalsAnyDescription(text)) {
            text = dropDownMenu.find('a.selected').text();
            searchBar.val(text);
        }
    };

    var enterSearchBarHandler = function(searchBar, dropDownMenu) {
        var text = searchBar.val();
        if (equalsAnyDescription(text)) {
            searchBar.val("");
        }
    };

    // Returns true is given text equals to description of any search context.
    var equalsAnyDescription = function (text) {
        if (text != undefined) {
            for (var i = 0; i < _srch.context.length; i++) {
                if (text == _srch.context[i].description) {
                    return true;
                }
            }
        }
        return false;
    };

    // @param menu          html element to hide (must be wrapped by jQuery)
    // @param attributes    [optional] json with top, height, left and width properties
    var showDropDownMenu = function (menu, attributes) {
        if (menu) {
            if (attributes) {
                menu.css('top', attributes.top + attributes.height);
                menu.css('left', attributes.left);
                menu.css('width', attributes.width - menu.css('padding-left').replace(/\D+/,"") - menu.css('padding-right').replace(/\D+/,""));
            }
            menu.stop(true, true).show();
        }
    };

    // @param menu      html element to hide (must be wrapped by jQuery)
    // @param delay     [optional] hide delay (default to 250)
    var hideDropDownMenu = function (menu, delay) {
        if (menu) {
            menu.delay(delay != undefined ? delay : _srch.disappearDelay).fadeOut(100);
        }
    };

    // Retrieves the following properties from given element (must be wrapped by jQuery): top, left, height
    // Returns simple JSON [defaults to] {top: 0, left: 0, height: 10, width: 150}
    // @param element
    var getPositionAttributes = function (element) {
        var attr = { top: 0, left: 0, height: 10, width: 150 };
        if (element) {
            attr.height = element.outerHeight();
            var offset = element.offset();
            attr.top = offset.top;
            attr.left = offset.left;
            attr.width = element.outerWidth();
        }
        return attr;
    };

    var executeSearch = function (query) {
        window.location.href = _srch.context[_srch.selectedContext].url + "&q=" + query;
    };

    var catchEnter = function (event){
        if (event.keyCode == '13') {
            event.preventDefault();
            executeSearch(searchBar.val());
        }
    };

    dropDownMenu.html(innerMenuContent);

    // bind click events on menu items
    dropDownMenu.find('a').click(
        function(e) {
            dropDownMenu.find('a').removeClass('selected');
            var target = jQuery(e.target || e.srcElement);
            _srch.selectedContext = parseInt(target.attr('context'),10);
            target.addClass('selected');
            hideDropDownMenu(dropDownMenu, 0);
            leaveSearchBarHandler(searchBar, dropDownMenu);
            return false;
        }
    );

    // call this function to setup default text into search bar
    leaveSearchBarHandler(searchBar, dropDownMenu);

    // setup width of dropdown menu according to searchbar
    dropDownMenu.css('width', searchBar.outerWidth());

    searchBar.unbind(); // remove onmouseover initializetion if any...

    searchBar.keydown(function(e) { catchEnter(e) });
    searchBar.blur(function() { leaveSearchBarHandler(searchBar, dropDownMenu) });
    searchBar.focus(function() { enterSearchBarHandler(searchBar, dropDownMenu) });

    searchBar.hover(
        function() { showDropDownMenu(dropDownMenu, getPositionAttributes(searchBar)) },
        function() { hideDropDownMenu(dropDownMenu) });

    dropDownMenu.hover(
        function() { showDropDownMenu(dropDownMenu, getPositionAttributes(searchBar)) },
        function() { hideDropDownMenu(dropDownMenu) }
    );

    searchButton.click(function() { executeSearch(searchBar.val()) });

    // this functionality was in original code, may be it can be useful for tablet users
    if (_srch.hideMenuOnClick == true) { document.onclick = function() { hideDropDownMenu(dropDownMenu); } }
   
    _srch.initialized = true;
};

jQuery(document).ready( _srch.init );

// Since the #searchbar may not ba available in DOM when the _srch.init is called in document.ready()
// we also need an option to initialize it later.
var initializeSearchBar = function() {
    _srch.init();
};