const filteredListCont = document.querySelector('#list-container'),
    fetchURL = 'https://jsonplaceholder.typicode.com/todos',
    button = document.getElementById('getInfo');

let taskList,
    // tu definiuję inputy
    userIdfilter = document.querySelector('input#user-filter'),
    idFromFilter = document.querySelector('input#id-from-filter'),
    idToFilter = document.querySelector('input#id-to-filter'),
    titleFilter = document.querySelector('input#title-filter'),
    completedFilter = document.querySelector('input#completed'),
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
    infoUserId = document.getElementById('user-error'),
    infoIdFrom = document.getElementById('id-from-error'),
    infoIdTo = document.getElementById('id-to-error'),
    // a to jest przefiltrowana lista, do wyświetlenia po kliku w button
    filteredList;

// tu pobierane są dane przy załadowaniu strony
fetch(fetchURL)
    .then(response => response.json())
    .then(json => {
        taskList = json; // pobrane dane to task
        // tutaj będę pobierać wartości w jakich mogę się poruszać
        for (task in taskList) {
            userIdVal.add(taskList[task].userId)
        }
        userIdValTab = [...userIdVal];
        minIdVal = taskList[0].id;
        maxIdVal = taskList[taskList.length - 1].id;

        // tu robię live filter na inputach, gdy zmienia się coś w inpucie to działa ta funkcja
        userIdfilter.addEventListener('input', event => {
            let val = parseInt(event.target.value);
            if (!userIdVal.has(val)) {
                infoUserId.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${userIdValTab[0]}-${userIdValTab[userIdValTab.length-1]}`;
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
                infoIdFrom.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${minIdVal}-${maxIdVal-1}`;
            }
        });
        idToFilter.addEventListener('input', event => {
            let val = parseInt(event.target.value);
            if (val > minIdVal && val <= maxIdVal) {
                infoIdTo.innerHTML = ``;
                idToFilterVal = val;
            } else {
                infoIdTo.innerHTML = `Nieprawidłowa wartość, podaj liczbę z zakresu ${minIdVal+1}-${maxIdVal}`;
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
                if(filteredList.length==0){
                    filteredListCont.innerHTML = "Nie znalazłem wyników spełniającyh Twoje kryteria";
                }
                else{
                    filteredListCont.innerHTML = "";
                    for (task of filteredList) {
                        let line = document.createElement("p");
                        line.innerHTML = `User id: <b>${task.userId}</b>, id: <b>${task.id}</b>, title: <b>${task.title}</b>, checked: <b>${task.completed}</b>`;
                        filteredListCont.appendChild(line)
                    }
                }
            

        }
        button.addEventListener('click', filter)
    })