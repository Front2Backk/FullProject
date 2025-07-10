import pyttsx3
from vosk import Model, KaldiRecognizer
import json
import sounddevice as sd
import numpy as np
import os
from Config.config import vosk_model_paths
import wave
import queue
import threading
import noisereduce as nr

class TextToSpeech:
    def __init__(self, driver_name='sapi5'):

        self.engine = pyttsx3.init(driverName=driver_name)

    def speak(self, text):
        self.engine.say(text)
        self.engine.runAndWait()

class SpeechRecognizer:
    def __init__(self, initial_language_code="en"):
        self.model_path = vosk_model_paths.get(initial_language_code)
        self.model = Model(self.model_path)
        self.recognizer = None 


    def get_audio(self, display_output2=None):
        recognizer = KaldiRecognizer(self.model, 16000)
        recognized_text = None
        stream = None

        def callback(indata, frames, time, status):
            nonlocal recognized_text
            if status:
                pass
            if recognizer.AcceptWaveform(indata[:, 0].tobytes()):
                result = json.loads(recognizer.Result())
                recognized_text = result.get("text", "")
                if display_output2:
                    display_output2(f"You said: {recognized_text}")

        try:
            if display_output2:
                display_output2("Listening... Speak now")
            
            with sd.InputStream(callback=callback, channels=1, samplerate=16000, dtype=np.int16) as stream:
                while recognized_text is None:
                    sd.sleep(100)
            
            return recognized_text
            
        finally:
            if stream is not None and not stream.closed:
                stream.close()
            del recognizer

    def change_model(self, language_code):
            new_model_path = vosk_model_paths.get(language_code)
            if new_model_path !=self.model_path:
                self.model = Model(new_model_path)
                self.model_path = new_model_path
                print(f"Model changed to {language_code}.")
                return True
            else:
                print(f"Model for {language_code} is already loaded.")
                return False

class AudioRecorder:
    def __init__(self, filename="recording.wav", sample_rate=16000):
        self.filename = filename
        self.sample_rate = sample_rate
        self.channels = 1
        self.recording = False
        self.paused = False
        self.audio_queue = queue.Queue()
        self.thread = None

    def _callback(self, indata, frames, time, status):
        if self.recording and not self.paused:
            self.audio_queue.put(indata.copy())

    def start(self):
        if self.recording:
            return

        self.recording = True
        self.paused = False
        self.audio_queue.queue.clear()

        self.thread = threading.Thread(target=self._write_to_file)
        self.thread.start()

        self.stream = sd.InputStream(samplerate=self.sample_rate,
                                     channels=self.channels,
                                     callback=self._callback)
        self.stream.start()

    def _write_to_file(self):
        with wave.open(self.filename, 'wb') as wf:
            wf.setnchannels(self.channels)
            wf.setsampwidth(2)  # 16-bit
            wf.setframerate(self.sample_rate)

            while self.recording or not self.audio_queue.empty():
                try:
                    data = self.audio_queue.get(timeout=0.5)
                    data = data.flatten()

                    # Apply noise reduction
                    reduced_noise = nr.reduce_noise(y=data, sr=self.sample_rate, prop_decrease=1.0)

                    wf.writeframes((reduced_noise * 32767).astype(np.int16).tobytes())
                except queue.Empty:
                    continue

        print(f"✅ Audio saved to: {self.filename}")

    def pause(self):
        if self.recording:
            self.paused = True

    def resume(self):
        if self.recording and self.paused:
            self.paused = False

    def stop(self):
        if not self.recording:
            return

        self.recording = False
        self.stream.stop()
        self.stream.close()
        self.thread.join()

