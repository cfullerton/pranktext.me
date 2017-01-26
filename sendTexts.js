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
var time = new Date().getMinutes();
console.log(time);
if (time < 2){
queryDBFrequency("1",function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result)
    }

})
}else {
  queryDBFrequency("4",function(err,result){
    if(err){
        console.log(err);
    }else{
        console.log(result)
    }

})
}
};
