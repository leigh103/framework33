

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

        setTimeout(function(){


        scope.salon = 
  {
    "salon": {
      "_key": "54855602",
      "_id": "salons/54855602",
      "_rev": "_Zv5JJ5a--_",
      "name": "David Rozman",
      "address": {
        "line_1": "Alexandra Building",
        "line_2": "28 Queen St",
        "line_3": "",
        "city": "Manchester",
        "county": "Gtr Manchester",
        "post_code": "M2 5HX"
      },
      "tel": "0161 832 0179",
      "head_office": true,
      "parent_company": false,
      "services": [
        {
          "name": "Haircut",
          "price": "50"
        },
        {
          "name": "Haircut and color",
          "price": "75"
        },
        {
          "name": "Cut and blow dry",
          "price": "65"
        }
      ]
    },
    "customers": [
      {
        "_key": "54859179",
        "_id": "customers/54859179",
        "_rev": "_Zv2X44K---",
        "name": {
          "first": "Tom",
          "last": "Delany"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54856978",
        "_id": "customers/54856978",
        "_rev": "_Zv2X44K--C",
        "name": {
          "first": "Diane",
          "last": "O'Brian"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54856896",
        "_id": "customers/54856896",
        "_rev": "_Zv2X44K--E",
        "name": {
          "first": "George",
          "last": "Ranliegh"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54858934",
        "_id": "customers/54858934",
        "_rev": "_Zv2X44K--G",
        "name": {
          "first": "Neil",
          "last": "Rawson"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54857097",
        "_id": "customers/54857097",
        "_rev": "_Zv2X44K--I",
        "name": {
          "first": "Samantha",
          "last": "Warwick"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54859121",
        "_id": "customers/54859121",
        "_rev": "_Zv2X44K--K",
        "name": {
          "first": "Tim",
          "last": "Lawrence"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54857042",
        "_id": "customers/54857042",
        "_rev": "_Zv2X44K--M",
        "name": {
          "first": "Andrea",
          "last": "Hibbertson"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54859057",
        "_id": "customers/54859057",
        "_rev": "_Zv2X44K--O",
        "name": {
          "first": "Emilia",
          "last": "Watson"
        },
        "customer_of": [
          "54855602"
        ]
      },
      {
        "_key": "54857152",
        "_id": "customers/54857152",
        "_rev": "_Zv2X44K--Q",
        "name": {
          "first": "Linda",
          "last": "Crompton"
        },
        "customer_of": [
          "54855602"
        ]
      }
    ],
    "staff": [
      {
        "_key": "54856400",
        "_id": "staff/54856400",
        "_rev": "_Zu8tM-a--_",
        "name": {
          "first": "Charlotte",
          "last": "Webb"
        },
        "avatar": "141229060659-karla-cripps-profile-super-tease@2x.png",
        "salon": "54855602"
      },
      {
        "_key": "54856317",
        "_id": "staff/54856317",
        "_rev": "_Zu8t_F6--_",
        "name": {
          "first": "Paulo",
          "last": "Gio"
        },
        "avatar": "150103135544-paul-new-profile-super-tease.png",
        "salon": "54855602"
      },
      {
        "_key": "54856289",
        "_id": "staff/54856289",
        "_rev": "_Zu8tX_e--_",
        "name": {
          "first": "Micheal",
          "last": "Butler"
        },
        "avatar": "140926160723-daniel-burke-profile-image1-super-tease@2x.png",
        "salon": "54855602"
      },
      {
        "_key": "54856372",
        "_id": "staff/54856372",
        "_rev": "_Zu8t4jK--_",
        "name": {
          "first": "Sam",
          "last": "Smith"
        },
        "avatar": "140926160723-daniel-burke-profile-image1-super-tease@2x.png",
        "salon": "54855602"
      },
      {
        "_key": "54856083",
        "_id": "staff/54856083",
        "_rev": "_Zu8tkgO--_",
        "name": {
          "first": "Sally",
          "last": "Burkins"
        },
        "avatar": "140325152648-hala-gorani-profile-super-tease@2x.png",
        "salon": "54855602"
      },
      {
        "_key": "54856425",
        "_id": "staff/54856425",
        "_rev": "_Zu8trz2--_",
        "name": {
          "first": "Lucy",
          "last": "Elliot"
        },
        "avatar": "140325152648-hala-gorani-profile-super-tease@2x.png",
        "salon": "54855602"
      }
    ]
  }

    },2000)

}
}
