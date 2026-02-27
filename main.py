# import streamlit as st
# import pytesseract
# from PIL import Image
# from pdf2image import convert_from_bytes
# import re
# from googletrans import Translator
# from gtts import gTTS
# import tempfile
# import os

# # ==========================
# # ✅ Windows Tesseract Path
# # ==========================
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# # ==========================
# # Translator
# # ==========================
# translator = Translator()

# st.set_page_config(page_title="Prescription Voice Assistant", layout="centered")

# st.title("💊 Prescription Voice Assistant")
# st.write("Upload a prescription to extract medicine details and hear instructions in Hindi or Telugu.")

# # ==========================
# # File Upload
# # ==========================
# uploaded_file = st.file_uploader(
#     "Upload Prescription (Image or PDF)",
#     type=["png", "jpg", "jpeg", "pdf"]
# )

# language = st.selectbox("Select Language", ["Hindi", "Telugu"])

# # ==========================
# # OCR FUNCTIONS
# # ==========================
# def ocr_image(image):
#     return pytesseract.image_to_string(image)

# def ocr_pdf(file_bytes):
#     pages = convert_from_bytes(file_bytes, poppler_path=r"C:\poppler\Library\bin")
#     text = ""
#     for page in pages:
#         text += pytesseract.image_to_string(page)
#     return text

# # ==========================
# # Medical Extraction Patterns
# # ==========================
# DOSAGE_PATTERN = r"\b\d+\s?(mg|ml|mcg|g|units?)\b"
# DURATION_PATTERN = r"\b\d+\s?(days?|weeks?|months?)\b"
# SCHEDULE_PATTERN = r"(once daily|twice daily|thrice daily|daily|SOS|morning|evening|night|before food|after food)"
# INSTRUCTION_PATTERN = r"(take|apply|inject|use)\s.*"

# def extract_drugs(text):
#     lines = [l.strip() for l in text.split("\n") if l.strip()]
#     drugs = []
#     current = None

#     for line in lines:
#         words = line.split()

#         # Detect medicine line
#         if words and words[0][0].isupper():
#             current = {
#                 "medicine": words[0],
#                 "dosage": None,
#                 "schedule": None,
#                 "duration": None,
#                 "instruction": None
#             }

#         if current:
#             if re.search(DOSAGE_PATTERN, line, re.I):
#                 current["dosage"] = re.search(DOSAGE_PATTERN, line, re.I).group()
#             if re.search(SCHEDULE_PATTERN, line, re.I):
#                 current["schedule"] = re.search(SCHEDULE_PATTERN, line, re.I).group()
#             if re.search(DURATION_PATTERN, line, re.I):
#                 current["duration"] = re.search(DURATION_PATTERN, line, re.I).group()
#             if re.search(INSTRUCTION_PATTERN, line, re.I):
#                 current["instruction"] = re.search(INSTRUCTION_PATTERN, line, re.I).group()

#             if current["dosage"] and current not in drugs:
#                 drugs.append(current.copy())

#     return drugs

# # ==========================
# # Build long patient-friendly instruction
# # ==========================
# def build_long_instruction(item):
#     sentence = f"You have been prescribed {item['medicine']} {item['dosage']}. "

#     if item["schedule"]:
#         sentence += f"Please take this medicine {item['schedule']}. "

#     if item["duration"]:
#         sentence += f"Continue taking it for {item['duration']}. "

#     if item["instruction"]:
#         sentence += f"Additional instruction: {item['instruction']}. "

#     sentence += "Do not skip doses and consult your doctor if you feel unwell."

#     return sentence

# # ==========================
# # MAIN PROCESSING
# # ==========================
# if uploaded_file:
#     st.subheader("📄 Extracted Text")

#     if uploaded_file.type == "application/pdf":
#         text = ocr_pdf(uploaded_file.read())
#     else:
#         image = Image.open(uploaded_file)
#         st.image(image, caption="Uploaded Prescription", width=400)
#         text = ocr_image(image)

#     st.text_area("OCR Output", text, height=200)

#     # Extract drug details
#     drugs = extract_drugs(text)

#     st.subheader("🧾 Extracted Medical JSON")
#     st.json(drugs)

#     if drugs:
#         st.subheader("🔊 Voice Instructions")

#         lang_code = "hi" if language == "Hindi" else "te"

#         for i, drug in enumerate(drugs, 1):
#             instruction = build_long_instruction(drug)
#             translated = translator.translate(instruction, dest=lang_code).text

#             st.write(f"**Instruction {i}:** {translated}")

#             # Generate audio
#             with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
#                 tts = gTTS(translated, lang=lang_code)
#                 tts.save(tmp.name)
#                 audio_path = tmp.name

#             st.audio(audio_path)
#             os.remove(audio_path)
#     else:
#         st.warning("No medicines detected. Try a clearer prescription.")


