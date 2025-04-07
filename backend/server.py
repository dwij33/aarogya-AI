# This file represents a simplified backend server (Python/Flask) implementation
# For a real production application, it would need proper error handling, security, etc.

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import json
import os
from datetime import datetime
import threading
import time
import pandas as pd
from werkzeug.utils import secure_filename
import uuid
import base64
import io
from PIL import Image

# Import ML libraries
# In a production environment, you would use proper ML frameworks like PyTorch, TensorFlow, etc.
try:
    import torch
    import transformers
    from transformers import pipeline
    HAS_ML_LIBS = True
except ImportError:
    HAS_ML_LIBS = False
    print("ML libraries not found. Running in mock mode.")

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load the datastore1.csv file
try:
    datastore_df = pd.read_csv('../datastore1.csv')
    HAS_DATASTORE = True
    print(f"Loaded datastore1.csv with {len(datastore_df)} records")
except Exception as e:
    HAS_DATASTORE = False
    print(f"Failed to load datastore1.csv: {e}")
    datastore_df = None

# Mock database (in a real app, use MongoDB or similar)
users_db = {}
health_records_db = {}
appointments_db = {}
medications_db = {}

# Medical knowledge base - Adding scientific medical knowledge
medical_knowledge_db = {
    "hypertension": {
        "id": "HTN-001",
        "name": "Hypertension",
        "description": "A chronic condition in which the blood pressure in the arteries is elevated.",
        "risk_factors": ["Age over 50", "Family history", "High sodium diet", "Obesity", "Sedentary lifestyle"],
        "complications": ["Heart disease", "Stroke", "Kidney damage", "Vision loss"],
        "treatments": ["Lifestyle modifications", "Diuretics", "ACE inhibitors", "Beta blockers"],
        "prevention": ["Regular exercise", "Healthy diet", "Sodium restriction", "Limiting alcohol", "Not smoking"]
    },
    "diabetes": {
        "id": "DM-001",
        "name": "Diabetes Mellitus",
        "description": "A metabolic disorder characterized by high blood sugar over a prolonged period.",
        "risk_factors": ["Family history", "Obesity", "Physical inactivity", "Age over 45", "Gestational diabetes"],
        "complications": ["Heart disease", "Kidney disease", "Neuropathy", "Retinopathy"],
        "treatments": ["Insulin therapy", "Oral medications", "Diet management", "Regular exercise"],
        "prevention": ["Weight management", "Regular physical activity", "Balanced diet"]
    },
    "asthma": {
        "id": "ASTH-001",
        "name": "Asthma",
        "description": "A chronic condition affecting the airways in the lungs, causing breathing difficulty.",
        "risk_factors": ["Allergies", "Family history", "Respiratory infections", "Air pollution", "Smoking"],
        "complications": ["Sleep disturbances", "Permanent airway remodeling", "Work/school absenteeism"],
        "treatments": ["Bronchodilators", "Inhaled corticosteroids", "Leukotriene modifiers", "Immunotherapy"],
        "prevention": ["Avoiding triggers", "Regular medication", "Allergy management"]
    },
    "arthritis": {
        "id": "ARTH-001",
        "name": "Arthritis",
        "description": "Inflammation of one or more joints, causing pain and stiffness.",
        "risk_factors": ["Age over 65", "Female gender", "Previous joint injury", "Obesity", "Family history"],
        "complications": ["Joint deformity", "Reduced mobility", "Chronic pain"],
        "treatments": ["Physical therapy", "Anti-inflammatory medications", "Joint replacement", "Weight management"],
        "prevention": ["Joint-friendly exercise", "Maintaining healthy weight", "Avoiding joint injuries"]
    },
    "heart_disease": {
        "id": "HD-001",
        "name": "Heart Disease",
        "description": "A range of conditions affecting heart function and structure.",
        "risk_factors": ["Hypertension", "High cholesterol", "Smoking", "Diabetes", "Family history", "Age"],
        "complications": ["Heart failure", "Arrhythmias", "Heart attack", "Sudden cardiac death"],
        "treatments": ["Medications", "Lifestyle changes", "Surgical procedures", "Cardiac rehabilitation"],
        "prevention": ["Regular exercise", "Heart-healthy diet", "Not smoking", "Stress management"]
    }
}

