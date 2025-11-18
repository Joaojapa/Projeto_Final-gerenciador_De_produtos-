import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;

let client;
let db;

export const connectDB = async () => {
    if (db) return db;
    try {
        client = new MongoClient(MONGO_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('MongoDB conectado com sucesso');
        return db;
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
};

export const getDB = () => {
    if (!db) throw new Error('Banco de dados não conectado');
    return db;
};