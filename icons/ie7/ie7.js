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
		'icon-copy': '&#xe900;',
		'icon-x': '&#xe901;',
		'icon-plate-phone-fill': '&#xe918;',
		'icon-social-phone-fill': '&#xe919;',
		'icon-plate-max': '&#xe91a;',
		'icon-max': '&#xe91b;',
		'icon-vote': '&#xe91c;',
		'icon-filter': '&#xe91d;',
		'icon-favorite-fill-min': '&#xe91e;',
		'icon-form-tie': '&#xe91f;',
		'icon-plate-headphone': '&#xe920;',
		'icon-plate-whatsapp': '&#xe921;',
		'icon-plate-telegram': '&#xe922;',
		'icon-plate-phone': '&#xe923;',
		'icon-plate-mail': '&#xe924;',
		'icon-plus-min': '&#xe925;',
		'icon-minus': '&#xe926;',
		'icon-plus': '&#xe927;',
		'icon-form-mail': '&#xe928;',
		'icon-form-phone': '&#xe929;',
		'icon-form-user': '&#xe92a;',
		'icon-trash': '&#xe92b;',
		'icon-thermometer': '&#xe92c;',
		'icon-check': '&#xe92d;',
		'icon-form-photo-camera': '&#xe92e;',
		'icon-kebab-menu': '&#xe92f;',
		'icon-bento-menu': '&#xe930;',
		'icon-favorite-min': '&#xe931;',
		'icon-favorite': '&#xe932;',
		'icon-chevron': '&#xe933;',
		'icon-star': '&#xe934;',
		'icon-chevron-min': '&#xe935;',
		'icon-slider-arrow': '&#xe936;',
		'icon-cart-min': '&#xe937;',
		'icon-sberbank': '&#xe938;',
		'icon-youkassa': '&#xe939;',
		'icon-visa': '&#xe93a;',
		'icon-mir': '&#xe93b;',
		'icon-mastercard': '&#xe93c;',
		'icon-arrow': '&#xe93d;',
		'icon-compare': '&#xe93e;',
		'icon-basket': '&#xe93f;',
		'icon-cart': '&#xe940;',
		'icon-search': '&#xe941;',
		'icon-headphone': '&#xe942;',
		'icon-plane': '&#xe943;',
		'icon-download': '&#xe944;',
		'icon-whatsapp': '&#xe945;',
		'icon-telegram': '&#xe946;',
		'icon-bento': '&#xe947;',
		'icon-doc': '&#xe948;',
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
