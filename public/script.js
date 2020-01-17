

controller = () => {

    scope.clients = []
    scope.filteredClients = []
    scope.view = {}
    scope.view.test = {}
    scope.view.search = ''

    watch['view.search'] = function(newData, oldData){

        if (newData.length > 2){

            if (scope.clients){

                scope.filteredClients = []
                let clients = scope.clients.slice(0)

                clients.map(function (client) {

                    let re = RegExp(newData,'i')

                    client.name_full = ''
                    if (client.name.first && client.name.last){
                        client.name_full = client.name.first+' '+client.name.last
                    }

                    if (client.name_full.match(re) ||
                        client.email && client.email.match(re) ||
                        client.tel && client.tel.match(re)
                    ) {
                        console.log(client)
                        scope.filteredClients.push(client)
                    }

                })

            }

        }

    }
    scope.view.selected_customer = ''
    scope.view.selected_customer_id = '393okk39393e.99w9_'
    scope.view.test.test1 = "text-blue"
    scope.test = "Start"
    scope.panel = false
    scope.menu_items = [
        {name: 'Welcome', panel:'Hi there', class:"text-green"},
        {name: 'What\'s it about?', panel:'<h1>What\'s it about?</h1>Something here', class:"text-bold"},
        {name: 'Responsive', panel:'Something else here', class:"text-red"}
    ]

    scope.menuItems = function(){
        http('get','http://davidrozman.reformedreality.com/dashboard/clients/get')
            .then((data)=>{

                data = JSON.parse(data)
                scope.clients = data
                return scope.clients

            }).catch((err)=>{
                console.log(err)
            })
    }

    scope.gotoPanel = (panel, name)=>{
    }

    scope.getName = function(name, name2){
        return name
    }

    scope.parseDate = function(data){
        scope.menu_items = [
            {name: 'Welcome', panel:'Hi there', class:"text-red"},
            {name: 'What\'s it about?', panel:'<h1>What\'s it about?</h1>Something here', class:"text-light"},
            {name: 'Responsive', panel:'Something else here', class:"text-green"}
        ]
        scope.menu_items.push({name: data, panel:'Something else here', class:"text-red"})

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

    scope.parseService = function(obj){
        if (obj){
            return obj.first+' - £'+obj.last
        }

    }

    scope.appointments = [
        {start_time:'',duration:0,service:'75',staff_id:0}
    ]

    scope.newAppointment = function(){
        scope.appointments.push({start_time:'',duration:0,service:'',staff_id:0})
    }

    scope.getThings = function(){

    //    setTimeout(function(){


        scope.salon =[
          {
            name: {
                first: "hair",
                last:"cut"
            },
            price: "50"
          },
          {
              name: {
                  first: "haircut",
                  last:"and color"
              },
            price: "75"
          },
          {
              name: {
                  first: "cut",
                  last:"and dry"
              },
            price: "65"
          }
        ]


//    },2000)

}
}
