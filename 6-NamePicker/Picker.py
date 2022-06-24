import cv2
from ffpyplayer.player import MediaPlayer
import time
import random
import copy
import gtts
from playsound import playsound

rng = random.SystemRandom()

# Get names
print("Enter the list of names in a comma seperated list")
namesString = input()
names = namesString.split(",")

random.shuffle(names)


# Rock Paper Scissors to find winner
def RPS(p1, p2):
	# returns loser
	while True:
		p1move = rng.randint(1,3)
		p2move = rng.randint(1,3)

		if p1move == p2move:
			continue
		elif p1move == 1:
			if p2move == 2:
				return p1
			elif p2move == 3:
				return p2
		elif p1move == 2:
			if p2move == 1:
				return p2
			elif p2move == 3:
				return p1
		elif p1move == 3:
			if p2move == 1:
				return p1
			elif p2move == 2:
				return p2

while len(names) > 1:
	# Pair each name and do RPS match
	winners = copy.deepcopy(names)

	for i in range(0, len(names)-1, 2):
		#print("Match: " + names[i] + names[i+1])
		loser = RPS(names[i], names[i+1])
		winners.remove(loser)

	random.shuffle(winners)
	names = copy.deepcopy(winners)
	#print(names)

winner = names[0]
tts = gtts.gTTS(winner)
tts.save("winnerName.mp3")


# Display winner
cap = cv2.VideoCapture("winner.mp4")
audio = MediaPlayer("winner.mp4")

lastframe = None

while (cap.isOpened()):
	grabbed,frame = cap.read()
	audio_frame, val = audio.get_frame()

	if not grabbed:
		break

	if cv2.waitKey(32) & 0xFF == ord("q"):
		break

	cv2.imshow("Winner", frame)
	if val != 'eof' and audio_frame is not None:
		#audio
		img, t = audio_frame

	lastframe = frame

#playsound("winnerName.mp3")
playsound("winnerName.mp3")
cv2.putText(lastframe, winner, (125,300), cv2.FONT_HERSHEY_SIMPLEX, 2, (10, 10, 255), 3, cv2.LINE_AA, False)
cv2.imshow("Winner", lastframe)
cv2.waitKey(3000)
cap.release()
cv2.destroyAllWindows()
