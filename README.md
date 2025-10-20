# Approve TRC-20 Token QR Generator

Ứng dụng Next.js giúp merchant tạo QR code chứa payload giao dịch `approve` cho token TRC-20. Người dùng
quét QR bằng ví hỗ trợ TRON (TronLink, MetaMask cấu hình TRON, Trust Wallet, OKX Web3...) và tiến hành ký
approve. Công cụ cũng có chế độ Demo để phục vụ việc quay video hướng dẫn.

## Tính năng

- Nhập địa chỉ token, spender, số lượng (hoặc bật unlimited) và memo.
- Chọn mạng Shasta, Mainnet hoặc cấu hình RPC tuỳ chỉnh.
- Sinh payload JSON chuẩn hoá kèm QR code hiển thị trực tiếp.
- Ghi log payload phía server thông qua API route để tiện kiểm tra.
- Tài liệu hướng dẫn các bước tiếp theo để tích hợp vào luồng demo.

## Bắt đầu

```bash
npm install
npm run dev
```

Truy cập `http://localhost:3000/approve` để sử dụng giao diện tạo QR.

## Cấu hình môi trường

Đối với RPC tuỳ chỉnh, hãy tạo tệp `.env.local` và thiết lập biến nếu muốn sử dụng mặc định:

```
NEXT_PUBLIC_DEFAULT_TRON_RPC=https://api.shasta.trongrid.io
```

Sau đó sửa `createInitialFormState` trong `lib/approve.ts` để đọc giá trị này khi khởi tạo.

## Quy trình hoạt động

1. Merchant nhập thông tin approve và nhấn **Tạo QR approve**.
2. Payload hợp lệ sẽ được gửi tới API `/api/log-approve` để ghi log.
3. QR code hiển thị payload JSON cho người dùng quét.
4. Ứng dụng ví đọc payload, dựng transaction `approve` và yêu cầu người dùng ký.
5. Nếu bật *Demo mode*, ứng dụng phía merchant có thể ẩn cảnh báo bảo mật để phù hợp với môi trường demo.

## Ứng dụng hoạt động ra sao trong thực tế?

### Luồng sử dụng giữa merchant và khách hàng

1. **Merchant chuẩn bị giao dịch**: Tại quầy thanh toán hoặc trên trang quản trị, nhân viên mở trang `/approve`, nhập địa chỉ hợp đồng token, địa chỉ ví nhận quyền chi tiêu (spender), số lượng được phép chi tiêu và ghi chú giao dịch. Nếu cần hạn mức không giới hạn, họ bật tùy chọn *Unlimited allowance*.
2. **Sinh mã QR**: Sau khi biểu mẫu hợp lệ, ứng dụng hiển thị bảng tóm tắt và tạo mã QR chứa payload JSON (`to`, `spender`, `amount`, `memo`, `network`). Payload này đồng thời được ghi log qua API để phục vụ đối chiếu sau này.
3. **Khách hàng quét mã**: Khách mở ví hỗ trợ mạng TRON (ví dụ TronLink mobile) và dùng chức năng quét QR. Ví sẽ nhận payload, hiển thị chi tiết giao dịch approve và cảnh báo về quyền chi tiêu.
4. **Xác nhận và ký**: Khi khách đồng ý, ví dựng giao dịch `approve` chính thống trên mạng đã chọn (Shasta testnet hoặc Mainnet) và yêu cầu người dùng ký bằng private key của họ. Sau khi ký, ví phát transaction lên blockchain.
5. **Merchant nhận thông báo**: Merchant có thể kiểm tra trạng thái transaction bằng cách truy vấn ví khách hàng, sử dụng webhook của ví hoặc đối chiếu log trên máy chủ rồi cập nhật hệ thống bán hàng.

### Môi trường triển khai khuyến nghị

- **Thiết bị merchant**: Laptop/Tablet chạy trình duyệt hiện đại, kết nối Internet ổn định. Nên khóa ứng dụng ở chế độ kiosk để nhân viên chỉ thao tác trên biểu mẫu.
- **Thiết bị khách hàng**: Điện thoại cài đặt ví TronLink/MetaMask (đã cấu hình TRON), Trust Wallet, OKX Web3... và có sẵn token TRC-20 cần approve.
- **Máy chủ ghi log**: API `/api/log-approve` hiện chỉ lưu log trong console. Khi triển khai thực tế nên kết nối tới dịch vụ logging (CloudWatch, Datadog...) hoặc cơ sở dữ liệu để phục vụ kiểm toán.
- **Bảo mật**: Tắt *Demo mode* ở môi trường sản xuất, đặt giới hạn số tiền hợp lý, và thêm xác thực cho trang `/approve` để chỉ nhân viên được phép tạo QR.

### Các bước mở rộng sau khi triển khai

- Tự động kiểm tra transaction sau khi khách ký bằng cách tích hợp webhook từ TronGrid hoặc dịch vụ indexer.
- Gửi thông báo (email/SMS) cho khách khi hạn mức sắp hết hoặc cần gia hạn.
- Tích hợp thêm báo cáo tổng hợp các lần approve theo ngày để nhóm vận hành kiểm soát rủi ro.

## Công nghệ chính

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [qrcode.react](https://github.com/zpao/qrcode.react)
- [Zod](https://zod.dev/)

## Phát triển tiếp

- Tích hợp TronWeb để ký trực tiếp từ trình duyệt khi có TronLink.
- Đồng bộ payload với server backend thực tế thay vì chỉ ghi log.
- Thêm i18n (vi/en) cho trải nghiệm đa ngôn ngữ.
