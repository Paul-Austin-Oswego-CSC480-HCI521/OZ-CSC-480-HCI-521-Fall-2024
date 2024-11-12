// This is the main layout component for rendering each standard page with sidebars
// The main content of the page is rendered in Outlet
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidePanel } from '@/components/SidePanel';
import { Drawer, DrawerContent } from '@/components/ui/drawer';


function PageLayout() {
  return (
      <div>
          <header className="sticky z-50 left-0 right-0 top-0">
             <div className="flex items-center bg-blueHighlight">
                  <a href="/" title='Home' className="flex items-center gap-4 py-4 pl-4">
                      {/* Replace with logo */}
                  <div className="bg-white w-8 h-8 rounded-full"></div>
                  <h1 className="text-2xl text-white font-bold">CheckMate</h1>
                  </a>
              </div>
          </header>
          <main className='flex justify-between '>
          <SidePanel/>
          <Drawer direction={"right"}>
            <Outlet />
          </Drawer>
        </main>
      </div>

  );
}

export default PageLayout;
