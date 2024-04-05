
export class DatePicker extends HTMLElement {

    constructor() {
        super();

        this.model = this.getAttribute('app-model')
        this.on_change = this.getAttribute('app-change')
        this.placeholder = this.getAttribute('placeholder')
        this.datetime = this.hasAttribute('data-datetime')
        this.format = this.dataset.format

        if (!this.placeholder){
            this.placeholder = 'Select Date...'
        }

        this.innerHTML = `

            <div type="text" class="value context-link" data-value="true">`+this.placeholder+`</div>

            <div class="dates-wrap context" data-animation="{'enter':'drop-down','exit':'drop-up'}">
                
                <div class="dates-time context-link">
                    <div class="dates-time-title">Set time</div>
                    <div class="dates-time-input-wrap">
                        <select class="text-right context-link dates-time-hrs">
                        </select>
                        <div class="divider">:</div>
                        <select class="text-right context-link dates-time-mins">
                        </select>
                    </div>
                </div>
                <div class="dates-header">
                    <div class="arrow prev context-link"><</div>
                    <div class="month-wrap context-link open-year-select clickable">
                        <div class="month context-link open-year-select"></div>
                        <div class="year context-link open-year-select"></div>
                    </div>
                    <div class="arrow next context-link">></div>
                </div>
                <div class="year-select">
                    <div class="months"></div>
                    <div class="years"></div>
                </div>
                <div class="dates">

                </div>
                <div class="dates-buttons flex w-100 mt-1">
                    <div class="dates-clear context-link btn bg-white flex-1">
                        Clear
                    </div>
                    <div class="dates-close context-link btn bg-primary flex-1">
                        Set
                    </div>
                </div>
            </div>

        `;

        this.months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December']
        this.months_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        this.dates = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st']
        this.days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
        this.days_short = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

        this.years = []
        let current_year = parseInt(new Date().getFullYear())+20        

        for (var i=current_year;i>=current_year-120;i--){
            this.years.push(i)
        }

        this.datepicker = this.querySelector('.dates-wrap')
        this.time_hrs = this.querySelector('.dates-time-hrs')
        this.time_mins = this.querySelector('.dates-time-mins')
        this.time_years = this.querySelector('.year-select')

        this.addEventListener('click',this.openDatePicker)

        let value_div = this.querySelector('.value')
        
        this.getDate(this.model).then((model_date)=>{

            if (model_date){
                let date_str

                if (typeof moment == 'function' && this.format){

                    date_str = moment(model_date).format(this.format)

                } else {

                    let date = new Date(model_date)

                    date_str = this.days[date.getDay()]+' '+this.dates[date.getDate()-1]+' '+this.months[date.getMonth()]+' '+date.getFullYear()

                    if (this.datetime){
                        let hrs = date.getHours(),
                            mins = date.getMinutes()

                        if (mins < 10){
                            mins = '0'+parseInt(mins)
                        }

                        date_str += " at "+hrs+":"+mins

                    }

                }
                value_div.innerHTML = date_str
            }
        })

    }

    setDate(model_date){

        let date_str

        let value_div = this.querySelector('.value')

        if (typeof moment == 'function' && this.format){

            date_str = moment(model_date).format(this.format)

        } else {

            let date = new Date(model_date)

            date_str = this.days[date.getDay()]+' '+this.dates[date.getDate()-1]+' '+this.months[date.getMonth()]+' '+date.getFullYear()

            if (this.datetime){
                let hrs = date.getHours(),
                    mins = date.getMinutes()

                if (mins < 10){
                    mins = '0'+parseInt(mins)
                }

                date_str += " at "+hrs+":"+mins

            }

        }
        value_div.innerHTML = date_str

    }

