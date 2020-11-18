const Twitter = require('twitter');
const { IamAuthenticator } = require('ibm-watson/auth');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');

async function ingestTweets(key, secret, bearer){
	return new Promise(function(resolve, reject){
		var client = new Twitter({
			consumer_key: key,
			consumer_secret: secret,
			bearer_token: bearer
		});
		client.get('search/tweets', {q: 'covid'}, function(error, tweets, response) {
			resolve(tweets.statuses);
		});
	});
}

function parseTweets(tweets){
	return tweets.map(function(tweet){
		return tweet.text;
	}).join('.');
}

async function analyzeTweets(sentimentEndpoint, tweets){
	return new Promise(function(resolve, reject){

		const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
			version: '2020-08-01',
			authenticator: new IamAuthenticator({
				apikey: 'sXD923oaC-48Iy5fllexpHcvb0uKaZTxSU2jpWHl6fLM',
			}),
			serviceUrl: 'https://api.eu-gb.natural-language-understanding.watson.cloud.ibm.com/instances/a5dc8f04-3111-4d67-b8ec-1dba88ce1837',
		});

		const analyzeParams = {
			'text': tweets,
			'features': {
				'entities': {
					'emotion': true,
					'sentiment': true,
					'limit': 15,
				}
			},
		};

		naturalLanguageUnderstanding.analyze(analyzeParams)
		.then(function(analysisResults){
			resolve(analysisResults.result.entities);
		}) .catch(function(error){
			reject(null);
		});
	});
}

function parseSentiment(sentimentData){
	var mean = 0;
	const values = sentimentData.map(function(sentiment){
		return (sentiment.sentiment.score + 0.1) * sentiment.relevance;
	})
	values.forEach(function(e){
		mean += e;
	});
	mean /= sentimentData.length;

	var sentimentString = null;
	if(mean < -0.5){
		sentimentString = 'strong negative';
	}else if(mean >= -0.5 && mean < -0.25){
		sentimentString = 'negative';
	}else if(mean >= -0.25 && mean < -0.15){
		sentimentString = 'weak negative';
	}else if(mean >= -0.15 && mean < 0.15){
		sentimentString = 'neutral';
	}else if(mean >= 0.15 && mean < 0.25){
		sentimentString = 'weak positive';
	}else if(mean >= 0.25 && mean < 0.5){
		sentimentString = 'positive';
	}else if(mean >= 0.5){
		sentimentString = 'strong positive';
	}else{
		sentimentString = 'unknown';
	}

	return {
		sentiment: mean,
		type: sentimentString
	}
}

async function twitterSentimentAction() {
	TWITTER_KEY = 'jL9ufYzLGl6ezNygFGhts4uif'
	TWITTER_SECRET = 'eqsQuOxClzrTjmEQcxtXbPkBVD4XrjM3EkYNqgsEcr53mzB3Xl'
	TWITTER_BEARER = 'AAAAAAAAAAAAAAAAAAAAAHwMDwEAAAAAj5283nyjyrK%2BXzu5F01p%2Fx0b104%3DjCVTTywiqnH8C7XMqe60fEeXvaJbnpyoUOs140fLhIUutEgLsa'

	const tweets = await ingestTweets(TWITTER_KEY, TWITTER_SECRET, TWITTER_BEARER);
	const parsedTweets = parseTweets(tweets);
	const analyzedTweets = await analyzeTweets(IBM_SENTIMENT_ENDPOINT, parsedTweets);
	const sentimentData = parseSentiment(analyzedTweets);
	return {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: {sentiment: sentimentData} 
	};
}

global.main = twitterSentimentAction;
