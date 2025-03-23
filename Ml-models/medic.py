import sys
import json
from image import analyze_medical_image
from final import analyze_medical_text

def main():
    if len(sys.argv) == 2:
        # Text-only query
        query = sys.argv[1]
        result = analyze_medical_text(query)
    elif len(sys.argv) == 3:
        # Image + text query
        image_path, query = sys.argv[1], sys.argv[2]
        result = analyze_medical_image(image_path, query)
    else:
        print("Usage:")
        print("Text query: python medic.py 'your medical question'")
        print("Image query: python medic.py image_path_or_url 'your question'")
        sys.exit(1)
    
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()