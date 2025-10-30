import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";

function QuizPage() {
  const { topic: topicParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  // Get topic and lessonIds from navigation state OR decode from URL
  const topic = location.state?.topic || decodeURIComponent(topicParam);
  const lessonIdsFromState = location.state?.lessonIds;

  console.log(" QuizPage mounted:");
  console.log("   - topicParam:", topicParam);
  console.log("   - location.state?.topic:", location.state?.topic);
  console.log("   - final topic:", topic);
  console.log("   - lessonIds from state:", lessonIdsFromState);

  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    generateQuiz();
  }, []);

  const generateQuiz = async () => {
    try {
      const token = localStorage.getItem("authToken");

      let lessonIds = lessonIdsFromState;

      // If no lessonIds in state, fetch them
      if (!lessonIds || lessonIds.length === 0) {
        console.log(" No lesson IDs in state, fetching...");
        const lessonsResponse = await axios.get(
          "http://localhost:5005/lesson/alllesson",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const topicLessons = lessonsResponse.data.filter(
          (l) => l.topic === topic
        );
        lessonIds = topicLessons.map((l) => l._id);
        console.log(" Fetched lesson IDs:", lessonIds);
      }

      // Debug what we're sending
      console.log(" FRONTEND SENDING:");
      console.log("   - Topic:", topic);
      console.log("   - Topic type:", typeof topic);
      console.log("   - LessonIds:", lessonIds);

      const requestBody = {
        topic: topic,
        lessonIds: lessonIds,
      };

      console.log("🔍 Request body:", JSON.stringify(requestBody));

      // Generate quiz
      const quizResponse = await axios.post(
        "http://localhost:5005/quiz/generate",
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Quiz response:", quizResponse.data);

      setQuiz(quizResponse.data.quiz);
      setUserAnswers(
        new Array(quizResponse.data.quiz.questions.length).fill("")
      );
      setError("");
    } catch (err) {
      console.error("Error generating quiz:", err);
      console.error("Error response:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (userAnswers.some((a) => !a)) {
      alert("Please answer all questions before submitting");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:5005/quiz/submit/${quiz._id}`,
        { answers: userAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScore(response.data.score);
      setSubmitted(true);

      // Update progress
      await axios.post(
        "http://localhost:5005/progress/quiz-complete",
        {
          quizId: quiz._id,
          topic: topic,
          score: response.data.score,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(" Quiz submitted successfully");
    } catch (err) {
      console.error(" Error submitting quiz:", err);
      alert("Error submitting quiz. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🔄</div>
        <p>Generating your quiz...</p>
        <p className="loading-note">(This may take 10-15 seconds)</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={generateQuiz} className="retry-btn">
              🔄 Try Again
            </button>
            <button onClick={() => navigate("/topics")} className="back-btn">
              ← Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2>❌ Quiz Not Found</h2>
          <button onClick={() => navigate("/topics")} className="back-btn">
            ← Back to Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-content">
        <div className="quiz-header">
          <h1 className="quiz-title">Quiz: {topic}</h1>
          <p className="quiz-subtitle">
            Test your knowledge with {quiz.questions.length} questions
          </p>
        </div>

        <div className="quiz-questions">
          {quiz.questions.map((q, qIndex) => (
            <div key={qIndex} className="question-block">
              <h3 className="question-text">
                {qIndex + 1}. {q.questionText}
              </h3>

              <div className="options-list">
                {q.options.map((option, oIndex) => {
                  const isSelected = userAnswers[qIndex] === option;
                  const isCorrect = submitted && option === q.correctAnswer;
                  const isWrong =
                    submitted && isSelected && option !== q.correctAnswer;

                  let optionClass = "option-item";
                  if (submitted) {
                    if (isCorrect) optionClass += " option-correct";
                    else if (isWrong) optionClass += " option-wrong";
                  } else if (isSelected) {
                    optionClass += " option-selected";
                  }

                  return (
                    <label key={oIndex} className={optionClass}>
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(qIndex, option)}
                        disabled={submitted}
                        className="option-radio"
                      />
                      <span className="option-text">{option}</span>
                      {submitted && isCorrect && (
                        <span className="check-icon">✓</span>
                      )}
                      {submitted && isWrong && (
                        <span className="x-icon">✗</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button onClick={handleSubmit} className="submit-btn">
            Submit Quiz
          </button>
        ) : (
          <div className="results-section">
            <div className="score-card">
              <div className="score-number">
                {score} / {quiz.totalQuestions}
              </div>
              <div className="score-percentage">
                You scored {Math.round((score / quiz.totalQuestions) * 100)}%
              </div>
              {score === quiz.totalQuestions && (
                <div className="perfect-score">🎉 Perfect Score!</div>
              )}
            </div>

            <div className="results-actions">
              <button
                onClick={() => navigate("/profile")}
                className="action-btn profile-btn"
              >
                View Profile
              </button>
              <button
                onClick={() => navigate("/topics")}
                className="action-btn topics-btn"
              >
                Learn New Topic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizPage;
