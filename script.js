// TO DO:
// choose user dropdown should be generated after data are downloaded
// filter users
// catch error

let url = 'https://jsonplaceholder.typicode.com/todos',
    // HTML elements    
    resultContainer = document.querySelector('#results'),
    titleInput = document.querySelector('#task-title'),
    dropdown = document.querySelector('.user select'),
    checkbox = document.querySelector('input[type="checkbox"]'),
    range = document.getElementById('test-slider'),

    userColors = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green'];

const getUsersId = (list) => {
    let users = new Set()
    for (item of list) {
        users.add(item.userId.toString())
    }
    return [...users]
};

const getIdLimits = (list) => {
    return limits = {
        min: list[0].id,
        max: list[list.length - 1].id,
    }
};

// fetch data
fetch(url)
    .then(response => response.json())
    .then(json => {
        let taskList = json;

        let
            idLimits = getIdLimits(taskList),

            filterSettings = {
                title: '',
                users: getUsersId(taskList),
                completed: false,
                id: {
                    min: idLimits.min,
                    max: idLimits.max,
                }
            };

        const showCards = () => {
            let filtered = taskList
                .filter(task => {
                    return (
                        task.id >= filterSettings.id.min &&
                        task.id <= filterSettings.id.max &&
                        task.title.includes(filterSettings.title) &&
                        task.completed == filterSettings.completed &&
                        filterSettings.users.includes(`${task.userId}`)
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
                                    <span>completed: <i class="card-title-icon material-icons">${task.completed ? 'done' : 'clear'}</i></span>
                                    </span>
                                    <span class="card-title"><b>${task.id}.</b> ${task.title}</span>
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
        var instance = M.FormSelect.init(dropdown,
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
            filterSettings.users = instance.getSelectedValues();
            showCards(taskList, filterSettings);
        });
        checkbox.addEventListener('change', (e) => {
            filterSettings.completed = e.target.checked;
            showCards(taskList, filterSettings);
        });
        range.noUiSlider.on("update", (values) => {
            filterSettings.id.min = values[0];
            filterSettings.id.max = values[1];
            showCards(taskList, filterSettings);
        });

        // initial sho cards
        showCards(taskList, filterSettings);
    })
    .catch(reason => console.log(reason))