# Enhanced symptom analyzer that uses the CSV data
class EnhancedSymptomAnalyzer:
    def __init__(self):
        # These would be learned embeddings in a real model
        self.condition_keywords = {
            "cold": ["cough", "sneeze", "runny nose", "sore throat", "congestion"],
            "flu": ["fever", "body ache", "fatigue", "headache", "chills"],
            "covid": ["fever", "cough", "shortness of breath", "loss of taste", "loss of smell"],
            "allergies": ["sneezing", "itchy eyes", "runny nose", "congestion"],
            "migraine": ["headache", "nausea", "sensitivity to light", "aura"],
            "food poisoning": ["nausea", "vomiting", "diarrhea", "stomach cramps"],
            "anxiety": ["worry", "restlessness", "rapid heartbeat", "trouble sleeping"]
        }
        
        # Disease mapping from datastore1.csv 
        self.disease_mapping = {
            0: "Hypertension",
            1: "Diabetes",
            2: "Asthma",
            3: "Arthritis",
            4: "Heart Disease"
        }
        
        # Blood type mapping
        self.blood_type_mapping = {
            0: "A+", 1: "A-", 2: "B+", 3: "B-", 
            4: "AB+", 5: "AB-", 6: "O+", 7: "O-"
        }
        
        # Load and process datastore
        self.datastore_processed = False
        if HAS_DATASTORE and datastore_df is not None:
            self.process_datastore()
    
    def process_datastore(self):
        """Process the datastore1.csv to extract patterns for symptom analysis"""
        try:
            # Create disease patterns dictionary
            self.disease_patterns = {}
            
            # Group by Disease and Age_Bin to identify age-related patterns
            disease_age_groups = datastore_df.groupby(['Disease', 'Age_Bin']).size().reset_index(name='count')
            
            # Group by Disease and Blood Type to identify blood type patterns
            disease_blood_groups = datastore_df.groupby(['Disease', 'Blood Type']).size().reset_index(name='count')
            
            # Process age bin patterns
            for _, row in disease_age_groups.iterrows():
                disease = int(row['Disease'])
                age_bin = int(row['Age_Bin'])
                disease_name = self.disease_mapping.get(disease, f"Unknown Disease {disease}")
                
                if disease_name not in self.disease_patterns:
                    self.disease_patterns[disease_name] = {'age_bins': {}, 'blood_types': {}}
                
                self.disease_patterns[disease_name]['age_bins'][age_bin] = row['count']
            
            # Process blood type patterns
            for _, row in disease_blood_groups.iterrows():
                disease = int(row['Disease'])
                blood_type = int(row['Blood Type'])
                disease_name = self.disease_mapping.get(disease, f"Unknown Disease {disease}")
                
                if disease_name not in self.disease_patterns:
                    self.disease_patterns[disease_name] = {'age_bins': {}, 'blood_types': {}}
                
                blood_type_name = self.blood_type_mapping.get(blood_type, f"Unknown Blood Type {blood_type}")
                self.disease_patterns[disease_name]['blood_types'][blood_type_name] = row['count']
            
            # Calculate disease prevalence by test results
            disease_test_result = datastore_df.groupby(['Disease', 'Test Result']).size().reset_index(name='count')
            for _, row in disease_test_result.iterrows():
                disease = int(row['Disease'])
                test_result = int(row['Test Result'])
                disease_name = self.disease_mapping.get(disease, f"Unknown Disease {disease}")
                
                if 'test_results' not in self.disease_patterns[disease_name]:
                    self.disease_patterns[disease_name]['test_results'] = {}
                
                self.disease_patterns[disease_name]['test_results'][test_result] = row['count']
            
            self.datastore_processed = True
            print("Successfully processed datastore1.csv for enhanced symptom analysis")
        except Exception as e:
            print(f"Error processing datastore: {e}")
    
    def analyze(self, symptoms_text):
        symptoms_text = symptoms_text.lower()
        results = []
        
        # 1. Traditional keyword matching for symptoms
        for condition, keywords in self.condition_keywords.items():
            score = 0
            matched_keywords = []
            
            for keyword in keywords:
                if keyword in symptoms_text:
                    score += 1
                    matched_keywords.append(keyword)
            
            if matched_keywords:
                confidence = min(90, (score / len(keywords)) * 100)
                results.append({
                    "condition": condition.title(),
                    "confidence": round(confidence + np.random.uniform(-10, 10), 1),
                    "matched_symptoms": matched_keywords
                })
        
        # 2. Datastore-based analysis for age-related conditions
        if self.datastore_processed:
            # Extract age from symptoms text
            age = None
            age_keywords = ["age", "years old", "year old"]
            for keyword in age_keywords:
                if keyword in symptoms_text:
                    parts = symptoms_text.split()
                    for i, part in enumerate(parts):
                        if keyword in part and i > 0:
                            try:
                                age = int(parts[i-1])
                                break
                            except ValueError:
                                pass
            
            # Map age to age bin
            age_bin = None
            if age is not None:
                if age < 30:
                    age_bin = 0
                elif age < 50:
                    age_bin = 1
                else:
                    age_bin = 2
            
            # Extract blood type from symptoms if mentioned
            blood_type = None
            blood_types = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-", "a positive", "a negative", 
                          "b positive", "b negative", "ab positive", "ab negative", "o positive", "o negative"]
            
            for bt in blood_types:
                if bt in symptoms_text:
                    blood_type = bt.replace("positive", "+").replace("negative", "-").upper()
                    break
            
            # Add conditions based on age and blood type patterns from datastore
            if age_bin is not None:
                # Get diseases sorted by prevalence in this age bin
                age_related_diseases = []
                for disease_name, patterns in self.disease_patterns.items():
                    if age_bin in patterns['age_bins']:
                        count = patterns['age_bins'][age_bin]
                        age_related_diseases.append((disease_name, count))
                
                # Sort by prevalence and add top diseases
                age_related_diseases.sort(key=lambda x: x[1], reverse=True)
                for disease_name, count in age_related_diseases[:2]:  # Add top 2 age-related conditions
                    # Calculate a confidence score based on count and add some randomness
                    confidence = min(85, 50 + count * 5)
                    
                    # Check if already in results
                    if not any(r["condition"] == disease_name for r in results):
                        results.append({
                            "condition": disease_name,
                            "confidence": round(confidence + np.random.uniform(-15, 10), 1),
                            "matched_symptoms": [f"Age group ({age} years)"]
                        })
            
            # Add conditions based on keywords extracted from symptoms
            keywords_to_diseases = {
                "pressure": "Hypertension",
                "blood pressure": "Hypertension",
                "sugar": "Diabetes",
                "thirst": "Diabetes",
                "breathing": "Asthma",
                "wheezing": "Asthma",
                "joint pain": "Arthritis",
                "chest pain": "Heart Disease",
                "palpitations": "Heart Disease"
            }
            
            for keyword, disease in keywords_to_diseases.items():
                if keyword in symptoms_text and not any(r["condition"] == disease for r in results):
                    confidence = 70 + np.random.uniform(-10, 10)
                    results.append({
                        "condition": disease,
                        "confidence": round(confidence, 1),
                        "matched_symptoms": [f"Mentioned '{keyword}'"]
                    })
        
        # Sort by confidence
        results = sorted(results, key=lambda x: x["confidence"], reverse=True)
        
        if not results:
            results.append({
                "condition": "Unknown",
                "confidence": 20.0,
                "matched_symptoms": []
            })
        
        return results[:3]  # Return top 3 conditions

