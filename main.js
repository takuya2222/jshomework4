const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple';

  class Quiz {
    constructor(quizData) {
      this._quizzes = quizData.results;
      this._correctAnswersNum = 0;
      console.log(quizData.results);
    }


    getQuizCategory(index) {
      return this._quizzes[index - 1].category;
    }

    getQuizDifficulty(index) {
      return this._quizzes[index - 1].difficulty;
    }

    getNumOfQuiz() {
      return this._quizzes.length;
    }

    getQuizQuestion(index) {
      return this._quizzes[index - 1].question;
    }

    getCorrectAnswer(index) {
      return this._quizzes[index - 1].correct_answer;
    }

    getIncorrectAnswers(index) {
      return this._quizzes[index - 1].incorrect_answers;
    }

    countCorrectAnswersNum(index, answer) {
      const correctAnswer = this._quizzes[index - 1].correct_answer;
      if (answer === correctAnswer) {
        return this._correctAnswersNum++;
      }
     }

    getCorrectAnswersNum() {
      return this._correctAnswersNum;
    }
  }

  const titleElement = document.getElementById('title');
  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');
  const startButton = document.getElementById('start-button');
  const genreElement = document.getElementById('genre');
  const difficultyElement = document.getElementById('difficulty');

  startButton.addEventListener('click', () => {
    startButton.hidden = true;
    fetchQuizData(1);
  });

  const fetchQuizData = async (index) => {
    titleElement.textContent = '取得中';
    questionElement.textContent = '少々お待ち下さい';

    const response = await fetch(API_URL);
    const quizData = await response.json();
    const quizInstance = new Quiz(quizData);

    setNextQuiz(quizInstance, index);
  };

  const setNextQuiz = (quizInstance, index) => {
    while (answersContainer.firstChild) {
      answersContainer.removeChild(answersContainer.firstChild);
    }

    if (index <= quizInstance.getNumOfQuiz()) {
      makeQuiz(quizInstance, index);
    } else {
      finishQuiz(quizInstance);
    }
  };

  const makeQuiz = (quizInstance, index) => {
    titleElement.innerHTML = `問題 ${index}`;
    genreElement.innerHTML = `【ジャンル】 ${quizInstance.getQuizCategory(index)}`;
    difficultyElement.innerHTML = `【難易度】 ${quizInstance.getQuizDifficulty(index)}`;
    questionElement.innerHTML = `【クイズ】${quizInstance.getQuizQuestion(index)}`;

    const answers = buildAnswers(quizInstance, index);

    answers.forEach((answer) => {
      const answerElement = document.createElement('li');
      answersContainer.appendChild(answerElement);

      const buttonElement = document.createElement('button');
      buttonElement.innerHTML = answer;
      answerElement.appendChild(buttonElement);

      buttonElement.addEventListener('click', () => {
        quizInstance.countCorrectAnswersNum(index, answer);
        index++;
        setNextQuiz(quizInstance, index);
      });
    });
  };

  const finishQuiz = (quizInstance) => {
    titleElement.textContent = `あなたの正答数は${quizInstance.getCorrectAnswersNum()}です`
    genreElement.textContent = '';
    difficultyElement.textContent = '';
    questionElement.textContent = '再チャレンジしたい場合は下をクリック';

    const restartButton = document.createElement('button');
    restartButton.textContent = 'ホームに戻る';
    answersContainer.appendChild(restartButton);
    restartButton.addEventListener('click', () => {
      location.reload();
    });
  };

  const buildAnswers = (quizInstance, index) => {
    const answers = [
      quizInstance.getCorrectAnswer(index),
      ...quizInstance.getIncorrectAnswers(index)
    ];
    return shuffleArray(answers);
  };

  const shuffleArray = ([...array]) => {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
