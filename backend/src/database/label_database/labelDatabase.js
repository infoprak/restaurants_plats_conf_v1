const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async (lang) => {
    const connection = await conn.connection();
    let sql = `    select ll.name, l.id 
    from labels l
    JOIN lang_label ll on l.id = ll.label_id and ll.lang_id = 1
	where l.state = 1`;
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

const getOne = async (name) => {
    const connection = await conn.connection();
    let sql = `select label_id from lang_label where name = ?`;
    try {
        let [rows, fields] = await connection.execute(sql, [name]);
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
const newLabel = async (label) => {
    const connection = await conn.connection();
    let sql = `insert into labels (icon) values ('fa-regular fa-circle-question')`;
    let sql2 = `insert into lang_label(lang_id, label_id, name) values (?,?,?)`;
    try {
        let [rows, fields] = await connection.execute(sql, []);
        let id = rows.insertId;
        if(id){
            let [rows, fields] = await connection.execute(sql2, [1,id,label.name]); 
        }
        return rows;
    } catch(err) {
        console.log(err);
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * UPDATEs
***************/
const updateLabel = async (id, state) => {
    const connection = await conn.connection();
    let sql = `update labels set state = ? where id = ?`;
    try {
        let [rows, fields] = await connection.execute(sql, [state, id]);
        return rows;
    } catch(err) {
        console.log(err);
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { getAll, getOne, newLabel, updateLabel }