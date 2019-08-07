import { MongoClient, Db } from "mongodb"
import { Project, Page, InitializeResult } from "cbt-screenshot-common"

class DbClient {
  private connectionString: string
  private db: Db

  constructor() {}

  init(connectionString: string): Promise<InitializeResult> {
    return this.initConnection(connectionString).then(() => this.initData())
  }

  private initConnection(connectionString: string) {
    if (this.db == null || this.connectionString != connectionString) {
      this.connectionString = connectionString

      return new Promise((resolve, reject) => {
        var mongoClient = new MongoClient(connectionString, { useNewUrlParser: true })

        mongoClient.connect(async error => {
          if (error) {
            console.error("DB Connect Failed", error)
            reject(error)
          } else {
            console.log("DB Connected")

            this.db = mongoClient.db()
            resolve()
          }
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  private async initData(): Promise<InitializeResult> {
    var projects = await this.getProjects()
    var pages = await this.getPages()

    // change ObjectId to String
    projects.forEach(p => {
      p._id = p._id.toString()
    })

    pages.forEach(p => {
      p._id = p._id.toString()
      p.projectId = p.projectId.toString()
    })

    return { projects, pages }
  }

  getProjects(): Promise<Project[]> {
    return this.db
      .collection("projects")
      .find()
      .toArray()
  }

  getPages(): Promise<Page[]> {
    return this.db
      .collection("pages")
      .find()
      .toArray()
  }
}

var dbClient = new DbClient()
export default dbClient
