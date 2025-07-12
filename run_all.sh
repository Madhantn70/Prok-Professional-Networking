#!/bin/bash

# Kill any previous servers
fuser -k 5050/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5174/tcp 2>/dev/null || true
fuser -k 5175/tcp 2>/dev/null || true
fuser -k 5176/tcp 2>/dev/null || true

# Fix database schema (add missing columns if needed)
mysql -u root -pMaddy@#13 prok_db < reset_db.sql

# Add missing columns if they don't exist
mysql -u root -pMaddy@#13 -e "USE prok_db; ALTER TABLE post ADD COLUMN likes_count INT DEFAULT 0;" 2>/dev/null || true
mysql -u root -pMaddy@#13 -e "USE prok_db; ALTER TABLE post ADD COLUMN views_count INT DEFAULT 0;" 2>/dev/null || true

# Start backend
PYTHONPATH=app ./app/backend/venv/bin/python app/backend/main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID (log: backend.log)"

# Start frontend
cd app/frontend && npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID (log: frontend.log)"
cd ../../

echo "Both backend and frontend are starting. Check backend.log and frontend.log for output."
echo "Backend: http://localhost:5050/"
echo "Frontend: http://localhost:5173/ (or next available port)" 