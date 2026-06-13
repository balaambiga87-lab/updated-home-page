"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StoryCard {
  id: string;
  name: string;
  image: string;
  title: string;
  desc: string;
  color: string;
  dotColor: string;
}

const STORIES: StoryCard[] = [
  {
    id: "01",
    name: "Aravind Swaminathan",
    image: "/images/student_builder_1.png",
    title: "Who We Are",
    desc: "A student-led cloud community at Rajalakshmi Engineering College focused on learning, building, and growing with AWS technologies.",
    color: "#E8F4FD", // Light AWS blue
    dotColor: "#0073BB"
  },
  {
    id: "02",
    name: "Meera Krishnan",
    image: "/images/student_builder_3.png",
    title: "What We Do",
    desc: "We organize workshops, technical sessions, hackathons, and collaborative projects that help students gain practical cloud experience.",
    color: "#FFF3E0", // Light AWS orange
    dotColor: "#FF9900"
  },
  {
    id: "03",
    name: "Rahul Siddharth",
    image: "/images/student_builder_2.png",
    title: "Why Join Us",
    desc: "Gain hands-on skills, build your network, explore emerging technologies, and become part of a supportive learning ecosystem.",
    color: "#F3E5F5", // Light purple accent
    dotColor: "#8E24AA"
  },
  {
    id: "04",
    name: "Sneha Ramachandran",
    image: "/images/student_builder_3.png",
    title: "Our Mission",
    desc: "To empower students with industry-relevant cloud knowledge and prepare them for future careers in technology.",
    color: "#E8F5E9", // Light green accent
    dotColor: "#2E7D32"
  },
  {
    id: "05",
    name: "Vikram Sethuraman",
    image: "/images/student_builder_1.png",
    title: "Our Community",
    desc: "A diverse group of learners, developers, innovators, and aspiring cloud professionals who grow together through collaboration.",
    color: "#E8F4FD",
    dotColor: "#0073BB"
  },
  {
    id: "06",
    name: "Shreya Venkat",
    image: "/images/student_builder_3.png",
    title: "Your Journey Starts Here",
    desc: "Whether you're a beginner or an experienced builder, AWS SBG REC provides opportunities to learn, create, and lead.",
    color: "#FFF3E0",
    dotColor: "#FF9900"
  },
  {
    id: "07",
    name: "Harish Raghavan",
    image: "/images/student_builder_2.png",
    title: "What We Offer",
    desc: "Hands-on AWS workshops, certification prep, hackathons, mentorship sessions, and real project experience that transforms students.",
    color: "#F3E5F5",
    dotColor: "#8E24AA"
  },
  {
    id: "08",
    name: "Pooja Hegde",
    image: "/images/student_builder_3.png",
    title: "Join the Movement",
    desc: "Whether you are a complete beginner or an experienced developer, AWS SBG REC welcomes you. Start your cloud journey with us.",
    color: "#E8F5E9",
    dotColor: "#2E7D32"
  },
  {
    id: "09",
    name: "Aditya Verma",
    image: "/images/student_builder_1.png",
    title: "Our Values",
    desc: "Learn by doing. Share what you know. Build what matters. We believe in open collaboration, peer mentorship, and cloud innovation.",
    color: "#E8F4FD",
    dotColor: "#0073BB"
  }
];

