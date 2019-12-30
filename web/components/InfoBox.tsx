import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  title: { marginRight: theme.spacing(4) }
}));

export default function InfoBox({
  title,
  value
}: {
  title: string;
  value: string;
}) {
  const classes = useStyles({});

  return (
    <Card>
      <CardContent>
        <Typography variant="overline" className={classes.title}>
          {title}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
}
