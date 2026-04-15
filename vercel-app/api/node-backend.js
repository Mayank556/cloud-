export default function handler(req, res) {
    // This is a serverless function running on Vercel's backend
    res.status(200).json({
        message: 'Hello from the Node.js Serverless Backend component!',
        timestamp: new Date().toISOString()
    });
}
