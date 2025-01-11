const { Client, GatewayIntentBits, Partials } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { spawn } = require('child_process');

// Create the bot client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Channel]
  });

const TOKEN = process.env.BOT_TOKEN;

// Parse Resume Function
async function parseResumeWithSpacy(filePath) {
    return new Promise((resolve, reject) => {
      const process = spawn('python', ['spacy_parser.py', filePath]);
  
      let output = '';
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
  
      process.stderr.on('data', (data) => {
        console.error('Error:', data.toString());
      });
  
      process.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(output));
        } else {
          reject('Error running spaCy parser.');
        }
      });
    });
  }

// Generate LinkedIn Suggestions
function generateLinkedInSuggestions(parsedData) {
    const suggestions = [];
    const keywords = {
      headline: ["software engineer", "developer", "manager"],
      skills: ["JavaScript", "Python", "SQL", "React", "Node.js"],
      education: ["B.Sc.", "M.Sc.", "PhD"],
      certifications: ["AWS", "Google", "Microsoft"]
    };
  
    const parsedText = [
      ...parsedData.skills,
      ...parsedData.education,
      ...parsedData.experience
    ].join(" "); // Join the extracted sections into a single string
  
    // Headline
    if (!parsedText.toLowerCase().includes(keywords.headline[0])) {
      suggestions.push("Add a professional headline such as 'Software Engineer | AI Enthusiast'.");
    }
  
    // Skills
    const detectedSkills = keywords.skills.filter(skill => parsedText.includes(skill));
    if (detectedSkills.length === 0) {
      suggestions.push("Your resume lacks key technical skills. Add relevant skills like JavaScript, Python, or SQL.");
    } else {
      suggestions.push(`Highlight the following skills on LinkedIn: ${detectedSkills.join(", ")}.`);
    }
  
    // Education
    if (!keywords.education.some(ed => parsedText.includes(ed))) {
      suggestions.push("Your resume seems to lack education details. Add your degree and institution.");
    }
  
    // Certifications
    const detectedCerts = keywords.certifications.filter(cert => parsedText.includes(cert));
    if (detectedCerts.length === 0) {
      suggestions.push("Consider adding certifications like AWS Certified Developer or Google Professional Engineer.");
    }
  
    return suggestions;
  }
  


// Handle messages
// Store job details temporarily
// Store parsedData and jobDetails temporarily
let parsedData = null;
let jobDetails = null;

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Step 1: Ask the user to upload a resume
  if (message.content.startsWith('!upload')) {
    message.channel.send('Please upload your resume in PDF format.');
  }

  // Step 2: Handle resume upload
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    if (attachment.name.endsWith('.pdf')) {
      const filePath = `./uploads/${attachment.name}`;
      const file = fs.createWriteStream(filePath);

      require('https').get(attachment.url, (response) => {
        response.pipe(file);
        file.on('finish', async () => {
          file.close();

          try {
            // Parse the resume and extract the data
            parsedData = await parseResumeWithSpacy(filePath);
            message.channel.send("Resume processed! Please provide the job details in the format: `Role: [Role], Company: [Company], Key Achievement: [Achievement]`");
          } catch (error) {
            console.error(error);
            message.channel.send('Failed to process your resume. Please ensure it is in a valid PDF format.');
          }
        });
      });
    } else {
      message.channel.send('Only PDF resumes are supported. Please upload a valid PDF file.');
    }
  }

  // Step 3: Capture job details
  if (message.content.startsWith('Role:')) {
    const jobInfo = message.content.split(',').reduce((acc, part) => {
      const [key, value] = part.split(':').map(str => str.trim());
      if (key && value) {
        acc[key.toLowerCase()] = value;
      }
      return acc;
    }, {});

    // Save job details to the global variable
    jobDetails = {
      role: jobInfo.role || 'Software Developer',
      company: jobInfo.company || 'Google',
      keyAchievement: jobInfo['key achievement'] || 'streamlined workflows',
      value: jobInfo.value || 'delivering excellence',
      projectImpact: jobInfo['project impact'] || 'team contributions and project success',
      companyValues: jobInfo['company values'] || 'your commitment to innovation',
      industry: jobInfo.industry || 'technology'
    };

    message.channel.send(`Job details received: ${JSON.stringify(jobDetails)}`);

    // If resume is already processed, generate the cover letter
    if (parsedData) {
      const suggestions = generateLinkedInSuggestions(parsedData);
      const coverLetter = generateEnhancedCoverLetter(parsedData, jobDetails);
      message.channel.send(`LinkedIn Suggestions:\n${suggestions.join('\n')}`);
      message.channel.send(`Generated Cover Letter:\n\n${coverLetter}`);

      // Reset parsedData and jobDetails for future interactions
      parsedData = null;
      jobDetails = null;
    }
  }
});


client.login(TOKEN);