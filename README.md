<div align="center">
   <!-- Optional: Add your logo here -->
   <!-- <img src="public/logo.svg" alt="Socially Logo" width="100" height="100"> -->
   <h1 align="center">Socially</h1>
   <p align="center">
      A modern, open-source social networking platform built with the latest web technologies.<br />
      <a href="https://github.com/tsgamage/Socially/issues">Report Bug</a>
      ·
      <a href="https://github.com/tsgamage/Socially/issues">Request Feature</a>
   </p>
</div>

<!-- SHIELDS -->
<div align="center">
   <a href="https://github.com/tsgamage/Socially/blob/main/LICENSE">
      <img src="https://img.shields.io/github/license/tsgamage/Socially?style=for-the-badge" alt="License">
   </a>
   <a href="https://github.com/tsgamage/Socially/stargazers">
      <img src="https://img.shields.io/github/stars/tsgamage/Socially?style=for-the-badge" alt="Stargazers">
   </a>
   <a href="https://github.com/tsgamage/Socially/network/members">
      <img src="https://img.shields.io/github/forks/tsgamage/Socially?style=for-the-badge" alt="Forks">
   </a>
   <a href="https://github.com/tsgamage/Socially/issues">
      <img src="https://img.shields.io/github/issues/tsgamage/Socially?style=for-the-badge" alt="Issues">
   </a>
</div>

---

## About The Project

![Socially App Showcase](https://placehold.co/600x100?text=Showcase+of+Socially+App+Features)

**Socially** is a feature-rich social media application designed to provide a seamless and engaging user experience. It's built with a modern tech stack, focusing on performance, scalability, and an excellent developer experience. This project serves as a comprehensive, real-world example of a full-stack application using Next.js, perfect for learning and as a foundation for your own social platform.

---

## Key Features

- **Authentication**: Secure sign-up, login, and session management with **Clerk**
- **Interactive User Profiles**: Customizable profiles with avatars, cover photos, and user bios
- **Posts Feed**: A scrollable feed displaying posts from the community
- **Post Creation**: Create and share posts with text and up to 4 images
- **Engaging Interactions**: Like, comment, and save posts
- **Notifications**: Notifications for likes, comments, and new followers
- **Friends System**: Send/accept friend requests, follow/unfollow users
- **Explore Page**: Discover trending and new posts
- **Responsive & Modern UI**: Beautifully designed with **Tailwind CSS** and **DaisyUI**

---

## Tech Stack

This project is built with a modern, full-stack JavaScript setup:

| Technology                                                                                                                     | Description                               |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)                       | Full-Stack React Framework for Production |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)                            | A JavaScript library for building UIs     |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)              | Typed JavaScript at Any Scale             |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)         | A utility-first CSS framework             |
| ![DaisyUI](https://img.shields.io/badge/DaisyUI-4B286D?style=for-the-badge&logo=daisyui&logoColor=white)                       | Tailwind CSS UI Component Library         |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)                    | MongoDB ODM for Node.js                   |
| ![Clerk](https://img.shields.io/badge/Clerk-3B82F6?style=for-the-badge&logo=clerk&logoColor=white)                             | Authentication & User Management          |
| ![@tanstack/react-query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) | Data Fetching & Caching                   |
| ![ImageKit](https://img.shields.io/badge/ImageKit-00BFFF?style=for-the-badge&logo=imagekit&logoColor=white)                    | Image Uploads & CDN                       |
| ![date-fns](https://img.shields.io/badge/date--fns-007ACC?style=for-the-badge&logo=date-fns&logoColor=white)                   | Date Formatting Utilities                 |
| ![Lucide React](https://img.shields.io/badge/Lucide-000?style=for-the-badge&logo=lucide&logoColor=white)                       | Icon Library                              |
| ![React Hot Toast](https://img.shields.io/badge/React_Hot_Toast-FFB300?style=for-the-badge&logo=react&logoColor=white)         | Toast Notifications                       |
| ![Emoji Picker](https://img.shields.io/badge/Emoji_Picker-FFD700?style=for-the-badge&logo=emoji&logoColor=white)               | Emoji Support                             |

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your development machine:

- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB (local or cloud)

### Installation

1.  **Clone the repository**

    ```sh
    git clone https://github.com/tsgamage/Socially.git
    cd Socially
    ```

2.  **Install dependencies**

    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables**

    Copy `.env` to `.env.local` and update values as needed:

    ```sh
    cp .env .env.local
    ```

    Set your MongoDB URI, Clerk keys, and ImageKit credentials in `.env.local`.

4.  **Run the development server**
    ```sh
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

The following variables are required (see `.env`):

- `MONGO_URI` — MongoDB connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` — Clerk authentication keys
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` — ImageKit credentials
- `NEXT_PUBLIC_SITE_URL` — Site URL

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint

---

## Roadmap

We have a lot of exciting features planned! Here's a glimpse of what's next:

- [ ] Direct Messaging (Real-time Chat)
- [ ] Group & Community Creation
- [ ] Advanced Search Functionality
- [ ] Light/Dark Mode Toggle
- [ ] More OAuth Providers (Google, Twitter, etc.)

See the [open issues](https://github.com/tsgamage/Socially/issues) for a full list of proposed features (and known issues).

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

We recommend creating a `CONTRIBUTING.md` file for more detailed guidelines.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Contact

@tsgamage - dev.tsgamage@gmail.com

Project Link: https://github.com/tsgamage/Socially
