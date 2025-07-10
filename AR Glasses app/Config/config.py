import os
import json


vosk_languages = {
    "English": "en",
    "Arabic": "ar",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Russian": "ru",
    "Portuguese": "pt",
    "Chinese ": "cn",
    "Turkish": "tr",
    "Italian": "it",
    "Ukrainian": "uk",
    "Dutch": "nl",
    "Hindi": "hi",
    "Vietnamese": "vi",
    "Korean": "ko",
    "Japanese": "ja",
    "Polish": "pl"
}

tesseract_languages = {
    "English": "eng",
    "Arabic": "ara",
    "Spanish": "spa",
    "French": "fra",
    "German": "deu",
    "Russian": "rus",
    "Portuguese": "por",
    "Chinese": "chi_sim",
    "Turkish": "tur",
    "Italian": "ita",
    "Ukrainian": "ukr",
    "Dutch": "nld",
    "Hindi": "hin",
    "Vietnamese": "vie",
    "Korean": "kor",
    "Japanese": "jpn",
    "Polish": "pol"
}

vosk_to_tesseract = {
    "en": "eng",
    "ar": "ara",
    "es": "spa",
    "fr": "fra",
    "de": "deu",
    "ru": "rus",
    "pt": "por",
    "cn": "chi_sim",
    "tr": "tur",
    "it": "ita",
    "uk": "ukr",
    "nl": "nld",
    "hi": "hin",
    "vi": "vie",
    "ko": "kor",
    "ja": "jpn",
    "pl": "pol"
}

vosk_model_paths = {
    "en": r"Models/vosk-model-en-us-daanzu-20200905-lgraph",
    "ar": r"Models/vosk-model-ar-mgb2-0.4",
    "es": r"Models/vosk-model-small-es-0.42",
    "fr": r"Models/vosk-model-small-fr-0.22",
    "de": r"Models/vosk-model-small-de-0.15",
    "ru": r"Models/vosk-model-small-ru-0.22",
    "pt": r"Models/vosk-model-small-pt-0.3",
    "cn": r"Models/vosk-model-small-cn-0.22",
    "tr": r"Models/vosk-model-small-tr-0.3",
    "it": r"Models/vosk-model-small-it-0.22",
    "uk": r"Models/vosk-model-small-uk-v3-nano",
    "nl": r"Models/vosk-model-small-nl-0.22",
    "hi": r"Models/vosk-model-small-hi-0.22",
    "vi": r"Models/vosk-model-small-vn-0.4",
    "ko": r"Models/vosk-model-small-ko-0.22",
    "ja": r"Models/vosk-model-small-ja-0.22",
    "pl": r"Models/vosk-model-small-pl-0.22"
}



TESSERACT_CMD = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# API Endpoints
API_BASE_URL = "http://127.0.0.1:8000/api/"
API_CHAT_ENDPOINT = f"{API_BASE_URL}chat/"
API_TRANSCRIBE_ENDPOINT = f"{API_BASE_URL}transcribe-audio/"
API_LOGIN_ENDPOINT = f"{API_BASE_URL}users/login/"
API_REFRESH_TOKEN_ENDPOINT = f"{API_BASE_URL}users/token/refresh/"

# Camera/UI settings
LABELS_WIDTH_PERCENT = 0.3
CAMERA_WIDTH_PERCENT = 1 - LABELS_WIDTH_PERCENT
GESTURE_COOLDOWN = 1
DEFAULT_USERNAME = "User"
JSON_FILE_PATH = r"C:\Users\COMPUMARTS\Desktop\vosk\gradproj\credintetials web\data.json"
with open(JSON_FILE_PATH, 'r') as f:
            data = json.load(f)
DEFAULT_USERNAME = data.get("username", DEFAULT_USERNAME)


AGENT_INSTRUCTION_TEMPLATE = """
# Persona
You are Iconic, a personal assistant inspired by Iron Man's AI butler. The user’s name is {DEFAULT_USERNAME}.

# Behavior
- Speak like a classy but sarcastic butler.
- Always address the user by their name, {DEFAULT_USERNAME}.
- Respond in the language the user speaks.
- Keep answers mostly to one sentence.
- When asked to do something, acknowledge with a witty phrase like:
  - "Will do, {DEFAULT_USERNAME}."
  - "Wait {DEFAULT_USERNAME}, your wish is my command."
  - "I shall check on that for you, {DEFAULT_USERNAME}."
- Then briefly say what you did in one sentence.

# Capabilities
- Use your tools (like web search) to get up-to-date info when needed.
- Be concise, helpful, and witty. and i want all your responses to be according to a websearch also when ever you got the results from websearch read it to me and i need you to talk with the user in the same language he is using .

"""

SESSION_INSTRUCTION_TEMPLATE = """
# Role
You are Iconic, the user’s sarcastic and classy personal assistant.

# Opening
Start the conversation with:  
"Hello {DEFAULT_USERNAME}, I am Iconic, your personal assistant. How may I assist you today?"

# Tools
Use available tools such as web search whenever relevant.

# Language
Always respond in the same language the user uses.

# Style
Keep answers short, sharp, and witty unless more detail is necessary.

#ending
when the user says "get out" say "Goodbye {DEFAULT_USERNAME}, have a nice day!"
"""
AGENT_INSTRUCTION = AGENT_INSTRUCTION_TEMPLATE.format(DEFAULT_USERNAME=DEFAULT_USERNAME)
SESSION_INSTRUCTION = SESSION_INSTRUCTION_TEMPLATE.format(DEFAULT_USERNAME=DEFAULT_USERNAME)



