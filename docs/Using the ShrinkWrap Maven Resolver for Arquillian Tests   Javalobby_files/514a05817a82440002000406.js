window._pa = window._pa || {};
_pa.segments = [{"name":"All visitors","id":649205,"regex":".*"}];
_pa.conversions = [];
_pa.conversionEvents = [];
_pa.segmentEvents = [];
!function(){function e(e,a,n){if(null==n||isNaN(n))var t=_pa.pixelHost+"seg?t=2&add="+e;else var t=_pa.pixelHost+"seg?t=2&add="+e+":"+n;_pa.createImageTag("segments",e,t,a);var o=_pa.paRtbHost+"seg/?add="+e;_pa.createImageTag("paRtbSegments",e,o,a)}function a(e,a,n,t){var o=_pa.pixelHost+"px?t=2&id="+e;n=n||_pa.orderId,t=t||_pa.revenue,n&&""!==n&&(o+="&order_id="+encodeURIComponent(n)),t&&""!==t&&(o+="&value="+encodeURIComponent(t)),_pa.createImageTag("conversions",e,o,a)}function n(e){for(var a=e.shift().split("."),n=_pa,t=0;t<a.length;t++)n=n[a[t]];return n.apply(_pa,e)}_pa.head=document.getElementsByTagName("head")[0]||document.getElementsByTagName("body")[0],_pa.init=function(){_pa.fired={segments:[],conversions:[]},_pa.url=document.location.href,_pa.pixelHost=("https:"===document.location.protocol?"https://secure":"http://ib")+".adnxs.com/",_pa.paRtbHost=("https:"===document.location.protocol?"https://":"http://")+"pixel.prfct.co/"},_pa.addFired=function(e,a){"undefined"==typeof _pa.fired[e]&&(_pa.fired[e]=[]),_pa.fired[e].push(a)},_pa.detect=function(){for(var n=0;n<_pa.segments.length;n++){var t=_pa.segments[n];_pa.url.match(new RegExp(t.regex,"i"))&&e(t.id,t.name)}for(var n=0;n<_pa.conversions.length;n++){var o=_pa.conversions[n];_pa.url.match(new RegExp(o.regex,"i"))&&a(o.id,o.name)}},_pa.track=function(n,t){var o=!1;t="undefined"!=typeof t?t:{};for(var p=0;p<_pa.conversionEvents.length;p++){var r=_pa.conversionEvents[p];r.name===n&&(o=!0,a(r.id,r.name,t.orderId,t.revenue))}for(var p=0;p<_pa.segmentEvents.length;p++){var i=_pa.segmentEvents[p];i.name===n&&(o=!0,e(i.id,i.name,t.segment_value))}return o},_pa.fireLoadEvents=function(){if("undefined"!=typeof _pa.onLoadEvent)if("function"==typeof _pa.onLoadEvent)_pa.onLoadEvent();else if("string"==typeof _pa.onLoadEvent)for(var e=_pa.onLoadEvent.split(","),a=0;a<e.length;a++){var n=e[a];_pa.track(n)}},_pa.createImageTag=function(e,a,n,t){var o=document.createElement("img");o.src=n,o.width=1,o.height=1,o.border=0,_pa.head.appendChild(o),_pa.addFired(e,{id:a,name:t})},_pa.start=function(){_pa.fireLoadEvents(),_pa.detect(),_pa.initQ()},_pa.initQ=function(){if("undefined"!=typeof window._pq)for(var e=0;e<_pq.length;e++){var a=_pq[e];n(a)}window._pq={push:function(e){return n(e)}}},_pa.init()}();	(function() {
	_pa.partner_tags = {"pa_rtb":true};
	function createPartnerTags(partner_tags){
		if (partner_tags.canned_banners != null){
			loadCannedBanners(partner_tags.canned_banners);
		}
	}
	
	
	
	
	
	
	createPartnerTags(_pa.partner_tags);
})();

_pa.start();
