import React from "react"
import { Box, Typography } from "@material-ui/core"
import { ErrorOutline } from "@material-ui/icons"

export default function Error(): React.ReactElement {
  return (
    <Box className="screen-center" textAlign="center">
      <ErrorOutline color="error" style={{ fontSize: 64 }} />
      <Typography variant="h5" className="mt-2">
        Error
      </Typography>
    </Box>
  )
}
