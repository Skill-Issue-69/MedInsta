import os
import json
import requests
import datetime
from typing import Dict

# Configuration
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY", "your_together_key_here")

MEDICAL_TEMPLATE = """<s>[INST] As a geriatric specialist:
{query}

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

def analyze_medical_text(
    query: str,
    temperature: float = 0.5,
    max_tokens: int = 1024
) -> Dict:
    """Process medical queries using structured template"""
    try:
        headers = {
            "Authorization": f"Bearer {TOGETHER_API_KEY}",
            "Content-Type": "application/json"
        }

        # Format prompt with medical template
        formatted_prompt = MEDICAL_TEMPLATE.format(query=query)
        
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

        # Extract and format response
        raw_response = response.json()["choices"][0]["message"]["content"].strip()
        return parse_medical_response(raw_response)

    except Exception as e:
        return {
            "status": "error",
            "error": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }

def parse_medical_response(raw_text: str) -> Dict:
    """Convert structured text response to organized dictionary"""
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
    
    # Convert lists to formatted strings
    for key in parsed:
        if isinstance(parsed[key], list):
            parsed[key] = '\n'.join(parsed[key])
    
    return parsed

def json_response(result: Dict) -> str:
    """Format JSON output for medical responses"""
    return json.dumps(result, indent=2)
