import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 AI-Powered Learning</div>
          <h1 className="hero-title">
            Use your spare time to get better at any
            <span className="gradient-text"> topics</span>
          </h1>
          <p className="hero-subtitle">
            Generate personalized bite-sized lessons on any subject with AI.
            Learn faster, remember better, and ace your quizzes.
          </p>
          <div className="hero-buttons">
            {isLoggedIn ? (
              <button
                onClick={() => navigate("/topics")}
                className="btn-hero-primary"
              >
                Start Learning Now
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn-hero-primary"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="btn-hero-secondary"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Lessons per Topic</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">5 min</div>
              <div className="stat-label">Average Lesson</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">∞</div>
              <div className="stat-label">Topics Available</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">🎯</div>
            <div className="card-title">JavaScript Basics</div>
            <div className="card-progress">
              <div className="progress-bar-mini">
                <div
                  className="progress-fill-mini"
                  style={{ width: "75%" }}
                ></div>
              </div>
              <span className="progress-text">12/15 lessons</span>
            </div>
          </div>

          <div className="floating-card card-2">
            <div className="card-icon">📚</div>
            <div className="card-title">Machine Learning</div>
            <div className="card-progress">
              <div className="progress-bar-mini">
                <div
                  className="progress-fill-mini"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <span className="progress-text">6/15 lessons</span>
            </div>
          </div>

          <div className="floating-card card-3">
            <div className="card-icon">✨</div>
            <div className="card-title">Quiz Score</div>
            <div className="quiz-score-display">95%</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose MicroLearn?</h2>
          <p className="section-subtitle">
            Everything you need to learn efficiently
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI-Generated Content</h3>
            <p className="feature-description">
              Get 15 personalized mini-lessons on any topic instantly. Our AI
              creates custom content tailored to your interests.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Learn in Minutes</h3>
            <p className="feature-description">
              Each lesson takes just 3-5 minutes. Perfect for busy schedules.
              Learn during coffee breaks or commutes.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Test Your Knowledge</h3>
            <p className="feature-description">
              Take AI-generated quizzes after each topic to reinforce learning
              and track your progress.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title">Track Progress</h3>
            <p className="feature-description">
              Monitor your learning journey with detailed statistics. See your
              improvement over time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3 className="feature-title">Any Topic, Anytime</h3>
            <p className="feature-description">
              From programming to photography, history to cooking. Learn
              whatever interests you, whenever you want.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3 className="feature-title">Bite-Sized Learning</h3>
            <p className="feature-description">
              Scientifically proven to improve retention. Break complex topics
              into manageable chunks.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start learning in 3 simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3 className="step-title">Choose Your Topic</h3>
              <p className="step-description">
                Enter any subject you want to learn - from quantum physics to
                guitar chords.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3 className="step-title">Learn at Your Pace</h3>
              <p className="step-description">
                Go through 15 bite-sized lessons. Mark them complete as you
                master each one.
              </p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3 className="step-title">Test & Track</h3>
              <p className="step-description">
                Take quizzes to reinforce learning and see your progress on your
                profile.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof-section">
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "I learned React basics in just one evening. The bite-sized format
              made it so easy to stay focused!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">S</div>
              <div className="author-info">
                <div className="author-name">Sarah Chen</div>
                <div className="author-role">Developer</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Perfect for my busy schedule. I can learn something new during my
              lunch break."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">M</div>
              <div className="author-info">
                <div className="author-name">Marcus Johnson</div>
                <div className="author-role">Student</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The AI-generated quizzes really help me remember what I learned.
              Game changer!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">E</div>
              <div className="author-info">
                <div className="author-name">Emily Rodriguez</div>
                <div className="author-role">Teacher</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Learning?</h2>
          <p className="cta-subtitle">
            Join thousands of learners mastering new skills every day
          </p>
          {isLoggedIn ? (
            <button onClick={() => navigate("/topics")} className="btn-cta">
              Go to Topics
            </button>
          ) : (
            <button onClick={() => navigate("/signup")} className="btn-cta">
              Create Free Account
            </button>
          )}
          <p className="cta-note">No credit card required • Free forever</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
