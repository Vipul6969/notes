"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/service/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { toast } = useToast();
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

        toast({
          title: "Welcome!",
          description: "Logged in successfully.",
        });

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
        justifyContent: "space-between",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: `url(/img2.jpg)`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "70%",
        }}
      ></div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30%",
        }}
      >
        <div
          style={{
            width: "fit-content",
            padding: "2rem",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            animation: "slideInRight 1s ease-in",
          }}
        >
          <h4
            style={{
              textAlign: "center",
              marginBottom: "30px",
              animation: "fadeIn 1s ease-in",
            }}
          >
            Log In
          </h4>
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
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                  fontSize: "13px",
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
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                  fontSize: "13px",
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
            <Button
              type="submit"
              variant="secondary"
              style={{ width: "100%", color: "#1abc9c" }}
            >
              Log In
            </Button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#333",
              animation: "fadeIn 1s ease-in",
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
    </div>
  );
};

export default Login;
