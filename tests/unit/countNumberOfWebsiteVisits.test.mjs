import { expect, jest } from '@jest/globals';
//import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { handler } from '../../lambda/countNumberOfWebsiteVisits.mjs';
//jest.mock("@aws-sdk/client-dynamodb");

describe('handler function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    // it('should return a 403 error message and allowMultipleOrigins response payload when status code is 403', async () => {
    //     const mockSendMethod = jest.fn();
    //     jest.mock("@aws-sdk/client-lambda", () => ({
    //         LambdaClient: jest.fn(() => ({
    //             send: mockSendMethod,
    //         })),
    //     }));

        
    //     const event = {
    //         "headers": { 
    //             "Origin": "https://example.org"
    //             },
    //         "statusCode": 200,
    //         "http-method": "GET"
    //     }

    //     const mockResponse = {
    //         Payload: new TextEncoder().encode(JSON.stringify({
    //             statusCode: 403,
    //             headers: { "Content-Type": "text/plain" },
    //             body: "Forbidden: Origin not allowed."
    //         })),
    //     }

    //     mockSendMethod.mockResolvedValue(mockResponse);
    //     const functionResponse = await handler(event);

    //     expect(functionResponse.errorMessage).toContain('allowMultipleOrigins function returned a 403!');
    //     expect(functionResponse.allowMultipleOriginsResponse.statusCode).toBe(403);
    //     expect(functionResponse.allowMultipleOriginsResponse.body).toContain("Forbidden: Origin not allowed.");
    // });

    it('should return a 500 statuscode and \'Error sending allowMultipleOrigins command\' message when the catch block is activated', async () => {
        // jest.mock("@aws-sdk/client-lambda", () => ({
        //     LambdaClient: jest.fn(() => ({
        //         send: jest.fn(() => {
        //             console.log("Mocked send invoked");
        //             throw new Error("Simulated error for testing.");
        //         })
        //     }))
        // }))

        const event = {
            "headers": { 
                "Origin": "https://tristantech.org"
                },
            "statusCode": 200,
            "http-method": "GET"
        }

        LambdaClient.prototype.send = jest.fn(() => {
            throw new Error("Simulated error for testing purposes");
        });

        const functionResponse = await handler(event);
        expect(functionResponse.statusCode).toBe(500);
        expect(functionResponse.body.message).toContain("Error sending allowMultipleOrigins command");
    })
});
