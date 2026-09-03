# IMY-220-Photo-Share
Create a photo sharing website that provides an interface for sharing and saving photos.

Janke Rall 
u24571238

CheatSheet:
To clone the whole repo to my laptop -> git clone  https://github.com/Ch3rryBl0ss0m104/IMY-220-Photo-Share.git
To see the current state of my repo -> git status
To stage and commit a file -> git add README.md && git commit -m "Add README"
Push the changes to my branch -> git push --set-upstream origin HEAD

Deliverable 1

GITHUB REPO
https://github.com/Ch3rryBl0ss0m104/IMY-220-Photo-Share.git

HOW TO BUILD AND RUN W DOCKER
Run each command from the project root (the folder containing this file).
Backend:
    docker build -t doodlr-backend ./backend
    docker run -p 5000:5000 doodlr-backend
Frontend:
    docker build -t doodlr-frontend ./frontend
    docker run -p 5173:5173 doodlr-frontend
Then open http://localhost:5173 in Chrome.
The backend stub endpoints are available at http://localhost:5000/api/auth/signin and http://localhost:5000/api/auth/signup.
Optional (both containers at once, if Docker Compose is available):
    docker compose up --build

RUNNONG WITHOUT DOCKER
Backend:
    cd backend
    npm install
    npm start
Frontend (in a second terminal):
    cd frontend
    npm install
    npm run dev

