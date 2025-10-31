import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../src/config/api.config";

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit lesson states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicLessons, setTopicLessons] = useState([]);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editForm, setEditForm] = useState({
    subtopic: "",
    summary: "",
    bulletPoints: [],
  });

  useEffect(() => {
    fetchAllData();
  }, [currentUser]);

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      // Fetch user profile
      const profileResponse = await axios.get(
        `${API_URL}/auth/profile/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfileUser(profileResponse.data);

      // Fetch progress data
      const progressResponse = await axios.get(
        `${API_URL}/progress/${currentUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProgress(progressResponse.data);

      // Fetch quiz history
      const quizzesResponse = await axios.get(
        `${API_URL}/quiz/user/${currentUser._id}`,
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

  // Fetch lessons for a specific topic
  const fetchTopicLessons = async (topic) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/lesson/alllesson`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const topicLessons = response.data.filter((l) => l.topic === topic);
      setTopicLessons(topicLessons);
      setSelectedTopic(topic);
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };

  // Start editing a lesson
  const handleStartEdit = (lesson) => {
    setEditingLesson(lesson._id);
    setEditForm({
      subtopic: lesson.subtopic,
      summary: lesson.summary,
      bulletPoints: [...lesson.bulletPoints],
    });
  };

  // Save edited lesson
  const handleSaveEdit = async (lessonId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `${API_URL}/lesson/${lessonId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedLessons = topicLessons.map((lesson) =>
        lesson._id === lessonId ? response.data : lesson
      );
      setTopicLessons(updatedLessons);
      setEditingLesson(null);

      console.log("✅ Lesson updated successfully");
    } catch (err) {
      console.error("❌ Error updating lesson:", err);
    }
  };

  // Delete lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_URL}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const remaining = topicLessons.filter((l) => l._id !== lessonId);
      setTopicLessons(remaining);

      console.log("🗑️ Lesson deleted successfully");

      // If no lessons left, close modal
      if (remaining.length === 0) {
        setShowEditModal(false);
        fetchAllData(); // Refresh progress data
      }
    } catch (err) {
      console.error("❌ Error deleting lesson:", err);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingLesson(null);
    setEditForm({
      subtopic: "",
      summary: "",
      bulletPoints: [],
    });
  };

  // Update bullet point
  const updateBulletPoint = (index, value) => {
    const updated = [...editForm.bulletPoints];
    updated[index] = value;
    setEditForm({ ...editForm, bulletPoints: updated });
  };

  // Add bullet point
  const addBulletPoint = () => {
    setEditForm({
      ...editForm,
      bulletPoints: [...editForm.bulletPoints, ""],
    });
  };

  // Remove bullet point
  const removeBulletPoint = (index) => {
    const updated = editForm.bulletPoints.filter((_, i) => i !== index);
    setEditForm({ ...editForm, bulletPoints: updated });
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

                  <div className="topic-actions">
                    <button
                      onClick={() =>
                        navigate(`/lessons/${encodeURIComponent(item.topic)}`)
                      }
                      className="review-btn"
                    >
                      Review Topic
                    </button>
                    <button
                      onClick={() => fetchTopicLessons(item.topic)}
                      className="edit-lessons-btn"
                    >
                      ✏️ Edit Lessons
                    </button>
                  </div>
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

      {/* Edit Lessons Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Lessons: {selectedTopic}</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {topicLessons.length === 0 ? (
                <p className="empty-lessons">
                  No lessons found for this topic.
                </p>
              ) : (
                <div className="lessons-edit-list">
                  {topicLessons.map((lesson, idx) => (
                    <div key={lesson._id} className="lesson-edit-item">
                      {editingLesson === lesson._id ? (
                        // EDIT MODE
                        <div className="lesson-edit-form">
                          <h3>Editing Lesson {idx + 1}</h3>

                          <label>Subtopic Title:</label>
                          <input
                            type="text"
                            value={editForm.subtopic}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                subtopic: e.target.value,
                              })
                            }
                            placeholder="Subtopic title"
                          />

                          <label>Summary:</label>
                          <textarea
                            value={editForm.summary}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                summary: e.target.value,
                              })
                            }
                            placeholder="Lesson summary"
                            rows="4"
                          />

                          <label>Key Points:</label>
                          {editForm.bulletPoints.map((point, pointIdx) => (
                            <div key={pointIdx} className="bullet-edit">
                              <input
                                type="text"
                                value={point}
                                onChange={(e) =>
                                  updateBulletPoint(pointIdx, e.target.value)
                                }
                                placeholder={`Point ${pointIdx + 1}`}
                              />
                              <button
                                onClick={() => removeBulletPoint(pointIdx)}
                                className="remove-bullet-btn"
                              >
                                ✕
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={addBulletPoint}
                            className="add-bullet-btn"
                          >
                            + Add Point
                          </button>

                          <div className="edit-form-actions">
                            <button
                              onClick={() => handleSaveEdit(lesson._id)}
                              className="save-btn"
                            >
                              💾 Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="cancel-btn"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // VIEW MODE
                        <div className="lesson-view">
                          <div className="lesson-view-header">
                            <h3>
                              Lesson {idx + 1}: {lesson.subtopic}
                            </h3>
                            <div className="lesson-view-actions">
                              <button
                                onClick={() => handleStartEdit(lesson)}
                                className="edit-btn-small"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(lesson._id)}
                                className="delete-btn-small"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <p className="lesson-view-summary">
                            {lesson.summary}
                          </p>

                          <div className="lesson-view-points">
                            <strong>Key Points:</strong>
                            <ul>
                              {lesson.bulletPoints.map((point, pointIdx) => (
                                <li key={pointIdx}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
