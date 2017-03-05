/*var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');*/
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
/*var configDB = require('../../config/database.js');
mongoose.connect(configDB.url);*/
var users = require('../models/home.js');
var cors = require('cors');
var util = require('util');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var knowledgeBaseId = '8412357a-1e63-47d5-8035-30d94d863612';
var subsriptionKey = 'a2ea2916d854479dabf9ea302e61a415';
var httpsRequest = require('request');
var utf8 = require('utf8');

//create default db entries
var answerKeyValuePair = {
	'1': 'Name',
	'2': 'Age',
	'3':'Address',
	'4': 'Hobbies',
	'5': 'pet\'s type',
	'6': 'Pet\'s name',
	'7': 'Favourite sports team(basketball)',
	'8':'five favourite bands',
	'9': 'favourite genre',
	'10': 'Wife\'s name',
	'11': 'countries visited',
	'12': 'favourite movies',
	'13': 'favourite food',
	'14': 'Company Name',
	'15': 'Position I handled',
	'16': 'wife image',
	'17': 'emergency contact',
	'18': 'shows'
}

var userKeyValuePair = [{
	'key':'Name',
	'value':'James Wilson'
},
{
	'key':'Age',
	'value':'63'
},{
	'key':'Address',
	'value':'3800 SW 34th Street, Baker Avenue, LA'
},{
	'key':'Hobbies',
	'value':'basketball, football, gardening'
},{
	'key':'pet\'s type',
	'value':'dog'
},{
	'key':'Pet\'s name',
	'value':'Hugo'
},{
	'key':'Favourite sports team(basketball)',
	'value':'Nicks'
},{
	'key':'five favorite bands',
	'value':'U 2, procralimers, creed, def leppard, metallica'
},{
	'key':'favourite genre',
	'value':'electronic'
},{
	'key':'Wife\'s name',
	'value':'lily'
},{
	'key':'countries visited',
	'value':'canada, mexico, united kingdom, india'
},{
	'key': 'favourite movies',
	'value': 'james bond, seven, godfather, shawshank redemption'
},{
	'key': 'favourite food',
	'value':'orange chicken, chicken qusedillas, takoyaki'
},{
	'key': 'Company Name',
	'value':'IBM, Apple, Ford'
},{
	'key': 'Position I handled',
	'value':'Chief Executive Sales at IBM'
},{
	'key': 'wife image',
	'value':'$$pathtoimage'
},{
	'key': 'emergency contact',
	'value':'3528881397',
},{
	'@18': 'shows',
	'value':'cheers, perfect strangers,knight rider, who\'s the boss'
}]



exports.storeData = function(req, res){
	var inputData = JSON.parse(req.body);
	var id = req.params.id;
	for(var key in inputData){
		users.update({'id': id, 'answerPairs.key':key}, {'$set': {
		    'answerPairs.$.value': inputData[key]
		}},function(err){
			console.log(err);
		});
	}
	res.send(200);
}

exports.storeImage = function(req, res){
	var form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });
    form.on('file', function(name,file) {
        console.log(name);
        var formData = {
	      file: {
	        value:  fs.createReadStream(file.path),
	        options: {
	          filename: file.originalFilename
	        }
	      }
	    };

	    // Post the file to the upload server
	    request.post({url: 'http://localhost:8042/upload', formData: formData});
    });
}

//intput
/*
{
	"question":"who am I?"
}
*/
function checkAndHandleConjugate(req,res){
	var innerAnswer = req.body;
	 if(innerAnswer.split("and")[1] != undefined || innerAnswer.split("And")[1] != undefined  || innerAnswer.split(".")[1] != undefined){
	    	if(innerAnswer.split("and")[1] == undefined){
	    		if(innerAnswer.split("And")[1] == undefined){
    				conjugateData = innerAnswer.split(".")[0];
    				var options =  createOptions(req,res);
    				var response = getIntermediateResponse(req,res);    				
	    		}else{
	    			conjugateData = innerAnswer.split("And")[0];
	    		}
	    	}else{
	    		conjugateData = innerAnswer.split("and")[0];
	    	}
	    }
}

