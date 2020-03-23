// Dependencies
const express = require("express");
const router = express.Router();

// Model's Data Access Objects (DAO)
let AlbumDAO = require("../daos/AlbumDAO.js");

/////////////////////////////////////////////////////
// Endpoints ////////////////////////////////////////
/////////////////////////////////////////////////////

/**
 * Base Data
 * Returns base data for album object. 
 * 
 * @param id ID of Album desired
 * @return Object with Album Properties.
 */
router.put("/:id", auth.verify, User.verify, async (req, res) => {
    try {
        let album = await new AlbumDAO(req.params.id);
        return res.send(await album.getData(req.spotifyAPI));
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

// Export
module.exports = {
    routes: router,
}