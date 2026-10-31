// Section switching
function showSection(id){
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// --- AI INTEGRATION ---
// Free Gemini API key: https://aistudio.google.com/app/apikey nunchi teesuko
const API_KEY = "..";
async function askAI() {
    const input = document.getElementById("userInput").value.trim();
    const chatBox = document.getElementById("chatBox");

    if (!input) {
        alert("Please enter a question first!");
        return;
    } 

    const userDiv = document.createElement("div");
    userDiv.textContent = "You: " + input;
    chatBox.appendChild(userDiv);

    document.getElementById("userInput").value = "";

    const loadingDiv = document.createElement("div");
    loadingDiv.textContent = "CampusAI is thinking...";
    chatBox.appendChild(loadingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are CampusAI, a friendly college study assistant.

Explain the topic in simple English.

STRICT FORMATTING:
- Put every heading on a separate line.
- Put every numbered point on a separate line.
- Never combine everything into one paragraph.
- Use short and clear sentences.
- Leave a blank line between sections.

TOPIC:
Write the topic name.

DEFINITION:
Explain in 2 simple sentences.

IMPORTANT POINTS:
1. Explain the first important point.
2. Explain the second important point.
3. Explain the third important point.
4. Add more points if necessary.

EXAMPLE:
Give one simple example.

SUMMARY:
Write one short concluding sentence.

Student question: ${input}`
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.5,
                        maxOutputTokens: 700
                    }
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error?.message || "HTTP " + res.status);
        }

        const reply =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No answer was received. Please try again.";

        const formattedReply = reply
    .replace(/\s*(TOPIC:|DEFINITION:|MEANING:|IMPORTANT POINTS:|EXAMPLE:|SUMMARY:)/gi, "\n\n$1")
    .replace(/\s*(\d+\.)\s*/g, "\n$1 ");

loadingDiv.style.whiteSpace = "pre-line";
loadingDiv.style.lineHeight = "1.7";
loadingDiv.textContent = "CampusAI:\n" + formattedReply.trim();

    } catch (error) {
        loadingDiv.textContent = "CampusAI Error: " + error.message;
        console.error("AI Assistant error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

async function summarizeNotes() {
  const text = document.getElementById("notesInput").value.trim();
  const output = document.getElementById("summaryOutput");

  if (!text) {
    alert("Please paste your notes first!");
    return;
  }

  output.textContent = "Summarizing...";

  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are CampusAI, a college notes summarizer.
Summarize the notes in simple English for a student.

Follow this exact format:

TOPIC:
Write the topic name.

DEFINITION:
Explain the topic in 2 short sentences.

IMPORTANT POINTS:
1. Write one key point per line.
2. Explain each point in simple words.
3. Include important definitions and examples.

CONCLUSION:
Write 1 or 2 short sentences.

Keep the summary organized and easy to study.
Do not use Markdown symbols like ###, **, or *.
Use plain text with clear line breaks.
Do not write a long paragraph.

NOTES:
${text}`
            }]
          }], 
      generationConfig:{
          temperature:0.5,
          maxOutputTokens:700
        }
        })
      }
    );

    const data = await res.json();
    console.log("Gemini response:",data);
if (!res.ok) {
    const apiError = new Error(
        data.error?.message || `HTTP ${res.status}`
    );
    apiError.status = res.status;
    throw apiError;
}

    const summary =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("\n") || "No summary was returned.";

    output.style.whiteSpace = "pre-wrap";
output.textContent = summary.replace(/\\n/g, "\n");

  } catch (error) {
    if (error.status === 429) {
        output.textContent =
            "Gemini API limit exceeded. Please wait and try again later.";
    } else {
        output.textContent = "Summary error: " + error.message;
    }
}
}

function addNotice() {
    const input = document.getElementById("newNotice");
    const category = document.getElementById("noticeCategory").value;
    const value = input.value.trim();

    if (!value) {
        alert("Please enter a notice first!");
        return;
    }

    const div = document.createElement("div");
    div.className = "notice";
    div.dataset.category = category;

    const title = document.createElement("strong");
    title.textContent = "📌 " + category;

    const message = document.createElement("p");
    message.textContent = value;

    const date = document.createElement("small");
    date.textContent = "Posted: " + new Date().toLocaleDateString("en-IN");

    div.appendChild(title);
    div.appendChild(message);
    div.appendChild(date);

    document.getElementById("noticeList").prepend(div);

    input.value = "";
    filterNotices();
}

