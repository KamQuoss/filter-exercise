let url = 'https://jsonplaceholder.typicode.com/todos',
    // HTML elements    
    resultContainer = document.querySelector('#results'),
    titleInput = document.querySelector('#task-title'),
    dropdown = document.querySelector('.user select'),
    checkboxes = document.querySelectorAll('input[type="checkbox"]'),
    range = document.getElementById('test-slider'),

    usersId,
    idLimits,

    taskList,
    // tu definiuję inputy
    userIdfilter = document.querySelector('input#user-filter'),// out
    idFromFilter = document.querySelector('input#id-from-filter'),// out
    idToFilter = document.querySelector('input#id-to-filter'),// out
    titleFilter = document.querySelector('input#title-filter'),// out
    completedFilter = document.querySelector('input#completed'),// out
    // tu są wartości inpuntów
    userIdfilterVal,
    idFromFilterVal,
    idToFilterVal,
    // tu są możliwe wartości, które może nasz klient wrzucić
    userIdVal = new Set(),
    userIdValTab,
    minIdVal,
    maxIdVal,
    //tu miejsce na info o poprawności inputów
    infoUserId = document.getElementById('user-error'),// out
    infoIdFrom = document.getElementById('id-from-error'),// out
    infoIdTo = document.getElementById('id-to-error'),// out
    // a to jest przefiltrowana lista, do wyświetlenia po kliku w button
    filteredList,
    userColors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green'];

const getUsersId = (list) => {
    let users = new Set()
    for (item of list) {
        users.add(item.userId)
    }
    return [...users]
}

const getIdLimits = (list) => {
    return limits = {
        min: list[0].id,
        max: list[list.length - 1].id,
    }
}

// TO DO:
// choose user dropdown should be generated after data are downloaded
// catch error

// fetch data
fetch(url)
    .then(response => response.json())
    .then(json => {
        taskList = json;

        usersId = getUsersId(taskList);
        idLimits = getIdLimits(taskList);



        // create range
        noUiSlider.create(range, {
            start: [idLimits.min, idLimits.max],
            connect: true,
            step: 1,
            orientation: 'horizontal', // 'horizontal' or 'vertical'
            range: {
                'min': idLimits.min,
                'max': idLimits.max
            },
            format: wNumb({
                decimals: 0
            })
        });

        // initialize select
        var instances = M.FormSelect.init(dropdown,
            {
                dropdownOptions: {
                    coverTrigger: false,
                    hover: true
                }
            });



        // add listeners 
        titleInput.addEventListener('input', (e) => console.log(e.target.value) );   
        dropdown.addEventListener('change', () => { console.log(instances.getSelectedValues()) });
        for (checkbox of checkboxes) {
            checkbox.addEventListener('change', (e) => console.log(e.target.value, e.target.checked))
        }
        range.noUiSlider.on("update", (values) => console.log(values));

        for (task in taskList) {
            userIdVal.add(taskList[task].userId)
        }
        userIdValTab = [...userIdVal];
        minIdVal = taskList[0].id;
        maxIdVal = taskList[taskList.length - 1].id;
        filter();
    })
    .catch(reason => console.log(reason))



// tu robię live filter na inputach, gdy zmienia się coś w inpucie to działa ta funkcja
userIdfilter.addEventListener('input', event => {
    let val = parseInt(event.target.value);
    if (!userIdVal.has(val)) {
        infoUserId.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${userIdValTab[0]}-${userIdValTab[userIdValTab.length - 1]}`;
        userIdfilterVal = '';
    } else {
        userIdfilterVal = val;
        infoUserId.innerHTML = `ok`;
    }
});
idFromFilter.addEventListener('input', event => {
    let val = parseInt(event.target.value);
    if (val >= minIdVal && val < maxIdVal) {
        infoIdFrom.innerHTML = `ok`;
        idFromFilterVal = val;
    } else {
        infoIdFrom.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${minIdVal}-${maxIdVal - 1}`;
    }
});
idToFilter.addEventListener('input', event => {
    let val = parseInt(event.target.value);
    if (val > minIdVal && val <= maxIdVal) {
        infoIdTo.innerHTML = ``;
        idToFilterVal = val;
    } else {
        infoIdTo.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${minIdVal + 1}-${maxIdVal}`;
    }
});

// ta funkcja będzie wypisywać i filtrować na żądanie klienta

const filter = () => {
    filteredList = taskList
        .filter(task => {
            if (!userIdfilterVal) return true; // jeśli nie wpiszę nic to przechodzą wszystkie przez filtr
            else
                return task.userId == userIdfilterVal
        })
        .filter(task => {
            if (!idFromFilterVal) return true;
            else
                return (task.id >= idFromFilterVal)
        })
        .filter(task => {
            if (!idToFilterVal) return true;
            else
                return (task.id <= idToFilterVal)
        })
        .filter(task => {
            if (!titleFilter.value) return true;
            else
                return task.title.includes(titleFilter.value)
        })
        .filter(task => {
            return task.completed == completedFilter.checked
        });
    if (filteredList.length == 0) {
        resultContainer.innerHTML = "Nothing to show";
    }
    else {
        resultContainer.innerHTML = "";
        for (task of filteredList) {
            let card = document.createElement('div');
            card.classList.add('col', 's12', 'm4', 'l3');
            card.innerHTML =
                `
                <div class="card ${userColors[task.userId - 1]} ${task.completed ? 'lighten-1' : 'darken-1'}">
                    <div class="card-content ${task.completed ? 'black-text' : 'white-text'}">
                        <span class="card-title info">
                        <span><i class="card-title-icon material-icons">account_circle</i> User ${task.userId}</span>                        
                        <span>done: <i class="card-title-icon material-icons">${task.completed ? 'done' : 'clear'}</i></span>
                        </span>
                        <span class="card-title"><span><i class="card-title-icon material-icons">edit</i> ${task.id}</span> ${task.title}</span>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam provident, commodi eaque voluptatem
                        omnis eligendi magnam ut saepe autem illum ipsam explicabo quis corporis quod et labore, doloribus
                        reiciendis quo.</p>
                    </div>
                </div>
                `;
            resultContainer.append(card)
        }
    }
}