const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


const Patient = new Schema(
    {
        "serial" : String,
        "account" : ObjectId,
        "branch": ObjectId,
        "nameEnglish": String,
        "nameArabic": String,
        "mobile": String,
        "phone": Number,
        "birthday": Date,
        "occupation": String,
        "nationalId": String,
        "address": String,
        "nationality": String,
        "referral": String,
        "status": String,
        "category": String
    },
    {
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    }
);

Patient.index({nameEnglish: 'text', nameArabic: 'text', mobile: 'text', nationalId: 'text', address: 'text'});

module.exports = mongoose.model('patientRecords', Patient, 'patientRecords');
