

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

    scope.getThings = function(){
        http('PUT','http://10.0.1.100/api/988112a4e198cc1211/groups/7/action',{toggle:true})
            .then((data)=>{console.log(data)})
            .catch((data)=>{console.log('Error:',data)})
    }

}
