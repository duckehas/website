import sys
import openai
from PyQt5.QtWidgets import QApplication, QLabel, QWidget, QVBoxLayout, QLineEdit
from PyQt5.QtGui import QPixmap
from PyQt5.QtCore import Qt
import pyttsx3

# 🔑 Your OpenAI API Key here
openai.api_key = "your-openai-api-key"

# Text-to-Speech Engine
engine = pyttsx3.init()

def ask_openai(prompt):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # or "gpt-3.5-turbo"
            messages=[{"role": "user", "content": prompt}]
        )
        message = response['choices'][0]['message']['content']
        return message
    except Exception as e:
        return f"Error: {str(e)}"

class Assistant(QWidget):
    def __init__(self):
        super().__init__()

        # Window settings
        self.setWindowFlags(Qt.FramelessWindowHint | Qt.WindowStaysOnTopHint | Qt.Tool)
        self.setAttribute(Qt.WA_TranslucentBackground)
        self.setStyleSheet("background: transparent;")

        # Layout
        layout = QVBoxLayout()
        self.setLayout(layout)

        # Character image
        self.label = QLabel(self)
        pixmap = QPixmap("character.png")
        self.label.setPixmap(pixmap)
        layout.addWidget(self.label)

        # Text input
        self.input = QLineEdit(self)
        self.input.setPlaceholderText("Ask me something...")
        self.input.returnPressed.connect(self.respond)
        layout.addWidget(self.input)

        self.resize(pixmap.width(), pixmap.height() + 30)

    def respond(self):
        prompt = self.input.text()
        if prompt:
            reply = ask_openai(prompt)
            print("Assistant:", reply)
            engine.say(reply)
            engine.runAndWait()
            self.input.clear()

if __name__ == "__main__":
    app = QApplication(sys.argv)
    assistant = Assistant()
    assistant.show()
    sys.exit(app.exec_())
