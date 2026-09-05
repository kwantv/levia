<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — Levia Website (Next.js)

> File này là nguồn thông tin duy nhất (single source of truth) cho AI coding agent (Claude Code, Cursor, Copilot Workspace, v.v.) và dev khi làm việc trong repo Next.js của website Levia. Đọc file này trước khi sinh code, viết nội dung, hoặc chỉnh sửa cấu trúc trang.

## 1. Tóm tắt dự án

- **Sản phẩm:** Website thương hiệu Levia (bếp từ), phạm vi toàn quốc, đối tượng B2C.
- **Vai trò site:** Catalog điện tử xây dựng thương hiệu + điều hướng khách ra hệ thống đại lý offline.
- **KHÔNG có:** thương mại điện tử, giỏ hàng, thanh toán online. Mọi CTA sản phẩm dẫn về "Tìm đại lý" hoặc form thu lead (tên/SĐT/khu vực).
- **Tham chiếu định hướng:** junger.vn (tinh thần Đức, cao cấp) — nhưng Levia khác biệt bằng mũi nhọn AI + chuyên biệt món Việt, **không** cạnh tranh câu chuyện "Đức" (xem Mục 5 — ràng buộc pháp lý, quan trọng).
- **Khách hàng mục tiêu:** Gia đình trẻ mới lập gia đình, mê công nghệ, thu nhập ~40 triệu/tháng/hộ, sống trung tâm huyện/thành phố.
- **Sản phẩm hero:** Bếp từ đôi **LV79DI**.

## 2. Định vị & thông điệp (không được diễn giải lại tuỳ ý)

**Định vị một câu (đã duyệt):**

> Levia là bếp từ thế hệ AI, thiết kế tinh gọn theo thẩm mỹ châu Âu, làm ra để nấu chuẩn vị Việt — dành cho gia đình trẻ mê công nghệ.

**Tagline chính (gắn logo):** "Thông minh từ bên trong." **Dòng chiến dịch (Recipes / truyền thông):** "Hiểu căn bếp Việt."

**Ba trụ thông điệp** — dùng nhất quán trong copy, IA, và nội dung SEO/GEO:

| Trụ | Nội dung |
| --- | --- |
| Trí tuệ — Thiết kế bằng AI | Bố cục vùng nấu & trải nghiệm tối ưu từ dữ liệu thói quen nấu; menu tự động, inverter tiết kiệm ~30%, nhận diện nồi |
| Vị Việt — Nấu đúng cách người Việt (**trụ khác biệt lõi**) | Liu riu ổn định cho món kho, Turbo cho món xào, menu lẩu; mâm từ chống nồm ẩm |
| Tinh gọn — Thẩm mỹ châu Âu | Viền inox, mặt kính ceramic, đen–ánh kim, tối giản; sang mà không phô |

**Câu chuyện thương hiệu ("Về chúng tôi") — dùng NGUYÊN VĂN, không paraphrase:**

> Levia ra đời từ một câu hỏi đơn giản: một chiếc bếp từ sẽ như thế nào nếu được thiết kế bằng chính dữ liệu về cách con người nấu ăn?
>
> Chúng tôi ứng dụng AI để phân tích thói quen nấu nướng thực tế, từ đó tinh chỉnh từng vùng nhiệt, từng thao tác điều khiển — để chiếc bếp phản hồi đúng như phản xạ của người đứng bếp. Thiết kế theo tinh thần tối giản châu Âu: viền inox, mặt kính ceramic, tông đen ánh kim sang trọng mà không phô trương.
>
> Nhưng điều Levia tự hào nhất là hiểu căn bếp Việt. Chế độ liu riu ổn định để kho cá không cháy đáy, công suất Turbo cho chảo xào bốc lửa, menu tự động cho nồi lẩu sum vầy, mâm từ phủ hai lớp chống nồm ẩm hợp khí hậu nhiệt đới. Mỗi chi tiết được làm ra cho bữa cơm Việt, cho gian bếp của những gia đình trẻ đang dựng xây tổ ấm đầu tiên.
>
> Levia — thông minh từ bên trong, để mỗi ngày vào bếp là một ngày dễ dàng và trọn vẹn hơn.

