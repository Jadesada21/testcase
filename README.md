# Cinema Booking System 🎬

ระบบจองที่นั่งโรงหนัง สร้างด้วย NestJS + React + MongoDB + Redis
รองรับการจองแบบ real-time ผ่าน WebSocket และป้องกัน race condition ด้วย Distributed Lock

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS (TypeScript) |
| Frontend | React (TypeScript) + Vite |
| Database | MongoDB (Mongoose) |
| Cache / Lock | Redis (ioredis) |
| Realtime | WebSocket (Socket.io) |
| Auth | Firebase Auth (Google OAuth) + JWT |
| State Management | TanStack Query |
| Deployment | Docker + docker-compose |

---

## Features

- เข้าสู่ระบบด้วย Google Account ผ่าน Firebase Auth
- ดูที่นั่งแบบ real-time — ทุก client เห็นสถานะพร้อมกันทันที
- จองที่นั่งพร้อม lock 5 นาที ถ้าไม่จ่ายเงินจะคืนที่นั่งอัตโนมัติ
- ป้องกัน race condition ด้วย Redis Distributed Lock
- หน้า Admin สำหรับดู bookings และ audit logs ทั้งหมด

---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) + Docker Compose
- Firebase Project (สำหรับ Google OAuth)
- Node.js v22+ (ถ้าจะรัน dev mode)

### 1. Clone โปรเจกต์

```bash
git clone https://github.com/your-username/cinema-booking.git
cd cinema-booking
```

### 2. ตั้งค่า Environment Variables

**Backend** — สร้างไฟล์ `backend/.env`

```env
MONGODB_URI=mongodb://mongo:27017/cinema-booking
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your_secret_key_here
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nxxxxxx\n-----END PRIVATE KEY-----\n"
NODE_ENV=production
```

**Frontend** — สร้างไฟล์ `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

> Firebase credentials ดูได้จาก Firebase Console → Project Settings

### 3. รันด้วย Docker

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3000 |

### 4. Seed ที่นั่ง

หลัง backend รันขึ้นมาแล้ว ให้ seed ที่นั่ง 50 ที่ (A1–E10) ก่อน 1 ครั้ง

```powershell
Invoke-RestMethod -Method POST http://localhost:3000/seats/seed
```

---

## Booking Flow

```
1. กดจองที่นั่ง
   → Redis lock ที่นั่งนั้น 5 นาที
   → ทุก client เห็นสถานะ LOCKED ทันที (WebSocket)

2. กดจ่ายเงิน (ภายใน 5 นาที)
   → สถานะเปลี่ยนเป็น BOOKED

3. หมดเวลา (ไม่จ่ายใน 5 นาที)
   → ระบบคืนที่นั่งอัตโนมัติ → กลับเป็น AVAILABLE
```

---

## Seat Colors

| สี | ความหมาย |
|---|---|
| 🟢 เขียว | AVAILABLE — คลิกเพื่อจอง |
| 🟡 เหลือง | LOCKED (คนอื่นจอง) |
| 🩷 ชมพู | LOCKED (ของเรา) — คลิกเพื่อจ่ายเงิน |
| 🔴 แดง | BOOKED (ของเรา) |
| ⚪ ขาว | BOOKED (คนอื่น) |

---

## Admin Panel

เข้าหน้า `/admin` ได้หลังจากตั้ง role เป็น ADMIN ใน MongoDB

```js
// รันใน mongosh
db.users.updateOne(
  { email: "your-email@gmail.com" },
  { $set: { role: "ADMIN" } }
)
```

จากนั้น logout → login ใหม่ แล้วเข้า `http://localhost:5173/admin`

---

## API Endpoints

### Auth
| Method | URL | Body |
|---|---|---|
| POST | `/auth/login` | `{ "idToken": "<Firebase idToken>" }` |

### Seats
| Method | URL | หมายเหตุ |
|---|---|---|
| POST | `/seats/seed` | สร้างที่นั่ง 50 ที่ |
| GET | `/seats` | ดูที่นั่งทั้งหมด |
| GET | `/seats/:seatNumber` | ดูที่นั่งเดียว |

### Bookings (ต้องใช้ JWT)
| Method | URL | หมายเหตุ |
|---|---|---|
| POST | `/bookings` | `{ "seatNumber": "A1" }` |
| PATCH | `/bookings/:id/confirm` | ยืนยันการจ่ายเงิน |
| GET | `/bookings/my` | ดู booking ของตัวเอง |

### Admin (ต้องใช้ JWT + Role ADMIN)
| Method | URL | Query Params |
|---|---|---|
| GET | `/admin/bookings` | `?status=&seatNumber=&userId=` |
| GET | `/admin/audit-logs` | `?event=` |

> Postman Collection อยู่ที่ `postman/` — import ทั้ง collection และ environment เข้า Postman แล้วกรอก email/password ได้เลย

---

## Load Testing (K6)

```bash
k6 run k6/test.js
```

```env
# SKIP_AUTH=true
# TEST_USER_ID=656b9f2c8f1c2a001c9d1234
```

****หลังจาก test เสร็จให้ ลบ หรือ comment ไว้ด้วย

ทดสอบ POST `/bookings` พร้อม check status 201 และ response มี booking field


---

## Project Structure

```
cinema-booking/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
├── frontend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
├── k6/
│   └── test.js
└── postman/
    ├── cinema-booking.postman_collection.json
    └── cinema-booking.postman_environment.json
```

---

## Dev Mode (ไม่ใช้ Docker)

```bash
# Terminal 1
mongod --dbpath /data/db

# Terminal 2
redis-server

# Terminal 3 (ใน backend/)
npm run start:dev

# Terminal 4 (ใน frontend/)
npm run dev
```

> เปลี่ยน `MONGODB_URI` เป็น `mongodb://localhost:27017/cinema-booking` และ `REDIS_HOST` เป็น `localhost`
