import $ from 'jquery';
import {settingsValues, addSets, drawSets, init, getSettingInput} from './settings';
import {elements} from '../utils/elements';
import {setsAuto} from './sets-auto';
import {subscribe} from '../utils/pubsub';
import {setsGame} from './sets-game';
import clientStorage from '../utils/clientStorage';

elements.addTab('sets', {zone: 'main', title: '<span class="glyphicon glyphicon-cog" title="Настройки &laquo;The Tale Extended&raquo;"></span>'});

function initSettings() {
	addSets(setsAuto);
	drawSets(setsAuto);

	const $sets = elements.getTabInner('sets');
	$sets.on('click', '[data-auto]', function(e) {
		e.preventDefault();
		const type = $(this).data('auto');
		const types = {
			rest: {
				autohelpIdle: 1,
				autohelpDead: 1,
				autohelpHp: 1,
				autohelpHpBoss: 1,
				autohelpEnergy: 1,
				autohelpEnergyFight: 0,
				autohelpEnergyRest: 0,
				autohelpEnergyWalk: 1,
				autohelpEnergyTradeMed: 1,
			},
			fight: {
				autohelpIdle: 0,
				autohelpDead: 0,
				autohelpHp: 1,
				autohelpHpBoss: 0,
				autohelpEnergy: 1,
				autohelpEnergyFight: 1,
				autohelpEnergyRest: 0,
				autohelpEnergyWalk: 0,
				autohelpEnergyTradeMed: 0,
			},
		};
		const conf = types[type];
		for (const key in conf) {
			if (conf.hasOwnProperty(key)) {
				const value = !!conf[key];
				const $input = getSettingInput(key);
				$input.prop('checked', value).trigger('change');
			}
		}
	});
}

subscribe('preload', gameData => {
	if (gameData) {
		const hero = gameData.account.hero;
		const energyBonus = hero.energy.bonus;
		const $inputMax = getSettingInput('autohelpEnergyBonusMax');
		if (isNaN($inputMax.val())) {
			$inputMax.val(Math.max(0, energyBonus - 10)).trigger('change');
		}
	}
});

subscribe('init', () => {
	initSettings();
});


addSets(setsGame);


subscribe('init', () => {
	init();
});

subscribe('preload', function() {
	if (!settingsValues.heroNameStart) {
		/* todo is `this` correct _ext */
		const heroName = this.heroName;
		settingsValues.heroNameStart = heroName.substring(0, Math.max(3, heroName.length - 2));
		getSettingInput('heroNameStart').val(settingsValues.heroNameStart).trigger('change');
	}
});

subscribe('newTurn', () => {
	window.setTimeout(() => {
		$('#storage-size')
			.text(`(занято ${Math.round(clientStorage.size() / 1024 / 1024 * 100) / 100}Мб)`);
	}, 10);
});
