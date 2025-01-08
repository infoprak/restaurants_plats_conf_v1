const orderService = require("../../services/order_service/orderService");
const User = require("../../module/implementations/user")
const Order = require("../../module/implementations/order")

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    try{
        let orders = await orderService.getAll();
        if(orders.length > 0) res.status(200).send(orders)
        else res.status(404).send({error:"No orders found"})
    } catch(e){res.status(500).send({error:"Internal server error"})}
}

/***************
 * POSTs
***************/
const newOrder = async (req, res) => {
    if(req.body.user && req.body.plates){
        let user = new User(req.body.user)
        let order = new Order(req.body.plates)

        if(!user.checkFields() && !order.checkOrder()){
            try{
                let result = await orderService.newOrder(user, order);
                if(result) res.status(200).send({data:"OK"})
                else {res.status(402).send({data:"Could not add the order"})}
            } catch(e){res.status(500).send({error:"Internal server error"})}
        } else res.status(422).send({error:"Wrong params"})
    } else res.status(422).send({error:"Wrong params"})
}

const updateState = async (req, res) => {
    let order = req.body;
    if(order.day && order.phone){
        let response = await orderService.updateState(order)
        if(response) res.status(200).send({data:"OK"})
        else res.status(402).send({error:"Could not update"})
    } else res.status(422).send({error:"Wrong params"})
}

/***************
 * UPDATEs
***************/
const updatePlate = async (req, res) => {
    let plate = req.body.plate;
    plate.id = req.body.id

    if(plate.id){
        try{
            plate.price = parseFloat(plate.price)
            let response = await orderService.updatePlate(plate);
            if(response) res.status(200).send({data:"OK"})
            else res.status(402).send({error:"Could not update"})
        } catch(err){
            res.status(500).send({error:"Internal server error"});
        }
    } else res.status(422).send({error:"Wrong params"});
}

module.exports = { getAll, newOrder, updatePlate, updateState }