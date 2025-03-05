import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const API_URL = "http://localhost:5000/api/users/register";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(API_URL, formData);
      alert("Registration successful!");
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setLoading(false);
      alert("Something went wrong");
      console.log(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="register-container">
      {loading && <Spinner />}
      <form className="register-form" onSubmit={handleSubmit}>
        <h1 className="register-title">Register</h1>

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="register-button">
          Register
        </button>

        <div className="register-footer">
          <p>
            Already Registered?{" "}
            <Link to="/login" className="register-link">
              Click Here to Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
