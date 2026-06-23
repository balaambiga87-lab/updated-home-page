import os
from PIL import Image, ImageDraw

brain_dir = r"C:\Users\chock\.gemini\antigravity-ide\brain\c3b0af1b-27ff-4447-be74-7382e79ad7fd"
input_path = os.path.join(brain_dir, "media__1782181915940.png")
output_path = r"c:\Users\chock\Downloads\aws home page\aws-sbg-rec\public\new-hero-bg.png"

# Load image
img = Image.open(input_path)
width, height = img.size
print(f"Loaded image {input_path} with size {width}x{height}")

# Create a copy and edit
edited_img = img.copy()
draw = ImageDraw.Draw(edited_img)

# White out top navigation bar (y = 0 to 85)
draw.rectangle([0, 0, width, 85], fill=(255, 255, 255, 255))

# White out left side text/buttons area (x = 0 to 480)
draw.rectangle([0, 85, 480, height], fill=(255, 255, 255, 255))

# White out bottom-right corner orange dot and circuit line (x = 950 to 1024, y = 500 to 578)
draw.rectangle([950, 500, width, height], fill=(255, 255, 255, 255))

# Save edited image
edited_img.save(output_path, "PNG")
print(f"Saved further processed background to {output_path}")
