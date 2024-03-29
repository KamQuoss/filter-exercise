# Filter exercise

This is solution of taks assignment during fullstack course at C_school. 

## Overview

### Task details
- get data from web API ([todos](https://jsonplaceholder.typicode.com/todos))
- display data on web page
- build a form to filter data

### Screenshot

![](screenshot.png)

### Links

- Live Site URL: [here](https://kamquoss.github.io/filter-exercise/)

## My process

### Built with

- Material Design (Materialize)
- vanilla js

### What I learned

:construction_worker:
[stage one](https://github.com/KamQuoss/filter-exercise/commit/4e0cf5e5cb9a38d5d1e68323265f91cad3891665)

At first stage I've build simple fetch function and pure HTML form to manipulate visibility of data. At this point my knowledge about frontend was narrow, and my approach was to learn with small steps. After few months of commercial development I've decided to expand this little project. 

:construction_worker: stage two
- types of inputs and input events
- using Objects to save component state
```js
let filterSettings = {
        title: '',
        users: getUsersId(taskList),
        completed: false,
        id: {
            min: idLimits.min,
            max: idLimits.max,
        }
    };
```
- using Set()
- reading documentation (https://materializecss.com/)
- finding solutions at StackOverflow

### Proud of
Finding solution for stackoverflow question and publishing it.
[here](https://stackoverflow.com/questions/50051540/materialize-dropdown-options/68602124#68602124) is my answer. 

## Author

- LinkedIn - [Kamila Kłosek](https://www.linkedin.com/in/kamila-k%C5%82osek-b16b08a7/)