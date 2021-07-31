// TO DO:
// choose user dropdown should be generated after data are downloaded
// filter completed and users
// catch error

let url = 'https://jsonplaceholder.typicode.com/todos',
    // HTML elements    
    resultContainer = document.querySelector('#results'),
    titleInput = document.querySelector('#task-title'),
    dropdown = document.querySelector('.user select'),
    checkboxes = document.querySelectorAll('input[type="checkbox"]'),
    range = document.getElementById('test-slider'),

    taskList,
    userColors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green'];

const getUsersId = (list) => {
    let users = new Set()
    for (item of list) {
        users.add(item.userId)
    }
    return [...users]
};

const getIdLimits = (list) => {
    return limits = {
        min: list[0].id,
        max: list[list.length - 1].id,
    }
};

const showCards = (list, settings) => {
    let filtered = list
        .filter((task) => {
            return (
                task.id >= settings.id.min &&
                task.id <= settings.id.max &&
                task.title.includes(settings.title)                
                // task.completed == settings.completed.yes
            )
        });

    if (filtered.length == 0) {
        resultContainer.innerHTML = "Nothing to show";
    }
    else {
        resultContainer.innerHTML = "";
        for (task of filtered) {
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
};



// fetch data
fetch(url)
    .then(response => response.json())
    .then(json => {
        taskList = json;

        let
            idLimits = getIdLimits(taskList),

            filterSettings = {
                title: '',
                users: getUsersId(taskList),
                completed: {
                    yes: true,
                    no: true,
                },
                id: {
                    min: idLimits.min,
                    max: idLimits.max,
                }
            };

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
        titleInput.addEventListener('input', (e) => {
            filterSettings.title = e.target.value;
            showCards(taskList, filterSettings);
        });
        dropdown.addEventListener('change', () => {
            filterSettings.users = instances.getSelectedValues();
            showCards(taskList, filterSettings);
        });
        for (checkbox of checkboxes) {
            checkbox.addEventListener('change', (e) => {
                filterSettings[e.target.value] = e.target.checked;
                showCards(taskList, filterSettings);
            })
        }
        range.noUiSlider.on("update", (values) => {
            filterSettings.id.min = values[0];
            filterSettings.id.max = values[1];
            showCards(taskList, filterSettings);
        });

        // new filter
        showCards(taskList, filterSettings);
    })
    .catch(reason => console.log(reason))
