const labelService = require("../../services/label_service/labelService")

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    lang = req.query.lang;
    try{
        let labels = await labelService.getAll(lang)
        if(labels.length > 0) res.status(202).send(labels)
        else res.status(404).send({error:"Labels not found"})
    }catch(e){res.status(500).send({error:"Internal server error"})}
}

/***************
 * POSTs
***************/
const newLabel = async (req, res) => {
    let label = req.body
    if(label.name){
        try{
            let response = labelService.newLabel(label);
            if(response) res.status(202).send({data:"OK"});
            else res.status(403).send({error:"Could not create the label"})
        } catch(e){res.status(500).send({error:"Internal server error"})}
    } else res.status(422).send({error:"Wrong params"})
}

/***************
 * DELETEs
***************/
const deleteLabel = async (req,res) => {
    let id = req.query.id;
    if(id){
        try {
            let response = await labelService.deleteLabel(id);
            console.log(response);
            res.status(200).send({data:"OK"})
        } catch(e){res.status(500).send({error:"Internal server error"})}
    } else res.status(422).send({error:"Empty params"})
}

module.exports = { deleteLabel, getAll, newLabel }