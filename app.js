
class Backdrop{
    constructor(clickHandler){
        this.backdropEl = document.querySelector('.backdrop')
        this.backdropEl.onclick = clickHandler
    }
    open(){
        this.backdropEl.classList.add('backdrop-open')
    }
    close(){
        this.backdropEl.classList.remove('backdrop-open')
    }

}
class Modal{
    constructor(className){
        this.className = className
        this.backdrop = new Backdrop()
        this.modal = document.querySelector('.' + className)
        this.xButtonEl = this.modal.lastElementChild
        this.xButtonEl.onclick = this.closeModal
        this.exitButtonEl = this.modal.lastElementChild.previousElementSibling.lastElementChild
        this.exitButtonEl.onclick =this.closeModal
        this.backdrop = new Backdrop(this.closeModal)

    }
    openModal = () =>{
        this.backdrop.open()
        this.modal.classList.add('modal-open')
    };
    closeModal = () =>{
        this.backdrop.close()
        this.modal.classList.remove('modal-open')
       
    };
}
class FormItem{
    constructor(element){
        this.element = element
        this.errorElement = this.element.nextElementSibling
        this.hasError = false
    }
    setError = (message) =>{
        this.element.classList.add('error')
        this.errorElement.textContent = message
        this.hasError = true
    }
    clearError = ()=>{
        this.element.classList.remove('error')
        this.errorElement.textContent = ''
        this.hasError =  false

    }
    get hasValue() {
        return Boolean(this.element.value)
    }
    
}

class InputController extends FormItem{
    constructor(element,changeHandler){
        super(element)
        this.element.oninput = changeHandler
    }
    
    
}

class SelectController extends FormItem{
    constructor(element){
        super(element)
        this.element.onchange = this.changeHandler
    }
    changeHandler = () =>{
        const selectValue = this.element.value
        this.value = selectValue
    }
}
class PositiveNumberInputController extends InputController{
    constructor(element){
        super(element)
        this.element.oninput = this.changeHandler
        this.value = ''
        
    }
    changeHandler = () =>{
        const newValue = this.element.value
        if(/^\d*$/.test(newValue)){
            this.value = newValue
            this.clearError()
        }else{
            this.element.value = this.value
            this.setError('sadece reqem girilmelidir')
        }
    }
}
// class FillinInputController extends InputController{
//     constructor(element){
//         super(element)
//         this.element.oninput = this.changeHandler
//         this.value = ''
//     }
//     changeHandler = () =>{
//         const fillValue = this.element.value
//         if(/^\d*$/.test(fillValue)){
//             this.value = fillValue
//             this.clearError()
//         }else{
//             this.element.value = this.value
//             this.setError('Sadece reqem girilmelidir')
//         }

//     }

// }


class AddRoomModal extends Modal{
    constructor(parent){
        super('add-room-modal')
        this.parent = parent
        this.newRoomButton = document.querySelector('.new-room-button')
        this.newRoomButton.onclick = this.openModal
        // this.userButton = document.querySelector('.userButton')
        // this.userButton.onclick = this.openModal
        // this.form = document.querySelector('.modal-fill-in')
        this.form = document.querySelector('.add-room-modal form')
        this.numberInput = new PositiveNumberInputController(this.form[0])
        this.floorInput = new PositiveNumberInputController(this.form[1])
        this.typeSelect = new SelectController(this.form[2])
        this.priceInput = new PositiveNumberInputController(this.form[3])
        // this.nameInput = new FillinInputController(this.form[0])
        // this.dateInput = new FillinInputController(this.form[1])
        // this.formItems1 = [this.nameInput,this.dateInput]
        this.formItems = [this.numberInput,this.floorInput,this.typeSelect,this.priceInput]
        this.saveButton = document.querySelector('.add-room-modal .save')
        // this.saveFillin = document.querySelector('.modal-fill-in .save')
        // this.saveFillin.onclick = this.saveHandler
        this.saveButton.onclick = this.saveHandler
    }
    
    checkValidity = ()=>{
        for(let formItem of this.formItems){
            if(formItem.hasError){
                return false
            }else if(!formItem.hasValue){
                formItem.setError('bura bos ola bilmez')
                return false
            }
        }
        return true
    }
    saveHandler = () =>{
        if(this.checkValidity()){
            const info ={
                price:this.priceInput.value,
                floor:this.floorInput.value,
                type:this.typeSelect.value,
                number:this.numberInput.value,
                // name:this.nameInput.value,
                // date:this.dateInput.value
            }
            this.parent.renderRooms(info)
            this.saveDataToLocalStorage(info);
            this.clearInputFields();
        }else{
            console.log('bos yer var');
        }
    }

    clearInputFields() {
        this.form.reset();
    }
    saveDataToLocalStorage(info) {
        const existingData = JSON.parse(localStorage.getItem('roomData')) || [];
        existingData.push(info);
        localStorage.setItem('roomData', JSON.stringify(existingData));
    }
   
    
}

class Table{
    constructor(){
        this.tableEl = document.querySelector('.main-table')
        this.tbodyEl = document.querySelector('.main-body')
        this.addRoomModal = new AddRoomModal(this)
        this.rooms = this.loadLocalStorage();
        this.renderRooms();
        this.tbodyEl.addEventListener('click', (event) => {
            const trashButton = event.target.closest('.delete-button');
            if (trashButton) {
                const key = trashButton.getAttribute('data-key');
                if (key) {
                    localStorage.removeItem(key);
                   
                    trashButton.closest('tr').remove();
                }
            }
        });
      
    }


    get getRoomCount(){
        return this.rooms.length
    }

    loadLocalStorage(){
        const roomData=JSON.parse(localStorage.getItem('roomData')) || [];
        
        return roomData;
    }


    renderRooms(){
        this.rooms.forEach((info,index)=>{
        const roomElement =`
            <td>${index + 1}</td>
            <td>${info.number}</td>
            <td>${info.floor}</td>
            <td>${info.type}</td>
            <td><i class="fa-regular fa-circle-check"></i></td>
            <td>---</td>
            <td>---</td>
            <td>${info.price}</td>
            <td><i class="fa-regular fa-square-plus userButton"></i></td>
            <td><i class="fa-solid fa-user-minus "></i></td>
            <td><i class="fa-solid fa-trash-can delete-button"></i></td>
        `
        const tr = document.createElement('tr')
        tr.innerHTML = roomElement
        this.tbodyEl.appendChild(tr)
        
       
        this.addRoomModal.closeModal()
    });
   
}
}
 const table = new Table();

   