import streamlit as st
import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes
import re
from googletrans import Translator
from gtts import gTTS
import tempfile

# ==========================
# WINDOWS PATHS
# ==========================
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
POPPLER_PATH = r"C:\poppler\Library\bin"

translator = Translator()

st.set_page_config(page_title="Prescription Voice Assistant", layout="centered")

st.title("💊 Prescription Voice Assistant")
st.write("Upload a prescription to extract medicine details and hear instructions in Hindi or Telugu.")

# ==========================
# FILE UPLOAD
# ==========================
uploaded_file = st.file_uploader(
    "Upload Prescription (Image or PDF)",
    type=["png", "jpg", "jpeg", "pdf"]
)

language = st.selectbox("Select Language", ["Hindi", "Telugu"])

# ==========================
# OCR FUNCTIONS
# ==========================
def ocr_image(image):
    return pytesseract.image_to_string(image)

def ocr_pdf(file_bytes):
    pages = convert_from_bytes(file_bytes, poppler_path=POPPLER_PATH)
    return "\n".join(pytesseract.image_to_string(p) for p in pages)

# ==========================
# SMART MEDICAL EXTRACTION
# ==========================

IGNORE_WORDS = ["rx", "advice", "follow-up", "date", "patient"]
PREFIXES = ["tab", "cap", "inj", "syr", "drop"]

def clean_line(line):
    return re.sub(r"[+*—\-]", "", line).strip()

def parse_schedule(line):
    line = line.lower()

    if "1-0-1" in line:
        return "morning and night"
    if "1-1-1" in line:
        return "morning, afternoon and night"
    if "od" in line:
        return "once daily"
    if "once weekly" in line:
        return "once weekly"

    match = re.search(r"(once daily|twice daily|thrice daily|daily)", line)
    if match:
        return match.group()

    return None

def extract_drugs(text):
    lines = [clean_line(l) for l in text.split("\n") if l.strip()]
    drugs = []
    current = None

    for line in lines:
        words = line.split()
        if not words:
            continue

        first = words[0].lower().strip(":")

        # Skip non-medical headers
        if first in IGNORE_WORDS:
            continue

        # Detect medicine line
        if first in PREFIXES and len(words) > 1:
            med_name = words[1]
            current = {
                "medicine": med_name,
                "dosage": None,
                "schedule": None,
                "duration": None,
                "instruction": None
            }

        elif words[0][0].isupper():
            med_name = words[0]
            current = {
                "medicine": med_name,
                "dosage": None,
                "schedule": None,
                "duration": None,
                "instruction": None
            }

        if not current:
            continue

        # Dosage
        dose = re.search(r"\b\d+\s?(mg|ml|g)\b", line, re.I)
        if dose:
            current["dosage"] = dose.group()

        # Schedule
        sched = parse_schedule(line)
        if sched:
            current["schedule"] = sched

        # Duration (supports next line)
        dur = re.search(r"\b\d+\s?(days?|weeks?|months?)\b", line, re.I)
        if dur:
            current["duration"] = dur.group()

        # Instructions
        if "after food" in line.lower():
            current["instruction"] = "after food"
        if "before food" in line.lower():
            current["instruction"] = "before food"

        # Save valid drug
        if current["dosage"] and current not in drugs:
            drugs.append(current.copy())

    return drugs

# ==========================
# PATIENT-FRIENDLY INSTRUCTION
# ==========================
def build_long_instruction(item):
    sentence = f"You have been prescribed {item['medicine']} {item['dosage']}. "

    if item["schedule"]:
        sentence += f"Please take this medicine {item['schedule']}. "

    if item["instruction"]:
        sentence += f"Take it {item['instruction']}. "

    if item["duration"]:
        sentence += f"Continue taking it for {item['duration']}. "

    sentence += "Do not skip doses and consult your doctor if you feel unwell."

    return sentence

# ==========================
# MAIN APP LOGIC
# ==========================
if uploaded_file:
    st.subheader("📄 Extracted Text")

    if uploaded_file.type == "application/pdf":
        text = ocr_pdf(uploaded_file.read())
    else:
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Prescription", width=400)
        text = ocr_image(image)

    st.text_area("OCR Output", text, height=200)

    # Extract drugs
    drugs = extract_drugs(text)

    st.subheader("🧾 Extracted Medical JSON")
    st.json(drugs)

    if drugs:
        st.subheader("🔊 Voice Instructions")

        lang_code = "hi" if language == "Hindi" else "te"

        for i, drug in enumerate(drugs, 1):
            instruction = build_long_instruction(drug)
            translated = translator.translate(instruction, dest=lang_code).text

            st.write(f"**Instruction {i}:** {translated}")

            # Safe audio creation (no deletion crash)
            tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
            gTTS(translated, lang=lang_code).save(tmp_file.name)
            st.audio(tmp_file.name)
    else:
        st.warning("No medicines detected. Try a clearer prescription.")