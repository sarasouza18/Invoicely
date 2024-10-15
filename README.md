
# 📄 **Invoicely** 

**Invoicely** is a serverless application designed to process invoices (PDFs or images) uploaded to AWS S3. It extracts important data like **CNPJ**, **total value**, and **items** using AWS **Textract**, stores the extracted information in **DynamoDB**, and notifies the user upon success or failure via **SNS**. Additionally, the system includes robust error handling and retry mechanisms using **SQS** and **DLQ (Dead Letter Queue)** to ensure reliable processing.

## ✨ **Features**
- 🧾 **Extracts data** (CNPJ, total value, items) from invoices using **Textract**.
- 🗄️ **Stores extracted data** in **DynamoDB**.
- 🔄 **Retry mechanism** with **SQS** to reprocess failed files automatically.
- ⚠️ **Dead Letter Queue** for failed messages after max retry attempts.
- 📧 **Notifications via SNS** upon successful or failed processing.
- 🏷️ **Tracks status** of each invoice processing (processing, completed, failed) in DynamoDB.
- 🖥️ **Fully containerized** using **Docker** for local development.

---

## 🛠️ **Technologies Used**

### 1. **AWS S3** - Cloud storage for invoice files
   - **Why?** S3 provides scalable storage to handle uploads of large volumes of invoices (PDFs/images) with secure access.
  
### 2. **AWS Textract** - Extracts text from documents
   - **Why?** Textract is ideal for extracting structured and unstructured data from invoices, eliminating the need for manual input.

### 3. **AWS DynamoDB** - NoSQL database for storing extracted data
   - **Why?** DynamoDB offers scalable, serverless data storage with fast access, which fits well in this event-driven architecture.

### 4. **AWS SQS (Simple Queue Service)** - Manages event-driven processing
   - **Why?** SQS queues allow us to decouple and asynchronously process invoice uploads. It also enables a retry mechanism in case of failure.

### 5. **AWS DLQ (Dead Letter Queue)** - For failed invoice processing
   - **Why?** DLQ ensures that after several retry attempts, failed messages are stored in a separate queue for further inspection.

### 6. **AWS SNS (Simple Notification Service)** - User notifications
   - **Why?** SNS enables real-time notifications to users or external systems about the processing status of invoices (success or failure).

### 7. **Docker** - Containerization for local development
   - **Why?** Docker allows the application to run consistently across different environments by packaging all dependencies in containers.

---

## 🚀 **Getting Started**

### **Prerequisites**
Ensure you have the following installed on your machine:
- **Node.js** (v14+)
- **AWS CLI** (configured with appropriate credentials)
- **Docker** (for running the app locally)
- **npm** (Node package manager)

---

### **Installation Steps**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/invoicely.git
   cd invoicely
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up your environment variables**:
   Create a `.env` file in the root of the project and configure the following:
   ```bash
   AWS_REGION=your-region
   DYNAMODB_TABLE_NAME=your-dynamodb-table
   S3_BUCKET_NAME=your-s3-bucket
   SNS_TOPIC_ARN=your-sns-topic
   ```

4. **Running locally with Docker**:
   Build and run the Docker container:
   ```bash
   docker-compose up --build
   ```

---

### **How to Use the Application**

1. **Upload an invoice (PDF/image) to S3**:
   - You can manually upload a file to the **S3 bucket** you configured in your `.env` file or use a tool like **Postman** to make a POST request to the upload route:
     ```bash
     POST /api/upload
     ```

2. **Automatic processing**:
   - The file will automatically trigger the **SQS queue**, which will invoke the **Lambda** function to extract data using **Textract**.
   - Once the data is extracted, it is saved in **DynamoDB**.
   - **SNS** will notify you upon success or failure.

3. **Retry mechanism**:
   - If a failure occurs during processing (e.g., a Textract failure), **SQS** will retry the process.
   - After a maximum of 3 attempts, the message will be sent to the **Dead Letter Queue (DLQ)** for further inspection.

4. **Monitoring status**:
   - The status of each file (`processing`, `completed`, or `failed`) can be tracked in the **DynamoDB table**.

---

### **Useful Commands**

- **Build the Docker image**:
  ```bash
  docker-compose build
  ```

- **Start the application**:
  ```bash
  docker-compose up
  ```

- **Run tests** (for services, controllers, etc.):
  ```bash
  npm test
  ```

---

## 🧑‍💻 **Development Details**

- **Architecture**: This project follows a fully serverless architecture leveraging **AWS Lambda**, **S3**, **DynamoDB**, **Textract**, **SQS**, and **SNS** to create an event-driven, scalable system for invoice processing.
  
- **Clean Code**: The project adheres to clean code principles, ensuring maintainability and readability.
  
- **Error Handling**: The retry mechanism with **SQS** ensures that errors are retried up to 3 times before being moved to the **DLQ** for manual inspection.

---

## 🌐 **Deployment**

You can deploy this application using **AWS Lambda** and **AWS S3** via **AWS CLI** or using infrastructure-as-code tools such as **Terraform** or **AWS CloudFormation**.

Here’s an example of how you might deploy the Lambda function using AWS CLI:
```bash
aws lambda create-function \
    --function-name InvoicelyLambda \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs14.x \
    --role arn:aws:iam::YOUR_ACCOUNT_ID:role/service-role/YOUR_ROLE_NAME
```

---

### 🎯 **Future Enhancements**
- 🔍 **Advanced Error Handling**: Integration with **AWS CloudWatch Alarms** to monitor processing failures in real-time.
- 🚀 **Performance Improvements**: Adding caching layers using **Redis** for faster access to previously processed invoices.
- 📊 **Data Analytics**: Build a dashboard for viewing the status and history of processed invoices using **Amazon QuickSight**.
