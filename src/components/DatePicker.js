
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
            <div type="text" class="value context-link" data-value="true">${this.placeholder}</div>

            <div class="dates-wrap context" data-animation="{'enter':'drop-down','exit':'drop-up'}">
                
                <div class="dates-time context-link">
                    <div class="dates-time-title">Set time</div>
                    <div class="dates-time-input-wrap">
                        <select class="context-link dates-time-hrs"></select>
                        <div class="divider">:</div>
                        <select class="context-link dates-time-mins"></select>
                    </div>
                </div>
                <div class="dates-header">
                    <div class="arrow prev context-link">&lt;</div>
                    <div class="month-wrap context-link open-year-select clickable">
                        <div class="month context-link open-year-select"></div>
                        <div class="year context-link open-year-select"></div>
                    </div>
                    <div class="arrow next context-link">&gt;</div>
                </div>
                <div class="year-select">
                    <div class="months"></div>
                    <div class="years"></div>
                </div>
                <div class="dates">
                    <div class="weekdays">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div>
                        <div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div class="days-grid"></div>
                </div>
                <div class="dates-buttons">
                    <div class="dates-clear context-link btn bg-white">
                        Clear
                    </div>
                    <div class="dates-close context-link btn bg-primary">
                        Set
                    </div>
                </div>
            </div>
        `;

        this.months = ['January','February','March','April','May','June','July','August','September','October','November','December']
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

        // Initialize state
        this.currentDate = new Date()
        this.selectedDate = null
        this.year_select_open = false

        this.addEventListener('click',this.openDatePicker)

        let value_div = this.querySelector('.value')
        
        this.getDate(this.model).then((model_date)=>{
            if (model_date){
                this.selectedDate = new Date(model_date)
                this.currentDate = new Date(model_date)
                this.updateDisplayValue()
            }
        })

    }

    setDate(model_date){
        this.selectedDate = new Date(model_date)
        this.currentDate = new Date(model_date)
        this.updateDisplayValue()
    }

    updateDisplayValue() {
        let date_str
        let value_div = this.querySelector('.value')

        if (!this.selectedDate) {
            value_div.innerHTML = this.placeholder
            return
        }

        if (typeof moment == 'function' && this.format){
            date_str = moment(this.selectedDate).format(this.format)
        } else {
            const dateOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };

            if (this.datetime) {
                date_str = this.selectedDate.toLocaleString('en-US', {
                    ...dateOptions,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            } else {
                date_str = this.selectedDate.toLocaleDateString('en-US', dateOptions);
            }
        }
        value_div.innerHTML = date_str
    }

    updateHeader() {
        const month_div = this.datepicker_context.querySelector('.month')
        const year_div = this.datepicker_context.querySelector('.year')
        
        month_div.innerHTML = this.months[this.currentDate.getMonth()]
        year_div.innerHTML = this.currentDate.getFullYear()
    }

    generateCalendar() {
        const year = this.currentDate.getFullYear()
        const month = this.currentDate.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startPadding = firstDay.getDay()
        const daysInMonth = lastDay.getDate()

        const daysGrid = this.datepicker_context.querySelector('.days-grid')
        daysGrid.innerHTML = ''

        // Add padding days from previous month
        for (let i = 0; i < startPadding; i++) {
            const paddingDiv = document.createElement('div')
            paddingDiv.className = 'date padding context-link'
            daysGrid.appendChild(paddingDiv)
        }

        // Add days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const isSelected = this.selectedDate && date.toDateString() === this.selectedDate.toDateString()
            
            const dayDiv = document.createElement('div')
            dayDiv.className = `date context-link ${isSelected ? 'selected' : ''}`
            dayDiv.innerHTML = day
            dayDiv.dataset.date = date.toISOString()
            dayDiv.dataset.model = this.model
            
            daysGrid.appendChild(dayDiv)
        }
    }

    setupTimeInputs() {
        if (!this.datetime) return

        const hrs = this.datepicker_context.querySelector('.dates-time-hrs')
        const mins = this.datepicker_context.querySelector('.dates-time-mins')

        // Populate hours dropdown (00-23)
        hrs.innerHTML = ''
        for (let i = 0; i < 24; i++) {
            const option = document.createElement('option')
            const value = i.toString().padStart(2, '0')
            option.value = value
            option.textContent = value
            hrs.appendChild(option)
        }

        // Populate minutes dropdown (00-59)
        mins.innerHTML = ''
        for (let i = 0; i < 60; i++) {
            const option = document.createElement('option')
            const value = i.toString().padStart(2, '0')
            option.value = value
            option.textContent = value
            mins.appendChild(option)
        }

        // Set current values
        if (this.selectedDate) {
            hrs.value = this.selectedDate.getHours().toString().padStart(2, '0')
            mins.value = this.selectedDate.getMinutes().toString().padStart(2, '0')
        } else {
            const now = new Date()
            hrs.value = now.getHours().toString().padStart(2, '0')
            mins.value = now.getMinutes().toString().padStart(2, '0')
        }

        hrs.addEventListener('change', (e) => {
            this.updateTimeValue('hours', parseInt(e.target.value))
        })

        mins.addEventListener('change', (e) => {
            this.updateTimeValue('minutes', parseInt(e.target.value))
        })
    }

    updateTimeValue(type, value) {
        if (!this.selectedDate) {
            this.selectedDate = new Date()
        }

        if (type === 'hours') {
            this.selectedDate.setHours(value)
        } else if (type === 'minutes') {
            this.selectedDate.setMinutes(value)
        }

        new Evaluate().setValue(this.model, this.selectedDate.toISOString())
        this.updateDisplayValue()

        if (this.on_change) {
            new Evaluate(this.on_change).value({ target: this })
        }
    }

    openDatePicker(evnt){
        var selectDate = this.selectDate.bind(this)

        document.querySelector('body').style.overflowY = 'hidden'

        this.datepicker_context = createContextMenu('dates-wrap', this.datepicker.innerHTML, this.getBoundingClientRect())
        this.datepicker_context.addEventListener('click', selectDate)
        this.datepicker_context.days = this.days
        this.datepicker_context.months = this.months
        this.datepicker_context.dates = this.dates
        this.datepicker_context.datetime = this.datetime
        this.datepicker_context.format = this.format
        this.datepicker_context.parent = this

        if (this.datetime){
            this.datepicker_context.classList.add('datetime')
        }

        // Initialize current date from model or use today
        let model_date = new Evaluate().getValue(this.model)
        if (model_date){
            this.selectedDate = new Date(model_date)
            this.currentDate = new Date(model_date)
        } else if (!this.selectedDate) {
            this.currentDate = new Date()
        }

        this.updateHeader()
        this.generateCalendar()
        this.setupTimeInputs()

        view.enterView(this.datepicker_context).then(()=>{
            // Calendar is now visible
        })
    }


    selectDate(evnt){
        // Handle day selection
        if (evnt.target.classList.contains('date') && !evnt.target.classList.contains('padding') && evnt.target.dataset.date) {
            const newDate = new Date(evnt.target.dataset.date)

            // Preserve time if datetime mode and we have a selected date
            if (this.datetime && this.selectedDate) {
                newDate.setHours(this.selectedDate.getHours())
                newDate.setMinutes(this.selectedDate.getMinutes())
            }

            this.selectedDate = newDate
            new Evaluate().setValue(this.model, this.selectedDate.toISOString())
            this.updateDisplayValue()
            this.generateCalendar()

            // Don't auto-close popup - let user click "Set" button to close

            if (this.on_change) {
                new Evaluate(this.on_change).value(evnt)
            }
            return
        }

        // Handle navigation
        if (evnt.target.classList.contains('prev')) {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1)
            this.updateHeader()
            this.generateCalendar()
            return
        }

        if (evnt.target.classList.contains('next')) {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1)
            this.updateHeader()
            this.generateCalendar()
            return
        }

        // Handle year/month selection
        if (evnt.target.classList.contains('open-year-select')) {
            this.openYearSelect(this.datepicker_context)
            return
        }

        if (evnt.target.dataset.year) {
            this.currentDate.setFullYear(parseInt(evnt.target.dataset.year))
            
            // Update selected date if one exists
            if (this.selectedDate) {
                this.selectedDate.setFullYear(parseInt(evnt.target.dataset.year))
                new Evaluate().setValue(this.model, this.selectedDate.toISOString())
                this.updateDisplayValue()
                
                if (this.on_change) {
                    new Evaluate(this.on_change).value(evnt)
                }
            }
            
            this.updateHeader()
            this.generateCalendar()
            this.openYearSelect(this.datepicker_context) // Close year select
            return
        }

        if (evnt.target.dataset.month) {
            this.currentDate.setMonth(parseInt(evnt.target.dataset.month))
            
            // Update selected date if one exists
            if (this.selectedDate) {
                this.selectedDate.setMonth(parseInt(evnt.target.dataset.month))
                new Evaluate().setValue(this.model, this.selectedDate.toISOString())
                this.updateDisplayValue()
                
                if (this.on_change) {
                    new Evaluate(this.on_change).value(evnt)
                }
            }
            
            this.updateHeader()
            this.generateCalendar()
            this.openYearSelect(this.datepicker_context) // Close year select
            return
        }

        // Handle buttons
        if (evnt.target.classList.contains('dates-clear')) {
            this.selectedDate = null
            new Evaluate().setValue(this.model, '')
            this.updateDisplayValue()
            
            // Ensure currentDate is valid before regenerating calendar
            if (!this.currentDate || isNaN(this.currentDate.getTime())) {
                this.currentDate = new Date()
            }
            
            // Regenerate calendar to remove selection highlighting but keep current month/year
            this.generateCalendar()
            
            if (this.on_change) {
                new Evaluate(this.on_change).value(evnt)
            }
            return
        }

        if (evnt.target.classList.contains('dates-close')) {
            view.exitView(this.datepicker_context)
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
    
            let scroll_year = years.querySelector('#year-'+this.currentDate.getFullYear())
            if (scroll_year) {
                years.scrollTop = scroll_year.offsetTop-128
            }
    
            let scroll_month = months.querySelector('#month-'+this.currentDate.getMonth())
            if (scroll_month) {
                months.scrollTop = scroll_month.offsetTop-156
            }
        } else {
            wrap.style.display = 'none'
        }

        this.year_select_open = !this.year_select_open
    }

    getDate(model_date){
        return new Promise((resolve) => {
            setTimeout(() => {
                model_date = new Evaluate().getValue(model_date)
                resolve(model_date)
            }, 100) // Reduced timeout for better responsiveness
        })
    }


}

customElements.define('date-picker', DatePicker);
