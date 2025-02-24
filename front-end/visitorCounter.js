document.addEventListener('DOMContentLoaded', async (event) => {
    async function incrementVisitorCount() {
        try {
            const response = await fetch('https://y0218osvh0.execute-api.eu-central-1.amazonaws.com/prod/', 
                { method: 'POST' });
            if (!response.ok) throw new Error('Network response was not ok');
            console.log('Visitor count incremented');
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    async function getVisitorCount() {
        try {
            const response = await fetch('https://y0218osvh0.execute-api.eu-central-1.amazonaws.com/prod/',
                { method: 'GET' });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const responseBody = JSON.parse(data.body)
            console.log("Visitor count: " + responseBody.visitorCount);
            document.getElementById('visitor-count').innerText = responseBody.visitorCount;
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    await incrementVisitorCount();
    await getVisitorCount();
});
