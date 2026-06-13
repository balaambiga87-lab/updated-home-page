"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import JourneyCard from "./JourneyCard";

export default function About() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={containerRef}
      style={{
        width: "100vw",
        background: "#ffffff",
        padding: "72px 0",
        position: "relative",
        overflow: "hidden",
        scrollMarginTop: "100px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 44px",
          display: "flex",
          flexDirection: "column",
          gap: "48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            alignItems: "center",
            gap: "54px",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 0",
          }}
        >
          {/* Left Column: Storytelling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <motion.div
              whileHover={{ 
                y: -6, 
                boxShadow: "0 30px 60px rgba(35, 47, 62, 0.06), 0 0 0 1.5px rgba(255,153,0,0.12)",
                borderColor: "rgba(255, 153, 0, 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "32px",
                border: "1.5px solid rgba(35, 47, 62, 0.08)",
                boxShadow: "0 20px 40px rgba(35, 47, 62, 0.02), inset 0 0 20px rgba(255, 255, 255, 0.6)",
                padding: "44px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "24px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "border-color 0.3s ease",
              }}
            >
              {/* Dot Grid Background */}
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(rgba(35, 47, 62, 0.025) 1.2px, transparent 1.2px)",
                backgroundSize: "20px 20px",
                pointerEvents: "none",
                zIndex: 1,
              }} />

              {/* Spotlight Glows */}
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  left: "-50px",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(0, 115, 187, 0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-50px",
                  right: "-50px",
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255, 153, 0, 0.08) 0%, transparent 70%)",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(35, 47, 62, 0.04)",
                  border: "1px solid rgba(35, 47, 62, 0.08)",
                  borderRadius: "100px",
                  padding: "6px 16px",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#232F3E",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Our Mission
                </span>
              </div>

              <h2
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
                  fontWeight: 900,
                  color: "#232F3E",
                  lineHeight: 1.2,
                  margin: 0,
                  letterSpacing: "-0.03em",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                Empowering students to{" "}
                <span style={{ 
                  background: "linear-gradient(135deg, #0073BB, #00A1EC)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900
                }}>
                  learn
                </span>
                ,{" "}
                <span style={{ 
                  background: "linear-gradient(135deg, #FF9900, #FFC061)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900
                }}>
                  build
                </span>
                , and{" "}
                <span style={{ 
                  background: "linear-gradient(135deg, #7C3AED, #A78BFA)", 
                  WebkitBackgroundClip: "text", 
                  WebkitTextFillColor: "transparent",
                  fontWeight: 900
                }}>
                  innovate
                </span>{" "}
                on AWS.
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative", zIndex: 2 }}>
                <p
                  style={{
                    fontSize: "14.5px",
                    color: "#475569",
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  AWS Student Builders Group REC is a student-driven cloud community at Rajalakshmi Engineering College dedicated to learning, building, and innovating with Amazon Web Services. We bring together aspiring developers, cloud enthusiasts, and future technology leaders to explore modern cloud technologies through practical experiences and collaborative learning.
                </p>
                <p
                  style={{
                    fontSize: "14.5px",
                    color: "#475569",
                    lineHeight: 1.7,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  By combining technical knowledge with hands-on implementation, we help students transform ideas into real-world solutions while preparing them for the rapidly evolving technology industry.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Journey Roadmap */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <JourneyCard />
          </motion.div>
        </div>

        {/* Separator line animated left to right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          style={{
            height: "1px",
            background: "linear-gradient(90deg, transparent, #FF9900, transparent)",
            width: "100%",
            transformOrigin: "left",
          }}
        />
      </div>
    </section>
  );
}
