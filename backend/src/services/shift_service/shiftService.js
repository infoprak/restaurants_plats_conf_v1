const shiftDatabase = require("../../database/shift_database/shiftDatabase");

/***************
 * GETs
***************/
const getAll = async () => {
    let shifts = await shiftDatabase.getAll();
    shifts.forEach(s => {
        let hour = (s.time).toString().substring(0,2)
        let min = (s.time).toString().substring(2,4)
        s.time = `${hour}:${min}`
    })
    return shifts
}

const getCalendar = async () => {
    let row_calendar = await shiftDatabase.getCalendar();
    let calendar = [];
    let uniqueIds = [...new Set(row_calendar.map(c => c.id))];

    uniqueIds.forEach(id => {
        let sameIdRegisters = row_calendar.filter(c => c.id == id);
        let recurrent = {
            "id": sameIdRegisters[0].id,
            "dia": sameIdRegisters[0].dia,
            "mes": sameIdRegisters[0].mes,
            "any": sameIdRegisters[0].any,
            "laboral": sameIdRegisters[0].laboral,
            "dia_setmana": sameIdRegisters[0].dia_setmana,
            "torns":[]
        }
        sameIdRegisters.forEach(reg => {recurrent.torns.push({inici:reg.inici, fi:reg.fi})});
        calendar.push(recurrent)
    });

    return calendar;
}

/***************
 * POSTs
***************/
const updateCalendar = async (recurrent, type) => {
    let newRule = {
        dia:null,
        mes:null,
        any:null,
        laboral:recurrent.laboral,
        dia_setmana:null
    }
    let torns = await shiftDatabase.getTorns(recurrent.torns);
    let recurrent_id;
    response = true;
    switch (type){
        case('date'):
            if(recurrent.dia && recurrent.mes && recurrent.any){
                newRule.dia = recurrent.dia;
                newRule.mes = recurrent.mes;
                newRule.any = recurrent.any;
                recurrent_id = await shiftDatabase.setRuleDate(newRule);
            } else response = false;
          break;
        case('year'):
            console.log('year')
            if(recurrent.dia && recurrent.mes){
                newRule.dia = recurrent.dia;
                newRule.mes = recurrent.mes;
                recurrent_id = await shiftDatabase.setRuleYear(newRule);
            } else response = false;
          break;
        case('week'):
            if(recurrent.dia_setmana){
                newRule.dia_setmana = recurrent.dia_setmana;
                recurrent_id = await shiftDatabase.setRuleWeek(newRule);
            } else response = false;
          break;
        case('all'):
            recurrent_id = await shiftDatabase.getLaboralId();
          break;
    }
    if(response){
        let result = await shiftDatabase.updateDayShifts(torns, recurrent_id);
        return result
    } else return false
}

module.exports = { getAll, getCalendar, updateCalendar }