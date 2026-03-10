# 🕵️‍♂️ Detective.AI // Neural Forensic Framework
### *An Automated Crime Scene Analysis & Evidence Authentication System*

[![Live Demo](https://img.shields.io/badge/Live-Dashboard-cyan?style=for-the-badge&logo=render)](https://detective-ai-frontend.onrender.com)
[![Backend API](https://img.shields.io/badge/Neural-Core-green?style=for-the-badge&logo=fastapi)](https://detective-ai-backend.onrender.com)

---

## 📑 Project Overview
**Detective.AI** is a high-performance forensic intelligence platform developed for digital investigators. It solves the dual-challenge of modern forensics: **Object Localization** (detecting weapons/suspects) and **Evidence Integrity** (identifying digital tampering).

By utilizing a **Distributed Neural Architecture**, the platform generates real-time "Explainable AI" (XAI) reports and suggests tactical resolutions for localized crime scene artifacts.

---

## 🚀 Deployment Status
* **Tactical Dashboard:** [https://detective-ai-frontend.onrender.com](https://detective-ai-frontend.onrender.com)
* **Neural Core (API):** [https://detective-ai-backend.onrender.com](https://detective-ai-backend.onrender.com)

> **⚠️ Cloud Latency Note:** This project is hosted on Render’s Free Tier. The first request may take **50-60 seconds** to "wake up" the Python server and load the YOLO11 weights into memory. Subsequent scans are processed in real-time.

---

## 🛠 Tech Stack & Architecture



[Image of client-server architecture diagram]


### **Frontend: Tactical Command Center**
* **Framework:** Next.js 14 (React)
* **Styling:** Tailwind CSS (Tactical Glassmorphism UI)
* **Animations:** Framer Motion (Laser scan & HUD effects)
* **Reporting:** jsPDF (Forensic PDF Export functionality)

### **Backend: Neural Inference Core**
* **Inference Engine:** Ultralytics YOLO11 (Real-time Object Detection)
* **API Logic:** FastAPI (Python 3.10)
* **Image Processing:** OpenCV & Error Level Analysis (ELA)
* **Security:** SHA-256 Metadata Hashing for Chain of Custody

---

## 🧠 Core Forensic Logic

### 1. Kinetic Threat Markers (YOLO11)
Utilizes the latest **YOLO11** architecture to localize weapons (firearms, knives) and human subjects with precision bounding boxes and confidence metrics.

### 2. ELA Truth Engine

Performs **Error Level Analysis** by resaving images at specific quality levels and calculating the pixel-wise difference. This identifies "Photoshopped" regions that exhibit different quantization levels than the rest of the image.

### 3. Predictive Case Resolution
A logic-based layer that interprets the proximity and type of artifacts detected to predict the scenario (e.g., *Armed Confrontation*) and suggest the most effective law enforcement response.

---

## 📦 Local Setup Instructions

```powershell
### 1. Install Backend Dependencies & Start Neural Core
cd backend; 
pip install -r requirements.txt; 
Start-Process powershell "-NoExit", "-Command", "uvicorn main:app --reload --port 8000";

### 2. Install Frontend Dependencies & Start Tactical Dashboard
cd ../frontend; 
npm install; 
npm run dev

## 📦 Unified Local Setup

To run the full-stack environment (FastAPI + Next.js) simultaneously, follow these steps in your terminal:

### **Windows (PowerShell)**
# Install all dependencies and launch both servers
cd backend; pip install -r requirements.txt; Start-Process powershell "-NoExit", "-Command", 'uvicorn main:app --reload --port 8000'; cd ../frontend; npm install; npm run dev

# Install and run backend in background, then start frontend
(cd backend && pip install -r requirements.txt && uvicorn main:app --reload &); cd frontend && npm install && npm run dev

