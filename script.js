// ============================================================
// MY ASSIGNMENT CALENDAR
// ============================================================


// ============================================================
// STORAGE
// ============================================================

const ASSIGNMENT_STORAGE_KEY =
    "assignmentCalendarData";

const CATEGORY_STORAGE_KEY =
    "assignmentCalendarCategories";

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
// STORAGE FUNCTIONS
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


function getWeekStart(date) {

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


function getWeekEnd(date) {

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
        document.createElement("option");

    none.value = "";

    none.textContent =
        "⚪ No Category";

    categorySelect.appendChild(none);

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category.id;

        option.textContent =
            category.name;

        categorySelect.appendChild(option);
    });
}


function renderCategoryFilter() {

    categoryFilter.innerHTML = "";

    const all =
        document.createElement("option");

    all.value = "all";

    all.textContent =
        "All Categories";

    categoryFilter.appendChild(all);

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category.id;

        option.textContent =
            category.name;

        categoryFilter.appendChild(option);
    });

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

    calendar.innerHTML = "";

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

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
            document.createElement("div");

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
            document.createElement("div");

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
                    document.createElement("div");

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
// OPEN ASSIGNMENT MODAL
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
// RENDER MODAL CATEGORIES
// ============================================================

function renderAssignmentCategorySelect() {

    const select =
        document.getElementById(
            "assignmentCategory"
        );

    select.innerHTML = "";


    const none =
        document.createElement("option");

    none.value = "";

    none.textContent =
        "No Category";

    select.appendChild(
        none
    );


    categories.forEach(
        category => {

            const option =
                document.createElement("option");

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

    todoItems.innerHTML = "";


    const activeAssignments =
        assignments.filter(
            assignment => {

                return (
                    !assignment.completed &&
                    assignment.showInTodo !== false
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
                document.createElement("div");

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
                document.createElement("div");

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
                document.createElement("input");

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
                document.createElement("span");

            text.textContent =
                assignment.title ||
                assignment.text;


            const deleteButton =
                document.createElement("button");

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


            item.appendChild(dot);

            item.appendChild(checkbox);

            item.appendChild(text);

            item.appendChild(deleteButton);

            todoItems.appendChild(item);
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

    generalTodoItems.innerHTML = "";


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
                document.createElement("div");

            item.className =
                "todo-item";


            const checkbox =
                document.createElement("input");

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
                document.createElement("span");

            text.textContent =
                todo.text;


            const deleteButton =
                document.createElement("button");

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


    list.innerHTML = "";


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
                document.createElement("div");

            row.className =
                "category-row";


            const color =
                document.createElement("input");

            color.type =
                "color";

            color.className =
                "category-color";

            color.value =
                category.color;


            const name =
                document.createElement("input");

            name.type =
                "text";

            name.className =
                "category-name-input";

            name.value =
                category.name;

            name.maxLength =
                30;


            const preview =
                document.createElement("div");

            preview.className =
                "category-color-preview";

            preview.style.backgroundColor =
                category.color;


            const deleteButton =
                document.createElement("button");

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


            row.appendChild(color);

            row.appendChild(name);

            row.appendChild(preview);

            row.appendChild(deleteButton);

            list.appendChild(row);
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


    results.innerHTML = "";


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
                document.createElement("div");

            result.className =
                "search-result";


            const title =
                document.createElement("div");

            title.className =
                "search-result-title";

            title.textContent =
                assignment.title ||
                assignment.text;


            const meta =
                document.createElement("div");

            meta.className =
                "search-result-meta";

            meta.textContent =
                `${formatDate(assignment.date)} • ${getCategoryName(assignment.category)}${assignment.showInTodo === false ? " • Calendar Only" : ""}`;


            result.appendChild(title);

            result.appendChild(meta);


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

        version: 2,

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
        event => {

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


                saveAssignments();

                saveCategories();

                saveGeneralTodos();


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


                alert(
                    "Your planner has been restored!"
                );

            } catch (error) {

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


// Add assignment from right-side list

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
                .getElementById("importFile")
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

                importPlanner(file);
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
