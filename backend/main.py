from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import uvicorn
import io
import base64
import hashlib
from PIL import Image, ImageChops, ImageEnhance
from PIL.ExifTags import TAGS

app = FastAPI()

# Enable CORS for React communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your custom YOLO11 model (Ensure best.pt is in the same folder)
model = YOLO("best.pt")

def get_metadata(img):
    """Extracts digital fingerprint (EXIF) from the image"""
    meta = {}
    info = img._getexif()
    if info:
        for tag, value in info.items():
            decoded = TAGS.get(tag, tag)
            meta[decoded] = str(value)
    return meta

def get_ela_map(img_bytes):
    """Performs Error Level Analysis to detect 'Photoshopped' areas"""
    original = Image.open(io.BytesIO(img_bytes)).convert('RGB')
    
    # Save as JPEG at 90% quality to find compression differences
    temp_io = io.BytesIO()
    original.save(temp_io, 'JPEG', quality=90)
    temp_io.seek(0)
    resaved = Image.open(temp_io)
    
    # Calculate the pixel-level difference
    ela_image = ImageChops.difference(original, resaved)
    extrema = ela_image.getextrema()
    max_diff = max([ex[1] for ex in extrema])
    if max_diff == 0: max_diff = 1
    
    # Enhance for visual display in UI
    scale = 255.0 / max_diff
    ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
    
    buffered = io.BytesIO()
    ela_image.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode(), max_diff

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    img_bytes = await file.read()
    img = Image.open(io.BytesIO(img_bytes))
    
    # 1. Evidence Hashing (Chain of Custody)
    file_hash = hashlib.sha256(img_bytes).hexdigest()
    
    # 2. Metadata Extraction
    metadata = get_metadata(img)
    
    # 3. YOLO11 Object Detection
    results = model(img)
    detections = []
    for r in results:
        for box in r.boxes:
            detections.append({
                "label": model.names[int(box.cls[0])],
                "conf": round(float(box.conf[0]) * 100, 1),
                "bbox": box.xyxyn[0].tolist() # Normalized coordinates for React
            })
    
    # 4. Forensic ELA Scan
    heatmap_b64, score = get_ela_map(img_bytes)
    
    return {
        "detections": detections,
        "hash": file_hash,
        "metadata": metadata,
        "integrity": {
            "status": "Authentic" if score < 40 else "Manipulated",
            "score": score,
            "heatmap": f"data:image/png;base64,{heatmap_b64}"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)