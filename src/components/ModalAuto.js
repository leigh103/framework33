
export class ModalAuto extends HTMLElement {

  constructor() {
    super();

    if (!this.hasAttribute('required')){
        this.setAttribute('app-click','closeModal()')
    }

    this.classList.add('animate','fade-in-out')

    if (!this.dataset.title){
        this.dataset.title = ''
    }

    this.innerHTML = `

        <section>

            <header>
                <div>`+this.dataset.title+`</div>
                <div class="text-right" app-click="closeModal()">
                    <span class="icon x"></span>
                </div>
            </header>

            <section class="body">

                `+this.innerHTML+`

            </section>

        </section>

  `;
  }
}

customElements.define('modal-auto', ModalAuto);
