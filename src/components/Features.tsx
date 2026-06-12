"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const FEATURES_DATA = [
  {
    title: "Login Page",
    icon: "🔐",
    color: "#1e2d3d",
    desc: "Clean auth entry, secure access",
    back: "JWT auth, remember me, forgot password flow, Google OAuth",
    light: "#eef2f6",
    lighter: "#f8fafc",
  },
  {
    title: "Sign Up",
    icon: "✍",
    color: "#FF9900",
    desc: "Create your cloud identity",
    back: "Email verification, strong password rules, avatar selection",
    light: "#fff7ed",
    lighter: "#fffaf5",
  },
  {
    title: "Hero Page",
    icon: "🚀",
    color: "#0073BB",
    desc: "Your first impression",
    back: "Animated headline, CTA buttons, gradient background, scroll effects",
    light: "#f0f9ff",
    lighter: "#f8fafc",
  },
  {
    title: "Gallery",
    icon: "🖼",
    color: "#1e2d3d",
    desc: "Community moments",
    back: "Event photos, project showcases, masonry grid, lightbox",
    light: "#eef2f6",
    lighter: "#f8fafc",
  },
  {
    title: "About Us",
    icon: "👥",
    color: "#FF9900",
    desc: "Who we are",
    back: "Team section, mission, founding story, stats, milestones",
    light: "#fff7ed",
    lighter: "#fffaf5",
  },
  {
    title: "Events",
    icon: "📅",
    color: "#0073BB",
    desc: "What's happening",
    back: "Upcoming & past events, RSVP, hackathons, workshops",
    light: "#f0f9ff",
    lighter: "#f8fafc",
  },
  {
    title: "Quiz Arena",
    icon: "🎯",
    color: "#1e2d3d",
    desc: "Test your knowledge",
    back: "Timed AWS quizzes, leaderboard, streaks, difficulty levels",
    light: "#eef2f6",
    lighter: "#f8fafc",
  },
  {
    title: "News Intelligence",
    icon: "🌍",
    color: "#FF9900",
    desc: "Explore AWS globally",
    back: "3D globe, AWS region markers, live news feed, search & filter",
    light: "#fff7ed",
    lighter: "#fffaf5",
  }
];

function FeatureCard({ card, idx, inView }: { card: typeof FEATURES_DATA[0]; idx: number; inView: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 18,
        delay: idx * 0.07,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setHovered(h => !h)}
      style={{
        perspective: "1000px",
        height: "200px",
        cursor: "pointer",
        position: "relative",
        width: "100%",
      }}
    >
      <motion.div
        animate={{ rotateY: hovered ? 180 : 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          position: "relative",
        }}
      >
        {/* FRONT FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "rgba(255, 255, 255, 0.82)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(30, 45, 61, 0.08)",
            borderRadius: "20px",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: idx * 0.07 + 0.2, duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3.5px",
              background: card.color,
              transformOrigin: "left",
            }}
          />

          {/* Icon with spin animation on entrance */}
          <motion.div
            animate={inView ? { rotate: 360 } : {}}
            transition={{ duration: 0.8, delay: idx * 0.07 + 0.15 }}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "13px",
              background: `${card.color}12`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
              marginBottom: "14px",
            }}
          >
            {card.icon}
          </motion.div>

          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1d2939", marginBottom: "6px" }}>
            {card.title}
          </h3>
          <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.5, marginBottom: "auto" }}>
            {card.desc}
          </p>

          <span style={{ fontSize: "10.5px", fontWeight: 700, color: card.color, textTransform: "uppercase", letterSpacing: "0.02em" }}>
            Hover to flip →
          </span>
        </div>

        {/* BACK FACE */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, ${card.light}, ${card.lighter})`,
            border: `1.5px solid ${card.color}22`,
            borderRadius: "20px",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{card.icon}</div>
            <h3 style={{ fontSize: "14px", fontWeight: 900, color: card.color, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.02em" }}>
              {card.title}
            </h3>
            <p style={{ fontSize: "12px", color: "#4b5563", lineHeight: 1.6, fontWeight: 500 }}>
              {card.back}
            </p>
          </div>

          {/* Progress bar stat */}
          <div style={{ width: "100%", height: "4px", background: "rgba(30, 45, 61, 0.06)", borderRadius: "2px", overflow: "hidden" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={hovered ? { width: "80%" } : { width: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              style={{
                height: "100%",
                background: card.color,
                borderRadius: "2px",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="features"
      ref={ref}
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
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
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
              Platform Features
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 3.8vw, 2.8rem)",
              fontWeight: 900,
              color: "#1e2d3d",
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            Hover each card to explore.
          </h2>
          <p style={{ fontSize: "14px", color: "#4b5563", maxWidth: "450px", lineHeight: 1.6 }}>
            Deep dive into the core interactive capabilities designed for the AWS Student Builders Group platform.
          </p>
        </div>

        {/* 8-Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "18px",
          }}
        >
          {FEATURES_DATA.map((card, idx) => (
            <FeatureCard key={card.title} card={card} idx={idx} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
