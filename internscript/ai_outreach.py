import sys
import json
import os
import google.generativeai as genai

def generate_outreach():
    try:
        # Read input from stdin
        input_data = sys.stdin.read()
        if not input_data:
            return {"status": "error", "message": "No input data provided"}
            
        data = json.loads(input_data)
        
        company_name = data.get('company_name', '')
        internship_title = data.get('internship_title', '')
        internship_description = data.get('internship_description', '')
        outreach_type = data.get('type', 'email') # 'email' or 'linkedin'
        user_notes = data.get('user_notes', '')
        
        api_key = os.environ.get('GOOGLE_API_KEY')
        if not api_key:
             return {"status": "error", "message": "GOOGLE_API_KEY not found in environment variables"}

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')
        
        prompt = ""
        if outreach_type == 'email':
            prompt = f"""
            Write a professional and personalized outreach email to a recruiter or hiring manager at {company_name} for the {internship_title} position.
            
            Context about the internship:
            {internship_description}
            
            Additional User Notes/Context:
            {user_notes}
            
            The email should be:
            - Professional but engaging.
            - Highlight why I am a good fit based on the description (assume I have relevant skills, keep placeholders [My Skills] where necessary).
            - concise.
            - Subject line included.
            """
        elif outreach_type == 'linkedin':
             prompt = f"""
            Write a professional LinkedIn connection note (max 300 chars) and a longer follow-up message for a recruiter at {company_name} regarding the {internship_title} role.
            
            Context about the internship:
            {internship_description}
            
            Additional User Notes/Context:
            {user_notes}
            
            Output format:
            Connection Note: [Text]
            Message: [Text]
            """
        else:
             return {"status": "error", "message": "Invalid outreach type. Must be 'email' or 'linkedin'"}

        response = model.generate_content(prompt)
        
        return {
            "status": "success",
            "generated_content": response.text
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    result = generate_outreach()
    print(json.dumps(result))