# Medical Report Analyzer class
class MedicalReportAnalyzer:
    def __init__(self):
        # Disease mapping from datastore1.csv
        self.disease_mapping = {
            0: "Hypertension",
            1: "Diabetes",
            2: "Asthma",
            3: "Arthritis",
            4: "Heart Disease"
        }
        
        # Blood type mapping
        self.blood_type_mapping = {
            0: "A+", 1: "A-", 2: "B+", 3: "B-", 
            4: "AB+", 5: "AB-", 6: "O+", 7: "O-"
        }
        
        # Age bin mapping
        self.age_bin_mapping = {
            0: "0-30",
            1: "30-50",
            2: "50+"
        }
        
        # Disease-test result relationship
        self.disease_test_mapping = {}
        
        # Load and process datastore
        self.datastore_processed = False
        if HAS_DATASTORE and datastore_df is not None:
            self.process_datastore()
    
    def process_datastore(self):
        """Process the datastore1.csv for medical report analysis"""
        try:
            # Disease-Age correlations
            disease_age_corr = datastore_df.groupby(['Disease', 'Age_Bin']).size().reset_index(name='count')
            self.disease_age_corr = {}
            for _, row in disease_age_corr.iterrows():
                disease = int(row['Disease'])
                age_bin = int(row['Age_Bin'])
                count = row['count']
                
                if disease not in self.disease_age_corr:
                    self.disease_age_corr[disease] = {}
                
                self.disease_age_corr[disease][age_bin] = count
            
            # Disease-Gender correlations
            disease_gender_corr = datastore_df.groupby(['Disease', 'Gender']).size().reset_index(name='count')
            self.disease_gender_corr = {}
            for _, row in disease_gender_corr.iterrows():
                disease = int(row['Disease'])
                gender = int(row['Gender'])
                count = row['count']
                
                if disease not in self.disease_gender_corr:
                    self.disease_gender_corr[disease] = {}
                
                self.disease_gender_corr[disease][gender] = count
            
            # Disease-Blood Type correlations
            disease_blood_corr = datastore_df.groupby(['Disease', 'Blood Type']).size().reset_index(name='count')
            self.disease_blood_corr = {}
            for _, row in disease_blood_corr.iterrows():
                disease = int(row['Disease'])
                blood_type = int(row['Blood Type'])
                count = row['count']
                
                if disease not in self.disease_blood_corr:
                    self.disease_blood_corr[disease] = {}
                
                self.disease_blood_corr[disease][blood_type] = count
            
            # Disease-Test Result correlations
            disease_test_corr = datastore_df.groupby(['Disease', 'Test Result']).size().reset_index(name='count')
            self.disease_test_corr = {}
            for _, row in disease_test_corr.iterrows():
                disease = int(row['Disease'])
                test_result = int(row['Test Result'])
                count = row['count']
                
                if disease not in self.disease_test_corr:
                    self.disease_test_corr[disease] = {}
                
                self.disease_test_corr[disease][test_result] = count
            
            # Disease-Medication correlations
            disease_med_corr = datastore_df.groupby(['Disease', 'Medication']).size().reset_index(name='count')
            self.disease_med_corr = {}
            for _, row in disease_med_corr.iterrows():
                disease = int(row['Disease'])
                medication = int(row['Medication'])
                count = row['count']
                
                if disease not in self.disease_med_corr:
                    self.disease_med_corr[disease] = {}
                
                self.disease_med_corr[disease][medication] = count
            
            # Average billing amount per disease
            disease_billing = datastore_df.groupby('Disease')['Billing Amount'].mean().reset_index()
            self.disease_billing = {}
            for _, row in disease_billing.iterrows():
                disease = int(row['Disease'])
                amount = row['Billing Amount']
                self.disease_billing[disease] = amount
                
            self.datastore_processed = True
            print("Successfully processed datastore1.csv for medical report analysis")
        except Exception as e:
            print(f"Error processing datastore for medical report analysis: {e}")
    
    def analyze_report(self, report_data):
        """
        Analyze medical report data
        
        Parameters:
        report_data (dict): Contains patient data like age, gender, blood type, test results, etc.
        
        Returns:
        dict: Analysis results
        """
        if not self.datastore_processed:
            return {
                "error": "Datastore not processed, unable to perform analysis"
            }
        
        age = report_data.get('age', 30)
        gender = report_data.get('gender', 0)  # Default to female
        blood_type = report_data.get('bloodType')
        test_result = report_data.get('testResult')
        
        # Map age to age bin
        age_bin = 0
        if age >= 50:
            age_bin = 2
        elif age >= 30:
            age_bin = 1
        
        # Calculate disease probabilities based on correlations
        disease_probabilities = {}
        for disease in range(5):  # 5 diseases in our mapping
            probability = 50  # Base probability
            factors = []
            
            # Age factor
            if disease in self.disease_age_corr and age_bin in self.disease_age_corr[disease]:
                age_factor = self.disease_age_corr[disease][age_bin]
                probability += min(20, age_factor * 5)
                factors.append(f"Age group {self.age_bin_mapping[age_bin]}")
            
            # Gender factor
            if disease in self.disease_gender_corr and gender in self.disease_gender_corr[disease]:
                gender_factor = self.disease_gender_corr[disease][gender]
                probability += min(15, gender_factor * 3)
                factors.append(f"Gender: {'Male' if gender == 1 else 'Female'}")
            
            # Blood type factor
            if blood_type is not None and disease in self.disease_blood_corr and blood_type in self.disease_blood_corr[disease]:
                blood_factor = self.disease_blood_corr[disease][blood_type]
                probability += min(10, blood_factor * 2)
                factors.append(f"Blood type: {self.blood_type_mapping[blood_type]}")
            
            # Test result factor
            if test_result is not None and disease in self.disease_test_corr and test_result in self.disease_test_corr[disease]:
                test_factor = self.disease_test_corr[disease][test_result]
                probability += min(25, test_factor * 8)
                factors.append(f"Test result: {'Positive' if test_result == 1 else 'Negative'}")
            
            # Cap probability
            probability = min(95, max(5, probability))
            
            # Store disease probability and factors
            disease_name = self.disease_mapping[disease]
            disease_probabilities[disease_name] = {
                "probability": round(probability + np.random.uniform(-5, 5), 1),
                "factors": factors
            }
        
        # Sort diseases by probability
        sorted_diseases = sorted(
            disease_probabilities.items(),
            key=lambda x: x[1]["probability"],
            reverse=True
        )
        
        # Get medical knowledge for top diseases
        medical_knowledge = []
        for disease_name, _ in sorted_diseases[:2]:
            # Convert to key format for medical_knowledge_db
            disease_key = disease_name.lower().replace(" ", "_")
            if disease_key in medical_knowledge_db:
                medical_knowledge.append(medical_knowledge_db[disease_key])
        
        # Generate recommended follow-ups based on top disease
        top_disease = sorted_diseases[0][0] if sorted_diseases else None
        follow_ups = [
            "Schedule a follow-up appointment in 3 months",
            "Regular monitoring of vital signs"
        ]
        
        if top_disease == "Hypertension":
            follow_ups.extend([
                "Blood pressure monitoring at home",
                "Sodium-restricted diet",
                "Consider consulting with a cardiologist"
            ])
        elif top_disease == "Diabetes":
            follow_ups.extend([
                "Regular blood glucose monitoring",
                "Dietary consultation",
                "Consider consulting with an endocrinologist"
            ])
        elif top_disease == "Asthma":
            follow_ups.extend([
                "Peak flow monitoring",
                "Identify and avoid triggers",
                "Consider consulting with a pulmonologist"
            ])
        elif top_disease == "Arthritis":
            follow_ups.extend([
                "Physical therapy assessment",
                "Pain management strategy",
                "Consider consulting with a rheumatologist"
            ])
        elif top_disease == "Heart Disease":
            follow_ups.extend([
                "Lipid profile and cardiac enzymes",
                "Stress test evaluation",
                "Immediate consultation with a cardiologist"
            ])
        
        # Calculate overall health score
        health_score = 100
        for disease_name, details in sorted_diseases:
            prob = details["probability"]
            # Subtract weighted probability from health score
            if prob > 70:
                health_score -= (prob * 0.3)
            elif prob > 50:
                health_score -= (prob * 0.2)
            else:
                health_score -= (prob * 0.1)
        
        # Cap health score
        health_score = max(1, min(100, health_score))
        
        # Build response
        analysis_result = {
            "potentialConditions": [
                {
                    "name": disease_name,
                    "probability": details["probability"],
                    "riskFactors": details["factors"]
                }
                for disease_name, details in sorted_diseases[:3]
            ],
            "medicalKnowledge": medical_knowledge,
            "followUpRecommendations": follow_ups,
            "healthScore": round(health_score, 1),
            "warningFlags": [],
            "timestamp": datetime.now().isoformat()
        }
        
        # Add warning flags for high probabilities
        for disease_name, details in sorted_diseases:
            if details["probability"] > 70:
                analysis_result["warningFlags"].append({
                    "condition": disease_name,
                    "priority": "high" if details["probability"] > 85 else "medium",
                    "message": f"High probability of {disease_name} detected"
                })
        
        return analysis_result

