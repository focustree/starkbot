import bcrypt from "bcrypt";

export function hashPass(plain) {
    return bcrypt.hash(plain, 10).then((hash) => {
        return hash;
    });
}

export async function checkPass(plain, hash) {
    return await bcrypt.compare(plain, hash).then((result) => {
        return result;
    });
}