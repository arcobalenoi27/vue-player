var crypto  =  require('crypto');

const hashPassword = (password) => {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 1000;
    crypto.DEFAULT_ENCODING = 'hex';
    var hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
    return {
        salt: salt,
        hash: hash,
        iterations: iterations
    }
}


const isPasswordCorrect = (savedHash, savedSalt, savedIterations, passwordAttempt) => {
    crypto.DEFAULT_ENCODING = 'hex';
    return savedHash == crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, 64, 'sha512');
}

module.exports = {
    isPasswordCorrect: isPasswordCorrect,
    hashPassword: hashPassword
}