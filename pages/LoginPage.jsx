import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();
  const { authtenticateUser } = useContext(AuthContext);

  async function handleLogin(event) {
    event.preventDefault();
    const UserToLogin = { email, password };
    try {
      const LoginUser = await axios.post(
        "http://localhost:5005/auth/login",
        UserToLogin
      );
      console.log("user Login!", LoginUser);
      localStorage.setItem("authToken", LoginUser.data.authToken);
      await authtenticateUser();
      nav("/profile");
    } catch (err) {
      console.log(err);
      setError(err.response.data.errorMessage);
    }
  }

  return (
    <div>
      <h2>Login now</h2>

      <form onSubmit={handleLogin}>
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
        <button>Log in</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
