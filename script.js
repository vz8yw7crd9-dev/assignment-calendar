/* =========================================================
   MY ASSIGNMENT CALENDAR
   Complete replacement script
   ========================================================= */


/* =========================================================
   STORAGE
   IMPORTANT:
   This is the SAME key used by your original version.
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
   STATE
   ========================================================= */

let state = {
    assignments: [],
    todos: [],
    categories: []
};


/* =========================================================
   CALENDAR STATE
   ========================================================= */

let currentMonth = new Date();

currentMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
);

let selectedDate = null;
let editingAssignmentId = null;


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

    state = {
        assignments: [],
        todos: [],
        categories: []
    };

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {

            state.categories =
                cloneDefaultCategories();

            return;
        }

        const parsed =
            JSON.parse(saved);


        if (!parsed || typeof parsed !== "object") {

            state.categories =
                cloneDefaultCategories();

            return;
        }


        /*
         * Preserve existing assignments.
         */

        if (Array.isArray(parsed.assignments)) {

            state.assignments =
                parsed.assignments;

        }


        /*
         * Preserve existing general todos.
         */

        if (Array.isArray(parsed.todos)) {

            state.todos =
                parsed.todos;

        }


        /*
         * Preserve existing categories.
         */

        if (
            Array.isArray(parsed.categories) &&
            parsed.categories.length > 0
        ) {

            state.categories =
                parsed.categories;

        } else {

            state.categories =
                cloneDefaultCategories();

        }


        /*
         * Make sure every category is valid.
         */

        state.categories =
            state.categories.filter(category => {

                return (
                    category &&
                    typeof category === "object" &&
                    category.id &&
                    category.name &&
                    category.color
                );

            });


        /*
         * If somehow categories became empty,
         * restore defaults.
         */

        if (!state.categories.length) {

            state.categories =
                cloneDefaultCategories();

        }


        /*
         * Repair assignments whose category
         * was deleted or missing.
         */

        const fallbackCategory =
            state.categories[0];

        state.assignments.forEach(item => {

            if (!item.categoryId) {

                item.categoryId =
                    fallbackCategory.id;

            }

            const categoryExists =
                state.categories.some(
                    category =>
                        category.id === item.categoryId
                );

            if (!categoryExists) {

                item.categoryId =
                    fallbackCategory.id;

            }

            if (typeof item.completed !== "boolean") {

                item.completed = false;

            }

            if (typeof item.showInTodo !== "boolean") {

                item.showInTodo = true;

            }

        });

    } catch (error) {

        console.error(
            "Could not load saved calendar data:",
            error
        );

        /*
         * Do NOT overwrite storage here.
         * This is important because a bad load
         * should not destroy existing data.
         */

        state.categories =
            cloneDefaultCategories();

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
   DEFAULT CATEGORY COPY
   ========================================================= */

function cloneDefaultCategories() {

    return DEFAULT_CATEGORIES.map(category => ({
        ...category
    }));

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

            openAssignmentModal(
                null,
                selectedDate || formatDate(new Date())
            );

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

                    modal.classList.add("hidden");

                });

            editingAssignmentId = null;

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

    renderAssignmentTodoList();

    renderGeneralTodos();

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


    /*
     * Always normalize currentMonth
     * to the first day of its month.
     */

    currentMonth =
        new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            1
        );


    calendar.innerHTML = "";


    /*
     * MONTH TITLE
     */

    monthName.textContent =
        currentMonth.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    /*
     * CALENDAR MATH
     */

    const year =
        currentMonth.getFullYear();

    const month =
        currentMonth.getMonth();


    /*
     * Sunday = 0
     * Monday = 1
     * ...
     */

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


    /*
     * CATEGORY FILTER
     */

    const filter =
        document.getElementById(
            "categoryFilter"
        ).value;


    /*
     * EMPTY CELLS BEFORE THE FIRST DAY
     */

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


    /*
     * ACTUAL DAYS
     */

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


        /*
         * TODAY
         */

        if (
            dateString ===
            formatDate(new Date())
        ) {

            day.classList.add("today");

        }


        /*
         * SELECTED
         */

        if (
            selectedDate ===
            dateString
        ) {

            day.classList.add("selected");

        }


        /*
         * NUMBER
         */

        const number =
            document.createElement("div");

        number.className =
            "day-number";

        number.textContent =
            dayNumber;

        day.appendChild(number);


        /*
         * DAY CLICK
         */

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


        /*
         * ASSIGNMENTS FOR THIS DATE
         */

        const dayAssignments =
            state.assignments
                .filter(item => {

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

                })
                .sort((a, b) => {

                    return (
                        Number(a.completed) -
                        Number(b.completed)
                    );

                });


        /*
         * DRAW ASSIGNMENTS
         */

        dayAssignments.forEach(item => {

            const assignment =
                createCalendarAssignment(
                    item
                );

            day.appendChild(
                assignment
            );

        });


        calendar.appendChild(day);

    }


    /*
     * EMPTY CELLS AFTER THE LAST DAY
     *
     * This keeps the final row aligned.
     */

    const totalCells =
        firstDay + daysInMonth;

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


    if (item.showInTodo === false) {

        element.classList.add(
            "calendar-only"
        );

    }


    const category =
        getCategory(
            item.categoryId
        );


    element.style.background =
        category
            ? category.color
            : "#8e8e93";


    element.textContent =
        item.title || "Untitled";


    element.title =
        item.title || "Untitled";


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

    editingAssignmentId = id;


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


    /*
     * EDIT
     */

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


    /*
     * NEW
     */

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


        todoCheckbox.checked = true;


        deleteButton.style.display =
            "none";

    }


    modal.classList.remove(
        "hidden"
    );


    setTimeout(() => {

        titleInput.focus();

    }, 50);

}


