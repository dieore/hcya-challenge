import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            textAlign="center"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom>
              Oops! Something went wrong.
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We're sorry for the inconvenience. You can try refreshing the page
              or go back to the homepage.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                onClick={this.handleRefresh}
                sx={{ mr: 2 }}
              >
                Refresh Page
              </Button>
              <Button variant="contained" onClick={this.goHome}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
