

controller = () => {

    scope.new = {}
    scope.view = {}
    scope.view.text = {}
    scope.view.show = {search:false, tab:'one'}
    scope.view.text.class = "text-bold"
    scope.view.asc = true
    scope.view.search_field = ''

    scope.view.image = 'http://davidrozman.reformedreality.com/images/avatars/Test-Account2-1580413246402.png'

    scope.view.search = ''

    watch['view.search'] = function(newData, oldData){

        if (newData.length > 0){

            if (scope.table_items){

                scope.filteredTable = []
                let table_items = scope.table_items.slice(0)

                table_items.map(function (table_item) {

                    let re = RegExp(newData,'i')

                    table_item.name_full = ''
                    if (table_item.name.first && table_item.name.last){
                        table_item.name_full = table_item.name.first+' '+table_item.name.last
                    }

                    if (scope.view.search_field == 'name' && table_item.name_full.match(re) ||
                        !scope.view.search_field && table_item.name_full.match(re)) {
                        scope.filteredTable.push(table_item)
                    } else if (scope.view.search_field && table_item[scope.view.search_field].match(re)) {
                        scope.filteredTable.push(table_item)
                    }



                })

            }

        } else {
            scope.filteredTable = []
            scope.table_items.map(function (table_item) {
                scope.filteredTable.push(table_item)
            })

        }

    }

    scope.menu_items = [
        {name: 'Welcome', panel:'<h1>H1 Heading</h1><h2>H2 Heading</h2><h3>H3 Heading</h3><h4>Heading</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas sed sed risus pretium quam vulputate dignissim suspendisse in. Sed vulputate odio ut enim. Faucibus a pellentesque sit amet. Quam lacus suspendisse faucibus interdum posuere lorem. Porttitor massa id neque aliquam. Amet facilisis magna etiam tempor orci eu lobortis.</p><p>Integer eget aliquet nibh praesent tristique magna. Leo vel orci porta non pulvinar neque laoreet. Tincidunt tortor aliquam nulla facilisi cras. Ac turpis egestas maecenas pharetra convallis. Mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor.</p>', img:"https://i.imgur.com/4Kuye6W.jpg"},
        {name: 'What\'s it about?', panel:'<h1>What\'s it about?</h1>Something here', img:"https://i.imgur.com/emBm6jv.jpg"},
        {name: 'Responsive', panel:'<h1>Something Else</h1>Something else here', img:"https://i.imgur.com/l49aYS3.jpg"}
    ]

    scope.view.fields = [
        {name:'field group 1',selected_option:'one'},
        {name:'field group 2',selected_option:'two'},
        {name:'field group 13',selected_option:'three'},
        {name:'field group 4',selected_option:'four'},
    ]

    scope.view.options = [
        {name:'This is option 1',value:'one'},
        {name:'This is option 2',value:'two'},
        {name:'This is option 3',value:'three'},
        {name:'This is option 4',value:'four'},
        {name:'This is option 5',value:'five'}
    ]

    scope.showFields = function(){
        console.log(scope.view.fields)
    }

    scope.view.selected_option = ''

    scope.panel = scope.menu_items[0]

    scope.menuItems = function(){
        scope.menu_items.push({name: 'New Page', panel:'Hi there', class:"text-green"})
    }

    if (localStorage.getItem('table_items')){
        scope.table_items = JSON.parse(localStorage.getItem('table_items'))
    } else {
        scope.table_items = [
            {id:0,name:{first:'Lee',last:'Roberts'},description:'An exemplary employee',gender:'male',age:35},
            {id:1,name:{first:'Dilbert',last:'Andrews'},description:'An good employee',gender:'male',age:34},
            {id:3,name:{first:'Katie',last:'Roberts'},description:'An exemplary employee',gender:'female',age:33},
            {id:4,name:{first:'Scott',last:'Peterson'},description:'An exemplary employee',gender:'male',age:34},
            {id:6,name:{first:'Bredan',last:'McCaffery'},description:'A medium employee',gender:'male',age:32},
            {id:7,name:{first:'Jo',last:'Anderson'},description:'An good employee',gender:'female',age:31},
            {id:8,name:{first:'Sam',last:'Gamgee'},description:'An ok employee',gender:'male',age:30},
            {id:9,name:{first:'David',last:'Rozmand'},description:'An exemplary employee',gender:'male',age:45},
            {id:10,name:{first:'Sean',last:'Holtby'},description:'An exemplary employee',gender:'male',age:44},
            {id:11,name:{first:'Andy',last:'Burnham'},description:'An ok employee',gender:'female',age:43},
            {id:12,name:{first:'Dan',last:'Bold'},description:'An exemplary employee',gender:'male',age:42},
            {id:13,name:{first:'Sarah',last:'Frederik'},description:'An exemplary employee',gender:'female',age:41},
            {id:14,name:{first:'Mike',last:'Haggis'},description:'An ok employee',gender:'male',age:40},
            {id:15,name:{first:'Robert',last:'Bartrum'},description:'An terrible employee',gender:'male',age:39}
        ]
    }


    scope.filteredTable = scope.table_items


    scope.addNew = function(collection, obj){

        if (obj){
            let new_obj = JSON.parse(JSON.stringify(obj))
            scope[collection].push(new_obj)
            scope.filteredTable = []
            scope.table_items.map(function (table_item) {
                scope.filteredTable.push(table_item)
            })
            scope.resetNew()
            scope.saveTable(scope.table_items)
        }

    }

    scope.delete = function(collection, obj){

        let i = scope[collection].indexOf(obj)

        if (i >= 0){
            scope[collection].splice(i,1)
            scope.filteredTable = []
            scope.table_items.map(function (table_item) {
                scope.filteredTable.push(table_item)
            })
            // scope.saveTable(scope.table_items)
        }

    }

    scope.edit = function(collection, obj){

        scope.view.save_id = scope[collection].indexOf(obj)
        scope.new = obj
        scope.view.save = true

    }

    scope.update = function(collection, obj){

        if (obj){
            scope[collection][scope.view.save_id] = JSON.parse(JSON.stringify(obj))
            scope.filteredTable = []
            scope.table_items.map(function (table_item) {
                scope.filteredTable.push(table_item)
            })
            scope.resetNew()
            setTimeout(function(){
                scope.view.save_id = ''
                scope.saveTable(scope.table_items)
            },500)

        }

    }

    scope.saveTable = function(obj){
        localStorage.setItem('table_items',JSON.stringify(obj))
    }

    scope.sortTable = function(field, asc){

        field = field.split('.');
        var len = field.length;

        if (scope.view.asc){

            scope.filteredTable.sort(function (a, b) {
                var i = 0;
                while( i < len ) { a = a[field[i]]; b = b[field[i]]; i++; }
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            })

            scope.view.asc = false

        } else {

            scope.filteredTable.sort(function (b, a) {
                var i = 0;
                while( i < len ) { a = a[field[i]]; b = b[field[i]]; i++; }
                if (a < b) {
                    return -1;
                } else if (a > b) {
                    return 1;
                } else {
                    return 0;
                }
            })

            scope.view.asc = true

        }

    }

    scope.sortTable('name.last')

    scope.resetNew = function(){
        scope.view.save = false
        let new_obj = []
        for (var i in scope.new){
            scope.new[i] = ''
        }
    }

    scope.getName = function(text){
        return text+'!'
    }

    scope.parseName = function(obj){
        if (obj){
            return obj.first+' '+obj.last
        }

    }

    scope.staff = [{"_key":"54856400","_id":"staff/54856400","_rev":"_Z9uuWfO--_","name":{"first":"Charlotte","last":"Webb"},"avatar":"","salon_id":"54855602","level":"Junior"},{"_key":"54856317","_id":"staff/54856317","_rev":"_Z9uudDO--_","name":{"first":"Paulo","last":"Gio"},"avatar":"","salon_id":"54855602","level":"Mid"},{"_key":"60698299","_id":"staff/60698299","_rev":"_a-qjplm--_","name":{"first":"Lee","last":"Anderson"},"level":"Senior","salon_id":"54855602"},{"_key":"54856289","_id":"staff/54856289","_rev":"_Z9uunQa--_","name":{"first":"Micheal","last":"Butler"},"avatar":"","salon_id":"54855602","level":"Junior"},{"_key":"54856425","_id":"staff/54856425","_rev":"_Z9uuuIq--_","name":{"first":"Lucy","last":"Elliot"},"avatar":"","salon_id":"54855602","level":"Senior"}]

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
            list:'9',
            item:'Lee',
            service:'',
            staff:''
        }
    ]

    scope.newAppointment = function(){
        scope.appointments.push({
            list:9+scope.appointments.length,
            item:'Lee '+scope.appointments.length,
            service:'',
            staff:''
        })
    }

    scope.removeAppointment = function(){
        scope.appointments.splice(scope.appointments.length-1, 1)
    }


}
