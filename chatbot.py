import json
import os
from openai import OpenAI

# the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# do not change this unless explicitly requested by the user
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "your-openai-api-key")

# FAQ data for the chatbot
FAQ_DATA = {
    "mission": "Our mission is to empower communities through education, healthcare, and sustainable development initiatives.",
    "donate": "You can donate to any of our events or programs. We accept online donations and all contributions go directly to the cause.",
    "volunteer": "We welcome volunteers for all our events and programs. You can register as a volunteer on our events page.",
    "contact": "You can reach us at info@nayasawera.org or through our contact form.",
    "programs": "We run programs in education, healthcare, skill development, and community empowerment.",
    "reports": "You can report incidents or issues through our incident reporting page. All reports are reviewed by our team.",
    "newsletter": "Subscribe to our newsletter to stay updated with our latest activities and events."
}

def get_chatbot_response(user_message: str) -> str:
    """Get chatbot response using OpenAI or fallback to FAQ"""
    
    # First try to match with FAQ
    user_message_lower = user_message.lower()
    for key, response in FAQ_DATA.items():
        if key in user_message_lower:
            return response
    
    # Try OpenAI API if available
    try:
        if OPENAI_API_KEY and OPENAI_API_KEY != "your-openai-api-key":
            openai = OpenAI(api_key=OPENAI_API_KEY)
            
            system_prompt = """
            You are a helpful assistant for Naya Sawera Foundation, an NGO focused on:
            - Education and skill development
            - Healthcare initiatives
            - Community empowerment
            - Sustainable development
            
            Keep responses concise, helpful, and focused on the NGO's mission.
            If asked about donations, volunteering, or specific programs, provide relevant information.
            """
            
            response = openai.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
    
    # Fallback response
    return "Thank you for your message. For specific questions about our programs, donations, or volunteering opportunities, please contact us at info@nayasawera.org or call us. How can I help you today?"
