/**
 * 실패 시나리오
 * - 조작: /register 에서 이름 비움 / 지역 서울 / 직종 경비 / 경력 3 → 제출
 * - 기대: 이름 필드 위 빨간 에러 박스 표시 / seniors 테이블에 신규 레코드 없음
 */
import { test, expect } from '@playwright/test'
import { resetDB, countSeniors } from './helpers/db'

test.beforeEach(async () => {
  await resetDB()
})

test('필수 필드(이름) 누락 → 빨간 에러 박스 + DB 저장 차단', async ({ page }) => {
  // ── 1. DB 초기 행 수 확인 (reset 후 0건) ─────────────────────────
  const before = await countSeniors()
  expect(before).toBe(0)

  // ── 2. 이름 빈 채로 제출 ─────────────────────────────────────────
  await page.goto('/register')
  // 이름은 의도적으로 입력하지 않음

  await page.click('text=지역을 선택하세요')
  await page.click('[role="option"]:has-text("서울")')

  await page.click('text=희망 직종을 선택하세요')
  await page.click('[role="option"]:has-text("경비")')

  await page.fill('input[name="career_years"]', '3')
  await page.click('button[type="submit"]')

  // ── 3. 이름 필드 빨간 에러 박스 확인 ────────────────────────────
  await expect(page.locator('text=이름을 입력해 주세요')).toBeVisible({ timeout: 5_000 })

  // ── 4. 성공 박스 미노출 확인 ────────────────────────────────────
  await expect(page.locator('text=등록이 완료되었습니다')).not.toBeVisible()

  // ── 5. DB에 레코드가 들어가지 않았음 확인 ───────────────────────
  const after = await countSeniors()
  expect(after).toBe(0)
})
