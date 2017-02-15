const $ = require('jquery');
const utils = require('../utils/');
const _subscribe = utils.subscribe;
const _settings = utils.settings;
const _notification = require('../notifications/');
const _heroName = utils.heroName;


const CHOICES = {
	/* peacefullnes */
	peacePlus: [
		'прибегнуть к дипломатии' /* collect_debt */
	],
	peaceMinus: [
		'задействовать грубую силу' /* collect_debt */
	],
	honorPlus: [
		'довести дело до конца', /* spying */
		'защищать торговца', /* caravan */
		'честно выполнить свои обязательства' /* delivery */
	],
	honorMinus: [
		'поддаться укорам совести и раскрыться', /* spying */
		'шантажировать самостоятельно', /* spying */
		'присвоить письмо и продать', /* delivery */
		'украсть-украсть-украсть', /* delivery */
		'подделать письмо' /* delivery */
	]
};

let lastquest = '';

function checkQuest(gameData) {
	const csrf = document.head.innerHTML.match(/("X-CSRFToken")(.*)(".*")/, 'g')[3].replace(/"/g, '');
	const _settingsValues = _settings.settingsValues;
	const selectChoices = {};
	if (_settingsValues.autoquestPeacePlus) {
		selectChoices.peacePlus = 1;
	}
	if (_settingsValues.autoquestPeaceMinus) {
		selectChoices.peaceMinus = 1;
	}
	if (_settingsValues.autoquestHonorPlus) {
		selectChoices.honorPlus = 1;
	}
	if (_settingsValues.autoquestHonorMinus) {
		selectChoices.honorMinus = 1;
	}

	const hero = gameData.account.hero;
	const quests = hero.quests.quests;
	const line = quests[1].line;
	for (let i = 0; i < line.length; i++) {
		const q = line[i];
		for (let choiceIndex = 0; choiceIndex < q.choice_alternatives.length; choiceIndex++) {
			const choiceName = q.choice_alternatives[choiceIndex][1];
			const option_uid = q.choice_alternatives[choiceIndex][0];
			for (const reward in CHOICES)				{
				if (CHOICES.hasOwnProperty(reward)) {
					if (CHOICES[reward].indexOf(choiceName) >= 0) {
						if (selectChoices[reward]) {
							chooseQuest(option_uid, choiceName);
						}
					}
				}
			}
		}
	}

	function chooseQuest(uid, name) {
		if (_settingsValues.autoquestNotify && lastquest !== name) {
			lastquest = name;
			_notification.sendNotify('The Tale Extended - ' + _heroName, {
				tag: 'autoquest',
				body: 'Сделан выбор! \n— ' + name + '',
				addTime: 1,
				icon: window.extPath + 'img/quest/caravan.png'
			});
		}

		if (!_settingsValues.autoquest) {
			return;
		}
		$.ajax({
			url: '/game/quests/api/choose?api_version=1.0&api_client=' + window.API_CLIENT + '&option_uid=' + encodeURIComponent(uid),
			dataType: 'json',
			type: 'post',
			beforeSend: function(xhr) {
				xhr.setRequestHeader('X-CSRFToken', csrf);
			},
			data: {}
		});
	}
}

module.exports = checkQuest;

_subscribe('newMessages', function(messagesNew, gameData) {
	window.setTimeout(function() {
		checkQuest(gameData);
	}, 1000);
});
