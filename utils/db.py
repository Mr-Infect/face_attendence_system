import sqlite3
from datetime import datetime

DB_PATH = "db/attendance.db"

def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def init_db():
    conn = get_connection()
    with open("db/schema.sql", "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()

def insert_student(student):
    conn = get_connection()
    conn.execute(
        """
        INSERT OR REPLACE INTO students
        (student_id, name, class, roll_no)
        VALUES (?, ?, ?, ?)
        """,
        (student["student_id"], student["name"], student["class"], student["roll_no"])
    )
    conn.commit()
    conn.close()

def get_all_students():
    conn = get_connection()
    cursor = conn.execute(
        "SELECT student_id, name, class, roll_no FROM students"
    )
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "student_id": r[0],
            "name": r[1],
            "class": r[2],
            "roll_no": r[3]
        }
        for r in rows
    ]

def mark_attendance(student, status, confidence, session_id, reason=None):
    conn = get_connection()
    now = datetime.now()

    conn.execute(
        """
        INSERT INTO attendance
        (student_id, name, class, roll_no, status, confidence, reason, date, time, session_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            student["student_id"],
            student["name"],
            student["class"],
            student["roll_no"],
            status,
            confidence,
            reason,
            now.date().isoformat(),
            now.time().strftime("%H:%M:%S"),
            session_id
        )
    )
    conn.commit()
    conn.close()

def get_attendance_by_session(session_id):
    conn = get_connection()
    cursor = conn.execute(
        """
        SELECT student_id, name, class, roll_no, status, confidence, reason, time
        FROM attendance
        WHERE session_id = ?
        """,
        (session_id,)
    )
    rows = cursor.fetchall()
    conn.close()
    return rows
