# Remotion Templates — XQuang Production House

Bộ template video tự động hoá dùng Remotion (React video framework). Mục tiêu: tạo intro/outro, lower-third, case-study animation dùng lại được cho mọi job, không phải dựng tay mỗi lần trên Premiere/AE.

## Có 3 template

| Template | File | Dùng để làm gì |
|---|---|---|
| `IntroOutro` | `src/templates/IntroOutro.tsx` | Intro/outro cinematic có tên khách hàng + tagline |
| `LowerThird` | `src/templates/LowerThird.tsx` | Thanh tên/chức danh chạy dưới cho phỏng vấn, testimonial |
| `CaseStudy` | `src/templates/CaseStudy.tsx` | Animation số liệu (lượt xem, % tăng trưởng...) cho báo cáo/case study gửi khách |
| `BeFastPromo` | `src/templates/BeFastPromo.tsx` | Promo sản phẩm dọc 9:16, dùng khi làm việc trực tiếp với 1 nhãn hàng cụ thể |
| `RealEstateLocation` | `src/templates/RealEstateLocation.tsx` | Bản đồ zoom vào 1 địa điểm + marker + tên, cho video bất động sản/event |
| `FootageLowerThird` | `src/templates/FootageLowerThird.tsx` | Ghép lower-third lên trên **footage thật đã quay** (không phải nền đồ hoạ thuần) |

## Cài đặt trên PC văn phòng (làm 1 lần)

1. Cài Node.js bản 20 trở lên: https://nodejs.org (bản LTS).
2. Clone repo: `git clone https://github.com/nguyenichminhquang1998-lab/remotion.git`
3. Vào thư mục, checkout đúng nhánh: `cd remotion && git checkout claude/production-house-tools-dt9g3u`
4. Cài thư viện: `npm install`

**Lưu ý:** lần đầu render trên PC thật, Remotion sẽ tự tải Chromium (khác với môi trường cloud này) — cần mạng bình thường, tải 1 lần duy nhất, không cần làm gì thêm.

## Cách dùng hàng ngày — không cần biết code

### Xem trước và chỉnh nội dung bằng giao diện

```
npm run dev
```

Lệnh này mở Remotion Studio trên trình duyệt (giống một app riêng). Trong đó:
- Chọn 1 trong 3 composition (`IntroOutro`, `LowerThird`, `CaseStudy`) ở sidebar.
- Bên phải có bảng "Props" — đây là nơi bạn gõ **tên khách hàng, tagline, màu accent, số liệu...** mà không đụng vào code, xem preview live ngay lập tức.
- Kéo timeline để xem animation chạy.

### Xuất video ra file MP4

Sau khi ưng ý nội dung trong Studio, xuất file bằng lệnh:

```
npm run render:intro         # xuất IntroOutro -> out/intro.mp4
npm run render:lower-third   # xuất LowerThird -> out/lower-third.mp4
npm run render:case-study    # xuất CaseStudy -> out/case-study.mp4
```

Muốn đổi nội dung mặc định (tên khách, số liệu...) trước khi render hàng loạt, sửa phần `defaultProps` trong `src/Root.tsx` — hoặc **nhờ Claude Code sửa hộ bằng cách mô tả bằng lời**, ví dụ: "đổi tên khách trong IntroOutro thành 'Cafe Hải An', tagline thành 'Directed by XQuang'".

### Render hàng loạt (nhiều biến thể cùng lúc)

Đúng nhu cầu "tạo nhiều biến thể video ads nhanh" — thay vì render từng cái một, đưa 1 danh sách khách hàng/nội dung vào `data/batch-example.json` rồi chạy:

```
npm run render:batch
```

Mỗi dòng trong file JSON là 1 video, ra file riêng trong `out/batch/`. Nhờ Claude Code sửa file JSON này theo danh sách khách hàng thật của bạn — không cần đụng vào code render.

## `RealEstateLocation` — cần API key MapTiler trước khi giao khách

Template này dùng skill chính thức `remotion-maps` (MapLibre). Mặc định (chưa cấu hình key) nó dùng bản đồ demo `demotiles.maplibre.org` — **không có chi tiết đường/phố, chỉ để test chuyển động, không dùng cho khách thật**.

**Đã sửa 1 bug (26/09):** trên PC có mạng thật, render từng bị timeout ở giữa video (`delayRender()` treo 3 lần chồng nhau) do component tạo lại bản đồ MapLibre mới ở mỗi frame thay vì 1 lần duy nhất. Đã sửa.

### Cấu hình bản đồ thật (MapTiler) — làm 1 lần

1. Đăng ký tài khoản free tại https://cloud.maptiler.com/ → lấy API key ở mục "API keys".
2. Copy file `.env.example` thành `.env` (file `.env` không bị commit lên GitHub, key giữ riêng trên máy).
3. Dán key vào `.env`:
   ```
   REMOTION_PUBLIC_MAPTILER_KEY=key_that_cua_ban
   ```
