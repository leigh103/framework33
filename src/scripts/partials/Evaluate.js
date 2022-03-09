
    import _get from 'lodash.get'
    import _set from 'lodash.set'

    export default class Evaluate {

        constructor(exp, data){

            if (exp){
                this.exp = exp
            } else {
                this.exp = ''
            }

            if (data){
                this.data = data
            } else {
                this.data = false
            }

            this.type = ''
            this.matches = []

            this.regex = {
                comparison_class: /\{\s*'([a-zA-Z0-9._\s\[\]\-]+)'\s*\:\s*([a-zA-Z0-9._\s\[\]\/']+)\s*([!=<>+]+)*\s*([a-zA-Z0-9._\s\[\]\/']+)*\s*\}/,
                comparison_function: /\{\s*'([a-zA-Z0-9._\[\]\-]+)'\s*\:\s*([a-zA-Z0-9._\[\]]+)\((.*?)\)\s*\}/,
                comparison_operator: /^([a-zA-Z0-9._\[\]()!]+)\s*(!=|==|===|>|>=|<|<=)\s*(\'[a-zA-Z0-9._!\s]+\'|[a-zA-Z0-9._\[\]()!]+)/,
                statement: /^(\'[a-zA-Z0-9._!\-\s]+\'|[a-zA-Z0-9._\[\]()!]+)\s*(\=)\s*(\'[a-zA-Z0-9._!\-\s]+\'|[a-zA-Z0-9._\[\]()!]+)/, // /([a-za-zA-Z._]+)\s*(=)\s*'?((.*))'?/
                function: /([a-zA-Z0-9._\[\]]+)\((.*?)\)/,
                concatenation: /^([\w\d\s._']+)\s*\+\s*([\w\d\s._']+)/,
                for_loop: /^([a-zA-Z0-9._]+)\s+in\s+([a-zA-Z0-9._()\[\]]+)$/,
                parent_var: /\{\{parent\.([a-zA-Z0-9._()\[\]]+)\}\}/,
                object_reference:/^[a-zA-Z_][a-zA-Z0-9\[\]._]+$/,
                string:/^\'(.*?)\'$/,
                tel:/^[0+]/,
                number:/^\d+$/,
                boolean:/^(true|false)$/
            }

            this.parseExp()

        }

        parseExp(){

            if (this.exp){

                if (this.exp.match(this.regex.comparison_class)){

                    this.type = 'comparison_class'
                    this.matches = this.exp.match(this.regex.comparison_class)

                } else if (this.exp.match(this.regex.comparison_operator)){

                    this.type = 'comparison_operator'
                    this.matches = this.exp.match(this.regex.comparison_operator)

                } else if (this.exp.match(this.regex.comparison_function)){

                    this.type = 'comparison_function'
                    this.matches = this.exp.match(this.regex.comparison_function)

                } else if (this.exp.match(this.regex.statement)){

                    this.type = 'statement'
                    this.matches = this.exp.match(this.regex.statement)

                } else if (this.exp.match(this.regex.function)){

                    this.type = 'function_call'
                    this.matches = this.exp.match(this.regex.function)

                } else if (this.exp.match(this.regex.for_loop)){

                    this.type = 'for_loop'
                    this.matches = this.exp.match(this.regex.for_loop)

                } else if (this.exp.match(this.regex.parent_var)){

                    this.type = 'parent_var'
                    this.matches = this.exp.match(this.regex.parent_var)

                } else if (this.exp.match(this.regex.object_reference)){

                    this.type = 'object_reference'
                    this.matches = this.exp.match(this.regex.object_reference)

                } else if (this.exp.match(this.regex.concatenation)){

                    this.type = 'concatenation'
                    this.matches = this.exp.match(this.regex.concatenation)

                } else if (this.exp.match(this.regex.string)){

                    this.type = 'string'
                    this.matches = this.exp.match(this.regex.string)

                }

            }

        }

        findObjRef(){

            let result = [],
                self = this,
                found = this.matches.map((match)=>{

                    if (typeof match == 'string'){
                        match = match.trim()
                    }

                    return match

                }).filter((match)=>{

                    if (typeof match == 'undefined' || match == null){
                        return false
                    }

                    if (self.regex.function.test(match)){ // function params
                        let params = match.match(self.regex.function,'i')
                        if (params[1]){
                            result.push(params[1])
                        }
                        if (params[2]){
                            params = params[2].split(',')

                            for (var i = 0; i < params.length; i++){
                                params[i] = params[i].trim()
                                if (self.regex.object_reference.test(params[i])){
                                    result.push(params[i])
                                }
                            }
                        }

                    }
                    
                    return self.regex.object_reference.test(match) && typeof match == 'string' && match != 'false' && match != 'true'

                })

            result = [...found, ...result]

            if (this.type == 'function_call'){
                result.splice(0,1)
            }
            //
            // if (this.type == 'for_loop' || this.type == 'comparison_class'){
            //     console.log(result)
            //     result = result.splice(1,1)
            // }
            //
            // if (this.type == 'comparison_function'){
            // //    result = result.splice(2,1) // removed to fix setting attr with function eg, {'style':function(sometihng)}
            // }

            return result

        }

        value(data){
            if (this.type && this[this.type]){
                return this[this.type](data)
            } else {
                return false
            }
        }

        getValue(key){

            let negative = false,
                length = false

            if (typeof key == 'string' && key.match(/\.length$/)){
                key = key.replace(/\.length$/,'')
                length = true
            }

            if (typeof key == 'string' && key.match(/^\!/)){
                key = key.replace(/^\!/,'')
                negative = true
            }

            if (typeof key == 'undefined'){
                return false
            } else {
                key = key.trim()
            }

            let result = false


            if (this.regex.number.test(key)){

                key = parseFloat(key)
                result = key

            } else if (this.type == 'string' || this.regex.string.test(key)){

                result = key.replace(this.regex.string,'$1')

            } else if (!this.regex.tel.test(key) && this.regex.number.test(key)){

                result = parseFloat(key)

            } else if (this.regex.boolean.test(key)){

                result = key === 'true'

            } else if (typeof this.data == 'object'){

                result = _get(this.data, key)

            } else if (typeof this.data == 'string' || !this.data){

                result = _get(window.scope, key)

            }

            if (!this.regex.tel.test(result) && typeof result == 'string' && this.regex.number.test(result)){
                result = parseFloat(result)
            }

            if (negative === true){
                result = !result
            }

            if (length === true && typeof result != 'undefined'){
                return result.length
            } else {
                return result
            }


        }

        setValue(key, value){

            let old = _get(window.scope, key),
                result = _set(window.scope, key, value)

            view.update(key, true)

            if (typeof value == 'object'){
            //    view.updateChildren(key, value)
            }

            if (typeof window.watch[key] == 'function'){
                window.watch[key].call('',value, old)
            }

            return _get(window.scope, key)

        }

        comparison_operator(){

            let val1 = this.getValue(this.matches[1]),
                op = this.matches[2],
                val2 = this.getValue(this.matches[3])

            if (!op && val1){
                return true
            } else if (op == '==' && val1 == val2){
                return true
            } else if (op == '===' && val1 === val2){
                return true
            } else if (op == '!=' && val1 != val2){
                return true
            } else if (op == '!==' && val1 !== val2){
                return true
            } else if (op == '>' && val1 > val2){
                return true
            } else if (op == '<' && val1 < val2){
                return true
            } else if (op == '>=' && val1 >= val2){
                return true
            } else if (op == '<=' && val1 <= val2){
                return true
            } else {
                return false
            }

        }

        statement(){

            let val1 = this.matches[1],
                op = this.matches[2],
                val2 = this.getValue(this.matches[3])

            if (op == '='){
                this.setValue(val1,val2)
            }

            return true

        }

        function_call(data){

            let params = this.matches[2].split(/\s*,\s*/),
                self = this,
                result = false

            if (!data){
                data = {}
            }

            if (params && typeof params == 'object'){
                data._params = JSON.parse(JSON.stringify(params))
            }

            params = params.map((param,i)=>{
                return self.getValue(param.trim())
            })

            if (typeof window.scope[this.matches[1]] == 'function'){

                result = window.scope[this.matches[1]].apply(data,params)
                if (data){
                //    view.update(data)
                }

                return result
            } else {
                return result
            }

        }

        comparison_function(data){

            let params = this.matches[3].split(/\s*,\s*/),
                self = this

            params = params.map((param,i)=>{
                return self.getValue(param.trim())
            })

            let result = false
            if (window.scope[this.matches[2]]){
                result = window.scope[this.matches[2]].apply(data,params)
            }
        
            return [this.matches[1],result]

        }

        comparison_class(){

            let val1 = this.getValue(this.matches[2]),
                op = this.matches[3],
                val2 = this.getValue(this.matches[4])

            if (!op && val1){
                return [this.matches[1],val1]
            } else if (op == '==' && val1 == val2){
                return [this.matches[1],val1]
            } else if (op == '===' && val1 === val2){
                return [this.matches[1],val1]
            } else if (op == '!=' && val1 != val2){
                return [this.matches[1],val1]
            } else if (op == '!==' && val1 !== val2){
                return [this.matches[1],val1]
            } else if (op == '>' && val1 > val2){
                return [this.matches[1],val1]
            } else if (op == '<' && val1 < val2){
                return [this.matches[1],val1]
            } else if (op == '>=' && val1 >= val2){
                return [this.matches[1],val1]
            } else if (op == '<=' && val1 <= val2){
                return [this.matches[1],val1]
            } else if (op == '+'){
                return [this.matches[1],val1+val2]
            } else {
                return false
            }

        }

        concatenation(){

            let objs = this.exp.split(/\s*\+\s*/)

            objs = objs.map((obj)=>{
                let val = this.getValue(obj)
                return val
            })

            return objs.join('')

        }

        object_reference(){
            return this.getValue(this.matches[0])
        }

        safeEval(untrustedCode){

        //    return Function(`'use strict'; return (${untrustedCode})`)(scope)

        //    return eval(untrustedCode)
        }



    }
