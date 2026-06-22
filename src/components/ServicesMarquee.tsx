"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AWS_SERVICES = [
  {
    id: "ec2",
    name: "Amazon EC2",
    tag: "Compute",
    icon: "💻",
    color: "#FF9900",
    desc: "Amazon Elastic Compute Cloud provides secure, resizable compute capacity in the cloud. It allows students to boot virtual servers, configure security and networking, and manage storage drives easily."
  },
  {
    id: "s3",
    name: "Amazon S3",
    tag: "Storage",
    icon: "🪣",
    color: "#3F8CFF",
    desc: "Amazon Simple Storage Service is object storage built to store and retrieve any amount of data from anywhere. Perfect for static website hosting, user uploads, and secure backups."
  },
  {
    id: "lambda",
    name: "AWS Lambda",
    tag: "Serverless",
    icon: "⚡",
    color: "#E05252",
    desc: "AWS Lambda lets you run code without provisioning or managing database servers. You pay only for the compute time you consume—ideal for serverless microservices and web hooks."
  },
  {
    id: "rds",
    name: "Amazon RDS",
    tag: "Databases",
    icon: "🗄️",
    color: "#2EAD7F",
    desc: "Amazon Relational Database Service makes it easy to set up, operate, and scale relational databases in the cloud. It manages MySQL, PostgreSQL, and Oracle databases automatically."
  },
  {
    id: "dynamodb",
    name: "Amazon DynamoDB",
    tag: "NoSQL Database",
    icon: "🔑",
    color: "#8C52FF",
    desc: "Amazon DynamoDB is a fully managed, serverless, key-value NoSQL database designed to run high-performance applications at any scale with single-digit millisecond latency."
  }
];

export default function ServicesMarquee() {
  const [hoveredService, setHoveredService] = useState<typeof AWS_SERVICES[0] | null>(null);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        zIndex: 5,
        overflow: "hidden",
      }}
    >
      {/* Inject CSS keyframes for smooth horizontal sliding */}
      <style>{`
        @keyframes marquee-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        onMouseLeave={() => setHoveredService(null)}
        style={{
          position: "relative",
          width: "100%",
          background: "#031c36",
          borderTop: "1px solid rgba(255, 255, 255, 0.15)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "16px 0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          boxShadow: "0 10px 30px rgba(3, 28, 54, 0.2)",
          minHeight: "72px",
        }}
      >
        {/* Description Overlay: Covers the whole bars when hovering */}
        <AnimatePresence>
          {hoveredService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #031c36 0%, #0c355f 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                borderTop: "1.5px solid #FF9900",
                borderBottom: "1.5px solid #FF9900",
              }}
            >
              <div style={{
                width: "100%",
                maxWidth: "1200px",
                padding: "0 24px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}>
                <span style={{ fontSize: "28px", flexShrink: 0 }}>
                  {hoveredService.icon}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", textAlign: "left", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#FF9900" }}>
                      {hoveredService.name}
                    </h4>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#ffffff", background: hoveredService.color, padding: "1px 8px", borderRadius: "100px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {hoveredService.tag}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "13.5px", color: "#e2e8f0", lineHeight: 1.5, fontWeight: 500 }}>
                    {hoveredService.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Marquee sliding track container */}
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marquee-slide 28s linear infinite",
            animationPlayState: hoveredService ? "paused" : "running",
            gap: "24px",
            paddingLeft: "24px",
          }}
        >
          {/* Duplicate twice for infinite loop */}
          {[...AWS_SERVICES, ...AWS_SERVICES].map((service, index) => (
            <motion.div
              key={`${service.id}-${index}`}
              onMouseEnter={() => setHoveredService(service)}
              whileHover={{ scale: 1.05, borderColor: "#FF9900", background: "rgba(255, 255, 255, 0.15)" }}
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 26px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "100px",
                color: "#ffffff",
                fontSize: "14.5px",
                fontWeight: 700,
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "border-color 0.2s ease, background-color 0.2s ease",
              }}
            >
              <span>{service.icon}</span>
              <span>{service.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
