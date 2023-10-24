import React from 'react';

type ErrorBoundaryProps = { children: React.ReactNode };

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  render() {
    return this.props.children;
  }
}
