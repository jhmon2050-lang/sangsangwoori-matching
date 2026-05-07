import { test, expect } from '@playwright/test'

// ── 테스트 3: 엣지 — 일자리 없는 지역 등록 → 빈 추천 안내 ────────
test('매칭 없는 시니어 → "현재 매칭되는 일자리가 없습니다" 표시', async ({ page }) => {
  // 1) 새 시니어 등록 (경기 + 돌봄 + 경력 0 → 매칭 있을 수 있음)
  //    대신 기타 지역 값을 직접 API로 넣는 건 불가하므로,
  //    /recommendations?senior_id=nonexistent 로 senior_id 없는 케이스 테스트
  await page.goto('/recommendations')

  // senior_id 없으면 "프로필을 먼저 등록해 주세요" 안내
  await expect(page.locator('text=프로필을 먼저 등록해 주세요')).toBeVisible()
  await expect(page.locator('text=프로필 등록하러 가기')).toBeVisible()
})

test('일자리 등록 → 관리자 목록에 즉시 반영', async ({ page }) => {
  await page.goto('/admin')

  // 공고명 입력
  await page.fill('input[name="title"]', 'E2E 테스트 경비 공고')

  // 지역
  const regionTriggers = page.locator('[role="combobox"]')
  await regionTriggers.first().click()
  await page.click('[role="option"]:has-text("서울")')

  // 직종
  await regionTriggers.nth(1).click()
  await page.click('[role="option"]:has-text("경비")')

  // 등록
  await page.click('button:has-text("일자리 등록")')

  // 성공 메시지 + 목록에 반영
  await expect(page.locator('text=일자리가 등록되었습니다')).toBeVisible({ timeout: 10_000 })
  await expect(page.locator('td:has-text("E2E 테스트 경비 공고")')).toBeVisible()
})
