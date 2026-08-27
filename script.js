/* =========================================================
   MY ASSIGNMENT CALENDAR
   Complete JavaScript
========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "myAssignmentCalendar_v2";


/* =========================================================
   DEFAULT CATEGORIES
========================================================= */

const DEFAULT_CATEGORIES = [
    {
        id: "category-school",
        name: "School",
        color: "#007aff"
    },
    {
        id: "category-exam",
        name: "Exam",
        color: "#ff3b30"
    },
    {
        id: "category-project",
        name: "Project",
        color: "#af52de"
    },
    {
        id: "category-personal",
        name: "Personal",
        color: "#34c759"
    }
];


/* =========================================================
   APPLICATION STATE
========================================================= */

let state = {
    assignments: [],
    todos: [],
    categories: [...DEFAULT_CATEGORIES]
};


/* =========================================================
   CURRENT MONTH
========================================================= */

let currentMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
);


/* =========================================================
   EDITING STATE
========================================================= */

let editingAssignmentId = null;


/* =========================================================
   SELECTED DATE
========================================================= */

let selectedDate = null;


/* =========================================================
   START APPLICATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadState();

    setupEventListeners();

    renderAll();

});


/* =========================================================
   LOAD STATE
========================================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return;
        }

        const parsed =
            JSON.parse(saved);

        if (!parsed || typeof parsed !== "object") {
            return;
        }


        /*
           IMPORTANT:
           Only replace each part of the state if
           the saved data actually contains a valid
           array.

           This prevents an incomplete/corrupt save
           from destroying everything.
        */

        if (Array.isArray(parsed.assignments)) {

            state.assignments =
                parsed.assignments.map(normalizeAssignment);

        }


        if (Array.isArray(parsed.todos)) {

            state.todos =
                parsed.todos.map(normalizeTodo);

        }


        if (
            Array.isArray(parsed.categories) &&
            parsed.categories.length > 0
        ) {

            state.categories =
                parsed.categories.map(normalizeCategory);

        }

    } catch (error) {

        console.error(
            "Could not load saved calendar data:",
            error
        );

    }

}


/* =========================================================
   NORMALIZE ASSIGNMENT
========================================================= */

function normalizeAssignment(item) {

    return {

        id:
            item.id ||
            createId("assignment"),

        title:
            String(item.title || ""),

        date:
            isValidDateString(item.date)
                ? item.date
                : formatDate(new Date()),

        categoryId:
            item.categoryId ||
            state.categories[0]?.id ||
            DEFAULT_CATEGORIES[0].id,

        notes:
            String(item.notes || ""),

        showInTodo:
            item.showInTodo !== false,

        completed:
            Boolean(item.completed),

        createdAt:
            item.createdAt ||
            new Date().toISOString()

    };

}


/* =========================================================
   NORMALIZE TODO
========================================================= */

function normalizeTodo(item) {

    return {

        id:
            item.id ||
            createId("todo"),

        title:
            String(item.title || ""),

        completed:
            Boolean(item.completed),

        createdAt:
            item.createdAt ||
            new Date().toISOString()

    };

}


/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeCategory(category) {

    return {

        id:
            category.id ||
            createId("category"),

        name:
            String(category.name || "Category"),

        color:
            category.color || "#007aff"

    };

}


/* =========================================================
   VALID DATE
========================================================= */

function isValidDateString(value) {

    if (typeof value !== "string") {
        return false;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(value);

}


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.error(
            "Could not save calendar data:",
            error
        );

    }

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /* MONTH */

    document
        .getElementById("previousMonth")
        .addEventListener("click", () => {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() - 1,
                    1
                );

            renderCalendar();

        });


    document
        .getElementById("nextMonth")
        .addEventListener("click", () => {

            currentMonth =
                new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth() + 1,
                    1
                );

            renderCalendar();

        });


    document
        .getElementById("todayButton")
        .addEventListener(
            "click",
            goToToday
        );


    /* ADD CALENDAR ITEM */

    document
        .getElementById("addCalendarItem")
        .addEventListener("click", () => {

            openAssignmentModal();

        });


    /* ASSIGNMENT TODO */

    document
        .getElementById("addTodo")
        .addEventListener(
            "click",
            addAssignmentFromTodo
        );


    document
        .getElementById("todoInput")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    addAssignmentFromTodo();

                }

            }
        );


    /* GENERAL TODO */

    document
        .getElementById("addGeneralTodo")
        .addEventListener(
            "click",
            addGeneralTodo
        );


    document
        .getElementById("generalTodoInput")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    addGeneralTodo();

                }

            }
        );


    /* CATEGORY FILTER */

    document
        .getElementById("categoryFilter")
        .addEventListener(
            "change",
            renderCalendar
        );


    /* ASSIGNMENT MODAL */

    document
        .getElementById("closeAssignmentModal")
        .addEventListener(
            "click",
            closeAssignmentModal
        );


    document
        .getElementById("cancelAssignmentModal")
        .addEventListener(
            "click",
            closeAssignmentModal
        );


    document
        .getElementById("saveAssignmentButton")
        .addEventListener(
            "click",
            saveAssignment
        );


    document
        .getElementById("deleteAssignmentButton")
        .addEventListener(
            "click",
            deleteCurrentAssignment
        );


    /* CATEGORY MODAL */

    document
        .getElementById("categorySettingsButton")
        .addEventListener(
            "click",
            openCategoryModal
        );


    document
        .getElementById("closeCategoryModal")
        .addEventListener(
            "click",
            closeCategoryModal
        );


    document
        .getElementById("doneCategorySettings")
        .addEventListener(
            "click",
            closeCategoryModal
        );


    document
        .getElementById("addCategory")
        .addEventListener(
            "click",
            addCategory
        );


    document
        .getElementById("newCategoryName")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {

                    event.preventDefault();

                    addCategory();

                }

            }
        );


    /* SEARCH */

    document
        .getElementById("searchButton")
        .addEventListener(
            "click",
            openSearchModal
        );


    document
        .getElementById("closeSearchModal")
        .addEventListener(
            "click",
            closeSearchModal
        );


    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            performSearch
        );


    /* BACKUP */

    document
        .getElementById("exportButton")
        .addEventListener(
            "click",
            exportBackup
        );


    /* RESTORE */

    document
        .getElementById("importButton")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("importFile")
                    .click();

            }
        );


    document
        .getElementById("importFile")
        .addEventListener(
            "change",
            importBackup
        );


    /* MODAL BACKGROUND */

    document
        .querySelectorAll(".modal-overlay")
        .forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target === overlay
                    ) {

                        overlay.classList.add(
                            "hidden"
                        );

                    }

                }
            );

        });


    /* ESCAPE */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(".modal-overlay")
                .forEach(modal => {

                    modal.classList.add(
                        "hidden"
                    );

                });

        }
    );

}


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    renderCategorySelects();

    renderCategoryFilter();

    renderCalendar();

    renderTodoLists();

    renderWeekSummary();

    renderCategoryList();

}


/* =========================================================
   RENDER CALENDAR
========================================================= */

function renderCalendar() {

    const calendar =
        document.getElementById("calendar");

    const monthName =
        document.getElementById("monthName");


    if (!calendar || !monthName) {
        return;
    }


    calendar.innerHTML = "";


    /* MONTH TITLE */

    monthName.textContent =
        currentMonth.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    /* YEAR / MONTH */

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    /*
       IMPORTANT:
       This is the actual weekday of
       the first day of the month.

       Sunday = 0
       Monday = 1
       ...
       Saturday = 6
    */

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    /*
       Number of days in current month.
    */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* FILTER */

    const filter =
        document.getElementById(
            "categoryFilter"
        ).value;


    /* EMPTY CELLS BEFORE DAY 1 */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-day";

        calendar.appendChild(empty);

    }


    /* CREATE EVERY DAY */

    for (
        let dayNumber = 1;
        dayNumber <= daysInMonth;
        dayNumber++
    ) {

        const date =
            new Date(
                year,
                month,
                dayNumber
            );


        const dateString =
            formatDate(date);


        const day =
            document.createElement("div");

        day.className = "day";

        day.dataset.date =
            dateString;


        /* TODAY */

        if (
            dateString ===
            formatDate(new Date())
        ) {

            day.classList.add("today");

        }


        /* SELECTED */

        if (
            selectedDate ===
            dateString
        ) {

            day.classList.add("selected");

        }


        /* NUMBER */

        const number =
            document.createElement("div");

        number.className =
            "day-number";

        number.textContent =
            dayNumber;

        day.appendChild(number);


        /* CLICK DAY */

        day.addEventListener(
            "click",
            () => {

                selectedDate =
                    dateString;

                renderCalendar();

                openAssignmentModal(
                    null,
                    dateString
                );

            }
        );


        /* ASSIGNMENTS */

        const dayAssignments =
            state.assignments.filter(
                item => {

                    if (
                        item.date !==
                        dateString
                    ) {

                        return false;

                    }


                    if (
                        filter === "all"
                    ) {

                        return true;

                    }


                    return (
                        item.categoryId ===
                        filter
                    );

                }
            );


        /* SORT */

        dayAssignments.sort(
            (a, b) => {

                return (
                    Number(a.completed) -
                    Number(b.completed)
                );

            }
        );


        /* DISPLAY ASSIGNMENTS */

        dayAssignments.forEach(
            item => {

                const assignment =
                    createCalendarAssignment(
                        item
                    );

                day.appendChild(
                    assignment
                );

            }
        );


        calendar.appendChild(day);

    }


    /* COMPLETE LAST ROW */

    const totalCells =
        firstDay +
        daysInMonth;


    const remainder =
        totalCells % 7;


    if (remainder !== 0) {

        const emptyCount =
            7 - remainder;


        for (
            let i = 0;
            i < emptyCount;
            i++
        ) {

            const empty =
                document.createElement("div");

            empty.className =
                "empty-day";

            calendar.appendChild(
                empty
            );

        }

    }

}


/* =========================================================
   CREATE CALENDAR ASSIGNMENT
========================================================= */

function createCalendarAssignment(item) {

    const element =
        document.createElement("div");


    element.className =
        "assignment";


    if (item.completed) {

        element.classList.add(
            "completed"
        );

    }


    if (!item.showInTodo) {

        element.classList.add(
            "calendar-only"
        );

    }


    const category =
        getCategory(
            item.categoryId
        );


    if (category) {

        element.style.background =
            category.color;

    } else {

        element.style.background =
            "#8e8e93";

    }


    element.textContent =
        item.title;


    element.title =
        item.title;


    element.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openAssignmentModal(
                item.id
            );

        }
    );


    return element;

}


/* =========================================================
   OPEN ASSIGNMENT MODAL
========================================================= */

function openAssignmentModal(
    id = null,
    date = null
) {

    editingAssignmentId =
        id;


    const modal =
        document.getElementById(
            "assignmentModal"
        );


    const titleInput =
        document.getElementById(
            "assignmentTitle"
        );


    const dateInput =
        document.getElementById(
            "assignmentDate"
        );


    const categoryInput =
        document.getElementById(
            "assignmentCategory"
        );


    const notesInput =
        document.getElementById(
            "assignmentNotes"
        );


    const todoCheckbox =
        document.getElementById(
            "showInTodo"
        );


    const modalTitle =
        document.getElementById(
            "assignmentModalTitle"
        );


    const deleteButton =
        document.getElementById(
            "deleteAssignmentButton"
        );


    /* EDIT */

    if (id) {

        const item =
            state.assignments.find(
                assignment =>
                    assignment.id === id
            );


        if (!item) {
            return;
        }


        modalTitle.textContent =
            "Edit Calendar Item";


        titleInput.value =
            item.title || "";


        dateInput.value =
            item.date || "";


        categoryInput.value =
            item.categoryId ||
            state.categories[0]?.id ||
            "";


        notesInput.value =
            item.notes || "";


        todoCheckbox.checked =
            item.showInTodo !== false;


        deleteButton.style.display =
            "inline-block";

    }


    /* NEW */

    else {

        modalTitle.textContent =
            "Add Calendar Item";


        titleInput.value = "";


        dateInput.value =
            date ||
            selectedDate ||
            formatDate(new Date());


        categoryInput.value =
            state.categories[0]?.id ||
            "";


        notesInput.value = "";


        todoCheckbox.checked =
            true;


        deleteButton.style.display =
            "none";

    }


    modal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            titleInput.focus();

        },
        50
    );

}


/* =========================================================
   CLOSE ASSIGNMENT MODAL
========================================================= */

function closeAssignmentModal() {

    document
        .getElementById(
            "assignmentModal"
        )
        .classList.add(
            "hidden"
        );


    editingAssignmentId =
        null;

}


/* =========================================================
   SAVE ASSIGNMENT
========================================================= */

