import { jest } from '@jest/globals';
import { handler } from '../../lambda/countNumberOfWebsiteVisits.mjs';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";


//jest.mock("@aws-sdk/client-dynamodb");
jest.mock("@aws-sdk/client-lambda");

describe('handler function', () => {
    //const mockDynamoDBClient = DynamoDBClient.prototype;
    const mockLambdaClient = LambdaClient.prototype;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return a 403 error message and allowMultipleOrigins response payload when status code is 403', async () => {   
        const event = {
            "headers": { 
                "Origin": "https://tristantech.org"
                },
            "statusCode": 200,
            "http-method": "GET"
        }

        const allowMultipleOriginsResponsePayload = {
            statusCode: 403,
            headers: {
                "Content-Type": "text/plain"    
            },
            body: "Forbidden: Origin not allowed."
        }
        
        mockLambdaClient.send.mockResolvedValueOnce({
            Payload: Buffer.from(JSON.stringify(allowMultipleOriginsResponsePayload)),
        });

        const response = await handler(event);

        expect(response).toContain('allowMultipleOrigins function returned a 403!');
        expect(response).toContain('{}'); // Decoded empty response
        //expect(mockLambdaClient.send).toHaveBeenCalledWith(expect.any(InvokeCommand));
    });
});
