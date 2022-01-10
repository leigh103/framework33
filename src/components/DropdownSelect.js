
import Evaluate from '../scripts/partials/Evaluate'
import View from '../scripts/partials/View'
import http from '../scripts/partials/http'

const view = new View()

export class DropdownSelect extends HTMLElement {

    constructor() {
        super();

        this.model = this.getAttribute('app-model')
        this.on_change = this.getAttribute('app-change')
        this.placeholder = this.getAttribute('placeholder')
        if (!this.placeholder){
            this.placeholder = 'Please select...'
        }

        this.innerHTML = `

            <div class="value context-link">`+this.placeholder+`</div>
            <div class="dropdown" data-animation="{'enter':'drop-down','exit':'drop-up'}">
                `+this.innerHTML+`
            </div>

        `;

        this.dropdown = this.querySelector('.dropdown')
        this.timeout = ''

        this.addEventListener('click',this.selectDropdown)

        this.input = this.querySelector('.value')
        let options_div = this.querySelector('.dropdown')

        if (this.model){

            this.getValue(this.model).then((model_value)=>{
                if (model_value){
                    let options = options_div.querySelectorAll('.option')
                    for (var i in options){

                        if (parseInt(i) && options[i] && options[i].getAttribute('value') == model_value){
                            this.input.innerHTML = options[i].innerHTML
                            break
                        }
                    }

                }
            })

        }

        if (this.dataset.url && this.dataset.bind && this.dataset.value){

            http.get(this.dataset.url).then((data)=>{

                data = JSON.parse(data)
                let new_option

                for (var i in data){
                    new_option = document.createElement('div')
                    new_option.setAttribute('value',data[i][this.dataset.value])
                    new_option.innerHTML = data[i][this.dataset.bind]
                    options_div.appendChild(new_option)
                }

            })

        }


    }

    selectDropdown(evnt){

        if (!evnt.target.classList.contains('value','context-link')){

            let value = null,
                result = null

            if (evnt && evnt.target && evnt.target.getAttribute && evnt.target.getAttribute('value')){
                value = evnt.target.getAttribute('value')
            } else if (evnt && evnt.target && evnt.target.parentNode && evnt.target.parentNode.getAttribute && evnt.target.parentNode.getAttribute('value')){
                value = evnt.target.parentNode.getAttribute('value')
            } else if (evnt && evnt.target && evnt.target.innerHTML){
                value = evnt.target.innerHTML
            }

            if (value !== null){
                result = new Evaluate().setValue(this._input.model, value)
                if (evnt.target.hasAttribute('value')){
                    this._input.innerHTML = evnt.target.innerHTML
                } else {
                    this._input.innerHTML = evnt.target.parentNode.innerHTML
                }

            }

            if (this._input.on_change){
                new Evaluate(this._input.on_change).value(evnt)
            }

        } else {

            document.querySelector('body').style.overflowY = 'hidden'
            this.dropdown_context = createContextMenu('dropdown-wrap', this.dropdown.innerHTML, this.getBoundingClientRect())
            this.dropdown_context.addEventListener('click',this.selectDropdown)
            this.dropdown_context._input = this.input
            this.dropdown_context._input.model = this.model
            this.dropdown_context._input.on_change = this.on_change

        }

        // if (this.dropdown.classList.contains('in-view')){
        //
        //     view.exitView(this.dropdown).then(()=>{
        //         this.style.zIndex = 1
        //     })
        //     // this.dropdown.classList.remove('in-view')
        //     // this.dropdown.classList.add('exit-view')
        //     // this.style.zIndex = 1
        //
        // } else {
        //
        //     this.style.zIndex = 999
        //     view.enterView(this.dropdown).then(()=>{
        //
        //     })
        //     // this.dropdown.style.display = 'block'
        //     // this.dropdown.classList.remove('exit-view')
        //     // this.dropdown.classList.add('in-view')
        //     // this.style.zIndex = 999
        //
        // }

    }

    getValue(model){
        return new Promise((resolve, reject) => {

            setTimeout(function(){
                model = new Evaluate().getValue(model)
                resolve(model)
            },500)


        })
    }


}

customElements.define('dropdown-select', DropdownSelect);
