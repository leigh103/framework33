
export class DatePickerStatic extends HTMLElement {

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

            <div class="dates-wrap">
                <div class="dates-time">
                    <div class="dates-time-title">Set time</div>
                    <div class="dates-time-input-wrap">
                        <input type="text" placeholder="17" class="text-right context-link dates-time-hrs" min="0" max="23">
                        <div class="divider">:</div>
                        <input type="text" placeholder="45" class="text-right context-link dates-time-mins" min="0" max="59">
                    </div>
                </div>
                <div class="dates-header">
                    <div class="arrow prev context-link"><</div>
                    <div class="month-wrap">
                        <div class="month"></div>
                        <div class="year"></div>
                    </div>
                    <div class="arrow next context-link">></div>
                </div>
                <div class="dates">

                </div>

            </div>

        `;

        this.months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
        this.months_short = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        this.dates = ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st'],
        this.days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        this.days_short = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],

        this.datepicker = this.querySelector('.dates-wrap')

        this.getDate(this.model).then((model_date)=>{
            this.openDatePicker()
        })

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
          date_div = this.datepicker.querySelector('.dates'),
          month_div = this.datepicker.querySelector('.month'),
          year_div = this.datepicker.querySelector('.year'),
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

          this.datepicker.selected = date

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

    openDatePicker(evnt){

        var selectDate = this.selectDate

        this.datepicker.addEventListener('click',selectDate)
        this.datepicker.days = this.days
        this.datepicker.months = this.months
        this.datepicker.dates = this.dates
        this.datepicker.datetime = this.datetime
        this.datepicker.format = this.format
        this.datepicker.parent = this
        this.datepicker.hrs = this.datepicker.querySelector('.dates-time-hrs')
        this.datepicker.mins = this.datepicker.querySelector('.dates-time-mins')

        this.datepicker.hrs.dataset.model = this.model
        this.datepicker.mins.dataset.model = this.model

        this.datepicker.hrs.parent = this
        this.datepicker.mins.parent = this

        this.datepicker.hrs.addEventListener('keydown', function (e) {
            if (parseInt(e.key) || e.key == 0) {
                setTimeout(function(){
                    selectDate(e)
                },100)

            }
        })

        this.datepicker.mins.addEventListener('keydown', function (e) {
            if (parseInt(e.key) || e.key == 0) {
                setTimeout(function(){
                    selectDate(e)
                },100)
            }
        })

        if (this.datetime){
            this.datepicker.classList.add('datetime')
        }

        let model_date = new Evaluate().getValue(this.model)
        if (model_date){
            let date = new Date(model_date)
            this.getDaysArray(date.getFullYear(), date.getMonth(), date.getDate())
            this.datepicker.hrs.value = date.getHours()

            this.datepicker.mins.value = date.getMinutes()
            if (this.datepicker.mins.value < 10){
                this.datepicker.mins.value = '0'+this.datepicker.mins.value
            }
        } else {

            let date = new Date()
            this.datepicker.hrs.value = date.getHours()
            this.datepicker.mins.value = date.getMinutes()
            if (this.datepicker.mins.value < 10){
                this.datepicker.mins.value = '0'+this.datepicker.mins.value
            }
            this.getDaysArray()
        }

        view.enterView(this.datepicker).then(()=>{

        })

    }


    selectDate(evnt){

        if (evnt.target.dataset.date){

            let date = new Date(evnt.target.dataset.date)

            new Evaluate().setValue(evnt.target.dataset.model, date.toString())

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

                new Evaluate().setValue(evnt.target.dataset.model, date.toString())

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

                new Evaluate().setValue(evnt.target.dataset.model, date.toString())

                if (evnt.target.parent.on_change){
                    new Evaluate(evnt.target.parent.on_change).value(evnt)
                }

            }


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

customElements.define('date-picker-static', DatePickerStatic);
