// Dependencies
const mongoose = require('mongoose');

class UserDAO {
    constructor(id, data) {
        this._id = id;
        if (data) {
            this.username = ('username' in data ? data.username : null);
            this.images = ('username' in data ? data.images : null);
        }
    }

    async getData() {
        try {
            if (this.username == null || this.images == null)
                await retrieveData();
            return {
                _id: this._id,
                username: this.username,
                images: this.images,
            }
        } catch (error) {
            throw error;
        }
    }

    async retrieveData() {
        try {
            if (this.username != null && this.images != null) return;
            let user = User.findOne({
                spotifyID: this._id
            });
            this.username = user.username;
            this.images = user.images;
        } catch (error) {
            throw error;
        }
    }
}
// Export
module.exports = UserDAO;