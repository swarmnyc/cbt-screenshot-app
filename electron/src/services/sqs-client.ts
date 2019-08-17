import SQS from "aws-sdk/clients/sqs"
import { AwsSqsConfig } from "cbt-screenshot-common"

export class SqsClient {
  private client: SQS

  constructor(private config: AwsSqsConfig) {
    this.client = new SQS({
      region: config.awsRegion,
      accessKeyId: config.awsKey,
      secretAccessKey: config.awsKeySecret
    })
  }

  send(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.sendMessage(
        {
          QueueUrl: this.config.awsSqsUrl,
          MessageBody: message
        },
        (error) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        }
      )
    })
  }
}
