import os
import requests
import socket
import mimetypes
from Config.config import API_CHAT_ENDPOINT, API_TRANSCRIBE_ENDPOINT, API_LOGIN_ENDPOINT, API_REFRESH_TOKEN_ENDPOINT
import subprocess

import platform



class wifi_credentials:
    def __init__(self, wifi_name, wifi_password):
        self.wifi_name = wifi_name
        self.wifi_password = wifi_password
        self.status= False



    def connect_to_wifi_windows(self,update_wifi_status):
        profile = f"""
        <WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
            <name>{self.wifi_name}</name>
            <SSIDConfig>
                <SSID>
                    <name>{self.wifi_name}</name>
                </SSID>
            </SSIDConfig>
            <connectionType>ESS</connectionType>
            <connectionMode>auto</connectionMode>
            <MSM>
                <security>
                    <authEncryption>
                        <authentication>WPA2PSK</authentication>
                        <encryption>AES</encryption>
                        <useOneX>false</useOneX>
                    </authEncryption>
                    <sharedKey>
                        <keyType>passPhrase</keyType>
                        <protected>false</protected>
                        <keyMaterial>{self.wifi_password}</keyMaterial>
                    </sharedKey>
                </security>
            </MSM>
        </WLANProfile>
        """

        profile_path = f"{self.wifi_name}.xml"
        with open(profile_path, 'w') as f:
            f.write(profile)

        try:
            subprocess.run(["netsh", "wlan", "add", "profile", f"filename={profile_path}"], check=True)
            subprocess.run(["netsh", "wlan", "connect", f"name={self.wifi_name}"], check=True)
            update_wifi_status(self.wifi_name)
            self.status = True
        except subprocess.CalledProcessError as e:
            self.status = False
            update_wifi_status("Failed to connect")

    def connect_to_wifi_linux(self, update_wifi_status):
        try:
            subprocess.run([
                "nmcli", "device", "wifi", "connect", self.wifi_name, "password", self.wifi_password
            ], check=True)
            self.status = True
            update_wifi_status(self.wifi_name)
        except subprocess.CalledProcessError as e:
            self.status = False
            update_wifi_status("Failed to connect")

    def connect_to_wifi(self, update_wifi_status):
        system = platform.system()
            
        if system == "Windows":
            self.connect_to_wifi_windows(update_wifi_status)

        elif system == "Linux":
            self.connect_to_wifi_linux(update_wifi_status)
        else:
            update_wifi_status("Unsupported OS")



class APIService:
    def __init__(self):
        self.username = None
        self.password = None
        self.access_token = None
        self.refresh_token = None
        self.status = False



    def get_jwt_tokens(self,update_user_name):
        url = API_LOGIN_ENDPOINT
        payload = {
            "username": self.username,
            "password": self.password
        }

        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()

            tokens = response.json()
            self.access_token = tokens.get("access")  
            self.refresh_token = tokens.get("refresh")
            update_user_name(self.username)

            self.status = True
            return self.access_token, self.refresh_token

        except requests.RequestException as e:
            update_user_name("Login Failed")
            self.status = False
            return None, None
        
    def refresh_access_token(self, update_user_name):
        if not self.refresh_token:                                      
            update_user_name("No refresh token available")
            return False

        response = requests.post(API_REFRESH_TOKEN_ENDPOINT, json={"refresh": self.refresh_token})
        if response.status_code == 200:
            self.access_token = response.json().get("access")  
            self.refresh_token = response.json().get("refresh")
            update_user_name(self.username)
            return True
        else:
            update_user_name("Error")
            return False

    def is_connected(self):
        try:
            socket.create_connection(("8.8.8.8", 53), timeout=3)
            return True
        except OSError:
            return False
        

    def send_audio_to_api(self, audio_path="recording.wav", update_user_name=None):
        def make_request():
            if not os.path.exists(audio_path):
                return {"error": "Audio file not found"}

            headers = {
                "Authorization": f"Bearer {self.access_token}"
            }

            try:
                with open(audio_path, 'rb') as audio_file:
                    files = {'audio': (os.path.basename(audio_path), audio_file, 'audio/wav')}
                    response = requests.post(API_TRANSCRIBE_ENDPOINT, files=files, headers=headers, timeout=20)
                return response
            except requests.RequestException as e:
                return None

        # First attempt
        response = make_request()
        if response is None:
            return {"error": "Could not connect to API"}

        if response.status_code == 401:
            if self.refresh_access_token(update_user_name):
                response = make_request()
            else:
                return {"error": "Session expired. Please log in again."}

        if response and response.status_code == 200:
            return response.json().get("transcription", "").strip()

        else:
            error_msg = response.text if response else "Unknown error"
            return {"error": error_msg}


    def send_chat_to_api(self, prompt, image_path=None, update_user_name=None):
        def make_request():
            data = {'prompt': prompt}      
            files = {}
            headers = {"Authorization": f"Bearer {self.access_token}"}

            if image_path and os.path.exists(image_path):
                mime_type, _ = mimetypes.guess_type(image_path)
                try:
                    image_file_opened = open(image_path, 'rb')
                    files['image'] = (
                        os.path.basename(image_path),
                        image_file_opened,
                        mime_type or 'application/octet-stream'
                    )
                except IOError as e:
                    print(f"❌ Error opening image file: {e}")

            try:
                response = requests.post(
                    API_CHAT_ENDPOINT,
                    data=data,
                    files=files if files else None,
                    headers=headers,
                    timeout=20
                )
                return response
            finally:
                if 'image' in files and files['image'][1]:
                    files['image'][1].close()

        # First attempt
        response = make_request()
        if response.status_code == 401:
            if self.refresh_access_token(update_user_name):
                response = make_request()
            else:
                return "Error: Session expired. Please log in again."

        if response.status_code == 200:
            return response.json().get("response", "").strip()
        else:
            return f"Error: {response.status_code} - {response.text}"