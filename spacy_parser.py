import spacy
import sys
import json
import fitz  # PyMuPDF library

def parse_resume(file_path):
    # Load spaCy model
    nlp = spacy.load("en_core_web_sm")
    
    # Open PDF with fitz (PyMuPDF)
    pdf_document = fitz.open(file_path)
    text = ""
    
    # Extract text from each page of the PDF
    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        text += page.get_text()

    # Process the extracted text using spaCy
    doc = nlp(text)

    # Extract sections based on named entities
    skills = [ent.text for ent in doc.ents if ent.label_ == "SKILL"]
    education = [ent.text for ent in doc.ents if ent.label_ == "EDUCATION"]
    experience = [ent.text for ent in doc.ents if ent.label_ == "EXPERIENCE"]

    return {
        "skills": skills,
        "education": education,
        "experience": experience,
    }

if __name__ == "__main__":
    file_path = sys.argv[1]
    parsed_data = parse_resume(file_path)
    print(json.dumps(parsed_data))
