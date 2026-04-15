import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { rows } = await sql`SELECT * FROM tasks ORDER BY id ASC;`;
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            // Fallback data if the table hasn't been created yet
            return res.status(200).json([
                { id: 1, text: 'Create tasks table in Vercel Query Dashboard', completed: false },
                { id: 2, text: 'Wait for table creation', completed: false }
            ]);
        }
