"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Card data ─────────────────────────────────────────────────────────── */
const CARDS = [
  {
    gradient: "linear-gradient(135deg,rgb(130,68,239),#4a7a9b)",
    label: "☁ Cloud Matrix",
    sublabel: "120+ builders · Oct 2025 · 24 hours",
    emoji: "☁",
    image: "/images/cloud_jam.jpg",
    description: "An intensive cloud computing hackathon challenge where student builders collaborate in teams to architect, deploy, and scale innovative solutions on AWS. A true 24-hour sprint from concept to a production-ready application.",
  },
  {
    gradient: "linear-gradient(135deg,#0073BB,#005f9e)",
    label: "🤖 Cloud Matrix",
    sublabel: "Bedrock & LLMs · Feb 2026",
    emoji: "🤖",
    image: "/images/ai_workshop.jpg",
    description: "A comprehensive generative AI hands-on session focusing on Amazon Bedrock. Students explored building applications using large language models (LLMs), prompt engineering, and building agentic assistants.",
  },
  {
    gradient: "linear-gradient(135deg,#FF9900,#E68900)",
    label: "🎤 Community Meetup",
    sublabel: "150+ members · Networking",
    emoji: "🎤",
    image: "/images/community_meetup.jpg",
    description: "A community gathering bringing together cloud practitioners, student developers, and tech professionals to network, share case studies, and discuss the latest industry innovations.",
  },
  {
    gradient: "linear-gradient(135deg,#2c4a62,#3d6680)",
    label: "🎤 Community Meetup",
    sublabel: "100+ students certified",
    emoji: "🎤",
    image: "/images/bootcamp.jpg",
    description: "A focused interactive workspace session where students collaborated on preparation for AWS certifications, shared learnings from technical bootcamps, and engaged in peer mentoring.",
  },
  {
    gradient: "linear-gradient(135deg,#005f9e,#0073BB)",
    label: "💡 Cloud Matrix Event",
    sublabel: "re:Invent Watch Party",
    emoji: "💡",
    image: "/images/ai_workshop.jpg",
    description: "An expert panel discussion and watch party highlighting the most exciting announcements and technical breakthroughs from AWS re:Invent, sharing actionable insights for developers.",
  },
  {
    gradient: "linear-gradient(135deg,#243448,#2d4f6b)",
    label: "🤖 Robo Wolke",
    sublabel: "Robotics & IoT Showcase · Dobot Magician",
    emoji: "🤖",
    image: "/images/robo_wolke_journey.jpg",
    description: "An experimental robotics exhibition demonstrating the integration of cloud computing with physical hardware. The showcase highlighted controlling Dobot Magician robotic arms using AWS-backed cloud services.",
  },
];

/* ─── Stack layout constants ────────────────────────────────────────────── */
const CARD_H     = 500;   // card height px
const Y_STEP     = 14;    // vertical offset per depth level (stack peek)
const SCALE_STEP = 0.04;  // scale reduction per depth level
const AUTO_MS    = 2800;  // auto-advance interval (ms)
const N          = CARDS.length;

