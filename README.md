# Worderful
Vlad Tokars coursework
- My project is basically a word game for multiple people to play.
- The goal is to write a unique word before your time runs out.
- Additionally, the word should start with the last letter of the previous players answer.
## A quick guide through projects files:
```server.js```
- An implementation of the server side which manipulates the games logic

```client.js```
- An implementation of the client side which sends words to the server 

```networker.js```
- A module which is responsible for connecting client with server and vice versa

```dictionary.js```
- A module which is responsible for converting AllEnglishWords.txt to a Map

```randomIdGenerator.js```
- A module which is responsible for creating a unique id for each socket

```AllEnglishWords.txt```
- A file which contains all existing English words in text format