from PIL import Image
import os

src = 'src/assets/tenexa-logo.png'
original_size = os.path.getsize(src)
img = Image.open(src)
print(f'Original: {img.size}, {original_size} bytes')

# Resize to 120x120 (2x for retina screens) 
img_resized = img.resize((120, 120), Image.LANCZOS)

# Save optimized PNG
img_resized.save(src, 'PNG', optimize=True, compress_level=9)
new_size = os.path.getsize(src)
print(f'Optimized PNG: {img_resized.size}, {new_size} bytes (saved {original_size - new_size} bytes, {round((1 - new_size/original_size)*100)}%)')

# Also create WebP version
webp_path = 'src/assets/tenexa-logo.webp'
img_resized.save(webp_path, 'WebP', quality=90, method=6)
webp_size = os.path.getsize(webp_path)
print(f'WebP version: {webp_size} bytes')
