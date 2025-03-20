import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient({ region: "eu-central-1" });

export const handler = async (event) => {
  console.log(event['http-method']);

  if (event['http-method'] === 'POST') {
    const params = {
      TableName: 'website-visits',
      Key: {
        'count_id': { 'S': 'total' }
      },
      UpdateExpression: 'ADD visitor_count :increment',
      ExpressionAttributeValues: {
        ':increment': { 'N': '1'},
      },
      ReturnValues: 'UPDATED_NEW'
    };
  
    try {
      await client.send(new UpdateItemCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Visitor count updated successfully' })
      };
    } catch (error) {
      console.error('Error updating visitor count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error updating visitor count' })
      }
    }
  }

  if (event['http-method'] === 'GET') {
    const params = {
      TableName: 'website-visits',
      Key: {
        'count_id': { 'S': 'total' }
      },
      ProjectionExpression: 'visitor_count'
    };

    try {
      const response = await client.send(new GetItemCommand(params));
      const visitorCount = response.Item.visitor_count.N;
      return {
        statusCode: 200,
        body: JSON.stringify({ visitorCount })
      };
    } catch (error) {
      console.error('Error retrieving visitor count:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Error retrieving visitor count' })
      };
    }
  }
}
