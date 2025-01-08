const shiftService = require("../../services/shift_service/shiftService");

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    try{
        let shift = await shiftService.getAll();
        if(shift.length > 0) res.status(200).send({shift})
        else res.status(404).send({error:"No shifts found"})
    } catch(e){console.log(e);res.status(500).send({error:"Internal server error"})}
}

const getCalendar = async (req, res) => {
    try {
        let calendar = await shiftService.getCalendar();
        if(calendar) res.status(200).send(calendar);
        else res.status(404).send({error:"Not found"})
    } catch(e) { console.log(e); res.status(500).send("Internal server error") }
}

/***************
 * POSTs
***************/
const updateCalendar = async (req, res) => {
    let recurrent = req.body.newRule;
    let type = req.body.type;
    console.log(recurrent);
    console.log(type);
    if(recurrent && type){
        try {
            let response = await shiftService.updateCalendar(recurrent, type);
            console.log('@@@@@@@@')
            console.log(response)
            res.status(200).send(response)
        } catch(e){res.status(500).send({error:"Internal server error"})}
    } else res.status(422).send({error:"Wrong params"})
}

module.exports = {getAll, getCalendar, updateCalendar}