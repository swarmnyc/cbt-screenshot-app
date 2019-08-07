import React from "react"

import { Box, CircularProgress, Typography } from "@material-ui/core"

export default function Loading(): React.ReactElement {
  return (
    <Box className="screen-center" textAlign="center">
      <CircularProgress />

      <Typography variant="h5" className="mt-2">
        LOADING
      </Typography>
    </Box>
  )
}
