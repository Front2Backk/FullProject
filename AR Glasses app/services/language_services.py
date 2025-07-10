from transformers import MarianMTModel, MarianTokenizer, pipeline as hf_pipeline
import os

class TranslationService:
    def __init__(self):
        self.pipelines = {}  
        self.en_translator = None 
        self.en_tokenizer = None

    def _get_pipeline(self, source_language="en", target_language="ar", display_output2=None):
        if (source_language, target_language) in self.pipelines:
            return self.pipelines[(source_language, target_language)]

        try:
            model_name = f'Helsinki-NLP/opus-mt-{source_language}-{target_language}'
            print(f"Loading translation model: {model_name}...")
            pipe = hf_pipeline("translation", model=model_name)
            self.pipelines[(source_language, target_language)] = pipe
            print(f"Translation model {model_name} loaded successfully.")
            return pipe
        except Exception as e:
            if isinstance(e, OSError) and "does not appear to have a file named" in str(e):
                 print(f"Error: Translation model '{model_name}' not found. It might be an invalid language pair or the model needs to be downloaded.")
                 #display_output2("Translation model not found. Please check the language pair or your network connection.")
                 
            else:
                print(f"Error loading translation model '{model_name}': {e}")
                #display_output2(f"Error loading translation model '{model_name}': {e}")
            return None

    def translate_text(self, text, target_language, source_language="en", display_output2=None,pipe=None):
        try:
            translated_text = pipe(text)[0]['translation_text'] 
            return translated_text
        except:
            #display_output2("You donnot have this model please check your network connection or i cannot recognize the text or the model is not available")
            
            return None

    def _init_english_translator(self):
        if self.en_translator is None:
            try:
                model_name = "Helsinki-NLP/opus-mt-mul-en"
                print(f"Loading English translation model: {model_name}...")
                self.en_tokenizer = MarianTokenizer.from_pretrained(model_name)
                self.en_translator = MarianMTModel.from_pretrained(model_name)
                print(f"English translation model {model_name} loaded successfully.")
            except Exception as e:
                print(f"Error loading English translation model '{model_name}': {e}")
                self.en_translator = None
                self.en_tokenizer = None


    def translate_to_english(self, text_to_translate):

        self._init_english_translator()
        if self.en_translator and self.en_tokenizer:
            try:
                inputs = self.en_tokenizer(text_to_translate, return_tensors="pt", padding=True, truncation=True, max_length=512)
                translated_tokens = self.en_translator.generate(**inputs)
                return self.en_tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
            except Exception as e:
                print(f"Error during 'translate_to_english': {e}")
                return None
        else:
            print("English translation model not available.")
            return None

