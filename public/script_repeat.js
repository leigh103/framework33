controller = () => {

    scope.view = {}


    scope.staff = JSON.parse('[{"_key":"54856400","_id":"staff/54856400","_rev":"_Z9uuWfO--_","name":{"first":"Charlotte","last":"Webb"},"avatar":"","salon_id":"54855602","level":"Junior"},{"_key":"54856317","_id":"staff/54856317","_rev":"_Z9uudDO--_","name":{"first":"Paulo","last":"Gio"},"avatar":"","salon_id":"54855602","level":"Mid"},{"_key":"60698299","_id":"staff/60698299","_rev":"_a-qjplm--_","name":{"first":"Lee","last":"Anderson"},"level":"Senior","salon_id":"54855602"},{"_key":"54856289","_id":"staff/54856289","_rev":"_Z9uunQa--_","name":{"first":"Micheal","last":"Butler"},"avatar":"","salon_id":"54855602","level":"Junior"},{"_key":"54856425","_id":"staff/54856425","_rev":"_Z9uuuIq--_","name":{"first":"Lucy","last":"Elliot"},"avatar":"","salon_id":"54855602","level":"Senior"}]')

    scope.services = [{"_key":"60697672","_id":"services/60697672","_rev":"_a_sgkZK--_","name":"Cut and Blow Dry","description":"Simple cut and blow dry","category":"hair, cuts","duration":"45","price":"50","min_price":"40","max_price":"60","jnr_price":"40","snr_price":"60","linked_service":"","weekly_discount":"1","required_skills":["stylist"],"salon_id":"54855602"},{"_key":"60697764","_id":"services/60697764","_rev":"_a_sh_ZG--_","name":"we","description":"wef","category":"wef","duration":"wef","price":"wef","min_price":"wef","max_price":"wef","jnr_price":"wef","snr_price":"wef","linked_service":"wef","required_skills":["stylist","colourist"],"weekly_discount":"1","salon_id":"54855602"},{"_key":"60386750","_id":"services/60386750","_rev":"_a_sgrcy--_","name":"Hair Color","description":"Hair colour application","category":"hair, colour","price":"0","min_price":"0","max_price":"0","jnr_price":"0","snr_price":"0","linked_service":"","salon_id":"54855602","required_skills":["stylist","colourist"],"weekly_discount":"1","duration":"60"},{"_key":"60253337","_id":"services/60253337","_rev":"_a_sgzfy--_","name":"Hair cut and colour","description":"Hair cut and colour","category":"cuts, colour, hair","price":"70","min_price":"60","max_price":"80","jnr_price":"60","snr_price":"80","linked_service":"60386750","salon_id":"54855602","required_skills":["stylist","colourist"],"weekly_discount":"1","duration":"30"},{"_key":"60252992","_id":"services/60252992","_rev":"_a_sgadC--_","name":"Hair cut","description":"Hair cut","category":"cuts, hair","price":"50","min_price":"40","max_price":"60","jnr_price":"40","snr_price":"60","linked_service":"","salon_id":"54855602","weekly_discount":"1","required_skills":["stylist"],"duration":"30"}]

    scope.getHrs = function() {

        let hrs = [], time

        for(i=6; i<24; i++) {

            time = ''

            for (ii=0; ii<=45; ii += 15) {

                if (i < 10){
                    time = '0'+i+':'
                } else {
                    time = i+':'
                }

                if (ii < 10){
                    time = time+'0'+ii
                } else {
                    time = time+ii
                }

                hrs.push(time)

                if (ii==45){

                    if (i==23){
                        return hrs
                    }

                }

            }

        }

    }

    scope.getDurationHrs = function() {

        let duration_hrs = [], time

        for(i=0; i<9; i++) {

            time = ''

            for (ii=0; ii<=45; ii += 15) {

                time = i+'hr '

                if (ii < 10){
                    time = time+'0'+ii
                } else {
                    time = time+ii
                }

                if (i == 0 && ii == 0){

                } else {
                    duration_hrs.push(time)
                }

                if (ii==45 && i == 8){
                    return duration_hrs
                }

            }


        }

    }

    scope.appointments = [
        {
            start_time:'9',
            staff_id:'Lee'
        }
    ]

    scope.newAppointment = function(){
        scope.appointments.push({
            start_time:9+scope.appointments.length,
            staff_id:'Lee '+scope.appointments.length
        })
    }

    scope.removeAppointment = function(){
        scope.appointments.splice(scope.appointments.length-1, 1)
    }

}
