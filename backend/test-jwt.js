const jwt = require('jsonwebtoken');

const token = process.argv[2];
console.log("Token:", token);

try {
    const decoded = jwt.decode(token);
    console.log("Decoded Token:", decoded);

    // Try to verify with the dev_secret string from auth.module.ts
    jwt.verify(token, 'change_me_to_a_long_random_secret');
    console.log("Verified with dotenv secret change_me_to_a_long_random_secret");
} catch (e) {
    console.log("Error verify secret 1:", e.message);

    try {
        jwt.verify(token, 'dev_secret');
        console.log("Verified with fallback secret dev_secret");
    } catch (e2) {
        console.log("Error verify secret 2:", e2.message);
    }
}
