import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TopicsPage = () => {
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5005/lesson/generate",
        { topic: topic.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(" Lessons generated:", response.data);

      navigate(`/lessons/${encodeURIComponent(topic)}`, {
        state: {
          lessons: response.data.lessons,
          topic: topic.trim(),
        },
      });
    } catch (err) {
      console.error(" Error:", err);
      setError(err.response?.data?.message || "Failed to generate lessons");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="topics-container">
      <div className="topics-content">
        <div className="topics-card">
          <h1 className="topics-title">What do you want to learn?</h1>
          <p className="topics-subtitle">
            Enter any topic and AI will generate 15 bite-sized lessons
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleGenerate} className="topics-form">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript, Photography, Spanish..."
              className="topic-input"
              disabled={isGenerating}
            />

            <button
              type="submit"
              disabled={isGenerating || !topic.trim()}
              className={`generate-btn ${
                isGenerating || !topic.trim() ? "disabled" : ""
              }`}
            >
              {isGenerating
                ? "🔄 Generating... (10-15 seconds)"
                : "Generate Lessons with AI"}
            </button>
          </form>

          <div className="popular-topics">
            <h3 className="popular-title">💡 Popular Topics:</h3>
            <div className="topic-buttons">
              {["Python", "Marketing", "Photoshop", "Spanish"].map((s) => (
                <button
                  key={s}
                  onClick={() => setTopic(s)}
                  className="topic-suggestion-btn"
                  disabled={isGenerating}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsPage;