function saveAssignment() {

    const title =
        document
            .getElementById(
                "assignmentTitle"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "assignmentDate"
            )
            .value;


    const categoryId =
        document
            .getElementById(
                "assignmentCategory"
            )
            .value;


    const notes =
        document
            .getElementById(
                "assignmentNotes"
            )
            .value
            .trim();


    const showInTodo =
        document
            .getElementById(
                "showInTodo"
            )
            .checked;


    if (!title) {

        alert(
            "Please enter a title."
        );

        return;

    }


    if (!date) {

        alert(
            "Please choose a date."
        );

        return;

    }


    /* EDIT */

    if (editingAssignmentId) {

        const item =
            state.assignments.find(
                assignment =>
                    assignment.id ===
                    editingAssignmentId
            );


        if (!item) {
            return;
        }


        item.title =
            title;

        item.date =
            date;

        item.categoryId =
            categoryId;

        item.notes =
            notes;

        item.showInTodo =
            showInTodo;

    }


    /* CREATE */

    else {

        state.assignments.push({

            id:
                createId(
                    "assignment"
                ),

            title,

            date,

            categoryId,

            notes,

            showInTodo,

            completed: false,

            createdAt:
                new Date().toISOString()

        });

    }


    saveState();

    closeAssignmentModal();

    renderAll();

}


/* =========================================================
   DELETE CURRENT ASSIGNMENT
========================================================= */

function deleteCurrentAssignment() {

    if (!editingAssignmentId) {
        return;
    }


    const item =
        state.assignments.find(
            assignment =>
                assignment.id ===
                editingAssignmentId
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${item.title}"?`
        );


    if (!confirmed) {
        return;
    }


    state.assignments =
        state.assignments.filter(
            assignment =>
                assignment.id !==
                editingAssignmentId
        );


    saveState();

    closeAssignmentModal();

    renderAll();

}


/* =========================================================
   ADD ASSIGNMENT FROM TODO
========================================================= */

function addAssignmentFromTodo() {

    const input =
        document.getElementById(
            "todoInput"
        );


    const title =
        input.value.trim();


    if (!title) {
        return;
    }


    const categoryId =
        document.getElementById(
            "categorySelect"
        ).value;


    state.assignments.push({

        id:
            createId(
                "assignment"
            ),

        title,

        date:
            formatDate(
                new Date()
            ),

        categoryId,

        notes: "",

        showInTodo: true,

        completed: false,

        createdAt:
            new Date().toISOString()

    });


    input.value = "";


    saveState();

    renderAll();

}


/* =========================================================
   ASSIGNMENT TODO LIST
========================================================= */

function renderAssignmentTodoList() {

    const container =
        document.getElementById(
            "todoItems"
        );


    container.innerHTML = "";


    const visible =
        state.assignments.filter(
            item =>
                item.showInTodo !== false
        );


    if (!visible.length) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "empty-message";

        message.textContent =
            "No assignments yet.";

        container.appendChild(
            message
        );

        return;

    }


    visible.sort(
        (a, b) => {

            if (
                a.completed !==
                b.completed
            ) {

                return (
                    Number(a.completed) -
                    Number(b.completed)
                );

            }


            return a.date.localeCompare(
                b.date
            );

        }
    );


    visible.forEach(
        item => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "todo-item";


            if (item.completed) {

                row.classList.add(
                    "completed"
                );

            }


            /* CHECKBOX */

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.checked =
                Boolean(
                    item.completed
                );


            checkbox.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    item.completed =
                        checkbox.checked;

                    saveState();

                    renderAll();

                }
            );


            /* CATEGORY DOT */

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "category-dot";


            const category =
                getCategory(
                    item.categoryId
                );


            if (category) {

                dot.style.background =
                    category.color;

            } else {

                dot.classList.add(
                    "no-category-dot"
                );

            }


            /* TEXT */

            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "todo-text";


            text.textContent =
                item.title;


            text.title =
                item.title;


            /* DELETE */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-todo";


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Delete";


            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    deleteAssignmentById(
                        item.id
                    );

                }
            );


            /* OPEN */

            row.addEventListener(
                "click",
                () => {

                    openAssignmentModal(
                        item.id
                    );

                }
            );


            row.appendChild(
                checkbox
            );

            row.appendChild(
                dot
            );

            row.appendChild(
                text
            );

            row.appendChild(
                deleteButton
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   DELETE ASSIGNMENT
========================================================= */

function deleteAssignmentById(id) {

    const item =
        state.assignments.find(
            assignment =>
                assignment.id === id
        );


    if (!item) {
        return;
    }


    if (
        !confirm(
            `Delete "${item.title}"?`
        )
    ) {

        return;

    }


    state.assignments =
        state.assignments.filter(
            assignment =>
                assignment.id !== id
        );


    saveState();

    renderAll();

}


/* =========================================================
   GENERAL TODO
========================================================= */

function addGeneralTodo() {

    const input =
        document.getElementById(
            "generalTodoInput"
        );


    const title =
        input.value.trim();


    if (!title) {
        return;
    }


    state.todos.push({

        id:
            createId("todo"),

        title,

        completed: false,

        createdAt:
            new Date().toISOString()

    });


    input.value = "";


    saveState();

    renderGeneralTodos();

}


/* =========================================================
   RENDER GENERAL TODOS
========================================================= */

function renderGeneralTodos() {

    const container =
        document.getElementById(
            "generalTodoItems"
        );


    container.innerHTML = "";


    if (!state.todos.length) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "empty-message";

        message.textContent =
            "No general to-dos yet.";

        container.appendChild(
            message
        );

        return;

    }


    const todos =
        [...state.todos].sort(
            (a, b) =>
                Number(a.completed) -
                Number(b.completed)
        );


    todos.forEach(
        todo => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "todo-item";


            if (todo.completed) {

                row.classList.add(
                    "completed"
                );

            }


            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.checked =
                Boolean(
                    todo.completed
                );


            checkbox.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    todo.completed =
                        checkbox.checked;

                    saveState();

                    renderGeneralTodos();

                }
            );


            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "todo-text";


            text.textContent =
                todo.title;


            text.title =
                todo.title;


            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-todo";


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Delete";


            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    state.todos =
                        state.todos.filter(
                            item =>
                                item.id !==
                                todo.id
                        );

                    saveState();

                    renderGeneralTodos();

                }
            );


            row.appendChild(
                checkbox
            );

            row.appendChild(
                text
            );

            row.appendChild(
                deleteButton
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   TODO LISTS
========================================================= */

function renderTodoLists() {

    renderAssignmentTodoList();

    renderGeneralTodos();

}


/* =========================================================
   CATEGORY SELECTS
========================================================= */

function renderCategorySelects() {

    const assignmentSelect =
        document.getElementById(
            "assignmentCategory"
        );


    const todoSelect =
        document.getElementById(
            "categorySelect"
        );


    const currentAssignmentValue =
        assignmentSelect.value;


    const currentTodoValue =
        todoSelect.value;


    assignmentSelect.innerHTML = "";

    todoSelect.innerHTML = "";


    state.categories.forEach(
        category => {

            const assignmentOption =
                document.createElement(
                    "option"
                );


            assignmentOption.value =
                category.id;


            assignmentOption.textContent =
                category.name;


            assignmentSelect.appendChild(
                assignmentOption
            );


            const todoOption =
                document.createElement(
                    "option"
                );


            todoOption.value =
                category.id;


            todoOption.textContent =
                category.name;


            todoSelect.appendChild(
                todoOption
            );

        }
    );


    if (
        state.categories.some(
            category =>
                category.id ===
                currentAssignmentValue
        )
    ) {

        assignmentSelect.value =
            currentAssignmentValue;

    }


    if (
        state.categories.some(
            category =>
                category.id ===
                currentTodoValue
        )
    ) {

        todoSelect.value =
            currentTodoValue;

    }

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function renderCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );


    const currentValue =
        select.value;


    select.innerHTML = "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value =
        "all";


    allOption.textContent =
        "All Categories";


    select.appendChild(
        allOption
    );


    state.categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.id;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        currentValue &&
        (
            currentValue === "all" ||
            state.categories.some(
                category =>
                    category.id ===
                    currentValue
            )
        )
    ) {

        select.value =
            currentValue;

    } else {

        select.value =
            "all";

    }

}


/* =========================================================
   CATEGORY MODAL
========================================================= */

function openCategoryModal() {

    renderCategoryList();

    document
        .getElementById(
            "categoryModal"
        )
        .classList.remove(
            "hidden"
        );

}


function closeCategoryModal() {

    document
        .getElementById(
            "categoryModal"
        )
        .classList.add(
            "hidden"
        );

    renderAll();

}


/* =========================================================
   CATEGORY LIST
========================================================= */

function renderCategoryList() {

    const container =
        document.getElementById(
            "categoryList"
        );


    container.innerHTML = "";


    state.categories.forEach(
        category => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            /* COLOR */

            const colorInput =
                document.createElement(
                    "input"
                );


            colorInput.type =
                "color";


            colorInput.className =
                "category-color";


            colorInput.value =
                category.color;


            colorInput.addEventListener(
                "input",
                () => {

                    category.color =
                        colorInput.value;

                    saveState();

                    renderCalendar();

                    renderTodoLists();

                    renderCategoryList();

                }
            );


            /* NAME */

            const nameInput =
                document.createElement(
                    "input"
                );


            nameInput.type =
                "text";


            nameInput.className =
                "category-name-input";


            nameInput.value =
                category.name;


            nameInput.maxLength =
                30;


            nameInput.addEventListener(
                "change",
                () => {

                    const newName =
                        nameInput.value.trim();


                    if (!newName) {
                        return;
                    }


                    category.name =
                        newName;


                    saveState();

                    renderAll();

                }
            );


            /* PREVIEW */

            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "category-color-preview";


            preview.style.background =
                category.color;


            /* DELETE */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-category";


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "×";


            deleteButton.title =
                "Delete category";


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteCategory(
                        category.id
                    );

                }
            );


            row.appendChild(
                colorInput
            );

            row.appendChild(
                nameInput
            );

            row.appendChild(
                preview
            );

            row.appendChild(
                deleteButton
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   ADD CATEGORY
========================================================= */

function addCategory() {

    const nameInput =
        document.getElementById(
            "newCategoryName"
        );


    const colorInput =
        document.getElementById(
            "newCategoryColor"
        );


    const name =
        nameInput.value.trim();


    if (!name) {
        return;
    }


    state.categories.push({

        id:
            createId("category"),

        name,

        color:
            colorInput.value

    });


    nameInput.value = "";

    colorInput.value =
        "#007aff";


    saveState();

    renderAll();

}


/* =========================================================
   DELETE CATEGORY
========================================================= */

function deleteCategory(id) {

    if (
        state.categories.length <= 1
    ) {

        alert(
            "You need to keep at least one category."
        );

        return;

    }


    const category =
        getCategory(id);


    if (!category) {
        return;
    }


    if (
        !confirm(
            `Delete the "${category.name}" category?`
        )
    ) {

        return;

    }


    state.categories =
        state.categories.filter(
            item =>
                item.id !== id
        );


    /*
       Keep assignments.

       Reassign deleted category's
       assignments to the first
       remaining category.
    */

    const fallbackCategory =
        state.categories[0];


    state.assignments.forEach(
        item => {

            if (
                item.categoryId === id
            ) {

                item.categoryId =
                    fallbackCategory.id;

            }

        }
    );


    saveState();

    renderAll();

}


/* =========================================================
   SEARCH
========================================================= */

function openSearchModal() {

    const modal =
        document.getElementById(
            "searchModal"
        );


    modal.classList.remove(
        "hidden"
    );


    const input =
        document.getElementById(
            "searchInput"
        );


    input.value = "";


    performSearch();


    setTimeout(
        () => {

            input.focus();

        },
        50
    );

}


function closeSearchModal() {

    document
        .getElementById(
            "searchModal"
        )
        .classList.add(
            "hidden"
        );

}


/* =========================================================
   PERFORM SEARCH
========================================================= */

function performSearch() {

    const query =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .trim()
            .toLowerCase();


    const results =
        document.getElementById(
            "searchResults"
        );


    results.innerHTML = "";


    if (!query) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "empty-message";


        message.textContent =
            "Start typing to search.";


        results.appendChild(
            message
        );


        return;

    }


    const matches =
        state.assignments.filter(
            item => {

                const title =
                    (
                        item.title ||
                        ""
                    ).toLowerCase();


                const notes =
                    (
                        item.notes ||
                        ""
                    ).toLowerCase();


                return (
                    title.includes(query) ||
                    notes.includes(query)
                );

            }
        );


    if (!matches.length) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "empty-message";


        message.textContent =
            "No matching assignments.";


        results.appendChild(
            message
        );


        return;

    }


    matches.forEach(
        item => {

            const result =
                document.createElement(
                    "div"
                );


            result.className =
                "search-result";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "search-result-title";


            title.textContent =
                item.title;


            const meta =
                document.createElement(
                    "div"
                );


            meta.className =
                "search-result-meta";


            meta.textContent =
                formatDisplayDate(
                    item.date
                );


            result.appendChild(
                title
            );


            result.appendChild(
                meta
            );


            result.addEventListener(
                "click",
                () => {

                    jumpToAssignment(
                        item
                    );

                }
            );


            results.appendChild(
                result
            );

        }
    );

}


