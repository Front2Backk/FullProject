import tkinter as tk
from tkinter import Label, StringVar
from PIL import Image, ImageTk
from Config.config import LABELS_WIDTH_PERCENT, CAMERA_WIDTH_PERCENT

class UIManager:
    def __init__(self, root, app_title="AR EyeConic", logo_path="logo.png"):
        self.root = root
        self.app_title = app_title
        self.logo_path = logo_path

        self.root.title(self.app_title)
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')

        self.labels_visible = False
        self.logo_photo = None

        self._setup_styles()
        self._setup_header()
        self._setup_main_content_area()
        self._setup_left_panel_elements()
        self._setup_right_panel_elements()
        
        self.hide_labels() 
        print("UIManager initialized.")

    def _setup_styles(self):
        self.custom_font = ("Segoe UI", 12)
        self.title_font = ("Segoe UI Semibold", 14)
        screen_width = self.root.winfo_screenwidth()
        self.wrap_length = max(1, int(screen_width * LABELS_WIDTH_PERCENT) - 20)


    def _load_logo(self):
        try:
            logo_image = Image.open(self.logo_path)
            logo_image = logo_image.resize((80, 80), Image.Resampling.LANCZOS) # Adjusted size
            self.logo_photo = ImageTk.PhotoImage(logo_image)
        except FileNotFoundError:
            print(f"Error: Logo image not found at {self.logo_path}")
            self.logo_photo = None
        except Exception as e:
            print(f"Error loading logo: {e}")
            self.logo_photo = None

    def _setup_header(self):
        self.header_frame = tk.Frame(self.root, bg='black')
        self.header_frame.pack(side=tk.TOP, fill=tk.X, pady=5)

        # Right container for two text outputs
        self.right_container_frame = tk.Frame(self.header_frame, bg='black')
        self.right_container_frame.pack(side=tk.RIGHT, padx=20)

        self.right_top_var = StringVar(value="Battery: --%")
        self.right_middle_var = StringVar(value="Wi-Fi: --")
        self.right_bottom_var = StringVar(value="User:--")

        self.right_top_label = tk.Label(
            self.right_container_frame, textvariable=self.right_top_var,
            font=("Segoe UI", 12), bg='black', fg='lightgray', anchor='e', width=50
        )
        self.right_top_label.pack(anchor='e')

        self.right_middle_label = tk.Label(
            self.right_container_frame, textvariable=self.right_middle_var,
            font=("Segoe UI", 12), bg='black', fg='lightgray', anchor='e', width=20
        )
        self.right_middle_label.pack(anchor='e')

        self.right_bottom_label = tk.Label(
            self.right_container_frame, textvariable=self.right_bottom_var,
            font=("Segoe UI", 12), bg='black', fg='lightgray', anchor='e', width=20
        )
        self.right_bottom_label.pack(anchor='e')


        # Load logo
        self._load_logo()
        if self.logo_photo:
            self.logo_label_widget = tk.Label(self.header_frame, image=self.logo_photo, bg='black')
            self.logo_label_widget.image = self.logo_photo
            self.logo_label_widget.pack(side=tk.LEFT, padx=10, pady=5)

        self.title_label_widget = tk.Label(
            self.header_frame, text=self.app_title,
            font=("Arial", 20, "bold"), bg='black', fg='white'
        )
        self.title_label_widget.pack(side=tk.LEFT, padx=10)


    def _setup_main_content_area(self):
        self.content_frame = tk.Frame(self.root, bg='black')
        self.content_frame.pack(fill=tk.BOTH, expand=True)

    def _setup_left_panel_elements(self):
        # Left panel for text outputs
        self.left_panel = tk.Frame(self.content_frame, bg='#121212')
        # Width is set when shown

        self.interaction_text_var = StringVar()
        self.response_text_var = StringVar()
        self.translation_text_var = StringVar()
        self.image_text_var = StringVar()

        # Interaction Frame (e.g., "Listening...", "You said: ...")
        interaction_frame_bg = '#1E1E1E'
        interaction_fg_color = '#4FC3F7' # Light blue
        self.interaction_frame = self._create_text_frame(self.left_panel, self.interaction_text_var, self.title_font, interaction_frame_bg, interaction_fg_color)
        
        # Response Frame (e.g., Assistant's spoken response)
        response_frame_bg = '#1E1E1E'
        response_fg_color = '#FFFFFF' # White
        self.response_frame = self._create_text_frame(self.left_panel, self.response_text_var, self.custom_font, response_frame_bg, response_fg_color)

        # Translation Frame
        translation_frame_bg = '#252525'
        translation_fg_color = '#81C784' # Green
        self.translation_frame = self._create_text_frame(self.left_panel, self.translation_text_var, self.custom_font, translation_frame_bg, translation_fg_color)

        # Image Text Frame (OCR output)
        image_text_frame_bg = '#252525'
        image_text_fg_color = '#FFB74D' # Orange
        self.image_text_frame = self._create_text_frame(self.left_panel, self.image_text_var, self.custom_font, image_text_frame_bg, image_text_fg_color)
        
        # Separator
        tk.Frame(self.left_panel, bg='#333333', height=1).pack(fill=tk.X, pady=(5,0))


    def _create_text_frame(self, parent, text_variable, font, bg_color, fg_color):
        frame = tk.Frame(parent, bg=bg_color)
        frame.pack(fill=tk.X, padx=10, pady=5, expand=True)
        label = tk.Label(frame, textvariable=text_variable, font=font, bg=bg_color, fg=fg_color,
                         justify=tk.LEFT, wraplength=self.wrap_length, anchor='nw') # anchor to north-west
        label.pack(fill=tk.X, padx=5, pady=5, expand=True)
        return frame

    def _setup_right_panel_elements(self):
        # Right panel for video
        self.right_panel = tk.Frame(self.content_frame, bg='black')
        self.right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        self.video_label = Label(self.right_panel, bg='black') # Video feed
        self.video_label.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)

        # Loading screen elements (initially hidden)
        self.loading_screen_label = None # Will be created when show_loading_screen is called

    def update_video_frame(self, frame_image_tk):
        if frame_image_tk:
            self.video_label.config(image=frame_image_tk)
            self.video_label.image = frame_image_tk # Keep a reference
        else:
            # Optionally, display a "camera off" or "no signal" image
            self.video_label.config(image=None) # Clear image
            self.video_label.image = None


    def show_labels(self):
        if not self.labels_visible:
            screen_width = self.root.winfo_screenwidth()
            left_panel_width = int(screen_width * LABELS_WIDTH_PERCENT)
            
            self.left_panel.config(width=left_panel_width)
            self.left_panel.pack(side=tk.LEFT, fill=tk.BOTH, expand=False, padx=(5,0), pady=5)
            self.left_panel.pack_propagate(False) # Prevent children from resizing it

            # Ensure right panel re-adjusts
            self.right_panel.pack_forget()
            self.right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=(0,5), pady=5)
            
            self.labels_visible = True
            self.root.update_idletasks()

    def hide_labels(self):
        if self.labels_visible:
            self.left_panel.pack_forget()
            
            # Ensure right panel takes full width again
            self.right_panel.pack_forget()
            self.right_panel.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=5, pady=5)
            
            self.labels_visible = False
            self.root.update_idletasks()

    def toggle_labels(self):
        if self.labels_visible:
            self.hide_labels()
        else:
            self.show_labels()

    def display_output(self, text):
        self.response_text_var.set(text)

    def display_output2(self, text):
        self.interaction_text_var.set(text)

    def display_output3(self, text, is_prefix=True):
        prefix = "Translated: " if is_prefix and text else ""
        self.translation_text_var.set(f"{prefix}{text}")

    def display_output4(self, text, is_prefix=True):
        prefix = "Image Text: " if is_prefix and text else ""
        self.image_text_var.set(f"{prefix}{text}")

    def display_output5(self, text, is_prefix=True):
        prefix = "AI Response: " if is_prefix and text else ""
        self.translation_text_var.set(f"{prefix}{text}")

    def display_output6(self, text, is_prefix=True):
        prefix = "Prompt: " if is_prefix and text else ""
        self.image_text_var.set(f"{prefix}{text}")

    def clear_all_text_outputs(self):
        self.display_output("")
        self.display_output2("")
        self.display_output3("", is_prefix=False)
        self.display_output4("", is_prefix=False)
        self.display_output5("", is_prefix=False)

    def update_battery_status(self, value):
        self.right_top_var.set(f"Battery: {value}")

    def update_wifi_status(self, value):
        self.right_middle_var.set(f"Wi-Fi: {value}")

    def update_user_name(self, value):
        self.right_bottom_var.set(f"User: {value}")


    def show_loading_screen(self, message="Loading..."):
        # Hide video label if it's visible
        if self.video_label.winfo_ismapped():
            self.video_label.pack_forget()

        if self.loading_screen_label is None:
            self.loading_screen_label = tk.Label(self.right_panel, text=message,
                                                 font=("Arial", 24, "bold"), bg="black", fg="white")
        else:
            self.loading_screen_label.config(text=message)
        
        self.loading_screen_label.pack(fill=tk.BOTH, expand=True)
        self.loading_screen_label.place(relx=0.5, rely=0.5, anchor=tk.CENTER) # Ensure it's centered
        self.root.update()


    def hide_loading_screen(self):
        if self.loading_screen_label and self.loading_screen_label.winfo_ismapped():
            self.loading_screen_label.pack_forget()
            self.loading_screen_label.place_forget()

        if not self.video_label.winfo_ismapped():
             self.video_label.pack(fill=tk.BOTH, expand=True, padx=5, pady=5)
        self.root.update()


if __name__ == '__main__':
    root_test = tk.Tk()
    ui = UIManager(root_test, logo_path="../logo.png")

    # Test updating text fields
    ui.display_output("Listening for your command...")
    ui.display_output2("Hello! I am your AI assistant.")
    ui.display_output3("Bonjour!")
    ui.display_output4("Some text recognized from an image.")

    # Test showing labels
    ui.show_labels()
    root_test.update()
    print("Labels should be visible.")
    root_test.after(2000, ui.hide_labels) 
    
    # Test loading screen
    root_test.after(3000, lambda: ui.show_loading_screen("Processing your request..."))
    root_test.after(5000, ui.hide_loading_screen)
    
    # Simulate video update (requires a dummy image)
    try:
        dummy_img_pil = Image.new('RGB', (640, 480), color='blue')
        dummy_img_tk = ImageTk.PhotoImage(dummy_img_pil)
        root_test.after(1000, lambda: ui.update_video_frame(dummy_img_tk))
    except Exception as e:
        print(f"Could not create dummy image for video test: {e}")

    root_test.mainloop()