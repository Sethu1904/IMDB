# IMDb Content Upload & Review System

A Flask + MongoDB web app for uploading and browsing movie/show data via CSV.

---

## Tech Stack

- **Backend:** Python, Flask
- **Database:** MongoDB
- **Frontend:** HTML, CSS, Vanilla JavaScript

---

# macOS Setup

## Step 1 — Install Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Step 2 — Install Python

```bash
brew install python
```

## Step 3 — Install MongoDB

```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
```

## Step 4 — Disable MongoDB Authentication

```bash
sudo nano /opt/homebrew/etc/mongod.conf
```

Find the `security:` section and set it to:

```yaml
security:
  authorization: disabled
```

Save with `Ctrl+X` → `Y` → `Enter`

## Step 5 — Start MongoDB

```bash
brew services start mongodb-community@6.0
```

Verify it is running:

```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

You should see `{ ok: 1 }`.

## Step 6 — Clone the Project

```bash
git clone <your-github-repo-url>
cd IMDB
```

## Step 7 — Setup Python Environment

```bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install flask pymongo python-dotenv
```

## Step 8 — Run the App

```bash
python3 run.py
```

## Step 9 — Open in Browser

```
http://localhost:5001
```

### Every time you want to run the app (macOS)

```bash
brew services start mongodb-community@6.0
cd IMDB
source venv/bin/activate
python3 run.py
```

---

# Windows Setup

## Step 1 — Install Python

1. Go to https://www.python.org/downloads/
2. Download the latest Python 3.x installer
3. Run the installer — **check "Add Python to PATH"** before clicking Install
4. Verify installation:

```cmd
python --version
```

## Step 2 — Install MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select **Version 6.0**, Platform **Windows**, Package **MSI**
3. Download and run the installer
4. During install, select **"Install MongoD as a Service"** and uncheck **"Enable Access Control"**
5. Click through and finish the installation

## Step 3 — Verify MongoDB is Running

Open Command Prompt and run:

```cmd
mongosh --eval "db.runCommand({ ping: 1 })"
```

You should see `{ ok: 1 }`.

## Step 4 — Install Git (if not installed)

1. Go to https://git-scm.com/download/win
2. Download and install with default settings

## Step 5 — Clone the Project

```cmd
git clone <your-github-repo-url>
cd IMDB
```

## Step 6 — Setup Python Environment

```cmd
python -m venv venv
venv\Scripts\activate
pip install flask pymongo python-dotenv
```

## Step 7 — Run the App

```cmd
python run.py
```

## Step 8 — Open in Browser

```
http://localhost:5001
```

### Every time you want to run the app (Windows)

MongoDB runs as a Windows service automatically, so just:

```cmd
cd IMDB
venv\Scripts\activate
python run.py
```

---

## How to Use

1. Click **Upload CSV** in the sidebar
2. Upload the `movies_data_assignment.csv` file
3. Wait for the success screen showing total records and time taken
4. Click **View Movies / Shows** to browse the data
5. Use filters for **Year**, **Language**, **Sort By**, and **Order**

---

## API Endpoints

### Upload CSV
```
POST /api/upload
Content-Type: multipart/form-data
Body: file=<csv file>
```

### List Movies
```
GET /api/movies
```

| Query Param | Description | Example |
|-------------|-------------|---------|
| `page` | Page number (default: 1) | `?page=2` |
| `limit` | Records per page (default: 10, max: 100) | `?limit=20` |
| `year` | Filter by release year | `?year=2023` |
| `language` | Filter by language | `?language=English` |
| `sort_by` | Sort field: `release_date` or `rating` | `?sort_by=rating` |
| `order` | `asc` or `desc` | `?order=asc` |

### Get Filter Options
```
GET /api/movies/filters
```
Returns all available years and languages for dropdowns.
