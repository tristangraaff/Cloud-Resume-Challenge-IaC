const allowedOrigins = [
    "https://tristantech.org",
    "https://www.tristantech.org",
];

export const handler = async (event) => {
    console.log("Hello World");
    console.log(event);
    //const origin = 0;
    const origin = event.headers.Origin || event.headers.origin;
    let goodOrigin = false;

    if (origin) {
        allowedOrigins.forEach( allowedOrigin => {
            if (!goodOrigin && origin.match(allowedOrigin)) {
                goodOrigin = true;
            }
        });
    }

    return { //Hier async await met return van maken
        headers: {
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
            "Access-Control-Allow-Origin": goodOrigin ? origin : event.headers.Origin
        },
        //statusCode: 204
    }
}