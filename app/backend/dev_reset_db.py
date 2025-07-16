from main import db, app
from models.user import User
from models.post import Post
from werkzeug.security import generate_password_hash

with app.app_context():
    print("🔄 Dropping all tables...")
    db.drop_all()
    print("✅ Dropped all tables.")

    print("🛠️ Creating all tables...")
    db.create_all()
    print("✅ Tables created.")

    # Create a test user
    print("👤 Creating test user...")
    test_user = User(
        email="test@example.com",
        username="testuser",
        password_hash=generate_password_hash("password123"),
        title="Software Developer",
        bio="This is a test user for development purposes.",
        skills="Python, JavaScript, React",
        location="San Francisco, CA",
        phone="+1-555-0123",
        languages="English, Spanish"
    )
    db.session.add(test_user)
    db.session.commit()

    print("✅ Test user created:")
    print("   Email: test@example.com")
    print("   Username: testuser")
    print("   Password: password123")
    print("🎉 Database has been reset!")
