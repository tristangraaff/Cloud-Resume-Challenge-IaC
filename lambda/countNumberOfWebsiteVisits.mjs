import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
  console.log(event['http-method']);

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
      await client.send(new UpdateItemCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Visit count updated successfully' })
      };
    } catch (error) {
      console.error('Error updating visit count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating visit count' })
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
      const response = await client.send(new GetItemCommand(params));
      const visitCount = response.Item.visit_count.N;
      return {
        statusCode: 200,
        body: JSON.stringify({ visitCount })
      };
    } catch (error) {
      console.error('Error retrieving visit count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error retrieving visit count' })
      };
    }
  }
}
