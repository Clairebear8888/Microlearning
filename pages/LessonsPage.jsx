import { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { API_URL } from "../src/config/api.config";

function LessonsPage() {
  const { topic: topicParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const topic = location.state?.topic || decodeURIComponent(topicParam);

  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    subtopic: "",
    summary: "",
    bulletPoints: [],
  });

  useEffect(() => {
    if (location.state?.lessons) {
      setLessons(location.state.lessons);
    } else {
      fetchLessons();
    }
  }, []);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/lesson/alllesson`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const topicLessons = response.data.filter((l) => l.topic === topic);
      setLessons(topicLessons);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };

  const handleMarkComplete = async () => {
    const currentLesson = lessons[currentIndex];
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${API_URL}/progress/lesson-complete`,
        {
          lessonId: currentLesson._id,
          topic: topic,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCompletedLessons((prev) => new Set([...prev, currentIndex]));
      console.log("✅ Lesson marked complete");
    } catch (err) {
      console.error("❌ Error marking complete:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGoToQuiz = () => {
    const lessonIds = lessons.map((l) => l._id);

    navigate(`/quiz/${encodeURIComponent(topic)}`, {
      state: {
        topic: topic,
        lessonIds: lessonIds,
      },
    });
  };

  const handleEdit = (lesson) => {
    setIsEditing(true);
    setEditForm({
      subtopic: lesson.subtopic,
      summary: lesson.summary,
      bulletPoints: lesson.bulletPoints,
    });
  };

  const handleSaveEdit = async () => {
    const token = localStorage.getItem("authToken");
    const lessonId = lessons[currentIndex]._id;

    try {
      const response = await axios.put(
        `${API_URL}/lesson/${lessonId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update local state
      const updatedLesson = response.data;
      const updatedLessons = [...lessons];
      updatedLessons[currentIndex] = updatedLesson;
      setLessons(updatedLessons);
      setIsEditing(false);

      console.log("✅ Lesson updated successfully");
    } catch (err) {
      console.error("❌ Error updating lesson:", err);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(`${API_URL}/lesson/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const remaining = lessons.filter((l) => l._id !== lessonId);
      setLessons(remaining);
      setCurrentIndex(0);
      console.log("🗑️ Lesson deleted successfully");
    } catch (err) {
      console.error("❌ Error deleting lesson:", err);
    }
  };

  const allCompleted = completedLessons.size === lessons.length;
  const currentLesson = lessons[currentIndex];
  const isLastLesson = currentIndex === lessons.length - 1;

  // Debug logs
  console.log("Debug Info:");
  console.log("   Current Index:", currentIndex);
  console.log("   Total Lessons:", lessons.length);
  console.log("   Is Last Lesson:", isLastLesson);
  console.log("   Completed Count:", completedLessons.size);
  console.log("   All Completed:", allCompleted);

  if (lessons.length === 0) {
    return <div className="loading-container">Loading lessons...</div>;
  }

  return (
    <div className="lessons-container">
      <div className="lessons-content">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-info">
            <span>
              Lesson {currentIndex + 1} of {lessons.length}
            </span>
            <span>{completedLessons.size} completed</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${((currentIndex + 1) / lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Lesson Content */}
        <div className="lesson-card">
          <div className="lesson-topic">{topic}</div>
          <h1 className="lesson-title">{currentLesson.subtopic}</h1>

          <p className="lesson-summary">{currentLesson.summary}</p>

          <div className="lesson-points">
            <h3 className="points-title">Key Points:</h3>
            {currentLesson.bulletPoints.map((point, idx) => (
              <div key={idx} className="bullet-point">
                <span className="bullet">•</span>
                <p>{point}</p>
              </div>
            ))}
          </div>

          {completedLessons.has(currentIndex) && (
            <div className="completed-badge">✓ Lesson completed</div>
          )}
        </div>
        {/* button session  */}

        <div className="lesson-actions">
          <button
            onClick={() => handleEdit(currentLesson)}
            className="edit-btn"
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => handleDelete(currentLesson._id)}
            className="delete-btn"
          >
            🗑️ Delete
          </button>

          {isEditing && (
            <div className="edit-form">
              <h3>Edit Lesson</h3>

              <input
                type="text"
                value={editForm.subtopic}
                onChange={(e) =>
                  setEditForm({ ...editForm, subtopic: e.target.value })
                }
                placeholder="Subtopic title"
              />

              <textarea
                value={editForm.summary}
                onChange={(e) =>
                  setEditForm({ ...editForm, summary: e.target.value })
                }
                placeholder="Lesson summary"
              />

              {editForm.bulletPoints.map((point, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const updated = [...editForm.bulletPoints];
                    updated[idx] = e.target.value;
                    setEditForm({ ...editForm, bulletPoints: updated });
                  }}
                />
              ))}

              <div className="edit-buttons">
                <button onClick={handleSaveEdit} className="save-btn">
                  💾 Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="lesson-nav">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>

          {!completedLessons.has(currentIndex) && (
            <button
              onClick={handleMarkComplete}
              disabled={loading}
              className="nav-btn complete-btn"
            >
              {loading ? "Saving..." : "✓ Mark Complete"}
            </button>
          )}

          {/* Show Next OR Quiz button based on position */}
          {!isLastLesson ? (
            // Not on last lesson - show Next button
            <button onClick={handleNext} className="nav-btn next-btn">
              Next →
            </button>
          ) : // On last lesson - show Quiz or Complete message
          allCompleted ? (
            <button onClick={handleGoToQuiz} className="nav-btn quiz-btn">
              Take Quiz 🎯
            </button>
          ) : (
            <button disabled className="nav-btn disabled-btn">
              Complete all {lessons.length} lessons ({completedLessons.size}{" "}
              done)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonsPage;
