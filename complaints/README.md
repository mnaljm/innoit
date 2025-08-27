Complaint station

A tiny server + static page where your partner can submit playful complaints.

Setup

1. Install dependencies: npm install nodemailer
2. Set environment variables (recommended):
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
   - NOTIFY_EMAIL (where you want to receive the complaint)
   - SMTP_FROM (optional)
3. Run: node server.js

Security

This is a simple demo. If you host it publicly, secure it and add authentication.

Data

Submitted complaints are saved in `complaints/data/` as timestamped JSON files.