/* ─── Shared card face ──────────────────────────────────────────────────── */
function CardFace({
  card,
  index,
  total,
}: {
  card: (typeof CARDS)[0];
  index: number;
  total: number;
}) {
  return (
    <>
      {/* Gradients for text and badge contrast */}
      {card.image && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.3) 50%, transparent 100%)",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "90px",
              background: "linear-gradient(to bottom, rgba(15, 23, 42, 0.4) 0%, transparent 100%)",
              zIndex: 1,
            }}
          />
        </>
      )}
      
      {/* Dot-grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.08) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Watermark emoji */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-58%)",
          fontSize: 100,
          opacity: card.image ? 0.05 : 0.12,
          pointerEvents: "none",
          userSelect: "none",
          lineHeight: 1,
          zIndex: 2,
        }}
      >
        {card.emoji}
      </div>

      {/* Counter badge — top right */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          background: "rgba(255,255,255,.18)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,.28)",
          borderRadius: 100,
          padding: "4px 12px",
          fontSize: 12,
          fontWeight: 700,
          color: "#fff",
          zIndex: 5,
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* Bottom Glassmorphic Panel containing Label, Sublabel, and Description */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          background: "rgba(15, 23, 42, 0.72)",
          backdropFilter: "blur(20px) saturate(140%)",
          WebkitBackdropFilter: "blur(20px) saturate(140%)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 20,
          padding: "24px 28px",
          zIndex: 5,
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
          pointerEvents: "auto", // allow text selection / interaction inside card
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: 800,
            color: "#FF9900",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "6px",
          }}
        >
          {card.sublabel}
        </div>
        <div
          style={{
            fontSize: "clamp(20px, 3.5vw, 24px)",
            fontWeight: 800,
            color: "#FFFFFF",
            marginBottom: "10px",
            lineHeight: 1.2,
          }}
        >
          {card.label}
        </div>
        <p
          style={{
            fontSize: "clamp(13px, 2vw, 14.5px)",
            color: "rgba(255, 255, 255, 0.85)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {card.description}
        </p>
      </div>
    </>
  );
}

