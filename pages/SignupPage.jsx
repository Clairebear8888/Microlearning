import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  async function handleSignup(event) {
    event.preventDefault();
    const UserToCreate = { username, email, password };
    try {
      const createdUser = await axios.post(
        "http://localhost:5005/auth/signup",
        UserToCreate
      );
      console.log("user signup!", createdUser);
      nav("/login");
    } catch (err) {
      console.log(err.response.data.errorMessage);
      setError(err.response.data.errorMessage);
    }
  }

  return (
    <div>
      <h2>Signup with us </h2>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </label>
        <button>Sign up</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>already a member ? </p>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default SignupPage;