# Initialize analyzers
symptom_analyzer = EnhancedSymptomAnalyzer()
report_analyzer = MedicalReportAnalyzer()

# Mock mental health chatbot
class MockMentalHealthChatbot:
    def __init__(self):
        # Simple rule-based responses for demo purposes
        self.responses = {
            "anxiety": [
                "I understand you're feeling anxious. Deep breathing can help - try taking slow, deep breaths for a few minutes.",
                "Anxiety is common, and there are ways to manage it. Have you tried mindfulness techniques?",
                "I hear that you're experiencing anxiety. Sometimes, focusing on the present moment can help reduce anxious thoughts."
            ],
            "depression": [
                "I'm sorry to hear you're feeling down. Remember that your feelings are valid, and help is available.",
                "Depression can be really challenging. Have you spoken to anyone else about how you're feeling?",
                "Thank you for sharing that with me. It takes courage to talk about feelings of depression."
            ],
            "stress": [
                "Stress can be overwhelming. Taking short breaks throughout the day might help you manage it better.",
                "Managing stress is important for your wellbeing. Regular physical activity can help reduce stress levels.",
                "It sounds like you're under a lot of pressure. Remember to prioritize self-care during stressful periods."
            ],
            "sleep": [
                "Sleep problems can affect your mental health significantly. Establishing a regular sleep routine might help.",
                "Having trouble sleeping can be frustrating. Limiting screen time before bed could improve your sleep quality.",
                "I understand sleep issues can be challenging. Creating a calm environment before bedtime might help you sleep better."
            ]
        }
        self.default_responses = [
            "Thank you for sharing that with me. How long have you been feeling this way?",
            "I appreciate you opening up about this. Would you like to explore some coping strategies together?",
            "I'm here to listen and support you. Could you tell me more about what you're experiencing?",
            "That sounds challenging. Remember that seeking help is a sign of strength, not weakness.",
            "Your feelings are valid. Would it help to talk about specific situations that trigger these feelings?"
        ]
    
    def get_response(self, user_input):
        user_input = user_input.lower()
        
        for topic, responses in self.responses.items():
            if topic in user_input:
                return np.random.choice(responses)
        
        return np.random.choice(self.default_responses)

