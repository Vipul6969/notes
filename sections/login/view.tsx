"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/service/firebase";
import { paths } from "@/paths";

const Login = () => {
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

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response);
        alert("Logged in successfully.");
        try {
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Error redirecting to dashboard:", error);
        }
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setError("Login failed. Please check your credentials and try again.");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #3498db, #2ecc71)",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#333",
            textTransform: "uppercase",
            fontSize: "36px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Log In
        </h2>
        <form onSubmit={handleSubmit}>
          <div
            style={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
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
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                fontSize: "16px",
                transition: "border-color 0.3s",
              }}
              required
            />
          </div>
          <div
            style={{
              position: "relative",
              marginBottom: "30px",
            }}
          >
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
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                fontSize: "16px",
                transition: "border-color 0.3s",
              }}
              required
            />
          </div>
          {error && (
            <p
              style={{
                color: "red",
                marginBottom: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            style={{
              display: "block",
              width: "100%",
              padding: "15px",
              backgroundColor: "#1abc9c",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "background-color 0.3s",
              marginBottom: "10px",
            }}
          >
            Log In
          </button>
        </form>
        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#333",
          }}
        >
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            style={{ color: "#1abc9c", fontWeight: "bold" }}
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
