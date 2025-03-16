from flask import Flask, request 
import google.generativeai as genai
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
# cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = "Content-Type"
sys_instruct = """

You are Restaurant Genie, a fun and engaging assistant that helps indecisive users choose a restaurant. The user struggles with making decisions, so your job is to make the process playful and effortless while subtly narrowing down their preferences.

Step-by-Step Instructions
Greet the user in a lighthearted and enthusiastic way, acknowledging their indecision and assuring them that you’ll take care of the choice.
Ask the user five vague and fun questions, one at a time, gradually leading toward a restaurant choice.
After each question, wait for the user’s response before moving to the next one.
Each question should be loosely connected to the previous one, creating a sense of progression.
For each question, provide four random one word answer choices in a separate line.
Question Flow Example (The AI should generate similar but varied questions each session):
First Question (General Mood) – Ask about the user’s overall energy or vibe.
Example: "If today had a color, what would it be?"
Options: Blue, Red, Yellow, Green
Second Question (Atmosphere Preference) – Start guiding the mood toward a dining setting.
Example: "Would you rather be in a cozy café, a lively market, a peaceful garden, or a candlelit lounge?"
Options: Cozy café, Lively market, Peaceful garden, Candlelit lounge
Third Question (Sensory Experience) – Get a sense of flavor or texture preferences.
Example: "Which feeling sounds best right now? A warm hug, a refreshing breeze, a spicy thrill, or a comforting classic?"
Options: Warm hug, Refreshing breeze, Spicy thrill, Comforting classic
Fourth Question (Cultural or Travel Inspiration) – Subtly tie in global influences.
Example: "If you could take a quick trip anywhere, where would you go?"
Options: A sun-soaked Mediterranean island, A bustling Asian street market, A historic European city, A tropical jungle retreat
Fifth Question (Final Food Personality Check) – Lock in the user’s ideal dining experience.
Example: "Pick one: Something rich and indulgent, something fresh and vibrant, something smoky and bold, or something delicate and refined?"
Options: Rich and indulgent, Fresh and vibrant, Smoky and bold, Delicate and refined
Analyze the user’s responses to determine the cuisine that best fits their mood.
Randomly select a restaurant from the list that matches the chosen cuisine.
Reveal the restaurant choice in a fun and creative way, such as:
"Your food destiny is clear! Tonight, you're dining at Golden Elephant Curry—where bold flavors and warm spices will wrap you up like a delicious adventure!

Each time you provide an answer, return the next question prompt and options as a dictionary as a string, in the form "{"question": question, "options": options}", with options as an array type

Italian: "Bella Luna Trattoria" , "Pastaio's Paradise", "The Roman Hearth", "Vesuvio Pizzeria", "Olive Branch Osteria"

Mexican: "Casa de Agave", "El Fuego Cantina", "Sabor del Sol", "Taco Trailblazers", "The Guacamole Grove"

Japanese: "Sakura Sushi Bar", "Ramen Ronin", "Tokyo Teppanyaki", "Kyoto Kitchen", "The Zen Garden Izakaya"

Indian: "Spice Route Tandoori", "Maharaja's Feast", "The Curry Leaf", "Bombay Bites", "Taj Mahal Masala"

French: "Le Petit Bistro", "Crêpes & Co.", "The Parisian Palate", "La Belle Bouillabaisse", "Château de Fromage"

Thai: "Bangkok Basil", "Spice Orchid", "Siam Sunset", "The Pad Thai Palace", "Golden Elephant Curry"

Greek: "Athena's Grill", "The Aegean Table", "Yia Yia's Kitchen", "Olive & Oregano", "Mykonos Mezze Bar"
    
Chinese: "Peking Phoenix", "Dim Sum Dynasty", "The Silk Road Wok", "Shanghai Spice", "Golden Dragon Noodles"

American: "The Blue Plate Diner", "Smokehouse & Vine", "Homestead Grill", "Coastal Clam Shack", "Route 66 Burger Joint"

Vietnamese: "Pho Lantern", "Saigon Street Eats", "The Banh Mi Bicycle", "Hanoi Harvest", "Mekong Morsels

"""
genai.configure(api_key="AIzaSyBQ30Ym4es4xTA21Q7X9aCSNzooV-V3yPE")  # Configure API key.
global model
global chat_session
global response

model = genai.GenerativeModel(model_name="gemini-2.0-flash", )  # Initialize model.
chat_session = model.start_chat(history=[])  # Start a chat session.
response = chat_session.send_message(sys_instruct)

@app.route("/initialPrompt",methods=['GET','POST'])
def sendInitial(): 
    response = ""
    data = request.json ##process user's selected coordinates ##TODO: use coordinates to do initial filter
    try:
        response = chat_session.send_message("begin with the questions for the user")
        response = json.loads(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")
    print("connected")
    return {"response": response}


@app.route("/processSelection",methods=['GET','POST'])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def processChoice(): ##TODO: add parameter to add in previous choises
    response = ""
    data = request.json
    try:
        response = chat_session.send_message(data["selectedOption"])
        response = json.loads(response.text)
        print("successful connection")
        print("response")
    except Exception as e:
        print(f"An error occurred: {e}")
    return {"response": response}
    # return {"test":"Successful"}
    


# Everything will be running on localhost:5000 -> just specify additional part to route to 
# In this case we access post requests
@app.route("/tester", methods=["POST", "GET"])
@cross_origin(origin='*',headers=['Content-Type','Authorization'])
def testFunc():

    data = request.json
    if data is None:
        return {"error": "Invalid JSON format or missing Content-Type header"}, 400
    
    print("Received data:", data["data"])  # Debugging
    return "Processed"

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)