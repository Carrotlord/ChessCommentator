Author: Jiangcheng Oliver Chu

Event: UC Berkeley - CSUA Hackathon on 11/21/2014

Welcome to Chess Commentator! It's an artificial intelligence that rates a particular chess move as good or bad, comments on it "e.g. the knight is now threatening the rook, black is in the lead" and attempts to analyze the chess metagame.

This was an approximately 18-hour-long hack initially written for the CSUA hackathon for fall of 2014.

To be improved in the future!

Source code makeup:
JavaScript, HTML, CSS, and Ruby.

==== Technical Details ====
All chess pieces are represented using unicode characters
0x2654 through 0x265F (which are glyphs that look like chess pieces).
Images files are not used for chess pieces.
Amazingly, this works quite well given a large enough font size.

See the following link for an example of using displaying big unicode-character chess pieces in Java:
http://stackoverflow.com/questions/18686199/fill-unicode-characters-in-labels

Other resources:
http://en.wikipedia.org/wiki/Web_colors
