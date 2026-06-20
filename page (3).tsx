{
  "name": "revisio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "@supabase/supabase-js": "^2.46.0",
    "@supabase/ssr": "^0.5.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
    "lucide-react": "^0.460.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/node": "^22.9.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^3.4.14",
    "postcss": "^8.4.49",
    "autoprefixer": "^10.4.20"
  }
}
