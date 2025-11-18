import { getDB } from '../config/database.js';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';


const COLLECTION = 'Users';

export default class UserModel {
    constructor(parameters) {

    }


    create = async (userData) => {
        const { email, password } = userData;
        const db = getDB();
        return db.collection(COLLECTION).insertOne({
            email,
            password: await bcrypt.hash(password, 10),
            createdAt: new Date(),
            updatedAt: new Date()

        }
        )
    };

    findById = async (id) => {
        if (!ObjectId.isValid(id)) return null;
        const db = getDB();
        return await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
    };

    findByEmail = async (email) => {
        const db = getDB();
        return db.collection(COLLECTION).findOne({ email });
    }


}