## DERKERK Shop (Next.js + Toss + Supabase)

Black/White 투톤 쇼핑몰 MVP입니다.

- 상품/주문 데이터: **Supabase(Postgres)**
- 결제: **토스페이먼츠 결제위젯 → 서버 Confirm 검증**
- 배포: **Vercel**
- 코드: **GitHub**

### 1) Supabase 준비

- Supabase 프로젝트 생성
- SQL Editor에서 `supabase.sql` 실행
- `products` 테이블에 `active=true` 상품을 넣으면 홈에 표시됩니다 (없으면 fallback 상품이 보입니다)

### 2) 환경변수 설정

- `.env.example` 를 `.env.local` 로 복사하고 값 채우기

필수:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용)
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`
- `TOSS_SECRET_KEY` (서버 전용)

### 3) 로컬 실행

```bash
npm run dev
```

`http://localhost:3000`

### 4) 결제 플로우

- 상품 담기 → `/cart`
- 체크아웃 생성: `POST /api/checkout/create` (Supabase에 pending 주문 저장)
- 결제위젯: `/checkout?orderId=...&amount=...`
- 성공 리다이렉트: `/pay/success?paymentKey=...&orderId=...&amount=...`
- 서버 승인/검증: `POST /api/toss/confirm` → Supabase 주문 `status=paid` 업데이트

### 5) Vercel 배포

- GitHub에 push 후 Vercel에서 Import
- Vercel 프로젝트 환경변수에 `.env.local` 값을 그대로 등록
- `NEXT_PUBLIC_SITE_URL` 는 배포 URL로 설정 권장


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
