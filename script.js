let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [];
 let currentQuestionIndex = 0;
 let score = 0;
 let timer;
 let timeLeft = 30;
 let editingQuestionIndex = -1;

 function saveQuestionsToStorage() {
 localStorage.setItem("quizQuestions", JSON.stringify(questions));
 }

 function updateQuestionList() {
 const list = document.getElementById('question-list');
 list.innerHTML = '';
 questions.forEach((q, index) => {
 const item = document.createElement('li');
 item.className = 'list-group-item text-start bg-dark text-light';
 item.innerHTML = `Q${index + 1}: ${q.question} - Options: ${q.options.join(', ')} - Answer: <em>${q.answer}</em> - Time: ${q.time || 30}s
 <button class="btn btn-sm btn-outline-warning mt-2" onclick="editQuestion(${index})">Edit</button>
 <button class="btn btn-sm btn-outline-danger mt-2 ms-2" onclick="deleteQuestion(${index})">Delete</button>`;
 list.appendChild(item);
 });
 }

 function editQuestion(index) {
 editingQuestionIndex = index;
 const q = questions[index];
 document.getElementById('new-question').value = q.question;
 document.getElementById('option1').value = q.options[0];
 document.getElementById('option2').value = q.options[1];
 document.getElementById('option3').value = q.options[2];
 document.getElementById('option4').value = q.options[3];
 document.getElementById('correct-answer').value = q.answer;
 document.getElementById('question-time').value = q.time || 30;
 }

 function addQuestion() {
 const question = document.getElementById('new-question').value.trim();
 const opt1 = document.getElementById('option1').value.trim();
 const opt2 = document.getElementById('option2').value.trim();
 const opt3 = document.getElementById('option3').value.trim();
 const opt4 = document.getElementById('option4').value.trim();
 const answer = document.getElementById('correct-answer').value.trim();
 const time = parseInt(document.getElementById('question-time').value.trim()) || 30;

 if (!question || !opt1 || !opt2 || !opt3 || !opt4 || !answer) {
 alert("Please fill in all fields");
 return;
 }

 const questionObj = {
 question: question,
 options: [opt1, opt2, opt3, opt4],
 answer: answer,
 time: time
 };

 if (editingQuestionIndex !== -1) {
 questions[editingQuestionIndex] = questionObj;
 editingQuestionIndex = -1;
 } else {
 questions.push(questionObj);
 }

 saveQuestionsToStorage();
 alert("Question saved successfully!");
 document.getElementById('new-question').value = "";
 document.getElementById('option1').value = "";
 document.getElementById('option2').value = "";
 document.getElementById('option3').value = "";
 document.getElementById('option4').value = "";
 document.getElementById('correct-answer').value = "";
 document.getElementById('question-time').value = "";
 updateQuestionList();
 }

 function deleteQuestion(index) {
 if (confirm("Are you sure you want to delete this question?")) {
 questions.splice(index, 1);
 saveQuestionsToStorage();
 updateQuestionList();
 }
 }

 function login(role) {
 const name = document.getElementById(`${role}-name`).value.trim();
 if (name === '') {
 alert('Please enter your name');
 return;
 }
 if (role === 'teacher') {
 document.getElementById('teacher-login').classList.add('d-none');
 document.getElementById('student-login').classList.add('d-none');
 document.getElementById('teacher-panel').classList.remove('d-none');
 updateQuestionList();
 } else {
 document.getElementById('teacher-login').classList.add('d-none');
 document.getElementById('student-login').classList.add('d-none');
 startQuiz();
 }
 }

 function showLogin(role) {
 document.querySelector('.card').classList.add('d-none');
 document.getElementById(`${role}-login`).classList.remove('d-none');
 }

 function startQuiz() {
 document.getElementById('background-video-container').style.display = 'none';
 if (questions.length === 0) {
 alert("No questions available. Ask a teacher to create some.");
 location.reload();
 return;
 }
 document.getElementById('quiz-panel').classList.remove('d-none');
 currentQuestionIndex = 0;
 score = 0;
 showQuestion();
 }

 function showQuestion() {
 const q = questions[currentQuestionIndex];
 document.getElementById('question-progress').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
 document.getElementById('quiz-question').textContent = q.question;
 const optionsDiv = document.getElementById('quiz-options');
 optionsDiv.innerHTML = '';
 q.options.forEach(opt => {
 const btn = document.createElement('button');
 btn.className = 'question-button';
 btn.textContent = opt;
 btn.onclick = () => selectOption(btn);
 optionsDiv.appendChild(btn);
 });
 clearInterval(timer);
 startTimer(q.time || 30);
 }

 function selectOption(btn) {
 document.querySelectorAll('#quiz-options button').forEach(b => b.classList.remove('active'));
 btn.classList.add('active');
 }

 function submitAnswer() {
 clearInterval(timer);
 const selected = document.querySelector('#quiz-options button.active');
 const q = questions[currentQuestionIndex];
 if (selected && selected.textContent.trim() === q.answer.trim()) score++;
 currentQuestionIndex++;
 if (currentQuestionIndex < questions.length) showQuestion();
 else showResults();
 }

 function startTimer(seconds) {
 timeLeft = seconds;
 document.getElementById('timer').textContent = timeLeft;
 timer = setInterval(() => {
 timeLeft--;
 document.getElementById('timer').textContent = timeLeft;
 if (timeLeft <= 0) {
 clearInterval(timer);
 submitAnswer();
 }
 }, 1000);
 }

 function showResults() {
 document.getElementById('quiz-panel').classList.add('d-none');
 document.getElementById('results-panel').classList.remove('d-none');
 document.getElementById('result-text').textContent = `You scored ${score} out of ${questions.length}`;
 }

 function restartQuiz() {
 location.reload();
 }
