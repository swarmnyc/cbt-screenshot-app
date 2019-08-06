import { MongoClient, Db } from "mongodb"
import { Project } from "cbt-screenshot-common"

const DB_CONNECTION = process.env["REACT_APP_DB_CONNECTION"]

class DbClient {
  private db: Db

  constructor() {}

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      var mongoClient = new MongoClient(DB_CONNECTION, { useNewUrlParser: true })

      mongoClient.connect(err => {
        if (err) {
          console.error("DB Connect Failed", err)
          reject()
        } else {
          this.db = mongoClient.db()
          resolve()
        }
      })
    })
  }

  getProjects(): Promise<Project[]> {
    return this.db
      .collection("projects")
      .find()
      .toArray()
  }
}

var dbClient = new DbClient()
export default dbClient
