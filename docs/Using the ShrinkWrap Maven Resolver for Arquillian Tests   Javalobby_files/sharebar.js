/*
 *  ShareBar - Creates a dynamic, vertical sharing bar to the left of a WordPress post and hides it if browser window is too small
 *  Copyright 2010 Monjurul Dolon, http://mdolon.com/
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://devgrow.com/sharebar
 */
jQuery.fn.sharebar = function(options) {
	var defaults = {horizontal: true, swidth: 65, minwidth: 1000, position: 'left', leftOffset: 20, rightOffset: 10};
	var opts = jQuery.extend(defaults, options); var o = jQuery.meta ? jQuery.extend({}, opts, jQueryjQuery.data()) : opts;

	var w = jQuery(window).width();
	var sharebar = jQuery('#sharebar');
	var sharebarx = jQuery('#sharebarx');
	var parent = sharebar.parent().width();
	var start = sharebar_init();

	function sharebar_init(){
		if (sharebar.offset() != undefined)  {
        sharebar.css('width',o.swidth+'px');
		if (o.position == 'left') sharebar.css('marginLeft',(0-o.swidth-o.leftOffset));
		else {
			sharebar.css('marginLeft',(parent+o.rightOffset));
		}
		if(w < o.minwidth && o.horizontal) sharebarx.slideDown();
		else sharebar.fadeIn();
		jQuery.event.add(window, "scroll", sharebar_scroll);
		jQuery.event.add(window, "resize", sharebar_resize);

        //sharebar.css('position', 'absolute');
        sharebar.css('top', jQuery("#article").offset().top + 'px');

        return sharebar.offset().top;
//        return jQuery("#article").offset().top;
		//return jQuery(sharebar).offset().top;
        }

        return 0;
	}

	function sharebar_resize() {
		var w = jQuery(window).width();
		if(w<o.minwidth){
			sharebar.fadeOut();
			if(o.horizontal) sharebarx.slideDown();
		}else{
			sharebar.fadeIn();
			if(o.horizontal) sharebarx.slideUp();
		}
	}
	function sharebar_scroll() {
		var p = jQuery(window).scrollTop();
		var w = jQuery(window).width();
		sharebar.css('position',((p+10)>start) ? 'fixed' : 'absolute');
		sharebar.css('top',((p+10)>start) ? '10px' : jQuery("#article").offset().top + "px");
	}

};