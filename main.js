const valId=document.getElementById("valId");
const valUserName=document.getElementById("valUserName");
const valFile=document.getElementById("valFile");
const valSalary=document.getElementById("valSalary");
const valDes=document.getElementById("valDes");
const listGender=document.querySelectorAll("input[type='radio'][name='gender']");
const valMarried=document.getElementById("isMarried");
const select=document.getElementById("select");
const btn=document.getElementById("btn");
let users=[];
const previewImage=document.getElementById("preViewImage");
const tbody=document.querySelector("tbody");
let maId=null;
let avatars=null;
let listId=[];
let listCheckbox=document.getElementsByClassName("list-checkbox");


const checkAll=document.getElementById("all");
const btnDelete=document.getElementById("btndelete");




btn.addEventListener("click",handleSubmit);
valFile.addEventListener("change",renderImageForPreview);


function renderImageForPreview(){
    const file=URL.createObjectURL(valFile.files[0]);
    previewImage.setAttribute("src",file);
    previewImage.style.width="100px";
}
function handleSubmit(){
    const name=valUserName.value;
    let avatar=null;
    if(valFile.files[0]){
  avatar=URL.createObjectURL(valFile.files[0]);
    }

    const salary=valSalary.value;
    const des=valDes.value;
    let gender="";
    listGender.forEach((item)=>{
        if(item.checked){
            gender=item.value;
        }
    });
    const isMarried=valMarried.checked;
    const ducation=select.value;

    const formData={
        name,
        avatar,
        salary,
        des,
        gender,
        isMarried,
        ducation,
    }
    if(maId){
 users=users.map((currentValue)=>{
    if(currentValue.id=maId){
        return {
            ...formData,
            avatar: (formData.avatar ? formData.avatar : avatars) , 
            id: maId,
        }
    }else{
        return currentValue;
    }
 })
    }else{
        formData.id=Date.now();
        users=[...users,formData];
    }

    renderUser(users);
    resetForm();
    
}


function renderUser(arr= []){
    
  tbody.innerHTML = arr.map(item => {
        return `
            <tr>
                <td>
                    <input class='list-checkbox' type='checkbox' onchange="handleChangeCheckBox(this)" value=${item.id} />
                </td>
                <td>
                    ${item.id}
                </td>
                <td>
                    ${item.name}
                </td>
              
                <td>
                    <img width='100px' src=${item.avatar} />
                </td>
                <td>
                    ${item.des}
                </td>
                <td>
                    ${item.salary}
                </td>
                 <td>
                    ${item.gender}
                </td>
                <td>
                    ${item.isMarried ? "Đã kết hôn" : "Độc Thân"}
                </td>
                <td>
                    ${item.ducation}
                </td>
                <td>
                    <button onclick='handleRemoveUser(${item.id})'>Xóa</button>
                    <button onclick='handleDetailUser(${item.id})'>Sửa</button>
                </td>
            </tr>
        `
    }).join("");

     for(let i=0;i<listCheckbox.length;i++){
        let element=listCheckbox[i];
        if(listId.includes(element.value.toString())){
            element.checked=true;
        }
    }
    if(listId.length===0){
btnDelete.style.display="none";
    }else{
        btnDelete.innerText=`Xóa ${listId.length}`;
    }
    if(listId.length===users.length){
        btnDelete.innerText=`Xóa tất cả`;
        checkAll.checked=true;
    }else{
         btnDelete.innerText=`Xóa ${listId.length}`;
         checkAll.checked=false;
    }
   
}

const resetForm = () => {
    valId.value = "";
    valUserName.value = "";
    valSalary.value = "";
    valDes.value = "";
    select.value = "";
    valFile.value="";
    previewImage.setAttribute("src", "");
    valMarried.checked = false;
    listGender.forEach(item => {
        item.checked = false;
    })

}
function handleRemoveUser(id){
    listId=listId.filter((currentValue)=>{
        return currentValue!==id.toString();
    })
    users=users.filter((curentValue)=>{
        return curentValue.id!==id;
    });
    renderUser(users);
}

function handleDetailUser(id){
    const user=users.find(currentValue=>{
        return currentValue.id===id;
    });
    if(user){
    valId.value =user.id;
    valUserName.value = user.name;
    valSalary.value = user.salary;
    valDes.value= user.des;
    select.value = user.ducation;
    
    previewImage.setAttribute("src",user.avatar);
    valMarried.checked = user.isMarried;
    listGender.forEach(item => {
if(item.value===user.gender){
    item.checked=true;
}
    });
    avatars=user.avatar;
    maId=user.id;
    }
    btn.innerText="Sửa";
}
function handleChangeCheckBox(e){
const {checked,value}=e;
if(checked){
    listId=[...listId,value];
}else{
    listId=listId.filter((item)=>{
       return item!==(value+"");
    }); //neu checkbox false onchange kich hoat thi ta se loc listId sao cho neu phan tu listId bằng value id dang kich thì mình không đưa vào lại listId tức loại bỏ phần tử đã click thành false
}
if(listId.length===users.length){
 checkAll.checked=true;
}else{
    checkAll.checked=false;
}
if(listId.length>0){
btnDelete.style.display="block";
if(listId.length===users.length){
btnDelete.innerText=`Xóa tất cả`;

}else{
    btnDelete.innerText=`Xóa ${listId.length}`;
}
}else{
    btnDelete.style.display="none";
}

console.log(listId);
console.log(value);
}
btnDelete.addEventListener("click",deleteFromCheckbox);// khong truyen tham so bang kieu do duoc trực tiếp được nếu muốn thì bọc qua function hoặc arrow function rồi gọi tới hàm truyền đối số


function deleteFromCheckbox(){
 users=users.filter((currentValue)=>{
    return !listId.includes((currentValue.id.toString()));
 });
 listId=[];
 btnDelete.style.display="none"; // Sau khi xoá xong nhờ vào lọc của danh sách id cần xóa, ta phải thực hiện bước reset lại mảng id cần xóa thành mảng rỗng trống và sau đó ẩn đi nút xóa, mục đích reset lại mảng listId vì đã lọc trong users ra xong rồi tức đã xóa thành công rồi nên phải làm mới lại
 renderUser(users);
}

checkAll.onchange=(e)=>{
    const isCheckBoxAll=e.target.checked;
    console.log(listCheckbox);
if(isCheckBoxAll){
     for(let i=0;i<listCheckbox.length;i++){
        listCheckbox[i].checked=true;
    }
    listId=users.map((item)=>(item.id+""));
    btnDelete.style.display="block";
    btnDelete.innerText=`Xóa tất cả`;
    
}else{
     for(let i=0;i<listCheckbox.length;i++){
        listCheckbox[i].checked=false;
    }
    listId=[];
    btnDelete.style.display="none";
}
}