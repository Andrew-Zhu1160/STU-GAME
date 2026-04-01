import crypto from 'crypto';

const ITERATIONS = 100000; // Standard for security vs speed
const KEYLEN = 64;        // Length of the final hash
const ALGO = 'sha512';    // Strongest hashing algorithm in crypto

/**
 * Creates a secure hash for a new password
 * @param {string} password 
 * @returns {Promise<string>} formatted as salt:hash
 */

export async function hashPassword(password) {
    return new Promise((resolve, reject) => {
        // 1. Generate a unique random salt for this user
        const salt = crypto.randomBytes(16).toString('hex');

        // 2. Hash the password with that salt
        crypto.pbkdf2(password, salt, ITERATIONS, KEYLEN, ALGO, (err, derivedKey) => {
            if (err) reject(err);
            // 3. Return both salt and hash joined by a colon
            resolve(`${salt}:${derivedKey.toString('hex')}`);
        });
    });
}

/**
 * Verifies if a password attempt matches the stored hash
 * @param {string} passwordAttempt - What the user just typed
 * @param {string} storedValue - The salt:hash string from your DB
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(passwordAttempt, storedValue) {
    return new Promise((resolve, reject) => {
        const [salt, storedHash] = storedValue.split(':');
        
        // Hash the new attempt using the SAME salt and settings
        crypto.pbkdf2(passwordAttempt, salt, ITERATIONS, KEYLEN, ALGO, (err, derivedKey) => {
            if (err) reject(err);
            
            const attemptHash = derivedKey.toString('hex');
            
            // crypto.timingSafeEqual is a pro-move to prevent "Timing Attacks"
            const match = crypto.timingSafeEqual(
                Buffer.from(storedHash, 'hex'),
                Buffer.from(attemptHash, 'hex')
            );
            resolve(match);
        });
    });
}


