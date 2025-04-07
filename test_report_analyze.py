import requests
import json

# Test data that matches what we're sending from the frontend
test_data = {
    "age": 45,
    "gender": 1,  # Male
    "bloodType": 0,  # A+
    "testResult": 1  # Positive
}

print("Sending test data to analyze-report endpoint:")
print(json.dumps(test_data, indent=2))

try:
    response = requests.post(
        "http://localhost:5000/api/analyze-report",
        json=test_data
    )
    
    print(f"Status code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print("\nAnalysis result:")
        print(json.dumps(result, indent=2))
    else:
        print(f"Error: {response.text}")
except Exception as e:
    print(f"Error connecting to API: {e}") 