/* =========================================================
   JUMP TO ASSIGNMENT
========================================================= */

function jumpToAssignment(item) {

    if (
        !isValidDateString(item.date)
    ) {
        return;
    }


    const parts =
        item.date.split("-");


    const year =
        Number(parts[0]);


    const month =
        Number(parts[1]) - 1;


    currentMonth =
        new Date(
            year,
            month,
            1
        );


    selectedDate =
        item.date;


    closeSearchModal();

    renderCalendar();


    setTimeout(
        () => {

            const day =
                document.querySelector(
                    `.day[data-date="${item.date}"]`
                );


            if (day) {

                day.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        },
        100
    );

}


/* =========================================================
   TODAY
========================================================= */

function goToToday() {

    const today =
        new Date();


    currentMonth =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    selectedDate =
        formatDate(today);


    renderCalendar();

}


/* =========================================================
   WEEK SUMMARY
========================================================= */

function renderWeekSummary() {

    const today =
        new Date();


    const dayOfWeek =
        today.getDay();


    const start =
        new Date(today);


    start.setDate(
        today.getDate() -
        dayOfWeek
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(start);


    end.setDate(
        start.getDate() + 7
    );


    const startString =
        formatDate(start);


    const endString =
        formatDate(end);


    const weeklyAssignments =
        state.assignments.filter(
            item => {

                return (
                    item.date >= startString &&
                    item.date < endString
                );

            }
        );


    const total =
        weeklyAssignments.length;


    const completed =
        weeklyAssignments.filter(
            item =>
                item.completed
        ).length;


    const events =
        weeklyAssignments.filter(
            item =>
                item.showInTodo === false
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    document.getElementById(
        "weekTotal"
    ).textContent =
        total;


    document.getElementById(
        "weekCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "weekEvents"
    ).textContent =
        events;


    document.getElementById(
        "weekProgressText"
    ).textContent =
        `${percentage}% complete`;


    document.getElementById(
        "weekProgressFill"
    ).style.width =
        `${percentage}%`;

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

function exportBackup() {

    const backup = {

        version: 2,

        exportedAt:
            new Date().toISOString(),

        assignments:
            state.assignments,

        todos:
            state.todos,

        categories:
            state.categories

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `assignment-calendar-backup-${formatDate(new Date())}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

function importBackup(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = () => {

        try {

            const imported =
                JSON.parse(
                    reader.result
                );


            if (
                !imported ||
                typeof imported !== "object"
            ) {

                throw new Error(
                    "Invalid backup."
                );

            }


            if (
                !Array.isArray(
                    imported.assignments
                ) ||
                !Array.isArray(
                    imported.todos
                ) ||
                !Array.isArray(
                    imported.categories
                )
            ) {

                throw new Error(
                    "Invalid backup structure."
                );

            }


            const confirmed =
                confirm(
                    "Restore this backup? Your current calendar data will be replaced."
                );


            if (!confirmed) {
                return;
            }


            state = {

                assignments:
                    imported.assignments.map(
                        normalizeAssignment
                    ),

                todos:
                    imported.todos.map(
                        normalizeTodo
                    ),

                categories:
                    imported.categories.length
                        ? imported.categories.map(
                            normalizeCategory
                        )
                        : [
                            ...DEFAULT_CATEGORIES
                        ]

            };


            saveState();

            renderAll();


            alert(
                "Backup restored successfully!"
            );


        } catch (error) {

            console.error(
                error
            );


            alert(
                "That backup file could not be restored."
            );

        }


        event.target.value = "";

    };


    reader.readAsText(file);

}


/* =========================================================
   GET CATEGORY
========================================================= */

function getCategory(id) {

    return state.categories.find(
        category =>
            category.id === id
    );

}


/* =========================================================
   CREATE ID
========================================================= */

function createId(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =========================================================
   DISPLAY DATE
========================================================= */

function formatDisplayDate(
    dateString
) {

    if (
        !isValidDateString(
            dateString
        )
    ) {

        return "Unknown date";

    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}
        color: "#34c759"
    }
];


/* =========================================================
   APPLICATION STATE
========================================================= */

let state = {
    assignments: [],
    todos: [],
    categories: [...DEFAULT_CATEGORIES]
};


/* =========================================================
   CURRENT CALENDAR DATE
========================================================= */

let currentMonth = new Date();

currentMonth.setDate(1);


/* =========================================================
   EDITING STATE
========================================================= */

let editingAssignmentId = null;


/* =========================================================
   SELECTED DAY
========================================================= */

let selectedDate = null;


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /*
        Safety cleanup.

        The supplied HTML contains only one calendar.
        This also protects against accidentally duplicated
        calendar sections being present in an older copy
        of the page.
    */
    removeDuplicateCalendarSections();

    loadState();

    setupEventListeners();

    renderAll();

});


/* =========================================================
   REMOVE DUPLICATE CALENDAR SECTIONS
========================================================= */

function removeDuplicateCalendarSections() {

    const calendarSections =
        document.querySelectorAll(".calendar-section");

    if (calendarSections.length <= 1) {
        return;
    }

    /*
        Keep the first calendar section because it is the
        intended working calendar.

        Remove every additional calendar section.
    */
    for (let i = 1; i < calendarSections.length; i++) {

        calendarSections[i].remove();

    }

}


/* =========================================================
   LOAD STATE
========================================================= */

function loadState() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return;
        }

        const parsed =
            JSON.parse(saved);

        if (!parsed || typeof parsed !== "object") {
            return;
        }

        if (Array.isArray(parsed.assignments)) {
            state.assignments =
                parsed.assignments;
        }

        if (Array.isArray(parsed.todos)) {
            state.todos =
                parsed.todos;
        }

        if (
            Array.isArray(parsed.categories) &&
            parsed.categories.length
        ) {

            state.categories =
                parsed.categories;

        }

    } catch (error) {

        console.error(
            "Could not load saved calendar data:",
            error
        );

    }

}


/* =========================================================
   SAVE STATE
========================================================= */

function saveState() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state)
        );

    } catch (error) {

        console.error(
            "Could not save calendar data:",
            error
        );

    }

}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEventListeners() {


    /* =========================
       MONTH
    ========================= */

    document
        .getElementById("previousMonth")
        .addEventListener("click", () => {

            currentMonth.setMonth(
                currentMonth.getMonth() - 1
            );

            renderCalendar();

        });


    document
        .getElementById("nextMonth")
        .addEventListener("click", () => {

            currentMonth.setMonth(
                currentMonth.getMonth() + 1
            );

            renderCalendar();

        });


    document
        .getElementById("todayButton")
        .addEventListener(
            "click",
            goToToday
        );


    /* =========================
       ADD CALENDAR ITEM
    ========================= */

    document
        .getElementById("addCalendarItem")
        .addEventListener("click", () => {

            openAssignmentModal();

        });


    /* =========================
       ASSIGNMENT TODO
    ========================= */

    document
        .getElementById("addTodo")
        .addEventListener(
            "click",
            addAssignmentFromTodo
        );


    document
        .getElementById("todoInput")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    addAssignmentFromTodo();
                }

            }
        );


    /* =========================
       GENERAL TODO
    ========================= */

    document
        .getElementById("addGeneralTodo")
        .addEventListener(
            "click",
            addGeneralTodo
        );


    document
        .getElementById("generalTodoInput")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    addGeneralTodo();
                }

            }
        );


    /* =========================
       CATEGORY FILTER
    ========================= */

    document
        .getElementById("categoryFilter")
        .addEventListener(
            "change",
            renderCalendar
        );


    /* =========================
       ASSIGNMENT MODAL
    ========================= */

    document
        .getElementById("closeAssignmentModal")
        .addEventListener(
            "click",
            closeAssignmentModal
        );


    document
        .getElementById("cancelAssignmentModal")
        .addEventListener(
            "click",
            closeAssignmentModal
        );


    document
        .getElementById("saveAssignmentButton")
        .addEventListener(
            "click",
            saveAssignment
        );


    document
        .getElementById("deleteAssignmentButton")
        .addEventListener(
            "click",
            deleteCurrentAssignment
        );


    /* =========================
       CATEGORY MODAL
    ========================= */

    document
        .getElementById("categorySettingsButton")
        .addEventListener(
            "click",
            openCategoryModal
        );


    document
        .getElementById("closeCategoryModal")
        .addEventListener(
            "click",
            closeCategoryModal
        );


    document
        .getElementById("doneCategorySettings")
        .addEventListener(
            "click",
            closeCategoryModal
        );


    document
        .getElementById("addCategory")
        .addEventListener(
            "click",
            addCategory
        );


    document
        .getElementById("newCategoryName")
        .addEventListener(
            "keydown",
            event => {

                if (event.key === "Enter") {
                    addCategory();
                }

            }
        );


    /* =========================
       SEARCH
    ========================= */

    document
        .getElementById("searchButton")
        .addEventListener(
            "click",
            openSearchModal
        );


    document
        .getElementById("closeSearchModal")
        .addEventListener(
            "click",
            closeSearchModal
        );


    document
        .getElementById("searchInput")
        .addEventListener(
            "input",
            performSearch
        );


    /* =========================
       BACKUP
    ========================= */

    document
        .getElementById("exportButton")
        .addEventListener(
            "click",
            exportBackup
        );


    /* =========================
       RESTORE
    ========================= */

    document
        .getElementById("importButton")
        .addEventListener(
            "click",
            () => {

                document
                    .getElementById("importFile")
                    .click();

            }
        );


    document
        .getElementById("importFile")
        .addEventListener(
            "change",
            importBackup
        );


    /* =========================
       MODAL BACKGROUND CLICKS
    ========================= */

    document
        .querySelectorAll(".modal-overlay")
        .forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (event.target === overlay) {

                        overlay.classList.add("hidden");

                    }

                }
            );

        });


    /* =========================
       ESCAPE KEY
    ========================= */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            document
                .querySelectorAll(".modal-overlay")
                .forEach(modal => {

                    modal.classList.add("hidden");

                });

        }
    );

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

    renderCategorySelects();

    renderCategoryFilter();

    renderCalendar();

    renderTodoLists();

    renderWeekSummary();

    renderCategoryList();

}


/* =========================================================
   CALENDAR
========================================================= */

function renderCalendar() {

    /*
        Always target the single calendar container.
    */
    const calendar =
        document.getElementById("calendar");

    const monthName =
        document.getElementById("monthName");

    if (!calendar || !monthName) {
        return;
    }

    calendar.innerHTML = "";


    /* =========================
       MONTH TITLE
    ========================= */

    monthName.textContent =
        currentMonth.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    /* =========================
       FIRST DAY
    ========================= */

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    /* =========================
       NUMBER OF DAYS
    ========================= */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /* =========================
       FILTER
    ========================= */

    const filter =
        document.getElementById(
            "categoryFilter"
        ).value;


    /* =========================
       EMPTY DAYS BEFORE MONTH
    ========================= */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "empty-day";

        calendar.appendChild(empty);

    }


    /* =========================
       DAYS
    ========================= */

    for (
        let dayNumber = 1;
        dayNumber <= daysInMonth;
        dayNumber++
    ) {

        const dateString =
            formatDate(
                new Date(
                    year,
                    month,
                    dayNumber
                )
            );


        const day =
            document.createElement("div");

        day.className = "day";

        day.dataset.date =
            dateString;


        /* =========================
           TODAY
        ========================= */

        if (
            dateString ===
            formatDate(new Date())
        ) {

            day.classList.add("today");

        }


        /* =========================
           SELECTED
        ========================= */

        if (
            selectedDate ===
            dateString
        ) {

            day.classList.add("selected");

        }


        /* =========================
           DAY NUMBER
        ========================= */

        const number =
            document.createElement("div");

        number.className =
            "day-number";

        number.textContent =
            dayNumber;

        day.appendChild(number);


        /* =========================
           CLICK DAY
        ========================= */

        day.addEventListener(
            "click",
            () => {

                selectedDate =
                    dateString;

                renderCalendar();

                openAssignmentModal(
                    null,
                    dateString
                );

            }
        );


        /* =========================
           ASSIGNMENTS FOR DAY
        ========================= */

        const dayAssignments =
            state.assignments.filter(
                item => {

                    if (
                        item.date !==
                        dateString
                    ) {

                        return false;

                    }

                    if (filter === "all") {
                        return true;
                    }

                    return (
                        item.categoryId ===
                        filter
                    );

                }
            );


        /* =========================
           SORT
        ========================= */

        dayAssignments.sort(
            (a, b) => {

                return (
                    Number(a.completed) -
                    Number(b.completed)
                );

            }
        );


        /* =========================
           CREATE ASSIGNMENTS
        ========================= */

        dayAssignments.forEach(
            item => {

                const assignment =
                    createCalendarAssignment(
                        item
                    );

                day.appendChild(
                    assignment
                );

            }
        );


        calendar.appendChild(day);

    }


    /* =========================
       FILL LAST ROW
    ========================= */

    const totalCells =
        firstDay +
        daysInMonth;

    const remainder =
        totalCells % 7;

    if (remainder !== 0) {

        const emptyCount =
            7 - remainder;

        for (
            let i = 0;
            i < emptyCount;
            i++
        ) {

            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "empty-day";

            calendar.appendChild(empty);

        }

    }

}


/* =========================================================
   CREATE CALENDAR ASSIGNMENT
========================================================= */

function createCalendarAssignment(item) {

    const element =
        document.createElement("div");

    element.className =
        "assignment";


    if (item.completed) {

        element.classList.add(
            "completed"
        );

    }


    if (!item.showInTodo) {

        element.classList.add(
            "calendar-only"
        );

    }


    /* =========================
       CATEGORY COLOR
    ========================= */

    const category =
        getCategory(
            item.categoryId
        );


    if (category) {

        element.style.background =
            category.color;

    } else {

        element.style.background =
            "#8e8e93";

    }


    /* =========================
       TITLE
    ========================= */

    /*
        CSS handles the one-line
        ellipsis behavior.
    */
    element.textContent =
        item.title;

    element.title =
        item.title;


    /* =========================
       CLICK
    ========================= */

    element.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openAssignmentModal(
                item.id
            );

        }
    );


    return element;

}


/* =========================================================
   OPEN ASSIGNMENT MODAL
========================================================= */

function openAssignmentModal(
    id = null,
    date = null
) {

    editingAssignmentId =
        id;


    const modal =
        document.getElementById(
            "assignmentModal"
        );

    const titleInput =
        document.getElementById(
            "assignmentTitle"
        );

    const dateInput =
        document.getElementById(
            "assignmentDate"
        );

    const categoryInput =
        document.getElementById(
            "assignmentCategory"
        );

    const notesInput =
        document.getElementById(
            "assignmentNotes"
        );

    const todoCheckbox =
        document.getElementById(
            "showInTodo"
        );

    const modalTitle =
        document.getElementById(
            "assignmentModalTitle"
        );

    const deleteButton =
        document.getElementById(
            "deleteAssignmentButton"
        );


    /* =========================
       EDIT EXISTING
    ========================= */

    if (id) {

        const item =
            state.assignments.find(
                assignment =>
                    assignment.id === id
            );


        if (!item) {
            return;
        }


        modalTitle.textContent =
            "Edit Calendar Item";


        titleInput.value =
            item.title || "";


        dateInput.value =
            item.date || "";


        categoryInput.value =
            item.categoryId || "";


        notesInput.value =
            item.notes || "";


        todoCheckbox.checked =
            item.showInTodo !== false;


        deleteButton.style.display =
            "inline-block";

    }


    /* =========================
       NEW
    ========================= */

    else {

        modalTitle.textContent =
            "Add Calendar Item";


        titleInput.value = "";


        dateInput.value =
            date ||
            selectedDate ||
            formatDate(new Date());


        categoryInput.value =
            state.categories[0]?.id || "";


        notesInput.value = "";


        todoCheckbox.checked =
            true;


        deleteButton.style.display =
            "none";

    }


    modal.classList.remove(
        "hidden"
    );


    setTimeout(
        () => {

            titleInput.focus();

        },
        50
    );

}


/* =========================================================
   CLOSE ASSIGNMENT MODAL
========================================================= */

function closeAssignmentModal() {

    document
        .getElementById(
            "assignmentModal"
        )
        .classList.add(
            "hidden"
        );


    editingAssignmentId =
        null;

}


/* =========================================================
   SAVE ASSIGNMENT
========================================================= */

function saveAssignment() {

    const title =
        document
            .getElementById(
                "assignmentTitle"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "assignmentDate"
            )
            .value;


    const categoryId =
        document
            .getElementById(
                "assignmentCategory"
            )
            .value;


    const notes =
        document
            .getElementById(
                "assignmentNotes"
            )
            .value
            .trim();


    const showInTodo =
        document
            .getElementById(
                "showInTodo"
            )
            .checked;


    /* =========================
       VALIDATION
    ========================= */

    if (!title) {

        alert(
            "Please enter a title."
        );

        return;

    }


    if (!date) {

        alert(
            "Please choose a date."
        );

        return;

    }


    /* =========================
       EDIT
    ========================= */

    if (editingAssignmentId) {

        const item =
            state.assignments.find(
                assignment =>
                    assignment.id ===
                    editingAssignmentId
            );


        if (!item) {
            return;
        }


        item.title =
            title;

        item.date =
            date;

        item.categoryId =
            categoryId;

        item.notes =
            notes;

        item.showInTodo =
            showInTodo;

    }


    /* =========================
       CREATE
    ========================= */

    else {

        state.assignments.push({

            id:
                createId(
                    "assignment"
                ),

            title,

            date,

            categoryId,

            notes,

            showInTodo,

            completed:
                false,

            createdAt:
                new Date().toISOString()

        });

    }


    saveState();

    closeAssignmentModal();

    renderAll();

}


/* =========================================================
   DELETE CURRENT ASSIGNMENT
========================================================= */

function deleteCurrentAssignment() {

    if (!editingAssignmentId) {
        return;
    }


    const item =
        state.assignments.find(
            assignment =>
                assignment.id ===
                editingAssignmentId
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${item.title}"?`
        );


    if (!confirmed) {
        return;
    }


    state.assignments =
        state.assignments.filter(
            assignment =>
                assignment.id !==
                editingAssignmentId
        );


    saveState();

    closeAssignmentModal();

    renderAll();

}


/* =========================================================
   ADD ASSIGNMENT FROM TODO
========================================================= */

function addAssignmentFromTodo() {

    const input =
        document.getElementById(
            "todoInput"
        );


    const title =
        input.value.trim();


    if (!title) {
        return;
    }


    const categoryId =
        document.getElementById(
            "categorySelect"
        ).value;


    state.assignments.push({

        id:
            createId(
                "assignment"
            ),

        title,

        date:
            formatDate(new Date()),

        categoryId,

        notes: "",

        showInTodo:
            true,

        completed:
            false,

        createdAt:
            new Date().toISOString()

    });


    input.value = "";


    saveState();

    renderAll();

}


/* =========================================================
   RENDER ASSIGNMENT TODO LIST
========================================================= */

function renderAssignmentTodoList() {

    const container =
        document.getElementById(
            "todoItems"
        );


    container.innerHTML = "";


    const visible =
        state.assignments.filter(
            item =>
                item.showInTodo !== false
        );


    if (!visible.length) {

        const message =
            document.createElement(
                "div"
            );

        message.className =
            "empty-message";

        message.textContent =
            "No assignments yet.";

        container.appendChild(
            message
        );

        return;

    }


    /* =========================
       SORT
    ========================= */

    visible.sort(
        (a, b) => {

            if (
                a.completed !==
                b.completed
            ) {

                return (
                    Number(a.completed) -
                    Number(b.completed)
                );

            }

            return a.date.localeCompare(
                b.date
            );

        }
    );


    visible.forEach(item => {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "todo-item";


        if (item.completed) {

            row.classList.add(
                "completed"
            );

        }


        /* =========================
           CHECKBOX
        ========================= */

        const checkbox =
            document.createElement(
                "input"
            );


        checkbox.type =
            "checkbox";


        checkbox.checked =
            Boolean(
                item.completed
            );


        checkbox.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                item.completed =
                    checkbox.checked;

                saveState();

                renderAll();

            }
        );


        /* =========================
           CATEGORY DOT
        ========================= */

        const dot =
            document.createElement(
                "span"
            );


        dot.className =
            "category-dot";


        const category =
            getCategory(
                item.categoryId
            );


        if (category) {

            dot.style.background =
                category.color;

        } else {

            dot.classList.add(
                "no-category-dot"
            );

        }


        /* =========================
           TEXT
        ========================= */

        const text =
            document.createElement(
                "span"
            );


        text.className =
            "todo-text";


        text.textContent =
            item.title;


        text.title =
            item.title;


        /* =========================
           DELETE
        ========================= */

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.className =
            "delete-todo";


        deleteButton.type =
            "button";


        deleteButton.textContent =
            "×";


        deleteButton.title =
            "Delete";


        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                deleteAssignmentById(
                    item.id
                );

            }
        );


        /* =========================
           OPEN EDIT
        ========================= */

        row.addEventListener(
            "click",
            () => {

                openAssignmentModal(
                    item.id
                );

            }
        );


        row.appendChild(
            checkbox
        );

        row.appendChild(
            dot
        );

        row.appendChild(
            text
        );

        row.appendChild(
            deleteButton
        );


        container.appendChild(
            row
        );

    });

}