export default function AboutNew() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const [isHovered, setIsHovered] = useState(false);

  // Handle responsive visible card counts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = STORIES.length;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, totalSlides]);

  const getCardStyles = (idx: number) => {
    let diff = idx - activeIndex;
    const half = Math.floor(totalSlides / 2);
    if (diff > half) diff -= totalSlides;
    if (diff < -half) diff += totalSlides;

    // Responsive settings
    const isMobile = visibleCards === 1;
    const isTablet = visibleCards === 2;

    // Calculate curve parameters
    // angleSpacing: angle in degrees between adjacent cards
    const angleSpacing = isMobile ? 0 : (isTablet ? 35 : 45);
    const rad = (diff * angleSpacing * Math.PI) / 180;

    // Radius parameters for ellipse: Radius X (horizontal spread), Radius Z (depth curve)
    const radiusX = isMobile ? 0 : (isTablet ? 240 : 330);
    const radiusZ = isMobile ? 0 : (isTablet ? -100 : -150);

    // Compute positions along the curve
    const x = radiusX * Math.sin(rad);
    // When rad = 0 (center card), cos(rad) = 1, so z is 0.
    // For other cards, cos(rad) < 1, so z goes negative (further back).
    const z = radiusZ * (1 - Math.cos(rad));

    // Rotation Y: center card is 0, side cards rotate inward to create the curved feeling
    const rotateY = isMobile ? 0 : -diff * angleSpacing;

    // Scale and Z-Index
    let scale = 1;
    let zIndex = 1;
    let opacity = 0;
    let pointerEvents: "auto" | "none" = "none";
    let filter = "none";

    if (diff === 0) {
      scale = 1.05;
      zIndex = 10;
      opacity = 1;
      pointerEvents = "auto";
    } else if (diff === -1 || diff === 1) {
      scale = isMobile ? 0.95 : 0.85;
      zIndex = 5;
      opacity = isMobile ? 0.0 : 0.75;
      pointerEvents = isMobile ? "none" : "auto";
    } else if (diff === -2 || diff === 2) {
      // In the background, slightly visible for desktop/tablet to enhance the circular 3D feel
      scale = isMobile ? 0.8 : 0.72;
      zIndex = 2;
      opacity = isMobile || isTablet ? 0.0 : 0.25;
      filter = "blur(2px)";
      pointerEvents = "none";
    } else {
      scale = 0.6;
      zIndex = 1;
      opacity = 0.0;
      pointerEvents = "none";
    }

    return {
      x,
      z,
      rotateY,
      scale,
      opacity,
      zIndex,
      filter,
      pointerEvents,
    };
  };

  return (
    <section
      id="about-new"
      style={{
        width: "100%",
        padding: "100px 4%",
        background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Header Block with Titles and controls in one flex row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "64px",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "#0073BB",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "12px",
                display: "block",
              }}
            >
              ABOUT US
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 42px)",
                fontWeight: 900,
                color: "#232F3E",
                margin: "0 0 8px 0",
                letterSpacing: "-1px",
              }}
            >
              The dream team of cloud innovation.
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#5c6b73",
                margin: 0,
                fontWeight: 500,
              }}
            >
              We Learn. We Build. We Grow. Period.
            </p>
          </div>

          {/* Slider Controls in Header */}
          <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 10 }}>
            <button
              onClick={prevSlide}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid rgba(35, 47, 62, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                transition: "all 0.3s ease",
              }}
              className="interactive-hover"
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#232F3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "#FFFFFF",
                border: "1.5px solid rgba(35, 47, 62, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                transition: "all 0.3s ease",
              }}
              className="interactive-hover"
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#232F3E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3D Curved Viewport Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1000px",
            transformStyle: "preserve-3d",
            overflow: "visible",
            padding: "20px 0",
          }}
        >
          {STORIES.map((card, idx) => {
            return (
              <motion.div
                key={card.id}
                onClick={() => setActiveIndex(idx)}
                animate={getCardStyles(idx)}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                  mass: 0.8
                }}
                style={{
                  position: "absolute",
                  width: "100%",
                  maxWidth: "360px",
                  height: "440px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  background: "#FFFFFF",
                  borderRadius: "24px",
                  border: "1.5px solid rgba(35, 47, 62, 0.08)",
                  boxShadow: "0 16px 40px rgba(35, 47, 62, 0.06), 0 2px 10px rgba(35, 47, 62, 0.03)",
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Portrait photo block */}
                <div
                  style={{
                    width: "100%",
                    height: "260px",
                    position: "relative",
                    overflow: "hidden",
                    background: "#F1F5F9",
                  }}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                  />

                  {/* Name Badge overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      right: "16px",
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(4px)",
                      border: "1px solid rgba(35, 47, 62, 0.15)",
                      borderRadius: "100px",
                      padding: "5px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: card.dotColor,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#232F3E",
                        letterSpacing: "-0.1px",
                      }}
                    >
                      {card.name}
                    </span>
                  </div>
                </div>

                {/* Horizontal Colored ID Bar */}
                <div
                  style={{
                    backgroundColor: card.color,
                    padding: "8px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid rgba(35, 47, 62, 0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 900,
                      color: card.dotColor,
                      letterSpacing: "0.5px",
                    }}
                  >
                    {card.id}
                  </span>
                </div>

                {/* Body Text */}
                <div
                  style={{
                    padding: "24px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#232F3E",
                      margin: "0 0 10px 0",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "13.5px",
                      color: "#5C6B73",
                      lineHeight: 1.6,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Carousel indicator dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "32px",
            position: "relative",
            zIndex: 10
          }}
        >
          {STORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: activeIndex === idx ? "#0073BB" : "rgba(35, 47, 62, 0.15)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease",
                padding: 0,
                transform: activeIndex === idx ? "scale(1.25)" : "scale(1)",
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
