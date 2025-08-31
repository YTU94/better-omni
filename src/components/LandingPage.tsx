import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // 检查用户是否已完成引导页
    const guideCompleted = localStorage.getItem('quickTabLauncherGuideCompleted');
    if (guideCompleted) {
      navigate('/chat');
    } else {
      // 如果用户未完成引导页，先显示引导页
      window.location.reload();
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1>Better Omni</h1>
        <p>您的智能助手，集成多种AI能力</p>
        <Button type="primary" size="large" onClick={handleStart}>
          开始使用
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;