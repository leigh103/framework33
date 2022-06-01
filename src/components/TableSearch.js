
import Evaluate from '../scripts/partials/Evaluate'
import http from '../scripts/partials/http'
import _get from 'lodash.get'
import View from '../scripts/partials/View'

const view = new View()

export class TableSearch extends HTMLElement {

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
            <div class="table-wrap">
                <div class="table table-mobile">

                </div>
            </div>

        `;

        this.input = this.querySelector('input.value')
        this.table_el = this.querySelector('.table')
        this.timeout = ''

        this.addEventListener('click',this.selectRow)

        this.input._url = this.dataset.url
        this.input._columns = this.dataset.columns.split(',')
        this.input._model = this.model
        this.input._on_change = this.on_change
        this.input.table_el = this.table_el
        this.input._selectRow = this.selectRow
        this.input.addEventListener('keyup',this.search)

    }

    selectRow(evnt){

        let value = null,
            result = null,
            model = null

        if (evnt && evnt.target && evnt.target._app && evnt.target._app.value){
            value = evnt.target._app.value
            model = evnt.target._app.model
        }

        if (this.table_el._rows){
            this.table_el._rows.map((row)=>{
                row.classList.remove('selected')
            })
        }


        if (value !== null && model !== null){

            evnt.target.parentNode.classList.add('selected')
            result = new Evaluate().setValue(model, value)
            if (evnt.target._app.on_change){
                new Evaluate(evnt.target._app.on_change).value(evnt)
            }

        } else {
            evnt.target.parentNode.search('__preview__')
        }

    }

    search(evnt){

        let self = this

        if (!self._url && self.input._url){
            self = self.input
        }

        if (typeof evnt == 'string' || evnt.target.value && evnt.target.value.length >= 3){

            let str = ''
            if (typeof evnt == 'string'){
                str = evnt
            } else {
                str = evnt.target.value
            }

            http.get(self._url+str).then((data)=>{

                self.table_el.innerHTML = ''

                data = JSON.parse(data)

                if (Array.isArray(data) && data.length > 0){

                    self.table_el._rows = []

                    data.map((item, i)=>{

                        let row = document.createElement('div')
                        row.classList.add('row')
                        row.addEventListener('click',this.selectRow)

                        self._columns.map((column, ii)=>{

                            let text = _get(item, column)

                            let cell = document.createElement('div')
                            cell.classList.add('cell','middle','clickable', 'name' ,'no-icon')
                            cell.innerHTML = text
                            cell._app = {
                                model: self._model,
                                value: item
                            }

                            if (self._on_change){
                                cell._app.on_change = self._on_change
                            }
                            row.appendChild(cell)

                        })
                        self.table_el._rows.push(row)
                        self.table_el.appendChild(row)

                    })



                } else {
                    self.table_el.innerHTML = '<div class="row"><div class="cell middle">Nothing found</div></div>'
                }
            })

        } else {

            if (self.table_el){
                self.table_el.innerHTML = ''
            }

        }


    }


}

customElements.define('table-search', TableSearch);
