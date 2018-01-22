const ObjectId = require('mongoose').Types.ObjectId;

function Repository() {}

Repository.prototype.add = add;
Repository.prototype.deleteById = deleteById;
Repository.prototype.getAll = getAll;
Repository.prototype.getById = getById;
Repository.prototype.update = update;

function add(data, callback) {
    const model = this.model;
    const newItem = new model(data);
    newItem.save(callback);
}

function deleteById(id, callback) {
    const query = this.model.update({
        _id: id
    }, {isRemoved: true});
    query.exec(callback);
}

function getAll(callback) {
    const query = this.model.find({});
    query.exec(callback);
}

function getById(id, callback) {
    const query = this.model.findOne({
        _id: id
    });
    query.exec(callback);
}

function update(id, body, callback) {
    let query = this.model.update({_id: id}, body);
    query.exec(callback);
}

module.exports = Repository;
