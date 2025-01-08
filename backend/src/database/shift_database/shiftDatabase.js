const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async () => {
    const connection = await conn.connection();
    let sql = `select * from torn`;
    try{
        const [rows, fields] = await connection.execute(sql, [])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getCalendar = async () => {
    const connection = await conn.connection();
    let sql = `select r.*,s.inici, s.fi from recurrents r
    left join day_shifts df on r.id = df.id_recurrent
    left join shifts s on df.id_shift = s.id`;
    try{
        const [rows, fields] = await connection.execute(sql, [])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getLaboralId = async () => {
    const connection = await conn.connection();
    let sql = `select id from recurrents where dia IS NULL and dia_setmana IS NULL`;
    try{
        const [rows, fields] = await connection.execute(sql, [])
        console.log(rows)
        return rows[0].id;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * POSTs
***************/
const checkShift = async (shift) => {
    const connection = await conn.connection();
    let sql = `select id from shifts where inici = ? and fi = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [shift.inici, shift.fi])
        let id;
        if(rows.length > 0) id=rows[0].id
        else {
            sql = `insert into shifts(inici, fi) values (?,?)`
            const [rows2, fields2] = await connection.execute(sql, [shift.inici, shift.fi]);
            console.log(rows2)
            id = rows2.insertId;
        }
        console.log(id);
        return id;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const setRuleDate = async (newRule) => {
    const connection = await conn.connection();
    let sql = `select * from recurrents where dia = ? and mes = ? and any = ?`;
    try {
        const [rows, fields] = await connection.execute(sql, [newRule.dia, newRule.mes, newRule.any])
        if(rows.length > 0) { // update
            sql = `update recurrents set laboral = ? where id = ?`;
            const [rows2, fields2] = await connection.execute(sql, [newRule.laboral, rows[0].id]);
            return rows[0].id
        } else { // insert
            sql = `insert into recurrents(dia, mes, any, laboral) values (?,?,?,?)`
            const [rows3, fields3] = await connection.execute(sql, [newRule.dia,newRule.mes, newRule.any, newRule.laboral])
            return rows3.insertId
        }
    } catch(err) {
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

const setRuleYear = async (newRule) => {
    const connection = await conn.connection();
    let sql = `select * from recurrents where dia = ? and mes = ? and any is null`;
    try {
        const [rows, fields] = await connection.execute(sql, [newRule.dia, newRule.mes, newRule.any])
        if(rows.length > 0) { // update
            sql = `update recurrents set laboral = ? where id = ?`;
            const [rows2, fields2] = await connection.execute(sql, [newRule.laboral, rows[0].id]);
            return rows[0].id
        } else { // insert
            sql = `insert into recurrents(dia, mes, laboral) values (?,?,?)`
            const [rows3, fields3] = await connection.execute(sql, [newRule.dia,newRule.mes, newRule.laboral])
            return rows3.insertId
        }
    } catch(err) {
        return err;
    } finally {
        connection.release();
    }
}

const setRuleWeek = async (newRule) => {
    const connection = await conn.connection();
    let sql = `select * from recurrents where dia_setmana = ?`;
    try {
        const [rows, fields] = await connection.execute(sql, [newRule.dia_setmana])
        if(rows.length > 0) { // update
            sql = `update recurrents set laboral = ? where id = ?`;
            const [rows2, fields2] = await connection.execute(sql, [newRule.laboral, rows[0].id]);
            return rows[0].id
        } else { // insert
            sql = `insert into recurrents(dia_setmana, laboral) values (?,?)`
            const [rows3, fields3] = await connection.execute(sql, [newRule.dia_setmana, newRule.laboral])
            return rows3.insertId
        }
    } catch(err) {
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

const getTorns = async (torns) => {
    const connection = await conn.connection();
    let ids = []
    let sql = `select id from shifts where inici = ? and fi = ?`;
    try{
        for(let i = 0; i<torns[0].length;i++ ){
            if(torns[1][i]){
                let inici = torns[0][i];
                let fi = torns[1][i];
                const [rows, fields] = await connection.execute(sql, [inici, fi])
                if(rows[0]) ids.push(rows[0])
                else {
                    let sql2 = `insert into shifts(inici, fi) values (?,?)`
                    const [rows2, fields2] = await connection.execute(sql2, [inici, fi])
                    if(rows2.insertId) ids.push(rows2.insertId)
                }
            }
        }
        return ids;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const updateDayShifts = async (torns, recurrent_id) => {
    const connection = await conn.connection();
    let sql = `select id_shift from day_shifts where id_recurrent = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [recurrent_id]) // returns old values
        // delete common values
        let newValues = torns.filter(id => !rows.includes(id.id));
        let oldValues = rows.filter(id => !torns.includes(id));

        // delete old values
        for(let i = 0; i<oldValues.length;i++){
            let sql2 = `delete from day_shifts where id_shift = ? and id_recurrent = ?`
            const [rows2, fields2] = await connection.execute(sql2, [oldValues[i].id_shift,recurrent_id])
        }
        // insert new values
        for(let i = 0; i<newValues.length;i++){
            let sql2 = `insert into day_shifts(id_shift, id_recurrent ) values (?,?)`;
            const [rows2, fields2] = await connection.execute(sql2, [newValues[i], recurrent_id])
        }
        return rows;
    } catch(err) {
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { getAll, getCalendar, getLaboralId, getTorns, setRuleDate, setRuleWeek, setRuleYear, updateDayShifts, updateDayShifts }