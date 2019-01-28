console.log("the bot is working")

var Twit = require('twit')

var T = new Twit({
  consumer_key:         '',
  consumer_secret:      '',
  access_token:         '',
  access_token_secret:  '',
  //timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

var INITIAL_PEOPLE = 75;
var INITIAL_MONEY = 75;
var INITIAL_ARMY = 75;

var BlueCity = {
	people : INITIAL_PEOPLE,
	money : INITIAL_MONEY,
	army : INITIAL_ARMY
}

var GreenCity = {
	people : INITIAL_PEOPLE,
	money : INITIAL_MONEY,
	army : INITIAL_ARMY
}

var RedCity = {
	people : INITIAL_PEOPLE,
	money : INITIAL_MONEY,
	army : INITIAL_ARMY
}

var YellowCity = {
	people : INITIAL_PEOPLE,
	money : INITIAL_MONEY,
	army : INITIAL_ARMY
}

var stream = T.stream('user',['replies=all']);

stream.on('tweet', tweetEvent);

function tweetEvent(eventMsg) {
	var fs = require('fs')
	var json = JSON.stringify(eventMsg,null,2);
	fs.writeFile("tweet.json",json)

	var replyTo = eventMsg.in_reply_to_screen_name;
	var text = eventMsg.text;
	var from = eventMsg.user.screen_name;

	if (replyTo == "Interactive_civ") {
		var hashtags = eventMsg.entities.hashtags;
		for (var i = 0; i < hashtags.length; ++i) {
			if (hashtags[i].text == "cityYes") {
				 ++cityYes;
				 console.log("a new cityYes has been received! cityYes': "+cityYes);
			}
			else if (hashtags[i].text == "cityNo") {
				++cityNo;
				 console.log("a new cityNo has been received! cityNo's: "+ cityNo);
			}
		}
	}
}

var actionToBeDone = {};

actionToBeDone['type'] = "default";

var cityYes = 0;
var cityNo = 0;

NewEvent();

var intervalMinutes = 15;
setInterval(action, 1000*60*intervalMinutes);



function action() {
	respond();

	cityYes = 0;
	cityNo = 0;
	setTimeout(NewEvent, 1000*10);
}

function respond() {
	if (actionToBeDone['type'] == "attack") {
		if (cityYes >= cityNo) {
			TweetIt("[BlueCity] has finally attacked "+ actionToBeDone['target'] +" and it won the battle!");
		}
		else {
			TweetIt("[BlueCity] has not finally attacked "+ actionToBeDone['target'] +", let's be pacific this time.");
		}
	}
	else if (actionToBeDone['type'] == "commerce") {
		if (cityYes >= cityNo) {
			BlueCity.money += Math.max(5+BlueCity.money,100);
			TweetIt("[BlueCity] has accepted commercing with "+ actionToBeDone['target'] +". It increases its wealth by 5 points.");
		}
		else {
			TweetIt("[BlueCity] has not finally accepted commercing with "+ actionToBeDone['target'] +". It decreases its wealth by 3 points.");
		}
	}
	else if (actionToBeDone['type'] == "epidemy") {
		if (cityYes >= cityNo) {
			TweetIt("[BlueCity] council has attempted to find an antidote to fight the epidemy. It increases its people index by 5 points.")
		}
		else {
			TweetIt("[BlueCity] council hasn't attempted to find an antidote for its citizens. It decreases its people index by 5 points.")
		}
	}
	else if (actionToBeDone['type'] == "treasure") {
		if (cityYes >= cityNo) {
			TweetIt("The treasure found in [BlueCity] has been invested in their citizens! It increments its people index by 15 points");
		}
		else {
			TweetIt("The treasure found in [BlueCity] has been wasted by its council! It decreases its people index by 5 points");
		}
	}
	else if (actionToBeDone['type'] == "science") {
		if (cityYes >= cityNo) {
			TweetIt("The scientific progress made in [BlueCity] has been used to improve the life quality of their citizens.");
		}
		else {
			TweetIt("The scientific progress made in [BlueCity] has been used to improve the army's weapons and bombs.");
		}
	}
}



function NewEvent() {
		var act = Math.floor(Math.random() * 5);   // returns a random number between 0 and 4
		console.log(act);
			switch (act) {
				case 0:
					actionToBeDone['type'] = "attack";
					var act1 = Math.floor(Math.random() * 3);   // returns a random number between 0 and 2
					switch (act1) {
						case 0:
							actionToBeDone['target'] = "GreenCity";
							break;
						case 1:
							actionToBeDone['target'] = "RedCity";
							break;
						case 2: 
							actionToBeDone['target'] = "YellowCity";
							break;
					}
					break;
				case 1: 
					actionToBeDone['type'] = "commerce";
					var act2 = Math.floor(Math.random() * 3);   // returns a random number between 0 and 2
					switch (act2) {
						case 0:
							actionToBeDone['target'] = "GreenCity";
							break;
						case 1:
							actionToBeDone['target'] = "RedCity";
							break;
						case 2: 
							actionToBeDone['target'] = "YellowCity";
							break;
					}
					break;
				case 2: 
					actionToBeDone['type'] = "epidemy";
					break;
				case 3:
					actionToBeDone['type'] = "treasure";
					break;
				case 4:
					actionToBeDone['type'] = "science";
					break;
				default:
					break;
			}

		if (act == 0) 	   TweetIt("BlueCity is about to attack "+ actionToBeDone['target']+ "! What should BlueCitizens do? #cityYes or #cityNo ?");
		else if (act == 1) TweetIt("BlueCity is planning to sign a commercial deal with "+ actionToBeDone['target']+"! What should they do? #cityYes or #cityNo ?");
		else if (act == 2) TweetIt("BlueCity is being knocked by a devasting epidemy! Should BlueCity's coucil find an antidote? #cityYes or #cityNo ?");
		else if (act == 3) TweetIt("A citizen from BlueCity has found a treasure! Should BlueCity's coucil invest it in city facilities? #cityYes or #cityNo ?");
		else if (act == 4) TweetIt("BlueCity has made an advance in science! Should BlueCity use it to improve the army's weapons? #cityYes or #cityNo ?");
}

function TweetIt(MessageTxt) {
	T.post('statuses/update', {status: "["+getTime()+"] "+ MessageTxt}, function(err, data, response) {
		if (err) {
			console.log("SOMETHING WENT WRONG!!")
			console.log(err);
		}
		else console.log(data.text);
	})
}


function getTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    return hour + ":" + min;

}