function filterNotices() {
    const searchText = document
        .getElementById("noticeSearch")
        .value.toLowerCase();

    const notices = document.querySelectorAll("#noticeList .notice");

    notices.forEach(function(notice) {
        const matches = notice.textContent
            .toLowerCase()
            .includes(searchText);

        notice.style.display = matches ? "block" : "none";
    });
}
function showNotes(subject) {
    let output = document.getElementById("websiteNotes");

if (!output) {
    output = document.createElement("div");
    output.id = "websiteNotes";
    output.className = "output";
    document.getElementById("materials").appendChild(output);
}

    const notes = {
        dbms: `DBMS - Sample Website Notes

Definition:
A DBMS is software used to store, organize, retrieve and manage data.

Important Points:
1. Tables store data in rows and columns.
2. A primary key uniquely identifies each row.
3. A foreign key connects related tables.
4. Normalization reduces duplicate data.
5. SQL is used to manage relational databases.

Example:
A college database stores student names, roll numbers and marks.`,

        python: `PYTHON - Sample Website Notes

Definition:
Python is a simple, high-level programming language.

Important Points:
1. Variables store values.
2. Common data types include int, float, str and bool.
3. Operators perform calculations and comparisons.
4. Loops repeat a block of code.
5. Functions organize reusable code.

Example:
print("Hello, World!")`,

        se: `SOFTWARE ENGINEERING - Sample Website Notes

Definition:
Software engineering is the systematic process of developing and maintaining software.

Important Points:
1. SDLC means Software Development Life Cycle.
2. Requirement analysis identifies user needs.
3. Design describes the software structure.
4. Testing finds errors in software.
5. Maintenance improves software after release.

Example:
A college attendance application is developed using software engineering steps.`,
ooad: `OOAD - Sample Website Notes

Definition:
Object Oriented Analysis and Design is a method of designing software using objects.

Important Points:
1. Objects represent real-world entities.
2. Classes are blueprints for objects.
3. Encapsulation combines data and methods.
4. Inheritance supports code reusability.
5. UML diagrams represent software design.

Example:
A Student class contains name, roll number and marks.`,

ai: `ARTIFICIAL INTELLIGENCE - Sample Website Notes

Definition:
Artificial Intelligence enables machines to perform tasks that require human intelligence.

Important Points:
1. AI helps machines make decisions.
2. Machine Learning is a part of AI.
3. NLP helps computers understand human language.
4. Expert systems use stored knowledge.
5. AI is used in chatbots and robotics.

Example:
A college chatbot answers student questions.`,

cnip: `COMPUTER NETWORKS AND INTERNET PROTOCOLS - Sample Website Notes

Definition:
A computer network connects computers to share data and resources.

Important Points:
1. LAN connects computers in a small area.
2. WAN covers large geographical areas.
3. TCP provides reliable data transmission.
4. IP identifies devices on a network.
5. HTTP and HTTPS support web communication.

Example:
Computers connected in a college lab form a LAN.`,

gb: `GREEN BUILDING - Sample Website Notes

Definition:
A green building reduces environmental impact and saves natural resources.

Important Points:
1. Green buildings save energy.
2. Solar panels generate electricity.
3. Rainwater harvesting saves water.
4. Sustainable materials reduce pollution.
5. Natural lighting saves electricity.

Example:
A college building using solar panels is a green building.`,

atcd: `AUTOMATA THEORY AND COMPILER DESIGN - Sample Website Notes

Definition:
Automata Theory studies abstract machines and formal languages. Compiler Design translates programs into machine code.

Important Points:
1. Finite Automata recognize regular languages.
2. DFA and NFA are types of finite automata.
3. Regular expressions describe regular languages.
4. A compiler translates high-level programs.
5. Compiler phases include lexical, syntax and semantic analysis and code generation.

Example:
A compiler converts a C program into executable code.`,

iqta: `INTRODUCTION TO QUANTUM TECHNOLOGIES AND APPLICATIONS - Sample Website Notes

Definition:
Quantum Technology uses principles of quantum physics to develop advanced technologies.

Important Points:
1. Qubit is the basic unit of quantum information.
2. Superposition allows a qubit to exist in multiple states.
3. Entanglement connects two or more quantum particles.
4. Quantum computers solve certain complex problems efficiently.
5. Quantum technology is used in computing, communication and sensing.

Example:
Quantum computers can help in drug discovery and complex scientific research.`
    };

    output.textContent = notes[subject] || "Notes not found.";
    output.style.whiteSpace = "pre-wrap";
    output.style.lineHeight = "1.7";
    output.style.padding = "15px";
}
