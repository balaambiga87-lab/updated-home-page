import os
import glob
from PIL import Image

brain_dir = r"C:\Users\chock\.gemini\antigravity-ide\brain\c3b0af1b-27ff-4447-be74-7382e79ad7fd"
files = glob.glob(os.path.join(brain_dir, "media__*"))
for f in sorted(files):
    try:
        with Image.open(f) as img:
            print(f"{os.path.basename(f)}: size={img.size}, format={img.format}, mtime={os.path.getmtime(f)}")
    except Exception as e:
        print(f"{os.path.basename(f)}: error {e}")
