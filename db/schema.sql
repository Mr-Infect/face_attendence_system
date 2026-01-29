CREATE TABLE IF NOT EXISTS students (
    student_id TEXT PRIMARY KEY,
    name TEXT,
    class TEXT,
    roll_no TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    name TEXT,
    class TEXT,
    roll_no TEXT,
    status TEXT,
    confidence REAL,
    reason TEXT,
    date TEXT,
    time TEXT,
    session_id TEXT,
    FOREIGN KEY(student_id) REFERENCES students(student_id)
);