# Initialize mock mental health chatbot
mental_health_chatbot = MockMentalHealthChatbot()

# Add a class for prescription analysis
class PrescriptionAnalyzer:
    def __init__(self):
        self.common_medications = {
            "amoxicillin": {
                "category": "antibiotic",
                "common_dosages": ["250mg", "500mg"],
                "interactions": ["alcohol", "warfarin", "methotrexate"],
                "side_effects": ["diarrhea", "nausea", "rash"],
                "contraindications": ["penicillin allergy"]
            },
            "atorvastatin": {
                "category": "statin",
                "common_dosages": ["10mg", "20mg", "40mg", "80mg"],
                "interactions": ["grapefruit", "cyclosporine", "gemfibrozil"],
                "side_effects": ["muscle pain", "headache", "digestive issues"],
                "contraindications": ["liver disease", "pregnancy"]
            },
            "metformin": {
                "category": "antidiabetic",
                "common_dosages": ["500mg", "850mg", "1000mg"],
                "interactions": ["alcohol", "iodinated contrast media"],
                "side_effects": ["diarrhea", "nausea", "abdominal pain"],
                "contraindications": ["kidney disease", "metabolic acidosis"]
            },
            "paracetamol": {
                "category": "analgesic",
                "common_dosages": ["500mg", "650mg"],
                "interactions": ["warfarin", "alcohol"],
                "side_effects": ["liver damage (in overdose)"],
                "contraindications": ["liver disease"]
            },
            "lisinopril": {
                "category": "ACE inhibitor",
                "common_dosages": ["5mg", "10mg", "20mg"],
                "interactions": ["potassium supplements", "spironolactone"],
                "side_effects": ["dry cough", "dizziness", "headache"],
                "contraindications": ["pregnancy", "history of angioedema"]
            }
        }
        
        self.common_diagnoses = [
            "hypertension", "diabetes", "bacterial infection", 
            "influenza", "common cold", "respiratory infection",
            "arthritis", "anxiety", "depression", "insomnia",
            "hyperlipidemia", "hypothyroidism"
        ]
    
    def analyze_prescription_image(self, image_file):
        """
        Mock prescription image analysis using OCR-like response
        In a real implementation, this would use OCR and ML to extract information
        """
        # This would be where we'd use OCR to extract text from the image
        # For now, we'll create a mock analysis
        
        # Randomly select 1-3 medications
        import random
        num_meds = random.randint(1, 3)
        selected_meds = random.sample(list(self.common_medications.keys()), num_meds)
        
        medications = []
        for med in selected_meds:
            med_info = self.common_medications[med]
            dosage = random.choice(med_info["common_dosages"])
            
            frequencies = ["once daily", "twice daily", "three times daily", "four times daily", 
                          "every morning", "every night", "as needed"]
            durations = ["7 days", "10 days", "14 days", "1 month", "ongoing"]
            
            medications.append({
                "name": med.capitalize(),
                "dosage": dosage,
                "frequency": random.choice(frequencies),
                "duration": random.choice(durations)
            })
            
        # Generate random diagnoses (1-2)
        num_diagnoses = random.randint(1, 2)
        diagnoses = random.sample(self.common_diagnoses, num_diagnoses)
        diagnoses = [d.capitalize() for d in diagnoses]
        
        # Generate doctor notes
        notes_options = [
            "Rest advised. Plenty of fluids. Follow up if symptoms persist.",
            "Avoid strenuous activity for a week. Stay hydrated.",
            "Follow up in two weeks. Avoid alcohol while on medication.",
            "Diet modification recommended. Reduce salt intake.",
            "Exercise regularly. Maintain proper sleep schedule."
        ]
        
        # Generate warning flags
        warnings = []
        interactions = []
        
        # Add medication-specific warnings
        for med in selected_meds:
            med_info = self.common_medications[med]
            
            # Add a contraindication warning
            if med_info["contraindications"]:
                contra = random.choice(med_info["contraindications"])
                warnings.append({
                    "type": "Contraindication",
                    "severity": random.choice(["high", "medium"]),
                    "message": f"Check for {contra} before taking {med.capitalize()}"
                })
            
            # Add a side effect warning
            if med_info["side_effects"]:
                side_effect = random.choice(med_info["side_effects"])
                warnings.append({
                    "type": "Side Effect",
                    "severity": "low",
                    "message": f"{med.capitalize()} may cause {side_effect}"
                })
        
        # Add interaction warnings if we have multiple medications
        if len(selected_meds) > 1:
            for i in range(len(selected_meds)):
                for j in range(i+1, len(selected_meds)):
                    med1 = selected_meds[i].capitalize()
                    med2 = selected_meds[j].capitalize()
                    
                    # 30% chance of an interaction
                    if random.random() < 0.3:
                        severity = random.choice(["low", "medium", "high"])
                        
                        if severity == "low":
                            description = f"Minor interaction between {med1} and {med2}. Monitor for changes."
                        elif severity == "medium":
                            description = f"Moderate interaction between {med1} and {med2}. Use caution and monitor closely."
                        else:
                            description = f"Significant interaction between {med1} and {med2}. Consult doctor immediately."
                        
                        interactions.append({
                            "medications": [med1, med2],
                            "severity": severity,
                            "description": description
                        })
                    else:
                        # No significant interaction
                        interactions.append({
                            "medications": [med1, med2],
                            "severity": "low",
                            "description": f"No significant interactions expected between {med1} and {med2}"
                        })
        
        return {
            "medications": medications,
            "diagnoses": diagnoses,
            "doctorNotes": random.choice(notes_options),
            "patientInfo": {
                "name": "Patient",  # In a real system, this would be extracted
                "age": random.randint(25, 70),
                "gender": random.choice(["Male", "Female"])
            },
            "warningFlags": warnings,
            "interactions": interactions,
            "timestamp": datetime.now().isoformat()
        }

