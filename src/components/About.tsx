"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import CloudStory from "./CloudStory";
export default function About() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-80px" });
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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
            gridTemplateColumns: "1fr 1fr",
            alignItems: "center",
            gap: "48px",
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 44px",
          }}
        >
          {/* Left Column: Storytelling */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignSelf: "center" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(35, 47, 62, 0.04)",
                border: "1px solid rgba(35, 47, 62, 0.08)",
                borderRadius: "100px",
                padding: "5px 14px",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#232F3E",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Our Mission
              </span>
            </div>

            <h2
              style={{
                fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
                fontWeight: 900,
                color: "#232F3E",
                lineHeight: 1.15,
                marginBottom: "24px",
                letterSpacing: "-0.02em",
              }}
            >
              Empowering students to learn, build, and innovate on AWS.
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#4b5563",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}
            >
              AWS Student Builders Group REC is a student-led cloud community dedicated to learning, innovation, and collaboration. Our mission is to bridge the gap between academic knowledge and industry expectations by providing hands-on exposure to cloud technologies, modern software development, and real-world problem solving.
            </p>
            <p
              style={{
                fontSize: "15px",
                color: "#4b5563",
                lineHeight: 1.8,
              }}
            >
              Through mentorship, technical workshops, hackathons, certification pathways, and project-based learning, we cultivate a culture where students continuously learn, build, and grow together as future cloud professionals, innovators, and technology leaders.
            </p>
          </motion.div>

          {/* Right Column: Cloud Storytelling */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", alignSelf: "center", width: "100%", position: "relative" }}>
            <CloudStory />
          </div>
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
