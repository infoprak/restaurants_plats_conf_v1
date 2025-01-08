const langDatabase = require("../../database/lang_database/langDatabase");

/***************
 * GETs
***************/
const getLanguages = async () => {
    return await langDatabase.getLanguages();
}

const getTranslations = async (language) => {
    return await langDatabase.getTranslations(language)
}
/***************
 * POSTs
***************/
const addLang = async (language) => {
    return await langDatabase.addLang(language)
}


module.exports = {addLang, getLanguages, getTranslations}