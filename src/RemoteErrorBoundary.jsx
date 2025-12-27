import React from "react";

export class RemoteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error(
      `Remote ${this.props.name} failed to load`,
      error,
      info
    );
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ color: "red" }}>
          <h2>❌ {this.props.name} failed to load</h2>
          <pre>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
