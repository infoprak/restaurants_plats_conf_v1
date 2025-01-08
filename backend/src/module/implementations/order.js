module.exports = class Order {
    plates = []; error = false;

    constructor(plates){
        try{
            console.log(plates.length)
            if(plates && plates.length > 0){
                plates.forEach(p => {
                    this.plates.push({name:p.name, price:p.price})
                })
            }
        } catch(e){this.error = true}
    }

    checkOrder(){
        let error = false;
        console.log(this.plates)
        if(this.plates.length == 0) error = true;
        if(this.error) error = true;
        return error
    }

    getTotal(){
        let total = 0;
        this.plates.forEach(p=>total+=parseFloat(p.price))
        return total
    }

    getPlates(){return this.plates}

}