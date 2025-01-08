const plateDatabase = require("../../database/plate_database/plateDatabase");
const langService = require("../lang_service/langService")

/***************
 * GETs
***************/
const getAll = async (lang, languages) => {
    let plates = await plateDatabase.getAll(lang, languages);
    let labels = await plateDatabase.getLabels(lang);
    plates.forEach(p => {
        let labels_tmp = labels.filter(l => l.plate_id == p.id)
        p.labels = [];
        labels_tmp.forEach(l => {
            p.labels.push({id:l.plate_id, name:l.name, icon:l.icon})
        });
    });
    return plates
}

const getTranslations = async () => {
    return await plateDatabase.getTranslations()
}

/***************
 * POSTs
***************/
const newPlate = async (img, price) => {
    return await plateDatabase.newPlate(img, price)
}

const addPlateLang = async (plate) => {
    console.log('AAAA')
    num_languages = await langService.getLanguages();
    console.log(num_languages)
    return await plateDatabase.addPlateLang(plate, num_languages.length)
}

/***************
 * UPDATEs
***************/
const updatePlate = async (plate, labels, translations) => {
    // update labels
    let resp_labels = await plateDatabase.updateLabels(labels, plate.id);
    // update plate
    let resp_plate = await plateDatabase.updatePlate(plate);
    // update translations
    let resp_translation = await plateDatabase.updateTranslations(translations);

    if(resp_labels && resp_plate && resp_translation) return true
    else return false
}

const uploadImage = async (img, id) => {
    return await plateDatabase.uploadImage(img, id)
}

/***************
 * DELETEs
***************/
const deletePlate = async (plate) => {
    return plateDatabase.deletePlate(plate);
}

module.exports = { addPlateLang, deletePlate, getAll, getTranslations, newPlate, uploadImage, updatePlate }