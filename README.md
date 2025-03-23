# 🚀 MedInsta

Welcome to **MedInsta**! This repository contains both the **Frontend (React Native + Expo)** and the **Backend (Django REST Framework)**. Follow the steps below to set up and run the project efficiently.

---

## 📥 Clone the Repository  

```sh
git clone https://github.com/Skill-Issue-69/MedInsta
cd MedInsta
```

---

## 🔥 Backend Setup (Django + DRF)  

### 1️⃣ Create a Virtual Environment  

**For Windows:**  
```sh
cd backend
python -m venv venv
venv\Scripts\activate
```

**For Linux/macOS:**  
```sh
cd backend
python3 -m venv venv
source venv/bin/activate
```

Once activated, you should see `(venv)` in your terminal.

### 2️⃣ Install Dependencies  
```sh
pip install -r requirements.txt
```

### 3️⃣ Run the Server  
```sh
python manage.py runserver
```

Your API will now be running at [http://127.0.0.1:8000](http://127.0.0.1:8000/).

---

## 🎨 Frontend Setup (React Native + Expo)  

### 1️⃣ Navigate to the Frontend Directory  
```sh
cd frontend
```

### 2️⃣ Install Dependencies  
Ensure **Node.js** is installed. If not, [download it here](https://nodejs.org/).  
```sh
npm install
```

### 3️⃣ Start Expo  
```sh
npx expo start
```

This command generates a QR code. You can:
- Scan it using the [Expo Go App](https://expo.dev/client) on your phone.
- Open the project in a browser or emulator.


## 💡 Useful Commands  

| Command | Description |
|---------|------------|
| `venv\Scripts\activate` (Win) / `source venv/bin/activate` (Mac/Linux) | Activate virtual environment |
| `pip install -r requirements.txt` | Install backend dependencies |
| `python manage.py runserver` | Run Django server |
| `npm install` | Install frontend dependencies |
| `npx expo start` | Start React Native app |

---

## ❓ Need Help?  

Check out the official documentation:
- [Django Documentation](https://docs.djangoproject.com/en/stable/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)

---

🚀 **Happy Coding!**

