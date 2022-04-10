
export class ContentEditable extends HTMLElement {

    constructor() {
        super();

        this.style.display = 'block'
        this.style.height = '100%'
        this.style.minHeight = '32px'
        this.style.width = '100%'
        
        this.editor = document.createElement('div')
        this.editor.setAttribute('tabindex',1)
        this.editor.style.height = '100%'
        this.editor.style.minHeight = '32px'
        this.editor.style.width = '100%'
        
        this.appendChild(this.editor)
        this.editor.addEventListener('keydown', this.insertContent)
        
    }

    insertContent(evnt){

        console.log(evnt.keyCode)

        if (/^[a-zA-Z0-9-_\s!"£$%^&*()\[\]#'@?/\\.,><~]$/.test(evnt.key)){

            this.innerHTML += evnt.key

        } else if (evnt.keyCode == 8){ // backspace

            var textNode = this.firstChild
            textNode.data = textNode.data.slice(0, -1)

        } else if (evnt.keyCode == 13){ // enter

            this.innerHTML += '<br>'

        } else if (evnt.keyCode == 16){ // backspace
            this.parentNode.insertHtmlAfterSelection('h1')
        }
    
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
        var sel, range, expandedSelRange, node, text;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = window.getSelection().getRangeAt(0);
                expandedSelRange = range.cloneRange();
            //    range.collapse(false);
            console.log(range.startContainer)
            text = range.startContainer.data
            range.deleteContents();
                // Range.createContextualFragment() would be useful here but is
                // non-standard and not supported in all browsers (IE9, for one)
                var el = document.createElement(tag);
                el.innerHTML = text;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                
                range.insertNode(frag);
    
                // Preserve the selection
                if (lastNode) {
                    expandedSelRange.setEndAfter(lastNode);
                    sel.removeAllRanges();
                    sel.addRange(expandedSelRange);
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

}

customElements.define('content-editable', ContentEditable);