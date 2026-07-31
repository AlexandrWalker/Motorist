/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'MotoristIconFont\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-x-2': '&#xe900;',
		'icon-re-arrow': '&#xe901;',
		'icon-copy': '&#xe906;',
		'icon-x': '&#xe907;',
		'icon-plate-phone-fill': '&#xe91e;',
		'icon-social-phone-fill': '&#xe91f;',
		'icon-plate-max': '&#xe920;',
		'icon-max': '&#xe921;',
		'icon-vote': '&#xe922;',
		'icon-filter': '&#xe923;',
		'icon-favorite-fill-min': '&#xe924;',
		'icon-form-tie': '&#xe925;',
		'icon-plate-headphone': '&#xe926;',
		'icon-plate-whatsapp': '&#xe927;',
		'icon-plate-telegram': '&#xe928;',
		'icon-plate-phone': '&#xe929;',
		'icon-plate-mail': '&#xe92a;',
		'icon-plus-min': '&#xe92b;',
		'icon-minus': '&#xe92c;',
		'icon-plus': '&#xe92d;',
		'icon-form-mail': '&#xe92e;',
		'icon-form-phone': '&#xe92f;',
		'icon-form-user': '&#xe930;',
		'icon-trash': '&#xe931;',
		'icon-thermometer': '&#xe932;',
		'icon-check': '&#xe933;',
		'icon-form-photo-camera': '&#xe934;',
		'icon-kebab-menu': '&#xe935;',
		'icon-bento-menu': '&#xe936;',
		'icon-favorite-min': '&#xe937;',
		'icon-favorite': '&#xe938;',
		'icon-chevron': '&#xe939;',
		'icon-star': '&#xe93a;',
		'icon-chevron-min': '&#xe93b;',
		'icon-slider-arrow': '&#xe93c;',
		'icon-cart-min': '&#xe93d;',
		'icon-sberbank': '&#xe93e;',
		'icon-youkassa': '&#xe93f;',
		'icon-visa': '&#xe940;',
		'icon-mir': '&#xe941;',
		'icon-mastercard': '&#xe942;',
		'icon-arrow': '&#xe943;',
		'icon-compare': '&#xe944;',
		'icon-basket': '&#xe945;',
		'icon-cart': '&#xe946;',
		'icon-search': '&#xe947;',
		'icon-headphone': '&#xe948;',
		'icon-plane': '&#xe949;',
		'icon-download': '&#xe94a;',
		'icon-whatsapp': '&#xe94b;',
		'icon-telegram': '&#xe94c;',
		'icon-bento': '&#xe94d;',
		'icon-doc': '&#xe94e;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
