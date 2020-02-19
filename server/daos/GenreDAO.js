
class GenreDAO {
    constructor(name) {
        this.name = name;
    }

    get _id() {
        return this.name;
    }

    get name() {
        return this.name;
    }
}

module.exports = GenreDAO;