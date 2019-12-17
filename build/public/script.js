
var scope = {}

document.addEventListener('DOMContentLoaded', () => {

    scope.view = {}
    scope.view.test = "text-blue"
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

})
