

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
            scope.saveTable(scope.table_items)
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

    scope.getHrs = function() {

        var hrs = []

        for(i=6; i<24; i++) {

            if (i < 10){
                hrs.push('0'+i)
            } else {
                hrs.push(i)
            }

            if (i==23){
                return hrs
            }

        }

    }

    scope.getDurationHrs = function() {

        var hrs = []

        for(i=0; i<9; i++) {

            hrs.push(i)

            if (i==8){
                return hrs
            }

        }

    }

    scope.getMins = function() {

        var mins = []

        for (i=0; i<=45; i += 15) {

            if (i < 10){
                mins.push('0'+i)
            } else {
                mins.push(i)
            }

            if (i==45){
                return mins
            }

        }

    }

    scope.parseName = function(obj){
        if (obj){
            return obj.first+' '+obj.last
        }

    }

}
