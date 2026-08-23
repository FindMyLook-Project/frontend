# FIND MY LOOK - Frontend

Welcome to the frontend repository for **FIND MY LOOK**, a smart fashion analysis application. 
Built with React, Vite, and Tailwind CSS v4, this client-side layer handles user authentication, dynamic image uploads, image cropping, and communicates directly with the FastAPI backend and ML pipelines (MediaPipe) to deliver real-time, personalized fashion recommendations.

## Note for the Evaluator
This repository contains the UI and client-side logic. To fully test the application's end-to-end flow—from uploading an outfit photo to receiving AI-generated fashion matches—please ensure the **Backend (FastAPI)** and **ML** repositories are running concurrently.

## Prerequisites

Ensure you have the following installed on your machine:
* **Node.js** (Version 20.19.0 or higher)
* **Git**

*Note: The project is fully configured to run smoothly across both macOS and Windows environments.*

## Installation & Setup

Follow these steps to set up and run the project locally:

1. Clone the Repository
Bash
git clone https://github.com/FindMyLook-Project/frontend.git
cd frontend

2. Install Dependencies
This command installs all required packages including Tailwind CSS 4, React Router, and Axios:
npm install

3. Configure Environment Variables
Create a .env file in the root directory of the frontend project to connect to the backend. Add the following line (adjust the port if your backend runs on a different port):
VITE_API_URL=http://localhost:3000

4. Run the Development Server
npm run dev

The application will be available in your browser at http://localhost:5173.

-----------------------------------------------------------------
Key Features
Dual Search Modes:
- Total Look: Upload a full-body image to detect multiple fashion items simultaneously using ML segmentation.

- Item Search: Manually crop up to 3 specific items from a photo for focused visual searching.

- Personalization: Features explicit feedback loops (Like/Dislike) and a 'Saved Items' collection to fine-tune future recommendations.

- Responsive UI: A clean, delicate design system with interactive components ensuring a seamless user experience.

Tech Stack
- Framework: React 18 with Vite
- Routing: React Router v6
- Styling: Tailwind CSS v4 (Custom typography: Inter & Playfair Display)
- Image Processing: React-Image-Crop, React-Dropzone