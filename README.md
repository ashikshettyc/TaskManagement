# 📝 Task Management App

GitHub Repository:
[TaskManagement](https://github.com/ashikshettyc/TaskManagement)

Versel Live Link:
[TaskManagement](https://task-management-amber-sigma.vercel.app)

## 🚀 How to Run the App

### 👤 For User:

- Register or log in by providing a **username**, **email**, and **password**
- After logging in, users can:
  - ✅ Create tasks and submit them for approval
  - 📋 View all their created tasks in the **dashboard panel**
  - 📅 See tasks in **calendar format**
  - 👤 Edit their profile (update phone number and other details except for the
    role)

---

### 👑 For Admin:

**Admin Login Credentials:**

- **Name:** `admin`
- **Email:** `admin@example.com`
- **Password:** `admin123`

After logging in, admins can:

- ✅ Create tasks (auto-approved)
- ✔️ Approve or ❌ Reject submitted tasks by users
- 🗑️ Delete any task (approved, rejected, or submitted)
- 📅 View all tasks in **calendar format**
  - 🔍 On clicking a task, see additional task details
- 👤 Edit their own profile from the profile view

---

## 🛠️ Technologies Used

- **Next.js** – for both frontend and backend
- **Prisma ORM** – for database interaction
- **React Big Calendar** – for displaying tasks in calendar view
- **Cloudinary** – for image uploading and storage
