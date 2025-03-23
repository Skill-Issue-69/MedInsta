import os
import sys
import json
import requests
import datetime
import torch
from typing import Dict, Optional
from PIL import Image
from io import BytesIO

# Configuration
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "tgp_v1_vmEPQZI2siJ07sHrXbYuAWJEanvrL8l6X1vOIjSyFkE")
MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"
MEDICAL_VISION_MODEL = "openai/clip-vit-large-patch14"  # Medical-optimized CLIP model

# Suppress warnings
os.environ["TOKENIZERS_PARALLELISM"] = "false"
from transformers import logging
logging.set_verbosity_error()

def enhanced_medical_analysis(image: Image.Image) -> str:
    """Proper medical zero-shot image classification"""
    try:
        from transformers import AutoProcessor, AutoModelForZeroShotImageClassification
        
        processor = AutoProcessor.from_pretrained(MEDICAL_VISION_MODEL)
        model = AutoModelForZeroShotImageClassification.from_pretrained(MEDICAL_VISION_MODEL)
        
        candidate_labels = [
            "Cardiomegaly", "Pneumonia", "Edema", "Consolidation",
            "Atelectasis", "Pneumothorax", "Fracture", "Skin lesion",
            "Medical device", "Normal findings"
        ]
        
        inputs = processor(
            images=image,
            text=candidate_labels,
            return_tensors="pt",
            padding=True
        )
        
        with torch.no_grad():
            outputs = model(**inputs)
        
        probs = outputs.logits_per_image.softmax(dim=1)[0]
        results = sorted(zip(candidate_labels, probs), key=lambda x: x[1], reverse=True)
        
        analysis = "Medical Findings Probability:\n"
        for label, prob in results[:3]:  # Top 3 results
            analysis += f"- {label}: {prob:.1%}\n"
        
        if "Normal findings" in analysis:
            analysis += "\nNo significant abnormalities detected"
        else:
            analysis += "\nRecommend clinical correlation and further testing"
        
        return analysis

    except Exception as e:
        return f"Medical image analysis error: {str(e)}"

# Medical Templates
MEDICAL_TEMPLATE = {
    "image": """<s>[INST] As a senior medical specialist:
{query}

Radiological Analysis:
{image_analysis}

Respond in THIS EXACT FORMAT:
""",
    "text": """<s>[INST] As a senior medical specialist:
{query}

Respond in THIS EXACT FORMAT:
"""
}

COMMON_TEMPLATE = """
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

def analyze_medical(
    query: str,
    image_path: Optional[str] = None,
    temperature: float = 0.5,
    max_tokens: int = 1024
) -> Dict:
    """Comprehensive medical analysis system"""
    try:
        image_analysis = ""
        if image_path:
            # Load image from path or URL
            if image_path.startswith(("http://", "https://")):
                response = requests.get(image_path, timeout=10)
                image = Image.open(BytesIO(response.content))
            else:
                image = Image.open(image_path)
            
            image_analysis = enhanced_medical_analysis(image)

        template_type = "image" if image_path else "text"
        base_template = MEDICAL_TEMPLATE[template_type].format(
            query=query,
            image_analysis=image_analysis
        )
        formatted_prompt = base_template + COMMON_TEMPLATE

        headers = {"Authorization": f"Bearer {TOGETHER_API_KEY}", "Content-Type": "application/json"}
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers=headers,
            json={
                "model": MODEL_NAME,
                "messages": [{"role": "user", "content": formatted_prompt}],
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stop": ["<|eot_id|>"]
            },
            timeout=30
        )
        response.raise_for_status()

        return parse_medical_response(response.json()["choices"][0]["message"]["content"].strip())

    except Exception as e:
        return error_response(str(e))

def parse_medical_response(raw_text: str) -> Dict:
    """Structured response parser"""
    sections = ["[SYMPTOMS]", "[CAUSES]", "[STEPS]", "[DOCTOR]", "[WARNINGS]"]
    parsed = {"status": "success", "timestamp": datetime.datetime.now().isoformat()}
    current_section = None
    
    for line in raw_text.split('\n'):
        line = line.strip()
        if line in sections:
            current_section = line[1:-1].lower()
            parsed[current_section] = []
        elif current_section and line:
            parsed[current_section].append(line)
    
    for key in parsed:
        if isinstance(parsed[key], list):
            parsed[key] = "\n".join(parsed[key])
    
    return parsed

def error_response(error: str) -> Dict:
    """Error handler"""
    return {
        "status": "error",
        "error": error,
        "timestamp": datetime.datetime.now().isoformat()
    }

if __name__ == "__main__":
    if len(sys.argv) == 2:
        result = analyze_medical(sys.argv[1])
    elif len(sys.argv) == 3:
        result = analyze_medical(sys.argv[2], sys.argv[1])
    else:
        print("Usage:")
        print("Text query: python medic.py 'your medical question'")
        print("Image query: python medic.py image_path_or_url 'your question'")
        sys.exit(1)
    
    print(json.dumps(result, indent=2))