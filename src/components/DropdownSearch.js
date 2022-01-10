
import Evaluate from '../scripts/partials/Evaluate'
import http from '../scripts/partials/http'
import _get from 'lodash.get'
import View from '../scripts/partials/View'

const view = new View()

export class DropdownSearch extends HTMLElement {

    constructor() {
        super();

        this.model = this.getAttribute('app-model')
        this.on_change = this.getAttribute('app-change')
        this.placeholder = this.getAttribute('placeholder')
        if (!this.placeholder){
            this.placeholder = 'Please select...'
        }

        this.innerHTML = `

            <input type="text" class="value context-link" placeholder="`+this.placeholder+`" spellcheck="false">
            <div class="dropdown context">

            </div>

        `;

        this.input = this.querySelector('input.value')
        this.dropdown = this.querySelector('.dropdown')
        this.timeout = ''

        this.addEventListener('click',this.selectDropdown)

        this.input._url = this.dataset.url
        this.input._bind = this.dataset.bind
        this.input._value = this.dataset.value
        this.input._model = this.model
        this.input._on_change = this.on_change
        this.input.dropdown = this.dropdown
        this.input._selectDropdown = this.selectDropdown
        this.input.addEventListener('keyup',this.search)

        if (this.model){
            this.getValue(this.model).then((model_value)=>{
            //    console.log('mv',model_value)
                if (model_value){
                    this.input.value = model_value
                }
            })

        }

    }

    selectDropdown(evnt){

        if (this.input){

            this.input.focus()

            this.input.dropdown_context = createContextMenu('dropdown-wrap', this.dropdown.innerHTML, this.getBoundingClientRect())
            this.input.dropdown_context.addEventListener('click',this.selectDropdown)
            this.input.dropdown_context._input = this.input
            this.input.dropdown_context._input.model = this.model
            this.input.dropdown_context._input.on_change = this.on_change

            if (evnt.target && evnt.target._app && evnt.target._app.model && evnt.target._app.model.exp){

                this.input.dropdown_context._input.model = evnt.target._app.model.exp

            } else if (evnt.target.parentNode && evnt.target.parentNode._app && evnt.target.parentNode._app.model && evnt.target.parentNode._app.model.exp){

                this.input.dropdown_context._input.model = evnt.target.parentNode._app.model.exp

            }

            if (this.input.value){
                this.input.value = ''
            }

        } else {

            let value = null,
                result = null

            if (evnt && evnt.target && evnt.target._app && evnt.target._app.value){
                value = evnt.target._app.value
            } else if (evnt && evnt.target && evnt.target.getAttribute && evnt.target.dataset.value){
                value = evnt.target.dataset.value
            } else if (evnt && evnt.target && evnt.target.parentNode && evnt.target.parentNode.getAttribute && evnt.target.parentNode.dataset.value){
                value = evnt.target.parentNode.dataset.value
            } else if (evnt && evnt.target && evnt.target.innerHTML){
                value = evnt.target.innerHTML
            }

            if (value !== null && this._input){
                result = new Evaluate().setValue(this._input.model, value)
                if (this._input.on_change){
                    new Evaluate(this._input.on_change).value(evnt)
                }
                this._input.value = evnt.target.innerHTML
            } else {

            }

        }

    }

    search(evnt){

        let self = this

        if (evnt.code == 'ArrowDown'){

            let children = self.dropdown_context.querySelectorAll('div'),
                selected_idx = 0

            for (let i=0; i< children.length; i++){

                if (children[i].classList.contains('selected')){
                    children[i].classList.remove('selected')
                    selected_idx = i+1
                }

                if (i >= children.length-1){

                    if (selected_idx > children.length-1){
                        selected_idx = children.length-1
                    }
                    children[selected_idx].classList.add('selected')
                }

            }

        } else if (evnt.code == 'ArrowUp'){

            let children = self.dropdown_context.querySelectorAll('div'),
                selected_idx = 0

            for (let i=0; i< children.length; i++){

                if (children[i].classList.contains('selected')){
                    children[i].classList.remove('selected')
                    selected_idx = i-1
                }

                if (i >= children.length-1){

                    if (selected_idx < 0){
                        selected_idx = 0
                    }
                    children[selected_idx].classList.add('selected')
                }

            }

        } else if (evnt.code == 'Enter'){

            let children = self.dropdown_context.querySelectorAll('div'),
                selected_idx = 0

            for (let i=0; i< children.length; i++){

                if (children[i].classList.contains('selected')){

                    let value, result

                    if (children[i].getAttribute('data-value')){
                        value = children[i].getAttribute('data-value')
                    } else {
                        value = children[i].innerHTML
                    }

                    if (value !== null){

                        result = new Evaluate().setValue(self._model, value)
                        if (self._on_change){
                            new Evaluate(self._on_change).value(evnt)
                        }
                        self.value = children[i].innerHTML
                    }

                    break;

                }

            }

        } else if (typeof evnt == 'string' || evnt.target.value && evnt.target.value.length >= 3){

            if (self && self.dropdown_context && self.dropdown_context.classList && self.dropdown_context.classList.contains('exit-view')){

                self.dropdown_context.style.display = 'block'
                self.dropdown_context.classList.remove('exit-view')
                self.dropdown_context.classList.add('in-view')
                self.dropdown_context.style.zIndex = 999

            }

            let str = ''
            if (typeof evnt == 'string'){
                str = evnt
            } else {
                str = evnt.target.value
            }

            http.get(self._url+str).then((data)=>{

                self.dropdown_context.innerHTML = ''

                data = JSON.parse(data)

                if (Array.isArray(data) && data.length > 0){

                    data.map((item, i)=>{

                        let text = _get(item, self._bind)

                        if (self._value == '.'){

                            let optn = document.createElement('div')
                            optn.dataset.value = '.'
                            optn.innerHTML = text
                            optn._app = {
                                value: item
                            }
                            self.dropdown_context.appendChild(optn)

                        } else if (self._value){
                            let value = _get(item, self._value)
                            self.dropdown_context.innerHTML += `<div data-value="`+value+`">`+text+`</div>`
                        } else {
                            self.dropdown_context.innerHTML += `<div>`+text+`</div>`
                        }

                    })

                } else {
                    self.dropdown_context.innerHTML = '<div class="text-italic text-33-grey">Nothing found</div>'
                }
            })

        } else {

            if (self.dropdown_context){
                self.dropdown_context.innerHTML = ''
            }

        }


    }

    getValue(model){
        return new Promise( async (resolve, reject) => {

            setTimeout(function(){
                model = new Evaluate().getValue(model)
                resolve(model)
            },1000)


        })
    }


}

customElements.define('dropdown-search', DropdownSearch);
