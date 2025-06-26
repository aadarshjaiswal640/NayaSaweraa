import json
import os
from typing import Dict, Any

def load_json_data(file_path: str) -> Dict[Any, Any]:
    """Load JSON data from file, create file with default structure if it doesn't exist"""
    if not os.path.exists(file_path):
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Create default structure based on file type
        default_data = get_default_data(file_path)
        save_json_data(file_path, default_data)
        return default_data
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        default_data = get_default_data(file_path)
        save_json_data(file_path, default_data)
        return default_data

def save_json_data(file_path: str, data: Dict[Any, Any]) -> None:
    """Save JSON data to file"""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_default_data(file_path: str) -> Dict[Any, Any]:
    """Get default data structure based on file path"""
    if 'content.json' in file_path:
        return {
            "mission": "Empowering communities through education, healthcare, and sustainable development initiatives.",
            "about_text": "Naya Sawera Foundation is dedicated to creating positive change in underserved communities through comprehensive programs in education, healthcare, and sustainable development.",
            "hero_image": "",
            "hero_video": "",
            "contact": {
                "email": "info@nayasawera.org",
                "phone": "+91-XXX-XXX-XXXX",
                "address": "New Delhi, India"
            }
        }
    elif 'events.json' in file_path:
        return {"events": []}
    elif 'reports.json' in file_path:
        return {"reports": []}
    elif 'gallery.json' in file_path:
        return {"items": []}
    elif 'products.json' in file_path:
        return {"products": []}
    elif 'newsletter.json' in file_path:
        return {"subscribers": []}
    elif 'translations.json' in file_path:
        return {
            "en": {
                "home": "Home",
                "events": "Events",
                "gallery": "Gallery",
                "products": "Products",
                "report": "Report Incident",
                "admin": "Admin",
                "mission": "Our Mission",
                "about": "About Us",
                "contact": "Contact",
                "donate": "Donate",
                "volunteer": "Volunteer",
                "subscribe": "Subscribe to Newsletter",
                "submit": "Submit",
                "email": "Email",
                "phone": "Phone",
                "address": "Address",
                "name": "Name",
                "description": "Description",
                "location": "Location",
                "date": "Date",
                "amount": "Amount",
                "goal": "Goal",
                "raised": "Raised",
                "title": "Title",
                "price": "Price",
                "quantity": "Quantity",
                "order": "Order Now",
                "chat_placeholder": "Ask us anything...",
                "send": "Send"
            },
            "hi": {
                "home": "होम",
                "events": "कार्यक्रम",
                "gallery": "गैलरी",
                "products": "उत्पाद",
                "report": "घटना की रिपोर्ट करें",
                "admin": "व्यवस्थापक",
                "mission": "हमारा मिशन",
                "about": "हमारे बारे में",
                "contact": "संपर्क",
                "donate": "दान करें",
                "volunteer": "स्वयंसेवक",
                "subscribe": "न्यूज़लेटर की सदस्यता लें",
                "submit": "जमा करें",
                "email": "ईमेल",
                "phone": "फ़ोन",
                "address": "पता",
                "name": "नाम",
                "description": "विवरण",
                "location": "स्थान",
                "date": "दिनांक",
                "amount": "राशि",
                "goal": "लक्ष्य",
                "raised": "एकत्रित",
                "title": "शीर्षक",
                "price": "मूल्य",
                "quantity": "मात्रा",
                "order": "अभी ऑर्डर करें",
                "chat_placeholder": "हमसे कुछ भी पूछें...",
                "send": "भेजें"
            }
        }
    else:
        return {}

def get_translation(lang: str) -> Dict[str, str]:
    """Get translations for specified language"""
    translations = load_json_data('data/translations.json')
    return translations.get(lang, translations.get('en', {}))
