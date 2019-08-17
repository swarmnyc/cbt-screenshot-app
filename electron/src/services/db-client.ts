import { MongoClient, Db, Collection, ObjectId } from "mongodb"
import { Project, Page, InitializeResult, Task, TaskState, TaskType } from "cbt-screenshot-common"

class DbClient {
  private connectionString: string
  private db: Db
  private projectCollection: Collection<Project>
  private pageCollection: Collection<Page>
  private taskCollection: Collection<Task>

  constructor() {}

  init(connectionString: string): Promise<InitializeResult> {
    return this.initConnection(connectionString).then(async () => {
      var projects = await this.getProjects()
      var pages = await this.getPages()

      return { projects, pages }
    })
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
            this.taskCollection = this.db.collection("tasks")

            resolve()
          }
        })
      })
    } else {
      return Promise.resolve()
    }
  }

  getProjects(): Promise<Project[]> {
    return this.projectCollection
      .find()
      .sort({ name: 1 })
      .toArray()
      .then(result => this.forEachObjectIdToString(result))
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

  updateProjectProperty(projectId: string, prop: string, value: any): Promise<void> {
    var _id = ObjectId.createFromHexString(projectId)
    return this.projectCollection
      .updateOne(
        {
          _id
        },
        {
          $set: {
            [prop]: value
          }
        }
      )
      .then(() => {})
  }

  async deleteProject(projectId: string): Promise<void> {
    var id = ObjectId.createFromHexString(projectId)
    await this.projectCollection.deleteOne({ _id: id })
    await this.pageCollection.deleteMany({ projectId: id })
  }

  getPages(): Promise<Page[]> {
    return this.pageCollection
      .find()
      .sort({ path: 1 })
      .toArray()
      .then(result => this.forEachObjectIdToString(result, "projectId"))
  }

  createPage(page: Page): Promise<void> {
    page._id = ObjectId.createFromHexString(page._id)
    page.projectId = ObjectId.createFromHexString(page.projectId)

    if (page.path) {
      page.path = page.path.toLowerCase()
    }

    return new Promise((resolve, reject) => {
      this.pageCollection.insert(page, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  updatePageProperty(pageId: string, prop: string, value: any): Promise<void> {
    var _id = ObjectId.createFromHexString(pageId)
    if (prop == "page" && typeof value == "string") {
      value = value.toLowerCase()
    }

    return this.pageCollection
      .updateOne(
        {
          _id
        },
        {
          $set: {
            [prop]: value
          }
        }
      )
      .then(() => {})
  }

  async deletePage(pageId: string): Promise<void> {
    var id = ObjectId.createFromHexString(pageId)
    await this.pageCollection.deleteOne({ _id: id })
  }

  async bulkEditPages(inserts: Page[], updates: Page[]): Promise<void> {
    if (inserts && inserts.length > 0) {
      inserts.forEach(page => {
        page._id = ObjectId.createFromHexString(page._id)
        page.projectId = ObjectId.createFromHexString(page.projectId)
      })

      await this.pageCollection.insertMany(inserts)
    }

    if (updates && updates.length > 0) {
      await Promise.all(
        updates.map(page => {
          var _id = ObjectId.createFromHexString(page._id)
          var { name, folder, mobileResultId, desktopResultId } = page

          return this.pageCollection.updateOne(
            {
              _id
            },
            {
              $set: {
                name,
                folder,
                mobileResultId,
                desktopResultId
              }
            }
          )
        })
      )
    }
  }

  async hasExecutingTask(): Promise<boolean> {
    var tasks = await this.taskCollection
      .find({
        state: TaskState.Executing
      })
      .toArray()

    return tasks.filter(f => Date.now() - f.executedAt.valueOf() < 600_000).length != 0
  }

  getTasks(): Promise<Task[]> {
    return this.taskCollection
      .find({ state: { $in: [TaskState.Pending, TaskState.Executing, TaskState.Error] } })
      .sort({ path: 1 })
      .toArray()
      .then(result => this.forEachObjectIdToString(result, "projectId", "pageId"))
  }

  async cancelTask(taskId: string): Promise<void> {
    var _id = ObjectId.createFromHexString(taskId)

    await this.taskCollection.updateOne(
      { _id },
      {
        $set: {
          state: TaskState.Canceled,
          finishedAt: new Date()
        }
      }
    )
  }

  async archiveErrorTask(taskId: string): Promise<void> {
    var _id = ObjectId.createFromHexString(taskId)

    await this.taskCollection.updateOne(
      { _id },
      {
        $set: {
          state: TaskState.ErrorArchived
        }
      }
    )
  }

  async newTasks(project: Project, pageIds: string[]): Promise<void> {
    var projectId = ObjectId.createFromHexString(project._id)

    await Promise.all(
      pageIds.map(id => {
        var pageId = ObjectId.createFromHexString(id)

        return this.taskCollection.insertMany([
          {
            projectId,
            pageId,
            type: TaskType.Desktop,
            state: TaskState.Pending,
            createdAt: new Date()
          },
          {
            projectId,
            pageId,
            type: TaskType.Mobile,
            state: TaskState.Pending,
            createdAt: new Date()
          }
        ])
      })
    )
  }

  private objectIdToString<T>(target: any, ...props: (keyof T)[]): T {
    target._id = target._id.toString()

    if (props) {
      for (const name of props) {
        target[name] = target[name].toString()
      }
    }

    return target
  }

  private forEachObjectIdToString<T>(targets: any[], ...props: (keyof T)[]): T[] {
    targets.forEach(target => {
      this.objectIdToString(target, ...props)
    })

    return targets
  }
}

var dbClient = new DbClient()
export default dbClient