# Initialize the prescription analyzer
prescription_analyzer = PrescriptionAnalyzer()

# Create upload folder if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size

# Routes
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "server_time": datetime.now().isoformat(),
        "ml_libraries_available": HAS_ML_LIBS,
        "datastore_available": HAS_DATASTORE
    })

@app.route("/api/analyze-symptoms", methods=["POST"])
def analyze_symptoms():
    data = request.json
    symptoms_text = data.get("symptoms", "")
    user_info = data.get("userInfo", {})
    
    if not symptoms_text:
        return jsonify({"error": "No symptoms provided"}), 400
    
    analysis_results = symptom_analyzer.analyze(symptoms_text)
    
    # Calculate risk factors based on user info and datastore patterns
    age = user_info.get("age", 30)
    age_risk = "high" if age > 60 else "medium" if age > 45 else "low"
    
    response = {
        "results": analysis_results,
        "user_risk_factors": {
            "age": age_risk,
            "region": "medium" if user_info.get("region") in ["Mumbai", "Delhi", "Bangalore"] else "low",
            "history": "high" if user_info.get("has_chronic_conditions", False) else "low"
        }
    }
    
    return jsonify(response)

@app.route("/api/analyze-report", methods=["POST"])
def analyze_report():
    """Endpoint for analyzing medical report data using datastore1.csv"""
    data = request.json
    
    if not data:
        return jsonify({"error": "No report data provided"}), 400
    
    # Perform analysis
    analysis_result = report_analyzer.analyze_report(data)
    
    return jsonify(analysis_result)

