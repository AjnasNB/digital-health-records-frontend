# Docufy - Digital Health Records Platform

![Docufy Logo](public/assets/logo-removebg-preview.png)

## About Docufy

Docufy is an AI-powered platform that transforms paper health documents into smart digital records. The platform allows users to upload any medical document, and our advanced AI instantly extracts, organizes, and provides insights on health data.

## 🚀 Live Demo

Visit our live demo at [Docufy.ajnasnb.com](https://docufy.ajnasnb.com)

## ✨ Features

- **Document Digitization**: Convert handwritten notes, prescriptions, lab results into structured digital records
- **Intelligent Analysis**: AI-powered analysis of health data to identify trends and flag potential issues
- **Call Verification**: Automated verification calls to confirm extracted information
- **Bank-Level Security**: End-to-end encryption and healthcare privacy compliance

## 🛠️ Tech Stack

### Frontend
- **Next.js**: React framework for server-side rendering
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Twilio**: For voice, messaging, and verification services
- **Google Document AI**: For optical character recognition

### Security & Infrastructure
- JWT-based authentication
- End-to-end encryption
- AWS cloud infrastructure
- HIPAA and GDPR compliance

## 🧰 Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/docufy.git
cd docufy
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
Create a `.env.local` file in the root directory and add:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_API_URL=http://localhost:3000/api
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
GOOGLE_APPLICATION_CREDENTIALS=path_to_credentials.json
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Application Structure

- `app/` - Next.js app directory
  - `components/` - Reusable UI components
  - `context/` - React context providers
  - `hooks/` - Custom React hooks
  - `services/` - API services and external integrations
  - `upload/` - Document upload functionality
  - `dashboard/` - User dashboard
  - `records/` - Health records management
  - `presentation/` - Presentation slides

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. Users can register, login, and maintain a secure session.

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Contact

For any questions or suggestions, please reach out to us at contact@docufy.ajnasnb.com.

---

Made with ❤️ by the Docufy Team
