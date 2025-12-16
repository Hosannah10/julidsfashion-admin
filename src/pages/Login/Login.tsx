import React, { useState } from "react";
import "./styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {BASE} from '../../api'; 

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("Invalid email or password.");
        setLoading(false);
        return;
      }

      // MUST contain is_staff
      if (!data.user?.is_staff) {
        showToast("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      showToast(`Welcome, Admin!`);
      navigate("/add-wears");

    } catch (error) {
      console.error(error);
      showToast("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card fade-in">
        <h1>Login</h1>
        <p className="subtitle">Enter your credentials</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
