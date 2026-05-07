/**
 * 정상 시나리오
 * - 사전 조건: jobs에 "서울 / 경비 / 요구경력 3년" 공고 1건
 * - 조작: /register 에서 "테스트시니어 / 서울 / 경비 / 경력 5년" 등록
 * - 기대: 성공 초록 박스 + /recommendations 에서 6점 금색 배지 카드 표시
 */
import { test, expect } from '@playwright/test'
import { resetDB, insertJob, getSeniorIdByName } from './helpers/db'

test.beforeEach(async () => {
  await resetDB()
  await insertJob({ title: '서울 경비 테스트 공고', region: '서울', job_type: '경비', required_career: 3 })
})

test('정상 등록 → 성공 박스 → 6점 금색 배지 추천 카드', async ({ page }) => {
  // ── 1. 프로필 등록 ──────────────────────────────────────────────
  await page.goto('/register')
  await page.fill('input[name="name"]', '테스트시니어')

  await page.click('text=지역을 선택하세요')
  await page.click('[role="option"]:has-text("서울")')

  await page.click('text=희망 직종을 선택하세요')
  await page.click('[role="option"]:has-text("경비")')

  await page.fill('input[name="career_years"]', '5')
  await page.click('button[type="submit"]')

  // ── 2. 성공 박스 확인 ────────────────────────────────────────────
  await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible({ timeout: 10_000 })

  // ── 3. DB에서 방금 생성된 senior_id 조회 ─────────────────────────
  const seniorId = await getSeniorIdByName('테스트시니어')
  expect(seniorId).toBeTruthy()

  // ── 4. 추천 목록 — 6점 금색 배지 카드가 최상단 ───────────────────
  await page.goto(`/recommendations?senior_id=${seniorId}`)
  // 6점 배지: ScoreBadge 가 bg-yellow-100 클래스 + "6점" 텍스트 렌더링
  const goldBadge = page.locator('.bg-yellow-100').first()
  await expect(goldBadge).toBeVisible({ timeout: 10_000 })
  await expect(goldBadge).toContainText('6점')
})
