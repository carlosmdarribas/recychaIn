var Cloudant = require('@cloudant/cloudant');

async function insert(dbName, userData){
	const coludant = await Cloudant({
	  "apikey": "MzsqNedZP0fBn1dAbJSyV0v7gErJ2GXL6swhTLWVWxk2",
	  "host": "26d96eff-0220-4582-a3ba-52be2fb873d0-bluemix.cloudantnosqldb.appdomain.cloud",
	  "iam_apikey_description": "Auto-generated for key f312db66-62cb-4257-9331-04fb4bd43a47",
	  "iam_apikey_name": "Credenciales de servicio-1",
	  "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
	  "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/b145b41837cb4552bb14e30bf2d2e7ac::serviceid:ServiceId-a1b59b42-0c99-4773-bff7-aab837f03a8f",
	  "url": "https://26d96eff-0220-4582-a3ba-52be2fb873d0-bluemix.cloudantnosqldb.appdomain.cloud",
	  "username": "26d96eff-0220-4582-a3ba-52be2fb873d0-bluemix"
	})
	await cloudant.db.create(dbName);
	await cloudant.use(dbName).insert(
		{ task: userData}, 
		function(error, data) {
			console.log('Error:', err);
			console.log('Data:', data);
		}
	);
}

async function registerBcTask(){
	const dbUri = `http://${'user'}:${'passwd'}@localhost:5984`
	const userData = {'budget': 'aksdjf;lasdjflkasdhfiou48u3imfh98jnv8df984hiu9sy'};
	await insert(dbName, userData);
}

global.main = registerBcTask;

async function test(){
	await registerBcTask()
}

test()


