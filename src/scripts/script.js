
    controller = function(){

        scope.title = 'Hello'
        scope.view = {
            class:'',
            title:'This is the title',
            img: 'https://i.pinimg.com/originals/ee/4f/78/ee4f78ea5b71aedddeadcaa6e3b3ffe9.jpg',
            list:[],
            date: '2021-05-10T11:01:00.000Z',
            show_title: true
        }

        scope.new = {
            title:'',
            col1:''
        }

        scope.view.list = [{value:'2324',text:'ONE'},{value:'4565464',text:'TWO'},{value:'565676',text:'THREE'}]

        scope.view.table = [].localGet('view.table')

        scope.openModal = function(str){
            scope.edit = scope.view.table[0]
            view.update('edit')
            scope.view.modal = str
            view.update('view.modal')

        }

        scope.toggleTitle = function(){
            scope.view.show_title = !scope.view.show_title
            view.update('view.show_title')
        }

        scope.log = function(log){
            console.log(log)
        }

        scope.addToList = function(){
            scope.view.list.push({value:'234234',text:'four'})
        //    console.log(scope.view.list)
            view.update('view.list')
        }

        scope.closeModal = function(str){
            scope.view.modal = false
            view.update('view.modal')
        }

        scope.getImg = function(){
            return scope.view.img
        }

        scope.alert = function(str){
            console.log('alert'+str)
        }

        scope.openList = function(){
            scope.view.open_list = true
            view.update('view.open_list')
            console.log(app.index['view.open_list'])
        }

        scope.getEmail = function(){

            // scope._get('http://salonstream.reformedreality.com/api/customers/search?str=lee@re').then((data)=>{
            //     scope.view.sub_title = data[0].email
            //     view.update('view.sub_title')
            // }).catch(err=>{
            //     console.log('here')
            //     scope._notify(err)
            // })

        }

        // watch['view'] = function(data,old,key){
        //     console.log('view updated')
        // }

       // socketConnect('ws://homebridge.local:4531')
       //
       // watch['ws_data'] = function(data){
       //     if (data.r == 'groups' && data.id){
       //         scope.groups.map((group)=>{
       //             if (group.id == data.id){
       //                 group.state = data.state
       //                 console.log(group)
       //             }
       //         })
       //     }
       // }

       watch['view.class'] = function(data, old){
           // console.log('watch', data, old)
       }

       scope.modalCloseAll = function(){
           scope.view.modal = false
       }

       scope.get = function(collection, id, output){

           return new Promise(function(resolve, reject){

               let url

               if (collection.match(/^\//)){
                   url = collection
                   if (id){
                       url += '/'+id
                   }
               } else {
                   url = collection

                   if (id){
                       url += '/'+id
                   }
               }

               if (collection.match(/\?/)){
                   collection = collection.split('?')[0]
               }

               if (collection.match(/\//)){
                   collection = collection.split('/')[0]
               }

               http.get(url)
                   .then((data) => {
console.log(data)
                       data = JSON.parse(data)

                       if (output){
                           scope[output] = data
                           view.update(output)
                       } else {

                           scope[collection] = data
                           view.update(collection)
                       }

                       if (typeof initCarousels == 'function'){
                           setTimeout(function(){
                               initCarousels()
                           },1000)
                       }

                       resolve(data)

                   }).catch((err) => {
                       console.log(err)
                //       scope.notify(err, 'error',5)
                   })

           })

       }

    }
