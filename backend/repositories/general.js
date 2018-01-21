class generalRepository {

    constructor (dbRef) {
        this.dbRef = dbRef
    }

    findAll(callback) {
        return this.dbRef.once('value')
    }

    findById(id) {
        return this.dbRef.child(id).once('value')
    }
    
    add(data) {
        return this.dbRef.push(data)
    }
    
    update(id, data, callback) {
        return this.dbRef.child(id).update(data)
    }
}

module.exports = generalRepository;
