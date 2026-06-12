"use client";
import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

const EVENTS_DATA = [
  {
    date: "OCT 2025",
    type: "HACKATHON",
    title: "Cloud Jam '25",
    desc: "120 students building serverless pipelines in 24 hours.",
    rsvp: "120+ Builders",
    isHackathon: true
  },
  {
    date: "FEB 2026",
    type: "MEETUP",
    title: "Generative AI Panel",
    desc: "Exploring Bedrock & LLMs for campus applications.",
    rsvp: "150+ RSVP",
    isMeetup: true
  },
  {
    date: "MAR 2026",
    type: "WORKSHOP",
    title: "Cloud Practitioner Bootcamp",
    desc: "Intensive 2-day exam prep with mock tests included.",
    rsvp: "80+ RSVP",
    isWorkshop: true
  },
  {
    date: "APR 2026",
    type: "HACKATHON",
    title: "Build on AWS Hackathon",
    desc: "24-hour build challenge — prizes and certificates.",
    rsvp: "200+ Builders",
    isHackathon: true
  }
];

export default function Events() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-60px" });

  // Magnetic Button state
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 20 });
  const sy = useSpring(my, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      id="events"
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
      {/* Decorative Blob */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30, 45, 61, 0.03) 0%, transparent 70%)",
          animation: "blob 20s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 44px",
          display: "grid",
          gridTemplateColumns: "1fr 1.15fr",
          gap: "64px",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}
        >
          {/* Eyebrow badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(30, 45, 61, 0.05)",
              border: "1px solid rgba(30, 45, 61, 0.12)",
              borderRadius: "100px",
              padding: "5px 14px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#1e2d3d",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Upcoming Events
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
              fontWeight: 900,
              color: "#1e2d3d",
              marginBottom: "18px",
              letterSpacing: "-0.01em",
            }}
          >
            Never stop{" "}
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, #1e2d3d, #FF9900, #1e2d3d)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradShift 4s ease infinite",
                fontWeight: 900,
              }}
            >
              building
            </span>
          </h2>

          {/* Description */}
          <p style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.82, marginBottom: "32px", maxWidth: "380px" }}>
            Expand your skills through peer learning. From beginner hackathons to advanced serverless panels, find your next challenge here.
          </p>

          {/* Magnetic CTA Button */}
          <motion.button
            style={{ x: sx, y: sy }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={{ y: -3, boxShadow: "0 10px 24px rgba(30, 45, 61, 0.35)", backgroundColor: "#162032" }}
            whileTap={{ scale: 0.96 }}
            className="magnetic-btn"
          >
            <span
              style={{
                display: "block",
                padding: "13px 32px",
                borderRadius: "100px",
                border: "none",
                background: "#1e2d3d",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.2s ease",
              }}
            >
              Register for Events
            </span>
          </motion.button>
        </motion.div>

        {/* Right Column (Events Card list) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {EVENTS_DATA.map((event, idx) => {
            let badgeBg = "#1e2d3d";
            if (event.isMeetup) {
              badgeBg = "linear-gradient(135deg, #FF9900, #E68900)";
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  delay: idx * 0.1,
                }}
                whileHover={{
                  x: 6,
                  scale: 1.01,
                  background: "#ffffff",
                  boxShadow: "0 10px 30px rgba(30, 45, 61, 0.06)",
                }}
                style={{
                  background: "rgba(255, 255, 255, 0.82)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid #f0ebe3",
                  borderRadius: "16px",
                  padding: "18px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  transition: "background 0.25s ease, box-shadow 0.25s ease, x 0.25s ease",
                }}
              >
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>
                    {event.date}
                  </span>
                  <span
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: "100px",
                      background: badgeBg,
                      color: "#ffffff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {event.type}
                  </span>
                </div>

                {/* Content */}
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1d2939", marginBottom: "6px" }}>
                  {event.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.5, marginBottom: "12px" }}>
                  {event.desc}
                </p>

                {/* RSVP Count */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: "#9ca3af", fontWeight: 700 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>{event.rsvp}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