/* =========================================================
   DELETE ASSIGNMENT BY ID
========================================================= */

function deleteAssignmentById(id) {

    const item =
        state.assignments.find(
            assignment =>
                assignment.id === id
        );


    if (!item) {
        return;
    }


    if (
        !confirm(
            `Delete "${item.title}"?`
        )
    ) {

        return;

    }


    state.assignments =
        state.assignments.filter(
            assignment =>
                assignment.id !== id
        );


    saveState();

    renderAll();

}


/* =========================================================
   GENERAL TODO
========================================================= */

function addGeneralTodo() {

    const input =
        document.getElementById(
            "generalTodoInput"
        );


    const title =
        input.value.trim();


    if (!title) {
        return;
    }


    state.todos.push({

        id:
            createId("todo"),

        title,

        completed:
            false,

        createdAt:
            new Date().toISOString()

    });


    input.value = "";


    saveState();

    renderGeneralTodos();

}


/* =========================================================
   RENDER GENERAL TODOS
========================================================= */

function renderGeneralTodos() {

    const container =
        document.getElementById(
            "generalTodoItems"
        );


    container.innerHTML = "";


    if (!state.todos.length) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "empty-message";


        message.textContent =
            "No general to-dos yet.";


        container.appendChild(
            message
        );


        return;

    }


    const todos =
        [...state.todos].sort(
            (a, b) =>
                Number(a.completed) -
                Number(b.completed)
        );


    todos.forEach(todo => {

        const row =
            document.createElement(
                "div"
            );


        row.className =
            "todo-item";


        if (todo.completed) {

            row.classList.add(
                "completed"
            );

        }


        /* =========================
           CHECKBOX
        ========================= */

        const checkbox =
            document.createElement(
                "input"
            );


        checkbox.type =
            "checkbox";


        checkbox.checked =
            Boolean(
                todo.completed
            );


        checkbox.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                todo.completed =
                    checkbox.checked;

                saveState();

                renderGeneralTodos();

                renderWeekSummary();

            }
        );


        /* =========================
           TEXT
        ========================= */

        const text =
            document.createElement(
                "span"
            );


        text.className =
            "todo-text";


        text.textContent =
            todo.title;


        text.title =
            todo.title;


        /* =========================
           DELETE
        ========================= */

        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.className =
            "delete-todo";


        deleteButton.type =
            "button";


        deleteButton.textContent =
            "×";


        deleteButton.title =
            "Delete";


        deleteButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                state.todos =
                    state.todos.filter(
                        item =>
                            item.id !==
                            todo.id
                    );


                saveState();

                renderGeneralTodos();

            }
        );


        row.appendChild(
            checkbox
        );

        row.appendChild(
            text
        );

        row.appendChild(
            deleteButton
        );


        container.appendChild(
            row
        );

    });

}


/* =========================================================
   RENDER TODO LISTS
========================================================= */

function renderTodoLists() {

    renderAssignmentTodoList();

    renderGeneralTodos();

}


/* =========================================================
   CATEGORY SELECTS
========================================================= */

