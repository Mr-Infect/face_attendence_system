import streamlit as st
import time
import uuid
import numpy as np
from PIL import Image
import pandas as pd

from models.face_recognizer import FaceRecognizer
from services.scheduler import load_schedule, get_current_phase
from utils.db import (
    init_db,
    mark_attendance,
    get_all_students,
    get_attendance_by_session
)
from utils.load_students import load_students

# ---------- INIT ----------
st.set_page_config(page_title="Face Attendance System", layout="wide")

init_db()
load_students()

schedule = load_schedule()

@st.cache_resource
def load_recognizer():
    return FaceRecognizer()

recognizer = load_recognizer()

st.title("🎯 Face Attendance System")

# ---------- SESSION CONTROLS ----------
st.sidebar.header("Full-Day Controls")

enable_full_day = st.sidebar.checkbox("Enable Full-Day Mode", value=True)

if st.sidebar.button("Start Day"):
    st.session_state.clear()
    st.session_state["day_id"] = str(uuid.uuid4())
    st.session_state["present"] = set()
    st.success("Full day session started")

# ---------- CURRENT PHASE ----------
current_phase = get_current_phase(schedule) if enable_full_day else "manual"

st.info(f"🕰 Current Phase: **{current_phase or 'No Active Session'}**")

attendance_active = current_phase in ["morning", "afternoon", "evening"]

# ---------- CAMERA ----------
if attendance_active:
    st.subheader("Capture Student Image")

    img_file = st.camera_input("Take a photo")

    if img_file is not None:
        image = Image.open(img_file)
        image_np = np.array(image)

        st.image(image, caption="Captured Image", use_column_width=True)

        student_id, confidence = recognizer.recognize(image_np)

        if student_id:
            if student_id not in st.session_state["present"]:
                student = next(
                    s for s in get_all_students()
                    if s["student_id"] == student_id
                )

                st.session_state["present"].add(student_id)

                mark_attendance(
                    student=student,
                    status="PRESENT",
                    confidence=confidence,
                    session_id=f"{st.session_state['day_id']}_{current_phase}"
                )

                st.success(f"✅ PRESENT ({current_phase}): {student['name']}")
            else:
                st.info("Already marked PRESENT")
        else:
            st.warning("❌ Unknown face — discarded")
else:
    st.warning("⏸ Attendance paused (Break / No session)")

# ---------- LATE OVERRIDE ----------
st.divider()
st.subheader("🕒 Late Arrival Override")

if "day_id" in st.session_state:
    students = get_all_students()

    selected_student = st.selectbox(
        "Select Student",
        students,
        format_func=lambda s: f"{s['name']} ({s['student_id']})"
    )

    late_reason = st.text_input("Reason for late arrival")

    if st.button("Mark LATE"):
        if not late_reason.strip():
            st.error("Reason required")
        else:
            mark_attendance(
                student=selected_student,
                status="LATE",
                confidence=0.0,
                reason=late_reason,
                session_id=f"{st.session_state['day_id']}_{current_phase or 'manual'}"
            )
            st.success("Marked as LATE")

# ---------- REPORT ----------
st.divider()
st.subheader("📊 Attendance Report (Today)")

if "day_id" in st.session_state:
    records = []

    for phase in schedule.keys():
        session_id = f"{st.session_state['day_id']}_{phase}"
        records.extend(get_attendance_by_session(session_id))

    if records:
        df = pd.DataFrame(
            records,
            columns=[
                "Student ID",
                "Name",
                "Class",
                "Roll No",
                "Status",
                "Confidence",
                "Reason",
                "Time"
            ]
        )
        st.dataframe(df, use_container_width=True)
    else:
        st.info("No attendance records yet")
