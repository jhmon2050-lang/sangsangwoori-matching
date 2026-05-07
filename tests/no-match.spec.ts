/**
 * 엣지 시나리오 — 매칭 없음
 * - 사전 조건: "기타 / 기타 / 요구경력 4년" 공고 1건
 *   ※ 스펙 원문은 요구경력 0이지만, 경력 3년 시니어가 0년 요구 공고를 만나면
 *      경력 충족 +1점이 붙어 match 레코드가 생깁니다.
 *      "절대 안 맞는" 0점 보장을 위해 요구경력을 4로 설정합니다.
 *      (지역 0 + 직종 0 + 경력 3<4 → 0 = 총 0점 → 저장 안 됨)
 *
 * - 조작: "서울 / 경비 / 경력 3" 시니어 등록 → /recommendations 접속
 * - 기대: "현재 매칭되는 일자리가 없습니다" 안내 박스 표시
 */
import { test, expect } from '@playwright/test'
import { resetDB, insertJob, getSeniorIdByName } from './helpers/db'

test.beforeEach(async () => {
  await resetDB()
  await insertJob({ title: '기타 공고 (매칭 불가)', region: '기타', job_type: '기타', required_career: 4 })
})

test('매칭 0점 시니어 → "현재 매칭되는 일자리가 없습니다" 안내 박스', async ({ page }) => {
  // ── 1. 시니어 등록 ───────────────────────────────────────────────
  await page.goto('/register')
  await page.fill('input[name="name"]', '테스트노매치')

  await page.click('text=지역을 선택하세요')
  await page.click('[role="option"]:has-text("서울")')

  await page.click('text=희망 직종을 선택하세요')
  await page.click('[role="option"]:has-text("경비")')

  await page.fill('input[name="career_years"]', '3')
  await page.click('button[type="submit"]')

  await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible({ timeout: 10_000 })

  // ── 2. 추천 페이지 접속 ─────────────────────────────────────────
  const seniorId = await getSeniorIdByName('테스트노매치')
  await page.goto(`/recommendations?senior_id=${seniorId}`)

  // ── 3. 빈 매칭 안내 박스 확인 ───────────────────────────────────
  await expect(
    page.locator('text=현재 매칭되는 일자리가 없습니다')
  ).toBeVisible({ timeout: 10_000 })
})