function renderCategorySelects() {

    const assignmentSelect =
        document.getElementById(
            "assignmentCategory"
        );


    const todoSelect =
        document.getElementById(
            "categorySelect"
        );


    const currentAssignmentValue =
        assignmentSelect.value;


    const currentTodoValue =
        todoSelect.value;


    assignmentSelect.innerHTML =
        "";


    todoSelect.innerHTML =
        "";


    state.categories.forEach(
        category => {

            const assignmentOption =
                document.createElement(
                    "option"
                );


            assignmentOption.value =
                category.id;


            assignmentOption.textContent =
                category.name;


            assignmentSelect.appendChild(
                assignmentOption
            );


            const todoOption =
                document.createElement(
                    "option"
                );


            todoOption.value =
                category.id;


            todoOption.textContent =
                category.name;


            todoSelect.appendChild(
                todoOption
            );

        }
    );


    if (
        state.categories.some(
            category =>
                category.id ===
                currentAssignmentValue
        )
    ) {

        assignmentSelect.value =
            currentAssignmentValue;

    }


    if (
        state.categories.some(
            category =>
                category.id ===
                currentTodoValue
        )
    ) {

        todoSelect.value =
            currentTodoValue;

    }

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function renderCategoryFilter() {

    const select =
        document.getElementById(
            "categoryFilter"
        );


    const currentValue =
        select.value;


    select.innerHTML =
        "";


    const allOption =
        document.createElement(
            "option"
        );


    allOption.value =
        "all";


    allOption.textContent =
        "All Categories";


    select.appendChild(
        allOption
    );


    state.categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                category.id;


            option.textContent =
                category.name;


            select.appendChild(
                option
            );

        }
    );


    if (
        currentValue &&
        (
            currentValue === "all" ||
            state.categories.some(
                category =>
                    category.id ===
                    currentValue
            )
        )
    ) {

        select.value =
            currentValue;

    } else {

        select.value =
            "all";

    }

}


/* =========================================================
   OPEN CATEGORY MODAL
========================================================= */

function openCategoryModal() {

    renderCategoryList();


    document
        .getElementById(
            "categoryModal"
        )
        .classList.remove(
            "hidden"
        );

}


/* =========================================================
   CLOSE CATEGORY MODAL
========================================================= */

function closeCategoryModal() {

    document
        .getElementById(
            "categoryModal"
        )
        .classList.add(
            "hidden"
        );


    renderAll();

}


/* =========================================================
   RENDER CATEGORY LIST
========================================================= */

function renderCategoryList() {

    const container =
        document.getElementById(
            "categoryList"
        );


    container.innerHTML =
        "";


    state.categories.forEach(
        category => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "category-row";


            /* =========================
               COLOR INPUT
            ========================= */

            const colorInput =
                document.createElement(
                    "input"
                );


            colorInput.type =
                "color";


            colorInput.className =
                "category-color";


            colorInput.value =
                category.color;


            colorInput.addEventListener(
                "input",
                () => {

                    category.color =
                        colorInput.value;

                    saveState();

                    renderAll();

                }
            );


            /* =========================
               NAME
            ========================= */

            const nameInput =
                document.createElement(
                    "input"
                );


            nameInput.type =
                "text";


            nameInput.className =
                "category-name-input";


            nameInput.value =
                category.name;


            nameInput.maxLength =
                30;


            nameInput.addEventListener(
                "change",
                () => {

                    const newName =
                        nameInput.value.trim();


                    if (!newName) {
                        return;
                    }


                    category.name =
                        newName;


                    saveState();

                    renderAll();

                }
            );


            /* =========================
               COLOR PREVIEW
            ========================= */

            const preview =
                document.createElement(
                    "div"
                );


            preview.className =
                "category-color-preview";


            preview.style.background =
                category.color;


            /* =========================
               DELETE
            ========================= */

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-category";


            deleteButton.type =
                "button";


            deleteButton.textContent =
                "×";


            deleteButton.addEventListener(
                "click",
                () => {

                    deleteCategory(
                        category.id
                    );

                }
            );


            row.appendChild(
                colorInput
            );

            row.appendChild(
                nameInput
            );

            row.appendChild(
                preview
            );

            row.appendChild(
                deleteButton
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   ADD CATEGORY
========================================================= */

function addCategory() {

    const nameInput =
        document.getElementById(
            "newCategoryName"
        );


    const colorInput =
        document.getElementById(
            "newCategoryColor"
        );


    const name =
        nameInput.value.trim();


    if (!name) {
        return;
    }


    state.categories.push({

        id:
            createId("category"),

        name,

        color:
            colorInput.value

    });


    nameInput.value =
        "";


    colorInput.value =
        "#007aff";


    saveState();

    renderCategoryList();

    renderAll();

}


/* =========================================================
   DELETE CATEGORY
========================================================= */

function deleteCategory(id) {

    if (
        state.categories.length <= 1
    ) {

        alert(
            "You need to keep at least one category."
        );

        return;

    }


    const category =
        getCategory(id);


    if (!category) {
        return;
    }


    if (
        !confirm(
            `Delete the "${category.name}" category?`
        )
    ) {

        return;

    }


    state.categories =
        state.categories.filter(
            item =>
                item.id !== id
        );


    /* =========================
       REASSIGN ITEMS
    ========================= */

    state.assignments.forEach(
        item => {

            if (
                item.categoryId === id
            ) {

                item.categoryId =
                    state.categories[0].id;

            }

        }
    );


    saveState();

    renderAll();

}


/* =========================================================
   SEARCH
========================================================= */

function openSearchModal() {

    const modal =
        document.getElementById(
            "searchModal"
        );


    modal.classList.remove(
        "hidden"
    );


    const input =
        document.getElementById(
            "searchInput"
        );


    input.value =
        "";


    performSearch();


    setTimeout(
        () => {

            input.focus();

        },
        50
    );

}


/* =========================================================
   CLOSE SEARCH
========================================================= */

function closeSearchModal() {

    document
        .getElementById(
            "searchModal"
        )
        .classList.add(
            "hidden"
        );

}


/* =========================================================
   PERFORM SEARCH
========================================================= */

function performSearch() {

    const query =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .trim()
            .toLowerCase();


    const results =
        document.getElementById(
            "searchResults"
        );


    results.innerHTML =
        "";


    if (!query) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "empty-message";


        message.textContent =
            "Start typing to search.";


        results.appendChild(
            message
        );


        return;

    }


    const matches =
        state.assignments.filter(
            item => {

                const title =
                    (
                        item.title ||
                        ""
                    ).toLowerCase();


                const notes =
                    (
                        item.notes ||
                        ""
                    ).toLowerCase();


                return (
                    title.includes(query) ||
                    notes.includes(query)
                );

            }
        );


    if (!matches.length) {

        const message =
            document.createElement(
                "div"
            );


        message.className =
            "empty-message";


        message.textContent =
            "No matching assignments.";


        results.appendChild(
            message
        );


        return;

    }


    matches.forEach(
        item => {

            const result =
                document.createElement(
                    "div"
                );


            result.className =
                "search-result";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "search-result-title";


            title.textContent =
                item.title;


            const meta =
                document.createElement(
                    "div"
                );


            meta.className =
                "search-result-meta";


            meta.textContent =
                formatDisplayDate(
                    item.date
                );


            result.appendChild(
                title
            );


            result.appendChild(
                meta
            );


            result.addEventListener(
                "click",
                () => {

                    jumpToAssignment(
                        item
                    );

                }
            );


            results.appendChild(
                result
            );

        }
    );

}


/* =========================================================
   JUMP TO ASSIGNMENT
========================================================= */

function jumpToAssignment(item) {

    const parts =
        item.date.split("-");


    const year =
        Number(parts[0]);


    const month =
        Number(parts[1]) - 1;


    currentMonth =
        new Date(
            year,
            month,
            1
        );


    selectedDate =
        item.date;


    closeSearchModal();

    renderCalendar();


    setTimeout(
        () => {

            const day =
                document.querySelector(
                    `.day[data-date="${item.date}"]`
                );


            if (day) {

                day.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        },
        100
    );

}


/* =========================================================
   TODAY
========================================================= */

function goToToday() {

    const today =
        new Date();


    currentMonth =
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );


    selectedDate =
        formatDate(today);


    renderCalendar();

}


/* =========================================================
   WEEK SUMMARY
========================================================= */

function renderWeekSummary() {

    const today =
        new Date();


    const dayOfWeek =
        today.getDay();


    const start =
        new Date(today);


    start.setDate(
        today.getDate() -
        dayOfWeek
    );


    start.setHours(
        0,
        0,
        0,
        0
    );


    const end =
        new Date(start);


    end.setDate(
        start.getDate() + 7
    );


    const startString =
        formatDate(start);


    const endString =
        formatDate(end);


    const weeklyAssignments =
        state.assignments.filter(
            item => {

                return (
                    item.date >= startString &&
                    item.date < endString
                );

            }
        );


    const total =
        weeklyAssignments.length;


    const completed =
        weeklyAssignments.filter(
            item =>
                item.completed
        ).length;


    const events =
        weeklyAssignments.filter(
            item =>
                item.showInTodo === false
        ).length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );


    document.getElementById(
        "weekTotal"
    ).textContent =
        total;


    document.getElementById(
        "weekCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "weekEvents"
    ).textContent =
        events;


    document.getElementById(
        "weekProgressText"
    ).textContent =
        `${percentage}% complete`;


    document.getElementById(
        "weekProgressFill"
    ).style.width =
        `${percentage}%`;

}


/* =========================================================
   EXPORT BACKUP
========================================================= */

function exportBackup() {

    const backup = {

        version:
            2,

        exportedAt:
            new Date().toISOString(),

        assignments:
            state.assignments,

        todos:
            state.todos,

        categories:
            state.categories

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `assignment-calendar-backup-${formatDate(new Date())}.json`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   IMPORT BACKUP
========================================================= */

function importBackup(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    const reader =
        new FileReader();


    reader.onload = () => {

        try {

            const imported =
                JSON.parse(
                    reader.result
                );


            if (
                !imported ||
                typeof imported !==
                "object"
            ) {

                throw new Error(
                    "Invalid backup."
                );

            }


            if (
                !Array.isArray(
                    imported.assignments
                ) ||
                !Array.isArray(
                    imported.todos
                ) ||
                !Array.isArray(
                    imported.categories
                )
            ) {

                throw new Error(
                    "This file is not a valid assignment calendar backup."
                );

            }


            const confirmed =
                confirm(
                    "Restore this backup? Your current calendar data will be replaced."
                );


            if (!confirmed) {
                return;
            }


            state = {

                assignments:
                    imported.assignments,

                todos:
                    imported.todos,

                categories:
                    imported.categories.length
                        ? imported.categories
                        : [
                            ...DEFAULT_CATEGORIES
                        ]

            };


            saveState();

            renderAll();


            alert(
                "Backup restored successfully!"
            );


        } catch (error) {

            console.error(error);


            alert(
                "That backup file could not be restored."
            );

        }


        event.target.value =
            "";

    };


    reader.readAsText(file);

}


/* =========================================================
   GET CATEGORY
========================================================= */

function getCategory(id) {

    return state.categories.find(
        category =>
            category.id === id
    );

}


/* =========================================================
   CREATE ID
========================================================= */

function createId(prefix) {

    return (
        prefix +
        "-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =========================================================
   DISPLAY DATE
========================================================= */

function formatDisplayDate(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-US",
        {
            weekday:
                "short",

            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"
        }
    );

}

const GENERAL_TODO_STORAGE_KEY =
    "assignmentCalendarGeneralTodos";


// ============================================================
// DEFAULT CATEGORIES
// ============================================================

const DEFAULT_CATEGORIES = [

    {
        id: "homework",
        name: "Homework",
        color: "#007aff"
    },

    {
        id: "project",
        name: "Project",
        color: "#8e44ad"
    },

    {
        id: "quiz",
        name: "Quiz",
        color: "#34c759"
    },

    {
        id: "exam",
        name: "Exam",
        color: "#ff3b30"
    },

    {
        id: "other",
        name: "Other",
        color: "#ff9500"
    }

];


// ============================================================
// STATE
// ============================================================

let currentDate = new Date();

let assignments =
    loadAssignments();

let categories =
    loadCategories();

let generalTodos =
    loadGeneralTodos();

let selectedDate = null;

let selectedTodoId = null;

let editingAssignmentId = null;

let currentCategoryFilter = "all";

let supabaseClient = null;

let currentUser = null;

let cloudReady = false;

let cloudSyncTimer = null;

let isLoadingCloudData = false;


// ============================================================
// DOM
// ============================================================

const calendar =
    document.getElementById("calendar");

const monthName =
    document.getElementById("monthName");

const todoInput =
    document.getElementById("todoInput");

const todoItems =
    document.getElementById("todoItems");

const emptyMessage =
    document.getElementById("emptyMessage");

const categorySelect =
    document.getElementById("categorySelect");

const generalTodoInput =
    document.getElementById("generalTodoInput");

const generalTodoItems =
    document.getElementById("generalTodoItems");

const generalEmptyMessage =
    document.getElementById("generalEmptyMessage");

const categoryFilter =
    document.getElementById("categoryFilter");


// ============================================================
// LOCAL STORAGE
// ============================================================

function loadAssignments() {

    try {

        const saved =
            localStorage.getItem(
                ASSIGNMENT_STORAGE_KEY
            );

        if (!saved) {
            return [];
        }

        const data =
            JSON.parse(saved);

        if (!Array.isArray(data)) {
            return [];
        }

        return data.map(item => {

            return {

                id:
                    item.id ||
                    Date.now().toString(),

                text:
                    item.text ||
                    item.title ||
                    "",

                title:
                    item.title ||
                    item.text ||
                    "",

                date:
                    item.date ||
                    null,

                category:
                    item.category ||
                    null,

                notes:
                    item.notes ||
                    "",

                completed:
                    Boolean(item.completed),

                showInTodo:
                    item.showInTodo !== false
            };

        });

    } catch (error) {

        console.error(
            "Could not load assignments:",
            error
        );

        return [];
    }
}


function saveAssignments() {

    localStorage.setItem(
        ASSIGNMENT_STORAGE_KEY,
        JSON.stringify(assignments)
    );

    scheduleCloudSync();
}


function loadCategories() {

    try {

        const saved =
            localStorage.getItem(
                CATEGORY_STORAGE_KEY
            );

        if (!saved) {

            return DEFAULT_CATEGORIES.map(
                category => ({
                    ...category
                })
            );
        }

        const data =
            JSON.parse(saved);

        if (!Array.isArray(data)) {

            return DEFAULT_CATEGORIES.map(
                category => ({
                    ...category
                })
            );
        }

        return data;

    } catch (error) {

        return DEFAULT_CATEGORIES.map(
            category => ({
                ...category
            })
        );
    }
}


function saveCategories() {

    localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categories)
    );

    scheduleCloudSync();
}


function loadGeneralTodos() {

    try {

        const saved =
            localStorage.getItem(
                GENERAL_TODO_STORAGE_KEY
            );

        if (!saved) {
            return [];
        }

        const data =
            JSON.parse(saved);

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        return [];
    }
}


function saveGeneralTodos() {

    localStorage.setItem(
        GENERAL_TODO_STORAGE_KEY,
        JSON.stringify(generalTodos)
    );

    scheduleCloudSync();
}


// ============================================================
// SUPABASE LOADER
// ============================================================

function loadSupabaseLibrary() {

    return new Promise(
        (resolve, reject) => {

            if (
                window.supabase &&
                window.supabase.createClient
            ) {

                resolve();

                return;
            }


            const script =
                document.createElement(
                    "script"
                );

            script.src =
                "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

            script.onload =
                () => resolve();

            script.onerror =
                () => reject(
                    new Error(
                        "Could not load Supabase."
                    )
                );

            document.head.appendChild(
                script
            );
        }
    );
}


// ============================================================
// SUPABASE INITIALIZATION
// ============================================================

async function initializeCloud() {

    if (
        SUPABASE_URL.includes(
            "PASTE YOUR"
        ) ||
        SUPABASE_KEY.includes(
            "PASTE YOUR"
        )
    ) {

        showCloudStatus(
            "Local mode"
        );

        return;
    }


    try {

        await loadSupabaseLibrary();


        supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY,
                {
                    auth: {
                        persistSession: true,
                        autoRefreshToken: true,
                        detectSessionInUrl: true
                    }
                }
            );


        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Could not get session:",
                error
            );

            showLogin();

            return;
        }


        currentUser =
            data.session
                ? data.session.user
                : null;


        if (currentUser) {

            await loadCloudData();

        } else {

            showLogin();
        }


        supabaseClient.auth.onAuthStateChange(
            async (
                event,
                session
            ) => {

                currentUser =
                    session
                        ? session.user
                        : null;


                if (
                    currentUser
                ) {

                    hideLogin();

                    await loadCloudData();

                } else {

                    showLogin();
                }
            }
        );


    } catch (error) {

        console.error(
            "Supabase initialization error:",
            error
        );

        showCloudStatus(
            "Offline"
        );
    }
}


