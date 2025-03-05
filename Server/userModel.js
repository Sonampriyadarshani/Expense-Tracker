const db = require('../config/connectDB');

class UserModel {
    // ✅ Create a new user
    static async createUser(name, email, password) {
        try {
            const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            const [result] = await db.execute(query, [name, email, password]);
            console.log("✅ User Created with ID:", result.insertId);
            return result.insertId;
        } catch (err) {
            console.error("❌ Error in createUser:", err);
            throw err;
        }
    }

    // ✅ Find user by email
    static async findByEmail(email) {
        try {
            const query = `SELECT * FROM users WHERE email = ?`;
            const [result] = await db.execute(query, [email]);

            if (result.length === 0) {
                console.log("⚠️ User not found:", email);
                return null;
            }

            console.log("✅ User Found:", result[0]);
            return result[0];

        } catch (err) {
            console.error("❌ Error in findByEmail:", err);
            throw err;
        }
    }

    // ✅ Get user by ID
    static async findById(id) {
        try {
            const query = `SELECT * FROM users WHERE id = ?`;
            const [result] = await db.execute(query, [id]);
            
            if (result.length === 0) {
                console.log("⚠️ User ID not found:", id);
                return null;
            }

            return result[0];

        } catch (err) {
            console.error("❌ Error in findById:", err);
            throw err;
        }
    }
}

module.exports = UserModel;
