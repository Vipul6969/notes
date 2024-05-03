"use client";

import "regenerator-runtime/runtime";
import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { Sidebar } from "@/components/sidebar/view";
import { docsConfig } from "@/config/docs";
import { useToast } from "@/components/ui/use-toast";

const VoiceNote = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  const { toast } = useToast();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser does not support speech recognition.</span>;
  }

  const handleStart = () => {
    if (isMicrophoneAvailable) {
      const recognitionOptions = {
        continuous: true,
        interimResults: true,
      };
      SpeechRecognition.startListening(recognitionOptions);
    }
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    toast({
      title: "Copied",
      description: "Your voice text has been copied.",
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ flex: "0 0 10%" }}>
        <Sidebar items={docsConfig.sidebarNav} />
      </div>
      <div style={{ flex: "1", padding: "1rem" }}>
        <h1 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Welcome to NoteVerse Voice Control
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleStart}
            disabled={listening || !isMicrophoneAvailable}
          >
            Start Recording
          </Button>
          <Button
            variant="destructive"
            onClick={handleStop}
            disabled={!listening}
          >
            Stop Recording
          </Button>
        </div>
        <Textarea
          value={transcript}
          readOnly
          placeholder="Transcript"
          style={{ marginBottom: "1rem", minHeight: "15rem" }}
        />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="secondary"
            onClick={resetTranscript}
            disabled={!transcript}
            style={{ marginRight: "0.5rem" }}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopy}
            disabled={!transcript}
          >
            Copy Transcript
          </Button>
        </div>
        {/* {alertVisible && (
         
          <Button
      onClick={() => {
      
      }}
    >
      Show Toast
    </Button>
        )} */}
      </div>
    </div>
  );
};

export default VoiceNote;
