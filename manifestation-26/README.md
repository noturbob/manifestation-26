# 🌌 Manifest 2026

![Project Banner](public/pngwing.com.png)
> **"Design your future self."**

**Manifest 2026** is a next-generation affirmation dashboard designed with a "Cinematic UI" philosophy. It combines the aesthetic quality of **Apple Vision Pro** (Glassmorphism, Physics-based motion) with a robust **MERN Stack** (MongoDB, Express, React, Node) backend to create an immersive, emotional experience for setting intentions.

---

## ✨ Features

### 🎨 **Cinematic User Experience**
- **Glassmorphism 2.0:** Deep blur effects (`backdrop-filter`), noise textures, and multi-layer depth.
- **Physics-Based Animation:** Cards tilt in 3D based on mouse position (Parallax) using **Framer Motion**.
- **Micro-Interactions:** Smooth layout shifts, glowing borders, and "celebration" states upon task completion.
- **Ambient Lighting:** Dynamic, breathing background gradients that create a calm atmosphere.

### 🔐 **Full-Stack Functionality**
- **Secure Authentication:** User registration and login protected by **JWT (JSON Web Tokens)** and **bcrypt** encryption.
- **Data Persistence:** All affirmations are stored securely in **MongoDB Atlas**.
- **Data Isolation:** Users can only access and manage their own private timeline.
- **Real-time State:** Instant UI updates with Optimistic UI patterns using **Zustand**.

---

## 🛠️ Tech Stack

### **Frontend**
- **React (TypeScript):** Component architecture and type safety.
- **Tailwind CSS:** Utility-first styling for complex glass effects.
- **Framer Motion:** Production-ready animation library.
- **Zustand:** Lightweight global state management.
- **Lucide React:** Clean, consistent iconography.

### **Backend**
- **Node.js & Express:** REST API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
- **JWT & Bcrypt:** Industry-standard security.
- **Cors:** configured for secure cross-origin resource sharing.



---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas Account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/manifestation-26.git](https://github.com/yourusername/manifestation-26.git)
cd manifestation-26
