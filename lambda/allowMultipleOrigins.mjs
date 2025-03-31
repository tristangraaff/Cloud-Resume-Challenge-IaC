const allowedOrigins = [
    "https://tristantech.org",
    "https://www.tristantech.org",
];

export const handler = (event) => {
    const origin = event.headers.Origin || event.headers.origin;
    let goodOrigin = false;

    if (origin) {
        allowedOrigins.forEach( allowedOrigin => {
            if (!goodOrigin && origin.match(allowedOrigin)) {
                goodOrigin = true;
            }
        });
    }

    context.succeed({ //Hier async await met return van maken
        headers: {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Origin": goodOrigin ? origin : allowedOrigins[0]
        },
        statusCode: 204
    });
}