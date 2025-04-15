jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn(() => ({
        send: jest.fn(() => ({
            statusCode: 200,
            body: JSON.stringify({ message: 'Visit count updated successfully.' }),
        })),
    })),
}));

import { expect, jest } from '@jest/globals';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { handler } from '../../lambda/countNumberOfWebsiteVisits.mjs';

describe("handler function", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return a 403 error message and allowMultipleOrigins response payload when status code is 403", async () => {        
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

        LambdaClient.prototype.send = jest.fn(() => {
            return mockResponse;
        });
        const functionResponse = await handler(event);

        expect(functionResponse.errorMessage).toContain('allowMultipleOrigins function returned a 403!');
        expect(functionResponse.allowMultipleOriginsResponse.statusCode).toBe(403);
        expect(functionResponse.allowMultipleOriginsResponse.body).toContain("Forbidden: Origin not allowed.");
    });

    it("should return a 500 statuscode and 'Unexpected error sending allowMultipleOrigins command' message when the catch block is activated", async () => {
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
        expect(functionResponse.body.message).toContain("Unexpected error sending allowMultipleOrigins command");
    });

    // Try dependency injection with DynamoDB mock
    it.only("should return a success resonse when processing a valid POST request", async () => {
        const event = {
            "headers": { 
                "Origin": "https://tristantech.org"
                },
            "statusCode": 200,
            "http-method": "POST"
        }

        const allowMultipleOriginsMockResponse = {
            Payload: new TextEncoder().encode(JSON.stringify({
                statusCode: 200,
                headers: { "Access-Control-Allow-Origin": "https://tristantech.org" },
            })),
        }

        const lambdaResponse = LambdaClient.prototype.send = jest.fn(() => {
            return allowMultipleOriginsMockResponse;
        });
        console.log(allowMultipleOriginsMockResponse);
        console.log(JSON.parse(Buffer.from(allowMultipleOriginsMockResponse.Payload).toString()));
        
        DynamoDBClient.prototype.send = jest.fn(() => {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Visit count updated successfully.' }),
            }
        });

        const functionResponse = await handler(event);
        console.log(functionResponse);
        expect(functionResponse.statusCode).toBe(200);
        expect(functionResponse.body).toContain("{ message: 'Visit count updated successfully.' }");
    });
});
