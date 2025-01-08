const langService = require("../../services/lang_service/langService");

/***************
 * GETs
***************/
const getLanguages = async (req,res) => {
    try {
        let lang = await langService.getLanguages();
        if(lang && lang.length > 0) res.status(200).send({lang})
        else res.status(404).send({error:"Not found"})
    } catch(e) { res.status(500).send({error:"Internal server error"})}
}

/***************
 * POSTs
***************/
const addLang = async (req, res) => {
    let language = req.body;
    if(language.name && language.welcome){
        if(language.name.length > 2) {
            language.abr = language.name.toLowerCase().substring(0,3);
            try{
                let response = await langService.addLang(language);
                console.log(response)
                res.status(200).send({data:language});
            }catch(e){console.log(e);res.status(500).send({error:"Internal server error"})}
        } else res.status(422).send({error:"Wrong params"})
    } else res.status(422).send({error:"Wrong params"})
}

module.exports = {addLang,getLanguages}