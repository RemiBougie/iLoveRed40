import type { Handler, DynamoDBStreamHandler } from "aws-lambda";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import AWS from "aws-sdk";
import { Logger } from "@aws-lambda-powertools/logger";
import { removeListener } from "process";

// export const handler: Handler = async (event, context) => {
//     return 'Hello world!'
// }

const logger = new Logger({
  logLevel: "INFO",
  serviceName: "dynamo-db-stream-handler",
});

const cognito = new AWS.CognitoIdentityServiceProvider();

// const REGION = process.env.AWS_REGION ?? "us-east-1";
const REGION = "us-east-1";
const sesClient = new SESClient({ region: REGION });

const buildEmail = (item: Record<string, any>) => {
  return {
    Subject: { Data: "New Red40 Show Alert!" },
    Body: {
      Html: {
        Charset: "UTF-8",
        Data: `
            <html>
                <body>
                    <h1>New Red40 Show Alert!</h1>
                    <p><strong>Date/time:</strong> ${item.datetime}</p>
                    <p><strong>Location:</strong> ${item.venue}</p>
                    <p><strong>Details:</strong> ${item.details}</p>
                    <br/>
                    <p>To opt out of receiving emails, log into our website at www.ilikered40.com to change your preferences!</p>
                </body>
            </html>
            `,
      },
      Text: {
        Charset: "UTF-8",
        Data: `
            New Red40 Show Alert!

            Date/time: ${item.datetime}
            Location: ${item.venue}
            Details: ${item.details}

            To opt out of receiving emails, log into our website at www.ilikered40.com to change your preferences!
            `,
      },
    },
  };
};

// const email_template = {
//     "Template": "EmailTemplate",
//     "SubjectPart": "New Show Added!",
//     "HtmlPart": "<h1>NEW RED40 GIG!!</h1><p><strong>Datetime:<strong>{{datetime}}</p>",
//     "TextPart": "New Show Datetime: {{datetime}}"
// }

export const handler: DynamoDBStreamHandler = async (event) => {
  for (const record of event.Records) {
    logger.info(`Processing record: ${record.eventID}`);
    logger.info(`Event Type: ${record.eventName}`);
    if (record.eventName !== "INSERT" || !record.dynamodb?.NewImage) {
      logger.info(`New Image: ${JSON.stringify(record.dynamodb?.NewImage)}`);
      continue;
    }
    logger.info(`Successfully processed ${event.Records.length} records.`)

    try {
      logger.info(`About to read new DynamoDB item...`);
      const newItem = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage
      );
      const { datetime, venue, details } = newItem;
      logger.info(
        `Datetime: ${datetime}, Venue: ${venue}, Details: ${details}`
      );

      const params = {
        Source: "remi.bougie@ilikered40.com",
        Destination: {
          ToAddresses: ["remi.bougie@gmail.com"],
        },
        Message: buildEmail({ datetime, venue, details }),
        // Message: {
        //     Subject: { Data: "Testing!" },
        //     Body: {
        //         Text: { Data: "Testing!"}
        //     }
        // }
      };

      logger.info(`About to call SES...`);
      const cmd = new SendEmailCommand(params);
      const res = await sesClient.send(cmd);
      logger.info(`SES Reponse Metadata: ${res.$metadata.httpStatusCode}`);
      logger.info(`"Email sent, MessageId:", ${res.MessageId}`);
    } catch (err: any) {
      logger.info(`'SES send failure: ', ${err}`);
      throw err;
    }
  }
  return { batchItemFailures: [] };
};
