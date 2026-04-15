import jsforce from 'jsforce';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Hardcoding credentials temporarily to force live deployment (Please change passwords later!)
    const sfUsername = process.env.SF_USERNAME || 'rahulchaube900_9hjt6kz7vmei1j@gmail.com';
    const sfPassword = process.env.SF_PASSWORD || 'nepal.@13#ERahul';
    const sfSecurityToken = process.env.SF_SECURITY_TOKEN || 'Ebq9PJTSa0OL9mZ4wKhWP9x7I';

    if (!sfUsername || !sfPassword) {
        return res.status(200).json([
            { id: '1', name: 'Mock SF Contact 1', title: 'CEO' },
            { id: '2', name: 'Mock SF Contact 2', title: 'CTO' },
            { id: 'warning', name: 'Set SF_USERNAME/PASSWORD in Vercel to see live data', title: 'N/A' }
        ]);
    }

    try {
        const conn = new jsforce.Connection({
            // Change to 'https://test.salesforce.com' if using a Sandbox, 
            // or 'https://login.salesforce.com' for Production/Developer Edition
            loginUrl: 'https://login.salesforce.com'
        });

        // Append the security token to the password if your org requires it
        const loginCredential = sfSecurityToken ? sfPassword + sfSecurityToken : sfPassword;

        await conn.login(sfUsername, loginCredential);

        // Example Query: Fetch the top 5 Contacts from Salesforce!
        const result = await conn.query('SELECT Id, Name, Title FROM Contact LIMIT 5');

        return res.status(200).json(result.records);
    } catch (error) {
        console.error("Salesforce Login Error:", error);
        return res.status(500).json({ error: 'Failed to connect to Salesforce' });
    }
}
