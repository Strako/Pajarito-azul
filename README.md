# Pajarito Azul

## 🌐 Demo: https://pajarito-azul.netlify.app/

### 📦 Deployment Information
- **Frontend:** [Netlify](https://www.netlify.com/)
- **Backend:** [Render](https://render.com/)
- **Database:** [Neon](https://neon.tech/) — Migrated from MySQL dump to PostgreSQL

<p align="center">
  <img src="https://i.ibb.co/mBW7r1p/Screen-Shot-2023-09-17-at-16-50-34.png" alt="Demo Screenshot"/>
</p>

---

## 🐦 Project Description

Pajarito Azul is an open-source Twitter clone designed for private networks, internal communities, or environments without internet access. It can be self-hosted and customized as needed.

---

## 🚀 Features

### 🔐 Authentication
- Login
- Account creation

### 👤 Users
- Follow / Unfollow
- Profile image
- Profile name
- @username
- User description

### 🧾 Profile
- View user profile
- Tweet button
- Edit profile

### 📝 Tweeting
- List personal tweets
- Create tweet
- Delete tweet
- Like / Dislike tweets

### ✏️ Edit Profile
- Change name
- Change description
- Change password
- Change profile image

### 🔍 Explore
- Search users by @username

### 🏠 Home *(Next Iteration)*
- Feed of followed users

### 🔔 Notifications *(Next Iteration)*
- New followers
- Tweet likes

---

## 🛠️ Database Setup

### ✅ PostgreSQL (Current)
The current backend uses PostgreSQL hosted on [Neon](https://neon.tech). A MySQL dump was parsed and converted to be compatible with PostgreSQL.

### 🗃️ Legacy MySQL (Optional)
If you want to restore the original MySQL dump:

**Option 1:** Manually execute the SQL script at `Backend/DB/DB.sql`  
**Option 2:** Use terminal command:
```bash
mysql -u your_user -p gpsdb < ./Backend/DB/DB.sql
```

---

## 🖥️ Frontend — React + TypeScript + Vite

### Start Development Server:
```bash
cd Frontend
npm install
npm run dev
```

---

## 🔧 Backend — Python + Flask

### Setup Instructions:
1. Create the `.env` file in `Backend/src/.env` with:
```env
SECRET_KEY=GPS2023
DBHOST=[your postgres host]
DBUSER=[your user]
DBPASS=[your password]
DBNAME=[your db name]
DBPORT=5432
```

2. (Optional) Create and activate a virtual environment:
```bash
cd Backend
pip install virtualenv
virtualenv env
source env/bin/activate
```

3. Install dependencies:
```bash
cd Backend/src
pip install -r requirements.txt
```

4. Start the Flask backend:
```bash
python index.py
```

---

## 📮 Postman Collection

The full API collection is available under:
```
Backend/Postman/
```

It includes:
- HTTP methods
- Routes
- Auth tokens
- Response schemas

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you’d like to change.

---

## 📄 License

[MIT](LICENSE)
