// src/models/UserModel.js
import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'Users';

export default class UserModel {
    constructor() {
        // pode deixar vazio ou remover se não usar
    }

    /**
     * Cria um novo usuário
     * IMPORTANTE: a senha já deve chegar HASHEADA (hash é feito no controller)
     */
    create = async (userData) => {
        const db = getDB();
        const payload = {
            ...userData,                    // recebe email, password (já hasheada)
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection(COLLECTION).insertOne(payload);

        if (result.insertedId) {
            return { _id: result.insertedId, ...payload };
        }
        return null;
    };


    /**Busca todos os usuarios */

    findAll = async () => {
        const db = getDB();
        return await db.collection(COLLECTION).find().toArray();
    };


    /**
     * Busca usuário por ID
     */
    findById = async (id) => {
        if (!ObjectId.isValid(id)) return null;

        const db = getDB();
        return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    };

    /**
     * Busca usuário por email
     */
    findByEmail = async (email) => {
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ email });
    };

    /**
     * (Opcional) Atualiza usuário – útil para mudança de senha, etc.
     */
    updateById = async (id, updateData) => {
        if (!ObjectId.isValid(id)) return false;

        const db = getDB();
        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        return result.modifiedCount > 0;
    };
}