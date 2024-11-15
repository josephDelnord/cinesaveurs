import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configuration pour __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Affichons les chemins pour déboguer
console.log('__dirname:', __dirname);
console.log('Path to public:', path.join(__dirname, '../public'));
console.log('Path to index.html:', path.join(__dirname, '../public/index.html'));

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Simplifié

// Routes
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: './public' }); // Méthode alternative
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});