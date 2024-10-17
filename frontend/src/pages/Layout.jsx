// This is the main layout component for rendering each standard page with sidebars
// The main content of the page is rendered in Outlet
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidePanel } from '@/components/SidePanel';

function PageLayout() {
  return (
      <main className='flex justify-between '>
        <SidePanel/>
          <Outlet />

          {/* Place right-hand panel here instead of this div */}
          <div className='h-screen bg-gray-200 w-56'>
            Right Panel Goes Here!!!
          </div>

      </main>
  );
}

export default PageLayout;
