import os
from PIL import Image, ImageDraw, ImageFilter

brain_dir = r"C:\Users\chock\.gemini\antigravity-ide\brain\c3b0af1b-27ff-4447-be74-7382e79ad7fd"
input_path = os.path.join(brain_dir, "media__1782201172493.png")
output_path = r"c:\Users\chock\Downloads\aws home page\aws-sbg-rec\public\new-hero-bg-v3.png"

# Load image
img = Image.open(input_path)
width, height = img.size
print(f"Loaded image {input_path} with size {width}x{height}")

# Create a copy and edit
edited_img = img.copy()
draw = ImageDraw.Draw(edited_img)

# White out top navigation bar (y = 0 to 60) to hide the printed header
draw.rectangle([0, 0, width, 60], fill=(255, 255, 255, 255))

# Upscale by 2x using Lanczos resampling
new_width = width * 2
new_height = height * 2
try:
    resample_filter = Image.Resampling.LANCZOS
except AttributeError:
    resample_filter = Image.LANCZOS

upscaled_img = edited_img.resize((new_width, new_height), resample_filter)

# Apply subtle sharpening filter to ensure HD quality
sharpened_img = upscaled_img.filter(ImageFilter.SHARPEN)

# Save edited image
sharpened_img.save(output_path, "PNG")
print(f"Saved further processed background to {output_path}")
