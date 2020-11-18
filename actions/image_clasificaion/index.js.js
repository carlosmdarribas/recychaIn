const fs = require('fs');
const base64 = require('node-base64-image');
const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

function base64_decode(base64Image, file) {
	fs.writeFile(file, base64Image, {encoding: 'base64'}, function(err) {
    		console.log('File created');
	});
   //fs.writeFileSync(file,base64Image);
   console.log('******** File created from base64 encoded string ********');
}

async function classifyImage(image, classifier_ids, threshold){
	return new Promise(function(resolve, reject){
		
		var visualRecognition = new VisualRecognitionV3({
			version: '2018-03-19',
			iam_apikey: 'Mge7nWXjH594bDBg-FbKpoJ8MwEboUR7_4j_PKzgty-W'
		});

		var params = {
			images_file: image,
			classifier_ids: classifier_ids,
			threshold: threshold
		};

		visualRecognition.classify(params, function(err, response) {
			if (err) { 
				console.log(err);
			} else {
				console.log(JSON.stringify(response, null, 2))
				resolve(JSON.stringify(response, null, 2))
			}
		});
	});
}

async function wasteClassificationAction(image) {
	const imageFilename = 'tmp.jpeg';
	
	base64_decode(image, imageFilename);
	var imagesFile= fs.createReadStream('./' + imageFilename);
	const classifier_ids = ["default"];
	const threshold = 0.6;
	const results = await classifyImage(imagesFile, classifier_ids, threshold);

	// delete tmp file
	fs.unlinkSync('./' + imageFilename);

	return {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: {results: results} 
	};
}


global.main = wasteClassificationAction;