import os
import json
import requests
import base64
import datetime
from typing import Union, Dict
from huggingface_hub import InferenceClient
from PIL import Image
import io

# Configuration
HF_TOKEN = os.getenv("HF_TOKEN", "your_hf_token_here")
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "your_together_key_here")

def analyze_medical_text(
    prompt: str,
    temperature: float = 0.7,
    max_tokens: int = 1024
) -> Dict:
    """Process medical text queries using Llama-3-70B via Together AI"""
    try:
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            "messages": [{"role": "user", "content": prompt}],
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

        return {
            "status": "success",
            "response": response.json()["choices"][0]["message"]["content"].strip(),
            "model": "Llama-3-70B",
            "timestamp": datetime.datetime.now().isoformat()
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }
def json_response(result: Dict) -> str:
    return json.dumps(result, indent=2)