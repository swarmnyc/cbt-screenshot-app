import dotenv from "dotenv"
import SQS from "aws-sdk/clients/sqs"

import { MongoClient } from "mongodb"
import { Page, Task, TaskType, TaskState } from "../common/types"

dotenv.config()

var mongoClient = new MongoClient(process.env["DB_CONN"], { useNewUrlParser: true })
mongoClient.connect(async error => {
  var db = mongoClient.db()
  var pageCollection = db.collection<Page>("pages")
  var tasksCollection = db.collection<Task>("tasks")

  var pages = await pageCollection
    .find()
    .sort({ path: 1 })
    .limit(3)
    .toArray()

  await Promise.all(
    pages.map(page =>
      tasksCollection.insertMany([
        {
          projectId: page.projectId,
          pageId: page._id,
          type: TaskType.Desktop,
          state: TaskState.Pending,
          createdAt: new Date()
        },
        {
          projectId: page.projectId,
          pageId: page._id,
          type: TaskType.Mobile,
          state: TaskState.Pending,
          createdAt: new Date()
        }
      ])
    )
  )
})