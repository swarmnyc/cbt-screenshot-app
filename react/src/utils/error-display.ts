import Noty from "noty"

export function showErrorMessage(error: any) {
  new Noty({
    theme: "nest",
    type: "error",
    layout: "topRight",
    timeout: 2000,
    text: `Saved Failed, see DevTools for details`
  }).show()
}
