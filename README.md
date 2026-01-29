# 🎯 Face Attendance System (Real-Time & Full-Day)

A production-ready, computer-vision–based attendance system built with **Python, Streamlit, OpenCV, and InsightFace**.  
Designed for real-time face recognition, full-day academic schedules, late arrival handling, and audit-friendly attendance logging using SQLite.

---

## 🚀 Key Features

### Core
- Real-time face recognition using **InsightFace (SOTA embeddings)**
- Snapshot-based camera mode (browser-safe)
- Optional real-time OpenCV mode (Linux/WSL with `/dev/video0`)
- Automatic **PRESENT / ABSENT / LATE** classification
- Duplicate detection prevention
- Confidence scoring per recognition

### Attendance Logic
- Session-based attendance tracking
- Automatic **ABSENT marking** after time window
- Admin-controlled **LATE override with mandatory reason**
- Full audit trail with timestamps

### Full-Day Workflow
- Configurable:
  - Morning session
  - Interval break
  - Lunch break
  - Afternoon session
  - Evening session
- Attendance automatically paused during breaks
- Re-verification supported after each session

### Data & Storage
- Student metadata from `data/students.txt`
- Face images from `data/known_faces/`
- SQLite backend (`attendance.db`)
- Session and phase-based reporting

---

## 🗂 Project Structure

```

face_attendance_system/
│
├── app.py
├── requirements.txt
├── README.md
│
├── config/
│   └── schedule.json
│
├── data/
│   ├── known_faces/
│   │   └── student_id/
│   └── students.txt
│
├── db/
│   └── schema.sql
│
├── models/
│   └── face_recognizer.py
│
├── services/
│   ├── camera.py
│   ├── presence.py
│   └── scheduler.py
│
└── utils/
├── db.py
└── load_students.py

```

---

## 📋 Student Registration

### 1. Student Metadata

Edit:

```

data/students.txt

````

Format:

```csv
student_id,name,class,roll_no
student_001,Arjun Menon,CS-A,23
student_002,Rahul Nair,CS-A,24
````

### 2. Face Images

```
data/known_faces/student_001/img1.jpg
data/known_faces/student_001/img2.jpg
```

Folder name **must match** `student_id`.

---

## ⚙ Installation

### System Dependencies (Linux / WSL)

```bash
sudo apt update
sudo apt install -y libgl1 ffmpeg v4l-utils
```

### Python Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## ▶ Running the Application

### Snapshot Mode (Works everywhere)

```bash
streamlit run app.py --server.address=localhost --server.port=8501
```

Open:

```
http://localhost:8501
```

Browser will request camera permission.

---

### Real-Time Mode (Linux / WSL)

Requirements:

```bash
ls /dev/video0
```

If not present → real-time mode will not work.

Then run normally:

```bash
streamlit run app.py --server.address=localhost
```

---

## 🕒 Full-Day Scheduling

Edit:

```
config/schedule.json
```

Example:

```json
{
  "morning": {"start": "09:00", "end": "10:30", "enabled": true},
  "interval": {"start": "10:30", "end": "10:45", "enabled": true},
  "lunch": {"start": "12:30", "end": "13:15", "enabled": true},
  "afternoon": {"start": "13:15", "end": "15:30", "enabled": true}
}
```

---

## 🧠 Attendance States

| Status  | Meaning                             |
| ------- | ----------------------------------- |
| PRESENT | Face verified during session        |
| ABSENT  | Not detected before session timeout |
| LATE    | Admin override after timeout        |

---

## 🗄 Database Schema

Tables:

* `students`
* `attendance`

Stored in:

```
db/attendance.db
```

Each attendance record contains:

* Student details
* Status
* Confidence score
* Reason (for LATE)
* Timestamp
* Session ID

---

## 🔐 Security & Compliance Notes

* No images stored in DB
* Only embeddings used
* Manual overrides are logged
* Reasons mandatory for late entries
* No cloud dependency by default

---

## 🧪 Tested Environments

* Ubuntu 22.04
* WSL2 (camera via USB or snapshot mode)
* Windows (snapshot mode)

---

## 📦 Tech Stack

* Python 3.10+
* Streamlit
* OpenCV
* InsightFace
* SQLite
* NumPy
* Pandas

---

## 🛣 Roadmap (Optional Enhancements)

* Anti-spoofing (blink detection, motion challenge)
* Role-based admin authentication
* CSV / Excel export
* REST API backend (FastAPI)
* Mobile companion app
* Vector DB for large deployments

---

## 👤 Author

**Mr-Infect**

Cybersecurity Engineer & AI Systems Builder

---

## 📜 License

MIT License (recommended)

---

## ⭐ Demo Tip

For live demos:

* Use snapshot mode
* Pre-load 3–5 students
* Show late override + report table
* Highlight audit trail



