#!/bin/sh
npx prisma generate
npx prisma migrate dev --name init || echo "Migration may have already been applied"
npx prisma db seed || echo "Seeding failed, but continuing with app startup"
exec npm run dev
