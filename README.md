# IMY-220-Photo-Share — Doodlr
Create a photo sharing website that provides an interface for sharing and saving photos.

Janke Rall
u24571238

## CheatSheet:
- To clone the whole repo to my laptop -> git clone  https://github.com/Ch3rryBl0ss0m104/IMY-220-Photo-Share.git
- To see the current state of my repo -> git status
- To stage and commit a file -> git add README.md && git commit -m "Add README"
- Push the changes to my branch -> git push --set-upstream origin HEAD

## Final Deliverable

### GITHUB REPO
https://github.com/Ch3rryBl0ss0m104/IMY-220-Photo-Share.git

### HOW TO BUILD AND RUN WITH DOCKER (recommended way to demo)
Run each command from the project root (the folder containing this file).

1. `docker compose up --build`
2. In a second terminal: `docker compose exec backend npm run seed`
3. Open http://localhost:5173 in your browser.

This starts 3 containers: `mongo`, `backend` (Express API on port 5000), and `frontend` (served on port 5173).

To stop everything: `docker compose down` (add `-v` to also wipe the database volume).

### RUNNING WITHOUT DOCKER
#### Backend:
- cd backend
- cp .env.example .env (or create `.env` with `MONGO_URI=mongodb://localhost:27017`)
- npm install
- npm run seed
- npm start
#### Frontend (in a second terminal):
- cd frontend
- npm install
- npm run dev
#### Then open http://localhost:5173

### Test accounts (after seeding)
| Role | Email | Password |
|---|---|---|
| Regular user | test@test.com | test1234 |
| Admin | admin@doodlr.test | admin1234 |

The admin account can access `/admin` (also linked from the header once signed in) to view reported posts,
dismiss or delete them, manage the list of report reasons, and manage any user/post/album in the system.

### Project structure
```
backend/
  config/      - the one place the MongoDB connection is opened (native `mongodb` driver, not Mongoose)
  middleware/  - requireAuth / requireAdmin session guards
  routes/      - Express routers (thin - validate input, call a service, respond)
  services/    - all actual database logic, one file per collection
  seed/        - npm run seed - clears and repopulates the database with realistic test data
frontend/
  src/components/ - reusable pieces (Header, PostPreview, Avatar, forms, etc.)
  src/pages/       - one component per route (Home, Profile, Post, Album, Search, Admin, Splash)
  src/api/         - thin fetch wrappers, one file per backend resource
  src/context/     - AuthContext (who's signed in, across the whole app)
```
