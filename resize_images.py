from PIL import Image
import os

def resize_image(input_path, output_path, width_multiplier, height_multiplier):
    # Open the image
    with Image.open(input_path) as img:
        # Get original size
        original_width, original_height = img.size
        
        # Calculate new size
        new_width = int(original_width * width_multiplier)
        new_height = int(original_height * height_multiplier)
        
        # Resize the image
        resized_img = img.resize((new_width, new_height), Image.LANCZOS)
        
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Save the resized image
        resized_img.save(output_path)
        
        print(f"Resized {input_path}")
        print(f"Original size: {original_width}x{original_height}")
        print(f"New size: {new_width}x{new_height}")

# Resize Santa image (2x size)
resize_image(
    '/users/alelin3/dev/fun/julspelet/images/santa.png', 
    '/users/alelin3/dev/fun/julspelet/images/resized/santa.png', 
    2, 2
)

# Resize Gift image (1.5x size)
resize_image(
    '/users/alelin3/dev/fun/julspelet/images/gift.png', 
    '/users/alelin3/dev/fun/julspelet/images/resized/gift.png', 
    1.5, 1.5
)
