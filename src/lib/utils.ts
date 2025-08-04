import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return ''

  return process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"
}
