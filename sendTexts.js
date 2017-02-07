var AWS = require("aws-sdk");
exports.handler = (event, context, callback) => {

    var queryDBFrequency = function(value, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient({
            endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
            region: "us-west-2"
        });
        var params = {
            TableName: "subscribers",
            IndexName: 'frequency-index',
            KeyConditionExpression: "#frequency = :frequency",
            ExpressionAttributeNames: {
                "#frequency": "frequency"
            },
            ExpressionAttributeValues: {
                ":frequency": value
            }
        };

        docClient.query(params, callback);
    };
    var queryTopics = function(value, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient({
            endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
            region: "us-west-2"
        });

        var params = {
            TableName: "topics",
            IndexName: 'topic',
            KeyConditionExpression: "#topic = :topic",
            ExpressionAttributeNames: {
                "#topic": "topic"
            },
            ExpressionAttributeValues: {
                ":topic": value
            }
        };

        docClient.query(params, callback);
    };
    var time = new Date().getMinutes();
    if (time < 2) {
        queryDBFrequency("1", function(err, result) {
            if (err) {
                console.log(err);
            } else {
                sendTexts(result);
            }

        })
    } else {
        queryDBFrequency("1", function(err, result) {
            if (err) {
                console.log(err);
            } else {
                sendTexts(result);
            }

        })
    }

    function sendTexts(input) {
        var list = input.Items;
        var topics = [];
        var topicList = [];
        for (var i in list) {

            if (!topics[list[i].topic]) {
                topics[list[i]] = {};
                topicList.push(list[i].topic);
            }
        }

        var topicQueries = [];
        for (var i = 0; i < topicList.length; i++) {

            var queryPromise = new Promise(function(resolve, reject) {
                queryTopics(topicList[i], function(err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        topics.push(result.Items);
                        resolve();
                    }
                })
            })
            topicQueries.push(queryPromise);
        }

        Promise.all(topicQueries).then(function() {
            console.log("output: ");
            for (var i = 0; i < list.length; i++) {
                for (var j = 0; j < topics.length - 1; j++) {
                    // console.log(topics[j][0].topic);
                    //console.log(list[i].topic);
                    if (topics[j][0].topic == list[i].topic) {
                        var phoneNumber = list[i].number.split("|")[0];
                        var messageText = topics[j][0].texts.values[list[i].remaining]; // needs text
                        console.log(messageText);
                        var sns = new AWS.SNS();
                        var params = {
                            Message: messageText,
                            Subject: list[i].topic,
                            PhoneNumber: phoneNumber,
                        };
                        console.log(params);
                        sns.publish(params, function(err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else console.log(data); // successful response
                        });
                    }
                }
            }
        }).catch(reason => {
            console.log(reason)
        });
    }
};
