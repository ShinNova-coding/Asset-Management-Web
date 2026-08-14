IT Asset Management System

 AssetFlow is an integrated IT asset management platform designed to track and manage the full lifecycle of organization assets—from procurement, deployment, and assignment to maintenance and retirement. It centralizes all hardware specs, software licenses, employee assignments, and financial depreciation data, providing real-time dashboards and comprehensive reporting to optimize asset utilization and security.

## 📚 Table of Contents

- [Project Summary](#project-summary)
- [Prerequisites](#prerequisites)
- [Requirements](#requirements)
- [Setup & Run](#setup--run)
- [Environment Setup](#environment-setup)
- [API End Points](#api-end-points)
- [Languages & Tools](#languages--tools)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## 🛠️ Prerequisites

**Before you begin, make sure you have:**

- npm >= 10

---

## 📦 Requirements

- **Frontend**: React, Tailwind CSS, JavaScript
- **Routing**: React Router
- **Icons**: React Icons
- **Styling & UI:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: npm
- **HTTP Client:** Fetch API / Axios

---


## ⚙️ Setup & Run

Follow these steps to set up the project locally:

1. Clone the repository:

 bash
 git clone <repository-url>
 cd <repository-folder>

2. Install dependencies:

 bash
 npm install

3. Start the development server:

 bash
 npm run dev

4. Open the app in your browser at `http://localhost:5173/`.


5. If you want to run in another devices,use this:
 bash
 npm run dev -- --host
 
---

## Environment Setup

- npm install
- npm run dev

config file

```plaintext

const API_BASE_URL = "http://192.168.100.190:1011/api"


```

## API End Points

The frontend is currently configured to use:

- `API_BASE_URL`: `http://192.168.100.190:1011/api`

This is the backend routes currently consumed by the React app.

### Authentication

- `POST /Login_User`
- `POST /logout_User`

### Profile

- `GET /Profile`
- `POST /Edit_Profile`

### Dashboard

- `GET /Dashboard`

### Category

- `GET /Category_Asset`
- `GET /Get_One_Category`
- `POST /Create_Category`
- `GET /Get_all_Categories`
- `PAT /Update_Category`
- `DEL /Delete_Category`

### Asset

- `POST /Create_Asset`
- `GET /Get_All_Assets`
- `POST /Update_Asset`
- `DEL /Delete_Asset`
- `POST /Restore_Asset`

### Assignment

- `GET /Get_One_Assignment`
- `GET /Get_One_Asset`
- `GET /Get_All_Assignments`
- `POST /Release_an_Assignment`
- `PAT /Update_Assignment`
- `DEL /Delete_Assignment`
- `GET /Get_One_Employee_Assignment`
- `GET /Assignment_History`
- `POST /Create_an_Assignment`

### Maintenance

- `GET /Get_All_Maintenances`
- `GET /Get_One_Maintenance`
- `PAT /Update_Maintenance`
- `DEL /Delete_Maintenance`
- `POST /Maintenance_Request`
- `POST /Maintenance_Request_Cancel`
- `POST /Maintenance_Request_Approve`
- `GET /Get_One_Employee_Maintenance`
- `POST /Available_Asset`
- `POST /Reassign_Original_User`

### Expense

- `GET /Get_All_Expense`
- `POST /Create_a_Expense`
- `PAT /Update_Expense`
- `GET /Get_One_Expense`
- `DEL /Delete_Expense`
- `POST /Expense_Request`
- `POST /Expense_Request_Canceled`
- `POST /Expense_Request_Approve`
- `GET /Expense_Report`
- `GET /Get_Employee_Expense`

### Activity

- `GET /Activity_logs`

### User

- `POST /Suspend_Resigned_User`
- `GET /Get_All_Users`
- `POST /Create_User`
- `GET /GET_One_User`
- `PAT /Update_User`
- `DEL /Delete_User`

### Role

- `GET /Get_All_Permissions`
- `GET /Get_All_Roles`
- `POST /Create_Role`
- `GET /GET_One_Role`
- `PAT /Update_Role`
- `DEL /Delete_Role`

Note: this list is based on the endpoint paths referenced in the frontend source under `src/store` and related components.

---

## 💻 Languages & Tools

- Frontend: React, JavaScript, TailwindCSS

---

## Project Structure

```plaintext
IT Asset Management System

src/
├── components/ # Reusable components(e.g., Back button,Table)
├── features/ # features components
├── ui/ # ui components
├── context/ # Context components
├── hooks/ # Hooks components
├── layouts/ # Some of layout function
├── lib/ # Api URL
├── pages/ # Page components (e.g., Home,Login,etc..)
├── routes/ # router
├── main.jsx # Main app component

.idea/ # IDE-specific settings (ignored in `.gitignore`)
```

---

## Scripts

- Start Development Server:

 bash
 npm run dev
 

- Build for Production:

 bash
 npm run build
 

- Preview Production Build:

 bash
 npm run preview
 

- Lint Code:
 bash
 npm run lint
 
 ---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.

2. Create a new branch:
 bash
 git checkout -b feature/your-feature-name
 
3. Commit your changes:
 bash
 git commit -m "Add your message here"
 
4. Push to your branch:
 bash
 git push origin feature/your-feature-name
 
5. Open a pull request.

---

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.




