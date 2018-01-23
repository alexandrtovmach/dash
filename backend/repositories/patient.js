const Repository = require('./general'),
    Patient = require('../schemas/Patient');

function PatientRepository() {
    Repository.prototype.constructor.call(this);
    this.model = Patient;
}

PatientRepository.prototype = new Repository();


PatientRepository.prototype.getPatientByEmail = getPatientByEmail;
PatientRepository.prototype.findById = findById;
PatientRepository.prototype.getPatientByQuery = getPatientByQuery;
PatientRepository.prototype.getPatientByToken = getPatientByToken;
PatientRepository.prototype.addEmail = addEmail;
PatientRepository.prototype.processRequest = processRequest;
PatientRepository.prototype.getPatientsFromArrayID = getPatientsFromArrayID;
PatientRepository.prototype.addAchievementByPatientId = addAchievementByPatientId;
PatientRepository.prototype.searchByKey = searchByKey;

function getPatientByEmail(email, callback) {
    const query = this.model.findOne({email: email});
    query.exec(callback);
}

function getPatientByToken(token, callback) {
    const query = this.model.findOne({activateToken: token});
    query.exec(callback);
}

function findById(id, callback) {
    const query = this.model.findOne({_id: id});
    query.exec(callback);
}

function searchByKey(key, callback) {
    const query = this.model.find(
        { $or: 
            [
                {
                    "nameEnglish" : {
                        $regex: key,
                        $options: 'i'
                    }
                },
                {
                    "nameArabic" : {
                        $regex: key,
                        $options: 'i'
                    }
                },
                {
                    "mobile" : {
                        $regex: key,
                        $options: 'i'
                    }
                },
                {
                    "nationalId" : {
                        $regex: key,
                        $options: 'i'
                    }
                },
                {
                    "address" : {
                        $regex: key,
                        $options: 'i'
                    }
                },
                {
                    "nameEnglish" : {
                        $regex: key,
                        $options: 'i'
                    }
                }
            ]
        }
    ).limit(10);
    // const query = this.model.find({$text: {$search: key}}).limit(10);
    query.exec(callback);
}
function getPatientByQuery(queryObj, callback) {
    const query = this.model.findOne(queryObj);
    query.exec(callback);
}

function addEmail(id, email, callback) {
    const query = this
        .model
        .update({
            _id: id
        }, {
            $addToSet: {
                secondaryEmails: email
            }
        });
    query.exec(callback);
}

function processRequest(id, body, callback) {
    const removeRequestQuery = this.model.update(
        {
            _id: id
        }, {
            $unset: {
                requestForCoaching: false
            }
        });
    removeRequestQuery.exec(callback);

    if (body.isCoach) {
        const makeCoachQuery = this.model.update(
            {
                _id: id
            }, {
                $set: {
                    isCoach: body.isCoach
                }
            }
        );
        makeCoachQuery.exec(callback);
    }
}

function getPatientsFromArrayID(array, params, callback) {
    if (params.fields === undefined) {
        params.fields = null;
    }
    const query = this.model.find().where('_id').in(array).select(params.fields);
    query.exec(callback);
}

function addAchievementByPatientId(id, body, callback) {
    const query = this.model.update({
        _id: id
    }, {
        $push: { 'achievements': body}
    });
    query.exec(callback);
}

module.exports = new PatientRepository();