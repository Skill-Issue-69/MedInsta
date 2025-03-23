import os
import sys
import json
import requests
import datetime
from typing import Dict, Optional
from PIL import Image
from io import BytesIO
import logging
import warnings
from transformers.utils import logging as hf_logging

# Suppress Hugging Face logging
hf_logging.set_verbosity_error()
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", message="Using a slow image processor")
warnings.filterwarnings("ignore", message="The attention mask is not set")


# Configuration
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "tgp_v1_vmEPQZI2siJ07sHrXbYuAWJEanvrL8l6X1vOIjSyFkE")
MODEL_NAME = "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free"

# Initialize image pipeline only when needed (cached after first use)
captioner = None

# Templates
MEDICAL_TEMPLATE = {
    "image": """<s>[INST] As a general specialist:
{query}

Image analysis: {image_analysis}

Respond in THIS EXACT FORMAT:
""",
    "text": """<s>[INST] As a general specialist:
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

def load_image(image_path: str) -> Image.Image:
    """Load image from path or URL"""
    if image_path.startswith(("http://", "https://")):
        response = requests.get(image_path, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    return Image.open(image_path)

def get_captioner():
    """Lazy-load image captioning model"""
    global captioner
    if captioner is None:
        from transformers import pipeline
        captioner = pipeline("image-to-text", model="nlpconnect/vit-gpt2-image-captioning")
    return captioner

def analyze_medical(
    query: str,
    image_path: Optional[str] = None,
    temperature: float = 0.5,
    max_tokens: int = 1024
) -> Dict:
    """Unified analysis function for both text and image inputs"""
    try:
        # Image processing (only if provided)
        image_analysis = ""
        if image_path:
            img = load_image(image_path)
            caption_model = get_captioner()  # Load model only when needed
            image_analysis = caption_model(img)[0]['generated_text']

        # Select and format template
        template_type = "image" if image_path else "text"
        base_template = MEDICAL_TEMPLATE[template_type].format(
            query=query,
            image_analysis=image_analysis
        )
        formatted_prompt = base_template + COMMON_TEMPLATE

        # API request
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

# Reused helper functions
def parse_medical_response(raw_text: str) -> Dict:
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
    return {
        "status": "error",
        "error": error,
        "timestamp": datetime.datetime.now().isoformat()
    }

if __name__ == "__main__":
    if len(sys.argv) == 2:
        # Text-only query
        result = analyze_medical(sys.argv[1])
    elif len(sys.argv) == 3:
        # Image query
        result = analyze_medical(sys.argv[2], sys.argv[1])
    else:
        print("Usage:")
        print("Text query: python medic.py 'your question'")
        print("Image query: python medic.py image_path_or_url 'your question'")
        sys.exit(1)
    
    print(json.dumps(result, indent=2))