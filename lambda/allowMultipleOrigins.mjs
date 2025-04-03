const allowedOrigins = [
    "https://tristantech.org",
    "https://www.tristantech.org",
];

export const handler = async (event) => {
    const origin = event.headers.Origin
    let goodOrigin = false;

    if (origin) {
        allowedOrigins.forEach( allowedOrigin => {
            if (!goodOrigin && origin.match(allowedOrigin)) {
                goodOrigin = true;
            }
        });
    }

    return { 
        headers: {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Origin": origin
        },
        //statusCode: 204
    }
}