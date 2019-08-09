import { MongoClient, Db, Collection, ObjectId } from "mongodb"
import { Project, Page, InitializeResult } from "cbt-screenshot-common"

class DbClient {
  private connectionString: string
  private db: Db
  private projectCollection: Collection
  private pageCollection: Collection

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
            this.projectCollection = this.db.collection("projects")
            this.pageCollection = this.db.collection("pages")

            resolve()
          }
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  getProjects(): Promise<Project[]> {
    return this.projectCollection.find().toArray()
  }

  getPages(): Promise<Page[]> {
    return this.pageCollection.find().toArray()
  }

  createProject(projectName: string): Promise<Project> {
    return new Promise((resolve, reject) => {
      this.projectCollection.insert(
        {
          name: projectName
        },
        (error, result) => {
          if (error) {
            reject(error)
          } else {
            resolve(this.objectIdToString(result.ops[0]))
          }
        }
      )
    })
  }

  updateProjectProperty(projectId: string, prop: string, value: any): Promise<any> {
    var id = ObjectId.createFromHexString(projectId)
    return this.projectCollection
      .updateOne(
        {
          _id: id
        },
        {
          $set: {
            [prop]: value
          }
        }
      )
      .then(() => {})
  }

  private async initData(): Promise<InitializeResult> {
    var projects = await this.getProjects()
    var pages = await this.getPages()

    this.forEachObjectIdToString(projects)
    this.forEachObjectIdToString(pages, "projectId")

    return { projects, pages }
  }

  private objectIdToString(target: any, ...props: string[]): any {
    target._id = target._id.toString()

    if (props) {
      for (const name of props) {
        target[name] = target[name].toString()
      }
    }

    return target
  }

  private forEachObjectIdToString(targets: any[], ...props: string[]): any[] {
    targets.forEach(target => {
      this.objectIdToString(target, ...props)
    })

    return targets
  }
}

var dbClient = new DbClient()
export default dbClient
