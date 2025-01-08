const orderDatabase = require("../../database/order_database/orderDatabase")

/***************
 * GETs
***************/
const getAll = async () => {
    try{
        let data = await orderDatabase.getAll();
        
        const uniqueIds = [...new Set(data.map(item => item.id))];
        let orders = [];
        uniqueIds.forEach(id => {

            let filtered_orders = data.filter(d => d.id == id);
            let order = {
                id:filtered_orders[0].id,
                name:filtered_orders[0].name,
                phone:filtered_orders[0].phone,
                time:filtered_orders[0].time,
                day:filtered_orders[0].day,
                total:filtered_orders[0].price,
                state:parseInt(filtered_orders[0].state),
                plates:[]
            }
            const plateIds = [...new Set(filtered_orders.map(item => item.plate_number))];
            plateIds.forEach(plate => {
                let filtered_plates = filtered_orders.filter(d => d.plate_number == plate);
                let newPlate = {
                    id:filtered_plates[0].plate_id,
                    plate_name:filtered_plates[0].plate_name,
                    price:filtered_plates[0].price, 
                    state:filtered_plates[0].plate_state,
                    description:filtered_plates[0].description,
                    extras:[],
                    number:filtered_plates[0].plate_number
                };
                filtered_plates.forEach(p => {
                    newPlate.extras.push({
                        extra:p.extra
                    })
                })
                order.plates.push(newPlate)
            });
            orders.push(order)
        })
        return orders
    } catch(e){return ''}
}


/***************
 * POSTs
***************/
const newOrder = async (user, order) => {
    let user_obj = user.getUser()
    user_obj.total = order.getTotal()
    let user_response = await orderDatabase.addOrderUser(user_obj);
    let sql_inserts = ''
    let sql_values = []
    order.plates.forEach((p,index) => {
        sql_inserts = `${sql_inserts} (?,?,?,?,?),`
        sql_values.push(user.phone, user.order_time, p.name, p.price,index+1)
    })
    sql_inserts = sql_inserts.slice(0, -1);
    let order_response = await orderDatabase.addOrderPlates(sql_inserts, sql_values);

    if(order_response.affectedRows > 0) return true;
    else return false
}

const updateState = async (order) => {
    return orderDatabase.updateState(order);
}

/***************
 * UPDATEs
***************/
const updatePlate = async (plate) => {
    return orderDatabase.updatePlate(plate);
}

module.exports = {getAll, newOrder, updatePlate, updateState}