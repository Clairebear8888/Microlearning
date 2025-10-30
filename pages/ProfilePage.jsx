import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch user profile
      const profileResponse = await axios.get(
        `http://localhost:5005/auth/profile/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileUser(profileResponse.data);

      // Fetch progress data
      const progressResponse = await axios.get(
        `http://localhost:5005/progress/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(progressResponse.data);

      // Fetch quiz history
      const quizzesResponse = await axios.get(
        `http://localhost:5005/quiz/user/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuizzes(quizzesResponse.data);
      // debug checking
      console.log("Profile data:", profileResponse.data);
      console.log("Progress data:", progressResponse.data);
      console.log("Quizzes data:", quizzesResponse.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalLearningTime = () => {
    // Estimate: each lesson takes ~5 minutes, each quiz ~10 minutes
    const totalLessons =
      progress?.progress.reduce((sum, p) => sum + p.lessonsCompleted, 0) || 0;
    const totalQuizzes = quizzes.length;
    return totalLessons * 5 + totalQuizzes * 10;
  };

  if (loading) {
    return <div className="loading-container">Loading profile...</div>;
  }

  const totalTopics = progress?.progress.length || 0;
  const totalLessons =
    progress?.progress.reduce((sum, p) => sum + p.lessonsCompleted, 0) || 0;
  const totalQuizzes = quizzes.length;
  const averageScore =
    quizzes.length > 0
      ? Math.round(
          quizzes.reduce(
            (sum, q) => sum + (q.score / q.totalQuestions) * 100,
            0
          ) / quizzes.length
        )
      : 0;
  const totalMinutes = calculateTotalLearningTime();
  // debug checking
  console.log("total lesson:", totalLessons);
  console.log("totalTopics:", totalTopics);
  console.log("totalMinutes:", totalMinutes);
  console.log("totalQuizs:", totalQuizzes);

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            {profileUser?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profileUser?.username}</h1>
            <p className="profile-email">{profileUser?.email}</p>
            <p className="profile-joined">
              Member since {formatDate(currentUser.createdAt || new Date())}
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{totalTopics}</div>
            <div className="stat-label">Topics Learned</div>
          </div>

          <div className="stat-card stat-green">
            <div className="stat-icon">✅</div>
            <div className="stat-number">{totalLessons}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>

          <div className="stat-card stat-purple">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">{totalQuizzes}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>

          <div className="stat-card stat-yellow">
            <div className="stat-icon">⏱️</div>
            <div className="stat-number">{totalMinutes}</div>
            <div className="stat-label">Minutes Learning</div>
          </div>
        </div>

        {/* Average Score */}
        {totalQuizzes > 0 && (
          <div className="score-section">
            <h2>Average Quiz Score</h2>
            <div className="score-circle">
              <div className="score-value">{averageScore}%</div>
            </div>
          </div>
        )}

        {/* Topics Progress */}
        <div className="section-card">
          <h2 className="section-title">Learning Progress by Topic</h2>

          {progress?.progress.length === 0 ? (
            <div className="empty-state">
              <p>No topics learned yet</p>
              <button
                onClick={() => navigate("/topics")}
                className="start-learning-btn"
              >
                Start Learning
              </button>
            </div>
          ) : (
            <div className="topics-list">
              {progress?.progress.map((item, index) => (
                <div key={index} className="topic-item">
                  <div className="topic-header">
                    <h3 className="topic-name">{item.topic}</h3>
                    {item.quizzesTaken > 0 && (
                      <span className="topic-score">
                        Avg: {item.averageScore}%
                      </span>
                    )}
                  </div>

                  <div className="topic-stats">
                    <div className="topic-stat">
                      <span className="stat-icon-small">📖</span>
                      <span>{item.lessonsCompleted} lessons</span>
                    </div>
                    <div className="topic-stat">
                      <span className="stat-icon-small">🎯</span>
                      <span>{item.quizzesTaken} quizzes</span>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/lessons/${encodeURIComponent(item.topic)}`)
                    }
                    className="review-btn"
                  >
                    Review Topic
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz History */}
        {quizzes.length > 0 && (
          <div className="section-card">
            <h2 className="section-title">Recent Quiz Results</h2>
            <div className="quiz-history">
              {quizzes.slice(0, 5).map((quiz) => (
                <div key={quiz._id} className="quiz-item">
                  <div className="quiz-info">
                    <h4 className="quiz-topic">{quiz.topic}</h4>
                    <p className="quiz-date">{formatDate(quiz.createdAt)}</p>
                  </div>
                  <div className="quiz-score-badge">
                    <div className="score-fraction">
                      {quiz.score}/{quiz.totalQuestions}
                    </div>
                    <div className="score-percent">
                      {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="profile-actions">
          <button onClick={() => navigate("/topics")} className="new-topic-btn">
            Learn Something New
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
