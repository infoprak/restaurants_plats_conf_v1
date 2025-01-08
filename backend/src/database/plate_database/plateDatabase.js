const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async (lang) => {
    const connection = await conn.connection();
    let sql = `select 
    p.id, p.time_minutes, p.preu, p.image, p.state, p.special, 
    lp.name, lp.description
    from plate p
    JOIN plate_lang lp on lp.plate_id = p.id
    where lp.lang_id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getLabels = async (lang) => {
    const connection = await conn.connection();
    let sql = `select 
    pl.plate_id, l.icon,ll.name as name
    from plate_labels pl
    JOIN labels l on pl.label_id = l.id
    JOIN lang_label ll on  l.id = ll.label_id
    JOIN plate p on pl.plate_id = p.id
	where ll.lang_id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang]);
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getTranslations = async () => {
    const connection = await conn.connection();
    let sql = `select pl.id, pl.name, pl.description, l.id as lang_id, l.abr as lang_name, pl.plate_id
    from plate_lang pl
    left join lang l on l.id = pl.lang_id`;
    response = true
    try{
        const [rows, fields] = await connection.execute(sql, []);
        return rows;
    }catch(err){
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * POSTs
***************/
const newPlate = async (img, price) => {
    const connection = await conn.connection();
    let sql = `insert into plate(image, preu) values (?,?)`;
    try {
        const [rows, fields] = await connection.execute(sql, [img, price]);
        return rows
    } catch(err) {
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

const addPlateLang = async (plate, num_languages) => {
    const connection = await conn.connection();
    let values = [plate.id, plate.name, plate.description]
    let sql = `insert into plate_lang(lang_id, plate_id, name, description) values (1,?,?,?),`;
    for(let i =1; i<num_languages; i++){
        sql += `(${i+1}, ?, '', '' ),`;
        values.push(plate.id)
    }
    sql = sql.substring(0, sql.length - 1);
    try {
        const [rows, fields] = await connection.execute(sql, values);
        return rows
    } catch(err) {
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * UPDATEs
***************/
const updatePlate = async (plate) => {
    const connection = await conn.connection();
    let sql = `update plate set preu = ? where id = ?`;
    response = true;
    try {
        const [rows, fields] = await connection.execute(sql, [plate.preu, plate.id])
    } catch(err) {
        response = false
        return err;
    } finally {
        connection.release();
        return response
    }
}

const updateLabels = async (labels, id) => {
    const connection = await conn.connection();
    let sql_delete = `delete from plate_labels where plate_id = ? `;
    let sql_insert = `insert into plate_labels(plate_id, label_id) values `;
    let insert_values = [];

    labels.forEach(l => {
        sql_insert += `(?,?),`
        insert_values.push(id)
        insert_values.push(l.id)
    });
    sql_insert = sql_insert.substring(0, sql_insert.length - 1);
    response = true
    try{
        const [rows, fields] = await connection.execute(sql_delete, [id]);
        if(insert_values.length > 0) {
            const [rows2, fields2] = await connection.execute(sql_insert, insert_values);
        }
    }catch(err){
        console.log(err);
        response = false;
    } finally {
        connection.release();
        return response
    }
}

const updateTranslations = async (translations) => {
    const connection = await conn.connection();

    let sql = `update plate_lang set name = ?, description = ? where id = ?`
    result = true
    try {
        for(let i = 0; i < translations.length; i++){
            try{
                const [rows, fields] = await connection.execute(sql, [translations[i].name,translations[i].description, translations[i].id]);
            }
            catch(e){ console.log(e); result = false}
        }
    }catch(err){
        console.log(err);
        result = false
    } finally {
        connection.release();
        return result
    }
}

const uploadImage = async (img, id) => {
    const connection = await conn.connection();
    let sql = `update plate set image = ? where id = ?`
    result = true
    try {
        const [rows, fields] = await connection.execute(sql, [img, id]);
    }catch(err){
        console.log(err);
        result = false
    } finally {
        connection.release();
        return result
    }
}

/***************
 * DELETEs
***************/
const deletePlate = async (plate) => {
    const connection = await conn.connection();
    let labels_delete = `delete from plate_labels where plate_id = ? `;
    let plate_delete = `delete from plate where id = ?`;

    try{
        const [rows, fields] = await connection.execute(labels_delete, [plate]);
        const [rows2, fields2] = await connection.execute(plate_delete, [plate]);
        return rows;
    }catch(err){
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { 
    addPlateLang,
    deletePlate, 
    getAll, 
    getLabels, 
    getTranslations,
    newPlate,
    uploadImage,
    updateLabels, 
    updatePlate, 
    updateTranslations
}