Agent chỉ dùng đoạn trên nguyên văn trên trang `/about`; ở nơi khác chỉ được trích hoặc diễn giải ngắn, không sáng tác thêm claim mới.

## 3. Design system — shadcn/ui (đã cấu hình)

Theme đã cấu hình trong `app/globals.css` (Tailwind v4, `@theme inline` + shadcn tokens, light/dark qua class `.dark`) và font trong `app/layout.tsx` (`next/font/google`). Agent **PHẢI** dùng đúng token/class dưới đây — không viết hex/oklch trực tiếp trong component, không dùng arbitrary value cho màu/radius/font trong class Tailwind (cấm `bg-[#...]`, `text-[15px]`, `rounded-[6px]`, `style={{ color: ... }}`), không tạo token màu mới ngoài những gì đã có trong `globals.css`.

### Color tokens (dùng qua class Tailwind, không đọc CSS var trực tiếp trong component)

| Việc cần | Class Tailwind |
| --- | --- |
| Nền trang / chữ chính | `bg-background` / `text-foreground` |
| Card, block nội dung | `bg-card` / `text-card-foreground` |
| Popover, dropdown, menu | `bg-popover` / `text-popover-foreground` |
| Nút chính / điểm nhấn (vàng ánh kim) | `bg-primary` / `text-primary-foreground` |
| Nút phụ | `bg-secondary` / `text-secondary-foreground` |
| Vùng nhấn nhẹ (hover state, badge) | `bg-accent` / `text-accent-foreground` |
| Chữ mô tả, chú thích | `text-muted-foreground`, nền liên quan `bg-muted` |
| Trạng thái lỗi/cảnh báo | `bg-destructive` |
| Viền, input, focus ring | `border-border`, `border-input`, `ring-ring` |
| Biểu đồ (chỉ khi có data-viz) | `chart-1` … `chart-5` (đã map sẵn trong theme) |

`primary` và `accent` đã được set là **vàng ánh kim** (`oklch(0.852 0.199 91.936)` ở light, `oklch(0.795 0.184 86.047)` ở dark) — đúng tinh thần thương hiệu, dùng thẳng không cần chỉnh. Không thêm màu vàng/gold nào khác ngoài token này. `sidebar-*` tokens có tồn tại trong theme nhưng site marketing công khai này không có admin/dashboard — bỏ qua, không dùng trừ khi phạm vi dự án mở rộng.

### Dark mode — mặc định BẬT ✅

Site hiển thị **nền tối làm mặc định**, đúng tinh thần tối giản/sang trọng, không phô. `globals.css` đã có đủ block `.dark { ... }` và `app/layout.tsx` **đã gắn class `dark` vào `<html>`**.

- Nếu về sau cần cho user đổi theme, dùng `next-themes` với `defaultTheme="dark"` — không tự viết logic toggle riêng.

### Typography

Ba biến font đã cấu hình sẵn qua `next/font/google` trong `layout.tsx`, expose bằng CSS var và map trong `@theme inline`:

| Class Tailwind | Font thật | Dùng cho |
| --- | --- | --- |
| `font-sans` | Geist | Mặc định cho toàn bộ body/UI text (đã set sẵn ở `<html>` qua `@layer base`) |
| `font-heading` | Instrument Serif (weight 400) | Headline lớn — H1 hero, tiêu đề section, tiêu đề nhấn; chất serif mảnh, hợp tinh thần Quiet Luxury/editorial |
| `font-mono` | Geist Mono | Chỉ dùng cho số liệu kỹ thuật cần căn cột (bảng thông số sản phẩm), không dùng cho copy thường |

Chỉ dùng ba class trên, không import font khác, không set `font-family` inline.

⚠️ **Cần dev xác nhận trước khi viết nhiều nội dung tiếng Việt:** cấu hình hiện tại chỉ khai báo `subsets: ['latin']` cho cả ba font. Nội dung site chủ yếu tiếng Việt có dấu — cần kiểm tra các font này (đặc biệt Instrument Serif) có phủ đủ ký tự tiếng Việt hay không; nếu thiếu dấu khi render, bổ sung subset phù hợp hoặc đổi font heading/body sang lựa chọn hỗ trợ tiếng Việt tốt hơn.

### Radius — ZERO (sharp/blocky)

