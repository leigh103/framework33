

module.exports = {

    get(url){

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            }

            request.open('GET', url);

            request.send(null);

        })

    },

    put(url,payload){

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            }

            request.open('PUT', url);

            if (payload){

                request.setRequestHeader('Content-type', 'application/json')
                request.send(JSON.stringify(payload))

            } else {

                request.send(null);

            }

        })

    },

    post(url, payload, header){

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            }

            request.open('POST', url);

            if (payload){

                if (header){
                    if (header == 'none'){
                        request.withCredentials = true
                    } else {
                        request.setRequestHeader('Content-type', header)
                    }
                    request.send(payload)
                } else {
                    request.setRequestHeader('Content-type', 'application/json')
                    request.send(JSON.stringify(payload))
                }
                
                

            } else {

                request.send(null);

            }

        })
    },

    delete(url){

        return new Promise(function(resolve, reject){

            let request = new XMLHttpRequest();

            request.onreadystatechange=function(){

                if (request.readyState==4){
                    if (request.status==200){
                        resolve(request.response)
                    } else {
                        reject(request.response)
                    }
                }
            }

            request.open('DELETE', url);
            request.send(null);

        })

    }

}
