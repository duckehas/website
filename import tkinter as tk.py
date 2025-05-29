import tkinter as tk
import threading
from pynput import mouse, keyboard
from pynput.mouse import Controller as MouseController
from pynput.keyboard import Listener as KeyboardListener, Key
import time

mouse_controller = MouseController()

running = False
recoil_enabled = False

# Example AK-47 recoil pattern (offsets in pixels)
recoil_pattern = [
    (0, 2), (0, 2), (1, 2), (1, 2), (1, 2),
    (1, 2), (2, 1), (2, 1), (2, 1), (2, 1)
]

def apply_recoil():
    global recoil_enabled
    while running:
        if recoil_enabled:
            for x, y in recoil_pattern:
                if not recoil_enabled:
                    break
                mouse_controller.move(x, y * -1)
                time.sleep(0.05)
        time.sleep(0.1)

def toggle_recoil():
    global recoil_enabled
    recoil_enabled = not recoil_enabled
    toggle_btn.config(text=f"{'Disable' if recoil_enabled else 'Enable'} Zero Recoil")

def on_key_release(key):
    global running, recoil_enabled
    if key == Key.esc:
        print("Exiting...")
        running = False
        recoil_enabled = False
        root.quit()

# GUI setup
root = tk.Tk()
root.title("CS2 Zero Recoil")
root.geometry("250x100")

toggle_btn = tk.Button(root, text="Enable Zero Recoil", command=toggle_recoil)
toggle_btn.pack(pady=20)

# Thread for recoil logic
def start_recoil_thread():
    global running
    running = True
    t = threading.Thread(target=apply_recoil)
    t.daemon = True
    t.start()

    # Keyboard listener (to exit with ESC)
    listener = KeyboardListener(on_release=on_key_release)
    listener.start()

start_recoil_thread()
root.mainloop()
