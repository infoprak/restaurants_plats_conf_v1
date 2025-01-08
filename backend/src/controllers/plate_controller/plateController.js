const multer = require('multer');

const platesService = require("../../services/plate_service/plateService");
const langService = require("../../services/lang_service/langService");

/***************
 * GETs
***************/
const getAll = async (req, res) => {
    let lang = req.query.lang;
    try{
        let languages = await langService.getTranslations(lang);
        if(languages){
            let plates = await platesService.getAll(lang, languages);
            if(plates.length > 0) res.status(200).send({plates})
            else res.status(404).send({error:"No plates found"})
        }
    } catch(e){res.status(500).send({error:"Internal server error"})}
}

const getTranslations = async (req, res) => {
    try {
        let translations = await platesService.getTranslations();
        if(translations.length > 0) res.status(200).send({translations})
        else res.status(404).send({error:"No plates found"})
    } catch(e){console.log(e);res.status(500).send({error:"Internal server error"})}

}

/***************
 * POSTs
***************/
const newPlate = async (req, res) => {
    let file = req.file;
    let plate = JSON.parse(req.body.plate);
    if(plate){
        try{
            let img = ''
            if(file) img = file.buffer;
            let plate_id = await platesService.newPlate(img, plate.price);
            if(plate_id?.insertId){
                plate.id = plate_id.insertId;
                await platesService.addPlateLang(plate);
                res.status(200).send({id: plate.id})
            } else res.status(401).send({error:"Could not create plate"})
        } catch(e){res.status(500).send({error:"Internal server error"})}
    } else res.status(422).send({error:"Wrong params"})
}

/***************
 * UPDATEs
***************/
const updatePlate = async (req, res) => {
    // split labels and translations from plate
    let plate = JSON.parse(req.body.plate);
    let labels = plate.labels;
    let translations = JSON.parse(req.body.plate_lang);

    if(plate && labels && translations){
        try{ 
            let response = await platesService.updatePlate(plate,labels,translations);
            if(response) {
                if(req.file?.buffer){
                    let img = req.file.buffer;
                    response = await platesService.uploadImage(img, plate.id)
                    if(response) res.status(200).send(response)
                    else res.status(403).send({error:"Something happened"})
                } else res.status(200).send(response)
            } else res.status(403).send({error:"Something happened"})
        } catch(e){ res.status(500).send("Internal server error")}
    } else res.status(422).send({error:"Wrong params"})
}


/***************
 * DELETEs
***************/
const deletePlate = async (req, res) => {
    let plate = req.query.id;
    if(plate){
        try{
            let response = await platesService.deletePlate(plate);
            if(response) res.status(202).send({data:"OK"})
            else res.status(404).send({error:"Plate not found"})
        } catch(e){ res.status(500).send("Internal server error")}
    } else res.status(422).send({error:"Wrong params"})
}

module.exports = { deletePlate, getAll, getTranslations, newPlate, updatePlate }