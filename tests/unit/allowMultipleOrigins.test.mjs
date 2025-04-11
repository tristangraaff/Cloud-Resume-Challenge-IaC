import { handler } from '../../lambda/allowMultipleOrigins.mjs';

describe('handler function tests', () => {
    it('should allow a request from a valid origin', async () => {
        const event = {
            headers: {
                Origin: "https://tristantech.org"
            }
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://tristantech.org");
    });

    it('should allow a request from another valid origin', async () => {
        const event = {
            headers: {
                Origin: "https://www.tristantech.org"
            }
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(200);
        expect(response.headers["Access-Control-Allow-Origin"]).toBe("https://www.tristantech.org");
    });

    it('should reject a request from an invalid origin', async () => {
        const event = {
            headers: {
                Origin: "https://unauthorized-origin.com"
            }
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(403);
        expect(response.headers["Content-Type"]).toBe("text/plain");
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });

    it('should reject a request with no Origin header', async () => {
        const event = {
            headers: {}
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(403);
        expect(response.headers["Content-Type"]).toBe("text/plain");
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });

    it('should reject a request with an empty string as Origin', async () => {
        const event = {
            headers: {
                Origin: ""
            }
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(403);
        expect(response.headers["Content-Type"]).toBe("text/plain");
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });

    it('should reject a request with null as Origin', async () => {
        const event = {
            headers: {
                Origin: null
            }
        };

        const response = await handler(event);

        expect(response.statusCode).toBe(403);
        expect(response.headers["Content-Type"]).toBe("text/plain");
        expect(response.body).toBe("Forbidden: Origin not allowed.");
    });
});
