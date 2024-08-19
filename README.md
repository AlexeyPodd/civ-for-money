# DuelMasters Application
DuelMasters is a site where steam players can find each other to play games for money.

## About application
If you are a good player, and want to monetize your skills playing your favorite game, you can have an idea to play with other people for money.
But what can guaranty that they will actually pay you after their lose? Or what can guaranty your honesty to them?
This application was created to solve this problem using power of web3 technologies!

### How exactly honesty is guaranteed:
Before starting a game every player is depositing their bets to smart contract. Then, after game is played, every player is reporting game result to smart contract, and if consensus about game result is reached, smart contract automatically sends prize fund according to game result.
If players disagree about game result, the final result is decided by the arbiter (site administrator). Players should have evidence of their victory to prove their point.

Smart contract is designed the way that arbiter is not able to take prise fund, or send it to anyone except participants of this game.

### Recommendations and notes about using the service
1. To find an opponent to play with, you can create game or find created by somebody else in a lobby.
2. Before joining a game carefully read rules, written by game host. Joining a game you are accepting them. (If you are hosting - make sure you are wrote all impotent to you things in game rules)
3. Check out player profile before make a decision about playing wth him. There is some statistics, arbiter warnings (if there was something to warn about) and link on steam account.
4. Also it is recommended to contact game host, and make sure he is not against your connection into game before actually connecting. (He can be waiting for someone else, and when you are joining or quitting a game you are actually interacting with smart contract, so you pay network fees)
5. Before actually playing make sure that game host is marked game as "started" (status would be "The game is on now"). If it is not - game can be just canceled any time.
6. Pay attention to play period. It is period of time when game must be finished and result should be voted. After this period ends any player vote will be treated as source of truth, and even arbiter will not be able to cancel game result.
7. If you are reached disagreement about result with your opponent - contact arbiter with your proofs using one of specified contacts on home page. (Including cheating, leaving, or just lying by your opponent)

## Peculiarities of hosted site on pythonanywhere.com

Link on hosted application: https://alexpod.pythonanywhere.com/

***Attention! Hosted site is working on Ethereum mainnet! Interacting with real smart contract will cost fees.***

## Technical description

#### Stack of technologies
1. **Backend**: Django REST Framework, web3.py, requests.py.
2. **Frontend**: React, Redux toolkit, Vite, Chakra-UI, ethers.js.
3. **Ethereum smart contract**: Solidity, hardhat.
4. **Other**: Steam OpenID, Metamask.

##### Backend

Django server serves a built React application and also API for that application.

1. **Authentication and authorization.** User is authenticating using Steam openID;
User's wallet address is registering on server, it is linked to steam account;
Administrator (arbiter) can make warning or ban user on site.
2. **Main app.** Users can create games instances.
When they do this, the server gets the main data directly from the chain, and only the data that is not stored there is retrieved from the client application (rules, game title, etc). There are many interactions with game instance on server - updating rules by host, updating game data from chain on command or when some event occurs, many more. 

##### Frontend

React application is designed for comforting playing in duel games for money.

User should authenticate using his steam account and connect wallet. After this he can host games, or join games another users hosting in lobby.

Also there is open profile with player statistics and warnings about this player from arbiter (site administration), if he was unfair.

Game page have interface to interact with Smart Contract.

##### Smart Contract

Smart contract for site hosted on pythonanywhere.com deployed in Ethereum Mainnet, but there is also Smart contract in Sepolia testnet for testing and demonstration purposes (instructions for launching are below).

 - Contract is storing all games players are creating. Game data can be reached by game id.
 - After creating game user can cancel it. If second player joined he will have refund. (Impossible after game was started).
 - Host can kick joined player before game was started (he will have refund).
 - Joined player can quit game before game was started and will have refund.
 - When second player is joined host can mark game as "started". This will mean that game now cannot be just canceled and second player cannot just quit or be kicked. Also in this moment is starting play period timer. When it will end any player vote will be treated as source of truth, if his opponent did not vote (this is needed for avoiding the intervention of an arbitrator if one of the participants refuses to vote).
 - After playing a game both players are reporting result to smart contract. If the votes agree, the winnings are distributed automatically (100% to winner or 50/50 if it was draw).
 - If votes does not agree, game is marked as disputed and arbiter will be able to force a winner or a draw.

## Local launching on Sepolia testnet instruction

Requirements: python >= 3.10, npm, node.

1. **Backend.** Open the target directory in terminal and clone the repository.

```
cd <path/to/your/target/directory>
git clone https://github.com/AlexeyPodd/civ-for-money
```
2. Create python venv in backend directory.

```
cd civ-for-money/backend/
python3 -m venv .venv
```
3. Activate virtual environment and install requirement packages.
```
source .venv/bin/activate
cd server
pip install -r requirements.txt
```

4. Make and initiate migrations.
```
python manage.py makemigrations
python manage.py migrate
```

5. Create file with environment variables.
```
touch .env
```
6. Install corsheaders.

```
pip install django-cors-headers
```

7. Add lines to server/settings.py file:
    - Add line `CORS_ALLOWED_ORIGINS = ['http://localhost:5173']`.
    - Add `"corsheaders",` into INSTALLED_APPS list.
    - Add `"corsheaders.middleware.CorsMiddleware",` into MIDDLEWARE list.

8. Write to created .env file this lines.

```
SECRET_KEY=''
DEBUG='True'
STEAM_API_KEY=''
ALCHEMY_HTTP_ADDRESS=''
SMART_CONTRACT_ADDRESS="0x2A97D32b93fd9cf072fFEf102B541CF21A73A2e2"
```

9. Get values and write them to this file in their relevant variables.

SECRET_KEY: https://djecrety.ir/

STEAM_API_KEY: https://steamcommunity.com/dev/apikey
(Domain Name: http://127.0.0.1/)

ALCHEMY_HTTP_ADDRESS: https://www.alchemy.com/
(use Sepolia address)

**Don't forget to save this file!**

10. Start the server.

```
python manage.py runserver
```

11. **Frontend.** Open the target directory in  **second** terminal and install dependencies.

```
cd <path/to/your/target/directory>
cd civ-for-money/frontend/app/
npm install
```

12. Create file with environment variables.
```
touch .env
```

13. Write to created .env file this lines.

```
VITE_BASE_URL=http://localhost:5173/
VITE_BASE_API_URL=http://127.0.0.1:8000/api/V1/
VITE_DUELS_CONTRACT_ADDRESS=0x2A97D32b93fd9cf072fFEf102B541CF21A73A2e2
VITE_ARBITER_ADDRESS=0x7538B18c122eA4687B5A1977Fc42F00bac486519
```

**Don't forget to save this file!**

14. Run site in developer mode.

```
npm run dev
```

15. Now you can open http://localhost:5173/ in a browser!

16. *If you want to see arbiter menu in any game page, you can write in variable VITE_ARBITER_ADDRESS your address, but since in smart contract is written another arbiter address, you will not be able to actually do with it anything.