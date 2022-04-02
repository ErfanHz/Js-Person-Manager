(window.onload = function () {
    getAll();
    setID();
})
var modeForm = 'create';
var activeId = null;
function Send() {
    if (validateForm()) {
        if (modeForm == 'create') {
            let obj = {
                personName: namePer.value,
                personLevel: levelPer.value,
                personGender: genderPer.value,
                personId: returID()
            };
            storeItem(obj);
            setID(true);
            closeModal();
            clearForm();
            getAll();
        } else {
            let obj2 = {
                personName: namePer.value,
                personLevel: levelPer.value,
                personGender: genderPer.value,
            };
            editItem(obj2);
        }
    }
}
function getAll() {
    row.innerHTML = null;
    let persons = personsGet();
    persons.forEach(element => {
        row.innerHTML +=
            addCard(element.personName, element.personLevel, element.personGender, element.personId);
    });
}
function editItem(obj) {
    let persons = personsGet();
    let per = persons.findIndex(m => m.personId == activeId)
    if (per != null) {
        let perID = { personId: persons[per].personId };
        obj = Object.assign(obj, perID);
        persons[per] = obj;
        localStorage.setItem('persons', JSON.stringify(persons));
        getAll();
        closeModal();
    }
}
function personsGet() {
    let persons =
        JSON.parse(localStorage.getItem('persons'));
    persons = persons == null ? [] : persons;
    return persons;
}
function returID() {
    let currentId = localStorage.getItem('ID');
    return `${Number(currentId) + 1}`;
}
function setID(plusId = false) {
    let currentId = localStorage.getItem('ID');
    if (currentId == null) {
        localStorage.setItem('ID', '0');
        currentId = '0';
    }
    if (plusId == true) {
        localStorage.setItem('ID', Number(currentId) + 1);
    }
}
function validateForm() {
    if (namePer.value == '') {
        alert('نام انتخاب نشده است');
        return false;
    } else if (genderPer.value == '') {
        alert('جنسیت انتخاب نشده است');
        return false;
    } else if (levelPer.value == '') {
        alert('سطح انتخاب نشده است');
        return false;
    } else if (namePer.value.length >= 25) {
        alert(`نام باید 20 کاراکتر باشد : ${namePer.value.length}`);
        return false;
    }
    return true;
}
function storeItem(params) {
    let persons = personsGet();
    persons = persons.reverse();
    persons.push(params);
    persons = persons.reverse();
    localStorage.setItem('persons', JSON.stringify(persons));
}
function clearForm() {
    levelPer.value = '';
    namePer.value = '';
    genderPer.value = '';
    modeForm = 'create';
}
function clearStorage() {
    if (confirm('آیا از خالی کردن حافظه مطمئنید')) {
        localStorage.setItem('ID', '');
        localStorage.setItem('persons', '[]');
        location.reload();
    }
}
function removePerson(id) {
    if (confirm('آیا از حذف این کارمند مطمئنید')) {
        let persons = personsGet();
        let thisPerson = persons.findIndex(m => m.personId == id);
        if (thisPerson != null) {
            persons.splice(thisPerson, 1);
            localStorage.setItem('persons', JSON.stringify(persons));
            getAll();
        }
    }
}
function editPerson(value) {
    let person = personsGet().find(m => m.personId == value);
    if (person) {
        activeId = value;
        openModal('edit');
        levelPer.value = person.personLevel;
        namePer.value = person.personName;
        genderPer.value = person.personGender;
    }
}
function addCard(Name, Level, Gender, Id) {
    return `
    <div class="">
    <div class="card customCard m-2 w-18">
    <div class="d-flex justify-content-center m-2">
    <img src="images/${Gender == 1 ? 'men' : 'women'}_${randomImage()}.png" class="img-fluid customImage user-select-none" alt="">
    </div>
    <p class="text-center my-1">
    ${Name}
    </p>
    <p class="text-center my-1 text-muted">
     ${
        Level == '1' ? 'کارمند ارشد' :
            Level == '2' ? 'کارمند ناظر' :
                Level == '3' ? 'کارمند متوسط' :
                    Level == '4' ? 'کارمند ضعیف' :
                        'موجود نیست'
        }
    </p>
    <p class="text-center my-1">
    <button class="bg-transparent border-0 outline-none" value="${Id}" onclick="removePerson(value)">
    <i class="fa fa-trash text-danger fa-2x hover-pointer"></i>
    </button>
    <button class="bg-transparent border-0 outline-none" value="${Id}" onclick="editPerson(value)">    
    <i class="fa fa-edit text-warning fa-2x hover-pointer"></i>
    </button>
    </p>
    </div>
    </div>
    `;
}
function randomImage() {
    let arr = [1, 2, 3, 4];
    let item = arr[Math.floor(Math.random() * arr.length)];
    return item;
}
function openModal(mode) {
    clearForm();
    modeForm = mode;
    modal.style.display = "block";
}
function closeModal() {
    modalContent.style.transform = 'translateY(-100px)';
    modalContent.style.transition = 'all 0.3s';
    setTimeout(() => {
        modal.style.display = "none";
        modalContent.style.transform = 'translateY(0px)';
    }, 250);
}