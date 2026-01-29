import os
import cv2
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity

class FaceRecognizer:
    def __init__(self, known_faces_dir="data/known_faces", threshold=0.5):
        self.known_faces_dir = known_faces_dir
        self.threshold = threshold
        self.app = FaceAnalysis(name="buffalo_l")
        self.app.prepare(ctx_id=0)
        self.embeddings = {}
        self._load_known_faces()

    def _load_known_faces(self):
        for student_id in os.listdir(self.known_faces_dir):
            student_path = os.path.join(self.known_faces_dir, student_id)
            if not os.path.isdir(student_path):
                continue

            vectors = []
            for img_name in os.listdir(student_path):
                img_path = os.path.join(student_path, img_name)
                img = cv2.imread(img_path)
                if img is None:
                    continue

                faces = self.app.get(img)
                if faces:
                    vectors.append(faces[0].embedding)

            if vectors:
                self.embeddings[student_id] = np.mean(vectors, axis=0)

    def recognize(self, image_np):
        faces = self.app.get(image_np)
        if not faces:
            return None, 0.0

        query_embedding = faces[0].embedding

        best_match = None
        best_score = 0.0

        for student_id, known_embedding in self.embeddings.items():
            score = cosine_similarity(
                [query_embedding], [known_embedding]
            )[0][0]

            if score > best_score:
                best_score = score
                best_match = student_id

        if best_score >= self.threshold:
            return best_match, best_score

        return None, best_score
