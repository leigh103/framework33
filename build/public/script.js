

controller = () => {

    scope.view = {}
    scope.view.test = {}
    scope.view.test.test1 = "text-blue"
    scope.test = "Start"
    scope.panel = false
    scope.menu_items = [
        {name: 'Welcome', panel:'Hi there', class:"text-green"},
        {name: 'What\'s it about?', panel:'<h1>What\'s it about?</h1>Something here', class:"text-bold"},
        {name: 'Responsive', panel:'Something else here', class:"text-red"}
    ]

    scope.gotoPanel = (panel, name)=>{
        console.log(panel, name.class)
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
        return obj.name+' - £'+parseFloat(obj.price).toFixed(2)
    }

    scope.getThings = function(){

    //    setTimeout(function(){


        scope.salon =[
          {
            name: "Haircut",
            price: "50"
          },
          {
            name: "Haircut and color",
            price: "75"
          },
          {
            name: "Cut and blow dry",
            price: "65"
          }
        ]


//    },2000)

}
}