    getDaysArray(year, month, selected_date) {

        if (typeof year == 'undefined'){
            year = new Date().getFullYear()
        }

        if (typeof month == 'undefined'){
            month = new Date().getMonth()
        }

      var monthIndex = month,
          date = new Date(year, monthIndex, 1),
          pre_dates = new Date(year, monthIndex, 1),
          date_div = this.datepicker_context.querySelector('.dates'),
          month_div = this.datepicker_context.querySelector('.month'),
          year_div = this.datepicker_context.querySelector('.year'),
          result = [
              {date:'M',type:'day'},
              {date:'T',type:'day'},
              {date:'W',type:'day'},
              {date:'T',type:'day'},
              {date:'F',type:'day'},
              {date:'S',type:'day'},
              {date:'S',type:'day'},
          ],
          offset = date.getDay()-1,
          today = new Date().getDate(),
          this_month = new Date().getMonth()

          this.datepicker_context.selected = date

      if (offset < 0){
          offset = 6
      }

      pre_dates.setDate(pre_dates.getDate() - offset);

      for (var i=0;i<offset;i++){
          let iso = pre_dates.toISOString()
          result.push({date:pre_dates.getDate()+'',type:'pre',iso:iso})
          pre_dates.setDate(pre_dates.getDate() + 1);
      }

      while (date.getMonth() == monthIndex) {

          let day = date.getDate(),
              iso = date.toString()

          if (day == selected_date){
              result.push({date:day+'',type:'selected',iso:iso});
          } else if (day < today && this_month == monthIndex){
              result.push({date:day+'',type:'passed',iso:iso});
          } else if (day == today && this_month == monthIndex){
              result.push({date:day+'',type:'today',iso:iso});
          } else {
              result.push({date:day+'',type:'reg',iso:iso});
          }

          date.setDate(date.getDate() + 1);

      }

      if (result.length > 42){
          var post_dates = 49 - result.length;
      }

      while (date.getDate() <= post_dates) {

          let day = date.getDate(),
              iso = date.toString()

          result.push({date:day+'',type:'post',iso:iso});

          date.setDate(date.getDate() + 1);

      }

      month_div.innerHTML = this.months[month]
      year_div.innerHTML = year
      date_div.innerHTML = ''

      for (var i in result){

          if (result[i] && result[i].date){

              let date_cell = document.createElement("div")

              date_cell.classList.add('date','context-link',result[i].type)
              date_cell.innerHTML = result[i].date
              date_cell.dataset.date = result[i].iso
              date_cell.dataset.model = this.model

              date_div.append(date_cell)

          }

      }

    }

    addDateTimes(type){

        let start = 0,
            end = 23,
            result = '',
            text,
            value

        if (type == 'minutes'){
            end = 59
        }

        for (var i=start;i<=end;i++){

            text = i
            value = i
            if (i < 10 && type == 'minutes'){
                text = '0'+i
                value = '0'+i
            }
            result += '<option value="'+value+'">'+text+'</option>'
        }

        return result

    }

    openDatePicker(evnt){

        var selectDate = this.selectDate

        document.querySelector('body').style.overflowY = 'hidden'

        this.datepicker_context = createContextMenu('dates-wrap', this.datepicker.innerHTML, this.getBoundingClientRect())
        this.datepicker_context.addEventListener('click',selectDate)
        this.datepicker_context.days = this.days
        this.datepicker_context.months = this.months
        this.datepicker_context.dates = this.dates
        this.datepicker_context.datetime = this.datetime
        this.datepicker_context.format = this.format
        this.datepicker_context.parent = this
        this.datepicker_context.hrs = this.datepicker_context.querySelector('.dates-time-hrs')
        this.datepicker_context.mins = this.datepicker_context.querySelector('.dates-time-mins')

        this.datepicker_context.hrs.dataset.model = this.model
        this.datepicker_context.mins.dataset.model = this.model

        this.datepicker_context.hrs.parent = this
        this.datepicker_context.mins.parent = this

        this.datepicker_context.hrs.innerHTML = this.addDateTimes('hours')
        this.datepicker_context.mins.innerHTML = this.addDateTimes('minutes')

        this.datepicker_context.hrs.addEventListener('change', function (e) {

                setTimeout(function(){
                    selectDate(e)
                },100)

        })

        this.datepicker_context.mins.addEventListener('change', function (e) {

                setTimeout(function(){
                    selectDate(e)
                },100)

        })

        if (this.datetime){
            this.datepicker_context.classList.add('datetime')
        }

        let model_date = new Evaluate().getValue(this.model)
        if (model_date){

            let date = new Date(model_date)
            this.getDaysArray(date.getFullYear(), date.getMonth(), date.getDate())
            this.datepicker_context.hrs.value = date.getHours()
            let mins = date.getMinutes()

            if (mins < 10){
                this.datepicker_context.mins.value = '0'+mins
            } else {
                this.datepicker_context.mins.value = mins+''
            }

        } else {

            let date = new Date()
            this.datepicker_context.hrs.value = date.getHours()
            let mins = date.getMinutes()

            if (mins < 10){
                this.datepicker_context.mins.value = '0'+mins
            } else {
                this.datepicker_context.mins.value = mins+''
            }
            this.getDaysArray()

        }

        view.enterView(this.datepicker_context).then(()=>{

        })

    }


