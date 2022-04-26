const taskArr = [];



// createTaskList();



//форма
const inputClear = document.querySelector('.addTask__input--clear');
inputClear.addEventListener('click', clearInput);
function clearInput(){
    const input = document.querySelector('.addTask__input');
    input.value = "";
}

const inputForm = document.querySelector('.addTask');
inputForm.addEventListener('submit', onSubmit);
const inputWindow = document.querySelector('.addTask__input');

function onSubmit(event){
    event. preventDefault();

    if(inputWindow.value !== ""){
        const newTaskObj = {task:inputWindow.value, status:'Active', deleted:false, id:Date.now()}
    // taskArr.push(newTaskObj);
    serverAddTask(newTaskObj);

    inputWindow.value = "";
    inputWindow.classList.remove('paint_red');
    inputWindow.placeholder = 'Your task?'; 
    // dataFromServer();
    }else{
        inputWindow.classList.add('paint_red');
        inputWindow.placeholder = 'WHRITE THE F*** TASK';        
        inputWindow.focus();
    }
    console.log(taskArr);
}
//----------------------------------------------------------------------------




//створення верстки
function createTaskList(){
    const taskArrWithoutDeleted = taskArr.filter(item=>item.deleted===false).
    filter(item=>{
        if(RadioValue()==='All'){
            return true;
        }else if(item.status===RadioValue()){
            return true;
        }else{return false}

        });



    const arr = [];
    const list = document.querySelector('.taskList');
    for(let i=0; i<taskArrWithoutDeleted.length; i++){
        arr.push(createTask(taskArrWithoutDeleted[i].task, taskArrWithoutDeleted[i].id,taskArrWithoutDeleted[i].status));
    }    
    render(arr,list);
    delEnable();
    finishedEnable();
}

function createTask (text, idn, status){
    let $status;
    if(status==='Active'){$status=false}
    else{$status=true}

    const task__checkbox = createElement('input',{type:"checkbox", className: "task__checkbox", checked: $status} );
    const task__checkbox_label = createElement('label',{className: "task__checkbox--label"});
    const task__checkbox__wrapper = createElement('div',{className: "task__checkbox__wrapper"});
    task__checkbox_label.append(task__checkbox);
    task__checkbox__wrapper.append(task__checkbox_label);
    const task__text = createElement('div', {className:'task__text'}, text);
    task__text.addEventListener('click',dbClick);
    const task__delete = createElement('div',{className:'task__delete', id:idn}, 'delete');
    const task = createElement('div',{className:'task'});
    const changeTask__wrapper = createElement('form',{className:'changeTask__wrapper'});
    changeTask__wrapper.addEventListener('submit', editingDone);
    const changeTask__input = createElement('input',{type:'text',className:'changeTask__input'});
    changeTask__input.addEventListener('blur', editingDone);
    changeTask__wrapper.append(changeTask__input);
    task.append(task__checkbox__wrapper, task__text, task__delete,changeTask__wrapper);

    return task; 
}
//___________________

function delEnable (){
const deleteButtons = document.querySelectorAll('.task__delete');
for(let i=0; i<deleteButtons.length; i++){
    deleteButtons[i].addEventListener('click', deleteFunc);
}
}

function deleteFunc (event){
    let idn = event.target.id;
    for(let i=0; i<taskArr.length; i++){
        if(taskArr[i].id===+idn){
            taskArr[i].deleted=true
            sendRequest('PUT', 'https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks', {deleted: true},taskArr[i].identification)
            .then(()=>dataFromServer());
        }else{console.log('no id');
        }
    }
    dataFromServer();
}

function RadioValue (){
    const a = document.querySelector('input[name="filter"]:checked');
    return a.id;
}

function finishedEnable(){
    const checkBoxes = document.querySelectorAll('.task__checkbox');
    for(let i=0; i<checkBoxes.length; i++){
        checkBoxes[i].addEventListener('change', finishFunc);
    }
}
function finishFunc(event){
    let idn = event.target.closest('.task').children[2].id;
    for(let i=0; i<taskArr.length; i++){
        if(taskArr[i].id===+idn){
            if(event.target.checked===true){
                taskArr[i].status='Finished';
                sendRequest('PUT', 'https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks', {status:'Finished'},taskArr[i].identification)
                .then(()=>dataFromServer());
            }else if(event.target.checked===false){
                taskArr[i].status='Active'
                sendRequest('PUT', 'https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks', {status:'Active'},taskArr[i].identification)
                .then(()=>dataFromServer());
            }
        else{console.log('no id');
        }
        }
    }
    // dataFromServer();
}

//сервер
//запис

function serverAddTask( task ){
    const response = fetch('https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks',
        {
            method: 'POST',
            headers: {
                "Content-Type" : "application/json;charset=UTF-8"
            },
            body: JSON.stringify(task) ,
        }
    ).then(()=>dataFromServer())
    .then(()=>console.log(response));
    
}

//отримання даних з серверу
const testArr = [];

function dataFromServer(){
    const request = fetch('https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks')   // запит на сервер проміс
    .then(response=>response.json())                                               // коли проміс виконано звертаємось до тексту у відповіді, це теж проміс по надходить пакетами
    .then(bodyAsText=>{
        // console.log(bodyAsText);
        taskArr.length=0;
        copyArr(taskArr, bodyAsText);
    })
    .then(()=>createTaskList())                         // коли пакети надійшли вивводимо в консоль текст, JSON.parse перетворює текс в об'єкт, з яким можна працювати в JS
    .catch((error)=>console.log(error))
    
}
 dataFromServer();


function copyArr(arrEmpty, arrData){
    for(let i=0; i<arrData.length; i++){
        arrEmpty.push(arrData[i]);
    }
}

function dbClick(e){
    const el = e.currentTarget;
    if(typeof el.clickCount === 'undefined'){
        el.clickCount = 0;
    }
    el.clickCount++;
    setTimeout(()=>el.clickCount = 0,300);
    if(el.clickCount === 2){
        editingMode(e);
        console.log('editingMode ON');
        el.clickCount = 0;
    }    
}

function editingMode(target){
    const wrapper = target.target.closest('.task').children[3],
    input = wrapper.children[0];
    let text = target.target.closest('.task').children[1].innerText;
    input.value=text;
    wrapper.style = 'display: block';
}

function editingDone(e){
    e.preventDefault();
    const input = e.target,
    wrapper = input.closest('.changeTask__wrapper'),
    task = input.closest('.task');

    currentTaskId = task.children[2].id;



    for(let i=0; i<taskArr.length; i++){
        if(taskArr[i].id===+currentTaskId){
            sendRequest('PUT', 'https://625a9a22398f3bc782a3d161.mockapi.io/x/tasks', {task: input.value},taskArr[i].identification)
            .then(()=>{
                wrapper.style = 'display: none';
                dataFromServer();
            });
        }
    }


    

}




