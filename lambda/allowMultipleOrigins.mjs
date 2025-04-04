const allowedOrigins = [
    "https://tristantech.org",
    "https://www.tristantech.org",
];

export const handler = async (event) => {
    const origin = event.headers.Origin
    const allowedOrigin = allowedOrigins.find((allowed) => origin && origin.match(allowed));

    if (!allowedOrigin) {
        return {
            statusCode: 403,
            headers: {
                "Content-Type": "text/plain"    
            },
            body: "Forbidden: Origin not allowed."
        }
    }

    return {
        statusCode: 200, 
        headers: {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Origin": allowedOrigin
        }
    }
}