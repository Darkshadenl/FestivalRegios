// export default class DragDrop {
//
//     original_container;
//     button_text;
//     succesful_drop = false;
//
//     constructor() {
//         this.createDropTargets();
//         this.prepareLists();
//     }
//
//     createDropTargets(){
//         let drop_targets = document.getElementById('made_choices');
//
//         // remove elements from previous screen
//         if (drop_targets.hasChildNodes()) {
//             drop_targets.innerHTML = '';
//         }
//
//         for (let i = 0; i < 15; i++){
//             let div = document.createElement('div');
//             div.className = 'droptarget grid-item list';
//             div.id = i.toString();
//             drop_targets.appendChild(div);
//         }
//     }
//
//
//     prepareLists() {
//         let container_lists = document.querySelectorAll('.list');
//
//         container_lists.forEach(list => {
//             list.addEventListener('dragover', this.dragOver);
//             list.addEventListener('dragenter', this.dragEnter);
//             list.addEventListener('dragleave', this.dragLeave);
//             list.addEventListener('drop', this.dragDrop);
//         });
//     }
//
//     dragStart(event) {
//         console.log('Drag started');
//
//         setTimeout(() => {
//             this.style.display = 'none';
//         }, 0);
//
//         if (this.className === 'dragButtonV2'){
//
//         } else {
//
//         }
//         event.target.style.opacity = '.5';
//         event.dataTransfer.setData("Text", this.innerText);
//         // event.dataTransfer.setData("original_container", this.parentNode.id);
//         this.#original_container = this.parentNode;
//         this.#button_text = this.innerText;
//
//     }
//
//     dragEnd(event) {
//         console.log('Drag ended');
//         let orig_c = document.getElementById(original_container.id);
//
//         if (!succesful_drop){
//             let button = getDraggableButton();
//             button.innerText = button_text;
//
//             if (original_container.parentNode.id  === 'made_choices'){
//                 button.className = 'dragButtonV2';
//             } else if (original_container.id === 'choice_menu'){
//                 button.className = 'btn btn-secondary dragButton';
//             }
//             orig_c.appendChild(button);
//         } else {
//             succesful_drop = false;
//         }
//         event.target.style.opacity = "";
//         orig_c.firstChild.remove();
//     }
//
//     dragDrop(event) {
//         event.preventDefault();
//
//         let button = getDraggableButton();
//         button.innerText = event.dataTransfer.getData('Text');
//
//         if (event.target.parentNode.id === 'made_choices'){
//             button.className = 'dragButtonV2';
//             event.target.style.background = '#E0FFFF';
//             this.appendChild(button);
//         } else if (event.target.id === 'choice_menu'){
//             button.className = 'btn btn-secondary dragButton';
//             event.target.style.background = '#A52A2A';
//             this.appendChild(button);
//         } else {
//             succesful_drop = false;
//             return;
//         }
//         succesful_drop = true;
//     }
//
//
//
//     dragOver(e) {
//         e.preventDefault();
//     }
//
//     dragEnter(e) {
//         console.log(e.target.id);
//
//         if (e.target.id === 'choice_menu'){
//             e.target.style.background = '#ff706d';
//         }
//         if (e.target.parentNode.id === 'made_choices'){
//             e.target.style.background = '#ff9c93';
//         }
//
//     }
//
//     dragLeave(e) {
//         e.preventDefault();
//         if (e.target.id === 'choice_menu' || e.target.parentNode.id === 'made_choices'){
//             e.target.style.background = '';
//         }
//     }
// }