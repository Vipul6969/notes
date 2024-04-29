"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Sidebar } from "@/components/sidebar/view";
import { docsConfig } from "@/config/docs";

const VoiceNote = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  const [isExplicitlyStopped, setIsExplicitlyStopped] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleStart = () => {
    if (!listening && isMicrophoneAvailable) {
      setIsExplicitlyStopped(false);
      SpeechRecognition.startListening();
    }
  };

  const handleStop = () => {
    if (listening && !isExplicitlyStopped) {
      setIsExplicitlyStopped(true);
      SpeechRecognition.stopListening();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setAlertVisible(true);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div style={{ flex: "1", padding: "1rem" }}>
        <i
          style={{
            fontSize: "2rem",
            marginBottom: "2rem",
            textAlign: "center",
            display: "block",
          }}
        >
          This is your NoteVerse Voice control, good to have you here. Lets get
          started!
        </i>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleStart}
            style={{
              background: "#34D399",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
              border: "none",
            }}
          >
            Start
          </Button>
          <Button
            variant="secondary"
            onClick={handleStop}
            style={{
              background: listening ? "#EF4444" : "#6B7280",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              cursor: listening ? "pointer" : "not-allowed",
              transition: "background 0.3s",
              border: "none",
            }}
            disabled={!listening}
          >
            Stop
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={resetTranscript}
            style={{
              background: "#6B7280",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
              border: "none",
            }}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            style={{
              background: transcript ? "#3B82F6" : "#6B7280",
              color: "#fff",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              fontWeight: "bold",
              cursor: transcript ? "pointer" : "not-allowed",
              transition: "background 0.3s",
              border: "none",
            }}
            disabled={!transcript}
          >
            Copy
          </Button>
        </div>
        <Textarea
          style={{
            border: "1px solid #D1D5DB",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            width: "100%",
            height: "12rem",
            fontSize: "1rem",
          }}
          value={transcript}
          readOnly
          placeholder="Transcript"
        />
        {alertVisible && (
          <Alert style={{ marginTop: "1rem", width: "100%" }} variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Text copied to clipboard.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VoiceNote;
