const REGION_MAP: Record<string, string> = {
  서울특별시: '서울', 서울시: '서울', 서울: '서울',
  경기도: '경기',    경기:   '경기',
  인천광역시: '인천', 인천시: '인천', 인천: '인천',
}

const VALID_REGIONS = new Set(['서울', '경기', '인천', '기타'])

/** 자유 입력된 지역명을 4개 표준값으로 정규화 */
export function normalizeRegion(raw: string): string {
  const trimmed = raw.trim()
  if (REGION_MAP[trimmed]) return REGION_MAP[trimmed]
  if (VALID_REGIONS.has(trimmed)) return trimmed
  return '기타'
}

const JOB_MAP: Record<string, string> = {
  '경비·보안': '경비', 경비보안: '경비', 경비: '경비',
  '청소·위생': '청소', 청소위생: '청소', 청소: '청소',
  '조리·식품': '조리', 조리식품: '조리', 조리: '조리',
  '복지·돌봄': '돌봄', 복지돌봄: '돌봄', 돌봄: '돌봄',
}

const VALID_JOBS = new Set(['경비', '청소', '조리', '돌봄', '기타'])

/** 자유 입력된 직종명을 5개 표준값으로 정규화 */
export function normalizeJobType(raw: string): string {
  const trimmed = raw.trim()
  if (JOB_MAP[trimmed]) return JOB_MAP[trimmed]
  if (VALID_JOBS.has(trimmed)) return trimmed
  return '기타'
}