    selectDate(evnt){

        if (evnt.target.dataset.date && evnt.target.dataset.date != 'undefined'){

            let date = new Date(evnt.target.dataset.date)

            let date_str

            if (typeof moment == 'function' && this.format){

                if (this.hrs && this.hrs.value && this.hrs.value < 24 && this.datetime){
                    date_str = moment(evnt.target.dataset.date).set({hours:this.hrs.value,mins:this.mins.value}).format(this.format)
                    date.setHours(this.hrs.value)

                    if (this.mins.value < 10){
                        this.mins.value = '0'+parseInt(this.mins.value)
                    }

                    if (this.mins && this.mins.value && this.mins.value < 60){
                        date.setMinutes(this.mins.value)
                    }
                } else {
                    date_str = moment(evnt.target.dataset.date).format(this.format)
                }


            } else {

                date_str = this.days[date.getDay()]+' '+this.dates[date.getDate()-1]+' '+this.months[date.getMonth()]+' '+date.getFullYear()

                if (this.hrs && this.hrs.value && this.hrs.value < 24 && this.datetime){
                    date.setHours(this.hrs.value)

                    if (this.mins.value < 10){
                        this.mins.value = '0'+parseInt(this.mins.value)
                    }

                    if (this.mins && this.mins.value && this.mins.value < 60){
                        date.setMinutes(this.mins.value)
                    }

                    date_str += " at "+this.hrs.value+":"+this.mins.value

                }

            }

            new Evaluate().setValue(evnt.target.dataset.model, date.toString())
            this.parent.querySelector('.value').innerHTML = date_str

            this.querySelectorAll(".date").forEach((el) => {
                el.classList.remove('selected');
            })

            evnt.target.classList.add('selected')

            if (!this.classList.contains('datetime')){
                view.exitView(this)
            }

            if (this.parent.on_change){
                new Evaluate(this.parent.on_change).value(evnt)
            }
        }

        if (evnt.target.classList.contains('dates-time-mins')){

            let date_val = new Evaluate().getValue(evnt.target.dataset.model),
                date = new Date(date_val)

            if (date instanceof Date && !isNaN(date)){
                date.setMinutes(evnt.target.value)

                let date_mins = date.getMinutes(),
                    date_str

                new Evaluate().setValue(evnt.target.dataset.model, date.toString())

                if (typeof moment == 'function' && evnt.target.parent.dataset.format){

                    date_str = moment(date.toISOString()).format(evnt.target.parent.dataset.format)

                } else {

                    if (date_mins < 10){
                        date_mins = '0'+date_mins
                    }

                    date_str = evnt.target.parent.days[date.getDay()]+' '+evnt.target.parent.dates[date.getDate()-1]+' '+evnt.target.parent.months[date.getMonth()]+' '+date.getFullYear()+" at "+date.getHours()+":"+date_mins

                }

                evnt.target.parent.querySelector('.value').innerHTML = date_str

                if (evnt.target.parent.on_change){
                    new Evaluate(evnt.target.parent.on_change).value(evnt)
                }
            }

        }

        if (evnt.target.classList.contains('dates-time-hrs')){

            let date_val = new Evaluate().getValue(evnt.target.dataset.model),
                date = new Date(date_val)

            if (date instanceof Date && !isNaN(date)){
                date.setHours(evnt.target.value)

                let date_mins = date.getMinutes(),
                    date_str

                new Evaluate().setValue(evnt.target.dataset.model, date.toString())

                if (typeof moment == 'function' && evnt.target.parent.dataset.format){

                    date_str = moment(date.toISOString()).format(evnt.target.parent.dataset.format)

                } else {

                    if (date_mins < 10){
                        date_mins = '0'+date_mins
                    }

                    date_str = evnt.target.parent.days[date.getDay()]+' '+evnt.target.parent.dates[date.getDate()-1]+' '+evnt.target.parent.months[date.getMonth()]+' '+date.getFullYear()+" at "+date.getHours()+":"+date_mins

                }

                evnt.target.parent.querySelector('.value').innerHTML = date_str

                if (evnt.target.parent.on_change){
                    new Evaluate(evnt.target.parent.on_change).value(evnt)
                }

            }


        }

        if (evnt.target.dataset.year){
            let month = this.selected.getMonth()-1

            if (month < 0){
                month = 11
            }
            
            this.parent.getDaysArray(evnt.target.dataset.year, month)
            return
        }

        if (evnt.target.dataset.month){
            this.parent.getDaysArray(this.selected.getFullYear(), evnt.target.dataset.month)
            return
        }

        if (evnt.target.classList.contains('prev')){
            let monthIdx = this.selected.getMonth()-2
            this.selected.setMonth(monthIdx)
            this.parent.getDaysArray(this.selected.getFullYear(), this.selected.getMonth())
            return
        }

        if (evnt.target.classList.contains('next')){
            let newDate = new Date(this.selected.setMonth(this.selected.getMonth()))
            this.parent.getDaysArray(newDate.getFullYear(), newDate.getMonth())
            return
        }

        if (evnt.target.classList.contains('open-year-select')){
            this.parent.openYearSelect(this)
            return
        }

        if (evnt.target.classList.contains('dates-clear')){
            new Evaluate().setValue(this.parent.model, '')
            this.parent.querySelector('.value').innerHTML = ''
            return
        }

        if (evnt.target.classList.contains('dates-close')){
            view.exitView(this)
            return
        }

    }

