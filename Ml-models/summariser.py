import together
import logging
import json
import textwrap
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

together.api_key = "tgp_v1_vmEPQZI2siJ07sHrXbYuAWJEanvrL8l6X1vOIjSyFkE"

SUMMARY_TEMPLATE = """<s>[INST] Summarize the following medical report into key points.
Focus on symptoms and causes. Use concise bullet points:
{text}

Provide only the summary without headings. [/INST]"""

def extract_relevant_data(query_data: dict, index: int) -> str:
    """Extract symptoms and causes from query data and format it with a header."""
    try:
        symptoms = query_data.get("symptoms", "").strip()
        causes = query_data.get("causes", "").strip()

        if not symptoms and not causes:
            logging.warning(f"Query {index + 1} missing relevant medical data.")
            return ""

        return f"**Query {index + 1}:**\nSymptoms: {symptoms}\nCauses: {causes}\n"
    except Exception as e:
        logging.error(f"Error extracting data: {str(e)}")
        return ""

def summarize_text(texts: list) -> list:
    """Summarize each extracted medical text using LLM."""
    summaries = []
    try:
        if not texts:
            raise ValueError("No valid data for summarization")

        for i, text in enumerate(texts):
            response = together.Complete.create(
                model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
                prompt=SUMMARY_TEMPLATE.format(text=text),
                max_tokens=600,
                temperature=0.3,
                top_p=0.9,
                repetition_penalty=1.2,
                stop=["</s>", "[INST]"]
            )
            
            summary = response['choices'][0]['text'].strip()
            summaries.append(f"**Query {i + 1} Summary:**\n{summary}\n")
        
    except Exception as e:
        logging.error(f"Summarization Error: {str(e)}", exc_info=True)

    return summaries

def save_summary_to_pdf(summaries: list, output_file: str = "summary.pdf"):
    """Save the consolidated summary to a PDF file with word wrapping."""
    try:
        c = canvas.Canvas(output_file, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica", 12)

        y_position = height - 40  # Start from the top
        line_height = 15
        max_width = width - 80  # 40 px margin on left and right

        for summary in summaries:
            wrapped_lines = []
            for line in summary.split("\n"):
                wrapped_lines.extend(textwrap.wrap(line, width=90))  # Adjust wrap width

            # Draw the wrapped text line by line
            for line in wrapped_lines:
                if y_position < 40:  # If near the bottom, create a new page
                    c.showPage()
                    c.setFont("Helvetica", 12)
                    y_position = height - 40

                c.drawString(40, y_position, line)
                y_position -= line_height  # Move to next line

            y_position -= 20  # Extra space between queries

        c.save()
        logging.info(f"Summary saved to {output_file}")
    except Exception as e:
        logging.error(f"Failed to save summary to PDF: {str(e)}")

if __name__ == '__main__':
    # Sample Queries (Replace with actual input)
    queries = [
        {
            "status": "success",
            "timestamp": "2025-03-23T18:08:08.456089",
            "symptoms": "The patient, John Doe, is experiencing a consistent headache that has lasted for 7 days, which may be accompanied by other symptoms such as nausea, vomiting, sensitivity to light, or blurred vision.",
            "causes": "1. Tension headaches or migraines caused by stress, lack of sleep, or certain medications.\n2. Underlying medical conditions such as hypertension, sinusitis, or meningitis.",
            "steps": "- Step 1: Conduct a thorough medical history and physical examination to identify potential causes of the headache.\n- Step 2: Order diagnostic tests such as blood work, imaging studies (e.g., CT or MRI scans), or lumbar puncture if necessary.\n- Step 3: Develop a treatment plan based on the underlying cause, which may include medication, lifestyle modifications, or referral to a specialist.",
            "doctor": "Geriatric specialist",
            "warnings": "- If the patient experiences sudden severe headache, confusion, or difficulty speaking, seek immediate medical attention as these may be signs of a life-threatening condition."
        },
        {
            "status": "success",
            "timestamp": "2025-03-23T19:15:22.123456",
            "symptoms": "A 40-year-old male patient reports experiencing chest pain and shortness of breath when walking up stairs.",
            "causes": "1. Possible cardiovascular disease, such as angina or early-stage heart attack.\n2. Respiratory conditions like asthma or chronic obstructive pulmonary disease (COPD).",
            "steps": "- Step 1: Perform an ECG and blood tests to check for cardiac markers.\n- Step 2: Conduct a stress test or echocardiogram if needed.\n- Step 3: Recommend lifestyle changes, medication, or further cardiac evaluation.",
            "doctor": "Cardiologist",
            "warnings": "- Immediate medical attention is required if the chest pain worsens or is accompanied by dizziness, nausea, or sweating."
        }
    ]

    # Extract relevant data from queries
    extracted_texts = [extract_relevant_data(q, i) for i, q in enumerate(queries) if extract_relevant_data(q, i)]

    if not extracted_texts:
        logging.info("No valid medical data found.")
        exit()

    # Summarize each query separately
    summary_results = summarize_text(extracted_texts)

    if summary_results:
        print("\nConsolidated Summary:")
        for summary in summary_results:
            print(summary)
        save_summary_to_pdf(summary_results)
