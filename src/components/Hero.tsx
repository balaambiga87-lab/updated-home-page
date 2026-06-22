"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import CloudOrbit from "./CloudOrbit";

const ROTATING_TEXTS = [
  { icon: "☁️", text: "Mastering Cloud Computing" },
  { icon: "🚀", text: "Building Real Projects" },
  { icon: "🏆", text: "Earning Certifications" },
  { icon: "🤝", text: "Growing Your Network" },
  { icon: "🎤", text: "Exploring Workshops" },
  { icon: "💡", text: "Competing in Hackathons" },
  { icon: "🌐", text: "Expanding Industry Exposure" },
  { icon: "👨‍🏫", text: "Learning from Mentors" },
  { icon: "🎯", text: "Developing Career Skills" }
];

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Static Layout Only - Removed parallax and magnetic buttons per requirements

  return (
    <section
      id="home"
      style={{
        width: "100vw",
        minHeight: "calc(100vh - 66px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
        padding: "40px 0",
        zIndex: 2,
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes silkFlow1 {
          0% {
            transform: scale(1.02) translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: scale(1.10) translate(-25px, 15px) rotate(1deg);
          }
          66% {
            transform: scale(1.05) translate(20px, -15px) rotate(-1deg);
          }
          100% {
            transform: scale(1.02) translate(0px, 0px) rotate(0deg);
          }
        }

        @keyframes silkFlow2 {
          0% {
            transform: scale(1.10) translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: scale(1.03) translate(20px, -15px) rotate(-0.8deg);
          }
          66% {
            transform: scale(1.07) translate(-25px, 15px) rotate(0.8deg);
          }
          100% {
            transform: scale(1.10) translate(0px, 0px) rotate(0deg);
          }
        }

        .silk-bg-layer-1 {
          animation: silkFlow1 14s ease-in-out infinite;
        }

        .silk-bg-layer-2 {
          animation: silkFlow2 18s ease-in-out infinite;
        }
      `}} />

      {/* Animated Satin/Silk Background Layers */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Base Layer */}
        <div
          className="silk-bg-layer-1"
          style={{
            position: "absolute",
            inset: -60,
            backgroundImage: "url('/silk-hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform",
          }}
        />
        {/* Shimmer/Overlay Layer to simulate waving silk */}
        <div
          className="silk-bg-layer-2"
          style={{
            position: "absolute",
            inset: -60,
            backgroundImage: "url('/silk-hero-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.4,
            mixBlendMode: "overlay",
            willChange: "transform",
          }}
        />
      </div>
      {/* Subtle overlay to keep text readable against bright sky */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 255, 255, 0.08)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Main Container - transparent so cloud bg shows through */}
      <motion.div
        transition={{ duration: 0.4 }}
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: isMobile ? "32px 24px" : "36px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
          zIndex: 10,
          background: "transparent",
          borderRadius: "40px",
          position: "relative",
          overflow: "hidden",
          marginTop: isMobile ? "0px" : "-10px",
        }}
      >
        {/* Left Side: Staggered Content (Centered) */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            position: "relative",
            zIndex: 2
          }}
        >
          {/* Large Headline */}
          <motion.h1
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { type: "spring", stiffness: 150 } }
            }}
            style={{
              fontSize: "clamp(2.8rem, 6vw, 4.4rem)",
              fontWeight: 900,
              color: "#1a0a00",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "16px",
              textShadow: "0 2px 12px rgba(255,255,255,0.6)",
              textAlign: "center",
            }}
          >
            AWS Student<br />Builders Group
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { type: "spring" } }
            }}
            style={{
              fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
              fontWeight: 800,
              marginBottom: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "58px",
              position: "relative",
              width: "100%",
            }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: "450px", height: "100%", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={textIndex}
                  initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -24, filter: "blur(4px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: "1.2em", flexShrink: 0 }}>
                    {ROTATING_TEXTS[textIndex].icon}
                  </span>
                  <span
                    style={{
                      backgroundImage: "linear-gradient(90deg, #FF9900, #F7BA45, rgba(130,68,239,.8))",
                      backgroundSize: "200% auto",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "0 2px 10px rgba(130,68,239,0.1)",
                    }}
                  >
                    {ROTATING_TEXTS[textIndex].text}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { type: "spring" } }
            }}
            style={{
              fontSize: "16px",
              color: "#3d1a00",
              lineHeight: 1.8,
              marginBottom: "36px",
              maxWidth: "700px",
              textShadow: "0 1px 6px rgba(255,255,255,0.5)",
              textAlign: "center",
            }}
          >
            AWS Student Builders Group REC Chapter is a student-led cloud community focused on learning, building, and innovating with AWS. We empower students through hands-on projects, certifications, mentorship, hackathons, workshops, and industry-driven experiences that transform learners into cloud builders.
          </motion.p>
        </motion.div>

        {/* Right Side Cloud Orbit - Kept in memory per request
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flex: 1,
            position: "relative",
            zIndex: 2,
          }}
        >
          <CloudOrbit />
        </motion.div>
        */}
      </motion.div>
    </section>
  );
}