/* =========================================================
   CLOSE ASSIGNMENT MODAL
   ========================================================= */

function closeAssignmentModal() {

    document
        .getElementById(
            "assignmentModal"
        )
        .classList.add("hidden");


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


    /*
     * EDIT EXISTING
     */

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
            categoryId ||
            state.categories[0]?.id ||
            "";

        item.notes =
            notes;

        item.showInTodo =
            showInTodo;

    }


    /*
     * CREATE NEW
     */

    else {

        state.assignments.push({

            id:
                createId(
                    "assignment"
                ),

            title:
                title,

            date:
                date,

            categoryId:
                categoryId ||
                state.categories[0]?.id ||
                "",

            notes:
                notes,

            showInTodo:
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

        title:
            title,

        date:
            selectedDate ||
            formatDate(new Date()),

        categoryId:
            categoryId ||
            state.categories[0]?.id ||
            "",

        notes:
            "",

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


    visible.sort((a, b) => {

        if (
            a.completed !==
            b.completed
        ) {

            return (
                Number(a.completed) -
                Number(b.completed)
            );

        }

        return (
            String(a.date || "")
                .localeCompare(
                    String(b.date || "")
                )
        );

    });


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

        title:
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
   RENDER GENERAL TODO
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
            (a, b) => {

                return (
                    Number(a.completed) -
                    Number(b.completed)
                );

            }
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


    const oldAssignmentValue =
        assignmentSelect.value;


    const oldTodoValue =
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
                oldAssignmentValue
        )
    ) {

        assignmentSelect.value =
            oldAssignmentValue;

    }


    if (
        state.categories.some(
            category =>
                category.id ===
                oldTodoValue
        )
    ) {

        todoSelect.value =
            oldTodoValue;

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


    const oldValue =
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
        oldValue === "all" ||
        state.categories.some(
            category =>
                category.id === oldValue
        )
    ) {

        select.value =
            oldValue || "all";

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
   RENDER CATEGORY LIST
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

                    renderCategoryList();

                    renderCalendar();

                    renderAssignmentTodoList();

                }
            );


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

                        nameInput.value =
                            category.name;

                        return;

                    }


                    category.name =
                        newName;

                    saveState();

                    renderCategoryList();

                    renderCategorySelects();

                    renderCategoryFilter();

                    renderCalendar();

                }
            );


            const preview =
                document.createElement(
                    "div"
                );

            preview.className =
                "category-color-preview";

            preview.style.background =
                category.color;


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


    /*
     * Prevent duplicate names.
     */

    const duplicate =
        state.categories.some(
            category =>
                category.name
                    .toLowerCase() ===
                name.toLowerCase()
        );


    if (duplicate) {

        alert(
            "A category with that name already exists."
        );

        return;

    }


    state.categories.push({

        id:
            createId("category"),

        name:
            name,

        color:
            colorInput.value

    });


    nameInput.value = "";

    colorInput.value =
        "#007aff";


    saveState();

    renderAll();

    renderCategoryList();

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
            `Delete the "${category.name}" category? Assignments using it will be moved to the first remaining category.`
        )
    ) {

        return;

    }


    const remaining =
        state.categories.filter(
            item =>
                item.id !== id
        );


    const replacement =
        remaining[0];


    state.assignments.forEach(
        item => {

            if (
                item.categoryId === id
            ) {

                item.categoryId =
                    replacement.id;

            }

        }
    );


    state.categories =
        remaining;


    saveState();

    renderAll();

    renderCategoryList();

}


/* =========================================================
   SEARCH
   ========================================================= */

function openSearchModal() {

    const modal =
        document.getElementById(
            "searchModal"
        );


    const input =
        document.getElementById(
            "searchInput"
        );


    modal.classList.remove(
        "hidden"
    );


    input.value = "";


    performSearch();


    setTimeout(() => {

        input.focus();

    }, 50);

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
                    String(
                        item.title || ""
                    ).toLowerCase();


                const notes =
                    String(
                        item.notes || ""
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


    matches
        .sort(
            (a, b) =>
                String(a.date || "")
                    .localeCompare(
                        String(b.date || "")
                    )
        )
        .forEach(item => {

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

        });

}


/* =========================================================
   JUMP TO ASSIGNMENT
   ========================================================= */

function jumpToAssignment(item) {

    if (!item || !item.date) {
        return;
    }


    const parts =
        item.date.split("-");


    if (parts.length !== 3) {
        return;
    }


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


    setTimeout(() => {

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

    }, 50);

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


    /*
     * Sunday is the start of the week.
     */

    const start =
        new Date(today);


    start.setDate(
        today.getDate() -
        today.getDay()
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


            if (
                !confirm(
                    "Restore this backup? Your current calendar data will be replaced."
                )
            ) {

                return;

            }


            /*
             * Restore exactly what was backed up.
             */

            state = {

                assignments:
                    imported.assignments,

                todos:
                    imported.todos,

                categories:
                    imported.categories.length
                        ? imported.categories
                        : cloneDefaultCategories()

            };


            saveState();

            renderAll();


            alert(
                "Backup restored successfully!"
            );


        } catch (error) {

            console.error(
                "Restore failed:",
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


    return (
        `${year}-${month}-${day}`
    );

}


/* =========================================================
   DISPLAY DATE
   ========================================================= */

function formatDisplayDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }


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
