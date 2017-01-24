var AWS = require("aws-sdk");
exports.handler = (event, context, callback) => {
    //console.log(event);
    var sns = new AWS.SNS();
    var number = "+" + event.query.number;
    var topic = event.query.topic;
    var frequency = event.query.frequency;
    var totalTexts = event.query.totalTexts;
    console.log("--- " + number + "------------");
    if (number && topic && frequency){
        var welcomeParams = {
            Message: "welcome to" + topic + " texts! to unsubscribe visit pranktext.me/unsubscribe",
            Subject: topic,
            PhoneNumber: number
        };
    sns.publish(welcomeParams,function(err,data){
        if (err) console.log(err, err.stack); // an error occurred
        else     {
               removeWelcome()
        }           // successful response
    });
    AWS.config.update({
      region: "us-west-2",
      endpoint: "https://dynamodb.us-west-2.amazonaws.com"
    });
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName:"subscribers",
        Item:{
            "number": number,
            "topic": topic,
            "frequency": frequency,
            "remaining": totalTexts,
        }
    };

    docClient.put(params, function(err, data) {
        if (err) {
           console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
});
    }

};
