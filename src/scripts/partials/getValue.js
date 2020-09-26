export default function getValue(obj, path, string) {

    let result

    if (!path || typeof path != 'string'){
        return ''
    }

    if (!obj){
        obj = scope
    }

    if (path.match(/'|"/) || path.match(/^[0-9]+$/)){
        string = true
    } else if (typeof string == 'undefined'){
        string = false
    }

//    path = path.replace(/'|"/g,'')

    if (path == '{{index}}' && obj.index >= 0){

        return obj.index+''

    } else if (path == '{{parent}}'){

        return obj.index+''

    } else if (path.match(regex.logic_class)) { // if logic eg, {'active': obj.path == 'something'} - if true, returns the first string

        let matches = path.match(regex.logic_class),
            result,
            val1,
            val2,
            op

        if (matches.length > 1){
            result = matches[1],
            val1 = _.get(scope,matches[2]),
            op = matches[3],
            val2 = _.get(scope,matches[4])
        } else {
            result = matches[1],
            val1 = _.get(scope,matches[2]),
            op = null,
            val2 = null
        }

        if (!val1){// check obj
            matches[2] = matches[2].replace(/^[a-zA-Z0-9_\[\]]+./,'')
            val1 = _.get(obj,matches[2])
        }

        if (!val1){ // if scope and obj is undefined, fall back to string
            val1 = matches[2]
            val1 = val1.replace(/'/g,'')
        }

        if (!val2){ // check obj
            matches[4] = matches[4].replace(/^[a-zA-Z0-9_\[\]]+./,'')
            val2 = _.get(obj,matches[4])
        }

        if (!val2){ // if scope obj is undefined, fall back to string
            val2 = matches[4]
            val2 = val2.replace(/'/g,'')
        }

        if (typeof val1 == 'string' && val1.match(/true|false/i)){
            val1 = (val1 == 'true')
        }

        if (typeof val2 == 'string' && val2.match(/true|false/i)){
            val2 = (val2 == 'true')
        }

        if (!op && val1){

            return result

        } else if (op == '==' && val1 == val2){

            return result

        } else if (op == '===' && val1 === val2){

            return result

        } else if (op == '!=' && val1 != val2){

            return result

        } else if (op == '>' && val1 > val2){

            return result

        } else if (op == '<' && val1 < val2){

            return result

        } else if (op == '>=' && val1 >= val2){

            return result

        } else if (op == '<=' && val1 <= val2){

            return result

        } else {

            return false

        }

    } else if (path && path.match(regex.function)){ // if function

        let params = path.match(regex.function)[1].split(',')

        params = params.map((e)=>{

            if (e.match(/'|"/)){
                string = true
            } else {
                string = false
            }
            let obj_check = app.methods.getValue(obj, e)

            if (obj_check){
                return obj_check
            } else if (string == true){
                return e.replace(/'|"/g,'')
            } else {
                return null
            }

        })

        path = path.replace(/\((.*?)\)/,'')

        if (typeof scope[path] == 'function'){
            return scope[path].apply(this, params)
        }

    } else if (path.match(regex.logic)){

        let matches = path.match(regex.logic),
            val1 = _.get(obj,matches[1]),
            op = matches[2],
            val2 = matches[3]

        if (!val1){// check obj
            matches[1] = matches[1].replace(/^[a-zA-Z0-9_\[\]]+./,'')
            val1 = _.get(obj,matches[1])
        }

        if (!val2.match(/\'(.*?)\'/)){
            val2 = _.get(obj,matches[3])
        } else {
            val2 = val2.replace(/\'/g,'')
        }

        if (op == '=='){

            if (val1 == val2){
                return true
            } else {
                return false
            }

        } else if (op == '==='){

            if (val1 === val2){
                return true
            } else {
                return false
            }

        } else if (op == '!='){

            if (val1 != val2){
                return true
            } else {
                return false
            }

        } else if (op == '>'){

            if (val1 > val2){
                return result
            }

        } else if (op == '<'){

            if (val1 < val2){
                return true
            } else {
                return false
            }

        } else if (op == '>='){

            if (val1 >= val2){
                return true
            } else {
                return false
            }

        } else if (op == '<='){

            if (val1 <= val2){
                return true
            } else {
                return false
            }

        }

    } else if (path.match(regex.nested_object)){

        result = _.get(obj, path)

        if (typeof result != 'undefined'){

            if (typeof result == 'function'){
                return result()
            } else {
                return result
            }

        } else {

            let scope_result = _.get(scope, path)
            if (typeof scope_result != 'undefined'){
                if (typeof scope_result == 'function'){
                    return scope_result()
                } else {
                    return scope_result
                }
            } else {
                return ''
            }
        }


    } else if (obj[path] && string === false){

        result = obj[path]

        if (typeof result == 'function'){
            return result()
        } else {
            return result
        }

    } else {

        if (scope[path] && string === false){
            if (typeof scope[path] == 'function'){
                return scope[path]()
            } else {
                return scope[path]
            }
        } else if (string === true){
            return path.replace(/'|"/g,'')
       } else {
           return obj
       }

    }

}
