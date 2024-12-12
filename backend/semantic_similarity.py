from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
from pymongo import MongoClient
import json
from bson import ObjectId 

# Load models
sbert_model = SentenceTransformer('stsb-roberta-large')
nli_model = pipeline("text-classification", model="roberta-large-mnli")

# MongoDB connection setup
client = MongoClient("mongodb://127.0.0.1:27017/", serverSelectionTimeoutMS=50000) 
db = client["Quizdb"]  # Replace with your database name
collection = db["quizzes"]  # Replace with your collection name

# Function to compute scaled similarity
def compute_scaled_similarity(reference_answer, student_answer):
    # Step 1: Compute Semantic Similarity (SBERT)
    embedding1 = sbert_model.encode(reference_answer, convert_to_tensor=True)
    embedding2 = sbert_model.encode(student_answer, convert_to_tensor=True)
    similarity = util.pytorch_cos_sim(embedding1, embedding2).item()

    # Step 2: Compute Logical Relationship (NLI)
    nli_result = nli_model(f"{reference_answer} [SEP] {student_answer}")
    entailment_score = next((res['score'] for res in nli_result if res['label'] == "ENTAILMENT"), 0.0)
    contradiction_score = next((res['score'] for res in nli_result if res['label'] == "CONTRADICTION"), 0.0)

    # Step 3: Adjust Semantic Similarity
    if entailment_score > contradiction_score:
        scaled_similarity = similarity * (1 + entailment_score)
    elif contradiction_score > entailment_score:
        scaled_similarity = similarity * (1 - contradiction_score)
    else:
        scaled_similarity = similarity

    scaled_similarity = max(0.0, min(scaled_similarity, 1.0))  # Ensure the score is within [0, 1]
    return similarity, entailment_score, contradiction_score, scaled_similarity

# Function to process quiz responses
def process_quiz_response(quiz_code, student_answers):
    # Fetch quiz template from MongoDB
    quiz_template = collection.find_one({"quizCode": quiz_code})

    if not quiz_template:
        raise ValueError(f"No quiz found with code {quiz_code}")

    questions = quiz_template["questions"]
    results = []

    # Compare each student answer with the reference answer
    for question in questions:
        question_id = str(question["_id"]) 
        reference_answer = question["answer"]
        question_text = question["text"]

        # Fetch corresponding student answer
        student_answer = student_answers.get(question_id, "")

        if not student_answer:
            scaled_similarity = 0.0
            similarity = entailment_score = contradiction_score = 0.0
        else:
            similarity, entailment_score, contradiction_score, scaled_similarity = compute_scaled_similarity(reference_answer, student_answer)

        # Save the results
        results.append({
            "question_id": question_id,
            "question_text": question_text,
            "reference_answer": reference_answer,
            "student_answer": student_answer,
            "question_score": scaled_similarity
        })

    # Write results to a JSON file
    output_file = f"quiz_{quiz_code}_results.json"
    with open(output_file, "w") as f:
        json.dump(results, f, indent=4)

    return output_file

# Example usage
if __name__ == "__main__":
    quiz_code = "ENG1010-12032024"
    student_answers = {
        "6759a2c9057d0040bd253a12": "a means of communication",
        "6759a2c9057d0040bd253a13": "reading speed is not necessary"
    }

    output_file = process_quiz_response(quiz_code, student_answers)
    print(f"Results saved to {output_file}")
