"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/service/firebase";
import { Button } from "@/components/ui/button";
import db from "@/db/drizzle";
import { user } from "@/db/scheme";
import { eq } from "drizzle-orm";
import { serialize } from "cookie";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    try {
      if (!email || !email.trim()) {
        setError("Email cannot be empty.");
        return;
      }

      if (!password || !password.trim()) {
        setError("Password cannot be empty.");
        return;
      }

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      const { uid } = response.user;

      const checkIfUserExists = await db
        .select()
        .from(user)
        .where(eq(user.id, uid));

      if (checkIfUserExists.length) {
        console.log("User Exists");
      }

      const userData = await db
        .insert(user)
        .values({
          id: uid,
          email: response.user.email || " ",
          createdAt: response.user.metadata.creationTime || undefined,
        })
        .returning();

      console.log(userData);

      const idToken = await response.user.getIdToken();
      const cookie = serialize(idToken, JSON.stringify({
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }));
      

      localStorage.setItem("mySecret", cookie);
      console.log("cookie:", cookie);

      toast({
        title: "Welcome!",
        description: "User Registered Successfully.",
      });

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);

      window.location.href = "/login";
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again later.");
    }

    setEmail("");
    setPassword("");
    setError(null);
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
          background: `url(/img3.jpg)`,
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
            Create an Account
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
              style={{ width: "100%", color: "#007bff" }}
            >
              Sign Up
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
            Already have an account?{" "}
            <Link
              href="/login"
              style={{ color: "#007bff", fontWeight: "bold" }}
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
