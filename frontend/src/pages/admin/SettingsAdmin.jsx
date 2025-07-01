import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import "../../css/luxury-home.css";

function SettingsAdmin() {
  const defaultSettings = {
    footerDescription: "Walking Guide là một trang web giúp bạn lên kế hoạch du lịch, và tìm kiếm các địa điểm du lịch gần bạn.",
    footerCopyright: `© ${new Date().getFullYear()} Walking Guide. Tất cả quyền được bảo lưu.`,
    contactEmail: "info@walkingguide.com",
    contactPhone: "+1 234 567 890",
    contactAddress: "Hà Nội, Việt Nam",
    facebookUrl: "https://facebook.com/walkingguide",
    instagramUrl: "https://instagram.com/walkingguide",
    twitterUrl: "https://twitter.com/walkingguide",
    youtubeUrl: "https://youtube.com/walkingguide"
  };
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus({ type: '', message: '' });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      setSaveStatus({ type: 'success', message: 'Cài đặt footer đã được lưu thành công!' });
      setTimeout(() => setSaveStatus({ type: '', message: '' }), 2000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Có lỗi xảy ra khi lưu cài đặt!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-row" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%)'}}>
      <AdminSidebar alwaysExpanded />
      <div className="flex-grow-1 d-flex flex-column luxury-home-container admin-dashboard" style={{marginLeft: 220, minHeight: '100vh', padding: 0}}>
        <AdminHeader />
        <div style={{height: '100vh', overflow: 'auto'}}>
          <div style={{minHeight: 64, marginBottom: 16}}>
            {saveStatus.message && (
              <div className={`alert alert-${saveStatus.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show mb-4`} style={{borderRadius: '1rem', border: 'none'}}>
                {saveStatus.message}
                <button type="button" className="btn-close" onClick={() => setSaveStatus({ type: '', message: '' })}></button>
              </div>
            )}
          </div>
          <main className="flex-grow-1 p-4">
            <div className="container">
              <h2 className="fw-bold mb-4" style={{color: '#1a5bb8'}}>Cài đặt</h2>
              <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Mô tả Footer</label>
                  <textarea
                    className="form-control"
                    value={settings.footerDescription}
                    onChange={e => handleInputChange('footerDescription', e.target.value)}
                    placeholder="Mô tả hiển thị trong footer"
                    rows={3}
                    style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Bản quyền</label>
                  <input
                    className="form-control"
                    value={settings.footerCopyright}
                    onChange={e => handleInputChange('footerCopyright', e.target.value)}
                    placeholder="© 2024 Walking Guide. Tất cả quyền được bảo lưu."
                    style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                  />
                </div>
                <hr className="my-4" />
                <h5 className="fw-bold mb-3" style={{color: '#1a5bb8'}}>Thông tin liên hệ & Mạng xã hội</h5>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Email</label>
                    <input
                      className="form-control"
                      value={settings.contactEmail}
                      onChange={e => handleInputChange('contactEmail', e.target.value)}
                      placeholder="info@walkingguide.com"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Số điện thoại</label>
                    <input
                      className="form-control"
                      value={settings.contactPhone}
                      onChange={e => handleInputChange('contactPhone', e.target.value)}
                      placeholder="+1 234 567 890"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Địa chỉ</label>
                    <input
                      className="form-control"
                      value={settings.contactAddress}
                      onChange={e => handleInputChange('contactAddress', e.target.value)}
                      placeholder="Hà Nội, Việt Nam"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Facebook URL</label>
                    <input
                      className="form-control"
                      value={settings.facebookUrl}
                      onChange={e => handleInputChange('facebookUrl', e.target.value)}
                      placeholder="https://facebook.com/walkingguide"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Instagram URL</label>
                    <input
                      className="form-control"
                      value={settings.instagramUrl}
                      onChange={e => handleInputChange('instagramUrl', e.target.value)}
                      placeholder="https://instagram.com/walkingguide"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>Twitter URL</label>
                    <input
                      className="form-control"
                      value={settings.twitterUrl}
                      onChange={e => handleInputChange('twitterUrl', e.target.value)}
                      placeholder="https://twitter.com/walkingguide"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{color: '#223a5f'}}>YouTube URL</label>
                    <input
                      className="form-control"
                      value={settings.youtubeUrl}
                      onChange={e => handleInputChange('youtubeUrl', e.target.value)}
                      placeholder="https://youtube.com/walkingguide"
                      style={{borderRadius: '0.75rem', border: '2px solid #e9ecef'}}
                    />
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-lg mt-2"
                  onClick={handleSave}
                  disabled={loading}
                  style={{borderRadius: '1rem', fontWeight: 600, minWidth: 180}}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
              <div className="card shadow-sm border-0 rounded-4 p-4">
                <h6 className="fw-bold mb-3" style={{color: '#1a5bb8'}}>
                  <i className="bi bi-eye me-2"></i>
                  Xem trước Footer
                </h6>
                <div className="preview-content" style={{fontSize: '1rem'}}>
                  <p className="text-muted mb-2">{settings.footerDescription}</p>
                  <p className="text-muted small mb-0">{settings.footerCopyright}</p>
                  <div className="mt-2">
                    <span className="me-3"><i className="bi bi-envelope me-1"></i>{settings.contactEmail}</span>
                    <span className="me-3"><i className="bi bi-telephone me-1"></i>{settings.contactPhone}</span>
                    <span className="me-3"><i className="bi bi-geo-alt me-1"></i>{settings.contactAddress}</span>
                  </div>
                  <div className="mt-2">
                    {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="me-2"><i className="bi bi-facebook"></i></a>}
                    {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="me-2"><i className="bi bi-instagram"></i></a>}
                    {settings.twitterUrl && <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="me-2"><i className="bi bi-twitter-x"></i></a>}
                    {settings.youtubeUrl && <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="me-2"><i className="bi bi-youtube"></i></a>}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default SettingsAdmin; 