// ============================================================
// CLOUD LOGIN UI
// ============================================================

function createLoginUI() {

    if (
        document.getElementById(
            "cloudLoginModal"
        )
    ) {
        return;
    }


    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "cloudLoginModal";


    modal.innerHTML = `

        <div class="cloud-login-backdrop">

            <div class="cloud-login-card">

                <div class="cloud-login-icon">
                    ☁️
                </div>

                <h2>My Assignment Calendar</h2>

                <p>
                    Sign in to sync your calendar
                    between your devices.
                </p>

                <input
                    type="email"
                    id="cloudEmail"
                    placeholder="Email"
                    autocomplete="email"
                >

                <input
                    type="password"
                    id="cloudPassword"
                    placeholder="Password"
                    autocomplete="current-password"
                >

                <button id="cloudLoginButton">
                    Sign In
                </button>

                <div
                    id="cloudLoginMessage"
                    class="cloud-login-message"
                ></div>

            </div>

        </div>

    `;


    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        #cloudLoginModal {
            position: fixed;
            inset: 0;
            z-index: 99999;
        }

        .cloud-login-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.35);
            backdrop-filter: blur(12px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .cloud-login-card {
            width: min(420px, 100%);
            background: white;
            border-radius: 26px;
            padding: 32px;
            box-shadow:
                0 25px 80px rgba(0,0,0,0.25);
            text-align: center;
        }

        .cloud-login-icon {
            font-size: 42px;
            margin-bottom: 10px;
        }

        .cloud-login-card h2 {
            margin: 0 0 8px;
            font-size: 24px;
        }

        .cloud-login-card p {
            color: #86868b;
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 22px;
        }

        .cloud-login-card input {
            width: 100%;
            padding: 13px 14px;
            margin-bottom: 10px;
            border: 1px solid #d2d2d7;
            border-radius: 11px;
            font-family: inherit;
            font-size: 15px;
            outline: none;
        }

        .cloud-login-card input:focus {
            border-color: #007aff;
            box-shadow:
                0 0 0 3px rgba(0,122,255,0.12);
        }

        .cloud-login-card button {
            width: 100%;
            border: none;
            border-radius: 11px;
            padding: 13px;
            background: #007aff;
            color: white;
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 5px;
        }

        .cloud-login-card button:hover {
            background: #0066d6;
        }

        .cloud-login-message {
            min-height: 20px;
            margin-top: 12px;
            color: #ff3b30;
            font-size: 13px;
        }

    `;


    document.head.appendChild(
        style
    );

    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "cloudLoginButton"
        )
        .addEventListener(
            "click",
            loginToCloud
        );


    document
        .getElementById(
            "cloudPassword"
        )
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    loginToCloud();
                }
            }
        );


    document
        .getElementById(
            "cloudEmail"
        )
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    loginToCloud();
                }
            }
        );
}


async function loginToCloud() {

    const email =
        document
            .getElementById(
                "cloudEmail"
            )
            .value
            .trim();

    const password =
        document
            .getElementById(
                "cloudPassword"
            )
            .value;


    const message =
        document
            .getElementById(
                "cloudLoginMessage"
            );


    if (!email || !password) {

        message.textContent =
            "Please enter your email and password.";

        return;
    }


    const button =
        document
            .getElementById(
                "cloudLoginButton"
            );


    button.disabled =
        true;

    button.textContent =
        "Signing in...";


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });


    button.disabled =
        false;

    button.textContent =
        "Sign In";


    if (error) {

        console.error(
            error
        );

        message.textContent =
            "We couldn't sign you in. Check your email and password.";

        return;
    }


    currentUser =
        data.user;

    hideLogin();

    await loadCloudData();
}


function showLogin() {

    if (
        !supabaseClient
    ) {
        return;
    }


    createLoginUI();


    document
        .getElementById(
            "cloudLoginModal"
        )
        .style.display =
        "block";
}


function hideLogin() {

    const modal =
        document.getElementById(
            "cloudLoginModal"
        );

    if (modal) {

        modal.style.display =
            "none";
    }
}


// ============================================================
// CLOUD STATUS
// ============================================================

function showCloudStatus(
    text
) {

    let status =
        document.getElementById(
            "cloudStatus"
        );


    if (!status) {

        status =
            document.createElement(
                "div"
            );

        status.id =
            "cloudStatus";


        status.style.position =
            "fixed";

        status.style.bottom =
            "14px";

        status.style.right =
            "14px";

        status.style.zIndex =
            "9998";

        status.style.background =
            "rgba(255,255,255,0.92)";

        status.style.backdropFilter =
            "blur(10px)";

        status.style.padding =
            "7px 11px";

        status.style.borderRadius =
            "20px";

        status.style.fontSize =
            "12px";

        status.style.color =
            "#86868b";

        status.style.boxShadow =
            "0 3px 15px rgba(0,0,0,0.08)";


        document.body.appendChild(
            status
        );
    }


    status.textContent =
        text;
}


// ============================================================
// CLOUD DATA
// ============================================================

function getPlannerData() {

    return {

        assignments:
            assignments,

        categories:
            categories,

        generalTodos:
            generalTodos
    };
}


async function loadCloudData() {

    if (
        !supabaseClient ||
        !currentUser ||
        isLoadingCloudData
    ) {
        return;
    }


    isLoadingCloudData =
        true;


    showCloudStatus(
        "☁️ Loading..."
    );


    try {

        const {
            data,
            error
        } =
        await supabaseClient
            .from("calendar_data")
            .select("*")
            .eq(
                "user_id",
                currentUser.id
            )
            .maybeSingle();


        if (error) {

            throw error;
        }


        if (
            data &&
            data.data
        ) {

            assignments =
                Array.isArray(
                    data.data.assignments
                )
                    ? data.data.assignments
                    : [];

            categories =
                Array.isArray(
                    data.data.categories
                )
                    ? data.data.categories
                    : DEFAULT_CATEGORIES.map(
                        category => ({
                            ...category
                        })
                    );

            generalTodos =
                Array.isArray(
                    data.data.generalTodos
                )
                    ? data.data.generalTodos
                    : [];


            saveLocalOnly();


        } else {

            // First device:
            // upload the existing local planner.

            await saveCloudData();

        }


        cloudReady =
            true;


        renderCategorySelect();

        renderCategoryFilter();

        renderTodoList();

        renderGeneralTodos();

        showCalendar();

        updateWeekSummary();


        showCloudStatus(
            "☁️ Synced"
        );


        setTimeout(
            () => {

                showCloudStatus(
                    "☁️ Synced"
                );

            },
            1500
        );


    } catch (error) {

        console.error(
            "Could not load cloud data:",
            error
        );

        showCloudStatus(
            "⚠️ Offline — using saved data"
        );

    } finally {

        isLoadingCloudData =
            false;
    }
}


function saveLocalOnly() {

    localStorage.setItem(
        ASSIGNMENT_STORAGE_KEY,
        JSON.stringify(assignments)
    );

    localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(categories)
    );

    localStorage.setItem(
        GENERAL_TODO_STORAGE_KEY,
        JSON.stringify(generalTodos)
    );
}


function scheduleCloudSync() {

    if (
        !currentUser ||
        !cloudReady ||
        isLoadingCloudData
    ) {
        return;
    }


    clearTimeout(
        cloudSyncTimer
    );


    showCloudStatus(
        "☁️ Saving..."
    );


    cloudSyncTimer =
        setTimeout(
            () => {

                saveCloudData();

            },
            500
        );
}


async function saveCloudData() {

    if (
        !supabaseClient ||
        !currentUser
    ) {
        return;
    }


    try {

        const {
            error
        } =
        await supabaseClient
            .from("calendar_data")
            .upsert(
                {
                    user_id:
                        currentUser.id,

                    data:
                        getPlannerData(),

                    updated_at:
                        new Date().toISOString()

                },
                {
                    onConflict:
                        "user_id"
                }
            );


        if (error) {

            throw error;
        }


        cloudReady =
            true;


        showCloudStatus(
            "☁️ Saved"
        );


    } catch (error) {

        console.error(
            "Cloud save failed:",
            error
        );


        showCloudStatus(
            "⚠️ Saved locally"
        );
    }
}


// ============================================================
// DATE HELPERS
// ============================================================

function getDateKey(
    year,
    month,
    day
) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}


function getTodayKey() {

    const today =
        new Date();

    return getDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
}


function getWeekStart(
    date
) {

    const result =
        new Date(date);

    const day =
        result.getDay();

    result.setDate(
        result.getDate() - day
    );

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


function getWeekEnd(
    date
) {

    const result =
        getWeekStart(date);

    result.setDate(
        result.getDate() + 6
    );

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;
}


function dateIsInCurrentWeek(
    dateString
) {

    if (!dateString) {
        return false;
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    const today =
        new Date();

    return (
        date >= getWeekStart(today) &&
        date <= getWeekEnd(today)
    );
}


function formatDate(
    dateString
) {

    if (!dateString) {
        return "No date";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


// ============================================================
// CATEGORY HELPERS
// ============================================================

function getCategoryById(
    id
) {

    return categories.find(
        category =>
            category.id === id
    );
}


function getCategoryColor(
    id
) {

    const category =
        getCategoryById(id);

    return category
        ? category.color
        : "#8e8e93";
}


function getCategoryName(
    id
) {

    const category =
        getCategoryById(id);

    return category
        ? category.name
        : "No Category";
}


// ============================================================
// CATEGORY SELECTS
// ============================================================

function renderCategorySelect() {

    categorySelect.innerHTML = "";


    const none =
        document.createElement(
            "option"
        );

    none.value =
        "";

    none.textContent =
        "⚪ No Category";

    categorySelect.appendChild(
        none
    );


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            categorySelect.appendChild(
                option
            );
        }
    );
}


function renderCategoryFilter() {

    categoryFilter.innerHTML = "";


    const all =
        document.createElement(
            "option"
        );

    all.value =
        "all";

    all.textContent =
        "All Categories";

    categoryFilter.appendChild(
        all
    );


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            categoryFilter.appendChild(
                option
            );
        }
    );


    categoryFilter.value =
        currentCategoryFilter;
}


// ============================================================
// CALENDAR
// ============================================================

function showCalendar() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"

    ];


    monthName.textContent =
        `${monthNames[month]} ${year}`;


    calendar.innerHTML =
        "";


    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement(
                "div"
            );

        emptyDay.className =
            "empty-day";

        calendar.appendChild(
            emptyDay
        );
    }


    const todayKey =
        getTodayKey();


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        const dayBox =
            document.createElement(
                "div"
            );

        dayBox.className =
            "day";

        dayBox.dataset.date =
            dateKey;


        if (
            dateKey === todayKey
        ) {

            dayBox.classList.add(
                "today"
            );
        }


        if (
            dateKey === selectedDate
        ) {

            dayBox.classList.add(
                "selected"
            );
        }


        const dayNumber =
            document.createElement(
                "div"
            );

        dayNumber.className =
            "day-number";

        dayNumber.textContent =
            day;


        dayBox.appendChild(
            dayNumber
        );


        const dayAssignments =
            assignments.filter(
                assignment => {

                    if (
                        assignment.date !==
                        dateKey
                    ) {
                        return false;
                    }


                    if (
                        currentCategoryFilter ===
                        "all"
                    ) {

                        return true;
                    }


                    return (
                        assignment.category ===
                        currentCategoryFilter
                    );

                }
            );


        dayAssignments.forEach(
            assignment => {

                const element =
                    document.createElement(
                        "div"
                    );

                element.className =
                    "assignment";


                if (
                    assignment.completed
                ) {

                    element.classList.add(
                        "completed"
                    );
                }


                if (
                    !assignment.showInTodo
                ) {

                    element.classList.add(
                        "calendar-only"
                    );
                }


                element.style.backgroundColor =
                    getCategoryColor(
                        assignment.category
                    );


                element.textContent =
                    assignment.title ||
                    assignment.text;


                element.title =
                    assignment.title ||
                    assignment.text;


                element.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openAssignmentModal(
                            assignment.id
                        );
                    }
                );


                dayBox.appendChild(
                    element
                );
            }
        );


        dayBox.addEventListener(
            "click",
            () => {

                selectedDate =
                    dateKey;

                selectedTodoId =
                    null;

                showCalendar();

                renderTodoList();
            }
        );


        calendar.appendChild(
            dayBox
        );
    }


    updateWeekSummary();
}


// ============================================================
// ASSIGNMENT MODAL
// ============================================================

function openAssignmentModal(
    assignmentId = null,
    dateOverride = null
) {

    editingAssignmentId =
        assignmentId;


    const title =
        document.getElementById(
            "assignmentModalTitle"
        );

    const titleInput =
        document.getElementById(
            "assignmentTitle"
        );

    const dateInput =
        document.getElementById(
            "assignmentDate"
        );

    const categoryInput =
        document.getElementById(
            "assignmentCategory"
        );

    const notesInput =
        document.getElementById(
            "assignmentNotes"
        );

    const showTodoInput =
        document.getElementById(
            "showInTodo"
        );


    renderAssignmentCategorySelect();


    if (assignmentId) {

        const assignment =
            assignments.find(
                item =>
                    item.id ===
                    assignmentId
            );


        if (!assignment) {
            return;
        }


        title.textContent =
            "Edit Calendar Item";

        titleInput.value =
            assignment.title ||
            assignment.text;

        dateInput.value =
            assignment.date ||
            "";

        categoryInput.value =
            assignment.category ||
            "";

        notesInput.value =
            assignment.notes ||
            "";

        showTodoInput.checked =
            assignment.showInTodo !== false;

    } else {

        title.textContent =
            "Add Calendar Item";

        titleInput.value =
            "";

        notesInput.value =
            "";

        categoryInput.value =
            "";

        showTodoInput.checked =
            true;


        dateInput.value =
            dateOverride ||
            selectedDate ||
            getTodayKey();
    }


    document
        .getElementById(
            "deleteAssignmentButton"
        )
        .style.display =
        assignmentId
            ? "block"
            : "none";


    document
        .getElementById(
            "assignmentModal"
        )
        .classList.remove(
            "hidden"
        );


    setTimeout(
        () => {

            titleInput.focus();

        },
        50
    );
}


// ============================================================
// MODAL CATEGORIES
// ============================================================

function renderAssignmentCategorySelect() {

    const select =
        document.getElementById(
            "assignmentCategory"
        );


    select.innerHTML =
        "";


    const none =
        document.createElement(
            "option"
        );

    none.value =
        "";

    none.textContent =
        "No Category";

    select.appendChild(
        none
    );


    categories.forEach(
        category => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                category.id;

            option.textContent =
                category.name;

            select.appendChild(
                option
            );
        }
    );
}


// ============================================================
// SAVE ASSIGNMENT
// ============================================================

function saveAssignmentFromModal() {

    const titleInput =
        document.getElementById(
            "assignmentTitle"
        );

    const dateInput =
        document.getElementById(
            "assignmentDate"
        );

    const categoryInput =
        document.getElementById(
            "assignmentCategory"
        );

    const notesInput =
        document.getElementById(
            "assignmentNotes"
        );

    const showTodoInput =
        document.getElementById(
            "showInTodo"
        );


    const title =
        titleInput.value.trim();


    if (!title) {

        titleInput.focus();

        return;
    }


    if (!dateInput.value) {

        dateInput.focus();

        return;
    }


    if (
        editingAssignmentId
    ) {

        const assignment =
            assignments.find(
                item =>
                    item.id ===
                    editingAssignmentId
            );


        if (!assignment) {
            return;
        }


        assignment.title =
            title;

        assignment.text =
            title;

        assignment.date =
            dateInput.value;

        assignment.category =
            categoryInput.value ||
            null;

        assignment.notes =
            notesInput.value.trim();

        assignment.showInTodo =
            showTodoInput.checked;

    } else {

        assignments.push({

            id:
                Date.now().toString(),

            title:
                title,

            text:
                title,

            date:
                dateInput.value,

            category:
                categoryInput.value ||
                null,

            notes:
                notesInput.value.trim(),

            completed:
                false,

            showInTodo:
                showTodoInput.checked

        });
    }


    selectedDate =
        dateInput.value;


    saveAssignments();


    closeAssignmentModal();

    renderTodoList();

    showCalendar();

    updateWeekSummary();
}


// ============================================================
// DELETE ASSIGNMENT
// ============================================================

function deleteAssignment(
    id
) {

    const assignment =
        assignments.find(
            item =>
                item.id === id
        );


    if (!assignment) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${assignment.title || assignment.text}"?`
        );


    if (!confirmed) {
        return;
    }


    assignments =
        assignments.filter(
            item =>
                item.id !== id
        );


    if (
        selectedTodoId === id
    ) {

        selectedTodoId =
            null;
    }


    saveAssignments();


    closeAssignmentModal();

    renderTodoList();

    showCalendar();

    updateWeekSummary();
}


