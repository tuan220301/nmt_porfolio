# Nguyên tắc

- Không tạo thêm bất kì file markdown nào khi tôi không yêu cầu
- Update trực tiếp vào component hiện tại thay vì tạo thêm component mới
- Tuyệt đối không tạo thêm bất kì 1 file nào, cần gì thì update trực vào các file typescript luôn

## Logic

- Khi đưa image vào trong block tôi không thấy có nội dung gì được log => nghĩa là chưa có logic nào xử lý image trong block được thực thi => image không lên được s3 => không lưu được => không show được url để hiện image lên
- Logic upload image như sau:
    1. Mỗi project sẽ lưu title, des, contents, ... thì contents sẽ chứa 1 list content bên trong
    2. Mỗi content con sẽ chứa index dùng để lưu vị trí block, title dùng để lấy title từ project và content của block
    3. Khi truyền image vào block sẽ lấy title của project (gán vào title của block) và thêm folder mới trong s3 với tên tương ứng với title
    4. Mỗi image được truyền vào content sẽ tiến hành lưu trên s3 vào chính folder có cùng tên với title của block, khi user sửa hoặc xoá sẽ tìm đúng image để sửa hoặc xoá
    5. Console log liên tục, đặc biệt là console nội dung truyền image vào trong block và xem cách hàm hoạt động để gửi lên server s3 như nào để biết được lý do tại sao iamge không lưu được vào s3

## Các lỗi hiện tại

### 1. Upload image không hoạt động

**Lỗi:**
Khi ấn vào nút image => chọn image => block tự disable và không show image ra
Không có console nào được show ra khi chọn image trong button image của block
Khi sửa code dễ bị tình huống lỗi như sau

