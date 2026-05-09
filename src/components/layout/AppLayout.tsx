import React from 'react';
import { Header } from './Header';
import { LeftPanel } from '@/components/left/LeftPanel';
import { CenterPanel } from '@/components/center/CenterPanel';
import { RightPanel } from '@/components/right/RightPanel';

export const AppLayout = React.memo(function AppLayout() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <Header />
      <div
        style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
    </div>
  );
});