`--radius` đã được set về `0` trong `globals.css`. Mọi component phải có góc vuông, sắc cạnh — **KHÔNG dùng bất kỳ class `rounded-*` nào** (`rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, v.v.). Shadcn component đã tự kế thừa `--radius: 0` nên hiển thị đúng mà không cần can thiệp. Nếu agent thấy `rounded-*` trong code cũ, xoá đi. Phong cách thiết kế là **sharp, blocky, industrial** — phù hợp tinh thần tối giản, không bo tròn mềm mại.

### Component

Ưu tiên dùng nguyên trạng shadcn component (`Button`, `Card`, `Badge`, `Table`, `Input`, `Select`, `Sheet`, `NavigationMenu`, `Dialog`, `Tabs`, v.v.) và các `variant`/`size` có sẵn thay vì tự viết style riêng. Chỉ compose/wrap component, không override bằng inline style hay class tuỳ ý.

**Đã cài:** `Button`, `Badge`, `Card`, `Table` (shadcn v4).

### Workflow cho agent

- **KHÔNG chạy `next build` sau mỗi thay đổi nhỏ.** Chỉ build khi cần xác nhận trước deploy hoặc khi nghi ngờ lỗi nghiêm trọng. Dùng IDE diagnostics (TypeScript/ESLint) để bắt lỗi nhanh thay vì full build.

### Tránh tuyệt đối

Gradient loè loẹt, hiệu ứng neon/sci-fi — dù nằm trong giới hạn token vẫn khiến brand "rẻ", không phù hợp định hướng thiết kế.

### Ảnh

Ưu tiên render/ảnh thật độ phân giải cao, nền tối, bố cục thoáng. Không dùng ảnh nền sáng/rực rỡ kiểu poster mạng xã hội.

## 4. Chiến lược nội dung & GEO/AEO (áp dụng cho MỌI trang nội dung)

**Mục tiêu:** để AI (Gemini, ChatGPT, Claude, Google AI Overview) trích dẫn Levia trung thực khi người dùng hỏi về nấu món Việt bằng bếp từ.

Quy tắc bắt buộc khi agent sinh nội dung trang/bài viết:

1. **Khối trả lời đầu bài 40–60 chữ** ngay sau H1 — đủ ngắn để AI trích nguyên khối.
2. **Tiêu đề dạng câu hỏi người dùng thật sự gõ** (vd: "bếp từ có kho cá được không"), không giật tít.
3. Dùng **số liệu/danh sách cụ thể, đúng sự thật** — không làm tròn/thổi phồng.
4. Gắn **structured data** phù hợp (xem Mục 8).
5. Có **ngày đăng/cập nhật + tên tác giả**; nội dung cần rà làm mới theo quý (thiết kế field `publishedAt`/`updatedAt`/`author` trong CMS/schema).
6. **KHÔNG** claim so sánh tuyệt đối chưa chứng minh được (vd "bền nhất", "tốt nhất").

**Off-site (ngoài phạm vi code nhưng cần biết):** Google Business Profile từng đại lý, review Shopee/Lazada/Tiki, KOL YouTube/TikTok, nhóm Facebook — site cần hỗ trợ hiển thị/đồng bộ dữ liệu này (vd sao Google trên trang đại lý), không tự bịa số liệu.

## 5. Ràng buộc pháp lý — BẮT BUỘC tuân thủ trong mọi copy & UI text

Sản phẩm sản xuất tại Trung Quốc, có CO/CQ tại Việt Nam, **không có** pháp nhân/nhà máy Đức. Vi phạm có thể bị phạt hành chính 60–80 triệu đồng (tổ chức thường cao hơn).

**✅ Được dùng:**

- "Tinh thần / thẩm mỹ tối giản châu Âu", "chuẩn thẩm mỹ châu Âu" — chỉ mô tả CÁCH thiết kế.
- "Đạt chuẩn CE", tên linh kiện thật (vd kính Eurokera) — **chỉ khi đúng và có giấy tờ xác nhận** (xem Mục 9, còn đang chờ chốt).
- Số liệu kỹ thuật thật, CO/CQ, bảo hành chính hãng.

**❌ Cấm tuyệt đối — agent phải chặn/flag nếu thấy trong nội dung hoặc asset:**

- Cờ Đức dùng như tem xuất xứ.
- "Thương hiệu Đức", "sản xuất tại Đức / bằng công nghệ Đức", "nhập khẩu Đức".
- Mọi từ so sánh tuyệt đối không chứng minh được ("bền nhất", "tốt nhất"...).

Nếu agent cần sinh copy marketing, viết theo đúng khung Mục 2 & 5; không tự thêm claim nguồn gốc/xuất xứ.

## 6. Sitemap & routes

**Menu chính:** About · Product · Agency · Cook Now · Article **CTA nổi bật riêng trên menu:** "Cook Now" (dùng token `primary` của shadcn cho nút nhấn, không hardcode màu)

> Dùng "Cook Now" làm CTA nổi bật trên menu, trỏ về `/cook`. Route là `/cook` và `/cook/[slug]`.

| Trang | Route | Mục đích / CTA chính |
| --- | --- | --- |
| Trang chủ | `/` | Hero LV79DI + AI → "Tìm đại lý gần bạn"; bao gồm section Technology (nội dung cũ của trang /cong-nghe, xem Mục 7) |
| Product (danh mục) | `/product` | Bếp từ đôi / đơn / máy hút mùi |
| Product detail (hero) | `/product/[sku]` | Thông số + vì sao hợp món Việt → Tìm đại lý (vd `/product/lv79di`) |
| Cook (hub) | `/cook` | Hub công thức món Việt (gắn mức nhiệt) |
| Cook detail | `/cook/[slug]` | Bài công thức theo khuôn cố định |
| Article (hub) | `/article` | Bài giải đáp mua/dùng bếp (GEO/AEO) |
| Article detail | `/article/[slug]` | Bài Cẩm nang bếp chi tiết |
| Agency (hub) | `/agency` | Bộ lọc 34 tỉnh + Chỉ đường + PR đại lý |
| Agency detail | `/agency/[slug]` | Địa chỉ, bản đồ nhúng, ảnh cửa hàng, LocalBusiness schema |
| About | `/about` | Câu chuyện + cột mốc + uy tín |

**Đã bỏ route riêng `/cong-nghe`.** Nội dung 6 khối công nghệ vẫn giữ nguyên nhưng chuyển thành một **section trên trang chủ** (component tái sử dụng được, không phải page riêng) — xem `Technology section` trong Mục 7.

## 7. Đặc tả từng trang (tóm tắt cho dev)

### `/` — Trang chủ

- Hero: nền tối + mô-típ AI (mạng nơ-ron/mạch vàng ánh kim, chip "Ai Design") quanh render LV79DI. Headline "Bếp từ được thiết kế bằng AI" + phụ đề + CTA "Tìm đại lý gần bạn".
- Dải công nghệ (rút gọn): Menu nấu tự động · Inverter tiết kiệm 30% · 9 mức nhiệt/nhận diện nồi.
- **Technology section (đầy đủ, thay cho trang /cong-nghe cũ):** 6 khối = 6 "đơn vị trả lời" (tiêu đề rõ + đoạn ngắn), mỗi khối là component riêng để dễ gắn schema/anchor: `01 Thiết kế bằng AI` · `02 Digital Inverter (~30%)` · `03 Điều khiển nhiệt cho món Việt (9 mức, liu riu, Turbo 2800W)` · `04 Mặt kính Ceramic + viền inox` · `05 Mâm từ chống nồm ẩm` · `06 Cảm biến thông minh (nhận diện nồi/vật liệu/kích thước)`. Kèm khối An toàn cuối section; CTA "Xem sản phẩm" → `/product`.
- Khối Recipes: 3 công thức nổi bật, mỗi thẻ gắn mức nhiệt.
- Danh mục sản phẩm: Bếp từ đôi / đơn / máy hút mùi.
- Tìm đại lý: bộ chọn tỉnh/thành + nút Tìm.
- Footer: About · Bảo hành · Zalo · Hotline.

### `/product/[sku]` — Trang sản phẩm hero (vd `/product/lv79di`)

- Hero: render + tên "Bếp từ đôi LV79DI" + chip "Ai Design" + phụ đề định vị + giá niêm yết + CTA "Tìm đại lý gần bạn" (không giỏ hàng).
- "Vì sao hợp món Việt": 3 khối — Kho liu riu ổn định · Turbo 2800W · Menu tự động — link sang `/cook`.
- Thông số kỹ thuật (⚠️ số liệu cần Mục 9 xác nhận trước khi publish): công suất 2500W/2500W, Boost 2800W; Digital Inverter (~30%); mặt kính Ceramic + viền inox; mâm từ phủ 2 lớp chống nồm ẩm; kích thước 730×430mm / khoét 680×385mm; điện áp 220–240V/50–60Hz; nặng 11kg.
- "Thiết kế bởi AI": đoạn mô tả quy trình tối ưu bố cục/thao tác từ dữ liệu thói quen nấu.
- An toàn: khoá trẻ em · cảm biến nồi · quá nhiệt tự ngắt · chống tràn tự ngắt · hẹn giờ · CO/CQ.

### `/cook` + `/cook/[slug]` — Hub công thức

- Trang danh sách (`/cook`): bộ lọc kiểu món (Tất cả · Kho · Xào · Chiên rán · Lẩu · Hấp/Canh) + món nổi bật + lưới thẻ, mỗi thẻ gắn mức nhiệt Levia.
- **Khuôn bài công thức (`/cook/[slug]`, dùng làm content type / MDX schema cố định):**
  1. Tiêu đề chuẩn SEO ("Cách [món] bằng bếp từ…")
  2. Meta: thời gian / khẩu phần / độ khó / bếp đề xuất
  3. Nguyên liệu
  4. Các bước — kèm callout mức nhiệt Levia
  5. Khối "Nấu món này ngon nhất với [model]" → link `/product/[sku]`
  6. Món liên quan
- 20 công thức khởi động: xem Phụ lục A bên dưới.

### `/article` + `/article/[slug]` — Cẩm nang bếp

5 nhóm, xếp theo thứ tự ưu tiên GEO (nhóm nào dễ được AI trích để tư vấn mua đứng trước): **Cẩm nang chọn bếp** (quan trọng nhất) → **So sánh** → **Mẹo dùng & bảo quản** → **Công nghệ** → **Tin thương hiệu** (nhỏ nhất). M��i bài (`/article/[slug]`) dùng đúng khuôn GEO ở Mục 4 (khối trả lời 40–60 chữ, tiêu đề dạng câu hỏi, ngày + tác giả, internal link, schema FAQ/Article). Bài ưu tiên viết trước: xem Phụ lục B.

### `/agency` + `/agency/[slug]` — Hệ thống đại lý

- `/agency`: bộ lọc Tỉnh (34) → Quận/Huyện → nút Tìm. Kết quả: thẻ đại lý (tên, địa chỉ, sao Google + số đánh giá, nút "Chỉ đường" và "Gọi") + bản đồ ghim.
- `/agency/[slug]`: trang riêng từng đại lý — địa chỉ, bản đồ nhúng, ảnh cửa hàng, `LocalBusiness` schema.
- "Chỉ đường" **phải trỏ tới hồ sơ Google Business** của đại lý, không phải toạ độ thô — mục đích tạo vòng lặp tự nuôi đánh giá Google.
- PR đại lý: khối "đại lý tiêu biểu" trên `/agency` dùng ảnh thực tế cửa hàng.
- B2B (phụ): khối nhỏ "Đăng ký hợp tác" cuối trang `/agency`, không tranh chỗ với chức năng tìm-chỗ-mua.

### `/about` — Về chúng tôi

Hero (tagline + câu định vị) → Câu chuyện (nguyên văn Mục 2) → Ba trụ → Cột mốc (timeline, năm thật — chờ Mục 9) → Uy tín (CO/CQ · Bảo hành · Đại lý 34 tỉnh · CSKH).

## 8. Yêu cầu kỹ thuật

### SEO / GEO nền tảng

- `robots.txt` **không được chặn AI crawler**: `GPTBot`, `ChatGPT-User`, `Google-Extended`, `PerplexityBot`, `ClaudeBot`, v.v. Nếu dùng Cloudflare, kiểm tra cấu hình mặc định không chặn bot AI.
- Tốc độ tải nhanh, URL sạch (route tiếng Anh, kebab-case cho slug), heading có cấu trúc (H1→H2→H3), mobile-first.
- Mỗi trang/bài có khối tóm tắt 40–60 chữ gần đầu trang.
- `sitemap.xml`, `canonical` tags, Open Graph đầy đủ cho mọi route.

### Structured data (schema.org) — bắt buộc theo loại trang

| Route             | Schema                                             |
| ----------------- | -------------------------------------------------- |
| `/` (thương hiệu) | `Organization`, `WebSite`                          |
| `/product/[sku]`  | `Product` (+ `AggregateRating` khi có review thật) |
| `/recipes/[slug]` | `Recipe` (`recipeIngredient`, `step`, `cookTime`…) |
| `/article/[slug]` | `Article` + `FAQPage`                              |
| `/agency/[slug]`  | `LocalBusiness` (địa chỉ, geo, giờ mở cửa, tel)    |

### Hệ thống đại lý (đã chốt kỹ thuật)

- Mỗi đại lý có **trang riêng**: `/agency/[slug]` — chứa địa chỉ, bản đồ nhúng, ảnh cửa hàng, `LocalBusiness` schema.
- Nút "Chỉ đường" trỏ thẳng tới **hồ sơ Google Business** của đại lý.
- Bộ lọc theo 34 tỉnh; sao Google + số review đồng bộ từ Google Business khi khả thi.

### Khác

- Không thương mại điện tử: mọi CTA sản phẩm → "Tìm đại lý"; có form thu lead (tên/SĐT/khu vực) cho sale gọi lại.
- Cân nhắc (không bắt buộc v1): kích hoạt bảo hành điện tử; tích hợp Zalo/Hotline; đa ngôn ngữ (VI mặc định, có thể thêm EN — nếu thêm, cân nhắc `/en/...` prefix, chưa chốt trong bản này).

## 9. Dữ liệu chưa chốt — KHÔNG hardcode, dùng placeholder rõ ràng + TODO

Agent không được tự bịa các số liệu dưới đây. Khi cần dựng UI, dùng giá trị placeholder có đánh dấu `TODO(client-confirm)` hoặc đọc từ CMS/config chờ điền, **không** in số liệu mâu thuẫn ra production copy:

| Hạng mục | Vấn đề | Cần làm |
| --- | --- | --- |
| Loại kính mặt bếp | Poster ghi Eurokera (Pháp), catalogue ghi Ceramic Kanger — mâu thuẫn | Chốt tên đúng; nếu Eurokera thật + có giấy → dùng làm điểm bán |
| Công suất tổng | Poster "5600W" vs 2500W+2500W | Thống nhất một con số nhất quán toàn site |
| Mốc năm (About) | Đang để `[Năm]` | Điền năm ra mắt Levia, năm ra dòng AI |
| Giấy chứng nhận (CE/DEKRA…) | Có trong catalogue | Chỉ trưng khi đúng cho SP đang bán, giữ bản gốc |
| Dữ liệu đại lý 34 tỉnh | Cần danh sách thật | Tên, địa chỉ, SĐT, link Google Business từng đại lý (map sang `/agency/[slug]`) |
| Ảnh thật | Mới có render + poster | Bổ sung ảnh sản phẩm thật, ảnh cửa hàng, ảnh món (Recipes) |
| Câu chuyện quy trình AI | Claim "thiết kế bởi AI" cần bằng chứng | Chuẩn bị mô tả quy trình có thật |
| Font subset tiếng Việt | `layout.tsx` chỉ khai `subsets: ['latin']` cho Geist/Geist Mono/Instrument Serif | Xác nhận glyph tiếng Việt đủ dấu; nếu thiếu, bổ sung subset hoặc đổi font (xem Mục 3) |
| Kích hoạt dark mode mặc định | ✅ Đã hoàn thành | `layout.tsx` đã gắn class `dark` vào `<html>` |

## Phụ lục A — 20 công thức khởi động cho Recipes

| Món | Mức nhiệt Levia | Tiêu đề bài (SEO/AEO) |
| --- | --- | --- |
| Cá kho tộ | Mức 3 liu riu | Cách kho cá tộ bằng bếp từ để cá keo màu, không cháy đáy |
| Thịt kho tàu | Mức 3 · 60' | Kho thịt bằng bếp từ để mức mấy? Bí quyết thịt kho mềm rục |
| Cá basa kho tiêu | Mức 3 | Kho cá bằng bếp từ có ngon như bếp gas không? |
| Tôm rim thịt | Mức 4 rim cạn | Tôm rim thịt bằng bếp từ — mẹo rim cạn không khét |
| Sườn kho | Mức 3 | Cách kho sườn bằng bếp từ mềm, thấm vị |
| Bò kho | Mức 2–3 ninh | Nấu bò kho bằng bếp từ để mức nào cho thịt mềm? |
| Chân giò hầm | Mức 2 hầm | Hầm chân giò bằng bếp từ mất bao lâu, để mức mấy |
| Nước dùng phở/bún | Mức 2 ninh | Ninh nước dùng phở bằng bếp từ có trong nước không |
| Cháo | Mức 2 | Nấu cháo bằng bếp từ không trào, không khê |
| Bò lúc lắc | Turbo/Mức 9 | Bò lúc lắc bằng bếp từ — mẹo lửa lớn cho thịt mọng |
| Rau muống xào tỏi | Mức 9 | Xào rau muống bằng bếp từ có xanh giòn không? |
| Hải sản/mực xào | Mức 8–9 | Xào hải sản bằng bếp từ sao cho không ra nước |
| Cơm rang | Mức 8 | Cơm rang bằng bếp từ có tơi vàng như chảo gang không |
| Phở/miến xào | Mức 8 | Cách làm phở xào bằng bếp từ không dính, không nát |
| Nem rán/chả giò | Mức 6–7 | Chiên nem bằng bếp từ để mức mấy cho giòn lâu |
| Cá chiên xù | Mức 7 | Chiên cá bằng bếp từ giòn rụm, không bắn dầu |
| Đậu phụ chiên | Mức 6 | Chiên đậu bằng bếp từ vàng đều không nát |
| Lẩu thái hải sản | Menu Lẩu | Nấu lẩu bằng bếp từ loại nào ngon? Chọn theo công suất |
| Lẩu riêu cua | Menu Lẩu | Bếp từ nấu lẩu có giữ sôi đều cả bàn ăn không |
| Gà luộc/hấp | Mức 5–6 | Luộc gà bằng bếp từ để mức mấy cho da không nứt |

## Phụ lục B — Bài Article (Cẩm nang bếp) ưu tiên (viết trước tiên)

- Cách chọn bếp từ nấu món Việt: 5 tiêu chí không nên bỏ qua.
- Bếp từ có kho cá, kho thịt được không? Nên chọn loại nào.
- Bếp từ đôi hay đơn — chọn loại nào cho gia đình?
- Bếp từ có tốn điện không? Một tháng hết bao nhiêu?
- Bếp từ và bếp hồng ngoại: nên chọn loại nào?
- So sánh các dòng bếp Levia (LV-39 / LV-68PRO / LV79DI…).
- Nồi, chảo nào dùng được trên bếp từ?

## Checklist nhanh trước khi merge bất kỳ trang/nội dung nào

- [ ] Không có claim "Đức" / cờ Đức / "nhất" chưa chứng minh (Mục 5)
- [ ] Có khối trả lời 40–60 chữ + tiêu đề dạng câu hỏi (Mục 4)
- [ ] Đúng schema.org theo route (Mục 8)
- [ ] Chỉ dùng shadcn component + token trong `globals.css` (`bg-primary`, `text-foreground`, `font-heading`…) — không hex/oklch trực tiếp, không arbitrary value, không style inline, **không `rounded-*`** (Mục 3)
- [ ] Route đúng chuẩn tiếng Anh đã chốt: `/product`, `/product/[sku]`, `/about`, `/agency`, `/agency/[slug]`, `/cook`, `/cook/[slug]`, `/article`, `/article/[slug]` — không còn route `/cong-nghe` riêng
- [ ] Mọi CTA sản phẩm → "Tìm đại lý", không có luồng giỏ hàng/thanh toán
- [ ] Số liệu kỹ thuật/năm/giấy chứng nhận không hardcode nếu còn ở trạng thái TODO (Mục 9)
