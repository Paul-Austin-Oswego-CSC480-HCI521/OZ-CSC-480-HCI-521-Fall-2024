// This is the main layout component for rendering each standard page with sidebars
// The main content of the page is rendered in Outlet
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidePanel } from '@/components/SidePanel';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import logoWhite from '@/src/assets/logo-white.svg'


function PageLayout() {
  return (
      <div>
          <header className="sticky z-50 left-0 right-0 top-0">
             <div className="flex items-center bg-blueHighlight relative z-10">
                  <a href="/" title='Home' className="flex items-center gap-3 py-4 pl-4">
                    <img className="p-0.5" width={32} height={32} src={logoWhite} alt=""></img>
                    <h1 className="text-2xl text-white font-bold">CheckMate</h1>
                  </a>
              </div>
              <SidePanel/>              
          </header>
          <main className='ml-[222px]'>
            <Drawer direction={"right"}>
                <Outlet />
            </Drawer>
        </main>
      </div>

  );
}

export default PageLayout;
