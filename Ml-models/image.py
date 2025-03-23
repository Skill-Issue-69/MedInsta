import os
import json
import requests
import datetime
from typing import Dict
from transformers import pipeline
from PIL import Image
from io import BytesIO

# Initialize image-to-text pipeline from Hugging Face.
captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")

# Medical Template now includes a section for the image analysis.
MEDICAL_TEMPLATE = """<s>[INST] As a geriatric specialist:
{query}

Image analysis: {image_analysis}

Respond in THIS EXACT FORMAT:

[SYMPTOMS]
<description>

[CAUSES]
1. 
2. 

[STEPS]
- Step 1: 
- Step 2: 
- Step 3: 

[DOCTOR]
<specialist>

[WARNINGS]
- 

DO NOT: Misspell "SYMPTOMS". Use simple terms. [/INST]"""

def load_image(image_path: str) -> Image.Image:
    """Loads an image from a local path or a URL."""
    if image_path.startswith("http://") or image_path.startswith("https://"):
        response = requests.get(image_path, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    return Image.open(image_path)

def analyze_medical_image(
    image_path: str,
    query: str,
    temperature: float = 0.5,
    max_tokens: int = 1024
) -> Dict:
    """Process a medical query that includes an image and text prompt."""
    try:
        # Load the image (local or URL)
        image = load_image(image_path)
        
        # Extract important features using the image-to-text model
        caption_output = captioner(image)[0]['generated_text']
        
        # Create a combined prompt with the text query and image analysis
        formatted_prompt = MEDICAL_TEMPLATE.format(query=query, image_analysis=caption_output)
        
        # Prepare API request to Together API
        headers = {
            "Authorization": f"Bearer {os.getenv('TOGETHER_API_KEY', 'tgp_v1_vmEPQZI2siJ07sHrXbYuAWJEanvrL8l6X1vOIjSyFkE')}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            "messages": [{
                "role": "user",
                "content": formatted_prompt
            }],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stop": ["<|eot_id|>"]
        }
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        
        # Process response
        raw_response = response.json()["choices"][0]["message"]["content"].strip()
        return parse_medical_response(raw_response)
    
    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }

def parse_medical_response(raw_text: str) -> Dict:
    """Convert the structured text response into a dictionary."""
    sections = {
        "[SYMPTOMS]": "symptoms",
        "[CAUSES]": "causes",
        "[STEPS]": "steps",
        "[DOCTOR]": "doctor",
        "[WARNINGS]": "warnings"
    }
    
    parsed = {"status": "success", "timestamp": datetime.datetime.now().isoformat()}
    current_section = None
    
    for line in raw_text.split('\n'):
        line = line.strip()
        if line in sections:
            current_section = sections[line]
            parsed[current_section] = []
        elif current_section and line:
            parsed[current_section].append(line)
    
    # Convert lists to single strings
    for key in parsed:
        if isinstance(parsed[key], list):
            parsed[key] = "\n".join(parsed[key])
    
    return parsed

def json_response(result: Dict) -> str:
    """Return a formatted JSON string."""
    return json.dumps(result, indent=2)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python image.py <image_path or URL> <text prompt>")
        exit(1)
    
    image_path = sys.argv[1]
    query = sys.argv[2]
    
    result = analyze_medical_image(image_path, query)
    print(json_response(result))
