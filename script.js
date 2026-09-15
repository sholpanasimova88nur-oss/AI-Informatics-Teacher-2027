// ==========================================
// 🤖 AI INFORMATICS TEACHER
// НЕГІЗГІ JAVASCRIPT ФАЙЛЫ
// ТАЗА НҰСҚА
// ==========================================


// ==========================================
// HTML ЭЛЕМЕНТТЕРІ
// ==========================================

const promptInput = document.getElementById("prompt");
const imageInput = document.getElementById("imageInput");
const selectedFile = document.getElementById("selectedFile");
const messages = document.getElementById("messages");


// ==========================================
// 📂 БӨЛІМ АУЫСТЫРУ
// ==========================================

function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }
}


// ==========================================
// 🖼️ СУРЕТ ТАҢДАЛҒАНЫН КӨРСЕТУ
// ==========================================

function showSelectedFile() {

    if (!imageInput || !selectedFile) {
        return;
    }

    if (imageInput.files.length > 0) {

        selectedFile.textContent =
            "📷 Таңдалған сурет: " +
            imageInput.files[0].name;

    } else {

        selectedFile.textContent = "";

    }
}


// ==========================================
// 🔐 HTML ҚАУІПСІЗДІГІ
// ==========================================

function escapeHtml(text) {

    if (text === null || text === undefined) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// 📝 AI ЖАУАБЫН ФОРМАТТАУ
// ==========================================

function formatAnswer(text) {

    if (!text) {
        return "";
    }

    return escapeHtml(text);
}


// ==========================================
// 🤖 НЕГІЗГІ AI ФУНКЦИЯСЫ
// ==========================================

async function sendQuestion() {

    if (!promptInput) {
        alert("prompt элементі табылмады.");
        return;
    }

    const text = promptInput.value.trim();

    let image = null;

    if (
        imageInput &&
        imageInput.files.length > 0
    ) {
        image = imageInput.files[0];
    }

    const classSelect =
        document.getElementById("classLevel");

    const classLevel =
        classSelect ? classSelect.value : "5";


    if (!text && !image) {

        alert(
            "Сұрақ жазыңыз немесе сурет таңдаңыз."
        );

        return;
    }


    // ======================================
    // 👤 ОҚУШЫ СҰРАҒЫН КӨРСЕТУ
    // ======================================

    if (messages) {

        if (text) {

            messages.innerHTML += `
                <div class="teacher-card">
                    👤 <b>Сіз:</b>
                    <p>${escapeHtml(text)}</p>
                </div>
            `;

        }

        if (image) {

            messages.innerHTML += `
                <div class="teacher-card">
                    👤 📷 <b>Сурет жіберілді</b>
                </div>
            `;

        }

        messages.innerHTML += `
            <div
                id="loadingMessage"
                class="teacher-card"
            >
                🤖 <b>AI Informatics Teacher:</b>
                <p>⏳ Жауап дайындап жатырмын...</p>
            </div>
        `;
    }


    // ======================================
    // 🎓 СЫНЫПҚА БЕЙІМДЕУ
    // ======================================

    const levelInstruction = {

        "5":
            "5-сынып оқушысына өте қарапайым тілмен түсіндір. Күнделікті өмірден мысал келтір.",

        "6":
            "6-сынып оқушысына түсінікті тілмен, қарапайым мысалдармен түсіндір.",

        "7":
            "7-сынып оқушысына кезең-кезеңімен және мысалмен түсіндір.",

        "8":
            "8-сынып деңгейінде алгоритм мен Python-ды қадамдап түсіндір.",

        "9":
            "9-сынып деңгейінде тереңірек түсіндіріп, Python, массивтер және алгоритмдерді талда.",

        "10":
            "10-сынып деңгейінде алгоритмдік және Python шешімдерін түсіндір.",

        "11":
            "11-сынып деңгейінде күрделі программалау және ҰБТ тапсырмаларына сай талда."

    };


    const instruction =
        levelInstruction[classLevel] ||
        levelInstruction["5"];


    // ======================================
    // 🧠 AI ПРОМПТЫ
    // ======================================

    const finalPrompt = `

Сен "AI Informatics Teacher" атты жеке
ЖИ информатика мұғалімісің.

Оқушының сыныбы:
${classLevel}-сынып.

${instruction}

Негізгі бағыттар:

- информатика
- Python
- программалау
- алгоритмдер
- массивтер
- циклдер
- шарттар
- функциялар
- теория
- ҰБТ
- программалау есептері
- кодтағы қателер

Егер оқушы Python кодын жіберсе:

1. Қате қай жерде екенін көрсет.
2. Қатенің себебін түсіндір.
3. Қалай түзету керегін түсіндір.
4. Дұрыс кодты көрсет.
5. Маңызды жолдарын түсіндір.
6. Ұқсас шағын тапсырма бер.

Егер код дұрыс болса:
- дұрыс екенін айт;
- қалай жұмыс істейтінін түсіндір;
- қажет болса жақсарту жолын көрсет.

Егер сурет жіберілсе:
- суреттегі тапсырманы оқы;
- шартын анықта;
- шешу жолын түсіндір;
- қажет болса Python кодын көрсет.

Қазақша сұраққа қазақша жауап бер.
Орысша сұраққа орысша жауап бер.

Оқушының сұрағы:

${text}

`;


    // ======================================
    // 📤 FORM DATA
    // ======================================

    const formData = new FormData();

    formData.append(
        "prompt",
        finalPrompt
    );

    if (image) {

        formData.append(
            "image",
            image
        );

    }


    // ======================================
    // 🌐 СЕРВЕРГЕ ЖІБЕРУ
    // ======================================

    try {

        const response =
            await fetch(
                "/api/ask",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        const loading =
            document.getElementById(
                "loadingMessage"
            );


        if (loading) {
            loading.remove();
        }


        if (!response.ok) {

            if (messages) {

                messages.innerHTML += `
                    <div class="teacher-card">

                        ❌ <b>Қате:</b>

                        <p>
                            ${escapeHtml(
                                data.error ||
                                "Белгісіз сервер қатесі"
                            )}
                        </p>

                    </div>
                `;

            }

            return;
        }


        // ==================================
        // 🤖 AI ЖАУАБЫ
        // ==================================

        if (messages) {

            messages.innerHTML += `
                <div class="teacher-card">

                    🤖 <b>
                        AI Informatics Teacher:
                    </b>

                    <div
                        style="
                            white-space: pre-wrap;
                            margin-top: 10px;
                        "
                    >
                        ${formatAnswer(
                            data.answer
                        )}
                    </div>

                </div>
            `;

            messages.scrollTop =
                messages.scrollHeight;

        }


        // ==================================
        // 🧹 ТАЗАЛАУ
        // ==================================

        promptInput.value = "";

        if (imageInput) {
            imageInput.value = "";
        }

        if (selectedFile) {
            selectedFile.textContent = "";
        }


    } catch (error) {

        console.error(
            "AI ERROR:",
            error
        );


        const loading =
            document.getElementById(
                "loadingMessage"
            );

        if (loading) {
            loading.remove();
        }


        if (messages) {

            messages.innerHTML += `
                <div class="teacher-card">

                    ❌ <b>Сервер қатесі</b>

                    <p>
                        AI серверімен байланыс орнатылмады.
                    </p>

                    <p>
                        CMD терезесінде
                        <b>node server.js</b>
                        жұмыс істеп тұрғанын тексеріңіз.
                    </p>

                </div>
            `;

        }

    }

}


// ==========================================
// 🐍 PYTHON КОДЫН ТАЛДАУ
// ==========================================

function analyzePython() {

    const pythonCode =
        document.getElementById(
            "pythonCode"
        );

    if (!pythonCode) {
        return;
    }


    const code =
        pythonCode.value.trim();


    if (!code) {

        alert(
            "Python кодын жазыңыз."
        );

        return;
    }


    showSection("ai");


    promptInput.value = `

Мына Python кодын талдап бер.

1. Кодтың мақсатын түсіндір.
2. Қате болса, қатені көрсет.
3. Қатенің себебін түсіндір.
4. Дұрыс нұсқасын көрсет.
5. Кодтың жұмыс істеу принципін түсіндір.
6. Әр маңызды жолын түсіндір.
7. Соңында ұқсас шағын тапсырма бер.

Python коды:

${code}

`;


    sendQuestion();

}


// ==========================================
// 📚 ТЕОРИЯ
// ==========================================

function askTheory(topic) {

    showSection("ai");


    promptInput.value = `

"${topic}" тақырыбын түсіндір.

Мыналарды қамты:

1. Анықтамасы.
2. Негізгі ережесі.
3. Қарапайым мысалы.
4. Python мысалы болса көрсет.
5. Оқушыға шағын тапсырма бер.

`;


    sendQuestion();

}


// ==========================================
// 📝 ТЕСТ СҰРАҚТАРЫ
// ==========================================

const questions = [

    {
        question:
            "Python тілінде экранға ақпарат шығару үшін қай команда қолданылады?",
        options: [
            "input()",
            "print()",
            "write()",
            "output()"
        ],
        answer: 1
    },

    {
        question:
            "Python тілінде шарт тексеру үшін қандай оператор қолданылады?",
        options: [
            "if",
            "for",
            "while",
            "def"
        ],
        answer: 0
    },

    {
        question:
            "Массивтің негізгі қызметі қандай?",
        options: [
            "Сурет салу",
            "Бірнеше мәліметті сақтау",
            "Компьютерді өшіру",
            "Файлды жою"
        ],
        answer: 1
    },

    {
        question:
            "Python тілінде цикл ұйымдастыру үшін қай оператор қолданылады?",
        options: [
            "if",
            "for",
            "print",
            "input"
        ],
        answer: 1
    },

    {
        question:
            "input() функциясы не үшін қолданылады?",
        options: [
            "Мәлімет енгізу үшін",
            "Мәлімет шығару үшін",
            "Цикл құру үшін",
            "Файлды өшіру үшін"
        ],
        answer: 0
    },

    {
        question:
            "Python тілінде функция қалай анықталады?",
        options: [
            "function",
            "func",
            "def",
            "define"
        ],
        answer: 2
    },

    {
        question:
            "Алгоритм дегеніміз не?",
        options: [
            "Компьютердің атауы",
            "Есепті шешуге арналған әрекеттер реті",
            "Файлдың түрі",
            "Бағдарламаның түсі"
        ],
        answer: 1
    },

    {
        question:
            "Python тілінде теңдік салыстыру үшін қай оператор қолданылады?",
        options: [
            "=",
            "==",
            "!=",
            ">="
        ],
        answer: 1
    },

    {
        question:
            "while циклі қашан орындалады?",
        options: [
            "Шарт ақиқат болған кезде",
            "Тек бір рет",
            "Ешқашан",
            "Тек программа соңында"
        ],
        answer: 0
    },

    {
        question:
            "Python файлдарының кеңейтімі қандай?",
        options: [
            ".html",
            ".css",
            ".py",
            ".java"
        ],
        answer: 2
    }

];


// ==========================================
// 📝 ТЕСТІ ШЫҒАРУ
// ==========================================

function loadQuiz() {

    const quiz =
        document.getElementById("quiz");

    if (!quiz) {
        return;
    }


    quiz.innerHTML = "";


    questions.forEach(
        (item, index) => {

            let html = `

                <div class="quiz-question">

                    <h3>
                        ${index + 1}.
                        ${escapeHtml(item.question)}
                    </h3>

            `;


            item.options.forEach(
                (option, optionIndex) => {

                    html += `

                        <label>

                            <input
                                type="radio"
                                name="question${index}"
                                value="${optionIndex}"
                            >

                            ${escapeHtml(option)}

                        </label>

                        <br>

                    `;

                }
            );


            html += `
                </div>
            `;


            quiz.innerHTML += html;

        }
    );

}


// ==========================================
// ⏱️ ТАЙМЕР
// ==========================================

let timeLeft = 60;
let timerInterval = null;


function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 60;

    updateTimer();


    timerInterval =
        setInterval(
            () => {

                timeLeft--;

                updateTimer();


                if (timeLeft <= 0) {

                    clearInterval(
                        timerInterval
                    );


                    alert(
                        "⏰ Уақыт аяқталды!"
                    );


                    checkTest();

                }

            },
            1000
        );

}


function updateTimer() {

    const timer =
        document.getElementById(
            "timer"
        );

    if (!timer) {
        return;
    }


    const minutes =
        String(
            Math.floor(
                timeLeft / 60
            )
        ).padStart(2, "0");


    const seconds =
        String(
            timeLeft % 60
        ).padStart(2, "0");


    timer.textContent =
        `⏱️ Уақыт: ${minutes}:${seconds}`;

}


// ==========================================
// 📊 ТЕСТІ ТЕКСЕРУ
// ==========================================

function checkTest() {

    clearInterval(timerInterval);


    let score = 0;
    let mistakes = [];


    questions.forEach(
        (question, index) => {

            const selected =
                document.querySelector(
                    `input[name="question${index}"]:checked`
                );


            if (selected) {

                const selectedAnswer =
                    Number(selected.value);


                if (
                    selectedAnswer ===
                    question.answer
                ) {

                    score++;

                } else {

                    mistakes.push({

                        question:
                            question.question,

                        studentAnswer:
                            question.options[
                                selectedAnswer
                            ],

                        correctAnswer:
                            question.options[
                                question.answer
                            ]

                    });

                }

            } else {

                mistakes.push({

                    question:
                        question.question,

                    studentAnswer:
                        "Жауап берілмеді",

                    correctAnswer:
                        question.options[
                            question.answer
                        ]

                });

            }

        }
    );


    const percent =
        Math.round(
            score /
            questions.length *
            100
        );


    let level;


    if (percent >= 80) {

        level =
            "Жоғары деңгей 🟢";

    } else if (percent >= 50) {

        level =
            "Орта деңгей 🟡";

    } else {

        level =
            "Қосымша жұмыс қажет 🔴";

    }


    const result =
        document.getElementById(
            "testResult"
        );


    if (result) {

        result.innerHTML = `

            <h3>📊 Нәтиже</h3>

            <p>
                Дұрыс жауап:
                <b>${score}</b>
                /
                ${questions.length}
            </p>

            <p>
                Нәтиже:
                <b>${percent}%</b>
            </p>

            <p>
                Деңгей:
                <b>${level}</b>
            </p>

        `;

    }


    const studentNameElement =
        document.getElementById(
            "studentName"
        );


    const studentName =
        studentNameElement &&
        studentNameElement.value.trim()
            ? studentNameElement.value.trim()
            : "Оқушы";


    const classSelect =
        document.getElementById(
            "classLevel"
        );


    const classLevel =
        classSelect
            ? classSelect.value
            : "5";


    const resultData = {

        name:
            studentName,

        classLevel:
            classLevel,

        score:
            score,

        total:
            questions.length,

        percent:
            percent,

        level:
            level,

        mistakes:
            mistakes,

        date:
            new Date().toLocaleString(
                "kk-KZ"
            )

    };


    let results =
        JSON.parse(
            localStorage.getItem(
                "aiInformaticsResults"
            )
        ) || [];


    results.push(resultData);


    localStorage.setItem(
        "aiInformaticsResults",
        JSON.stringify(results)
    );


    localStorage.setItem(
        "lastMistakes",
        JSON.stringify(mistakes)
    );


    loadResults();

    updateTeacherStatistics();

}


// ==========================================
// 🔍 ҚАТЕЛЕРМЕН ЖҰМЫС
// ==========================================

function showMistakes() {

    const mistakes =
        JSON.parse(
            localStorage.getItem(
                "lastMistakes"
            )
        ) || [];


    const result =
        document.getElementById(
            "mistakesResult"
        );


    if (!result) {
        return;
    }


    if (mistakes.length === 0) {

        result.innerHTML =
            "<p>🎉 Қате жауап жоқ!</p>";

        return;
    }


    let html = `
        <h3>🔍 Қателермен жұмыс</h3>
    `;


    mistakes.forEach(
        (mistake, index) => {

            html += `

                <div class="teacher-card">

                    <b>
                        ${index + 1}.
                        ${escapeHtml(
                            mistake.question
                        )}
                    </b>

                    <p>
                        ❌ Сіздің жауабыңыз:
                        ${escapeHtml(
                            mistake.studentAnswer
                        )}
                    </p>

                    <p>
                        ✅ Дұрыс жауап:
                        ${escapeHtml(
                            mistake.correctAnswer
                        )}
                    </p>

                </div>

            `;

        }
    );


    result.innerHTML =
        html;

}


// ==========================================
// 📊 НӘТИЖЕЛЕР
// ==========================================

function loadResults() {

    const resultsList =
        document.getElementById(
            "resultsList"
        );


    if (!resultsList) {
        return;
    }


    const results =
        JSON.parse(
            localStorage.getItem(
                "aiInformaticsResults"
            )
        ) || [];


    if (results.length === 0) {

        resultsList.innerHTML =
            "Нәтижелер әзірге жоқ.";

        return;
    }


    let html = "";


    results.forEach(
        (item, index) => {

            html += `

                <div class="teacher-card">

                    <h3>
                        ${index + 1}.
                        ${escapeHtml(
                            item.name
                        )}
                    </h3>

                    <p>
                        🎓 Сынып:
                        ${escapeHtml(
                            item.classLevel || "-"
                        )}
                    </p>

                    <p>
                        📅 ${escapeHtml(
                            item.date
                        )}
                    </p>

                    <p>
                        📊 Нәтиже:
                        <b>${item.percent}%</b>
                    </p>

                    <p>
                        🎯 Деңгей:
                        <b>${escapeHtml(
                            item.level
                        )}</b>
                    </p>

                    <p>
                        ✅
                        ${item.score}
                        /
                        ${item.total}
                    </p>

                </div>

            `;

        }
    );


    resultsList.innerHTML =
        html;

}


// ==========================================
// 👩‍🏫 МҰҒАЛІМ СТАТИСТИКАСЫ
// ==========================================

function updateTeacherStatistics() {

    const results =
        JSON.parse(
            localStorage.getItem(
                "aiInformaticsResults"
            )
        ) || [];


    const testCount =
        document.getElementById(
            "testCount"
        );

    const studentCount =
        document.getElementById(
            "studentCount"
        );

    const averageScore =
        document.getElementById(
            "averageScore"
        );

    const highLevel =
        document.getElementById(
            "highLevel"
        );

    const middleLevel =
        document.getElementById(
            "middleLevel"
        );

    const lowLevel =
        document.getElementById(
            "lowLevel"
        );


    if (testCount) {
        testCount.textContent =
            results.length;
    }


    const students =
        [
            ...new Set(
                results.map(
                    item => item.name
                )
            )
        ];


    if (studentCount) {
        studentCount.textContent =
            students.length;
    }


    let average = 0;


    if (results.length > 0) {

        const total =
            results.reduce(
                (sum, item) =>
                    sum + item.percent,
                0
            );


        average =
            Math.round(
                total /
                results.length
            );

    }


    if (averageScore) {
        averageScore.textContent =
            average + "%";
    }


    let high = 0;
    let middle = 0;
    let low = 0;


    results.forEach(
        item => {

            if (item.percent >= 80) {

                high++;

            } else if (
                item.percent >= 50
            ) {

                middle++;

            } else {

                low++;

            }

        }
    );


    if (highLevel) {
        highLevel.textContent = high;
    }

    if (middleLevel) {
        middleLevel.textContent = middle;
    }

    if (lowLevel) {
        lowLevel.textContent = low;
    }

}


// ==========================================
// 🗑️ НӘТИЖЕЛЕРДІ ӨШІРУ
// ==========================================

function clearResults() {

    const confirmDelete =
        confirm(
            "Барлық тест нәтижесін өшіруге сенімдісіз бе?"
        );


    if (!confirmDelete) {
        return;
    }


    localStorage.removeItem(
        "aiInformaticsResults"
    );

    localStorage.removeItem(
        "lastMistakes"
    );


    loadResults();

    updateTeacherStatistics();


    alert(
        "Барлық нәтижелер өшірілді."
    );

}


// ==========================================
// 🎤 ДАУЫС
// ==========================================

function startVoice() {

    if (
        !("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)
    ) {

        alert(
            "Бұл браузерде дауыс енгізу қолжетімсіз."
        );

        return;
    }


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "kk-KZ";


    recognition.interimResults =
        false;


    recognition.onresult =
        function(event) {

            const result =
                event.results[0][0].transcript;


            if (promptInput) {
                promptInput.value =
                    result;
            }

        };


    recognition.onerror =
        function() {

            alert(
                "Дауыс енгізу кезінде қате болды."
            );

        };


    recognition.start();

}


// ==========================================
// 📊 ДИАГНОСТИКА
// БҰЛ БӨЛІМ ТЕК БІР РЕТ БАР
// ==========================================

const diagnosticQuestions = [

    {
        question:
            "1. Компьютердің негізгі есептеу құрылғысы қайсы?",

        options: [
            "Монитор",
            "Процессор",
            "Пернетақта",
            "Тінтуір"
        ],

        answer: 1,

        topic:
            "Компьютер құрылғылары"
    },


    {
        question:
            "2. Python-да экранға ақпарат шығару командасы?",

        options: [
            "input()",
            "print()",
            "write()",
            "show()"
        ],

        answer: 1,

        topic:
            "Python негіздері"
    },


    {
        question:
            "3. Алгоритм дегеніміз не?",

        options: [
            "Компьютердің түсі",
            "Мәселені шешу үшін орындалатын әрекеттер реті",
            "Файлдың атауы",
            "Интернет желісі"
        ],

        answer: 1,

        topic:
            "Алгоритм"
    },


    {
        question:
            "4. Python-да шарт тексеру үшін қай оператор қолданылады?",

        options: [
            "for",
            "while",
            "if",
            "print"
        ],

        answer: 2,

        topic:
            "Шартты оператор"
    },


    {
        question:
            "5. 2 + 3 * 4 нәтижесі неше?",

        options: [
            "20",
            "14",
            "24",
            "9"
        ],

        answer: 1,

        topic:
            "Арифметикалық амалдар"
    },


    {
        question:
            "6. Бірнеше элементті сақтайтын Python құрылымы?",

        options: [
            "list",
            "print",
            "if",
            "input"
        ],

        answer: 0,

        topic:
            "Python тізімдері"
    },


    {
        question:
            "7. for циклі не үшін қолданылады?",

        options: [
            "Қайталап орындау үшін",
            "Сурет салу үшін ғана",
            "Компьютерді өшіру үшін",
            "Файлды жою үшін"
        ],

        answer: 0,

        topic:
            "Циклдер"
    },


    {
        question:
            "8. input() функциясы не істейді?",

        options: [
            "Экранды өшіреді",
            "Пайдаланушыдан мәлімет қабылдайды",
            "Бағдарламаны тоқтатады",
            "Файл жасайды"
        ],

        answer: 1,

        topic:
            "Python енгізу"
    },


    {
        question:
            "9. Ақпаратты графикалық түрде көрсетуге не жатады?",

        options: [
            "Диаграмма",
            "Пернетақта",
            "Процессор",
            "Пароль"
        ],

        answer: 0,

        topic:
            "Ақпаратты ұсыну"
    },


    {
        question:
            "10. Python-да түсініктеме жазу үшін қай белгі қолданылады?",

        options: [
            "@",
            "#",
            "$",
            "&"
        ],

        answer: 1,

        topic:
            "Python синтаксисі"
    }

];


let diagnosticCurrent = 0;
let diagnosticScore = 0;
let diagnosticWrongAnswers = [];


// ==========================================
// 🚀 ДИАГНОСТИКАНЫ БАСТАУ
// ==========================================

function startDiagnostic() {

    diagnosticCurrent = 0;

    diagnosticScore = 0;

    diagnosticWrongAnswers = [];


    const quiz =
        document.getElementById(
            "diagnosticQuiz"
        );

    const result =
        document.getElementById(
            "diagnosticResult"
        );


    if (quiz) {
        quiz.innerHTML = "";
    }

    if (result) {
        result.innerHTML = "";
    }


    showDiagnosticQuestion();

}


// ==========================================
// ❓ ДИАГНОСТИКА СҰРАҒЫН КӨРСЕТУ
// ==========================================

function showDiagnosticQuestion() {

    const quiz =
        document.getElementById(
            "diagnosticQuiz"
        );


    if (!quiz) {
        return;
    }


    const q =
        diagnosticQuestions[
            diagnosticCurrent
        ];


    if (!q) {
        finishDiagnostic();
        return;
    }


    let html = `

        <div class="teacher-card">

            <p>
                📊 Сұрақ
                <b>
                    ${diagnosticCurrent + 1}
                </b>
                /
                ${diagnosticQuestions.length}
            </p>

            <h3>
                ${escapeHtml(q.question)}
            </h3>

    `;


    q.options.forEach(
        (option, index) => {

            html += `

                <button
                    onclick="checkDiagnosticAnswer(${index})"
                    style="
                        display:block;
                        width:100%;
                        margin:8px 0;
                    "
                >
                    ${escapeHtml(option)}
                </button>

            `;

        }
    );


    html += `

        </div>

    `;


    quiz.innerHTML =
        html;

}


// ==========================================
// ✅ ДИАГНОСТИКА ЖАУАБЫН ТЕКСЕРУ
// ==========================================

function checkDiagnosticAnswer(
    selected
) {

    const q =
        diagnosticQuestions[
            diagnosticCurrent
        ];


    if (!q) {
        return;
    }


    if (
        selected ===
        q.answer
    ) {

        diagnosticScore++;

    } else {

        diagnosticWrongAnswers.push({

            question:
                q.question,

            selected:
                q.options[selected],

            correct:
                q.options[q.answer],

            topic:
                q.topic

        });

    }


    diagnosticCurrent++;


    if (
        diagnosticCurrent <
        diagnosticQuestions.length
    ) {

        showDiagnosticQuestion();

    } else {

        finishDiagnostic();

    }

}


// ==========================================
// 📊 ДИАГНОСТИКА НӘТИЖЕСІ
// ==========================================

function finishDiagnostic() {

    const percent =
        Math.round(
            diagnosticScore /
            diagnosticQuestions.length *
            100
        );


    let level = "";
    let levelColor = "";


    if (percent >= 80) {

        level =
            "🟢 Жоғары деңгей";

        levelColor =
            "green";

    } else if (percent >= 60) {

        level =
            "🟡 Орта деңгей";

        levelColor =
            "orange";

    } else {

        level =
            "🔴 Бастапқы деңгей";

        levelColor =
            "red";

    }


    // ======================================
    // 📚 ӘЛСІЗ ТАҚЫРЫПТАР
    // ======================================

    const topicCount = {};


    diagnosticWrongAnswers.forEach(
        item => {

            if (!topicCount[item.topic]) {
                topicCount[item.topic] = 0;
            }

            topicCount[item.topic]++;

        }
    );


    const weakTopics =
        Object.keys(topicCount);


    // ======================================
    // 🎯 ЖЕКЕ ОҚУ БАҒЫТЫ
    // ======================================

    let learningPlan = "";


    if (
        weakTopics.length === 0
    ) {

        learningPlan = `

            <div style="
                background:#dcfce7;
                padding:15px;
                border-radius:10px;
                margin-top:15px;
            ">

                🎉 Барлық тақырып бойынша
                нәтиже жақсы!

                <br><br>

                Келесі кезең:
                күрделі деңгейдегі Python
                және алгоритм тапсырмаларын орындау.

            </div>

        `;

    } else {

        learningPlan = `

            <div style="
                background:#eff6ff;
                padding:15px;
                border-radius:10px;
                margin-top:15px;
            ">

                <h3>
                    🎯 Сіздің жеке оқу бағытыңыз
                </h3>

                <p>
                    Қайталауды қажет ететін тақырыптар:
                </p>

                <ul>
        `;


        weakTopics.forEach(
            topic => {

                learningPlan += `

                    <li>
                        <b>
                            ${escapeHtml(topic)}
                        </b>
                    </li>

                `;

            }
        );


        learningPlan += `

                </ul>

                <p>
                    Алдымен осы тақырыптарды
                    қайталап, кейін қайта
                    диагностикалық тест орындау ұсынылады.
                </p>

            </div>

        `;

    }


    // ======================================
    // 📝 КЕЛЕСІ ТАПСЫРМА
    // ======================================

    let nextTask = "";


    if (percent >= 80) {

        nextTask = `

            <b>🔴 Күрделі тапсырма:</b><br>

            Python тілінде 1-ден 100-ге дейінгі
            сандардың ішінен 3-ке бөлінетін
            сандарды шығаратын бағдарлама құрыңыз.

        `;

    } else if (percent >= 60) {

        nextTask = `

            <b>🟡 Орта деңгей тапсырмасы:</b><br>

            Python тілінде санның жұп немесе
            тақ екенін анықтайтын бағдарлама жазыңыз.

        `;

    } else {

        nextTask = `

            <b>🟢 Бастапқы деңгей тапсырмасы:</b><br>

            Python тілінде екі санды енгізіп,
            олардың қосындысын шығаратын
            бағдарлама жазыңыз.

        `;

    }


    // ======================================
    // ❌ ҚАТЕЛЕР
    // ======================================

    let wrongHtml = "";


    if (
        diagnosticWrongAnswers.length === 0
    ) {

        wrongHtml = `

            <div style="
                background:#dcfce7;
                padding:15px;
                border-radius:10px;
                margin-top:15px;
            ">

                🎉 Барлық сұраққа дұрыс жауап бердіңіз!

            </div>

        `;

    } else {

        wrongHtml = `

            <h3 style="margin-top:25px;">
                ❌ Қате жауаптарды талдау
            </h3>

        `;


        diagnosticWrongAnswers.forEach(
            (item, index) => {

                wrongHtml += `

                    <div style="
                        background:#fff7ed;
                        padding:15px;
                        border-radius:10px;
                        margin:10px 0;
                        border-left:5px solid orange;
                    ">

                        <b>
                            ${index + 1}.
                            ${escapeHtml(item.question)}
                        </b>

                        <p>
                            ❌ Сіздің жауабыңыз:
                            <b>
                                ${escapeHtml(item.selected)}
                            </b>
                        </p>

                        <p>
                            ✅ Дұрыс жауап:
                            <b>
                                ${escapeHtml(item.correct)}
                            </b>
                        </p>

                        <p>
                            📚 Тақырып:
                            <b>
                                ${escapeHtml(item.topic)}
                            </b>
                        </p>

                    </div>

                `;

            }
        );

    }


    // ======================================
    // 📊 НӘТИЖЕНІ ЭКРАНҒА ШЫҒАРУ
    // ======================================

    const result =
        document.getElementById(
            "diagnosticResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML = `

        <div class="teacher-card">

            <h2>
                📊 Диагностика нәтижесі
            </h2>

            <p>
                Дұрыс жауап:
                <b>
                    ${diagnosticScore}
                    /
                    ${diagnosticQuestions.length}
                </b>
            </p>

            <p>
                Нәтиже:
                <b>
                    ${percent}%
                </b>
            </p>

            <h3 style="color:${levelColor}">
                ${level}
            </h3>

            ${wrongHtml}

            ${learningPlan}

            <div style="
                background:#f8fafc;
                padding:15px;
                border-radius:10px;
                margin-top:15px;
            ">

                <h3>
                    📚 Келесі оқу тапсырмасы
                </h3>

                <p>
                    ${nextTask}
                </p>

            </div>


            <button
                onclick="askDiagnosticAI()"
                style="margin-top:15px;"
            >
                🤖 AI қатемді түсіндір
            </button>


            <button
                onclick="startDiagnostic()"
                style="margin-top:15px;"
            >
                🔄 Қайта орындау
            </button>

        </div>

    `;

}


// ==========================================
// 🤖 ДИАГНОСТИКА ҚАТЕЛЕРІН AI ТАЛДАУ
// ==========================================

async function askDiagnosticAI() {

    if (
        diagnosticWrongAnswers.length === 0
    ) {

        alert(
            "🎉 Сіз барлық сұраққа дұрыс жауап бердіңіз!"
        );

        return;
    }


    const errorText =
        diagnosticWrongAnswers
            .map(
                (item, index) => {

                    return `
${index + 1}. Сұрақ: ${item.question}
Оқушы жауабы: ${item.selected}
Дұрыс жауап: ${item.correct}
Тақырып: ${item.topic}
`;

                }
            )
            .join("\n");


    const prompt = `

Сен информатика пәнінің мұғалімісің.

Оқушы диагностикалық тест тапсырды.

Оқушының қате жауаптары:

${errorText}

Оқушының қателерін қазақ тілінде,
қарапайым әрі түсінікті түрде талда.

Мына құрылымды міндетті түрде пайдалан:

🧠 1. Қатенің себебі

Қате не себепті болуы мүмкін екенін түсіндір.

📚 2. Тақырыпты түсіндіру

Оқушыға осы тақырыпты қарапайым тілмен түсіндір.

💡 3. Дұрыс жауап

Дұрыс жауаптың неге дұрыс екенін түсіндір.

📝 4. Ұқсас тапсырма

Оқушыға өздігінен орындауға арналған
бір ұқсас тапсырма бер.

🎯 5. Жеке оқу бағыты

Оқушы келесі кезекте қандай тақырыпты
қайталауы керек екенін ұсын.

`;


    const result =
        document.getElementById(
            "diagnosticResult"
        );


    if (!result) {
        return;
    }


    result.innerHTML += `

        <div class="teacher-card">

            <h3>
                🤖 AI қателерді талдап жатыр...
            </h3>

            <p>
                Біраз күте тұрыңыз.
            </p>

        </div>

    `;


    try {

        const formData =
            new FormData();


        formData.append(
            "prompt",
            prompt
        );


        const response =
            await fetch(
                "/api/ask",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "AI серверінде қате пайда болды."
            );

        }


        const answer =
            data.answer ||
            "AI жауап бере алмады.";


        result.innerHTML += `

            <div class="teacher-card">

                <h3>
                    🤖 AI мұғалімнің талдауы
                </h3>

                <div
                    style="
                        line-height:1.8;
                        margin-top:15px;
                        white-space:pre-wrap;
                    "
                >
                    ${escapeHtml(answer)}
                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            "Diagnostic AI error:",
            error
        );


        result.innerHTML += `

            <div class="teacher-card">

                <h3>
                    ❌ AI қатесі
                </h3>

                <p>
                    AI серверіне қосылу мүмкін болмады.
                </p>

                <p>
                    CMD терезесінде
                    <b>node server.js</b>
                    жұмыс істеп тұрғанын тексеріңіз.
                </p>

            </div>

        `;

    }

}


// ==========================================
// 🚀 БЕТ АШЫЛҒАН КЕЗДЕ
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadQuiz();

        startTimer();

        loadResults();

        updateTeacherStatistics();


        if (imageInput) {

            imageInput.addEventListener(
                "change",
                showSelectedFile
            );

        }

    }
);