import time
import os
import platform
from Config.config import vosk_model_paths,vosk_languages ,DEFAULT_USERNAME,JSON_FILE_PATH
from services.audio_services import SpeechRecognizer, TextToSpeech, AudioRecorder
from services.language_services import TranslationService
from services.vision_services import OCRService, CameraManager
from services.api_service import APIService, wifi_credentials
import json

class InteractionManager:
    def __init__(self, ui_manager, speech_recognizer: SpeechRecognizer, tts_engine: TextToSpeech,
                 translation_service: TranslationService, ocr_service: OCRService,
                 api_service: APIService,wifi_credentials: wifi_credentials,AudioRecorder: AudioRecorder, camera_manager: CameraManager,
                 initial_username=DEFAULT_USERNAME):
        self.ui = ui_manager
        self.speech_recognizer = speech_recognizer
        self.tts = tts_engine
        self.translator = translation_service
        self.ocr = ocr_service
        self.api = api_service
        self.wifi= wifi_credentials
        self.audio_recorder = AudioRecorder
        self.camera = camera_manager

        self.username = initial_username
        self.current_vosk_lang_code = "en"
        
        self.app_running = True
        self.image_capture_path = "captured_image.jpg"
        self.current_interaction_mode = "idle"
        print("InteractionManager initialized.")

    def configration_loop(self,file_path=JSON_FILE_PATH,last_wifi={"wifi_name": None, "wifi_password": None},last_users={"username": None, "password": None}):
        while True:
            try:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        global data
                        data = json.load(f)

                    self.wifi.wifi_name = data.get("wifi_name")
                    self.wifi.wifi_password = data.get("wifi_password")
                    self.api.username = data.get("username")
                    self.api.password = data.get("password")


                    if self.wifi.wifi_name and self.wifi.wifi_password:
                        if (self.wifi.wifi_name != last_wifi["wifi_name"] or self.wifi.wifi_password != last_wifi["wifi_password"]):
                            print(f"Detected Wi-Fi change: Connecting to {self.wifi.wifi_name}")
                            self.wifi.connect_to_wifi()
                        last_wifi = {"wifi_name": self.wifi.wifi_name, "wifi_password": self.wifi.wifi_password}
                    if self.api.username and self.api.password:
                        if (self.api.username != last_users["username"] or self.api.password != last_users["password"]):
                            print(f"Detected User change: Logging in {self.api.username}")
                            self.api.get_jwt_tokens()
                        last_users = {"username": self.api.username, "password": self.api.password}
            except Exception as e:
                print("Error:", e)
            time.sleep(10)

        

    def _get_audio_input(self, prompt_message=None, update_interaction=True):
        
        if prompt_message and update_interaction:
            self.ui.display_output2(prompt_message)
        
        text = self.speech_recognizer.get_audio(
            display_output2=self.ui.display_output, 
        )
        return text.strip().lower() if text else ""

    def _speak_and_update_ui(self, text_to_speak, interaction_text_to_display=None):
        display_text = interaction_text_to_display if interaction_text_to_display is not None else text_to_speak
        self.ui.display_output2(display_text)
        self.tts.speak(text_to_speak)

    def _reset_vosk_model_to_english(self):
        """Resets the Vosk speech recognition model to English if it's not already."""
        if self.current_vosk_lang_code != "en":
            print("Resetting Vosk model to English...")
            if self.speech_recognizer.change_model("en"):
                self.current_vosk_lang_code = "en"
                print("Vosk model successfully reset to English.")
                return True
            else:
                print("Failed to reset Vosk model to English.")
                self._speak_and_update_ui("Error: Could not switch back to English speech model.")
                return False
        else:
            return True # Already English
    def _handle_shutdown(self):
        """Handles the application shutdown sequence."""
        self._speak_and_update_ui("Shutting down AR EyeConic. Goodbye!", "Shutting down...")
        self.app_running = False # Stop the main loop
        # Perform OS-specific shutdown
        system = platform.system()
        print("Shutdown command received. OS-level shutdown initiated.")
        try:
            if system == "Windows":
                os.system("shutdown /s /t 1")
            elif system == "Linux" or system == "Darwin":
                os.system("sudo shutdown now")
            else:
                print(f"Unsupported OS for automated shutdown: {system}")
                self._speak_and_update_ui(f"Automated shutdown not supported on {system}.")
        except Exception as e:
            print(f"Error during OS shutdown command: {e}")
            self._speak_and_update_ui("Error trying to shut down the system.")


    def _select_language(self, prompt_message, for_source=True):
        self._speak_and_update_ui(prompt_message)
        
        self._reset_vosk_model_to_english()

        while self.app_running:

            lang_name_input = self._get_audio_input(update_interaction=False)

            if not lang_name_input:
                self._speak_and_update_ui("I didn't catch that. Please try again.")
                continue

            # If we are here, lang_name_input is valid (not empty)
            normalized_input = lang_name_input.strip().title()

        
            selected_lang_code = None

            if normalized_input in vosk_model_paths:
                selected_lang_code = normalized_input
            elif normalized_input in vosk_languages:
                selected_lang_code = vosk_languages[normalized_input]
            else: 
                for lang_name, lang_code in vosk_languages.items():
                    if normalized_input in lang_name or lang_name in normalized_input : 
                        selected_lang_code = lang_code
                        self._speak_and_update_ui(f"Selected language: {lang_name}")
                        break
            
            if selected_lang_code:

                if for_source:
                    if self.current_vosk_lang_code != selected_lang_code:
                        self.ui.show_loading_screen(f"Loading {normalized_input} speech model...")
                        if self.speech_recognizer.change_model(selected_lang_code):
                            self.current_vosk_lang_code = selected_lang_code
                            return selected_lang_code
                        else:
                            self._speak_and_update_ui(f"Sorry, I couldn't load the speech model for {normalized_input}.")
                            self._reset_vosk_model_to_english() # Revert to English on failure
                            return None
                    else: # Already the correct model
                        return selected_lang_code
                else:
                    return selected_lang_code
            else:
                self._speak_and_update_ui(f"I couldn't recognize the language '{lang_name_input}'. Please try again.")

    def _handle_speech_translation(self):

        self.current_interaction_mode = "speech_translation"
        self._speak_and_update_ui("Entering speech translation mode.")
        
        source_lang = self._select_language("What language will you be speaking in?", for_source=True)
        if not source_lang:
            self._reset_vosk_model_to_english()
            return

        target_lang = self._select_language("What language do you want to translate to?", for_source=False)
        if not target_lang:
            self._reset_vosk_model_to_english()
            return

        if source_lang == target_lang:
            self._reset_vosk_model_to_english()
            return
        self.ui.display_output("")
        self.ui.show_loading_screen("Loading Translation Model...")
        pipe = self.translator._get_pipeline(source_language=source_lang, target_language=target_lang)
        self.ui.hide_loading_screen()

        while self.app_running and self.current_interaction_mode == "speech_translation":
            user_speech = self._get_audio_input(f"Speak in {source_lang} (or say 'get out' to exit):", update_interaction=True)

            if not user_speech:
                continue

            english_equivalent = ""
            if source_lang != "en":
                english_equivalent = self.translator.translate_to_english(user_speech)
                print(f"DBG: Spoken '{user_speech}' ({source_lang}) -> English equiv: '{english_equivalent}'")

            if "get out" in user_speech.lower() or (english_equivalent and "get out" in english_equivalent.lower().strip("!?.")):
                self._speak_and_update_ui("Exiting speech translation mode.")
                self.ui.clear_all_text_outputs()
                break 
            translated_text = self.translator.translate_text(user_speech, target_language=target_lang, source_language=source_lang,pipe=pipe)

            if translated_text:
                self.ui.display_output3(translated_text)
                self.tts.speak(translated_text)
            else:
                self._speak_and_update_ui("Sorry, I couldn't translate that.")
        
        self._reset_vosk_model_to_english()
        self.current_interaction_mode = "idle"


    def _handle_image_translation(self):
        """Manages the image translation mode."""
        self.current_interaction_mode = "image_translation"
        self._speak_and_update_ui("Entering image translation mode.")

        source_lang_ocr = self._select_language("What is the language of the text in the image?", for_source=False) 

        target_lang_translate = self._select_language("What language do you want to translate the image text to?", for_source=False)
        self.ui.show_loading_screen("Loading Translation Model...")
        pipe=self.translator._get_pipeline(source_language=source_lang_ocr, target_language=target_lang_translate)
        self.ui.hide_loading_screen()
        
        tesseract_lang_code = source_lang_ocr
        self.ui.display_output("")
        self.ui.display_output("")

        while self.app_running and self.current_interaction_mode == "image_translation":
            self._reset_vosk_model_to_english()
            
            command = self._get_audio_input("Say 'capture' to take a picture, or 'get out' to exit:")
            if not command:
                continue

            if "capture" in command:
                self.ui.display_output("Capturing image...")
                captured_image_file = self.camera.capture_image(self.image_capture_path)
                if captured_image_file:
                    self._speak_and_update_ui("Image captured.", f"Image captured: {os.path.basename(captured_image_file)}")
                    
                    recognized_text = self.ocr.recognize_text_from_image(captured_image_file, lang_code=tesseract_lang_code) 

                    if "Error:" in recognized_text or "No text detected" in recognized_text :
                        self.ui.display_output4(recognized_text)
                    else:
                        self.ui.display_output4(recognized_text) 
                        
                        if source_lang_ocr == target_lang_translate:
                            self.ui.display_output4(recognized_text)
                            self.ui.display_output("Source and target languages are the same.")
                        else:
                            self._speak_and_update_ui("Translating text...")
                            translated_ocr_text = self.translator.translate_text(recognized_text, target_language=target_lang_translate, source_language=source_lang_ocr,pipe=pipe)
                            if translated_ocr_text:
                                self.tts.speak(translated_ocr_text)
                                self.ui.display_output3(translated_ocr_text)
                            else:
                                self._speak_and_update_ui("Sorry, I couldn't translate the text from the image.")
                else:
                    self._speak_and_update_ui("Failed to capture image.")

            elif "get out" in command:
                self._speak_and_update_ui("Exiting image translation mode.")
                self.ui.clear_all_text_outputs()
                break
        
        self._reset_vosk_model_to_english()
        self.current_interaction_mode = "idle"

    def _get_tool_selection(self):
        """Asks user if they want to use speech or image for translation."""
        self._reset_vosk_model_to_english()
        while self.app_running:
            self._speak_and_update_ui("What is the data you will use for your translation: speech or image?",
                                      interaction_text_to_display="Select data type: speech or image?")
            choice = self._get_audio_input(update_interaction=False)
            if "speech" in choice:
                return "speech"
            elif "image" in choice:
                return "image"
            elif "get out" in choice:
                return None
            else:
                self._speak_and_update_ui("I didn't understand that. Please say 'speech' or 'image'.")
        return None


    def _handle_iconic_sub_assistant(self, initial_image_path=None):
        """Handles the nested 'Iconic' assistant that uses send_to_api."""
        self.current_interaction_mode = "iconic_sub_chat"
        self._speak_and_update_ui(
            "Hello, I am Iconic, your personal assistant. Tell me how I can help you.",
            interaction_text_to_display="Iconic: How can I help?"
        )

        current_image_for_api = initial_image_path
        api_response = "" 
        self._speak_and_update_ui(
                "You can say 'start' to begin recording, 'stop' to stop recording, "
                "'continue' to resume recording, or 'pause' to pause the recording. "
                "Say 'send' to process your audio, or 'get out' to exit the Iconic sub-assistant."
            )

        while self.app_running and self.current_interaction_mode == "iconic_sub_chat":
            self._reset_vosk_model_to_english()
            user_query = self._get_audio_input().lower()

            if "start" in user_query:
                self.audio_recorder.start()
                self._speak_and_update_ui("Recording started. Say 'stop' to stop recording.")
            elif "stop" in user_query:
                self.audio_recorder.stop()
                self._speak_and_update_ui("Recording stopped. You can now say 'send' to process the audio.")
            elif "continue" in user_query or "resume" in user_query:
                self.audio_recorder.resume()
                self._speak_and_update_ui("Resumed recording. Say 'stop' when you're done.")
            elif "pause" in user_query:
                self.audio_recorder.pause()
                self._speak_and_update_ui("Recording paused. Say 'continue' to resume or 'stop' to stop.")
            elif "get out" in user_query:
                self.audio_recorder.stop()
                self._speak_and_update_ui("Exiting Iconic sub-assistant.")
                self.current_interaction_mode = "online_iconic"
                break
            elif "send" in user_query:
                self.audio_recorder.stop()
                try:
                    whisper_response = self.api.send_audio_to_api(self.audio_recorder.filename)
                    api_response = self.api.send_chat_to_api(whisper_response, image_path=current_image_for_api)
                    self.ui.display_output5(api_response)
                    self.tts.speak(api_response)
                except Exception as e:
                    self._speak_and_update_ui(f"Iconic Error: {str(e)}")
        current_image_for_api = None



    def _handle_online_mode(self):
        self.current_interaction_mode = "online_iconic"
        self._speak_and_update_ui("iconic Online: You are connected. You can say 'capture', 'Iconic', or 'get out'.",
                                  interaction_text_to_display="iconic Online: 'capture', 'Iconic', or 'get out'.")
        
        last_captured_image = None

        while self.app_running and self.current_interaction_mode == "online_iconic":
            self._reset_vosk_model_to_english()
            command = self._get_audio_input(update_interaction=False)

            if not command:
                continue

            if "capture" in command:
                self.ui.display_output("Capturing image...")
                captured_file = self.camera.capture_image(self.image_capture_path)
                if captured_file:
                    self._speak_and_update_ui(f"Image {os.path.basename(captured_file)} captured.",
                                              interaction_text_to_display=f"Image captured: {os.path.basename(captured_file)}")
                    last_captured_image = captured_file 
                else:
                    self._speak_and_update_ui("Failed to capture image.")
                continue 

            elif "iconic" in command:
                self._handle_iconic_sub_assistant(initial_image_path=last_captured_image)
                last_captured_image = None

            elif "get out" in command:
                self._speak_and_update_ui("Exiting iconic Online mode.")
                break
        
        self.current_interaction_mode = "idle"


    def _handle_offline_mode(self):
        """Handles the offline mode when 'Hi iconic' is said and internet is NOT connected."""
        self.current_interaction_mode = "offline_iconic"
        self._speak_and_update_ui(f"Hello {self.username}, I am iconic, your offline assistant. How are you?",
                                  interaction_text_to_display=f"iconic Offline: Hello {self.username}!")
        
        tool_choice = self._get_tool_selection()

        if tool_choice == "speech":
            self._handle_speech_translation()
        elif tool_choice == "image":
            self._handle_image_translation()
        
        self.current_interaction_mode = "idle"


    def start_interaction_loop(self):
        while self.app_running and self.current_interaction_mode == "idle":
            self.ui.root.update() 
            self._reset_vosk_model_to_english() 


            self.ui.display_output2("Say 'iconic' to begin, or 'Shut down' to exit.")
            command = self._get_audio_input(update_interaction=False)

            if not command and self.app_running:
                time.sleep(0.1)
                continue
            
            if not self.app_running: break 

            if "shut down" in command:
                self._handle_shutdown()
                break

            elif "iconic" in command:
                self._speak_and_update_ui("Hello, I am iconic, your personal assistant.") 
                self.current_interaction_mode = "connection"
                if self.api.is_connected():
                    self._speak_and_update_ui("You are connected do you want to use our online assistant or offline assistant?",
                                              interaction_text_to_display="Connected: Online or Offline assistant? (get out for idle mode)")
                    while self.app_running and self.current_interaction_mode == "connection":
                        command = self._get_audio_input(update_interaction=False)
                        if "online" in command.lower():
                            self._speak_and_update_ui("You chose online assistant. Loading iconic Online...")
                            self._handle_online_mode()
                        elif "offline" in command.lower():
                            self._speak_and_update_ui("You chose offline assistant. Loading iconic Offline...")
                            self._handle_offline_mode()
                        elif "get out" in command.lower():
                            self._speak_and_update_ui("Exiting  for idle mode.")
                            self.current_interaction_mode = "idle"
                            break
                        else:
                            self._speak_and_update_ui("I didn't understand that. Please say 'online','offline'or 'get out'for idle mode.")
                            continue
                else:
                    self._handle_offline_mode()

        
        print("Interaction loop ended.")