// ============================================================
// CLOSE ASSIGNMENT MODAL
// ============================================================

function closeAssignmentModal() {

    document
        .getElementById(
            "assignmentModal"
        )
        .classList.add(
            "hidden"
        );

    editingAssignmentId =
        null;
}


// ============================================================
// ASSIGNMENT TODO LIST
// ============================================================

function renderTodoList() {

    todoItems.innerHTML =
        "";


    const activeAssignments =
        assignments
            .filter(
                assignment => {

                    return (
                        !assignment.completed &&
                        assignment.showInTodo !== false
                    );

                }
            )
            .sort(
                (a, b) => {

                    // Assignments with no date
                    // go to the bottom.

                    if (
                        !a.date &&
                        !b.date
                    ) {
                        return 0;
                    }

                    if (!a.date) {
                        return 1;
                    }

                    if (!b.date) {
                        return -1;
                    }

                    // Sort from earliest
                    // due date to latest.

                    return a.date.localeCompare(
                        b.date
                    );

                }
            );


    if (
        activeAssignments.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        todoItems.appendChild(
            emptyMessage
        );

        return;
    }


    emptyMessage.style.display =
        "none";


    activeAssignments.forEach(
        assignment => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "todo-item";


            if (
                selectedTodoId ===
                assignment.id
            ) {

                item.classList.add(
                    "selected-todo"
                );
            }


            const dot =
                document.createElement(
                    "div"
                );

            dot.className =
                "category-dot";


            if (
                assignment.category
            ) {

                dot.style.backgroundColor =
                    getCategoryColor(
                        assignment.category
                    );

            } else {

                dot.classList.add(
                    "no-category-dot"
                );
            }


            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";


            checkbox.addEventListener(
                "click",
                event => {

                    event.stopPropagation();
                }
            );


            checkbox.addEventListener(
                "change",
                () => {

                    assignment.completed =
                        true;

                    saveAssignments();

                    renderTodoList();

                    showCalendar();

                    updateWeekSummary();
                }
            );


            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                assignment.title ||
                assignment.text;


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-todo";

            deleteButton.textContent =
                "×";


            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    deleteAssignment(
                        assignment.id
                    );
                }
            );


            item.addEventListener(
                "click",
                () => {

                    openAssignmentModal(
                        assignment.id
                    );
                }
            );


            item.appendChild(
                dot
            );

            item.appendChild(
                checkbox
            );

            item.appendChild(
                text
            );

            item.appendChild(
                deleteButton
            );


            todoItems.appendChild(
                item
            );
        }
    );
}


// ============================================================
// ADD ASSIGNMENT FROM TODO BOX
// ============================================================

function addTodo() {

    const text =
        todoInput.value.trim();


    if (!text) {
        return;
    }


    const category =
        categorySelect.value ||
        null;


    assignments.push({

        id:
            Date.now().toString(),

        title:
            text,

        text:
            text,

        date:
            selectedDate,

        category:
            category,

        notes:
            "",

        completed:
            false,

        showInTodo:
            true

    });


    saveAssignments();


    todoInput.value =
        "";


    renderTodoList();

    showCalendar();

    updateWeekSummary();

    todoInput.focus();
}


// ============================================================
// GENERAL TODO
// ============================================================

function addGeneralTodo() {

    const text =
        generalTodoInput.value.trim();


    if (!text) {
        return;
    }


    generalTodos.push({

        id:
            Date.now().toString(),

        text:
            text,

        completed:
            false

    });


    saveGeneralTodos();


    generalTodoInput.value =
        "";


    renderGeneralTodos();

    generalTodoInput.focus();
}


function renderGeneralTodos() {

    generalTodoItems.innerHTML =
        "";


    const active =
        generalTodos.filter(
            item =>
                !item.completed
        );


    if (
        active.length === 0
    ) {

        generalEmptyMessage.style.display =
            "block";

        generalTodoItems.appendChild(
            generalEmptyMessage
        );

        return;
    }


    generalEmptyMessage.style.display =
        "none";


    active.forEach(
        todo => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "todo-item";


            const checkbox =
                document.createElement(
                    "input"
                );

            checkbox.type =
                "checkbox";


            checkbox.addEventListener(
                "click",
                event => {

                    event.stopPropagation();
                }
            );


            checkbox.addEventListener(
                "change",
                () => {

                    todo.completed =
                        true;

                    saveGeneralTodos();

                    renderGeneralTodos();
                }
            );


            const text =
                document.createElement(
                    "span"
                );

            text.textContent =
                todo.text;


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-todo";

            deleteButton.textContent =
                "×";


            deleteButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    generalTodos =
                        generalTodos.filter(
                            item =>
                                item.id !==
                                todo.id
                        );

                    saveGeneralTodos();

                    renderGeneralTodos();
                }
            );


            item.appendChild(
                checkbox
            );

            item.appendChild(
                text
            );

            item.appendChild(
                deleteButton
            );


            generalTodoItems.appendChild(
                item
            );
        }
    );
}


// ============================================================
// WEEKLY SUMMARY
// ============================================================

