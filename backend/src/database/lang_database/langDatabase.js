const conn = require('../mysql');

/***************
 * GETs
***************/
const getLanguages = async () => {
    const connection = await conn.connection();
    let sql = `select * from lang`;
    try {
        let [rows, fields] = await connection.execute(sql, []);
        return rows;
    } catch(err) {
        console.log(err);
        return err;
    } finally {
        connection.release();
    }
}

const getTranslations = async (lang) => {
    const connection = await conn.connection();
    let sql = `select abr from lang where abr != ?`;
    try {
        let [rows, fields] = await connection.execute(sql, [lang]);
        return rows;
    } catch(err) {
        console.log(err);
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * POSTs
***************/
const addLang = async (language) => {
    const connection = await conn.connection();
    let sql = `insert into lang (name, abr, welcome) values (?,?,?)`
    let sql_plat = `alter table plate add column (name_${language.abr} varchar(25), description_${language.abr} text);`;
    let sql_labels = `alter table labels add column (name_${language.abr} varchar(25));`;
    let sql_extras = `alter table extras add column (name_${language.abr} varchar (25));`;
    try {
        let [rows, fields] = await connection.execute(sql_extras, [])
        let [rows2, fields2] = await connection.execute(sql_labels, [])
        let [rows3, fields3] = await connection.execute(sql_plat, [])
        let [rows4, fields4] = await connection.execute(sql, [language.name, language.abr, language.welcome])
        return rows;
    } catch(err) {
        console.log(err);
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { addLang, getLanguages, getTranslations }