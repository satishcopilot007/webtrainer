import io
import logging
from PIL import Image, ImageDraw, ImageFont

logger = logging.getLogger(__name__)


def generate_og_image(title, subtitle='', output_path=None):
    """Generate an Open Graph image for social media sharing.

    Args:
        title: Main title text for the image.
        subtitle: Optional subtitle text.
        output_path: File path to save the image. Returns bytes if None.

    Returns:
        Image bytes if output_path is None, otherwise saves to disk.
    """
    width, height = 1200, 630
    bg_color = (70, 30, 150)  # TrainerMentors purple
    text_color = (255, 255, 255)

    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)

    try:
        title_font = ImageFont.truetype('arial.ttf', 48)
        subtitle_font = ImageFont.truetype('arial.ttf', 28)
    except OSError:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Draw title centered
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_w = title_bbox[2] - title_bbox[0]
    draw.text(
        ((width - title_w) / 2, height / 2 - 60),
        title, fill=text_color, font=title_font,
    )

    # Draw subtitle if provided
    if subtitle:
        sub_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
        sub_w = sub_bbox[2] - sub_bbox[0]
        draw.text(
            ((width - sub_w) / 2, height / 2 + 20),
            subtitle, fill=text_color, font=subtitle_font,
        )

    # Draw branding
    brand = 'TrainerMentors'
    brand_bbox = draw.textbbox((0, 0), brand, font=subtitle_font)
    brand_w = brand_bbox[2] - brand_bbox[0]
    draw.text(
        ((width - brand_w) / 2, height - 80),
        brand, fill=(200, 200, 200), font=subtitle_font,
    )

    if output_path:
        img.save(output_path, 'PNG')
        logger.info(f'OG image saved to {output_path}')
        return None

    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    return buffer.getvalue()
