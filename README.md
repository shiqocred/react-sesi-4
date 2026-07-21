# Sesi 4 — Portal Review Pengajuan Rekening

Project ini adalah studi kasus Next.js untuk portal internal review pengajuan rekening.

Fitur utama:

- Login petugas.
- Protected route untuk `/applications` dan `/applications/[id]`.
- Context API untuk filter status pengajuan.
- Dynamic route detail pengajuan.
- API `/api/login`, `/api/me`, dan `/api/logout` memakai Bearer token untuk validasi session.
- Database PostgreSQL menggunakan Drizzle ORM.
- Hash password menggunakan Argon2.
- ID user/session menggunakan CUID2.

## 1. Install dependency

Project ini menggunakan Bun.

```bash
bun install
```

## 2. Siapkan environment

Buat file `.env` dari `.env.example`.

```bash
cp .env.example .env
```

Isi contoh:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/sesi4"
API_URL="http://localhost:3000/api"
CORS_ORIGINS="*"
```

Keterangan:

- `DATABASE_URL` wajib diisi sesuai database PostgreSQL lokal kamu.
- `API_URL` digunakan oleh `auth()` untuk memanggil endpoint `/me`.
- `CORS_ORIGINS="*"` membuat API bisa diakses dari semua origin. Mode ini cocok untuk Bearer token dan tidak mengirim `Access-Control-Allow-Credentials`.

## 3. Siapkan database PostgreSQL

Pastikan PostgreSQL sudah berjalan dan database sudah dibuat, misalnya database bernama `sesi4`.

Contoh jika memakai `psql`:

```bash
createdb sesi4
```

Lalu push schema Drizzle ke database:

```bash
bun run db:push
```

## 4. Jalankan seeder account dummy

Seeder akan membuat 2 akun dummy:

```txt
admin@example.com / password123
staff@example.com / password123
```

Jalankan:

```bash
bun run db:seed
```

## 5. Jalankan development server

```bash
bun run dev
```

Buka:

```txt
http://localhost:3000
```

Untuk langsung ke portal:

```txt
http://localhost:3000/applications
```

Jika belum login, user akan diarahkan ke halaman login.

## 6. Akses API dari web/frontend lain

Jika frontend berjalan di origin berbeda, misalnya:

```txt
http://localhost:3001
```

pastikan `.env` mengizinkan semua origin:

```env
CORS_ORIGINS="*"
```

Contoh fetch dari frontend lain:

```ts
const response = await fetch("http://localhost:3000/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "staff@example.com",
    password: "password123",
  }),
});

const data = await response.json();

const meResponse = await fetch("http://localhost:3000/api/me", {
  headers: {
    Authorization: `Bearer ${data.accessToken}`,
  },
});
```

Untuk cross-origin API, gunakan Bearer token dari response login. Request dari web lain tidak perlu cookie dan tidak perlu `credentials: "include"`.

## 7. Cara memakai API Bearer token

Login API bersifat JSON-only dan tidak mengirim `Set-Cookie`. Halaman login internal menyimpan `accessToken` ke cookie `session` memakai dependency `next-cookie` agar `proxy.ts` tetap bisa melindungi route `/applications`.

Contoh request manual:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"staff@example.com","password":"password123"}'
```

Gunakan token dari response sebagai Bearer token:

```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer TOKEN_DARI_LOGIN"
```

Logout juga bisa memakai Bearer token:

```bash
curl -X POST http://localhost:3000/api/logout \
  -H "Authorization: Bearer TOKEN_DARI_LOGIN"
```

## 8. Cara mencoba fitur

1. Buka `/applications`.
2. Login dengan akun dummy:

   ```txt
   staff@example.com
   password123
   ```

3. Setelah login, halaman daftar pengajuan akan tampil.
4. Klik filter status: `Semua`, `Menunggu`, `Disetujui`, atau `Ditolak`.
5. Ringkasan dan daftar akan ikut berubah karena memakai Context yang sama.
6. Klik `Lihat Detail` untuk membuka dynamic route `/applications/[id]`.

## Script tersedia

```bash
bun run dev          # menjalankan development server
bun run build        # build production
bun run start        # menjalankan hasil build
bun run lint         # menjalankan ESLint
bun run db:generate  # generate migration Drizzle
bun run db:push      # push schema ke database
bun run db:studio    # membuka Drizzle Studio
bun run db:seed      # membuat account dummy
```

## File penting

```txt
app/applications/page.tsx                 # halaman daftar protected
app/applications/[id]/page.tsx            # halaman detail dynamic route
app/applications/_context/                # Context filter status
app/applications/_components/             # komponen filter, summary, list
app/api/login/route.ts                    # API login
app/api/me/route.ts                       # API cek session
app/login/page.tsx                        # halaman login
app/login/_components/login-form.tsx      # form react-hook-form + zod
db/schema.ts                              # schema Drizzle
lib/auth.ts                               # helper auth server-only
lib/db.ts                                 # koneksi Drizzle PostgreSQL
proxy.ts                                  # protected route awal membaca cookie yang dibuat client
scripts/seed.ts                           # seeder account dummy
```

## Catatan

- File `.env` tidak disediakan langsung karena biasanya berisi konfigurasi lokal atau secret.
- Jika login gagal, pastikan `DATABASE_URL` benar, `bun run db:push` sudah dijalankan, dan akun dummy sudah dibuat dengan `bun run db:seed`.
