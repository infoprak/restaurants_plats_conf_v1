const labelDatabase = require("../../database/label_database/labelDatabase")

/***************
 * GETs
***************/
const getAll = async (lang) => {
    return await labelDatabase.getAll(lang)
}

/***************
 * POSTs
***************/
const newLabel = async (label) => {
    let label_exists = await labelDatabase.getOne(label.name)
    let response 
    if(label_exists.length > 0) response = await labelDatabase.updateLabel(label_exists[0].label_id, 1)
    else response =  await labelDatabase.newLabel(label)
}

/***************
 * DELETEs
***************/
const deleteLabel = async (id) => {
    return await labelDatabase.updateLabel(id, 0)
}

module.exports = { deleteLabel, getAll, newLabel }