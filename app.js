
class Backdrop{
    constructor(){
        this.backdropEl = document.querySelector('.backdrop')
    }
    open(){
        this.backdropEl.classList.add('backdrop-open')
    }
    close(){
        this.backdropEl.classList.remove('backdrop-open')
    }

}


class AddTableModal{
    constructor(parent){
        this.parent = parent
        this.backdrop = new Backdrop()
        this.addModalEl = document.querySelector('.add-room-modal')
        document.querySelector('.add-room-modal').onclick = this.closeModal;
        this.newRoomButton = document.querySelector('.new-room-button')
        this.newRoomButton.onclick = this.openModal
    }
    openModal = () =>{
        this.backdrop.open()
        this.addModalEl.classList.add('modal-open')
    };
    closeModal = () =>{
        this.backdrop.close()
        this.addModalEl.classList.remove('modal-open')
       
    };

}

class Table{
    constructor(){
        this.tableEl = document.querySelector('.main-table')
        this.tbodyEl = document.querySelector('.main-body')
        // this.tableModal = new AddTableModal()
        // this.tableModal.open()
        // this.addModalEl = document.querySelector('.add-room-modal')
        // this.backdrop = new Backdrop()
        this.AddTableModal = new AddTableModal(this)
    
    }
    
    addRoom(){

    }

}

const table = new Table()
   