"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/service/firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!email || !email.trim()) {
      setError("Email cannot be empty.");
      return;
    }

    if (!password || !password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response);
        alert("User Registered Successfully.");

        localStorage.setItem("userEmail", email);
        localStorage.setItem("userPassword", password);

        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Error registering user:", error);
        setError("Registration failed. Please try again later.");
      });

    setEmail("");
    setPassword("");
    setError(null);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #1e3c72, #2a5298)",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f5f5f5",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
            textTransform: "uppercase",
          }}
        >
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: "5px", color: "#333" }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderBottom: "2px solid #ddd",
                borderRadius: "0",
                backgroundColor: "#f5f5f5",
                fontSize: "16px",
                transition: "border-color 0.3s",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "30px" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "5px", color: "#333" }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderBottom: "2px solid #ddd",
                borderRadius: "0",
                backgroundColor: "#f5f5f5",
                fontSize: "16px",
                transition: "border-color 0.3s",
              }}
              required
            />
          </div>
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}
          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "15px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "20px", color: "#333" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#007bff" }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
