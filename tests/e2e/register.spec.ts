import { test, expect } from '@playwright/test'

// ── 테스트 1: 정상 등록 ───────────────────────────────────────────
test('정상 등록 → 성공 박스 표시', async ({ page }) => {
  await page.goto('/register')

  // 이름 입력
  await page.fill('input[name="name"]', '홍길동')

  // 지역 드롭다운 (shadcn Select)
  await page.click('text=지역을 선택하세요')
  await page.click('[role="option"]:has-text("서울")')

  // 희망 직종 드롭다운
  await page.click('text=희망 직종을 선택하세요')
  await page.click('[role="option"]:has-text("경비")')

  // 경력
  await page.fill('input[name="career_years"]', '5')

  // 제출
  await page.click('button[type="submit"]')

  // 성공 박스 확인
  await expect(page.locator('text=등록이 완료되었습니다')).toBeVisible({ timeout: 10_000 })
})

// ── 테스트 2: 필수 필드 누락 → 필드별 에러 박스 ─────────────────
test('필수 필드 누락 → 에러 박스 표시 + 저장 차단', async ({ page }) => {
  await page.goto('/register')

  // 이름만 입력, 지역·직종은 선택 안 함
  await page.fill('input[name="career_years"]', '0')
  await page.click('button[type="submit"]')

  // 이름 에러
  await expect(page.locator('text=이름을 입력해 주세요')).toBeVisible()
  // 지역 에러
  await expect(page.locator('text=지역을 선택해 주세요')).toBeVisible()
  // 직종 에러
  await expect(page.locator('text=희망 직종을 선택해 주세요')).toBeVisible()

  // 성공 박스는 없어야 함
  await expect(page.locator('text=등록이 완료되었습니다')).not.toBeVisible()
})
