const _subscribeList = [];
function publish(e) {
	const sp = e.split('.');
	const event = sp[0];
	const namespace = sp[1];
	const ctx = this;
	for (let i = 0; i < _subscribeList.length; i++) {
		const s = _subscribeList[i];
		if ((!namespace || namespace === s.namespace) && (!event || event === s.event)) {
			s.fn.apply(ctx, Array.prototype.slice.call(arguments, 1));
		}
	}
}
function subscribe(e, fn) {
	const events = e.split(',');
	if (events.length > 1) {
		events.forEach(function(ev) { subscribe(ev, fn); });
		return;
	}
	const sp = e.split('.');
	const event = sp[0];
	const namespace = sp[1];
	_subscribeList.push({
		event: event,
		namespace: namespace,
		fn: fn
	});
}

module.exports = {
	subscribeList: _subscribeList,
	publish: publish,
	subscribe: subscribe
};
