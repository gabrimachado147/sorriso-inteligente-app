# Icon Generation Script
# This script creates high-quality PWA icons for the Sorriso Inteligente app

import cairo
import math

def create_icon(size, filename):
    """Create a high-quality dental app icon"""
    # Create surface
    surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, size, size)
    ctx = cairo.Context(surface)
    
    # Background gradient
    gradient = cairo.LinearGradient(0, 0, 0, size)
    gradient.add_color_stop_rgb(0, 0.055, 0.647, 0.914)  # #0ea5e9 (sky-500)
    gradient.add_color_stop_rgb(1, 0.0196, 0.445, 0.671)  # #0369a1 (sky-700)
    
    # Rounded rectangle background
    radius = size * 0.125  # 12.5% border radius
    ctx.arc(radius, radius, radius, math.pi, 3 * math.pi / 2)
    ctx.arc(size - radius, radius, radius, 3 * math.pi / 2, 0)
    ctx.arc(size - radius, size - radius, radius, 0, math.pi / 2)
    ctx.arc(radius, size - radius, radius, math.pi / 2, math.pi)
    ctx.close_path()
    
    ctx.set_source(gradient)
    ctx.fill()
    
    # White circle background for tooth
    center = size / 2
    tooth_bg_radius = size * 0.32
    ctx.arc(center, center, tooth_bg_radius, 0, 2 * math.pi)
    ctx.set_source_rgba(1, 1, 1, 0.95)
    ctx.fill()
    
    # Draw tooth shape (simplified)
    ctx.set_source_rgba(0.055, 0.647, 0.914, 1)  # Blue color
    ctx.set_line_width(size * 0.02)
    
    # Tooth crown (main body)
    tooth_width = size * 0.24
    tooth_height = size * 0.28
    
    # Start from top left of crown
    x_start = center - tooth_width / 2
    y_start = center - tooth_height / 2
    
    # Crown outline
    ctx.move_to(x_start, y_start + tooth_height * 0.2)
    ctx.curve_to(x_start, y_start, x_start + tooth_width * 0.2, y_start, center, y_start)
    ctx.curve_to(center + tooth_width * 0.3, y_start, x_start + tooth_width, y_start, x_start + tooth_width, y_start + tooth_height * 0.2)
    
    # Right side
    ctx.line_to(x_start + tooth_width, y_start + tooth_height * 0.7)
    
    # Root area
    ctx.curve_to(x_start + tooth_width, y_start + tooth_height, center + tooth_width * 0.15, y_start + tooth_height, center, y_start + tooth_height)
    ctx.curve_to(center - tooth_width * 0.15, y_start + tooth_height, x_start, y_start + tooth_height, x_start, y_start + tooth_height * 0.7)
    
    # Left side back to start
    ctx.close_path()
    ctx.fill()
    
    # Add small shine/highlight
    ctx.set_source_rgba(1, 1, 1, 0.3)
    ctx.arc(center - tooth_width * 0.15, center - tooth_height * 0.15, size * 0.05, 0, 2 * math.pi)
    ctx.fill()
    
    # Save to file
    surface.write_to_png(filename)
    print(f"Created {filename} ({size}x{size})")

# Create icons in different sizes
sizes = [16, 32, 48, 72, 96, 128, 144, 152, 192, 384, 512]

for size in sizes:
    create_icon(size, f"/Users/gabrielmachado/Desktop/sorriso-inteligente-app-main/public/icons/icon-{size}x{size}.png")

print("All icons created successfully!")
