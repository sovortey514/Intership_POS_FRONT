import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
// import { WorkspacesPopover } from '../components/workspaces-popover';

// import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
    children?: {
      path: string;
      title: string;
      icon: React.ReactNode;
    }[];
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  // workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  // workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleSubMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Logo />
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <div key={item.title}>
                  <ListItem disableGutters disablePadding>
                    <ListItemButton
                      disableGutters
                      component={RouterLink}
                      href={item.path}
                      onClick={() => item.children && toggleSubMenu(item.title)}
                      sx={{
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: 'var(--layout-nav-item-color)',
                        minHeight: 'var(--layout-nav-item-height)',
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          bgcolor: 'var(--layout-nav-item-active-bg)',
                          color: 'var(--layout-nav-item-active-color)',
                          '&:hover': {
                            bgcolor: 'var(--layout-nav-item-hover-bg)',
                          },
                        }),
                      }}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component="span" flexGrow={1}>
                        {item.title}
                      </Box>

                      {item.children && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {openMenu === item.title ? '▲' : '▼'}
                        </Box>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Render submenu if it's open */}
                  {item.children && openMenu === item.title && (
                    <Box component="ul" sx={{ pl: 4 }}>
                      {item.children.map((child) => {
                        const isChildActive = child.path === pathname;
                        return (
                          <ListItem key={child.title} disableGutters disablePadding>
                            <ListItemButton
                              disableGutters
                              component={RouterLink}
                              href={child.path}
                              sx={{
                                pl: 2,
                                py: 1,
                                typography: 'body2',
                                fontWeight: isChildActive
                                  ? 'fontWeightSemiBold'
                                  : 'fontWeightMedium',
                                color: isChildActive
                                  ? 'var(--layout-nav-item-active-color)'
                                  : 'var(--layout-nav-item-color)',
                                '&:hover': {
                                  bgcolor: 'var(--layout-nav-item-hover-bg)',
                                },
                                display: 'flex',
                                alignItems: 'center', // Ensures icon and title are vertically aligned
                              }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  width: 16,
                                  height: 16,
                                  mr: 2,
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  '&:hover': {
                                    transform: 'scale(1.1)', // Adds a subtle scale effect on hover
                                    transition: 'transform 0.2s ease', // Smooth hover transition
                                  },
                                }}
                              >
                                {/* Space icon with custom style */}
                                {child.icon}
                              </Box>

                              <Box
                                component="span"
                                flexGrow={1}
                                sx={{
                                  fontSize: '0.875rem',
                                  fontWeight: isChildActive ? 'bold' : 'normal',
                                }}
                              >
                                {/* Title of the child */}
                                {child.title}
                              </Box>
                            </ListItemButton>
                          </ListItem>
                        );
                      })}
                    </Box>
                  )}
                </div>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
