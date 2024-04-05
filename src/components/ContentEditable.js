
export class ContentEditable extends HTMLElement {

    constructor() {
        super();

        this.style.display = 'block'
        this.style.height = '100%'
        this.style.minHeight = '32px'
        this.style.width = '100%'
        this.style.backgroundColor = '#ccc'
        
        this.buttons = document.createElement('div')
        this.buttons.style.height = '100%'
        this.buttons.style.minHeight = '32px'
        this.buttons.style.width = '100%'

        this.editor = document.createElement('div')
        this.editor.setAttribute('contenteditable',true)
        this.editor.style.display = 'inline-block'
        this.editor.style.height = '100%'
        this.editor.style.minHeight = '32px'
        this.editor.style.width = '100%'

        this.addButton('h1','H1')
        this.appendChild(this.buttons)
        this.appendChild(this.editor)
        //this.editor.addEventListener('keydown', this.insertContent)
        this.editor.addEventListener('keydown', this.insertContent)
        
    }

    insertContent(evnt){
     //   evnt.preventDefault()
        // console.log(evnt.keyCode)

        // if (/^[a-zA-Z0-9-_\s!"£$%^&*()\[\]#'@?/\\.,><~]$/.test(evnt.key)){

        //  //   this.innerHTML += evnt.key

        // } else if (evnt.keyCode == 8){ // backspace

        //     var textNode = this.firstChild
        //     textNode.data = textNode.data.slice(0, -1)

        // } else if (evnt.keyCode == 13){ // enter

        //     this.innerHTML += '<br>'

        // } else if (evnt.keyCode == 16){ // backspace
        //     this.parentNode.insertHtmlAfterSelection('h1')
        // }
    
    }


    replaceSelectedText(replacementText, tag) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(replacementText));
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = replacementText;
        }
    }

    insertHtmlAfterSelection(tag) {
        
        if (this.dataset.tag){
            tag = this.dataset.tag
        }

        var sel, range, expandedSelRange, node, text;

        if (window.getSelection) {

            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {

                range = window.getSelection().getRangeAt(0);
                expandedSelRange = range.cloneRange();
            //    range.collapse(false);
      
                text = range.startContainer.data
                console.log(text)
                range.deleteContents();

                var el = document.createElement('div');
                el.innerHTML = '<'+tag+'>'+text+'</'+tag+'>'

                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true)
                    sel.removeAllRanges();
                    sel.addRange(range);
                }

            }

        } else if (document.selection && document.selection.createRange) {

            range = document.selection.createRange();
            expandedSelRange = range.duplicate();
            range.collapse(false);
            range.deleteContents();
            range.pasteHTML(html);
            expandedSelRange.setEndPoint("EndToEnd", range);
            expandedSelRange.select();

        }
    }


    addButton(tag, text){

        let new_button = document.createElement('button')
        new_button.innerHTML = text
        new_button.setAttribute('data-tag', tag)
        new_button.addEventListener('click',this.insertHtmlAfterSelection)
        this.buttons.appendChild(new_button)

    }

}

customElements.define('content-editable', ContentEditable);