@app.route("/api/disease-info", methods=["GET"])
def get_disease_info():
    """Endpoint to get disease information from the dataset"""
    if not HAS_DATASTORE:
        return jsonify({"error": "Datastore not available"}), 503
    
    result = []
    for disease_id, disease_name in report_analyzer.disease_mapping.items():
        # Build prevalence data
        prevalence = []
        if disease_id in report_analyzer.disease_age_corr:
            for age_bin, count in report_analyzer.disease_age_corr[disease_id].items():
                prevalence.append({
                    "ageGroup": report_analyzer.age_bin_mapping[age_bin],
                    "count": count
                })
        
        # Build blood type correlation
        blood_correlation = []
        if disease_id in report_analyzer.disease_blood_corr:
            for blood_type, count in report_analyzer.disease_blood_corr[disease_id].items():
                blood_correlation.append({
                    "bloodType": report_analyzer.blood_type_mapping[blood_type],
                    "count": count
                })
        
        result.append({
            "id": disease_id,
            "name": disease_name,
            "prevalence": prevalence,
            "bloodTypeCorrelation": blood_correlation
        })
    
    return jsonify(result)

@app.route("/api/medical-knowledge", methods=["GET"])
def get_medical_knowledge():
    """Endpoint to get medical knowledge base entries"""
    query = request.args.get("query", "").lower()
    
    if query:
        # Filter knowledge by query
        results = []
        for key, data in medical_knowledge_db.items():
            if (query in key or 
                query in data["name"].lower() or 
                query in data["description"].lower()):
                results.append(data)
        return jsonify(results)
    else:
        # Return all knowledge entries
        return jsonify(list(medical_knowledge_db.values()))

