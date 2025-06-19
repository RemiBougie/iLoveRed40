import type { Handler, DynamoDBStreamHandler } from 'aws-lambda'
import AWS from 'aws-sdk';
import { Logger } from "@aws-lambda-powertools/logger"

// export const handler: Handler = async (event, context) => {
//     return 'Hello world!'
// }

const logger = new Logger({
    logLevel: "INFO",
    serviceName: "dynamo-db-stream-handler"
})

const cognito = new AWS.CognitoIdentityServiceProvider();

// const email_template = {
//     "Template": "EmailTemplate",
//     "SubjectPart": "New Show Added!",
//     "HtmlPart": "<h1>NEW RED40 GIG!!</h1><p><strong>Datetime:<strong>{{datetime}}</p>",
//     "TextPart": "New Show Datetime: {{datetime}}"
// }

export const handler: DynamoDBStreamHandler = async (event) => {
    for (const record of event.Records) {
        logger.info(`Processing record: ${record.eventID}`)
        logger.info(`Event Type: ${record.eventName}`)
        if (record.eventName === 'INSERT' || !record.dynamodb?.NewImage) {
            logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
            continue;
        }
        logger.info(`Successfully processed ${event.Records.length} records.`)

        const newItem = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as { datetime: string; venue: string; details: string};

        // const params = {
        //     Destination: {
        //         ToAddresses: ['remi.bougie@gmail.com'],
        //     },
        //     TemplateData
        // }
    }
    return { batchItemFailures: [] };
}