"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { REVIEWS } from "@/lib/reviewsData";

const ReviewIcon = ({ tag, color }: { tag: string; color: string }) => {
  if (tag === "Cloud Basics") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
};

const GAP = 28;

export default function ReviewsMarquee() {
  const [isPaused, setIsPaused] = useState(false);
  const [trackOffset, setTrackOffset] = useState(0);
  const firstHalfRef = useRef<HTMLDivElement>(null);
  const marqueeReviews = REVIEWS.filter(r => !r.featured);

  const measure = useCallback(() => {
    if (firstHalfRef.current) {
      setTrackOffset(firstHalfRef.current.offsetWidth + GAP);
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, marqueeReviews.length]);

  return (
    <section
      id="reviews"
      style={{
        width: "100vw",
        background: "linear-gradient(180deg, #FFFDF9 0%, #FFFFFF 50%, #FFFDF9 100%)",
        padding: "60px 0 48px",
        position: "relative",
        overflow: "hidden",
        zIndex: 10,
        scrollMarginTop: "100px",
      }}
    >
      <div style={{ position: "absolute", top: "-10%", left: "5%", width: "45vw", height: "45vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,153,0,.1) 0%,rgba(255,153,0,.03) 30%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-10%", right: "5%", width: "40vw", height: "40vw", borderRadius: "50%", background: "radial-gradient(circle,rgba(35,47,62,.05) 0%,rgba(35,47,62,.02) 30%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 24px" }}>
        <h2 style={{ 
          fontSize: "clamp(26px, 3.5vw, 36px)", 
          fontWeight: 900, 
          color: "#232F3E", 
          margin: "0 0 10px 0", 
          letterSpacing: "-0.02em",
          lineHeight: 1.2 
        }}>
          What Our Builders Say
        </h2>
        <p style={{ 
          fontSize: 15, 
          color: "#475569", 
          margin: 0, 
          fontWeight: 500, 
          maxWidth: 600, 
          marginLeft: "auto", 
          marginRight: "auto", 
          lineHeight: 1.6 
        }}>
          Real feedback and experiences from active community members building their cloud foundations.
        </p>
      </div>

      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{
          width: "100%",
          display: "flex",
          overflow: "hidden",
          position: "relative",
          padding: "20px 0",
        }}
      >
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(90deg, #FFFDF9, transparent)", zIndex: 5, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "120px", background: "linear-gradient(270deg, #FFFDF9, transparent)", zIndex: 5, pointerEvents: "none" }} />

        <div
          style={{
            display: "flex",
            gap: GAP,
            width: "max-content",
            ["--marquee-offset" as string]: `${trackOffset}px`,
            animation: trackOffset > 0 ? `marquee-pixel 20s linear infinite` : "none",
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {/* Second half — starts visible on left */}
          <div style={{ display: "flex", gap: GAP }}>
            {marqueeReviews.map((review, idx) => (
              <motion.div
                key={`b-${idx}`}
                whileHover={{ y: -8, scale: 1.03, boxShadow: `0 0 30px ${review.color}30, 0 0 60px ${review.color}15, 0 28px 56px rgba(15,23,42,0.08), 0 0 0 1px ${review.color}30` }}
                style={{
                  width: 340,
                  height: 250,
                  background: "#FFFFFF",
                  borderRadius: 20,
                  boxShadow: `0 0 20px ${review.color}12, 0 0 40px ${review.color}06, 0 2px 20px rgba(0,0,0,0.04), 0 0 0 1px ${review.color}15`,
                  padding: "28px 28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${review.color}18 0%, ${review.color}05 40%, transparent 70%)`, filter: "blur(25px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: `linear-gradient(135deg, ${review.color}15 0%, ${review.color}08 100%)`, pointerEvents: "none" }} />
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${review.color}12`, border: `1px solid ${review.color}20`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <ReviewIcon tag={review.tag} color={review.color} />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.01em" }}>{review.name}</h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, fontWeight: 600, color: review.color }}>{review.role}</p>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.6, position: "relative", zIndex: 1, flex: 1 }}>{review.text}</p>
              </motion.div>
            ))}
          </div>
          {/* First half — slides in from left */}
          <div ref={firstHalfRef} style={{ display: "flex", gap: GAP }}>
            {marqueeReviews.map((review, idx) => (
              <motion.div
                key={`a-${idx}`}
                whileHover={{ y: -8, scale: 1.03, boxShadow: `0 0 30px ${review.color}30, 0 0 60px ${review.color}15, 0 28px 56px rgba(15,23,42,0.08), 0 0 0 1px ${review.color}30` }}
                style={{
                  width: 340,
                  height: 250,
                  background: "#FFFFFF",
                  borderRadius: 20,
                  boxShadow: `0 0 20px ${review.color}12, 0 0 40px ${review.color}06, 0 2px 20px rgba(0,0,0,0.04), 0 0 0 1px ${review.color}15`,
                  padding: "28px 28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  cursor: "pointer",
                  transition: "all 0.35s ease",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${review.color}18 0%, ${review.color}05 40%, transparent 70%)`, filter: "blur(25px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: `linear-gradient(135deg, ${review.color}15 0%, ${review.color}08 100%)`, pointerEvents: "none" }} />
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${review.color}12`, border: `1px solid ${review.color}20`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1 }}>
                  <ReviewIcon tag={review.tag} color={review.color} />
                </div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1E293B", letterSpacing: "-0.01em" }}>{review.name}</h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: 12, fontWeight: 600, color: review.color }}>{review.role}</p>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.6, position: "relative", zIndex: 1, flex: 1 }}>{review.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
