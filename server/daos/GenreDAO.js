
class GenreDAO {
    constructor(name) {
        this.name = name;
    }

    getID() {
        return this.name;
    }

    getName() {
        return this.name;
    }
}

module.exports = GenreDAO;