function createOptions(req,res){
	var options = {
	  		url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/'+knowledgeBaseId+'/generateAnswer',
		  	method: 'POST',
		  	headers: {
		      'Content-Type': 'application/json',
		      'Ocp-Apim-Subscription-Key':subsriptionKey
		  	},
		  	body: JSON.stringify(req.body)
		};

		return options;
}

function getIntermediateResponse(req, res){
	httpsRequest(options, function callback(error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var info = JSON.parse(body);

			    var answer = info.answer;
			    var options = {
			  		url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/'+knowledgeBaseId+'/generateAnswer',
				  	method: 'POST',
				  	headers: {
				      'Content-Type': 'application/json',
				      'Ocp-Apim-Subscription-Key':subsriptionKey
				  	},
				  	body: JSON.stringify({question: answer})
				};
					httpsRequest(options, function callback(error, response, body) {
					  if (!error && response.statusCode == 200) {
					    var innerInfo = JSON.parse(body);
					    console.log(innerInfo);
					    var innerAnswer = innerInfo.answer;
					    var 
					    var splitAnswer = innerAnswer.split("@");
					    //console.log(splitAnswer.length);
					    if(splitAnswer.length==1){
					    	output = answer;
					    }else{
					    	output = "";
					    	for(var x in splitAnswer){
					    		if(answerKeyValuePair[splitAnswer[x]]==undefined){
					    			output=output+splitAnswer[x]+" ";
					    		}else{
						    			var currentAnswer;
						    			for(var y in userKeyValuePair){
						    				if(userKeyValuePair[y].key==answerKeyValuePair[splitAnswer[x]]){
						    					currentAnswer=userKeyValuePair[y].value;
						    					break;
						    				}
						    			}
						    			output=output+currentAnswer+" ";
					    			
					    		}
					    	}

					    }
					    
					    output = utf8.encode(output);
					}else{
						res.send(error);
					}

				});
				
			 }else{
			 	res.send(error);
			 }
		});
	return output;
}

exports.sendQuestion = function(req, res){
	users.findById(req.params.id,function(err,user){
		var output;
	    //checkAndHandleConjugate(req,res);
		//var options = createOptions(req,res);
		httpsRequest(options, function callback(error, response, body) {
			  if (!error && response.statusCode == 200) {
			    var info = JSON.parse(body);

			    var answer = info.answer;
			    var options = {
			  		url: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0/knowledgebases/'+knowledgeBaseId+'/generateAnswer',
				  	method: 'POST',
				  	headers: {
				      'Content-Type': 'application/json',
				      'Ocp-Apim-Subscription-Key':subsriptionKey
				  	},
				  	body: JSON.stringify({question: answer})
				};
				httpsRequest(options, function callback(error, response, body) {
					  if (!error && response.statusCode == 200) {
					    var innerInfo = JSON.parse(body);
					    console.log(innerInfo);
					    var innerAnswer = innerInfo.answer;
					    var 
					    var splitAnswer = innerAnswer.split("@");
					    //console.log(splitAnswer.length);
					    if(splitAnswer.length==1){
					    	output = answer;
					    }else{
					    	output = "";
					    	for(var x in splitAnswer){
					    		if(answerKeyValuePair[splitAnswer[x]]==undefined){
					    			output=output+splitAnswer[x]+" ";
					    		}else{
						    			var currentAnswer;
						    			for(var y in userKeyValuePair){
						    				if(userKeyValuePair[y].key==answerKeyValuePair[splitAnswer[x]]){
						    					currentAnswer=userKeyValuePair[y].value;
						    					break;
						    				}
						    			}
						    			output=output+currentAnswer+" ";
					    			
					    		}
					    	}

					    }
					    
					    //output = utf8.encode(output);
					    console.log(JSON.stringify(output));
			    		res.status(200).json({answer:output});
					}else{
						res.send(error);
					}

				});
				
			 }else{
			 	res.send(error);
			 }
		});
	});
}


