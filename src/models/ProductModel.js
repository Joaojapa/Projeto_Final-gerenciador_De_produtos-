import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'products';

export class ProductModel {
    constructor(parameters) {

    }


    create = async (productData) => {
        const db = getDB();
        const result = await db.collection(COLLECTION).insertOne({
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return { _id: result.insertedId, ...productData };
    };

    findAll = async () => {
        const db = getDB();
        return await db.collection(COLLECTION).find().toArray();
    };

    findById = async (id) => {
        if (!ObjectId.isValid(id)) return null;
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    };

    update = async (id, updateData) => {
        if (!ObjectId.isValid(id)) return null;
        const db = getDB();
        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } }
        );
        return result.modifiedCount > 0;
    };

    remove = async (id) => {
        if (!ObjectId.isValid(id)) return false;
        const db = getDB();
        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    };
}