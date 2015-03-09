/** добавляет к архивам поле total */

var $ = require('jquery');
var utils = require('../../utils/index.js');
var _const = utils.const;
var archiveGroups = require('./archiveGroups.js');
var isActType = utils.isActType;

function upgradeArchiveGroup(archiveGroup, index) {
	if (!archiveGroup || !archiveGroup.ts) {
		return archiveGroup;
	}
	if (archiveGroup.me) {
		$.extend(archiveGroup, {
			total:{
				me: countTotalFromArchive(archiveGroup.me, 'me'),
				enemy: countTotalFromArchive(archiveGroup.enemy, 'enemy', archiveGroup.mobId === 66)
			}
		});
	}
	return archiveGroup;

	/* подсчет всех сумм из архива */
	function countTotalFromArchive(archiveGroupFrom) {
		var addTo = {dmgSum: {count:0, sum:0}};
		for (var type in archiveGroupFrom) if (archiveGroupFrom.hasOwnProperty(type)) {
			var vals = archiveGroupFrom[type];
			var isPassive = isActType('PASSIVE', type);
			var isHeal = type === 'heal';

			var count;
			var sum;
			if (typeof vals === 'number') {
				count = vals;
				sum = 0;
			} else {
				count = vals.length;
				sum = vals.reduce(function(pv, cv) { return pv + cv; }, 0) || 0;
			}

			var av;
			var critMin;
			var critVals;
			var critCount = 0;
			addTo[type] = addTo[type] || {sum: 0, count: 0};
			if (type === 'hit' && sum) {
				av = sum / count;
				critMin = av * 1.35;
				critVals = vals.filter(function(item) { return item > critMin;});
				critCount = critVals.length;
			}
			if (critCount) {
				addTo.crit = addTo.crit || {sum: 0, count: 0};
				var critSum = critVals.reduce(function(pv, cv) { return pv + cv; }, 0) || 0;
				addTo.crit.count += critCount;
				addTo.crit.sum += critSum;
			}
			addTo[type].count += count;
			addTo[type].sum += sum;


			var typeSumTo = _const.SUM_TO_MAIN[type];
			if (typeSumTo) {
				addTo[typeSumTo] = addTo[typeSumTo] || {sum: 0, count: 0};
				addTo[typeSumTo].sum += sum;
			}
			if (!isHeal) {
				if (!isPassive) {
					addTo.dmgSum.count += count;
				}
				addTo.dmgSum.sum += sum;
			}
		}
		return addTo;
	}
}

module.exports = upgradeArchiveGroup;

