

controller = () => {

    scope.new = {}
    scope.view = {}
    scope.view.text = {}
    scope.view.show = {search:false, tab:'one'}
    scope.view.tabs = [
        {name:'one'},
        {name:'two'},
        {name:'three'}
    ]
    scope.view.text.class = 'true'
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

    scope.alert = function(data){
        console.log(data)
    }

    scope.view.selected_option = ''

    scope.panel = scope.menu_items[0]

    scope.menuItems = function(){
    //    scope.menu_items.push({name: 'New Page', panel:'Hi there', class:"text-green"})
    }

    scope.chgPanel = function(menu_item){

        scope.panel = menu_item
    }

    if (localStorage.getItem('table_items')){
        scope.table_items = JSON.parse(localStorage.getItem('table_items'))
    } else {
        scope.table_items = [
            {id:0,name:{first:'Dave',last:'Roberts'},description:'Gamer, works hard, non-smoker',gender:'male',age:35, truth:false},
            {id:1,name:{first:'Dilbert',last:'Andrews'},description:'Reader, bit lazy, likes art and coffee',gender:'male',age:41, truth:false},
            {id:3,name:{first:'Katie',last:'Roberts'},description:'Non-smoker, gamer, purple hair',gender:'female',age:26, truth:false},
            {id:4,name:{first:'Scott',last:'Peterson'},description:'Smoker, loyal, works hard',gender:'male',age:34, truth:true}
        ]
    }

    scope.genders = [
        {name:"male"},
        {name:"female"}
    ]

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
        scope.view.save = true
        scope.new = obj

    }

    scope.update = function(collection, obj){

        if (obj){
            scope[collection][scope.view.save_id] = JSON.parse(JSON.stringify(obj))
            scope.filteredTable = []
            scope.table_items.map(function (table_item) {
                scope.filteredTable.push(table_item)
            })

            scope.new = {}
            scope.view.save_id = ''
            scope.saveTable(scope.table_items)

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

        // setTimeout(function(){
        // scope.view.save = false
        //
        // scope.new = {}
        // console.log('resetnew',scope.new)
        // },1000)
    }

    scope.getName = function(text){
        return text+'!'
    }

    scope.parseName = function(obj){
        if (typeof obj == 'object'){
            return obj.first+' '+obj.last
        }

    }

    scope.staff = [
        {"_key":"54856400","_id":"staff/54856400","_rev":"_Z9uuWfO--_","name":{"first":"Charlotte","last":"Webb"},"avatar":"","salon_id":"54855602","level":"Junior"},
        {"_key":"54856317","_id":"staff/54856317","_rev":"_Z9uudDO--_","name":{"first":"Paulo","last":"Gio"},"avatar":"","salon_id":"54855602","level":"Mid"},
        {"_key":"60698299","_id":"staff/60698299","_rev":"_a-qjplm--_","name":{"first":"Lee","last":"Anderson"},"level":"Senior","salon_id":"54855602"},
        {"_key":"54856289","_id":"staff/54856289","_rev":"_Z9uunQa--_","name":{"first":"Micheal","last":"Butler"},"avatar":"","salon_id":"54855602","level":"Junior"},
        {"_key":"54856425","_id":"staff/54856425","_rev":"_Z9uuuIq--_","name":{"first":"Lucy","last":"Elliot"},"avatar":"","salon_id":"54855602","level":"Senior"}
    ]

    scope.services = [
        {"_key":"60697672","_id":"services/60697672","_rev":"_a_sgkZK--_","name":"Cut and Blow Dry","description":"Simple cut and blow dry","category":"hair, cuts","duration":"45","price":"50","min_price":"40","max_price":"60","jnr_price":"40","snr_price":"60","linked_service":"","weekly_discount":"1","required_skills":["stylist"],"salon_id":"54855602"},
        {"_key":"60386750","_id":"services/60386750","_rev":"_a_sgrcy--_","name":"Hair Color","description":"Hair colour application","category":"hair, colour","price":"0","min_price":"0","max_price":"0","jnr_price":"0","snr_price":"0","linked_service":"","salon_id":"54855602","required_skills":["stylist","colourist"],"weekly_discount":"1","duration":"60"},
        {"_key":"60253337","_id":"services/60253337","_rev":"_a_sgzfy--_","name":"Hair cut and colour","description":"Hair cut and colour","category":"cuts, colour, hair","price":"70","min_price":"60","max_price":"80","jnr_price":"60","snr_price":"80","linked_service":"60386750","salon_id":"54855602","required_skills":["stylist","colourist"],"weekly_discount":"1","duration":"30"},
        {"_key":"60252992","_id":"services/60252992","_rev":"_a_sgadC--_","name":"Hair cut","description":"Hair cut","category":"cuts, hair","price":"50","min_price":"40","max_price":"60","jnr_price":"40","snr_price":"60","linked_service":"","salon_id":"54855602","weekly_discount":"1","required_skills":["stylist"],"duration":"30"}
    ]


setTimeout(function(){
    scope.salon =
  {
    "details": {
      "_key": "54855602",
      "_id": "salon/54855602",
      "_rev": "_aFISmdO--_",
      "address": {},
      "headoffice": true,
      "name": "David Rozman Hair",
      "parent": false,
      "opening_times": [
        {
          "open": "closed",
          "close": "closed"
        },
        {
          "open": "9:30",
          "close": "17:53"
        },
        {
          "open": "9:00",
          "close": "17:00"
        },
        {
          "open": "9:00",
          "close": "12:30"
        },
        {
          "open": "9:00",
          "close": "17:00"
        },
        {
          "open": "9:00",
          "close": "17:00"
        },
        {
          "open": "9:00",
          "close": "17:00"
        }
      ],
      "salon_id": "54855602",
      "email": "david@davidrozman.co.uk",
      "tel": "0161 832 0179"
    },
    "settings": {
      "_key": "salonstream",
      "_id": "settings/salonstream",
      "_rev": "_aNgopQm--_",
      "levels": [
          {
            "name": "level 1"
          },
          {
            "name": "level 2"
          }
      ],
      "categories": [
        {
          "name": "Cuts"
        },
        {
          "name": "Treatments"
        }
      ]
    }
  }

},2000)


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
            list:'1',
            item:'Appointment',
            name:'',
            service:'',
            staff:'',
            start_time:'09:00',
            duration:'1hr 00'
        }
    ]

    scope.newAppointment = function(){
        scope.appointments.push({
            list:1+scope.appointments.length,
            item:'Appointment',
            service:'',
            name:'',
            staff:'',
            start_time:'10:00',
            duration:'0hr 15'
        })
    }

    scope.removeAppointment = function(){
        scope.appointments.splice(scope.appointments.length-1, 1)
    }


}
