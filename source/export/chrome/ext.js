//setTimeout(function() {
window.ext = (function(_ext) {
	"use strict";

	//= include ../../js/ext-core.js

	//= include ../../js/ext-parser.js

	//= include ../../js/ext-print.js

	//= include ../../js/ext-auto.js

	_ext.publish('init');

	return _ext;
})(window.ext || {});

//},4000);
//= include ../../js/tables.js
