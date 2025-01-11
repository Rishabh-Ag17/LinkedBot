# LinkedBot
**BotIn (aka LinkedBot)** is an intelligent Discord bot designed to assist job seekers in enhancing their resumes, LinkedIn profiles, and cover letters. Built using Node.js and Python's spaCy library, the bot parses uploaded resumes, provides personalized LinkedIn suggestions, and generates customized cover letters based on job details shared by users.

**Project Overview**
1. Resume Parsing: The bot extracts key data from PDF resumes, including skills, education, and experience.
2. LinkedIn Suggestions: Provides actionable insights to enhance LinkedIn profiles with relevant skills, certifications, and headlines.
3. Cover Letter Generator: Automatically generates tailored cover letters using parsed resume data and job-specific details.

**Working**
1. Upload Resume: Users can upload their resumes (in PDF format) through Discord.
2. Parse Resume: The bot processes the resume using Python's spaCy library for natural language processing (NLP) to extract key details like skills, education, and work experience.
3. Job Details Input: The bot requests job-specific details such as role, company, key achievements, etc.
4. Generate Suggestions & Cover Letter: Based on the extracted resume data and provided job details, the bot generates:
   1. LinkedIn profile suggestions
   2. A customized cover letter

**Motivation and Future Scope**
Initially, I planned to integrate the OpenAI API to enhance the bot’s functionality, particularly for resume analysis and cover letter generation. However, due to the cost of using OpenAI's API, I opted for this approach using spaCy for now.
In the future, I aim to improve the bot’s capabilities by integrating OpenAI's API or Google Gemini API (or similar models) to offer more advanced features such as:
1. Enhanced resume parsing and suggestions
2. Advanced natural language generation for cover letters
3. More intelligent job matching and career advice

**Usage**
To interact with the bot, invite it to a Discord server and use the following commands:
1. !upload: Upload your resume in PDF format.
2. Provide job details in the format: Role: [Role], Company: [Company], Key Achievement: [Achievement].
