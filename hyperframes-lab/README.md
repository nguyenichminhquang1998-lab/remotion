# Hyperframes Lab — thử nghiệm song song với Remotion

Project này dựng lại đúng 1 template `CaseStudy` (tiêu đề + 3 số liệu count-up) bằng Hyperframes — framework mã nguồn mở của HeyGen, dùng HTML/CSS/GSAP thay vì React — để so sánh trực tiếp với bản Remotion tại `../src/templates/CaseStudy.tsx`.

## Cài trên PC văn phòng

```
git clone https://github.com/nguyenichminhquang1998-lab/remotion.git
cd remotion && git checkout claude/production-house-tools-dt9g3u
cd hyperframes-lab
npm run dev      # mở preview trong trình duyệt
npm run render   # xuất renders/case-study.mp4
```

Cần cài `ffmpeg` trên máy nếu chưa có (`sudo apt install ffmpeg` trên Linux, `brew install ffmpeg` trên Mac). Windows: tải từ ffmpeg.org. Không cần cài GSAP riêng — đã vendor sẵn trong `vendor/gsap.min.js`.

### Render hàng loạt (nhiều biến thể)

Composition `CaseStudy` đã khai báo `data-composition-variables` (tiêu đề, màu accent, 3 bộ số liệu) nên hỗ trợ render hàng loạt sẵn có của Hyperframes:

```
npm run render:batch
```

Đọc danh sách từ `data/batch-example.json` (định dạng `{"rows": [...]}`, mỗi dòng là 1 video với tên file riêng qua field `outputName`), ra file trong `renders/`. Nhờ Claude Code sửa file JSON này theo dữ liệu khách hàng thật — mở giao diện Studio (`npm run dev`) cũng thấy đúng các trường này trong bảng props để chỉnh tay nếu muốn.

## Kết quả so sánh sau khi test thật (không phải lý thuyết)

| Tiêu chí | Remotion | Hyperframes |
|---|---|---|
| Dựng xong & render ra MP4 | Có, ~5 phút | Có, nhưng gặp 2 lỗi hạ tầng phải tự sửa (xem dưới) |
| Độ phức tạp cấu trúc | 1 file component + 1 file đăng ký (`Root.tsx`) | CLI đa lệnh (init/lint/check/render/preview/publish), quy trình AI-agent nhiều bước (director → builder → verify) nếu đi đúng workflow chính thức |
| Kho template dùng lại sẵn | Không có (phải tự viết hoặc nhờ AI viết mới) | **Có** — `npx hyperframes catalog` cho ra block cộng đồng cài thẳng bằng 1 lệnh (`hyperframes add <tên>`) |
| Độ ổn định khi render | Render thẳng, không chặn | CLI tự chặn render nếu phát hiện "correctness warning" (ví dụ 1 script load lỗi) — an toàn hơn nhưng dễ gây bối rối nếu không đọc log |
| Phù hợp cho non-coder thao tác trực tiếp | Cao — sửa nội dung ngay trong Remotion Studio (giao diện kéo-thả, props) | Trung bình — thiết kế chủ yếu để AI agent (Claude Code) vận hành qua mô tả lời, ít khi tự sửa tay HTML |

## Đánh giá thẳng (không né tránh)

**Với tình huống của XQuang hiện tại (chưa biết code, budget 0đ, cần 3-5 template dùng lại), Remotion vẫn nên là công cụ chính.** Lý do: cấu trúc đơn giản hơn, không có lớp CLI version-pinning hay cơ chế "chặn render vì cảnh báo" cần hiểu để debug, và Remotion Studio cho trải nghiệm chỉnh sửa trực quan hơn cho người không đọc code.

**Điểm mạnh thật sự của Hyperframes: kho block cộng đồng (registry).** Lệnh `npx hyperframes catalog` cho ra sẵn các block như biểu đồ, bản đồ động, logo reveal, lower-third — cài bằng 1 lệnh thay vì code từ đầu. Đáng quay lại dùng Hyperframes khi cần loại nội dung phức tạp (bản đồ động, chart đua số liệu, hiệu ứng logo cầu kỳ) mà tự viết bằng Remotion sẽ tốn thời gian hơn — lúc đó `hyperframes add` có thể nhanh hơn code tay.

**2 lỗi hạ tầng đã gặp và cách sửa** (chỉ xảy ra trong môi trường cloud sandbox, không phải lỗi của Hyperframes hay sẽ không xảy ra trên PC văn phòng có mạng bình thường):
1. Thiếu `ffmpeg`/`ffprobe` hệ thống — cài qua `apt install ffmpeg`.
2. CDN `cdn.jsdelivr.net` (nơi Hyperframes mặc định tải GSAP) bị chặn bởi chính sách mạng của sandbox — đã tải GSAP qua npm registry (kênh được phép) rồi lưu cục bộ vào `vendor/gsap.min.js`, trỏ script tag về file local thay vì CDN. Đây thực ra là cách làm chắc chắn hơn cho production (không phụ thuộc CDN bên thứ 3 lúc render), nên giữ nguyên cách này kể cả trên PC văn phòng.
