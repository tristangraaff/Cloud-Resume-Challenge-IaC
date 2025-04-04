import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
const dynamoDBClient = new DynamoDBClient({ region: "eu-central-1" });
const lambdaClient = new LambdaClient();

export const handler = async (event) => {
  console.log(event['http-method']);

  const allowMultipleOriginsParams = {
    FunctionName: 'allowMultipleOrigins',
    InvocationType: 'RequestResponse',
    Payload: JSON.stringify(event)
  }

  let returnCommand = 'Command was not sent succesfully.';

  try {
    await lambdaClient.send(new InvokeCommand(allowMultipleOriginsParams));
    returnCommand = 'Command was sent succesfully.';
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending allowMultipleOrigins command' })
    }
  }


  if (event['http-method'] === 'POST') {
    const params = {
      TableName: 'website-visits-iac',
      Key: {
        'count_id': { 'S': 'total' }
      },
      UpdateExpression: 'ADD visit_count :increment',
      ExpressionAttributeValues: {
        ':increment': { 'N': '1'},
      },
      ReturnValues: 'UPDATED_NEW'
    };
  
    try {
      await dynamoDBClient.send(new UpdateItemCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: returnCommand + ' Visit count updated successfully.' })
      };
    } catch (error) {
      console.error('Error updating visit count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: returnCommand + ' Error updating visit count' })
      }
    }
  }

  if (event['http-method'] === 'GET') {
    const params = {
      TableName: 'website-visits-iac',
      Key: {
        'count_id': { 'S': 'total' }
      },
      ProjectionExpression: 'visit_count'
    };

    try {
      const response = await dynamoDBClient.send(new GetItemCommand(params));
      const visitCount = response.Item.visit_count.N;
      return {
        statusCode: 200,
        body: JSON.stringify({ visitCount, returnCommand })
      };
    } catch (error) {
      console.error('Error retrieving visit count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: returnCommand + ' Error retrieving visit count' })
      };
    }
  }
}
