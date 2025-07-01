import React, { useState, useEffect } from "react";
import AdminHeader from "../../components/AdminHeader.jsx";
import AdminSidebar from "../../components/AdminSidebar.jsx";
import axios from "axios";
import "../../css/luxury-home.css";

function SettingsAdmin() {
  const [settings, setSettings] = useState({
    // Site Information
    siteName: "Walking Guide",
    siteDescription: "Trang web lên kế hoạch du lịch thông minh",
    siteLogo: "",
    siteFavicon: "",
    
    // Contact Information
    contactEmail: "contact@walkingguide.com",
    contactPhone: "+84 123 456 789",
    contactAddress: "Hà Nội, Việt Nam",
    
    // Social Media
    facebookUrl: "https://facebook.com/walkingguide",
    instagramUrl: "https://instagram.com/walkingguide",
    twitterUrl: "https://twitter.com/walkingguide",
    youtubeUrl: "https://youtube.com/walkingguide",
    
    // Footer Information
    footerDescription: "Walking Guide là một trang web giúp bạn lên kế hoạch du lịch, và tìm kiếm các địa điểm du lịch gần bạn.",
    footerCopyright: "© 2024 Walking Guide. Tất cả quyền được bảo lưu.",
    
    // System Settings
    maintenanceMode: false,
    allowRegistration: true,
    allowComments: true,
    maxFileSize: 5,
    
    // SEO Settings
    metaTitle: "Walking Guide - Lên kế hoạch du lịch thông minh",
    metaDescription: "Khám phá và lên kế hoạch du lịch thông minh với Walking Guide. Tìm kiếm địa điểm, tạo lộ trình cá nhân.",
    metaKeywords: "du lịch, lên kế hoạch, địa điểm, tour, việt nam"
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage (in real app, save to API)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      setSaveStatus({ type: 'success', message: 'Cài đặt đã được lưu thành công!' });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Có lỗi xảy ra khi lưu cài đặt!' });
    } finally {
      setLoading(false);
    }
  };

  const SettingsSection = ({ title, children, icon, color }) => (
    <div className="settings-section mb-5">
      <div className="section-header d-flex align-items-center mb-4">
        <div className="section-icon rounded-circle d-flex align-items-center justify-content-center me-3" 
             style={{width: 50, height: 50, background: `${color}15`, color: color}}>
          <i className={`bi ${icon} fs-4`}></i>
        </div>
        <h4 className="fw-bold mb-0" style={{color: '#1a5bb8'}}>{title}</h4>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );

  const FormField = ({ label, type = "text", value, onChange, placeholder, required = false, rows = 1 }) => (
    <div className="form-field mb-3">
      <label className="form-label fw-semibold" style={{color: '#223a5f'}}>
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={{borderRadius: '0.75rem', border: '2px solid #e9ecef', transition: 'border-color 0.3s'}}
        />
      ) : type === "checkbox" ? (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            style={{width: '1.2rem', height: '1.2rem'}}
          />
          <label className="form-check-label ms-2">{placeholder}</label>
        </div>
      ) : (
        <input
          type={type}
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{borderRadius: '0.75rem', border: '2px solid #e9ecef', transition: 'border-color 0.3s'}}
        />
      )}
    </div>
  );

  return (
    <div className="min-vh-100 d-flex flex-row" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #e3f0ff 100%)'}}>
      <AdminSidebar alwaysExpanded />
      <div className="flex-grow-1 d-flex flex-column luxury-home-container admin-dashboard" style={{marginLeft: 220, minHeight: '100vh', padding: 0}}>
        <AdminHeader />
        <main className="flex-grow-1 p-4">
          {/* Header */}
          <div className="settings-header text-center mb-5">
            <h1 className="display-5 fw-bold mb-2" style={{color: '#1a5bb8', textShadow: '0 2px 4px rgba(26, 91, 184, 0.1)'}}>
              Cài Đặt Hệ Thống
            </h1>
            <p className="lead mb-0" style={{color: '#223a5f'}}>
              Quản lý thông tin tổng quan, cài đặt trang web và cấu hình hệ thống
            </p>
          </div>

          {/* Save Status */}
          {saveStatus.message && (
            <div className={`alert alert-${saveStatus.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show mb-4`} 
                 style={{borderRadius: '1rem', border: 'none'}}>
              <i className={`bi ${saveStatus.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              {saveStatus.message}
              <button type="button" className="btn-close" onClick={() => setSaveStatus({ type: '', message: '' })}></button>
            </div>
          )}

          <div className="row">
            <div className="col-lg-8">
              {/* Site Information */}
              <SettingsSection title="Thông Tin Trang Web" icon="bi-globe" color="#3498db">
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Tên Trang Web"
                      value={settings.siteName}
                      onChange={(value) => handleInputChange('siteName', value)}
                      placeholder="Nhập tên trang web"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Email Liên Hệ"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(value) => handleInputChange('contactEmail', value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
                <FormField
                  label="Mô Tả Trang Web"
                  type="textarea"
                  value={settings.siteDescription}
                  onChange={(value) => handleInputChange('siteDescription', value)}
                  placeholder="Mô tả ngắn gọn về trang web"
                  rows={3}
                />
              </SettingsSection>

              {/* Contact Information */}
              <SettingsSection title="Thông Tin Liên Hệ" icon="bi-telephone" color="#e74c3c">
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Số Điện Thoại"
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(value) => handleInputChange('contactPhone', value)}
                      placeholder="+84 123 456 789"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Địa Chỉ"
                      value={settings.contactAddress}
                      onChange={(value) => handleInputChange('contactAddress', value)}
                      placeholder="Địa chỉ công ty"
                    />
                  </div>
                </div>
              </SettingsSection>

              {/* Social Media */}
              <SettingsSection title="Mạng Xã Hội" icon="bi-share" color="#f39c12">
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Facebook URL"
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(value) => handleInputChange('facebookUrl', value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="Instagram URL"
                      type="url"
                      value={settings.instagramUrl}
                      onChange={(value) => handleInputChange('instagramUrl', value)}
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <FormField
                      label="Twitter URL"
                      type="url"
                      value={settings.twitterUrl}
                      onChange={(value) => handleInputChange('twitterUrl', value)}
                      placeholder="https://twitter.com/yourpage"
                    />
                  </div>
                  <div className="col-md-6">
                    <FormField
                      label="YouTube URL"
                      type="url"
                      value={settings.youtubeUrl}
                      onChange={(value) => handleInputChange('youtubeUrl', value)}
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                </div>
              </SettingsSection>

              {/* Footer Information */}
              <SettingsSection title="Thông Tin Footer" icon="bi-info-circle" color="#27ae60">
                <FormField
                  label="Mô Tả Footer"
                  type="textarea"
                  value={settings.footerDescription}
                  onChange={(value) => handleInputChange('footerDescription', value)}
                  placeholder="Mô tả hiển thị trong footer"
                  rows={3}
                />
                <FormField
                  label="Bản Quyền"
                  value={settings.footerCopyright}
                  onChange={(value) => handleInputChange('footerCopyright', value)}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </SettingsSection>

              {/* SEO Settings */}
              <SettingsSection title="Cài Đặt SEO" icon="bi-search" color="#9b59b6">
                <FormField
                  label="Meta Title"
                  value={settings.metaTitle}
                  onChange={(value) => handleInputChange('metaTitle', value)}
                  placeholder="Tiêu đề trang web cho SEO"
                />
                <FormField
                  label="Meta Description"
                  type="textarea"
                  value={settings.metaDescription}
                  onChange={(value) => handleInputChange('metaDescription', value)}
                  placeholder="Mô tả trang web cho SEO"
                  rows={3}
                />
                <FormField
                  label="Meta Keywords"
                  value={settings.metaKeywords}
                  onChange={(value) => handleInputChange('metaKeywords', value)}
                  placeholder="Từ khóa SEO, phân cách bằng dấu phẩy"
                />
              </SettingsSection>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              {/* System Settings */}
              <SettingsSection title="Cài Đặt Hệ Thống" icon="bi-gear" color="#34495e">
                <FormField
                  label="Chế Độ Bảo Trì"
                  type="checkbox"
                  value={settings.maintenanceMode}
                  onChange={(value) => handleInputChange('maintenanceMode', value)}
                  placeholder="Bật chế độ bảo trì"
                />
                <FormField
                  label="Cho Phép Đăng Ký"
                  type="checkbox"
                  value={settings.allowRegistration}
                  onChange={(value) => handleInputChange('allowRegistration', value)}
                  placeholder="Cho phép người dùng đăng ký"
                />
                <FormField
                  label="Cho Phép Bình Luận"
                  type="checkbox"
                  value={settings.allowComments}
                  onChange={(value) => handleInputChange('allowComments', value)}
                  placeholder="Cho phép bình luận"
                />
                <FormField
                  label="Kích Thước File Tối Đa (MB)"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(value) => handleInputChange('maxFileSize', value)}
                  placeholder="5"
                />
              </SettingsSection>

              {/* Save Button */}
              <div className="save-section">
                <button
                  className="btn btn-primary btn-lg w-100"
                  onClick={handleSave}
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                    border: 'none',
                    borderRadius: '1rem',
                    padding: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Lưu Cài Đặt
                    </>
                  )}
                </button>
              </div>

              {/* Preview Card */}
              <div className="preview-card mt-4 shadow-lg border-0 rounded-4 p-4" style={{background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'}}>
                <h6 className="fw-bold mb-3" style={{color: '#1a5bb8'}}>
                  <i className="bi bi-eye me-2"></i>
                  Xem Trước Footer
                </h6>
                <div className="preview-content" style={{fontSize: '0.9rem'}}>
                  <p className="text-muted mb-2">{settings.footerDescription}</p>
                  <div className="social-links mb-2">
                    {settings.facebookUrl && <i className="bi bi-facebook me-2" style={{color: '#1877f2'}}></i>}
                    {settings.instagramUrl && <i className="bi bi-instagram me-2" style={{color: '#e4405f'}}></i>}
                    {settings.twitterUrl && <i className="bi bi-twitter me-2" style={{color: '#1da1f2'}}></i>}
                    {settings.youtubeUrl && <i className="bi bi-youtube me-2" style={{color: '#ff0000'}}></i>}
                  </div>
                  <p className="text-muted small mb-0">{settings.footerCopyright}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default SettingsAdmin; 