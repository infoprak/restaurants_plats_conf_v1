module.exports = class User {
    name; phone; day; time; order_time;
    constructor(user){
        this.name = user?.name ? user.name : '';
        this.phone = user?.phone ? user.phone : '';
        this.day = user?.day ? user.day : '';
        this.time = user?.time ? user.time : '';
        this.order_time = this.getTimeNow()
    }

    getUser(){
        return {name:this.name, phone:this.phone, day:this.day, time:this.time, order_time:this.order_time}
    }



    checkFields(){
        let error = false
        let error_tmp = this.checkName()
        if(error_tmp) error = true;
        error_tmp = this.checkPhone()
        if(error_tmp) error = true;
        error_tmp = this.checkDay()
        if(error_tmp) error = true;
        return error
    }

    // PRIVATE FUNCTIONS
    
    addLeadingZero(num) {
        return num < 10 ? `0${num}` : num;
    }
    getTimeNow(){
          const now = new Date();
          
          const day = now.getDate();
          const month = now.getMonth() + 1;
          const year = now.getFullYear();
          
          const hours = this.addLeadingZero(now.getHours());
          const minutes = this.addLeadingZero(now.getMinutes());
          const seconds = this.addLeadingZero(now.getSeconds());
          
          return `${year}/${month}/${day}-${hours}:${minutes}:${seconds}`
    }

    checkName(){
        let minChars = 2
        let maxChars = 25

        let result = false
        if(this.name != ''){
            let hasNumber = /\d/;   
            if(!hasNumber.test(this.name)){
                if(this.name.length < minChars ) result = true // min 2
                if(this.name.length > maxChars ) result = true // max 25
            } else result = true // contains numbers
        } else result = true // empty field
        return result
    }

    checkPhone(){
        const phonePattern = /^\d{9}$/
        let phone = this.phone.replace(/\s+/g, '');

        let result = false
        if(!phonePattern.test(phone)) result = true
        return result
    }
    checkDay(){
        const date = new Date(this.day);
        let today = new Date()
        today.setHours(0, 0, 0, 0);

        let result = false
        if (!isNaN(date.getTime())) {
            if(date<today) result = true // date in the past
        } else result = true // invalid date
        
        return result
    }
}