/* ─── Gallery ───────────────────────────────────────────────────────────── */
export default function Gallery() {
  /* order[0] = top card, order[N-1] = bottom card */
  const [order, setOrder] = useState<number[]>(() =>
    CARDS.map((_, i) => i)
  );
  const [flyingIdx, setFlyingIdx] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [paused, setPaused] = useState(false);

  /* ── Advance: top card flies up, deck rotates ─────────────────────── */
  const advance = useCallback(() => {
    if (isBusy) return;
    setIsBusy(true);

    const topCardIdx = order[0];
    setFlyingIdx(topCardIdx); // overlay takes over

    // Rotate deck instantly — layout spring handles reposition
    setOrder((prev) => {
      const [first, ...rest] = prev;
      return [...rest, first]; // top card goes to bottom
    });

    // Flying card exits over ~500ms, then we're done
    setTimeout(() => {
      setFlyingIdx(null);
      setIsBusy(false);
    }, 520);
  }, [isBusy, order]);

  /* ── Auto-advance ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(advance, AUTO_MS);
    return () => clearInterval(t);
  }, [advance, paused]);

  const currentTopCard = CARDS[order[0]];

  return (
    <section
      id="gallery"
      style={{
        width: "100vw",
        minHeight: "100vh",
        padding: "100px 24px 80px",
        background: "#0b0f19", // Solid rich dark background to prevent bleed-through
        position: "relative",
        zIndex: 2, // Layer above fixed light-gradient background
        overflow: "hidden",
        scrollMarginTop: "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      {/* ── Immersive Blurred Background ──────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentTopCard.image}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }} // Increased for richer ambient glow
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${currentTopCard.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "blur(40px) scale(1.15)", // Slightly more blur and scale for smooth edges
            }}
          />
        </AnimatePresence>
        {/* Dark overlay to ensure contrast and premium feel */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%)",
          }}
        />
      </div>

      {/* ── Centered Heading ──────────────────────────────────────── */}
      <div
        style={{
          zIndex: 2,
          textAlign: "center",
          maxWidth: "800px",
          marginBottom: "48px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#FF9900",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            display: "inline-block",
            marginBottom: "12px",
          }}
        >
          Interactive Showcase
        </span>
        <h2
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            margin: "0 0 16px 0",
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          Highlights From Our Builder Journey
        </h2>
        <p
          style={{
            fontSize: "clamp(15px, 1.8vw, 17px)",
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: 1.6,
            margin: 0,
            textShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        >
          Explore our hackathons, hands-on workshops, meetups, bootcamps, and robotics exhibitions.
        </p>
      </div>

      {/* ── Centered Photo Stack Container ────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "850px",
          height: CARD_H + (N - 1) * Y_STEP + 30,
          margin: "0 auto",
          zIndex: 2,
          cursor: isBusy ? "wait" : "pointer",
        }}
        onClick={advance}
      >
        {/* Stack cards — rendered back-to-front (bottom first) */}
        {[...order].reverse().map((cardIdx, revDepth) => {
          const depth = N - 1 - revDepth;
          const card = CARDS[cardIdx];
          const isTop = depth === 0;

          return (
            <motion.div
              key={cardIdx}
              layout
              animate={{
                y: depth * Y_STEP,
                scale: 1 - depth * SCALE_STEP,
                opacity:
                  isTop && flyingIdx === cardIdx
                    ? 0
                    : 1 - depth * 0.06,
              }}
              transition={{
                layout: { type: "spring", stiffness: 260, damping: 28 },
                opacity: { duration: 0.05 },
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: CARD_H,
                borderRadius: 24,
                overflow: "hidden",
                background: card.gradient,
                zIndex: N - depth,
                transformOrigin: "top center",
                boxShadow: isTop
                  ? "0 24px 56px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,153,0,0.2), 0 0 30px rgba(255,153,0,0.12)"
                  : "0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,153,0,0.08)",
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {/* Photo background for stack depth */}
              {card.image && (
                <img
                  src={card.image}
                  alt={card.label}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    zIndex: 0,
                    opacity: isTop ? 1 : 0.75,
                  }}
                />
              )}
              {/* Dimming shadow for cards deeper in stack */}
              {!isTop && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(15, 23, 42, 0.22)",
                    zIndex: 1,
                  }}
                />
              )}
              {isTop && <CardFace card={card} index={cardIdx} total={N} />}
            </motion.div>
          );
        })}

        {/* Flying card overlay — exits upward */}
        <AnimatePresence>
          {flyingIdx !== null && (
            <motion.div
              key="flying"
              initial={{ y: 0, scale: 1, opacity: 1, rotateX: 0 }}
              animate={{
                y: -CARD_H * 1.4,
                scale: 0.82,
                opacity: 0,
                rotateX: -20,
              }}
              exit={{}}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: CARD_H,
                borderRadius: 24,
                overflow: "hidden",
                background: CARDS[flyingIdx].gradient,
                zIndex: N + 10,
                pointerEvents: "none",
                transformOrigin: "top center",
                boxShadow: "0 24px 56px rgba(0,0,0,0.55)",
              }}
            >
              {CARDS[flyingIdx].image && (
                <img
                  src={CARDS[flyingIdx].image}
                  alt={CARDS[flyingIdx].label}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    zIndex: 0,
                  }}
                />
              )}
              <CardFace
                card={CARDS[flyingIdx]}
                index={flyingIdx}
                total={N}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Centered Controls Below Photo Stack ────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          marginTop: "44px",
          zIndex: 2,
          position: "relative",
        }}
      >
        {/* Dot progress indicators */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {CARDS.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                width: order[0] === i ? 28 : 10,
                backgroundColor:
                  order[0] === i ? "#FF9900" : "rgba(255, 255, 255, 0.35)",
              }}
              transition={{ duration: 0.3 }}
              style={{ height: 10, borderRadius: 100, cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent advancing the deck on dot click
                if (isBusy) return;
                const steps = (order.indexOf(i) + N) % N;
                if (steps === 0) return;
                let count = 0;
                const tick = () => {
                  if (count >= steps) return;
                  count++;
                  advance();
                  if (count < steps) setTimeout(tick, AUTO_MS * 0.18);
                };
                tick();
              }}
            />
          ))}
        </div>

        {/* Play/Pause Button and click hint */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <motion.button
            onClick={(e) => {
              e.stopPropagation(); // Prevent advancing the deck on button click
              setPaused((p) => !p);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 24px",
              borderRadius: 100,
              border: "1px solid rgba(255, 255, 255, 0.25)",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              outline: "none",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            {paused ? "▶ Play" : "⏸ Pause"}
          </motion.button>
          
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255, 255, 255, 0.6)",
              letterSpacing: "0.02em",
            }}
          >
            Click photo to advance
          </span>
        </div>
      </div>
    </section>
  );
}
