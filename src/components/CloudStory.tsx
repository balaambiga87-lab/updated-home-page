"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ArrowButton = ({ isLeft, hovered, onClick }: { isLeft: boolean; hovered: boolean; onClick: () => void }) => {
  const [btnHovered, setBtnHovered] = React.useState(false);
  return (
    <motion.button
      onMouseEnter={() => setBtnHovered(true)}
      onMouseLeave={() => setBtnHovered(false)}
      initial={{ opacity: 0, x: isLeft ? -8 : 8, y: "-50%" }}
      animate={{ 
        opacity: hovered ? 1 : 0, 
        x: hovered ? 0 : (isLeft ? -8 : 8),
        y: "-50%",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      whileHover={{ scale: 1.12, backgroundColor: "#232F3E", borderColor: "#232F3E" }}
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      style={{
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        border: "1.5px solid rgba(35,47,62,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "absolute",
        top: "50%",
        zIndex: 10,
        ...(isLeft ? { left: "-22px" } : { right: "-22px" })
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={btnHovered ? "#FFFFFF" : "#232F3E"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.3s" }}>
        {isLeft ? (
          <polyline points="15 18 9 12 15 6" />
        ) : (
          <polyline points="9 18 15 12 9 6" />
        )}
      </svg>
    </motion.button>
  );
};

const STORIES = [
  {
    id: "s1",
    title: "Who We Are",
    desc: "A student-led cloud community at Rajalakshmi Engineering College focused on learning, building, and growing with AWS technologies."
  },
  {
    id: "s2",
    title: "What We Do",
    desc: "We organize workshops, technical sessions, hackathons, and collaborative projects that help students gain practical cloud experience."
  },
  {
    id: "s3",
    title: "Why Join Us",
    desc: "Gain hands-on skills, build your network, explore emerging technologies, and become part of a supportive learning ecosystem."
  },
  {
    id: "s4",
    title: "Our Mission",
    desc: "To empower students with industry-relevant cloud knowledge and prepare them for future careers in technology."
  },
  {
    id: "s5",
    title: "Our Community",
    desc: "A diverse group of learners, developers, innovators, and aspiring cloud professionals who grow together through collaboration."
  },
  {
    id: "s6",
    title: "Your Journey Starts Here",
    desc: "Whether you're a beginner or an experienced builder, AWS SBG REC provides opportunities to learn, create, and lead."
  },
  {
    id: "s7",
    title: "What We Offer",
    desc: "Hands-on AWS workshops, certification prep, hackathons, mentorship sessions, and real project experience that transforms students into cloud professionals."
  },
  {
    id: "s9",
    title: "Join the Movement",
    desc: "Whether you are a complete beginner or an experienced developer, AWS SBG REC welcomes you. Start your cloud journey with a community that builds together."
  },
  {
    id: "s10",
    title: "Our Values",
    desc: "Learn by doing. Share what you know. Build what matters. We believe in open collaboration, peer mentorship, and the power of community-driven cloud innovation."
  }
];

export default function CloudStory() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);

  const totalSlides = STORIES.length;

  const nextSlide = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setDirection(1);
    setIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    setTimeout(() => setIsFlipping(false), 500);
  };

  const prevSlide = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setDirection(-1);
    setIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    setTimeout(() => setIsFlipping(false), 500);
  };

  useEffect(() => {
    if (isHovered || isFlipping) return;
    const timer = setInterval(() => {
      setIsFlipping(true);
      setDirection(1);
      setIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
      setTimeout(() => setIsFlipping(false), 500);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHovered, isFlipping, index]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, isFlipping]);

  const pageVariants = {
    enter: (dir: number) => ({
      rotateY: dir > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.9,
      transformOrigin: dir > 0 ? "left center" : "right center",
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformOrigin: "center center",
      transition: {
        rotateY: {
          type: "spring",
          stiffness: 180,
          damping: 22,
        },
        opacity: {
          duration: 0.25,
          ease: "easeIn",
        },
        scale: {
          type: "spring",
          stiffness: 180,
          damping: 22,
        },
      },
    },
    exit: (dir: number) => ({
      rotateY: dir > 0 ? -90 : 90,
      opacity: 0,
      scale: 0.88,
      transformOrigin: dir > 0 ? "right center" : "left center",
      transition: {
        rotateY: {
          duration: 0.3,
          ease: [0.4, 0, 1, 1],
        },
        opacity: {
          duration: 0.18,
          ease: "easeIn",
        },
      },
    }),
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1000px",
      }}
    >
      {/* Container for the animated cloud cards */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "650px",
          aspectRatio: "520 / 320",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ArrowButton isLeft={true} hovered={isHovered} onClick={prevSlide} />

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror"
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            filter: "drop-shadow(0 24px 32px rgba(35, 47, 62, 0.12))",
          }}
        >
          {/* NEW SINGLE SVG CLOUD (Wide and Flat) */}
          <svg 
            viewBox="0 0 520 320"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="cloudFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1"/>
                <stop offset="25%" stopColor="#E8F4FD" stopOpacity=".75"/>
                <stop offset="60%" stopColor="#FFF3E0" stopOpacity=".70"/>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1"/>
              </linearGradient>

              <radialGradient id="cloudGlow" cx="72%" cy="80%" r="38%">
                <stop offset="0%" stopColor="#FF9900" stopOpacity=".22"/>
                <stop offset="100%" stopColor="#FF9900" stopOpacity="0"/>
              </radialGradient>

              <radialGradient id="cloudGlowBlue" cx="28%" cy="22%" r="35%">
                <stop offset="0%" stopColor="#0073BB" stopOpacity=".16"/>
                <stop offset="100%" stopColor="#0073BB" stopOpacity="0"/>
              </radialGradient>

              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#0073BB" stopOpacity="0.4"/>
                <stop offset="70%" stopColor="#FF9900" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9"/>
              </linearGradient>
            </defs>

            {/* Base fill */}
            <path 
              d="M 130,270 Q 30,270 30,195 Q 30,145 75,128 Q 72,118 72,108 Q 72,68 110,55 Q 130,48 152,56 Q 168,28 200,22 Q 235,15 258,38 Q 278,16 312,18 Q 350,20 362,52 Q 385,42 408,52 Q 440,62 442,98 Q 442,110 436,122 Q 488,138 488,192 Q 488,270 388,270 Z" 
              fill="url(#cloudFill)" 
            />
            
            {/* Orange glow */}
            <path 
              d="M 130,270 Q 30,270 30,195 Q 30,145 75,128 Q 72,118 72,108 Q 72,68 110,55 Q 130,48 152,56 Q 168,28 200,22 Q 235,15 258,38 Q 278,16 312,18 Q 350,20 362,52 Q 385,42 408,52 Q 440,62 442,98 Q 442,110 436,122 Q 488,138 488,192 Q 488,270 388,270 Z" 
              fill="url(#cloudGlow)" 
            />
            
            {/* Blue glow */}
            <path 
              d="M 130,270 Q 30,270 30,195 Q 30,145 75,128 Q 72,118 72,108 Q 72,68 110,55 Q 130,48 152,56 Q 168,28 200,22 Q 235,15 258,38 Q 278,16 312,18 Q 350,20 362,52 Q 385,42 408,52 Q 440,62 442,98 Q 442,110 436,122 Q 488,138 488,192 Q 488,270 388,270 Z" 
              fill="url(#cloudGlowBlue)" 
            />
            
            {/* Outline */}
            <path 
              d="M 130,270 Q 30,270 30,195 Q 30,145 75,128 Q 72,118 72,108 Q 72,68 110,55 Q 130,48 152,56 Q 168,28 200,22 Q 235,15 258,38 Q 278,16 312,18 Q 350,20 362,52 Q 385,42 408,52 Q 440,62 442,98 Q 442,110 436,122 Q 488,138 488,192 Q 488,270 388,270 Z" 
              fill="none" 
              stroke="url(#strokeGrad)" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Text Content */}
          <div 
            style={{ 
              position: "relative", 
              zIndex: 10, 
              width: "80%", 
              height: "70%",
              perspective: "800px",
              perspectiveOrigin: "center center",
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -50) nextSlide();
                  if (info.offset.x > 50) prevSlide();
                }}
                style={{
                  cursor: "default",
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 40px",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "2px",
                    background: "#FF9900",
                    borderRadius: "2px",
                    margin: "0 auto 10px",
                  }}
                />
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "#232F3E",
                    marginBottom: "12px",
                    letterSpacing: "-0.02em",
                    textAlign: "center"
                  }}
                >
                  {STORIES[index].title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#4b5563",
                    lineHeight: 1.75,
                    fontWeight: 500,
                    textAlign: "center",
                    maxWidth: "320px",
                    margin: "0 auto"
                  }}
                >
                  {STORIES[index].desc}
                </p>
                <div
                  style={{
                    marginTop: "14px",
                    display: "inline-block",
                    padding: "3px 12px",
                    borderRadius: "100px",
                    background: "rgba(35,47,62,.06)",
                    border: "1px solid rgba(35,47,62,.1)",
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#232F3E",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                  }}
                >
                  AWS SBG REC
                </div>

                {/* Glare sweep during flip */}
                <motion.div
                  initial={{ opacity: 0, x: "-100%" }}
                  animate={isFlipping
                    ? { opacity: [0, 0.3, 0], x: ["-100%", "100%"] }
                    : { opacity: 0 }
                  }
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.18) 50%, transparent 75%)",
                    pointerEvents: "none",
                    zIndex: 10,
                    borderRadius: "inherit",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      
        <ArrowButton isLeft={false} hovered={isHovered} onClick={nextSlide} />
      </div>

      {/* Navigation Dots */}
      <div style={{ display: "flex", gap: "8px", marginTop: "32px", zIndex: 10 }}>
        {(() => {
          const MAX_DOTS = 8;
          let start = 0;
          let end = totalSlides;
          if (totalSlides > MAX_DOTS) {
            start = Math.max(0, Math.min(index - Math.floor(MAX_DOTS / 2), totalSlides - MAX_DOTS));
            end = start + MAX_DOTS;
          }
          const visibleDots = Array.from({ length: totalSlides }).map((_, i) => i).slice(start, end);

          return visibleDots.map((idx) => (
            <button
              key={idx}
              onClick={() => {
                if (isFlipping) return;
                setIsFlipping(true);
                setDirection(idx > index ? 1 : -1);
                setIndex(idx);
                setTimeout(() => setIsFlipping(false), 500);
              }}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: index === idx ? "#FF9900" : "rgba(35, 47, 62, 0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
                transform: index === idx ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to story ${idx + 1}`}
            />
          ));
        })()}
      </div>
    </div>
  );
}