    openYearSelect(datepicker){

        let wrap = datepicker.querySelector('.year-select'),
            months = datepicker.querySelector('.months'),
            years = datepicker.querySelector('.years')

        if (!this.year_select_open){

            wrap.style.display = 'flex'
            wrap.style.height = '10rem'
            wrap.style.width = '100%'
            wrap.style.overflowY = 'hidden'
            wrap.style.margin = '1rem 0'
    
            years.style.overflowY = 'scroll'
            years.style.height = '10rem'
            years.style.flex = '1'
            months.style.overflowY = 'scroll'
            months.style.height = '10rem'
            months.style.flex = '1'
    
            years.innerHTML = ''
            months.innerHTML = ''
    
            this.years.forEach((year)=>{
                years.innerHTML += '<div id="year-'+year+'" class="year context-link w-100 flex-middle" style="cursor: pointer; height:2rem" data-year="'+year+'">'+year+'</div>'
            })
    
            this.months.forEach((month, i)=>{
                months.innerHTML += '<div id="month-'+i+'" class="month context-link w-100 flex-middle" style="cursor: pointer; height:2rem" data-month="'+i+'">'+month+'</div>'
            })
    
            let scroll_year = years.querySelector('#year-'+datepicker.selected.getFullYear())
            years.scrollTop = scroll_year.offsetTop-128
    
            let scroll_month = months.querySelector('#month-'+datepicker.selected.getMonth())
            months.scrollTop = scroll_month.offsetTop-156

        } else {

            wrap.style.display = 'none'

        }

        this.year_select_open = !this.year_select_open
    
    }

    getDate(model_date){

        return new Promise( async (resolve, reject) => {

            setTimeout(function(){
                model_date = new Evaluate().getValue(model_date)
                resolve(model_date)
            },1000)


        })

    }


}

customElements.define('date-picker', DatePicker);
