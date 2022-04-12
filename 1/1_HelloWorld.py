from requests import get
from googletrans import Translator
from countryinfo import CountryInfo
from playsound import playsound
import time

# Dictionary representing the morse code chart
MORSE_CODE_DICT = { 'A':'.-', 'B':'-...',
                    'C':'-.-.', 'D':'-..', 'E':'.',
                    'F':'..-.', 'G':'--.', 'H':'....',
                    'I':'..', 'J':'.---', 'K':'-.-',
                    'L':'.-..', 'M':'--', 'N':'-.',
                    'O':'---', 'P':'.--.', 'Q':'--.-',
                    'R':'.-.', 'S':'...', 'T':'-',
                    'U':'..-', 'V':'...-', 'W':'.--',
                    'X':'-..-', 'Y':'-.--', 'Z':'--..',
                    '1':'.----', '2':'..---', '3':'...--',
                    '4':'....-', '5':'.....', '6':'-....',
                    '7':'--...', '8':'---..', '9':'----.',
                    '0':'-----', ', ':'--..--', '.':'.-.-.-',
                    '?':'..--..', '/':'-..-.', '-':'-....-',
                    '(':'-.--.', ')':'-.--.-'}
 
# Function to encrypt the string
# according to the morse code chart
def encrypt(message):
    cipher = ''
    for letter in message:
        if letter != ' ':
 
            # Looks up the dictionary and adds the
            # correspponding morse code
            # along with a space to separate
            # morse codes for different characters
            cipher += MORSE_CODE_DICT[letter] + ' '
        else:
            # 1 space indicates different characters
            # and 2 indicates different words
            cipher += ' '
 
    return cipher

ip = get('https://api.ipify.org').content.decode('utf8')
#print('My public IP address is: {}'.format(ip))

response = get('https://geolocation-db.com/json/{}&position=true'.format(ip)).json()
#print(response)

country = CountryInfo(response["country_name"])
#print(country.languages())

translator = Translator()

translation = translator.translate("Hello World", dest=country.languages()[0])
#print(f"{translation.origin} ({translation.src}) --> {translation.text} ({translation.dest})")
print(translation.text)

message = encrypt(translation.text.upper())
print(message)

for c in message:
    if c == ".":
        playsound("dot.mp3")
    elif c == "-":
        playsound("dash.mp3")
    elif c == " ":
        time.sleep(0.5)
