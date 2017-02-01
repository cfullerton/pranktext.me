var AWS = require("aws-sdk");
exports.handler = (event, context, callback) => {
    AWS.config.update({
       region: "us-west-2",
      endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();

    var queryDBFrequency = function(value,callback) {

    var docClient = new AWS.DynamoDB.DocumentClient();

    var params = {
            TableName: "subscribers",
            IndexName:'frequency-index',
            KeyConditionExpression: "#frequency = :frequency",
            ExpressionAttributeNames:{
                "#frequency": "frequency"
            },
            ExpressionAttributeValues: {
                ":frequency":value
            }
        };

    docClient.query(params,callback);
};
var queryTopics = function(values,callback) {
var docClient = new AWS.DynamoDB.DocumentClient();

var params = {
        TableName: "topics",
        IndexName:'topic-index',
        KeyConditionExpression: "#topic = :topic",
        ExpressionAttributeNames:{
            "#topic": "topic"
        },
        ExpressionAttributeValues: {
            ":topic":value
        }
    };

docClient.query(params,callback);
};
var time = new Date().getMinutes();
console.log(time);
if (time < 2){
queryDBFrequency("1",function(err,result){
    if(err){
        console.log(err);
    }else{
        sendTexts(result);
    }

})
}else {
  queryDBFrequency("4",function(err,result){
    if(err){
        console.log(err);
    }else{
        sendTexts(result);
    }

})
}
function sendTexts(input){
  var list = input.Items;
  var topics = {};
  var topicList = [];
  for (var i=0;i<list.length;i++){
    if (!topics[list[i].topic]){
      topics[list[i].topic] = {};
      topicList.push(list[i].topic);
    }
  }
  console.log(topics);
  for(var i = 0; i < topicList.length; i++){
    queryTopics(topicList[i],function(err,result){
       if (err){
         console.log(err);
       }else{
         topics[list[i].topic] = result;
       }
    })
  }
  // do stuff after getting topics, getting topics might need to be async
}
};
