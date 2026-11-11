import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f4f2ee] flex flex-col items-center justify-center p-6 text-center font-body">
          <div className="max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg border border-red-200">
              !
            </div>
            <h2 className="font-heading font-bold text-lg text-[#063a69]">Terjadi Kendala Memuat Halaman</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {this.state.error?.message || 'Sistem mendeteksi kendala pada antarmuka. Silakan muat ulang halaman.'}
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem('humas_admin_user');
                  window.location.reload();
                }}
                className="w-full py-2.5 bg-[#063a69] hover:bg-[#042646] text-white text-xs font-heading font-bold uppercase rounded-xl transition-colors shadow-sm"
              >
                Muat Ulang Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
