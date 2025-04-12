import { expect, jest } from '@jest/globals';
import { handler } from '../../lambda/countNumberOfWebsiteVisits.mjs';
//import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

//jest.mock("@aws-sdk/client-dynamodb");

const mockSendMethod = jest.fn();
jest.mock("@aws-sdk/client-lambda", () => ({
    LambdaClient: jest.fn(() => ({
        send: mockSendMethod,
    })),
}));

describe('handler function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return a 403 error message and allowMultipleOrigins response payload when status code is 403', async () => {
        const event = {
            "headers": { 
                "Origin": "https://example.org"
                },
            "statusCode": 200,
            "http-method": "GET"
        }

        const mockResponse = {
            Payload: new TextEncoder().encode(JSON.stringify({
                statusCode: 403,
                headers: { "Content-Type": "text/plain" },
                body: "Forbidden: Origin not allowed."
            })),
        }

        mockSendMethod.mockResolvedValue(mockResponse);
        const functionResponse = await handler(event);

        expect(functionResponse.errorMessage).toContain('allowMultipleOrigins function returned a 403!');
        expect(functionResponse.allowMultipleOriginsResponse.statusCode).toBe(403);
        expect(functionResponse.allowMultipleOriginsResponse.body).toContain("Forbidden: Origin not allowed.");
    });

    it('should return a 500 statuscode and \'Error sending allowMultipleOrigins command\' message when the catch block is activated', async () => {
        const event = {
            "headers": { 
                "Origin": "https://tristantech.org"
                },
            "statusCode": 200,
            "http-method": "GET"
        }

        mockSendMethod.mockRejectedValue(new Error("Simulated error"));
        const functionResponse = await handler(event);
        console.log(functionResponse);
    })
});
