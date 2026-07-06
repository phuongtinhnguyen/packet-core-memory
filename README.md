# Món Quà Kỷ Niệm

Trang web kỷ niệm ReactJS theo Component-Based Architecture, chạy bằng NodeJS/Vite và deploy được lên GitHub Pages.

## Cài đặt

```bash
cd frontend
npm install
npm run dev
```

## Build để deploy

```bash
cd frontend
npm run build
```

Thư mục build sẽ là `dist/`.

## Cấu trúc

```text
frontend/
  public/assets/   Ảnh, favicon, nhạc tĩnh
  src/
    components/    UI components
    data/          Nội dung lời chúc, ảnh và timeline
    hooks/         Logic tương tác, thẻ cào, SSE
    services/      Axios client cho backend sau này
    App.jsx        Routes và page chính
    main.jsx       React entry
```

## Cách thay nội dung

1. Sửa lời chúc, nhãn nút, nội dung thẻ cào và nhạc trong `frontend/src/data/content.js`.
2. Sửa danh sách ảnh/timeline trong `frontend/src/data/memories.js`.
3. Thay ảnh trong `frontend/public/assets/photos/` bằng ảnh thật.
4. Nếu có nhạc nền, đặt file mp3 vào `frontend/public/assets/music/soft-memory.mp3`.

## Stack

- React
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- EventSource hook sẵn sàng nếu sau này có SSE từ backend

## Ghi chú

Trang này không cần backend/database. Ảnh trong repo public có thể được xem trực tiếp nếu người khác biết đường dẫn file.
