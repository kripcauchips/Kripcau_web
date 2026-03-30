'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutContactSection() {
  const ingredients = [
    {
      name: "Premium Cocoa",
      description: "Sourced from the finest Belgian chocolate to ensure a rich, velvety coating.",
      image: "/assets/cocoa.png"
    },
    {
      name: "Fresh Milk",
      description: "Creamy and pure, adding a smooth balance to our dark chocolate variants.",
      image: "/assets/susu.png"
    },
    {
      name: "Garnish & Herbs",
      description: "Natural ingredients and secret spices for that perfect artisanal finish.",
      image: "/assets/garnish.png"
    }
  ];

  return (
    <section id="about" style={{
      background: "#FFFFFF", /* White background as requested */
      padding: "7.5rem 5vw",
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      zIndex: 50,
      fontFamily: "var(--font-main)"
    }}>
      <div style={{ maxWidth: "75rem", margin: "0 auto", width: "100%" }}>

        {/* About Section (Hero) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "5rem" }}
        >
          <span style={{
            color: "#FF8A00", /* Vibrant orange accent */
            textTransform: "uppercase",
            letterSpacing: "0.25rem",
            fontWeight: 700,
            fontSize: "0.875rem",
            display: "block",
            marginBottom: "0.9375rem"
          }}>
            About Us
          </span>
          <h2 style={{
            fontSize: "clamp(2.5rem, 8vw, 4rem)",
            fontWeight: 800,
            color: "#1A1A1A", /* Dark text for white bg */
            lineHeight: 1.1,
            marginBottom: "1.5625rem",
            letterSpacing: "-0.0625rem"
          }}>
            Artisanal Belgian Chocolate<br /><span>Meets Crispy Banana Chips</span>
          </h2>
          <p style={{
            color: "#666666", /* Subtle dark text */
            fontSize: "1.125rem",
            maxWidth: "43.75rem",
            margin: "0 auto",
            lineHeight: 1.8
          }}>
            Born from a passion for premium snacks, KripcauChips redefines the local banana chip.
            Every chip is hand-selected, double-dipped in authentic Belgian chocolate,
            and crafted to give you the ultimate crunch and chocolatey bliss in every bite.
          </p>
        </motion.div>

        {/* Ingredients Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(17.5rem, 1fr))",
          gap: "1.875rem",
          marginBottom: "7.5rem"
        }}>
          {ingredients.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, scale: 0.95, y: "1.25rem" }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ scale: 1.03, y: "-0.625rem", boxShadow: "0 1.25rem 2.5rem rgba(0,0,0,0.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.1 }}
              style={{
                background: "#F9FAF7", /* Very soft off-white/greenish tint */
                padding: "2.5rem 1.875rem",
                borderRadius: "1.5rem",
                textAlign: "center",
                border: "1px solid #EFEFEF",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,0,0,0.03)"
              }}
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                style={{
                  width: "6.25rem",
                  height: "6.25rem",
                  margin: "0 auto 1.5625rem auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFFFFF",
                  borderRadius: "50%",
                  padding: "0.9375rem",
                  boxShadow: "0 0.25rem 0.9375rem rgba(0,0,0,0.05)"
                }}
              >
                <img src={ing.image} alt={ing.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </motion.div>
              <h4 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem", color: "#1A1A1A" }}>{ing.name}</h4>
              <p style={{ color: "#666666", lineHeight: 1.6, fontSize: "0.9375rem" }}>{ing.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: "1.875rem" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            background: "#F9FAF7", /* Soft light background */
            borderRadius: "2rem",
            padding: "clamp(2.5rem, 8vw, 5rem)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(18.75rem, 1fr))",
            gap: "3.75rem",
            border: "1px solid #EFEFEF",
            boxShadow: "0 1.25rem 3.125rem rgba(0,0,0,0.04)"
          }}
        >
          {/* Contact Info */}
          <div>
            <h3 style={{ fontSize: "2.25rem", color: "#1A1A1A", fontWeight: 800, marginBottom: "1.25rem" }}>Get in Touch</h3>
            <p style={{ color: "#666666", marginBottom: "2.5rem", lineHeight: 1.7, fontSize: "1rem" }}>
              Have a special request, big order, or just want to say hi? Drops us a message. We'd love to hear from you!
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <motion.div
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ display: "flex", alignItems: "center", gap: "0.9375rem", color: "#333333", cursor: "pointer", fontWeight: 600 }}
              >
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0.25rem 0.625rem rgba(0,0,0,0.05)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <span>hello@kripcauchips.com</span>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ display: "flex", alignItems: "center", gap: "0.9375rem", color: "#333333", cursor: "pointer", fontWeight: 600 }}
              >
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0.25rem 0.625rem rgba(0,0,0,0.05)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFB300" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <span>+62 812 3456 7890</span>
              </motion.div>
            </div>

            <div style={{ display: "flex", gap: "0.9375rem", marginTop: "2.5rem" }}>
              {["Instagram", "TikTok", "WhatsApp"].map((social) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.1, backgroundColor: "#355E3B", color: "#FFFFFF", borderColor: "#355E3B" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  style={{ padding: "0.625rem 1.25rem", background: "#FFFFFF", borderRadius: "3.125rem", color: "#666666", fontSize: "0.875rem", border: "1px solid #E0E0E0", cursor: "pointer", fontWeight: 500 }}
                >
                  {social}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }} onSubmit={(e) => e.preventDefault()}>
            {['Full Name', 'Email'].map(label => (
              <motion.div
                key={label}
                whileTap={{ scale: 0.99 }}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <label style={{ color: "#333333", fontSize: "0.875rem", fontWeight: 600 }}>{label}</label>
                <input type={label === 'Email' ? 'email' : 'text'} placeholder={`Your ${label}`} style={{
                  background: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: "0.75rem", padding: "1rem", color: "#1A1A1A", outline: "none", width: "100%", transition: "border 0.3s, box-shadow 0.3s"
                }} onFocus={(e) => { e.target.style.borderColor = "#355E3B"; e.target.style.boxShadow = "0 0 0 3px rgba(53, 94, 59, 0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E0E0E0"; e.target.style.boxShadow = "none"; }} />
              </motion.div>
            ))}

            <motion.div
              whileTap={{ scale: 0.99 }}
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <label style={{ color: "#333333", fontSize: "0.875rem", fontWeight: 600 }}>Message</label>
              <textarea placeholder="How can we help?" rows={4} style={{
                background: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: "0.75rem", padding: "1rem", color: "#1A1A1A", outline: "none", width: "100%", resize: "none", transition: "border 0.3s, box-shadow 0.3s"
              }} onFocus={(e) => { e.target.style.borderColor = "#355E3B"; e.target.style.boxShadow = "0 0 0 3px rgba(53, 94, 59, 0.1)"; }} onBlur={(e) => { e.target.style.borderColor = "#E0E0E0"; e.target.style.boxShadow = "none"; }} />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              style={{
                background: "#000000",
                color: "#FFFFFF",
                fontWeight: 800,
                padding: "1.125rem",
                borderRadius: "3.125rem",
                border: "none",
                cursor: "pointer",
                marginTop: "0.625rem",
                fontSize: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden"
              }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
