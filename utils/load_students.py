import csv
from utils.db import insert_student

def load_students(file_path="data/students.txt"):
    with open(file_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            insert_student(row)

