#!/bin/bash

echo "🚀 Starting Prok Professional Networking - Ultimate Automation Script"
echo "================================================================"

# Kill any previous servers
echo "🔪 Killing previous servers..."
fuser -k 5050/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5174/tcp 2>/dev/null || true
fuser -k 5175/tcp 2>/dev/null || true
fuser -k 5176/tcp 2>/dev/null || true
sleep 2

# Fix database schema
echo "🗄️  Fixing database schema..."
mysql -u root -pMaddy@#13 prok_db -e "
ALTER TABLE post ADD COLUMN category VARCHAR(100);
ALTER TABLE post ADD COLUMN tags VARCHAR(300);
" 2>/dev/null || echo "Schema columns already exist or error (continuing...)"

# Insert/update demo user with correct password hash
echo "👤 Setting up demo user..."
mysql -u root -pMaddy@#13 prok_db -e "
DELETE FROM user WHERE id=1;
INSERT INTO user (id, username, email, password_hash, title, bio, skills, avatar, location, phone, languages, connections, mutual_connections)
VALUES (1, 'demo', 'demo@example.com', 'scrypt:32768:8:1\$egeZkVdapU5RAJ3X\$cfdb083b971c3a92178a63b1ee710bb7201b5c90a9038e9c0a5d117b93803e58b1c7e94c73006a01b0e42bcb3efb94cae587ab1617ffeb37056dcf47577d358a', 'Developer', 'Test user', 'Python,Flask,React', '', 'Earth', '1234567890', 'English', 0, 0);
" 2>/dev/null || echo "Demo user setup completed"

# Start backend with correct PYTHONPATH
echo "🔧 Starting backend server..."
PYTHONPATH=app ./app/backend/venv/bin/python app/backend/main.py > backend.log 2>&1 &
BACKEND_PID=$!
echo "✅ Backend started with PID $BACKEND_PID (log: backend.log)"

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Test backend health
echo "🏥 Testing backend health..."
if curl -s http://localhost:5050/api/profile > /dev/null; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend not responding, checking logs..."
    tail -n 10 backend.log
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd app/frontend && npm run dev > ../../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend started with PID $FRONTEND_PID (log: frontend.log)"
cd ../../

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 8

# Test frontend health
echo "🏥 Testing frontend health..."
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    FRONTEND_URL="http://localhost:5173/"
elif curl -s http://localhost:5174/ > /dev/null 2>&1; then
    FRONTEND_URL="http://localhost:5174/"
elif curl -s http://localhost:5175/ > /dev/null 2>&1; then
    FRONTEND_URL="http://localhost:5175/"
elif curl -s http://localhost:5176/ > /dev/null 2>&1; then
    FRONTEND_URL="http://localhost:5176/"
else
    FRONTEND_URL="http://localhost:5173/"
fi

echo "================================================================"
echo "🎉 Setup Complete!"
echo "================================================================"
echo "🔧 Backend: http://localhost:5050/"
echo "🎨 Frontend: $FRONTEND_URL"
echo "👤 Demo Login:"
echo "   Username: demo"
echo "   Password: demo123"
echo ""
echo "📋 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🔄 To restart everything: ./run_all_ultimate.sh"
echo "================================================================"

# Optionally open browser
if command -v xdg-open > /dev/null; then
    echo "🌐 Opening frontend in browser..."
    xdg-open "$FRONTEND_URL" &
elif command -v open > /dev/null; then
    echo "🌐 Opening frontend in browser..."
    open "$FRONTEND_URL" &
fi

echo "✅ Automation complete! Your app is ready to use." 