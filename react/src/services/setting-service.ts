import Swal from "sweetalert2"

class SettingService {
  getDbConnectionString(): Promise<string> {
    var connStr = localStorage.getItem("DbConnectionString")
    if (connStr) {
      return Promise.resolve(connStr)
    } else {
      return this.inputDbConnectionString(false)
    }
  }

  inputDbConnectionString(cancelable: boolean): Promise<string> {
    var connStr = localStorage.getItem("DbConnectionString") || ""

    return Swal.fire({
      title: "Place enter the database connection string",
      text: 'It is like "mongodb://<user>:<password>@<host>/<database>"',
      width: 800,
      input: "text",
      inputValue: connStr,
      showCancelButton: cancelable,
      allowOutsideClick: false
    }).then(result => {
      if (result.dismiss) {
        return null
      }

      connStr = result.value

      if (!/^mongodb/i.test(connStr)) {
        Swal.fire({
          type: "error",
          title: 'The connection string must start with "mongodb"'
        })
        return null
      }

      localStorage.setItem("DbConnectionString", connStr)
      return connStr
    })
  }
}

var settingService = new SettingService()

export default settingService
