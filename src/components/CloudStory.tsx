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
            background: "linear-gradient(135deg, #FFFFFF 0%, #E8F4FD 25%, #FFF3E0 60%, #FFFFFF 100%) padding-box, linear-gradient(135deg, #FFFFFF 0%, #0073BB 40%, #FF9900 70%, #FFFFFF 100%) border-box",
            border: "2.5px solid transparent",
            borderRadius: "32px",
            boxShadow: "0 24px 48px rgba(35, 47, 62, 0.08), inset 0 0 40px rgba(255, 255, 255, 0.6)",
            overflow: "hidden",
          }}
        >
          {/* Spotlight Glows inside the Card */}
          <div
            style={{
              position: "absolute",
              bottom: "-10%",
              right: "-10%",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 153, 0, 0.22) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "-10%",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0, 115, 187, 0.16) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />

          {/* Text Content */}
          <div 
            style={{ 
              position: "relative", 
              zIndex: 10, 
              width: "85%", 
              height: "75%",
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
