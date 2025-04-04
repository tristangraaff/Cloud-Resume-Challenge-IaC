document.addEventListener('DOMContentLoaded', async (event) => {
    async function incrementVisitCount() {
        try {
            const response = await fetch('https://a3sfkwdhr3.execute-api.eu-central-1.amazonaws.com/prod/visitors', 
                { method: 'POST' });
            if (!response.ok) throw new Error('Network response was not ok');
            console.log('Visit count incremented');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function getVisitCount() {
        try {
            const response = await fetch('https://a3sfkwdhr3.execute-api.eu-central-1.amazonaws.com/prod/visitors',
                { method: 'GET' });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const responseBody = JSON.parse(data.body)
            console.log(responseBody);
            console.log("Visit count: " + responseBody.visitCount);
            document.getElementById('visit-count').innerText = responseBody.visitCount;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function sendOPTIONSrequest() {
        try {
            const response = await fetch('https://a3sfkwdhr3.execute-api.eu-central-1.amazonaws.com/prod/visitors', 
                { method: 'OPTIONS' });
            if (!response.ok) throw new Error('Network response was not ok');
            console.log("Request was sent.");
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    await sendOPTIONSrequest();
    await incrementVisitCount();
    await getVisitCount();
});
