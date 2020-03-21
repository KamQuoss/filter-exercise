// filtrowanie w Tablicy

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
    titleFilterVal,
    completedFilterVal,
    // tu są możliwe wartości,które moze nasz klient wrzucić
    userIdVal = new Set(),
    minIdVal,
    maxIdVal,
    // a to jest przefiltrowana lista, do wyświetlenia po kliku w button
    filteredList;

const getParam = () => {
    //userIdfilterVal = document.querySelector('input#user-filter').value;
    idFromFilterVal = document.querySelector('input#id-from-filter').value;
    idToFilterVal = document.querySelector('input#id-to-filter').value;
    titleFilterVal = document.querySelector('input#title-filter').value;
    completedFilterVal = document.querySelector('input#completed').checked;
    //console.log(userIdfilter + '---' + idFromFilter + '---' + idToFilter + '---' + titleFilter + '---' + completedFilter)
}


// tu pobierane są dane przy załadowaniu strony
fetch(fetchURL)
    .then(response => response.json())
    .then(json => {
        taskList = json; // pobrane dane to task
        // tutaj będę pobierać wartości w jakich mogę się poruszać
        for (task in taskList) {
            userIdVal.add(taskList[task].userId)
        }
        minIdVal = taskList[0].id;
        maxIdVal = taskList[taskList.length - 1].id;
        console.log(maxIdVal);

        // tu robię live filter na inputach, gdy zmienia się coś w inpucie to działa ta funkcja
        userIdfilter.addEventListener('input', event => {
            let val = parseInt(event.target.value);
            if (!userIdVal.has(val)) {
                console.log("zła wartość" + val);
                userIdfilterVal = '';
            } else {
                userIdfilterVal = val;
            }
        });
        idFromFilter.addEventListener('input', event => {
            let val = parseInt(event.target.value);
            if (val >= minIdVal && val < maxIdVal) {
                idFromFilterVal = val;
            } else {
                console.log(`Zła wartość minimalna`);
            }
        });
        idToFilter.addEventListener('input', event => {
            let val = parseInt(event.target.value);
            if (val > minIdVal && val <= maxIdVal) {
                idToFilterVal = val;
            } else {
                console.log(`Zła wartość maksymalna`);
            }
        });



        // ta funkcja będzie wypisywać i filtrować na żądanie klienta
        const filter = () => {
            // tu pobierałam value, ale teraz będę brać value przy okazji live sprawdzania
            // getParam(); 
            filteredList = taskList
                .filter(task => {
                    if (!userIdfilterVal) return true; // jeśli nie wpiszę nic to przechodzą wszystkie przez filtr
                    else
                        return task.userId == userIdfilterVal
                })
                .filter(task => {
                    if (!idFromFilterVal || !idToFilterVal) return true;
                    else
                    return (task.id >= idFromFilterVal && task.id <= idToFilterVal)
                })
                .filter(task => {
                    if (!titleFilter.value) return true;
                    else 
                    return task.title.includes(titleFilter.value)
                })
            // .filter(task => {
            //     return task.completed == true
            // })
            console.log(taskList)
            console.log(titleFilter.value)
            console.log('lista po filtrze', filteredList)
        }
        button.addEventListener('click', filter)
    })