import { defineConfig, devices } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

// .env.local → process.env (워커 프로세스까지 전파됨)
try {
  const envPath = path.join(process.cwd(), '.env.local')
  fs.readFileSync(envPath, 'utf-8')
    .split('\n')
    .forEach(line => {
      const eq = line.indexOf('=')
      if (eq > 0 && !line.startsWith('#')) {
        const key = line.slice(0, eq).trim()
        const val = line.slice(eq + 1).trim()
        if (key && !process.env[key]) process.env[key] = val
      }
    })
} catch { /* .env.local 없으면 CI 환경변수 사용 */ }

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: 0,
  // 단일 워커로 직렬 실행 — beforeEach DB 리셋 시 충돌 방지
  workers: 1,
  fullyParallel: false,

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },

  // 테스트 실행 시 dev 서버 자동 기동
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,   // 이미 3000이 떠 있으면 재사용
    timeout: 120_000,
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
