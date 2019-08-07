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
    return Swal.fire({
      title: "Place enter the connection string",
      input: "text",
      showCancelButton: cancelable
    }).then(result => {
      if (result.dismiss) return

      var connStr = result.value
      localStorage.setItem("DbConnectionString", connStr)
      return connStr
    })
  }
}

var settingService = new SettingService()

export default settingService
