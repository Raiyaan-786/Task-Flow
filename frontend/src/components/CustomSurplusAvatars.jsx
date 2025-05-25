import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export default function CustomSurplusAvatars() {
  return (
    <AvatarGroup
    renderSurplus={(surplus) => <span>+{surplus.toString()[0]}k</span>}
    total={4251}
    >
      <Avatar alt="Remy Sharp" src="demoimg2.jpeg" />
      <Avatar alt="Travis Howard" src="demoimg3.jpeg" />
      <Avatar alt="Agnes Walker" src="demoimg4.jpeg" />
      <Avatar alt="Trevor Henderson" src="demoimg5.jpeg" />
    </AvatarGroup>
  );
}