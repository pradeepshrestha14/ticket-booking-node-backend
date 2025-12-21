#!/bin/sh
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
exec npm run dev
