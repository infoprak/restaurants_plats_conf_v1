const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async () => {
    const connection = await conn.connection();

    let sql2 = `select 
    o.*,
    op.price as plate_price,
    op.plate_id,
    op.state as plate_state,
    op.plate_number,
    op.plate_id, 
    op.id as order_plate_id
    from orders o 
    join order_plates op on o.id = op.order_id
    order by day, time`;
    let sql =  `select 
    o.*,
    op.price as plate_price,
    op.plate_id,
    op.description,
    op.state as plate_state,
    op.plate_number,
    op.plate_id, 
    op.id as order_plate_id,
    op.description,
    pl.name as plate_name,
    le.name as extra
    from orders o 
    left join order_plates op on o.id = op.order_id
    left join plate_lang pl on op.plate_id = pl.plate_id
    left join plate_extras pe on pe.plate_id = op.id
    left join lang_extras le on le.extra_id = pe.extra_id and le.lang_id = 1
    where pl.lang_id = 1 
    order by day, time,id;`
    try{
        const [rows, fields] = await connection.execute(sql, [])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

/***************
 * POSTs
***************/
const addOrderUser = async (order) => {
    const connection = await conn.connection();

    let sql = `insert into orders(name, phone, time, day, price, order_time) values (?,?,?,?,?,?)`;
    try{
        const [rows, fields] = await connection.execute(sql, [order.name, order.phone, order.time, order.day, order.total, order.order_time])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}
const addOrderPlates = async (sql_inserts, sql_values) => {
    const connection = await conn.connection();

    let sql = `insert into order_plates(order_id, plate_id, price, plate_number) values${sql_inserts}`;
    try {
        const [rows, fields] = await connection.execute(sql, sql_values)
        return rows;
    } catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const updateState = async (order) => {
    const connection = await conn.connection();

    let sql = `update orders set state = ? where id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [order.state, order.id])
        return rows;
    }catch(err){
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
    let sql = `update order_plates set state = ? where order_id= ? and plate_number = ?`;
    try {
        const [rows, fields] = await connection.execute(sql, [plate.state,plate.id, plate.number])
        return rows;
    } catch(err){
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { addOrderPlates, addOrderUser, getAll, updatePlate, updateState }