function updateWeekSummary() {

    const weekAssignments =
        assignments.filter(
            assignment =>
                dateIsInCurrentWeek(
                    assignment.date
                )
        );


    const tasks =
        weekAssignments.filter(
            assignment =>
                assignment.showInTodo !== false
        );


    const events =
        weekAssignments.filter(
            assignment =>
                assignment.showInTodo === false
        );


    const completed =
        tasks.filter(
            assignment =>
                assignment.completed
        );


    const total =
        tasks.length;


    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed.length /
                    total
                ) * 100
            );


    document
        .getElementById(
            "weekTotal"
        )
        .textContent =
        total;


    document
        .getElementById(
            "weekCompleted"
        )
        .textContent =
        completed.length;


    document
        .getElementById(
            "weekEvents"
        )
        .textContent =
        events.length;


    document
        .getElementById(
            "weekProgressText"
        )
        .textContent =
        `${percentage}% complete`;


    document
        .getElementById(
            "weekProgressFill"
        )
        .style.width =
        `${percentage}%`;
}


// ============================================================
// CATEGORY SETTINGS
// ============================================================

function openCategorySettings() {

    renderCategoryManager();

    document
        .getElementById(
            "categoryModal"
        )
        .classList.remove(
            "hidden"
        );
}


function closeCategorySettings() {

    document
        .getElementById(
            "categoryModal"
        )
        .classList.add(
            "hidden"
        );
}


function renderCategoryManager() {

    const list =
        document.getElementById(
            "categoryList"
        );


    list.innerHTML =
        "";


    if (
        categories.length === 0
    ) {

        list.innerHTML =
            `<div class="empty-message">No categories yet.</div>`;

        return;
    }


    categories.forEach(
        category => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "category-row";


            const color =
                document.createElement(
                    "input"
                );

            color.type =
                "color";

            color.className =
                "category-color";

            color.value =
                category.color;


            const name =
                document.createElement(
                    "input"
                );

            name.type =
                "text";

            name.className =
                "category-name-input";

            name.value =
                category.name;

            name.maxLength =
                30;


            const preview =
                document.createElement(
                    "div"
                );

            preview.className =
                "category-color-preview";

            preview.style.backgroundColor =
                category.color;


            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "delete-category";

            deleteButton.textContent =
                "×";


            color.addEventListener(
                "input",
                () => {

                    category.color =
                        color.value;

                    preview.style.backgroundColor =
                        color.value;

                    saveCategories();

                    renderCategorySelect();

                    renderCategoryFilter();

                    showCalendar();

                    renderTodoList();
                }
            );


            name.addEventListener(
                "change",
                () => {

                    const value =
                        name.value.trim();


                    if (!value) {

                        name.value =
                            category.name;

                        return;
                    }


                    category.name =
                        value;


                    saveCategories();

                    renderCategorySelect();

                    renderCategoryFilter();

                    showCalendar();

                    renderTodoList();
                }
            );


            deleteButton.addEventListener(
                "click",
                () => {

                    const confirmed =
                        confirm(
                            `Delete "${category.name}"? Assignments using it will become No Category.`
                        );


                    if (!confirmed) {
                        return;
                    }


                    assignments.forEach(
                        assignment => {

                            if (
                                assignment.category ===
                                category.id
                            ) {

                                assignment.category =
                                    null;
                            }
                        }
                    );


                    categories =
                        categories.filter(
                            item =>
                                item.id !==
                                category.id
                        );


                    saveCategories();

                    saveAssignments();

                    renderCategoryManager();

                    renderCategorySelect();

                    renderCategoryFilter();

                    renderTodoList();

                    showCalendar();
                }
            );


            row.appendChild(
                color
            );

            row.appendChild(
                name
            );

            row.appendChild(
                preview
            );

            row.appendChild(
                deleteButton
            );

            list.appendChild(
                row
            );
        }
    );
}


function addCategory() {

    const input =
        document.getElementById(
            "newCategoryName"
        );

    const color =
        document.getElementById(
            "newCategoryColor"
        );


    const name =
        input.value.trim();


    if (!name) {

        input.focus();

        return;
    }


    categories.push({

        id:
            `category-${Date.now()}`,

        name:
            name,

        color:
            color.value

    });


    saveCategories();


    input.value =
        "";

    color.value =
        "#007aff";


    renderCategoryManager();

    renderCategorySelect();

    renderCategoryFilter();

    renderTodoList();

    showCalendar();

    input.focus();
}


// ============================================================
// SEARCH
// ============================================================

function openSearch() {

    document
        .getElementById(
            "searchModal"
        )
        .classList.remove(
            "hidden"
        );


    const input =
        document.getElementById(
            "searchInput"
        );


    input.value =
        "";


    renderSearchResults("");


    setTimeout(
        () => input.focus(),
        50
    );
}


function closeSearch() {

    document
        .getElementById(
            "searchModal"
        )
        .classList.add(
            "hidden"
        );
}


function renderSearchResults(
    query
) {

    const results =
        document.getElementById(
            "searchResults"
        );


    results.innerHTML =
        "";


    const cleanQuery =
        query.trim().toLowerCase();


    if (!cleanQuery) {

        results.innerHTML =
            `<div class="empty-message">Start typing to search.</div>`;

        return;
    }


    const matches =
        assignments.filter(
            assignment => {

                const title =
                    (
                        assignment.title ||
                        assignment.text ||
                        ""
                    ).toLowerCase();


                const notes =
                    (
                        assignment.notes ||
                        ""
                    ).toLowerCase();


                const category =
                    getCategoryName(
                        assignment.category
                    ).toLowerCase();


                return (
                    title.includes(cleanQuery) ||
                    notes.includes(cleanQuery) ||
                    category.includes(cleanQuery)
                );
            }
        );


    if (
        matches.length === 0
    ) {

        results.innerHTML =
            `<div class="empty-message">No results found.</div>`;

        return;
    }


    matches.forEach(
        assignment => {

            const result =
                document.createElement(
                    "div"
                );

            result.className =
                "search-result";


            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "search-result-title";

            title.textContent =
                assignment.title ||
                assignment.text;


            const meta =
                document.createElement(
                    "div"
                );

            meta.className =
                "search-result-meta";


            meta.textContent =
                `${formatDate(assignment.date)} • ${getCategoryName(assignment.category)}${assignment.showInTodo === false ? " • Calendar Only" : ""}`;


            result.appendChild(
                title
            );

            result.appendChild(
                meta
            );


            result.addEventListener(
                "click",
                () => {

                    if (
                        assignment.date
                    ) {

                        const date =
                            new Date(
                                `${assignment.date}T00:00:00`
                            );

                        currentDate =
                            new Date(date);

                        selectedDate =
                            assignment.date;
                    }


                    closeSearch();

                    showCalendar();

                    openAssignmentModal(
                        assignment.id
                    );
                }
            );


            results.appendChild(
                result
            );
        }
    );
}


// ============================================================
// EXPORT / BACKUP
// ============================================================

function exportPlanner() {

    const backup = {

        version:
            2,

        exportedAt:
            new Date().toISOString(),

        assignments:
            assignments,

        categories:
            categories,

        generalTodos:
            generalTodos

    };


    const blob =
        new Blob(
            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "my-assignment-calendar-backup.json";


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );
}


// ============================================================
// IMPORT / RESTORE
// ============================================================

function importPlanner(
    file
) {

    const reader =
        new FileReader();


    reader.onload =
        async event => {

            try {

                const backup =
                    JSON.parse(
                        event.target.result
                    );


                if (
                    !backup ||
                    !Array.isArray(
                        backup.assignments
                    )
                ) {

                    throw new Error(
                        "Invalid backup"
                    );
                }


                const confirmed =
                    confirm(
                        "Restore this backup? Your current planner data will be replaced."
                    );


                if (!confirmed) {
                    return;
                }


                assignments =
                    backup.assignments;


                if (
                    Array.isArray(
                        backup.categories
                    )
                ) {

                    categories =
                        backup.categories;
                }


                if (
                    Array.isArray(
                        backup.generalTodos
                    )
                ) {

                    generalTodos =
                        backup.generalTodos;
                }


                saveLocalOnly();


                selectedDate =
                    null;

                selectedTodoId =
                    null;


                renderCategorySelect();

                renderCategoryFilter();

                renderTodoList();

                renderGeneralTodos();

                showCalendar();

                updateWeekSummary();


                if (
                    currentUser
                ) {

                    await saveCloudData();
                }


                alert(
                    "Your planner has been restored!"
                );


            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "That file doesn't appear to be a valid planner backup."
                );
            }
        };


    reader.readAsText(file);
}


// ============================================================
// TODAY
// ============================================================

function goToToday() {

    const today =
        new Date();


    currentDate =
        new Date(today);


    selectedDate =
        getTodayKey();


    selectedTodoId =
        null;


    showCalendar();

    renderTodoList();
}


// ============================================================
// EVENT LISTENERS
// ============================================================

document
    .getElementById("addTodo")
    .addEventListener(
        "click",
        addTodo
    );


todoInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addTodo();
        }
    }
);


// General todo

document
    .getElementById("addGeneralTodo")
    .addEventListener(
        "click",
        addGeneralTodo
    );


generalTodoInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            addGeneralTodo();
        }
    }
);


// Previous month

document
    .getElementById("previousMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );

            selectedDate =
                null;

            selectedTodoId =
                null;

            showCalendar();

            renderTodoList();
        }
    );


// Next month

document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );

            selectedDate =
                null;

            selectedTodoId =
                null;

            showCalendar();

            renderTodoList();
        }
    );


// Today

document
    .getElementById("todayButton")
    .addEventListener(
        "click",
        goToToday
    );


// Add calendar item

document
    .getElementById("addCalendarItem")
    .addEventListener(
        "click",
        () => {

            openAssignmentModal(
                null,
                selectedDate ||
                getTodayKey()
            );
        }
    );


// Save assignment modal

document
    .getElementById("saveAssignmentButton")
    .addEventListener(
        "click",
        saveAssignmentFromModal
    );


// Cancel assignment modal

document
    .getElementById("cancelAssignmentModal")
    .addEventListener(
        "click",
        closeAssignmentModal
    );


// Close assignment modal

document
    .getElementById("closeAssignmentModal")
    .addEventListener(
        "click",
        closeAssignmentModal
    );


// Delete assignment

document
    .getElementById("deleteAssignmentButton")
    .addEventListener(
        "click",
        () => {

            if (
                editingAssignmentId
            ) {

                deleteAssignment(
                    editingAssignmentId
                );
            }
        }
    );


// Enter in title saves

document
    .getElementById("assignmentTitle")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                saveAssignmentFromModal();
            }
        }
    );


// Category settings

document
    .getElementById("categorySettingsButton")
    .addEventListener(
        "click",
        openCategorySettings
    );


document
    .getElementById("closeCategoryModal")
    .addEventListener(
        "click",
        closeCategorySettings
    );


document
    .getElementById("doneCategorySettings")
    .addEventListener(
        "click",
        closeCategorySettings
    );


document
    .getElementById("addCategory")
    .addEventListener(
        "click",
        addCategory
    );


document
    .getElementById("newCategoryName")
    .addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                addCategory();
            }
        }
    );


// Category filter

categoryFilter.addEventListener(
    "change",
    () => {

        currentCategoryFilter =
            categoryFilter.value;

        showCalendar();
    }
);


// Search

document
    .getElementById("searchButton")
    .addEventListener(
        "click",
        openSearch
    );


document
    .getElementById("closeSearchModal")
    .addEventListener(
        "click",
        closeSearch
    );


document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        event => {

            renderSearchResults(
                event.target.value
            );
        }
    );


// Export

document
    .getElementById("exportButton")
    .addEventListener(
        "click",
        exportPlanner
    );


// Import

document
    .getElementById("importButton")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "importFile"
                )
                .click();
        }
    );


document
    .getElementById("importFile")
    .addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (file) {

                importPlanner(
                    file
                );
            }

            event.target.value =
                "";
        }
    );


// ============================================================
// CLICK OUTSIDE MODALS
// ============================================================

document
    .getElementById("assignmentModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "assignmentModal"
            ) {

                closeAssignmentModal();
            }
        }
    );


document
    .getElementById("categoryModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "categoryModal"
            ) {

                closeCategorySettings();
            }
        }
    );


document
    .getElementById("searchModal")
    .addEventListener(
        "click",
        event => {

            if (
                event.target.id ===
                "searchModal"
            ) {

                closeSearch();
            }
        }
    );


// ============================================================
// ESCAPE KEY
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !==
            "Escape"
        ) {
            return;
        }


        closeAssignmentModal();

        closeCategorySettings();

        closeSearch();
    }
);


// ============================================================
// START
// ============================================================

renderCategorySelect();

renderCategoryFilter();

renderTodoList();

renderGeneralTodos();

showCalendar();

updateWeekSummary();


// Start Supabase after the
// existing planner has rendered.

initializeCloud();
