
# kienos-nodejs

Đây là **backend phụ** chạy bằng **Nodejs**, là microservice phụ trợ cho **Django** là **backend chính**

## Cách dùng backend Nodejs:

**Mô tả cách hoạt động:**
- Cần bật **Django** mới dùng được các API trong **Nodejs**
- Mọi request đều gửi tới **Django**, **Django** sẽ chuyển tiếp request tới **Nodejs** xử lý, xử lý xong **Nodejs** gửi về lại **Django**, rồi return về **Client**
Client -> Django -> Nodejs -> Django -> Client

**Cách dùng**
- **Gửi request tới Django** nhé, gửi trực tiếp tới Nodejs cũng được, nhưng guiwr tới Django cho code đẹp hơn (chỉ gửi request tới 1 chỗ, chứ k gửi nhiều chỗ lộn xộn)
- Ví dụ
	- IP của **django** là localhost:**8000**
	- Ip của **nodejs** là localhost:**8888**
	- thì  gửi request tới 
	‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ **localhost:8000**/ptservice/getptservices
	 sẽ tương tự như 
	‎‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ **localhost:8888**/ptservice/getptservices
	vì như mô tả ở trên, gửi tới localhost:8000 thì bên trong BE nó cũng gửi tiếp tới localhost:8888 thôi
	
## Cài đặt server:

Sửa giá trị trong .env cho khớp 

| Thông số | Giá trị       |
| -------- | ------------- |
| PORT      | 8888         |
| ------     | --------         |
| DB_NAME      | kienos_mysql  |
| DB_HOST      | localhost     |
| DB_PORT      | 3306         |
| DB_USERNAME      | root     |
| DB_PASSWORD      | ""       |
| DB_DIALECT      | "mysql"    |

## Cách chạy server

1. Tải node: `https://nodejs.org/en/download/package-manager`

2. Vào console tại thư mục /kienos-nodejs

3. Tải requirement bằng lệnh: `npm install -f`

4. Vô file .env chỉnh cho đúng thông số database,...

5. Chạy database migration: `npx sequelize-cli db:migrate`

6. Chạy server: `npm start`

## Một số api hiện tại:
- Get /ptservice/getptservices
- Get /ptservice/getPtServicesFormCompilation
- Get /ptservice/getPtServicesOfCustomerByCustomerId
- Get /ptservice/getPtServicesOfCustomerByCustomerId?customerId=2
- ....

## Chú ý thêm
1. Chưa có

## API Document

# PtService and NonPtService APIs

## PtService APIs (SUB_ROUTE+/ptcontract)

| Method | Endpoint                                  | Description                                                         | Request Example            | Response Example                              |
|--------|-------------------------------------------|---------------------------------------------------------------------|----------------------------|------------------------------------------------|
| GET    | `/ptcontract/`                            | Fetches all subscriptions, including both PT and Non-PT services. | `GET /ptcontract/`        | ```json<br>{<br>  "PtService": [<br>    {<br>      "id": 1,<br>      "start_date": "2024-01-01",<br>      "expire_date": "2024-06-30",<br>      "discount": 10,<br>      "number_of_session": 20,<br>      "session_duration": 60,<br>      "cost_per_session": "50.00",<br>      "validity_period": 180,<br>      "name": "Personal Training 6 Months"<br>    }<br>  ],<br>  "NonPtService": [<br>    {<br>      "id": 2,<br>      "start_date": "2024-02-01",<br>      "expire_date": "2024-08-01",<br>      "discount": 15,<br>      "number_of_month": 6,<br>      "cost_per_month": "30.00"<br>    }<br>  ]<br>}<br>``` |
| GET    | `/ptcontract/getPtService`                | Retrieves all available PT services.                               | `GET /ptcontract/getPtService` | ```json<br>[<br>  {<br>    "id": 1,<br>    "start_date": "2024-01-01",<br>    "expire_date": "2024-06-30",<br>    "discount": 10,<br>    "number_of_session": 20,<br>    "session_duration": 60,<br>    "cost_per_session": "50.00",<br>    "validity_period": 180,<br>    "name": "Personal Training 6 Months"<br>  }<br>]<br>``` |
| GET    | `/ptcontract/getPtContractFormCompilation`| Retrieves PT services and coach profiles to compile a contract form. | `GET /ptcontract/getPtContractFormCompilation` | ```json<br>{<br>  "ptServices": [<br>    {<br>      "id": 1,<br>      "name": "Personal Training 6 Months"<br>    }<br>  ],<br>  "coachProfiles": [<br>    {<br>      "id": 1,<br>      "name": "John Doe"<br>    }<br>  ]<br>}<br>``` |
| GET    | `/ptcontract/getPtContractByCustomerId/:id`  | Fetches all PT contracts by customer ID.                          | `GET /ptcontract/getPtContractByCustomerId/2` | ```json<br>[<br>  {<br>    "ptservice_id": 1,<br>    "customer_id": 2,<br>    "start_date": "2024-01-01",<br>    "expire_date": "2024-06-30",<br>    "is_purchased": false<br>  }<br>]<br>``` |
| POST   | `/ptcontract/addPtContract`               | Adds a new PT contract.                                           | ```json<br>{<br>  "ptServiceId": 1,<br>  "coachId": 1,<br>  "customerId": 2,<br>  "startDate": "2024-01-01"<br>}<br>``` | ```json<br>{<br>  "id": 1,<br>  "ptservice_id": 1,<br>  "coach_id": 1,<br>  "customer_id": 2,<br>  "start_date": "2024-01-01",<br>  "expire_date": "2024-06-30",<br>  "is_purchased": false<br>}<br>``` |
| PUT    | `/ptcontract/updatePtContract/:id`       | Updates an existing PT contract by its ID.                       | ```json<br>{<br>  "coachId": 2,<br>  "startDate": "2024-02-01",<br>  "expireDate": "2024-07-01",<br>  "isPurchased": true<br>}<br>``` | ```json<br>{<br>  "updated": true<br>}<br>``` |
| DELETE | `/ptcontract/deletePtContract/:id`       | Deletes an existing PT contract by its ID.                       | `DELETE /ptcontract/deletePtContract/1` | ```json<br>{<br>  "deleted": true<br>}<br>``` |

## CHAT APIs (SUB_ROUTE+/chat)

| HTTP Method | Endpoint                                    | Description                                    | Body (for POST)                                                                                                                                                              |
|-------------|--------------------------------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GET         | `/nodejs/chat`                             | Returns the entire `Message` table             | N/A                                                                                                                                                                          |
| GET         | `/nodejs/chat/getAllChatsOfCustomerId/:id` | Returns all messages with `customer_id = id`   | N/A                                                                                                                                                                          |
| GET         | `/nodejs/chat/getChatMenuOfCustomerId/:id` | Returns all messages with `coach_id = id`      | N/A                                                                                                                                                                          |
| GET         | `/nodejs/chat/getChatMenuOfCoachId/:id`    | Returns JSON to display Coach's chat menu      | N/A                                                                                                                                                                          |
| GET         | `/nodejs/chat/getAllChatsOfCoachId/:id`    | Returns JSON to display Customer's chat menu   | N/A                                                                                                                                                                          |
| POST        | `/nodejs/chat/sendMessage`                 | Saves a new message to the database            | Xem o duoi |

Body cua /sendMessage

```json
{
  "coach_id_id": "7",
  "customer_id_id": "20",
  "content": "đây là tin nhắn từ nodejs nè",
  "extra_data": {
    "sendBy": "coach"
  }
}
```