### 2. Lỗi synctax

          npm run dev

      > client@0.1.0 dev
      > next dev

        ▲ Next.js 14.2.31

      ✓ Starting...
      ✓ Ready in 1353ms
      ○ Compiling / ...
      ✓ Compiled / in 1419ms (1239 modules)
      GET / 200 in 1859ms
      ✓ Compiled in 411ms (612 modules)
      ✓ Compiled /favicon.ico in 354ms (658 modules)
      GET /favicon.ico 200 in 405ms
      ✓ Compiled /api/auth/cookie in 74ms (688 modules)
      GET /api/auth/cookie?t=1771503055920 200 in 110ms
      GET /api/auth/cookie?t=1771503055931 200 in 100ms
      GET /api/auth/cookie?t=1771503055932 200 in 99ms
      GET /api/auth/cookie?t=1771503055918 200 in 111ms
      GET /api/auth/cookie?t=1771503056079 200 in 11ms
      ✓ Compiled /Pages/login in 355ms (1294 modules)
      GET /api/auth/cookie?t=1771503058268 200 in 17ms
      ✓ Compiled /api/auth/login in 119ms (778 modules)
      Mongo is connected
      MongoDB connected!
      POST /api/auth/login?t=1771503062845 200 in 2140ms
      ✓ Compiled /Pages/work in 152ms (1389 modules)
      GET /api/auth/cookie?t=1771503065199 200 in 7ms
      ✓ Compiled /api/persional_project/list in 71ms (788 modules)
      Mongo is connected
      Using existing MongoDB connection.
      Using existing MongoDB connection.
      Using existing MongoDB connection.
      Using existing MongoDB connection.
      GET /api/persional_project/list?t=1771503065199 200 in 209ms
      GET /api/persional_project/list?t=1771503065200 200 in 366ms
      GET /api/persional_project/list?t=1771503065200 200 in 489ms
      GET /api/persional_project/list?t=1771503065200 200 in 582ms
      ⨯ ./app/Components/Tiptap/Tiptap.tsx
      Error:
        × Unexpected token `div`. Expected jsx identifier
          ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:477:1]
      477 │   };
      478 │
      479 │   return (
      480 │     <div className="p-3 space-y-3">
          ·      ───
      481 │       <SlashCmdProvider>
      482 │         {/*Toolbar - only show when editor is focused/active*/}
      483 │         {isActive && (
          ╰────

      Caused by:
          Syntax Error

      Import trace for requested module:
      ./app/Components/Tiptap/Tiptap.tsx
      ./app/Components/Tiptap/MultiBlockEditor.tsx
      ./app/Pages/work/detail/[slug]/page.tsx
      ⨯ ./app/Components/Tiptap/Tiptap.tsx
      Error:
        × Unexpected token `div`. Expected jsx identifier
          ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:477:1]
      477 │   };
      478 │
      479 │   return (
      480 │     <div className="p-3 space-y-3">
          ·      ───
      481 │       <SlashCmdProvider>
      482 │         {/*Toolbar - only show when editor is focused/active*/}
      483 │         {isActive && (
          ╰────

      Caused by:
          Syntax Error

      Import trace for requested module:
      ./app/Components/Tiptap/Tiptap.tsx
      ./app/Components/Tiptap/MultiBlockEditor.tsx
      ./app/Pages/work/detail/[slug]/page.tsx
      ○ Compiling /_not-found ...
      ⨯ ./app/Components/Tiptap/Tiptap.tsx
      Error:
        × Unexpected token `div`. Expected jsx identifier
          ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:477:1]
      477 │   };
      478 │
      479 │   return (
      480 │     <div className="p-3 space-y-3">
          ·      ───
      481 │       <SlashCmdProvider>
      482 │         {/*Toolbar - only show when editor is focused/active*/}
      483 │         {isActive && (
          ╰────

      Caused by:
          Syntax Error

      Import trace for requested module:
      ./app/Components/Tiptap/Tiptap.tsx
      ./app/Components/Tiptap/MultiBlockEditor.tsx
      ./app/Pages/work/detail/[slug]/page.tsx
      GET /Pages/work/detail/[slug] 500 in 5ms

    ./app/Components/Tiptap/Tiptap.tsx
    Error:
      × Unexpected token `div`. Expected jsx identifier
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:477:1]
    477 │   };
    478 │
    479 │   return (
    480 │     <div className="p-3 space-y-3">
        ·      ───
    481 │       <SlashCmdProvider>
    482 │         {/*Toolbar - only show when editor is focused/active*/}
    483 │         {isActive && (
        ╰────

    Caused by:
        Syntax Error

      ./app/Components/Tiptap/Tiptap.tsx
    Error:
      × await isn't allowed in non-async function
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:304:1]
    304 │         setUploadingProgress('Uploading to S3...');
    305 │         console.log(`\n📤 [Tiptap.handleImageUpload] BEFORE fetch`);
    306 │         const fetchStartTime = Date.now();
    307 │         const response = await fetch('/api/persional_project/upload', {
        ·                                ─────
    308 │           method: 'POST',
    309 │           body: formData,
    310 │         });
        ╰────

      × await isn't allowed in non-async function
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:320:1]
    320 │         // 7. RESPONSE PARSING: log isSuccess, message, data existence
    321 │         setUploadingProgress('Processing response...');
    322 │         if (!response.ok) {
    323 │           const errorText = await response.text();
        ·                                   ────────
    324 │           console.error(`❌ [Tiptap.handleImageUpload] HTTP Error ${response.status}:`, {
    325 │             status: response.status,
    326 │             statusText: response.statusText,
        ╰────

      × await isn't allowed in non-async function
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:336:1]
    336 │           }
    337 │         }
    338 │
    339 │         const data = await response.json();
        ·                            ────────
    340 │         console.log(`📨 [Tiptap.handleImageUpload] Response parsed:`, {
    341 │           isSuccess: data.isSuccess,
    342 │           message: data.message,
        ╰────

      × await isn't allowed in non-async function
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:396:1]
    396 │         console.log(`✅ [Tiptap.handleImageUpload] Insert completed (${insertDuration}s)`);
    397 │
    398 │         // Add small delay to ensure DOM is updated
    399 │         await new Promise(resolve => setTimeout(resolve, 100));
        ·               ───
    400 │
    401 │         // 10. IMAGE VERIFICATION: check <img> tag presence
    402 │         const editorHtmlAfter = editor.getHTML();
        ╰────

      × 'const' declarations must be initialized
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:470:1]
    470 │         }, 100);
    471 │       }
    472 │     },
    473 │     [editor, projectTitle]
        ·     ──────────────────────
    474 │   );
    475 │
    476 │   useEffect(() => {
        ╰────

      × Expression expected
        ╭─[/Users/tuannm/Documents/Jobs/my_project/portfolio/nmt_porfolio/app/Components/Tiptap/Tiptap.tsx:471:1]
    471 │       }
    472 │     },
    473 │     [editor, projectTitle]
    474 │   );
        ·   ─
    475 │
    476 │   useEffect(() => {
    477 │     if (!editor) return;
        ╰────

    Caused by:
        Syntax Error

### 2. Hướng khắc phục

- Chuyển tiptap thành từng block như hiện tại với code thông thường => bỏ toàn bộ logic liên quan đến xử lý image => log ra nội dung có thay đổi trong đó