4. Chạy lại `npm run dev` hoặc `npm run render:real-estate-location` — nếu key đúng, bản đồ sẽ có chi tiết đường phố thật.

Vì sao MapTiler chứ không phải Mapbox: code đang dùng thư viện mở `maplibre-gl`, MapTiler tương thích thẳng (chỉ đổi URL style + key). Mapbox có điều khoản dịch vụ giới hạn dùng tile của họ với SDK không phải chính chủ — dùng MapLibre để hiển thị tile Mapbox có rủi ro vi phạm ToS, không hợp cho sản phẩm giao khách.

**Trên PC văn phòng có internet bình thường, lệnh sau sẽ chạy được:**

```
npm run render:real-estate-location
```

Đổi toạ độ/tên địa điểm trong `defaultProps` của composition `RealEstateLocation` tại `src/Root.tsx`, hoặc nhờ Claude Code sửa hộ theo địa chỉ thật của job.

## `FootageLowerThird` — ghép lower-third lên footage thật

Khác với các template trên (đồ hoạ thuần), template này chèn 1 clip video thật của bạn làm nền rồi overlay lower-third lên trên — đúng việc bạn làm thật khi edit phỏng vấn/testimonial.

**Cách dùng:**

1. Copy file video (đã xuất sẵn từ Premiere/Resolve, khuyên dùng .mp4 H264) vào thư mục `public/` ở gốc project. Ví dụ: `public/phong-van-khach.mp4`.
   - Thư mục `public/` không đồng bộ lên GitHub (file video thật quá nặng, không hợp để lưu trên git) — mỗi máy tự có bộ footage riêng.
2. Sửa `defaultProps` của composition `FootageLowerThird` trong `src/Root.tsx`: đổi `videoFileName` thành đúng tên file, `name`/`subtitle`/`accentColor` theo người trong clip, `lowerThirdInFrame`/`lowerThirdOutFrame` là frame bắt đầu/kết thúc hiển thị (30 frame = 1 giây).
3. Xem trước trong Studio (`npm run dev`) — **độ dài video tự động khớp với clip thật**, không cần đo tay.
4. Xuất file:
   ```
   npm run render:footage-lower-third
   ```

## Khi cần template mới

Không tự viết code. Mở Claude Code, mô tả bằng tiếng Việt những gì bạn muốn, ví dụ:
- "Làm thêm 1 template intro dạng vertical 9:16 cho reels, có logo góc trên"
- "Làm template so sánh trước/sau cho case real estate, 2 ảnh trượt ngang"

Claude Code sẽ tạo file mới trong `src/templates/`, đăng ký vào `src/Root.tsx`, và render thử để bạn duyệt — đúng quy trình đã làm với 3 template ở trên.

## Ghi lại ROI (để đưa vào production-analytics sau)

Mỗi lần dùng template thay vì dựng tay, ghi lại: tên job, template dùng, thời gian dựng tay ước tính vs. thời gian dùng template. Dữ liệu này dùng để đánh giá Phase 1 có đáng tiếp tục đầu tư không trước khi qua Phase 2 (Magnific).

## Thử nghiệm song song: Hyperframes

Thư mục `hyperframes-lab/` chứa bản dựng lại template `CaseStudy` bằng Hyperframes (framework HTML/CSS của HeyGen) để so sánh trực tiếp với Remotion trên cùng use case. Xem `hyperframes-lab/README.md` để biết kết quả so sánh và đánh giá — tóm tắt: **Remotion vẫn là công cụ chính** (team ≤3 người cố định nên free license của Remotion không bao giờ hết hạn), Hyperframes đáng cân nhắc sau này khi cần loại nội dung phức tạp mà kho block cộng đồng của nó (`hyperframes catalog`) có sẵn. Hyperframes cũng đã hỗ trợ render hàng loạt (`npm run render:batch` trong `hyperframes-lab/`, dùng `data/batch-example.json`).

## Mở rộng bộ công cụ AI (đang chờ XQuang tự đăng ký)

Ngoài Remotion/Hyperframes, kế hoạch mở rộng gồm:

- **Higgsfield Soul** (thay Arcads, $15-19/th thay vì $110/th) — dùng cho UGC ads. Free trial trước khi trả tiền, dùng theo `HIGGSFIELD-TEST-CHECKLIST.md` để test đúng trọng tâm (nhân vật nhất quán, lipsync tiếng Việt) trước khi quyết định trả phí.
- **Magnific MCP** — đã scaffold sẵn `.mcp.json` trong repo, khi bạn có tài khoản Magnific (Premium ~520k/tháng, không có gói free cho MCP) chỉ cần đăng nhập OAuth trong Claude Code là dùng được ngay, không cần cấu hình lại.
- Topaz Photo/Video AI, ElevenLabs, Descript/Opus Clip — công cụ bổ sung cho nâng ảnh/video, lồng tiếng, cắt short. Hỏi lại Claude Code bất cứ lúc nào để tóm tắt lý do chọn và giá hiện tại của từng cái.
