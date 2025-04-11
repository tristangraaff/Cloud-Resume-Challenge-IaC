import { handler } from '../../lambda/countNumberOfWebsiteVisits.mjs';

describe('handler function', () => {
    it('should allow a request from an allowed origin', async () => {
        const event = {
            headers: {
                Origin: "https://tristantech.org"
            }
        };
        
        const response = await handler(event);
        
        expect(response.statusCode).toBe(200);
        expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://tristantech.org");
    });

    it('should allow a request from another allowed origin', async () => {
        const event = {
            headers: {
                Origin: "https://www.tristantech.org"
            }
        };
        
        const response = await handler(event);
        
        expect(response.statusCode).toBe(200);
        expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://www.tristantech.org");
    });

    it('should reject a request from a disallowed origin', async () => {
        const event = {
            headers: {
                Origin: "https://unknownorigin.com"
            }
        };
        
        const response = await handler(event);
        
        expect(response.statusCode).toBe(403);
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });

    it('should reject a request with no origin header', async () => {
        const event = {
            headers: {}
        };
        
        const response = await handler(event);
        
        expect(response.statusCode).toBe(403);
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });
});
