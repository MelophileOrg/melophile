// Dependencies
const jwt = require("jsonwebtoken");

// Key Retriever for Secret
let key = require("./KeyRetriever.js");

/////////////////////////////////////////////////////
// Functions ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Generate Token
 * Returns signed Json Web Token.
 * 
 * @return Json Web Token
 */
let generateToken = (data, expires) => {
    return jwt.sign(data, key.getServerSecret(), {
        expiresIn: expires
    });
};

/**
 * Verfiy Incoming Token
 * Middleware continues to next function
 * 
 */
let verifyToken = (req, res, next) => {
    const token = req.cookies["melophile-token"];
    if (!token) return res.status(403).send({
        message: "No token provided."
    });
    try {
        const decoded = jwt.verify(token, key.getServerSecret());
        req.userID = decoded.spotifyID;
        req.token = token;
        console.log("TOKEN");
        console.log(token);
        next();
    } catch(error) {
        console.log(error);
        return res.status(403).send({
            message: "Failed to authenticate token."
        });
    }
}

/**
 * Removes old tokens.
 * Removes all tokens that are no longer valid.
 * 
 * @return Array of tokens valid.
 */
let removeOldTokens = (tokens) => {
    return tokens.filter(token => {
        try {
            jwt.verify(token, key.getServerSecret());
            return true;
        } catch (error) {
            return false;
        }
    });
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyToken,
    removeOldTokens: removeOldTokens,
}