@app.route("/api/mental-health/chat", methods=["POST"])
def mental_health_chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400
    
    # Simulate processing delay
    time.sleep(1)
    
    response = mental_health_chatbot.get_response(user_message)
    
    return jsonify({
        "response": response,
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/analyze-prescription", methods=["POST"])
def analyze_prescription():
    """Endpoint for analyzing prescription images"""
    if 'prescription_image' not in request.files:
        return jsonify({"error": "No prescription image provided"}), 400
    
    file = request.files['prescription_image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file:
        # In a production system, we would validate file type and content more thoroughly
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Process the image and analyze prescription
            analysis_result = prescription_analyzer.analyze_prescription_image(file_path)
            
            # Clean up the file after analysis (optional)
            os.remove(file_path)
            
            return jsonify(analysis_result)
        except Exception as e:
            # Clean up in case of error
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({"error": f"Error analyzing prescription: {str(e)}"}), 500
    
    return jsonify({"error": "Invalid file"}), 400

# This would run in a production environment
if __name__ == "__main__":
    print("Starting ArogyaAI+ Backend Server...")
    print(f"ML Libraries Available: {HAS_ML_LIBS}")
    
    # In a real app, you would initialize ML models here
    if HAS_ML_LIBS:
        print("Loading NLP models...")
        # Example:
        # symptom_analyzer = pipeline("text-classification", model="healthcare/symptom-analysis")
        # mental_health_model = pipeline("text-generation", model="healthcare/mental-health-support")
    
    app.run(debug=True, port=5000)
