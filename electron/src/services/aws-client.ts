import Lambda from "aws-sdk/clients/lambda"
import { AwsConfig } from "cbt-screenshot-common"

export class AwsClient {
  private client: Lambda

  constructor(config: AwsConfig) {
    this.client = new Lambda({
      region: config.awsRegion,
      accessKeyId: config.awsKey,
      secretAccessKey: config.awsKeySecret
    })
  }

  invokeNewLambda(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.invoke(
        {
          FunctionName: "cbt-screenshot-task",
          InvocationType: "Event"
        },
        error => {
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
