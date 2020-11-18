const Cloudant = require('cloudant');

const credentials = {
	"apikey": "hMCNmj-M6V2E3Ih4n7fhHH_CBHOn0taGuA4iBdN02UHp",
	"host": "783f383f-5f3d-4b68-93b3-2de6a74d9a75-bluemix.cloudantnosqldb.appdomain.cloud",
	"iam_apikey_description": "Auto-generated for key fe3fb223-5230-4f67-810d-d4da579e9d54",
	"iam_apikey_name": "Credenciales de servicio-1",
	"iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
	"iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/b145b41837cb4552bb14e30bf2d2e7ac::serviceid:ServiceId-ab383a6f-f054-4473-8dcd-68a7962e9aba",
	"password": "4cfcaa0952539268760678c398dcb9159b5c8818bf22876975175cc402609ff9",
	"port": 443,
	"url": "https://783f383f-5f3d-4b68-93b3-2de6a74d9a75-bluemix:4cfcaa0952539268760678c398dcb9159b5c8818bf22876975175cc402609ff9@783f383f-5f3d-4b68-93b3-2de6a74d9a75-bluemix.cloudantnosqldb.appdomain.cloud",
	"username": "783f383f-5f3d-4b68-93b3-2de6a74d9a75-bluemix"
}

function insert(dbName, userData){
	return new Promise(async function(resolve, reject){
		const cloudant = await Cloudant(credentials);
		await cloudant.use(dbName).insert(
			userData, 
			function(error, data) {
				resolve({
					statusCode: (error) ? 500 : 200,
					params: userData
				});
			}
		);
	});
}

function registerBcTask(params){
	const userData = params.userData || null;
	const dbName = 'bc-tasks';
	return insert(dbName, userData);
}

global.main = registerBcTask;