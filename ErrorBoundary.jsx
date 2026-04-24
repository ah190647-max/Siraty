import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>⚠️ حدث خطأ غير متوقع</h2>
          <p>{this.props.message || 'نعتذر، حدث خطأ أثناء تحميل هذا القسم. يرجى المحاولة مرة أخرى.'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', marginTop: 10 }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}