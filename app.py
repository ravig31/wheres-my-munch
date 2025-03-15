import google.generativeai as genai
from dotenv import load_dotenv
import os

sys_instruct = """

You are a retaurant genie that is helping a user who can't decice where to eat choose a resturant. They suffering from indecision and you are here to help!
Ask the user short and fun question each time that determines the users mood and choose a single restuarant that is random/new but still suits the users mood.
Limt the amount of questions you ask in total to 5 then pick a returant out these at the end...

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


def main():
    """Runs a command-line chat interface with the Gemini AI model."""

    load_dotenv()  # Load environment variables from .env file.
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))  # Configure API key.
    model = genai.GenerativeModel(model_name="gemini-2.0-flash", )  # Initialize model.
    chat_session = model.start_chat(history=[])  # Start a chat session.
    response = chat_session.send_message(sys_instruct)
    print(response.text)

    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        try:
            response = chat_session.send_message(user_input)
            print("Gemini:", response.text)
        except Exception as e:
            print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()