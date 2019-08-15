import dotenv from "dotenv"
import SQS from "aws-sdk/clients/sqs"

dotenv.config()

var sqs = new SQS({
  region: "us-east-1",
  accessKeyId: process.env["AWS_ACCESS_KEY_ID"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"]
})

// sqs.receiveMessage(
//   {
//     QueueUrl: "https://sqs.us-east-1.amazonaws.com/348054937474/csa",
//     MaxNumberOfMessages: 10,
//     WaitTimeSeconds: 20
//   },
//   (err, data) => {
//     console.log("receiveMessage", err, data)

//     sqs.deleteMessage(
//       {
//         QueueUrl: "https://sqs.us-east-1.amazonaws.com/348054937474/csa",
//         ReceiptHandle: data.Messages[0].ReceiptHandle
//       },
//       () => {}
//     )
//   }
// )

for (let index = 0; index < 10; index++) {
  sqs.sendMessage(
    {
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/348054937474/csa",
      MessageBody: "TEST" + index,
      DelaySeconds: index * 10
    },
    (err, result) => {
      console.log("TEST", index, err, result)
    }
  )
}